import React from "react"
import { useSlider } from "../hooks/useSlider"
import type { KnobComponentProps } from "../hooks/types"
import "./MidiControls.css"

export const KnobComponent: React.FC<KnobComponentProps> = ({
  ccNumber,
  channel,
  label,
  range = [0, 100],
  defaultValue = 0,
  min = 0,
  max = 127,
}) => {
  const knobValue = useSlider({
    ccNumber,
    channel,
    range,
    min,
    max,
    defaultValue,
  })

  const rotation = ((knobValue - range[0]) / (range[1] - range[0])) * 270 - 135

  return (
    <div className="midi-knob">
      <label>
        {label} (CC{ccNumber})
      </label>
      <div className="knob-container">
        <div
          className="knob-circle"
          style={{
            transform: `rotate(${rotation}deg)`,
          }}
        >
          <div className="knob-indicator" />
        </div>
        <div className="knob-value">{knobValue.toFixed(1)}</div>
      </div>
    </div>
  )
}
