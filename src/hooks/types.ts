// Configuration interfaces
export interface SliderConfig {
  ccNumber: number
  range?: [number, number]
  defaultValue?: number
  min?: number
  max?: number
}

export interface ButtonConfig {
  ccNumber: number
  defaultValue?: boolean
}

export interface DebuggerConfig {
  maxMessages?: number
}

// MIDI Message interfaces (matches parseMIDIMessage output)
export interface MIDIMessage {
  id: number
  timestamp: number
  type: string
  channel: number
  controller?: number
  value?: number
  note?: number
  velocity?: number
  raw: Uint8Array
}

// MIDI Device interface
export interface MIDIDevice {
  id: string
  name: string
  manufacturer?: string
  type: "input" | "output"
  state: string
  connection: string
  input?: any // The actual WebMIDI input device
}

// Hook result types (simplified - direct values)
export interface DebuggerHookResult {
  messages: MIDIMessage[]
  clear: () => void
}

// useMidiDevices hook result
export interface UseMidiDevicesResult {
  devices: MIDIDevice[]
  selectedDevice: MIDIDevice | null
  isConnected: boolean
  error: string | null
  isLoading: boolean
  selectDevice: (device: MIDIDevice | null) => void
  selectDeviceById: (deviceId: string) => void
  disconnect: () => void
  refreshDevices: () => void
}

// Legacy interfaces (kept for compatibility)
export interface MIDIControlConfig {
  min?: number
  max?: number
}

export interface MidiHookResult {
  value: number
  rawValue: number
  isActive: boolean
  ccNumber: number
  range: [number, number]
  reset: () => void
}

export interface ButtonHookResult {
  value: boolean
  ccNumber: number
  reset: () => void
}

export interface PitchBendHookResult {
  value: number
  rawValue: number
  isActive: boolean
}
