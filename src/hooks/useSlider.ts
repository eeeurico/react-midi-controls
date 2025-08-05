import { useState, useCallback, useRef, useEffect } from "react"
import { useMidiContext } from "../contexts/MidiContext"
import { parseMIDIMessage, mapRange } from "../utils/midiUtils"

// Hook for MIDI sliders (absolute control)
export const useSlider = ({
  ccNumber,
  range = [0, 127],
  defaultValue = 0,
  min = 0,
  max = 127,
}: {
  ccNumber: number
  range?: [number, number]
  defaultValue?: number
  min?: number
  max?: number
}) => {
  const [rawValue, setRawValue] = useState(defaultValue)
  const lastMessageTime = useRef(0)
  const { addMessageHandler } = useMidiContext()

  const mappedValue = mapRange(rawValue, min, max, range[0], range[1])

  const handleMIDIMessage = useCallback(
    (event: any) => {
      const message = parseMIDIMessage(event.data)
      if (!message || message.type !== "controller") return
      if (message.controller !== ccNumber) return

      const timestamp = performance.now()
      lastMessageTime.current = timestamp

      if (message.value !== undefined) {
        setRawValue(message.value)
      }
    },
    [ccNumber]
  )

  // Automatically register/unregister with MIDI context
  useEffect(() => {
    return addMessageHandler(handleMIDIMessage)
  }, [addMessageHandler, handleMIDIMessage])

  return mappedValue
}
