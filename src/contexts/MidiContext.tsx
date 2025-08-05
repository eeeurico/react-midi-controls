import React, { createContext, useContext, useCallback, useRef } from "react"
import type { ReactNode } from "react"
import { useMidi } from "../hooks/useMidi"

interface MidiContextType {
  midiAccess: any
  devices: any[]
  selectedDevice: any
  isConnected: boolean
  error: string | null
  connectToDevice: (deviceId: string) => boolean
  disconnect: () => void
  addMessageHandler: (handler: (event: any) => void) => () => void
}

const MidiContext = createContext<MidiContextType | null>(null)

interface MidiProviderProps {
  children: ReactNode
}

export const MidiProvider: React.FC<MidiProviderProps> = ({ children }) => {
  const midiData = useMidi()
  const handlersRef = useRef<Set<(event: any) => void>>(new Set())

  const addMessageHandler = useCallback(
    (handler: (event: any) => void) => {
      handlersRef.current.add(handler)

      // Set up the main message handler if we have a device
      if (midiData.selectedDevice && midiData.isConnected) {
        midiData.selectedDevice.onmidimessage = (event: any) => {
          handlersRef.current.forEach((h) => h(event))
        }
      }

      // Return cleanup function
      return () => {
        handlersRef.current.delete(handler)

        // If no more handlers, clean up
        if (handlersRef.current.size === 0 && midiData.selectedDevice) {
          midiData.selectedDevice.onmidimessage = null
        }
      }
    },
    [midiData.selectedDevice, midiData.isConnected]
  )

  // Update the main handler when device changes
  React.useEffect(() => {
    if (
      midiData.selectedDevice &&
      midiData.isConnected &&
      handlersRef.current.size > 0
    ) {
      midiData.selectedDevice.onmidimessage = (event: any) => {
        handlersRef.current.forEach((h) => h(event))
      }
    }
  }, [midiData.selectedDevice, midiData.isConnected])

  const contextValue = {
    ...midiData,
    addMessageHandler,
  }

  return (
    <MidiContext.Provider value={contextValue}>{children}</MidiContext.Provider>
  )
}

export const useMidiContext = () => {
  const context = useContext(MidiContext)
  if (!context) {
    throw new Error("useMidiContext must be used within a MidiProvider")
  }
  return context
}
