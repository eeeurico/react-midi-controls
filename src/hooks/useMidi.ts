import { useState, useEffect, useCallback } from "react"
import type { MIDIMessage, MIDIDevice } from "./types"

// Main MIDI context hook
export const useMidi = () => {
  const [midiAccess, setMidiAccess] = useState<any>(null)
  const [devices, setDevices] = useState<MIDIDevice[]>([])
  const [selectedDevice, setSelectedDevice] = useState<any>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize MIDI access
  useEffect(() => {
    if (!navigator.requestMIDIAccess) {
      setError("Web MIDI API not supported in this browser")
      return
    }

    navigator
      .requestMIDIAccess()
      .then((access) => {
        setMidiAccess(access)
        updateDevices(access)

        // Listen for device changes
        access.onstatechange = () => updateDevices(access)
      })
      .catch((err) => {
        setError(`Failed to access MIDI devices: ${err.message}`)
      })
  }, [])

  const updateDevices = useCallback((access: any) => {
    const deviceList: MIDIDevice[] = []

    // Add input devices
    access.inputs.forEach((input: any) => {
      deviceList.push({
        id: input.id,
        name: input.name || "Unknown Device",
        manufacturer: input.manufacturer || undefined,
        type: "input",
        state: input.state,
        connection: input.connection,
      })
    })

    // Add output devices
    access.outputs.forEach((output: any) => {
      deviceList.push({
        id: output.id,
        name: output.name || "Unknown Device",
        manufacturer: output.manufacturer || undefined,
        type: "output",
        state: output.state,
        connection: output.connection,
      })
    })

    setDevices(deviceList)
  }, [])

  const connectToDevice = useCallback(
    (deviceId: string) => {
      if (!midiAccess) return false

      const input = midiAccess.inputs.get(deviceId)
      if (input) {
        setSelectedDevice(input)
        setIsConnected(true)
        return true
      }
      return false
    },
    [midiAccess]
  )

  const disconnect = useCallback(() => {
    setSelectedDevice(null)
    setIsConnected(false)
  }, [])

  return {
    midiAccess,
    devices,
    selectedDevice,
    isConnected,
    error,
    connectToDevice,
    disconnect,
  }
}
