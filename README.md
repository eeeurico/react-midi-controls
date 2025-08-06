# 🎹 react-midi-controls

React hooks and components for MIDI controllers. Build responsive, interactive interfaces that connect directly to MIDI hardware with ease.

## Features

- **Unified MIDI Hook**: `useSlider` for all absolute controls (sliders, knobs, faders)
- **Button Controls**: `useButton` for pads, switches, and buttons
- **Pre-built Components**: Ready-to-use MIDI-responsive UI components
- **TypeScript Support**: Full type safety and IntelliSense
- **Context-based**: Efficient MIDI message handling across components
- **CC-Only Focus**: Simplified for Control Change messages only
- **Real-time Debugging**: Built-in MIDI message inspector

## Quick Start

```bash
npm install react-midi-controls
```

### Basic Usage

```jsx
import {
  MidiProvider,
  SliderComponent,
  KnobComponent,
  ButtonComponent,
} from "react-midi-controls"

function App() {
  return (
    <MidiProvider>
      <DeviceSelector />

      <MidiControlPanel>
        <SliderComponent ccNumber={7} label="Volume" range={[0, 100]} />
        <KnobComponent ccNumber={74} label="Filter Cutoff" range={[0, 127]} />
        <ButtonComponent ccNumber={64} label="Sustain Pedal" />
      </MidiControlPanel>
    </MidiProvider>
  )
}
```

## Hooks

### `useSlider({ ccNumber, range, defaultValue })`

Creates an absolute MIDI control that returns the mapped value directly.

```jsx
const volume = useSlider({ ccNumber: 7, range: [0, 100] })
const cutoff = useSlider({
  ccNumber: 74,
  range: [20, 20000],
  defaultValue: 1000,
})

// Returns: number (the mapped value)
```

### `useButton({ ccNumber, defaultValue })`

Creates a button/pad control that returns a boolean value directly.

```jsx
const sustain = useButton({ ccNumber: 64 })
const mute = useButton({ ccNumber: 65, defaultValue: true })

// Returns: boolean (true when pressed, false when released)
```

### `useDebugger(filter)`

Debug MIDI messages with optional filtering.

```jsx
const debugger = useDebugger({
  type: 'controller'
})

// Returns: { messages, isRecording, clear, startRecording, stopRecording }
```

## Components

### `<SliderComponent>`

A visual slider that responds to MIDI CC messages.

```jsx
<SliderComponent
  ccNumber={1} // MIDI CC number
  label="Modulation" // Display label
  range={[0, 100]} // Output range
/>
```

### `<KnobComponent>`

A rotary knob for absolute controls (uses `useSlider` internally).

```jsx
<KnobComponent ccNumber={74} label="Cutoff" range={[0, 127]} />
```

### `<ButtonComponent>`

A button that lights up when pressed.

```jsx
<ButtonComponent ccNumber={64} label="Sustain" />
```

### `<DebuggerComponent>`

Real-time MIDI message inspector.

```jsx
<DebuggerComponent
  filter={{
    type: "controller",
  }}
/>
```

## Advanced Usage

### Custom Hook Implementation

```jsx
import { useMidiContext } from "react-midi-controls"
import { useEffect, useState } from "react"

function useCustomMidiControl(ccNumber) {
  const [value, setValue] = useState(0)
  const { addMessageHandler } = useMidiContext()

  useEffect(() => {
    const handleMessage = (event) => {
      const message = parseMIDIMessage(event.data)
      if (message.type === "controller" && message.ccNumber === ccNumber) {
        setValue(message.value)
      }
    }

    return addMessageHandler(handleMessage)
  }, [ccNumber, addMessageHandler])

  return value
}
```

## Configuration Options

### Range Mapping

Map MIDI values (0-127) to any range:

```jsx
// Bipolar control (-50 to +50)
<SliderComponent range={[-50, 50]} />

// Frequency range (20Hz to 20kHz)
<SliderComponent range={[20, 20000]} />

// Percentage (0% to 100%)
<SliderComponent range={[0, 100]} />
```

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ⚠️ Behind flag (`dom.webaudio.enabled`)
- Safari: ❌ Not supported

## TypeScript

Full TypeScript support included:

```typescript
import { MIDIMessage, MIDIDevice, SliderHookReturn } from "react-midi-controls"

const config: SliderHookReturn = {
  value: 0,
  rawValue: 0,
  isActive: false,
  handleMIDIMessage: () => {},
}
```

## License

MIT

## Contributing

1. Fork the repository at https://github.com/eeeurico/react-midi-controls
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

---

Built with ❤️ for the MIDI community by [Eurico Sá Fernandes](https://github.com/eeeurico)
