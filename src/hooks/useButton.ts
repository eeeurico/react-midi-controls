import { useState, useCallback, useEffect } from "react"
import { useMidiContext } from "../contexts/MidiContext"
import { parseMIDIMessage } from "../utils/midiUtils"
import type { ButtonConfig } from "./types"

// Hook for MIDI buttons/pads (on/off control)
export const useButton = ({
  ccNumber,
  defaultValue = false,
}: ButtonConfig): boolean => {
  const [value, setValue] = useState(defaultValue)
  const { addMessageHandler } = useMidiContext()

  const handleMIDIMessage = useCallback(
    (event: any) => {
      const message = parseMIDIMessage(event.data)
      if (!message || message.type !== "controller") return
      if (message.controller !== ccNumber) return
      if (message.value === undefined) return

      setValue(message.value > 0)
    },
    [ccNumber]
  )

  // Automatically register/unregister with MIDI context
  useEffect(() => {
    return addMessageHandler(handleMIDIMessage)
  }, [addMessageHandler, handleMIDIMessage])

  return value
}
