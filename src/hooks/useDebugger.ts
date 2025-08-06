import { useState, useCallback, useEffect } from "react"
import { useMidiContext } from "../contexts/MidiContext"
import { parseMIDIMessage } from "../utils/midiUtils"
import type { MIDIMessage, DebuggerConfig } from "./types"

// Hook for debugging MIDI messages
export const useDebugger = (config: DebuggerConfig = {}) => {
  const { maxMessages = 50 } = config
  const [messages, setMessages] = useState<MIDIMessage[]>([])
  const { addMessageHandler } = useMidiContext()

  const handleMIDIMessage = useCallback(
    (event: any) => {
      const message = parseMIDIMessage(event.data)
      if (!message) return

      setMessages((prev) => {
        const newMessages = [message, ...prev]
        return newMessages.slice(0, maxMessages)
      })
    },
    [maxMessages]
  )

  // Automatically register/unregister with MIDI context
  useEffect(() => {
    return addMessageHandler(handleMIDIMessage)
  }, [addMessageHandler, handleMIDIMessage])

  const clear = useCallback(() => {
    setMessages([])
  }, [])

  return {
    messages,
    clear,
  }
}
