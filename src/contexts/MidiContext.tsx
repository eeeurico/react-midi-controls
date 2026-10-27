import React, {
  createContext,
  useContext,
  useCallback,
  useRef,
  useEffect,
} from "react"
import { useMidiDevices } from "../hooks/useMidiDevices"
import type {
  MidiContextType,
  MidiProviderProps,
  MIDIMessageHandler,
} from "../hooks/types"

const MidiContext = createContext<MidiContextType | null>(null)

export const MidiProvider: React.FC<MidiProviderProps> = ({
  children,
  autoSelectFirstDevice = true,
}) => {
  const midiDevices = useMidiDevices(autoSelectFirstDevice)
  const handlersRef = useRef<Set<MIDIMessageHandler>>(new Set())

  const addMessageHandler = useCallback((handler: MIDIMessageHandler) => {
    handlersRef.current.add(handler)

    // Return cleanup function
    return () => {
      handlersRef.current.delete(handler)
    }
  }, [])

  // Update the main handler when the selected input changes
  const input = midiDevices.selectedDevice?.input
  useEffect(() => {
    if (!input) return

    input.onmidimessage = (event) => {
      handlersRef.current.forEach((handler) => {
        try {
          handler(event)
        } catch (error) {
          console.error("Error in MIDI message handler:", error)
        }
      })
    }

    return () => {
      input.onmidimessage = null
    }
  }, [input])

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
