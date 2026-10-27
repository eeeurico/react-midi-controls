import React from "react"
import { useSlider } from "../hooks/useSlider"
import type { SliderComponentProps } from "../hooks/types"
import "./MidiControls.css"

export const SliderComponent: React.FC<SliderComponentProps> = ({
  ccNumber,
  channel,
  label,
  range = [0, 100],
  defaultValue = 0,
  min = 0,
  max = 127,
}) => {
  const sliderValue = useSlider({
    ccNumber,
    channel,
    range,
    defaultValue,
    min,
    max,
  })

  return (
    <div className="midi-slider">
      <label>
        {label} (CC{ccNumber})
      </label>
      <div className="slider-container">
        <div
          className="slider-track"
          style={{
            background: `linear-gradient(to right, #0084ff 0%, #0084ff ${
              ((sliderValue - range[0]) / (range[1] - range[0])) * 100
            }%, #ddd ${
              ((sliderValue - range[0]) / (range[1] - range[0])) * 100
            }%, #ddd 100%)`,
          }}
        >
          <div
            className="slider-thumb"
            style={{
              left: `${
                ((sliderValue - range[0]) / (range[1] - range[0])) * 100
              }%`,
            }}
          />
        </div>
        <div className="slider-value">{sliderValue.toFixed(1)}</div>
      </div>
    </div>
  )
}
