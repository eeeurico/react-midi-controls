# 🎹 MIDI Hooks Library

A React library for creating MIDI-controlled UI components. Build responsive, interactive interfaces that connect directly to MIDI controllers with ease.

## Features

- **Easy MIDI Hooks**: `useSlider`, `useButton`, `useDebugger`
- **Pre-built Components**: Ready-to-use MIDI-responsive UI components
- **TypeScript Support**: Full type safety and IntelliSense
- **Flexible Configuration**: Customizable ranges, channels, and mappings
- **Real-time Debugging**: Built-in MIDI message inspector
- **Context-based**: Efficient MIDI message handling across components

## Quick Start

```bash
npm install midi-hooks
```

### Basic Usage

```jsx
import {
  MidiProvider,
  SliderComponent,
  KnobComponent,
  ButtonComponent,
} from "midi-hooks"

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

### `useSlider(ccNumber, range, config)`

Creates an absolute MIDI control (0-127 maps to your range).

```jsx
const slider = useSlider(7, [0, 100], {
  channel: 1,
  min: 0,
  max: 127,
})

// Returns: { value, rawValue, isActive, reset, handleMIDIMessage }
```

**Note**: `useKnob` has been removed. Both slider and knob components now use `useSlider` for unified behavior.

### `useButton(ccNumber, config)`

Creates a button/pad control.

```jsx
const button = useButton(64, { channel: 1 })

// Returns: { isPressed, pressCount, lastPressTime, handleMIDIMessage }
```

### `useDebugger(filter)`

Debug MIDI messages with optional filtering.

```jsx
const debugger = useDebugger({
  channel: 1,
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
  channel={1} // MIDI channel
  min={0} // Min MIDI value
  max={127} // Max MIDI value
/>
```

### `<KnobComponent>`

A rotary knob for relative controls.

```jsx
<KnobComponent ccNumber={74} label="Cutoff" range={[0, 127]} channel={1} />
```

### `<ButtonComponent>`

A button that lights up when pressed.

```jsx
<ButtonComponent ccNumber={64} label="Sustain" channel={1} />
```

### `<DebuggerComponent>`

Real-time MIDI message inspector.

```jsx
<DebuggerComponent
  filter={{
    channel: 1,
    type: "controller",
  }}
/>
```

## Advanced Usage

### Custom Hook Implementation

```jsx
import { useMidiContext } from "midi-hooks"
import { useEffect, useState } from "react"

function useCustomMidiControl(ccNumber) {
  const [value, setValue] = useState(0)
  const { addMessageHandler } = useMidiContext()

  useEffect(() => {
    const handleMessage = (event) => {
      // Parse MIDI message
      const [status, cc, val] = event.data
      if ((status & 0xf0) === 0xb0 && cc === ccNumber) {
        setValue(val)
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

### Channel Filtering

```jsx
// Only respond to channel 1
<SliderComponent channel={1} />

// Multi-channel setup
<SliderComponent ccNumber={7} channel={1} label="Ch1 Volume" />
<SliderComponent ccNumber={7} channel={2} label="Ch2 Volume" />
```

### Custom MIDI Ranges

```jsx
// Use only part of MIDI range (for fine control)
<SliderComponent
  ccNumber={1}
  min={32} // Start at MIDI value 32
  max={96} // End at MIDI value 96
  range={[0, 100]}
/>
```

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ⚠️ Behind flag (`dom.webaudio.enabled`)
- Safari: ❌ Not supported

## TypeScript

Full TypeScript support included:

```typescript
import { MIDIMessage, MIDIDevice, MIDIControlConfig } from "midi-hooks"

const config: MIDIControlConfig = {
  channel: 1,
  min: 0,
  max: 127,
  defaultValue: 64,
}
```

## License

MIT © [Your Name]

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

---

Built with ❤️ for the MIDI community
