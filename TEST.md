# Testing useMidi Package

## 🧪 Test Your useMidi Package

Your package has been built and packed as: `usemidi-1.0.0.tgz`

### Quick Test Setup

1. **Create a new React app:**

```bash
# In a different directory
npx create-react-app test-usemidi --template typescript
cd test-usemidi
```

2. **Install your local package:**

```bash
# Copy the usemidi-1.0.0.tgz file to your test app directory, then:
npm install ./usemidi-1.0.0.tgz
```

3. **Test the package:**

Replace `src/App.tsx` with:

```tsx
import React from "react"
import {
  MidiProvider,
  useSlider,
  useButton,
  SliderComponent,
  KnobComponent,
  ButtonComponent,
  DeviceSelector,
} from "usemidi"
import "usemidi/dist/usemidi.css" // Import styles

function MidiTest() {
  const volume = useSlider({ ccNumber: 7, range: [0, 100] })
  const sustain = useButton({ ccNumber: 64 })

  return (
    <div style={{ padding: "20px" }}>
      <h2>useMidi Test</h2>

      <DeviceSelector />

      <div style={{ margin: "20px 0" }}>
        <h3>Hook Values:</h3>
        <p>Volume (CC7): {volume.toFixed(1)}%</p>
        <p>Sustain (CC64): {sustain ? "ON" : "OFF"}</p>
      </div>

      <div style={{ margin: "20px 0" }}>
        <h3>Components:</h3>
        <SliderComponent ccNumber={1} label="Modulation" range={[0, 127]} />
        <KnobComponent ccNumber={74} label="Cutoff" range={[0, 100]} />
        <ButtonComponent ccNumber={64} label="Sustain" />
      </div>
    </div>
  )
}

function App() {
  return (
    <MidiProvider>
      <MidiTest />
    </MidiProvider>
  )
}

export default App
```

4. **Run the test:**

```bash
npm start
```

### 🎹 Testing Checklist

- [ ] Package installs without errors
- [ ] TypeScript types work correctly
- [ ] MIDI device selection works
- [ ] useSlider hook responds to CC messages
- [ ] useButton hook responds to CC messages
- [ ] Components render and respond to MIDI
- [ ] CSS styles load correctly

### 📦 Package Contents

Your package includes:

- ✅ ES Module (`index.es.js`)
- ✅ CommonJS Module (`index.cjs.js`)
- ✅ TypeScript definitions
- ✅ CSS styles (`usemidi.css`)
- ✅ Source maps for debugging

### 🔍 Debugging

If you encounter issues:

1. **Check browser console** for errors
2. **Verify MIDI device is connected** and supported
3. **Test in Chrome/Edge** (best Web MIDI support)
4. **Check TypeScript types** in your IDE

### 🚀 Ready to Publish?

If tests pass successfully:

```bash
npm publish
```

Your package will be available as:

```bash
npm install usemidi
```
