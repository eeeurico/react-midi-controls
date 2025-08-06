import React, {
  createContext,
  useContext,
  useCallback,
  useRef,
  useEffect,
} from "react"
import type { ReactNode } from "react"
import {
  useMidiDevices,
  type UseMidiDevicesResult,
} from "../hooks/useMidiDevices"

interface MidiContextType extends UseMidiDevicesResult {
  addMessageHandler: (handler: (event: any) => void) => () => void
}

const MidiContext = createContext<MidiContextType | null>(null)

interface MidiProviderProps {
  children: ReactNode
  autoSelectFirstDevice?: boolean
}

export const MidiProvider: React.FC<MidiProviderProps> = ({
  children,
  autoSelectFirstDevice = true,
}) => {
  const midiDevices = useMidiDevices(autoSelectFirstDevice)
  const handlersRef = useRef<Set<(event: any) => void>>(new Set())

  const addMessageHandler = useCallback((handler: (event: any) => void) => {
    handlersRef.current.add(handler)

    // Return cleanup function
    return () => {
      handlersRef.current.delete(handler)
    }
  }, [])

  // Update the main handler when device changes
  useEffect(() => {
    if (midiDevices.selectedDevice?.input && midiDevices.isConnected) {
      const handleMessage = (event: any) => {
        handlersRef.current.forEach((handler) => {
          try {
            handler(event)
          } catch (error) {
            console.error("Error in MIDI message handler:", error)
          }
        })
      }

      midiDevices.selectedDevice.input.onmidimessage = handleMessage

      return () => {
        if (midiDevices.selectedDevice?.input) {
          midiDevices.selectedDevice.input.onmidimessage = null
        }
      }
    }
  }, [midiDevices.selectedDevice, midiDevices.isConnected])

  const contextValue: MidiContextType = {
    ...midiDevices,
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
