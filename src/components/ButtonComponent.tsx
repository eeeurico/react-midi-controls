import React from "react"
import { useButton } from "../hooks/useButton"
import type { ButtonComponentProps } from "../hooks/types"
import "./MidiControls.css"

export const ButtonComponent: React.FC<ButtonComponentProps> = ({
  ccNumber,
  channel,
  label,
  defaultValue = false,
}) => {
  const isPressed = useButton({ ccNumber, channel, defaultValue })

  return (
    <div className={`midi-button ${isPressed ? "pressed" : ""}`}>
      <div className="button-circle">
        <div className="button-inner" />
      </div>
      <label>
        {label} (CC{ccNumber})
      </label>
      <div className="button-value">
        Value: {isPressed ? "Pressed" : "Released"}
      </div>
    </div>
  )
}
