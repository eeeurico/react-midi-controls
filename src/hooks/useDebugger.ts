import { useState, useCallback, useEffect } from "react"
import { useMidiContext } from "../contexts/MidiContext"
import { parseMIDIMessage } from "../utils/midiUtils"
import type { MIDIMessage, MIDIMessageType, DebuggerConfig } from "./types"

// Sent many times per second by clocked or idle gear; they'd flood the log
const IGNORED_TYPES: MIDIMessageType[] = ["timing_clock", "active_sensing"]

// Hook for debugging MIDI messages
export const useDebugger = (config: DebuggerConfig = {}) => {
  const { maxMessages = 50 } = config
  const [messages, setMessages] = useState<MIDIMessage[]>([])
  const { addMessageHandler } = useMidiContext()

  const handleMIDIMessage = useCallback(
    (event: MIDIMessageEvent) => {
      const message = parseMIDIMessage(event.data)
      if (!message || IGNORED_TYPES.includes(message.type)) return

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
