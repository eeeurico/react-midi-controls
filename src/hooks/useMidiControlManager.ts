import { useEffect, useCallback } from "react"
import { useMidi } from "./useMidi"

interface MIDIControlHandler {
  handleMIDIMessage: (event: any) => void
}

// Hook to manage multiple MIDI controls with a single device connection
export const useMidiControlManager = (controls: MIDIControlHandler[]) => {
  const { selectedDevice, isConnected } = useMidi()

  const handleAllMessages = useCallback(
    (event: any) => {
      controls.forEach((control) => {
        control.handleMIDIMessage(event)
      })
    },
    [controls]
  )

  useEffect(() => {
    if (!selectedDevice || !isConnected) return

    selectedDevice.onmidimessage = handleAllMessages

    return () => {
      if (selectedDevice) {
        selectedDevice.onmidimessage = null
      }
    }
  }, [selectedDevice, isConnected, handleAllMessages])

  return {
    isConnected,
    deviceName: selectedDevice?.name || "No device",
  }
}
