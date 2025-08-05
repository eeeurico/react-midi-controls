import React from "react"
import { MidiProvider } from "./contexts/MidiContext"
import { DeviceSelector } from "./components/DeviceSelector"
import {
  SliderComponent,
  KnobComponent,
  ButtonComponent,
  DebuggerComponent,
} from "./components/MidiControls"
import "./MidiDemo.css"

const MidiDemo: React.FC = () => {
  return (
    <div className="midi-demo">
      <div className="demo-header">
        <h1>🎹 MIDI Hooks Library Demo</h1>
        <p>A React library for creating MIDI-controlled UI components</p>
      </div>

      <MidiProvider>
        <DeviceSelector />

        <div className="demo-section">
          <h2>MIDI Controls</h2>
          <p>
            These components automatically respond to MIDI messages - no manual
            setup required!
          </p>

          <div className="controls-grid">
            <SliderComponent ccNumber={40} label="Volume" range={[0, 100]} />

            <KnobComponent
              ccNumber={30}
              label="Filter Cutoff"
              range={[0, 100]}
            />

            <ButtonComponent ccNumber={20} label="Sustain Pedal" />
          </div>
        </div>

        <div className="demo-section">
          <h2>Code Examples</h2>
          <div className="code-examples">
            <div className="example">
              <h3>Slider Component</h3>
              <pre>
                <code>{`<SliderComponent 
  ccNumber={7} 
  label="Volume" 
  range={[0, 100]}
/>`}</code>
              </pre>
            </div>

            <div className="example">
              <h3>Knob Component</h3>
              <pre>
                <code>{`<KnobComponent 
  ccNumber={74} 
  label="Filter Cutoff" 
  range={[0, 127]}
/>`}</code>
              </pre>
            </div>

            <div className="example">
              <h3>Button Component</h3>
              <pre>
                <code>{`<ButtonComponent 
  ccNumber={64} 
  label="Sustain Pedal"
/>`}</code>
              </pre>
            </div>

            <div className="example">
              <h3>Custom Hook Usage</h3>
              <pre>
                <code>{`const volume = useSlider({ ccNumber: 7, range: [0, 100] })

// Returns: number (the mapped value)
// Automatically connects to MIDI!`}</code>
              </pre>
            </div>
          </div>
        </div>

        <div className="demo-section">
          <h2>MIDI Message Debugger</h2>
          <p>See all MIDI messages in real-time with better identification:</p>
          <DebuggerComponent />
        </div>

        <div className="demo-footer">
          <p>🎉 That's it! No manual MIDI handler registration needed.</p>
          <p>
            Just wrap your app in <code>&lt;MidiProvider&gt;</code> and use the
            hooks!
          </p>
          <p>
            The hooks automatically handle MIDI connection, message parsing, and
            cleanup.
          </p>
        </div>
      </MidiProvider>
    </div>
  )
}

export default MidiDemo
