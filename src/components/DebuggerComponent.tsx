import React from "react"
import { useDebugger } from "../hooks/useDebugger"
import { formatMIDIMessage } from "../utils/midiUtils"
import { cx } from "../utils/styling"
import type { DebuggerComponentProps } from "../hooks/types"
import "./theme.css"
import "./MidiControls.css"

export const DebuggerComponent: React.FC<DebuggerComponentProps> = ({
  maxMessages = 50,
  className,
  style,
  classNames,
}) => {
  const midiDebugger = useDebugger({ maxMessages })

  return (
    <div className={cx("rmc-debugger", className, classNames?.root)} style={style}>
      <div className={cx("rmc-debugger__header", classNames?.header)}>
        <h3 className={cx("rmc-debugger__title", classNames?.title)}>
          MIDI Debugger
        </h3>
        <button
          className={cx("rmc-debugger__clear", classNames?.clearButton)}
          onClick={midiDebugger.clear}
        >
          Clear
        </button>
      </div>
      <div className={cx("rmc-debugger__messages", classNames?.messages)}>
        {midiDebugger.messages.map((message) => (
          <div
            key={message.id}
            className={cx("rmc-debugger__message", classNames?.message)}
            data-type={message.type}
          >
            <span className="rmc-debugger__timestamp">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
            <span className="rmc-debugger__type">
              {formatMIDIMessage(message)}
            </span>

            {message.channel !== undefined && (
              <span className="rmc-debugger__channel">Ch {message.channel}</span>
            )}

            {/* Value display */}
            {message.value !== undefined && (
              <span className="rmc-debugger__value">Value: {message.value}</span>
            )}

            {/* Velocity for note messages */}
            {message.velocity !== undefined && (
              <span className="rmc-debugger__velocity">
                Vel: {message.velocity}
              </span>
            )}

            <span className="rmc-debugger__raw">
              [
              {Array.from(message.raw)
                .map((b) => b.toString(16).padStart(2, "0"))
                .join(", ")}
              ]
            </span>
          </div>
        ))}
        {midiDebugger.messages.length === 0 && (
          <div className={cx("rmc-debugger__empty", classNames?.empty)}>
            No MIDI messages yet...
          </div>
        )}
      </div>
    </div>
  )
}
