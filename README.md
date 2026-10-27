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
import "react-midi-controls/style.css" // Optional default theme, see Styling

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

## Styling

The components render unstyled markup. Import the default theme to get the look from the demo:

```js
import "react-midi-controls/style.css"
```

### Theme Variables

The default theme is driven by CSS variables. Override them on `:root` or on any wrapper element (the defaults have zero specificity, so yours always win):

```css
:root {
  --rmc-accent: #ff5a1f;
  --rmc-knob-size: 80px;
  --rmc-knob-sweep: 300deg;
}

.dark-panel {
  --rmc-surface: #1e1e1e;
  --rmc-surface-muted: #2a2a2a;
  --rmc-text: #eee;
  --rmc-track: #444;
  --rmc-border: #333;
}
```

| Variable | Default | Used for |
| --- | --- | --- |
| `--rmc-accent` | `#0084ff` | Slider fill and thumb, knob indicator, pressed pads, values |
| `--rmc-on-accent` | `#fff` | Text on colored backgrounds |
| `--rmc-success` / `--rmc-warning` / `--rmc-danger` / `--rmc-secondary` | | Status colors and debugger badges |
| `--rmc-surface` / `--rmc-surface-muted` | `#fff` / `#f8f9fa` | Card and secondary backgrounds |
| `--rmc-track` / `--rmc-border` | `#ddd` / `#dee2e6` | Slider track, outlines |
| `--rmc-text` / `--rmc-text-muted` | `#333` / `#6c757d` | Text |
| `--rmc-radius` / `--rmc-shadow` | `8px` / soft shadow | Cards |
| `--rmc-font` / `--rmc-mono-font` | `inherit` / monospace | Text, debugger log |
| `--rmc-knob-size` / `--rmc-knob-sweep` | `60px` / `270deg` | Knob size and rotation range |
| `--rmc-button-size` | `60px` | Button pad size |

### Class Names and State

Every element has an `rmc-` class (`rmc-knob`, `rmc-knob__dial`, `rmc-slider__fill`, ...), and state is exposed so CSS can react to it:

- Slider and knob roots set `--rmc-value`: the value's position in its range, from 0 to 1. The default theme positions the fill, thumb and dial from it, so you can change them in CSS alone:

  ```css
  .rmc-knob__dial {
    transform: rotate(calc(var(--rmc-value) * 360deg));
  }
  ```

- Button roots have `data-pressed` while the pad is held.
- Debugger messages have `data-type` (`controller`, `note_on`, ...).
- `DeviceSelector` has `data-state` (`loading`, `error`, `ready`); its device buttons have `data-state` (`connected`, `disconnected`) and `data-selected`.

### `className`, `style` and `classNames`

`className` and `style` go on the root element. `classNames` adds classes to individual parts, which works well with Tailwind or CSS Modules:

```jsx
<KnobComponent
  ccNumber={74}
  label="Cutoff"
  className="rounded-xl bg-zinc-900 p-4"
  classNames={{ dial: "border-zinc-700", value: "text-orange-400" }}
/>
```

| Component | Parts |
| --- | --- |
| `SliderComponent` | `root`, `label`, `track`, `fill`, `thumb`, `value` |
| `KnobComponent` | `root`, `label`, `dial`, `indicator`, `value` |
| `ButtonComponent` | `root`, `pad`, `inner`, `label`, `value` |
| `DebuggerComponent` | `root`, `header`, `title`, `clearButton`, `messages`, `message`, `empty` |
| `DeviceSelector` | `root`, `title`, `list`, `device`, `deviceName`, `deviceManufacturer`, `deviceStatus`, `status`, `action`, `empty`, `error` |
| `MidiControlPanel` | `root`, `grid` |

### Fully Custom UI

For a completely different look, skip the components and use the hooks, which return plain values:

```jsx
const cutoff = useSlider({ ccNumber: 74, range: [0, 1] })

return <MyKnob value={cutoff} />
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
