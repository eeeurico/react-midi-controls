import React from "react"
import { useMidiDevices } from "../hooks/useMidiDevices"
import "./DeviceSelector.css"

export const DeviceSelector: React.FC = () => {
  const {
    devices,
    selectedDevice,
    isConnected,
    error,
    isLoading,
    selectDeviceById,
    disconnect,
    refreshDevices,
  } = useMidiDevices()

  const handleDeviceSelect = (deviceId: string) => {
    if (selectedDevice?.id === deviceId) {
      disconnect()
    } else {
      selectDeviceById(deviceId)
    }
  }

  if (error) {
    return (
      <div className="device-selector error">
        <div className="error-message">
          <h3>MIDI Error</h3>
          <p>{error}</p>
          <button onClick={refreshDevices}>Retry</button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="device-selector">
        <div className="loading-message">
          <h3>Loading MIDI Devices...</h3>
        </div>
      </div>
    )
  }

  const inputDevices = devices.filter((device) => device.type === "input")

  return (
    <div className="device-selector">
      <h3>MIDI Input Devices</h3>
      {inputDevices.length === 0 ? (
        <div className="no-devices">
          <p>No MIDI input devices found.</p>
          <p>Please connect a MIDI device and refresh the page.</p>
          <button onClick={refreshDevices}>Refresh</button>
        </div>
      ) : (
        <div className="device-list">
          {inputDevices.map((device) => (
            <button
              key={device.id}
              className={`device-button ${
                selectedDevice?.id === device.id ? "selected" : ""
              } ${device.state === "connected" ? "connected" : "disconnected"}`}
              onClick={() => handleDeviceSelect(device.id)}
              disabled={device.state !== "connected"}
            >
              <div className="device-info">
                <div className="device-name">{device.name}</div>
                {device.manufacturer && (
                  <div className="device-manufacturer">
                    {device.manufacturer}
                  </div>
                )}
                <div className="device-status">
                  {device.state === "connected" ? (
                    selectedDevice?.id === device.id ? (
                      <span className="status-connected">● Connected</span>
                    ) : (
                      <span className="status-available">○ Available</span>
                    )
                  ) : (
                    <span className="status-disconnected">○ Disconnected</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
      {isConnected && selectedDevice && (
        <div className="connection-status">
          <p>
            ✓ Connected to: <strong>{selectedDevice.name}</strong>
          </p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      )}
    </div>
  )
}
