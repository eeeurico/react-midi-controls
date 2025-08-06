# Testing react-midi-controls Package in Another Project

## Package Information

- **Package**: `react-midi-controls-1.0.0.tgz`
- **Size**: 46.3 kB compressed, 175.9 kB unpacked
- **Location**: `/Users/esf/ESF/Oort/midi-test/react-midi-controls-1.0.0.tgz`

## Quick Test Setup

### Option 1: Create New Test App

```bash
# Create a new React app
npx create-react-app test-usemidi --template typescript
cd test-usemidi

# Install the local package
npm install /Users/esf/ESF/Oort/midi-test/react-midi-controls-1.0.0.tgz

# Start the dev server
npm start
```

### Option 2: Use Existing React Project

```bash
# Navigate to your existing React TypeScript project
cd /path/to/your/existing/project

# Install the local package
npm install /Users/esf/ESF/Oort/midi-test/react-midi-controls-1.0.0.tgz
```

## Test Implementation

### Basic Test Component

Create `src/MidiTest.tsx`:

```tsx
import React from "react"
import {
  MidiProvider,
  useSlider,
  useButton,
  useDebugger,
  SliderComponent,
  ButtonComponent,
  DebuggerComponent,
  // Types for TypeScript
  type SliderConfig,
  type ButtonConfig,
  type MIDIMessage,
  type DebuggerHookResult,
} from "react-midi-controls"

function MidiTestComponent() {
  // Test the hooks with proper typing
  const sliderValue: number = useSlider({ ccNumber: 1, range: [0, 100] })
  const buttonPressed: boolean = useButton({ ccNumber: 16 })
  const debugInfo: DebuggerHookResult = useDebugger()

  return (
    <div style={{ padding: "20px" }}>
      <h2>useMidi Package Test</h2>

      <div style={{ marginBottom: "20px" }}>
        <h3>Hook Values (Properly Typed)</h3>
        <p>Slider (CC1): {sliderValue} (type: number)</p>
        <p>
          Button (CC16): {buttonPressed ? "PRESSED" : "Released"} (type:
          boolean)
        </p>
        <p>Debug Messages: {debugInfo.messages.length} messages</p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Components</h3>
        <SliderComponent ccNumber={1} range={[0, 100]} label="Test Slider" />
        <ButtonComponent ccNumber={16} label="Test Button" />
      </div>

      <div>
        <h3>Debug Info</h3>
        <DebuggerComponent />
      </div>
    </div>
  )
}

export default function MidiTest() {
  return (
    <MidiProvider>
      <MidiTestComponent />
    </MidiProvider>
  )
}
```

### Add to App.tsx

```tsx
import React from "react"
import MidiTest from "./MidiTest"

function App() {
  return (
    <div className="App">
      <MidiTest />
    </div>
  )
}

export default App
```

## Testing Checklist

### ✅ Installation Test

- [ ] Package installs without errors
- [ ] TypeScript types are available
- [ ] No missing dependencies

### ✅ Import Test

- [ ] All hooks import correctly
- [ ] All components import correctly
- [ ] MidiProvider imports correctly
- [ ] Types import correctly

### ✅ Functionality Test

- [ ] MidiProvider wraps components without errors
- [ ] useSlider returns number values
- [ ] useButton returns boolean values
- [ ] Components render without errors
- [ ] MIDI device connection works
- [ ] CC messages are received and processed

### ✅ TypeScript Test

- [ ] No TypeScript compilation errors
- [ ] Proper type inference on hook returns
  - [ ] `useSlider()` returns `number`
  - [ ] `useButton()` returns `boolean`
  - [ ] `useDebugger()` returns `DebuggerHookResult`
- [ ] Autocomplete works in IDE
- [ ] Configuration types work properly
  - [ ] `SliderConfig` interface
  - [ ] `ButtonConfig` interface
  - [ ] `MIDIMessage` interface
- [ ] Type imports work: `import type { SliderConfig } from 'usemidi'`

## Expected Behavior

1. **Initial State**: All values should show defaults
2. **MIDI Connection**: Device selector should show available MIDI devices
3. **CC Messages**: Moving CC1 should update slider value, CC16 should toggle button
4. **Debug Info**: Should show incoming MIDI messages in real-time

## Troubleshooting

### Common Issues

1. **No MIDI devices**: Use a virtual MIDI device or MIDI controller
2. **Build errors**: Check React/TypeScript versions compatibility
3. **Import errors**: Verify package installation completed successfully

### Testing with Virtual MIDI

```bash
# macOS: Use built-in Audio MIDI Setup
# Create IAC Driver for testing
```

## Next Steps After Testing

If all tests pass:

1. **Publish to NPM**: `npm publish` from the package directory
2. **Update documentation**: Add any findings to README
3. **Version management**: Consider version bumps for any fixes

## Quick Commands Summary

```bash
# Install local package
npm install /Users/esf/ESF/Oort/midi-test/react-midi-controls-1.0.0.tgz

# Check installation
npm list react-midi-controls

# Remove if needed
npm uninstall react-midi-controls

# Reinstall after updates
npm uninstall react-midi-controls && npm install /Users/esf/ESF/Oort/midi-test/react-midi-controls-1.0.0.tgz
```
