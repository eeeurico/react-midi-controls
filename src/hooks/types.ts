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

export interface DebuggerHookResult {
  messages: any[]
  clear: () => void
}
