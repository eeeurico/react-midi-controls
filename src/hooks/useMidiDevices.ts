import { useState, useEffect, useCallback } from "react"
import type { MIDIDevice } from "./types"

export interface UseMidiDevicesResult {
  devices: MIDIDevice[]
  selectedDevice: MIDIDevice | null
  isConnected: boolean
  error: string | null
  isLoading: boolean
  selectDevice: (device: MIDIDevice | null) => void
  selectDeviceById: (deviceId: string) => void
  disconnect: () => void
  refreshDevices: () => void
}

export const useMidiDevices = (
  autoSelectFirst = true
): UseMidiDevicesResult => {
  const [devices, setDevices] = useState<MIDIDevice[]>([])
  const [selectedDevice, setSelectedDevice] = useState<MIDIDevice | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [midiAccess, setMidiAccess] = useState<any>(null)

  // Initialize MIDI access
  useEffect(() => {
    let isMounted = true

    const initializeMIDI = async () => {
      try {
        setIsLoading(true)
        setError(null)

        if (!navigator.requestMIDIAccess) {
          throw new Error("Web MIDI API not supported in this browser")
        }

        const access = await navigator.requestMIDIAccess()

        if (!isMounted) return

        setMidiAccess(access)

        // Listen for device changes
        access.onstatechange = () => {
          if (isMounted) {
            updateDeviceList(access)
          }
        }

        updateDeviceList(access)
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to access MIDI devices"
          )
          setIsLoading(false)
        }
      }
    }

    initializeMIDI()

    return () => {
      isMounted = false
      if (midiAccess) {
        midiAccess.onstatechange = null
      }
    }
  }, [])

  // Update device list from MIDI access
  const updateDeviceList = useCallback(
    (access: any) => {
      const deviceList: MIDIDevice[] = []

      // Get input devices
      access.inputs.forEach((input: any) => {
        deviceList.push({
          id: input.id,
          name: input.name || "Unknown Device",
          manufacturer: input.manufacturer || "Unknown",
          state: input.state,
          type: "input",
          connection: input.connection,
          input, // Store the actual input for message handling
        })
      })

      setDevices(deviceList)
      setIsLoading(false)

      // Auto-select first device if enabled and no device is selected
      if (autoSelectFirst && deviceList.length > 0 && !selectedDevice) {
        const firstAvailable = deviceList.find(
          (device) => device.state === "connected"
        )
        if (firstAvailable) {
          selectDevice(firstAvailable)
        }
      }

      // Check if currently selected device is still available
      if (
        selectedDevice &&
        !deviceList.find((d) => d.id === selectedDevice.id)
      ) {
        setSelectedDevice(null)
        setIsConnected(false)

        // Auto-select first available if current device was disconnected
        if (autoSelectFirst && deviceList.length > 0) {
          const firstAvailable = deviceList.find(
            (device) => device.state === "connected"
          )
          if (firstAvailable) {
            selectDevice(firstAvailable)
          }
        }
      }
    },
    [autoSelectFirst, selectedDevice]
  )

  // Select a device
  const selectDevice = useCallback(
    (device: MIDIDevice | null) => {
      // Disconnect current device
      if (selectedDevice?.input) {
        selectedDevice.input.onmidimessage = null
      }

      if (device && device.input && device.state === "connected") {
        setSelectedDevice(device)
        setIsConnected(true)
        setError(null)
      } else {
        setSelectedDevice(null)
        setIsConnected(false)
      }
    },
    [selectedDevice]
  )

  // Select device by ID
  const selectDeviceById = useCallback(
    (deviceId: string) => {
      const device = devices.find((d) => d.id === deviceId)
      selectDevice(device || null)
    },
    [devices, selectDevice]
  )

  // Disconnect current device
  const disconnect = useCallback(() => {
    selectDevice(null)
  }, [selectDevice])

  // Refresh device list
  const refreshDevices = useCallback(() => {
    if (midiAccess) {
      updateDeviceList(midiAccess)
    }
  }, [midiAccess, updateDeviceList])

  return {
    devices,
    selectedDevice,
    isConnected,
    error,
    isLoading,
    selectDevice,
    selectDeviceById,
    disconnect,
    refreshDevices,
  }
}
