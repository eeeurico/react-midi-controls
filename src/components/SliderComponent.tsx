import React from "react"
import { useSlider } from "../hooks/useSlider"
import { cx, valueStyle } from "../utils/styling"
import type { SliderComponentProps } from "../hooks/types"
import "./theme.css"
import "./MidiControls.css"

export const SliderComponent: React.FC<SliderComponentProps> = ({
  ccNumber,
  channel,
  label,
  range = [0, 100],
  defaultValue = 0,
  min = 0,
  max = 127,
  className,
  style,
  classNames,
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
    <div
      className={cx("rmc-slider", className, classNames?.root)}
      style={valueStyle(sliderValue, range, style)}
    >
      <label className={cx("rmc-slider__label", classNames?.label)}>
        {label} (CC{ccNumber})
      </label>
      <div className={cx("rmc-slider__track", classNames?.track)}>
        <div className={cx("rmc-slider__fill", classNames?.fill)} />
        <div className={cx("rmc-slider__thumb", classNames?.thumb)} />
      </div>
      <div className={cx("rmc-slider__value", classNames?.value)}>
        {sliderValue.toFixed(1)}
      </div>
    </div>
  )
}
