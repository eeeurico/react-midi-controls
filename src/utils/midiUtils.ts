import type { MIDIMessage } from "../hooks/useMidi"

// Parse MIDI message
export const parseMIDIMessage = (data: Uint8Array): MIDIMessage | null => {
  console.log("Parsing MIDI message:", data)
  if (data.length < 3) return null

  const [status, data1, data2] = data
  const messageType = status & 0xf0
  const channel = (status & 0x0f) + 1

  const timestamp = performance.now()
  const id = Math.random()

  switch (messageType) {
    case 0xb0: // Control Change
      return {
        id,
        timestamp,
        type: "controller",
        channel,
        controller: data1,
        value: data2,
        raw: data,
      }
    case 0x90: // Note On
      return {
        id,
        timestamp,
        type: data2 > 0 ? "note_on" : "note_off", // Note On with velocity 0 is Note Off
        channel,
        note: data1,
        velocity: data2,
        raw: data,
      }
    case 0x80: // Note Off
      return {
        id,
        timestamp,
        type: "note_off",
        channel,
        note: data1,
        velocity: data2,
        raw: data,
      }
    case 0xe0: // Pitch Bend
      return {
        id,
        timestamp,
        type: "pitch_bend",
        channel,
        value: (data2 << 7) | data1, // Combine data1 and data2 for pitch bend value
        raw: data,
      }
    default:
      return {
        id,
        timestamp,
        type: "unknown",
        channel,
        raw: data,
      }
  }
}

// Map value from one range to another
export const mapRange = (
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number
): number => {
  return ((value - fromMin) * (toMax - toMin)) / (fromMax - fromMin) + toMin
}

// Get note name from MIDI note number
export const getNoteNameFromNumber = (noteNumber: number): string => {
  const noteNames = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ]
  const octave = Math.floor(noteNumber / 12) - 1
  const note = noteNames[noteNumber % 12]
  return `${note}${octave}`
}

// Format MIDI message for display
export const formatMIDIMessage = (message: MIDIMessage): string => {
  switch (message.type) {
    case "controller":
      return `CC${message.controller}`
    case "note_on":
      return `Note On ${getNoteNameFromNumber(message.note || 0)}`
    case "note_off":
      return `Note Off ${getNoteNameFromNumber(message.note || 0)}`
    case "pitch_bend":
      return `Pitch Bend`
    default:
      return `${message.type}`
  }
}
