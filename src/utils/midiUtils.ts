import type { MIDIMessage, MIDIMessageType } from "../hooks/types"

// System messages (status 0xF0-0xFF) carry no channel
const SYSTEM_MESSAGE_TYPES: Partial<Record<number, MIDIMessageType>> = {
  0xf0: "sysex",
  0xf1: "timecode",
  0xf2: "song_position",
  0xf3: "song_select",
  0xf6: "tune_request",
  0xf8: "timing_clock",
  0xfa: "start",
  0xfb: "continue",
  0xfc: "stop",
  0xfe: "active_sensing",
  0xff: "reset",
}

// Parse MIDI message
export const parseMIDIMessage = (
  data: Uint8Array | null
): MIDIMessage | null => {
  if (!data || data.length === 0) return null

  const [status, data1 = 0, data2 = 0] = data
  const base = { id: Math.random(), timestamp: Date.now(), raw: data }

  if (status >= 0xf0) {
    return { ...base, type: SYSTEM_MESSAGE_TYPES[status] ?? "unknown" }
  }

  const channel = (status & 0x0f) + 1

  switch (status & 0xf0) {
    case 0x80: // Note Off
      return { ...base, type: "note_off", channel, note: data1, velocity: data2 }
    case 0x90: // Note On (velocity 0 means Note Off)
      return {
        ...base,
        type: data2 === 0 ? "note_off" : "note_on",
        channel,
        note: data1,
        velocity: data2,
      }
    case 0xa0: // Polyphonic Aftertouch
      return { ...base, type: "poly_aftertouch", channel, note: data1, value: data2 }
    case 0xb0: // Control Change
      return { ...base, type: "controller", channel, controller: data1, value: data2 }
    case 0xc0: // Program Change
      return { ...base, type: "program_change", channel, value: data1 }
    case 0xd0: // Channel Aftertouch
      return { ...base, type: "channel_aftertouch", channel, value: data1 }
    case 0xe0: // Pitch Bend (14-bit, 8192 is center)
      return { ...base, type: "pitch_bend", channel, value: (data2 << 7) | data1 }
    default:
      return { ...base, type: "unknown", channel }
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
    case "poly_aftertouch":
      return `Aftertouch ${getNoteNameFromNumber(message.note || 0)}`
    case "channel_aftertouch":
      return `Channel Aftertouch`
    case "program_change":
      return `Program Change`
    case "pitch_bend":
      return `Pitch Bend`
    default:
      return `${message.type}`
  }
}
