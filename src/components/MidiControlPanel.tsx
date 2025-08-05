import React from "react"

interface MidiControlPanelProps {
  children: React.ReactNode
}

export const MidiControlPanel: React.FC<MidiControlPanelProps> = ({
  children,
}) => {
  // We'll let individual controls manage their own MIDI connections
  // This component just provides a container
  return (
    <div className="midi-control-panel">
      <div className="controls-grid">{children}</div>
    </div>
  )
}
