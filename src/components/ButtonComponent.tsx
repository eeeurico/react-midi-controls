import React from "react"
import { useButton } from "../hooks/useButton"
import { cx } from "../utils/styling"
import type { ButtonComponentProps } from "../hooks/types"
import "./theme.css"
import "./MidiControls.css"

export const ButtonComponent: React.FC<ButtonComponentProps> = ({
  ccNumber,
  channel,
  label,
  defaultValue = false,
  className,
  style,
  classNames,
}) => {
  const isPressed = useButton({ ccNumber, channel, defaultValue })

  return (
    <div
      className={cx("rmc-button", className, classNames?.root)}
      style={style}
      data-pressed={isPressed ? "" : undefined}
    >
      <div className={cx("rmc-button__pad", classNames?.pad)}>
        <div className={cx("rmc-button__inner", classNames?.inner)} />
      </div>
      <label className={cx("rmc-button__label", classNames?.label)}>
        {label} (CC{ccNumber})
      </label>
      <div className={cx("rmc-button__value", classNames?.value)}>
        Value: {isPressed ? "Pressed" : "Released"}
      </div>
    </div>
  )
}
