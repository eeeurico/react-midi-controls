import React from "react"
import { useDebugger } from "../hooks/useDebugger"
import { formatMIDIMessage } from "../utils/midiUtils"
import "./MidiControls.css"

interface DebuggerComponentProps {
  maxMessages?: number
}

export const DebuggerComponent: React.FC<DebuggerComponentProps> = ({
  maxMessages = 50,
}) => {
  const midiDebugger = useDebugger({ maxMessages })

  return (
    <div className="midi-debugger">
      <div className="debugger-header">
        <h3>MIDI Debugger</h3>
        <div className="debugger-controls">
          <button onClick={midiDebugger.clear}>Clear</button>
        </div>
      </div>
      <div className="messages-container">
        {midiDebugger.messages.map((message) => (
          <div
            key={message.id}
            className={`message message-${message.type.replace("_", "-")}`}
          >
            <span className="timestamp">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
            <span className="type-display">{formatMIDIMessage(message)}</span>

            {/* Value display */}
            {message.value !== undefined && (
              <span className="value">Value: {message.value}</span>
            )}

            {/* Velocity for note messages */}
            {message.velocity !== undefined && (
              <span className="velocity">Vel: {message.velocity}</span>
            )}

            <span className="raw-data">
              [
              {Array.from(message.raw)
                .map((b) => b.toString(16))
                .join(", ")}
              ]
            </span>
          </div>
        ))}
        {midiDebugger.messages.length === 0 && (
          <div className="no-messages">No MIDI messages yet...</div>
        )}
      </div>
    </div>
  )
}
