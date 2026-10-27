import { useState, useEffect, useCallback, useRef } from "react"
import type { MIDIDevice, UseMidiDevicesResult } from "./types"

export const useMidiDevices = (
  autoSelectFirst = true
): UseMidiDevicesResult => {
  const [devices, setDevices] = useState<MIDIDevice[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [manuallyDisconnected, setManuallyDisconnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [accessAttempt, setAccessAttempt] = useState(0)
  const midiAccessRef = useRef<MIDIAccess | null>(null)

  // Update device list from MIDI access
  const updateDeviceList = useCallback((access: MIDIAccess) => {
    const deviceList: MIDIDevice[] = []

    // Get input devices
    access.inputs.forEach((input) => {
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
  }, [])

  // Initialize MIDI access (re-runs when refreshDevices retries after a failure)
  useEffect(() => {
    let isMounted = true
    let access: MIDIAccess | null = null

    const handleStateChange = () => {
      if (isMounted && access) {
        updateDeviceList(access)
      }
    }

    const initializeMIDI = async () => {
      try {
        setIsLoading(true)
        setError(null)

        if (!navigator.requestMIDIAccess) {
          throw new Error("Web MIDI API not supported in this browser")
        }

        access = await navigator.requestMIDIAccess()

        if (!isMounted) return

        midiAccessRef.current = access

        // Listen for device changes
        access.addEventListener("statechange", handleStateChange)

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
      access?.removeEventListener("statechange", handleStateChange)
    }
  }, [accessAttempt, updateDeviceList])

  // Derived from the current device list so it never goes stale: the chosen
  // device while it's connected, otherwise the first connected device (unless
  // auto-select is off or the user disconnected)
  const selectedDevice =
    devices.find((d) => d.id === selectedId && d.state === "connected") ??
    (autoSelectFirst && !manuallyDisconnected
      ? devices.find((d) => d.state === "connected")
      : undefined) ??
    null

  // Select a device
  const selectDevice = useCallback((device: MIDIDevice | null) => {
    setSelectedId(device?.id ?? null)
    setManuallyDisconnected(device === null)
  }, [])

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

  // Refresh device list, or retry MIDI access if it failed
  const refreshDevices = useCallback(() => {
    if (midiAccessRef.current) {
      updateDeviceList(midiAccessRef.current)
    } else {
      setAccessAttempt((attempt) => attempt + 1)
    }
  }, [updateDeviceList])

  return {
    devices,
    selectedDevice,
    isConnected: selectedDevice !== null,
    error,
    isLoading,
    selectDevice,
    selectDeviceById,
    disconnect,
    refreshDevices,
  }
}
