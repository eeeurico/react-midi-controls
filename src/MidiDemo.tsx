import React from "react"
import { MidiProvider } from "./contexts/MidiContext"
import { DeviceSelector } from "./components/DeviceSelector"
import {
  SliderComponent,
  KnobComponent,
  ButtonComponent,
  DebuggerComponent,
  MidiControlPanel,
} from "./components/MidiControls"
import "./MidiDemo.css"

const MidiDemo: React.FC = () => {
  return (
    <div className="demo">
      <header className="demo-header">
        <h1>react-midi-controls</h1>
        <p>React hooks and components for MIDI controllers</p>
        <code className="demo-install">npm install react-midi-controls</code>
      </header>

      <MidiProvider>
        <div className="demo-workspace">
          <aside>
            <DeviceSelector />
          </aside>

          <main className="demo-main">
            <section>
              <h2>Controls</h2>
              <MidiControlPanel className="demo-rack">
                <KnobComponent ccNumber={30} label="Cutoff" defaultValue={96} />
                <KnobComponent
                  ccNumber={31}
                  label="Resonance"
                  defaultValue={40}
                />
                <KnobComponent ccNumber={32} label="Drive" defaultValue={20} />
                <KnobComponent
                  ccNumber={33}
                  label="Dry/Wet"
                  defaultValue={127}
                />
                <SliderComponent
                  ccNumber={40}
                  label="Volume"
                  defaultValue={100}
                />
                <ButtonComponent ccNumber={20} label="Sustain" />
              </MidiControlPanel>
            </section>

            <DebuggerComponent />
          </main>
        </div>

        <section className="demo-section">
          <h2>Theming</h2>
          <p>
            The same controls with a light theme, set by overriding CSS
            variables on a wrapper element.
          </p>
          <MidiControlPanel className="demo-rack light-theme">
            <KnobComponent ccNumber={30} label="Cutoff" defaultValue={96} />
            <KnobComponent ccNumber={31} label="Resonance" defaultValue={40} />
            <SliderComponent ccNumber={40} label="Volume" defaultValue={100} />
            <ButtonComponent ccNumber={20} label="Sustain" />
          </MidiControlPanel>
        </section>

        <section className="demo-section">
          <h2>Usage</h2>
          <div className="code-examples">
            <div className="example">
              <h3>Knob</h3>
              <pre>
                <code>{`<KnobComponent
  ccNumber={74}
  label="Cutoff"
/>`}</code>
              </pre>
            </div>

            <div className="example">
              <h3>Slider</h3>
              <pre>
                <code>{`<SliderComponent
  ccNumber={7}
  label="Volume"
  range={[0, 100]}
/>`}</code>
              </pre>
            </div>

            <div className="example">
              <h3>Theme</h3>
              <pre>
                <code>{`.my-rack {
  --rmc-accent: #3fa9f5;
  --rmc-knob-size: 56px;
}`}</code>
              </pre>
            </div>

            <div className="example">
              <h3>Hook</h3>
              <pre>
                <code>{`const volume = useSlider({
  ccNumber: 7,
  range: [0, 100],
})`}</code>
              </pre>
            </div>
          </div>
        </section>
      </MidiProvider>
    </div>
  )
}

export default MidiDemo
