# MIDI Hooks Library - File Structure

## 📁 Project Structure Overview

```
src/
├── 🎹 midi-hooks.ts              # Main library entry point
├── 📱 MidiDemo.tsx               # Example demo application
├── 📱 MidiDemo.css               # Demo styling
├── 📱 App.tsx                    # React app entry
│
├── 🪝 hooks/                     # MIDI React Hooks
│   ├── index.ts                  # Hooks exports
│   ├── types.ts                  # TypeScript interfaces
│   ├── useMidi.ts               # Core MIDI access hook
│   ├── useSlider.ts             # Slider/fader control hook
│   ├── useButton.ts             # Button/pad control hook
│   ├── usePitchBend.ts          # Pitch bend wheel hook
│   └── useDebugger.ts           # MIDI message debugger hook
│
├── 🔧 utils/                     # MIDI Utilities
│   ├── index.ts                  # Utils exports
│   └── midiUtils.ts             # MIDI parsing & formatting functions
│
├── 🎯 contexts/                  # React Context
│   └── MidiContext.tsx          # Central MIDI message handling
│
└── 🎨 components/                # Pre-built UI Components
    ├── index.ts                  # Components exports
    ├── MidiControls.tsx         # Slider, Knob, Button, Debugger components
    ├── MidiControls.css         # Component styling
    └── DeviceSelector.tsx       # MIDI device selection component
```

## 🧩 Modular Architecture

### **Core Hooks** (`/hooks/`)

Each hook is now in its own file for better maintainability:

- **`useSlider.ts`** - Absolute MIDI CC control (faders, linear controls)
- **`useButton.ts`** - Binary MIDI CC control (buttons, pads)
- **`usePitchBend.ts`** - Pitch bend wheel control
- **`useDebugger.ts`** - MIDI message monitoring and debugging

### **Utilities** (`/utils/`)

Shared MIDI processing functions moved to dedicated utils:

- **`parseMIDIMessage()`** - Convert raw MIDI bytes to structured data
- **`mapRange()`** - Scale values between different ranges
- **`getNoteNameFromNumber()`** - Convert MIDI note numbers to names (C4, D#5, etc.)
- **`formatMIDIMessage()`** - Format messages for display ("Ch1 CC7", "Ch2 Note On C4")

### **Context** (`/contexts/`)

- **`MidiContext.tsx`** - Centralized MIDI device management and message routing

### **Components** (`/components/`)

- **`MidiControls.tsx`** - Pre-built UI components using the hooks
- **`DeviceSelector.tsx`** - MIDI device connection interface

## 🎯 Benefits of This Structure

### **1. Separation of Concerns**

- **Hooks**: Pure MIDI logic and state management
- **Utils**: Reusable MIDI processing functions
- **Components**: UI presentation layer
- **Context**: Device management and message distribution

### **2. Better Tree Shaking**

Import only what you need:

```typescript
// Import specific hooks
import { useSlider } from "./hooks/useSlider"

// Import specific utilities
import { parseMIDIMessage, formatMIDIMessage } from "./utils/midiUtils"
```

### **3. Easier Testing**

Each hook and utility can be tested in isolation:

```typescript
// Test slider hook independently
import { useSlider } from "./hooks/useSlider"

// Test MIDI parsing independently
import { parseMIDIMessage } from "./utils/midiUtils"
```

### **4. Cleaner Development**

- **Find code faster**: Know exactly where each piece of functionality lives
- **Modify safely**: Changes to one hook don't affect others
- **Add features easily**: New hooks follow the same pattern

### **5. Library Distribution**

Users can import at different levels:

```typescript
// Full library
import { useSlider, formatMIDIMessage } from "midi-hooks"

// Specific modules (when using bundlers that support it)
import { useSlider } from "midi-hooks/hooks/useSlider"
import { parseMIDIMessage } from "midi-hooks/utils/midiUtils"
```

## 🚀 Usage Examples

### **Hook-Level Usage**

```typescript
import { useSlider } from "./hooks/useSlider"
import { useButton } from "./hooks/useButton"

function MyController() {
  const volume = useSlider(7, [0, 100]) // CC7: Volume
  const mute = useButton(64) // CC64: Mute Button

  return (
    <div>
      <div>Volume: {volume.value}%</div>
      <div>Mute: {mute.pressed ? "ON" : "OFF"}</div>
    </div>
  )
}
```

### **Component-Level Usage**

```typescript
import { SliderComponent, ButtonComponent } from "./components/MidiControls"

function MyControlSurface() {
  return (
    <div>
      <SliderComponent ccNumber={7} label="Volume" range={[0, 100]} />
      <ButtonComponent ccNumber={64} label="Mute" />
    </div>
  )
}
```

### **Utility-Level Usage**

```typescript
import { parseMIDIMessage, formatMIDIMessage } from "./utils/midiUtils"

// Parse raw MIDI data
const message = parseMIDIMessage(new Uint8Array([0xb0, 0x07, 0x64]))
console.log(formatMIDIMessage(message)) // "Ch1 CC7"

// Custom MIDI processing
function handleMIDI(event) {
  const message = parseMIDIMessage(event.data)
  if (message?.type === "controller") {
    console.log(
      `Received ${formatMIDIMessage(message)} with value ${message.value}`
    )
  }
}
```

## 🎪 This Architecture Scales!

Want to add new MIDI features? Just follow the pattern:

1. **New Hook**: `src/hooks/useNewFeature.ts`
2. **New Utility**: Add to `src/utils/midiUtils.ts`
3. **New Component**: Add to `src/components/MidiControls.tsx`
4. **Export**: Update index files

The modular structure makes the library **maintainable**, **testable**, and **extensible**! 🎉
