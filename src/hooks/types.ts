import type { CSSProperties, ReactNode } from "react"

// Configuration interfaces
export interface SliderConfig {
  ccNumber: number
  channel?: number // 1-16; listens on all channels when omitted
  range?: [number, number]
  defaultValue?: number
  min?: number
  max?: number
}

export interface ButtonConfig {
  ccNumber: number
  channel?: number // 1-16; listens on all channels when omitted
  defaultValue?: boolean
}

export interface DebuggerConfig {
  maxMessages?: number
}

// MIDI Message interfaces (matches parseMIDIMessage output)
export interface MIDIMessage {
  id: number
  timestamp: number // Date.now() when parsed
  type: MIDIMessageType
  channel?: number // 1-16; absent on system messages
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
  input?: MIDIInput // The actual WebMIDI input device
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

// Styling props shared by the components: className and style go on the
// root element, classNames adds classes to individual parts
export interface StylingProps<Part extends string> {
  className?: string
  style?: CSSProperties
  classNames?: Partial<Record<Part, string>>
}

export type SliderPart = "root" | "label" | "track" | "fill" | "thumb" | "value"
export type KnobPart = "root" | "label" | "dial" | "indicator" | "value"
export type ButtonPart = "root" | "pad" | "inner" | "label" | "value"
export type DebuggerPart =
  | "root"
  | "header"
  | "title"
  | "clearButton"
  | "messages"
  | "message"
  | "empty"
export type DeviceSelectorPart =
  | "root"
  | "title"
  | "list"
  | "device"
  | "deviceName"
  | "deviceManufacturer"
  | "deviceStatus"
  | "status"
  | "action"
  | "empty"
  | "error"
export type MidiControlPanelPart = "root" | "grid"

// Component Props interfaces
export interface SliderComponentProps extends StylingProps<SliderPart> {
  ccNumber: number
  channel?: number
  label: string
  defaultValue?: number
  range?: [number, number]
  min?: number
  max?: number
}

export interface KnobComponentProps extends StylingProps<KnobPart> {
  ccNumber: number
  channel?: number
  defaultValue?: number
  label: string
  range?: [number, number]
  min?: number
  max?: number
}

export interface ButtonComponentProps extends StylingProps<ButtonPart> {
  ccNumber: number
  channel?: number
  label: string
  defaultValue?: boolean
}

export interface DebuggerComponentProps extends StylingProps<DebuggerPart> {
  maxMessages?: number
}

export type DeviceSelectorProps = StylingProps<DeviceSelectorPart>

export interface MidiControlPanelProps
  extends StylingProps<MidiControlPanelPart> {
  children: ReactNode
}

// Context types
export interface MidiContextType extends UseMidiDevicesResult {
  addMessageHandler: (handler: MIDIMessageHandler) => CleanupFunction
}

export interface MidiProviderProps {
  children: ReactNode
  autoSelectFirstDevice?: boolean
}

// Utility types
export type MIDIMessageHandler = (event: MIDIMessageEvent) => void
export type CleanupFunction = () => void

// Range type for better type safety
export type Range = [number, number]

// MIDI CC Number type (0-127)
export type CCNumber = number

// MIDI Channel type (1-16)
export type MIDIChannel = number

// MIDI Value type (0-127)
export type MIDIValue = number

// MIDI Note type (0-127)
export type MIDINote = number

// MIDI Velocity type (0-127)
export type MIDIVelocity = number

// MIDI Message Types
export type MIDIMessageType =
  | "note_off"
  | "note_on"
  | "poly_aftertouch"
  | "controller"
  | "program_change"
  | "channel_aftertouch"
  | "pitch_bend"
  | "sysex"
  | "timecode"
  | "song_position"
  | "song_select"
  | "tune_request"
  | "timing_clock"
  | "start"
  | "continue"
  | "stop"
  | "active_sensing"
  | "reset"
  | "unknown"

// MIDI Device State
export type MIDIDeviceState = "disconnected" | "connected"

// MIDI Device Connection
export type MIDIDeviceConnection = "open" | "closed" | "pending"
