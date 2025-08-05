import React from "react"
import { useButton } from "../hooks/useButton"
import "./MidiControls.css"

interface ButtonComponentProps {
  ccNumber: number
  label: string
  defaultValue?: boolean
}

export const ButtonComponent: React.FC<ButtonComponentProps> = ({
  ccNumber,
  label,
  defaultValue = false,
}) => {
  const isPressed = useButton({ ccNumber, defaultValue })

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
