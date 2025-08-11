import type { ReactNode } from "react"

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

// Component Props interfaces
export interface SliderComponentProps {
  ccNumber: number
  label: string
  defaultValue?: number
  range?: [number, number]
  min?: number
  max?: number
}

export interface KnobComponentProps {
  ccNumber: number
  defaultValue?: number
  label: string
  range?: [number, number]
  min?: number
  max?: number
}

export interface ButtonComponentProps {
  ccNumber: number
  label: string
  defaultValue?: boolean
}

export interface DebuggerComponentProps {
  maxMessages?: number
}

export interface MidiControlPanelProps {
  children: ReactNode
}

// Context types
export interface MidiContextType extends UseMidiDevicesResult {
  addMessageHandler: (handler: (event: any) => void) => () => void
}

export interface MidiProviderProps {
  children: ReactNode
  autoSelectFirstDevice?: boolean
}

// Utility types
export type MIDIMessageHandler = (event: any) => void
export type CleanupFunction = () => void

// Range type for better type safety
export type Range = [number, number]

// MIDI CC Number type (0-127)
export type CCNumber = number

// MIDI Channel type (0-15)
export type MIDIChannel = number

// MIDI Value type (0-127)
export type MIDIValue = number

// MIDI Note type (0-127)
export type MIDINote = number

// MIDI Velocity type (0-127)
export type MIDIVelocity = number

// MIDI Message Types
export type MIDIMessageType =
  | "noteoff"
  | "noteon"
  | "controlchange"
  | "pitchbend"
  | "programchange"
  | "aftertouch"
  | "sysex"
  | "timecode"
  | "songposition"
  | "songselect"
  | "tunerequest"
  | "timingclock"
  | "start"
  | "continue"
  | "stop"
  | "activesensing"
  | "reset"

// MIDI Device State
export type MIDIDeviceState = "disconnected" | "connected"

// MIDI Device Connection
export type MIDIDeviceConnection = "open" | "closed" | "pending"
