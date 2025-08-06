import React from "react"
import { useMidiDevices } from "react-midi-controls"

// Example 1: Simple dropdown selector
export const SimpleDeviceSelector: React.FC = () => {
  const {
    devices,
    selectedDevice,
    isConnected,
    isLoading,
    error,
    selectDeviceById,
    disconnect,
  } = useMidiDevices()

  if (isLoading) return <div>Loading MIDI devices...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <select
        value={selectedDevice?.id || ""}
        onChange={(e) => selectDeviceById(e.target.value)}
      >
        <option value="">Select a device...</option>
        {devices.map((device) => (
          <option key={device.id} value={device.id}>
            {device.name} ({device.state})
          </option>
        ))}
      </select>

      {isConnected && selectedDevice && (
        <div>
          ✅ Connected to: <strong>{selectedDevice.name}</strong>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      )}
    </div>
  )
}

// Example 2: Card-based selector with auto-select disabled
export const CardDeviceSelector: React.FC = () => {
  const { devices, selectedDevice, isConnected, selectDevice, refreshDevices } =
    useMidiDevices(false) // Don't auto-select first device

  return (
    <div>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button onClick={refreshDevices}>Refresh Devices</button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "10px",
        }}
      >
        {devices.map((device) => (
          <div
            key={device.id}
            onClick={() => selectDevice(device)}
            style={{
              border:
                selectedDevice?.id === device.id
                  ? "2px solid blue"
                  : "1px solid #ccc",
              padding: "15px",
              borderRadius: "8px",
              cursor: "pointer",
              backgroundColor:
                device.state === "connected" ? "#f0f8ff" : "#f5f5f5",
            }}
          >
            <h4>{device.name}</h4>
            <p>{device.manufacturer}</p>
            <span
              style={{
                color: device.state === "connected" ? "green" : "red",
                fontWeight: "bold",
              }}
            >
              {device.state}
            </span>
            {selectedDevice?.id === device.id && isConnected && (
              <div style={{ color: "blue", marginTop: "5px" }}>✅ Active</div>
            )}
          </div>
        ))}
      </div>

      {devices.length === 0 && (
        <p>No MIDI devices found. Connect a MIDI controller and refresh.</p>
      )}
    </div>
  )
}

// Example 3: Minimal status indicator
export const MidiStatus: React.FC = () => {
  const { selectedDevice, isConnected, devices } = useMidiDevices()

  if (!isConnected) {
    return (
      <div style={{ color: "red" }}>
        ❌ No MIDI device connected ({devices.length} available)
      </div>
    )
  }

  return (
    <div style={{ color: "green" }}>
      🎹 Connected to: {selectedDevice?.name}
    </div>
  )
}

// Example 4: Device list with manual controls
export const AdvancedDeviceManager: React.FC = () => {
  const {
    devices,
    selectedDevice,
    isConnected,
    isLoading,
    error,
    selectDevice,
    disconnect,
    refreshDevices,
  } = useMidiDevices(true) // Auto-select first device

  const connectToDevice = (device: any) => {
    if (selectedDevice?.id === device.id) {
      disconnect()
    } else {
      selectDevice(device)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h3>MIDI Device Manager</h3>

        <div style={{ marginBottom: "10px" }}>
          <button onClick={refreshDevices} disabled={isLoading}>
            {isLoading ? "Loading..." : "Refresh Devices"}
          </button>
          {isConnected && (
            <button onClick={disconnect} style={{ marginLeft: "10px" }}>
              Disconnect All
            </button>
          )}
        </div>

        {error && (
          <div style={{ color: "red", marginBottom: "10px" }}>
            Error: {error}
          </div>
        )}

        {isConnected && selectedDevice && (
          <div style={{ color: "green", marginBottom: "10px" }}>
            ✅ Connected to: <strong>{selectedDevice.name}</strong>
          </div>
        )}
      </div>

      <div>
        <h4>Available Devices ({devices.length})</h4>
        {devices.length === 0 ? (
          <p>No MIDI devices found.</p>
        ) : (
          <ul>
            {devices.map((device) => (
              <li key={device.id} style={{ marginBottom: "10px" }}>
                <button
                  onClick={() => connectToDevice(device)}
                  disabled={device.state !== "connected"}
                  style={{
                    padding: "10px",
                    backgroundColor:
                      selectedDevice?.id === device.id ? "#007bff" : "#f8f9fa",
                    color: selectedDevice?.id === device.id ? "white" : "black",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    cursor:
                      device.state === "connected" ? "pointer" : "not-allowed",
                  }}
                >
                  <div>
                    <strong>{device.name}</strong>
                    {device.manufacturer && (
                      <div>
                        <small>{device.manufacturer}</small>
                      </div>
                    )}
                    <div>
                      <small>State: {device.state}</small>
                      {selectedDevice?.id === device.id && isConnected && (
                        <span
                          style={{ marginLeft: "10px", color: "lightgreen" }}
                        >
                          ● Active
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
