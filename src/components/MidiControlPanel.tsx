import React from "react"
import { cx } from "../utils/styling"
import type { MidiControlPanelProps } from "../hooks/types"
import "./theme.css"
import "./MidiControls.css"

export const MidiControlPanel: React.FC<MidiControlPanelProps> = ({
  children,
  className,
  style,
  classNames,
}) => {
  // We'll let individual controls manage their own MIDI connections
  // This component just provides a container
  return (
    <div className={cx("rmc-panel", className, classNames?.root)} style={style}>
      <div className={cx("rmc-panel__grid", classNames?.grid)}>{children}</div>
    </div>
  )
}
