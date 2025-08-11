# react-midi-controls - Types Reference

This document provides a comprehensive reference for all TypeScript types exported by the `react-midi-controls` library.

## Configuration Types

### `SliderConfig`

Configuration for slider/knob controls.

```typescript
interface SliderConfig {
  ccNumber: number
  range?: [number, number]
  defaultValue?: number
  min?: number
  max?: number
}
```

### `ButtonConfig`

Configuration for button/pad controls.

```typescript
interface ButtonConfig {
  ccNumber: number
  defaultValue?: boolean
}
```

### `DebuggerConfig`

Configuration for MIDI debugger.

```typescript
interface DebuggerConfig {
  maxMessages?: number
}
```

## MIDI Types

### `MIDIMessage`

Represents a parsed MIDI message.

```typescript
interface MIDIMessage {
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
```

### `MIDIDevice`

Represents a MIDI input/output device.

```typescript
interface MIDIDevice {
  id: string
  name: string
  manufacturer?: string
  type: "input" | "output"
  state: string
  connection: string
  input?: any // The actual WebMIDI input device
}
```

## Hook Result Types

### `DebuggerHookResult`

Return type for `useDebugger` hook.

```typescript
interface DebuggerHookResult {
  messages: MIDIMessage[]
  clear: () => void
}
```

### `UseMidiDevicesResult`

Return type for `useMidiDevices` hook.

```typescript
interface UseMidiDevicesResult {
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
```

## Component Props Types

### `SliderComponentProps`

Props for `SliderComponent`.

```typescript
interface SliderComponentProps {
  ccNumber: number
  label: string
  defaultValue?: number
  range?: [number, number]
  min?: number
  max?: number
}
```

### `KnobComponentProps`

Props for `KnobComponent`.

```typescript
interface KnobComponentProps {
  ccNumber: number
  defaultValue?: number
  label: string
  range?: [number, number]
  min?: number
  max?: number
}
```

### `ButtonComponentProps`

Props for `ButtonComponent`.

```typescript
interface ButtonComponentProps {
  ccNumber: number
  label: string
  defaultValue?: boolean
}
```

### `DebuggerComponentProps`

Props for `DebuggerComponent`.

```typescript
interface DebuggerComponentProps {
  maxMessages?: number
}
```

### `MidiControlPanelProps`

Props for `MidiControlPanel`.

```typescript
interface MidiControlPanelProps {
  children: React.ReactNode
}
```

## Context Types

### `MidiContextType`

Type for the MIDI context.

```typescript
interface MidiContextType extends UseMidiDevicesResult {
  addMessageHandler: (handler: (event: any) => void) => () => void
}
```

### `MidiProviderProps`

Props for `MidiProvider`.

```typescript
interface MidiProviderProps {
  children: React.ReactNode
  autoSelectFirstDevice?: boolean
}
```

## Utility Types

### `MIDIMessageHandler`

Type for MIDI message event handlers.

```typescript
type MIDIMessageHandler = (event: any) => void
```

### `CleanupFunction`

Type for cleanup functions.

```typescript
type CleanupFunction = () => void
```

### `Range`

Type for numeric ranges.

```typescript
type Range = [number, number]
```

### MIDI Value Types

```typescript
type CCNumber = number // MIDI CC Number (0-127)
type MIDIChannel = number // MIDI Channel (0-15)
type MIDIValue = number // MIDI Value (0-127)
type MIDINote = number // MIDI Note (0-127)
type MIDIVelocity = number // MIDI Velocity (0-127)
```

### MIDI Message Types

```typescript
type MIDIMessageType =
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
```

### MIDI Device States

```typescript
type MIDIDeviceState = "disconnected" | "connected"
type MIDIDeviceConnection = "open" | "closed" | "pending"
```

## Legacy Types (for compatibility)

### `MIDIControlConfig`

```typescript
interface MIDIControlConfig {
  min?: number
  max?: number
}
```

### `MidiHookResult`

```typescript
interface MidiHookResult {
  value: number
  rawValue: number
  isActive: boolean
  ccNumber: number
  range: [number, number]
  reset: () => void
}
```

### `ButtonHookResult`

```typescript
interface ButtonHookResult {
  value: boolean
  ccNumber: number
  reset: () => void
}
```

### `PitchBendHookResult`

```typescript
interface PitchBendHookResult {
  value: number
  rawValue: number
  isActive: boolean
}
```

## Usage Examples

### Basic Type Import

```typescript
import type {
  SliderConfig,
  MIDIMessage,
  UseMidiDevicesResult,
} from "react-midi-controls"
```

### Component Props with Types

```typescript
import React from "react"
import type { SliderComponentProps } from "react-midi-controls"

const CustomSlider: React.FC<SliderComponentProps> = (props) => {
  // Your custom implementation
}
```

### Hook Usage with Types

```typescript
import { useMidiDevices } from 'react-midi-controls'
import type { UseMidiDevicesResult, MIDIDevice } from 'react-midi-controls'

const DeviceManager: React.FC = () => {
  const midiDevices: UseMidiDevicesResult = useMidiDevices()

  const handleDeviceSelect = (device: MIDIDevice) => {
    midiDevices.selectDevice(device)
  }

  return (
    // Your JSX
  )
}
```
