import React from "react"
import { useSlider } from "../hooks/useSlider"
import { cx, valueStyle } from "../utils/styling"
import type { KnobComponentProps } from "../hooks/types"
import "./theme.css"
import "./MidiControls.css"

export const KnobComponent: React.FC<KnobComponentProps> = ({
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
  const knobValue = useSlider({
    ccNumber,
    channel,
    range,
    min,
    max,
    defaultValue,
  })

  // Rotation comes from --rmc-value in CSS (see --rmc-knob-sweep)
  return (
    <div
      className={cx("rmc-knob", className, classNames?.root)}
      style={valueStyle(knobValue, range, style)}
    >
      <label className={cx("rmc-knob__label", classNames?.label)}>
        {label} (CC{ccNumber})
      </label>
      <div className={cx("rmc-knob__dial", classNames?.dial)}>
        <div className={cx("rmc-knob__indicator", classNames?.indicator)} />
      </div>
      <div className={cx("rmc-knob__value", classNames?.value)}>
        {knobValue.toFixed(1)}
      </div>
    </div>
  )
}
