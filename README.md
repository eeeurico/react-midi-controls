# 🎹 react-midi-controls

React hooks and components for MIDI controllers. Build responsive, interactive interfaces that connect directly to MIDI hardware with ease.

## Features

- **Unified MIDI Hook**: `useSlider` for all absolute controls (sliders, knobs, faders)
- **Button Controls**: `useButton` for pads, switches, and buttons
- **Pre-built Components**: Ready-to-use MIDI-responsive UI components
- **TypeScript Support**: Full type safety and IntelliSense
- **Context-based**: Efficient MIDI message handling across components
- **CC-Focused Controls**: Sliders, knobs and buttons respond to Control Change messages, optionally filtered by channel
- **Real-time Debugging**: Built-in MIDI message inspector

## Quick Start

```bash
npm install react-midi-controls
```

### Basic Usage

```jsx
import {
  MidiProvider,
  DeviceSelector,
  MidiControlPanel,
  SliderComponent,
  KnobComponent,
  ButtonComponent,
} from "react-midi-controls"
import "react-midi-controls/style.css" // Styles for the pre-built components

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

### `useSlider({ ccNumber, channel, range, defaultValue })`

Creates an absolute MIDI control that returns the mapped value directly.

```jsx
const volume = useSlider({ ccNumber: 7, range: [0, 100] })
const cutoff = useSlider({
  ccNumber: 74,
  range: [20, 20000],
  defaultValue: 1000,
})
const pan = useSlider({ ccNumber: 10, channel: 2 }) // Only listen on MIDI channel 2

// Returns: number (the mapped value)
```

### `useButton({ ccNumber, channel, defaultValue })`

Creates a button/pad control that returns a boolean value directly.

```jsx
const sustain = useButton({ ccNumber: 64 })
const mute = useButton({ ccNumber: 65, defaultValue: true })

// Returns: boolean (true when pressed, false when released)
```

### `useDebugger({ maxMessages })`

Collects incoming MIDI messages, newest first. Timing clock and active sensing messages are skipped.

```jsx
const midiDebugger = useDebugger({ maxMessages: 50 })

// Returns: { messages, clear }
```

## Components

### `<SliderComponent>`

A visual slider that responds to MIDI CC messages.

```jsx
<SliderComponent
  ccNumber={1} // MIDI CC number
  channel={1} // Optional: MIDI channel 1-16 (default: any)
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
<DebuggerComponent maxMessages={50} />
```

## Advanced Usage

### Custom Hook Implementation

```jsx
import { useMidiContext, parseMIDIMessage } from "react-midi-controls"
import { useEffect, useState } from "react"

function useCustomMidiControl(ccNumber) {
  const [value, setValue] = useState(0)
  const { addMessageHandler } = useMidiContext()

  useEffect(() => {
    const handleMessage = (event) => {
      const message = parseMIDIMessage(event.data)
      if (message?.type === "controller" && message.controller === ccNumber) {
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

### Message Types

`parseMIDIMessage` returns a `MIDIMessage` whose `type` is one of `note_on`, `note_off`, `poly_aftertouch`, `controller`, `program_change`, `channel_aftertouch`, `pitch_bend` (14-bit `value`, 8192 is center), or a system message (`sysex`, `timing_clock`, `start`, `stop`, ...). Channel messages include `channel` (1-16).

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ⚠️ Behind flag (`dom.webaudio.enabled`)
- Safari: ❌ Not supported

## TypeScript

Full TypeScript support included:

```typescript
import { useSlider } from "react-midi-controls"

// Example: Type-safe usage in a functional component
function VolumeControl() {
  // TypeScript infers the correct types for value and setValue
  const volume = useSlider({ ccNumber: 7, range: [0, 100] })

  return <div>Volume: {volume}</div>
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
