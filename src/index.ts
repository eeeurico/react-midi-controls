// Hooks
export { useSlider } from "./hooks/useSlider"
export { useButton } from "./hooks/useButton"
export { useDebugger } from "./hooks/useDebugger"
export { useMidi } from "./hooks/useMidi"
export { useMidiControlManager } from "./hooks/useMidiControlManager"
export { useMidiDevices } from "./hooks/useMidiDevices"

// Components
export { SliderComponent } from "./components/SliderComponent"
export { KnobComponent } from "./components/KnobComponent"
export { ButtonComponent } from "./components/ButtonComponent"
export { DebuggerComponent } from "./components/DebuggerComponent"
export { DeviceSelector } from "./components/DeviceSelector"
export { MidiControlPanel } from "./components/MidiControlPanel"

// Context
export { MidiProvider, useMidiContext } from "./contexts/MidiContext"

// Types
export type {
  // Configuration types
  SliderConfig,
  ButtonConfig,
  DebuggerConfig,

  // MIDI types
  MIDIMessage,
  MIDIDevice,

  // Hook result types
  DebuggerHookResult,
  UseMidiDevicesResult,

  // Component Props types
  SliderComponentProps,
  KnobComponentProps,
  ButtonComponentProps,
  DebuggerComponentProps,
  DeviceSelectorProps,
  MidiControlPanelProps,

  // Styling types
  StylingProps,
  SliderPart,
  KnobPart,
  ButtonPart,
  DebuggerPart,
  DeviceSelectorPart,
  MidiControlPanelPart,

  // Context types
  MidiContextType,
  MidiProviderProps,

  // Utility types
  MIDIMessageHandler,
  CleanupFunction,
  Range,
  CCNumber,
  MIDIChannel,
  MIDIValue,
  MIDINote,
  MIDIVelocity,
  MIDIMessageType,
  MIDIDeviceState,
  MIDIDeviceConnection,

  // Legacy compatibility types
  MIDIControlConfig,
  MidiHookResult,
  ButtonHookResult,
  PitchBendHookResult,
} from "./hooks/types"

// Utils
export {
  parseMIDIMessage,
  mapRange,
  formatMIDIMessage,
} from "./utils/midiUtils"
