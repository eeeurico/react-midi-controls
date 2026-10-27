import React from "react"
import { useMidiContext } from "../contexts/MidiContext"
import { cx } from "../utils/styling"
import type { DeviceSelectorProps } from "../hooks/types"
import "./theme.css"
import "./DeviceSelector.css"

export const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  className,
  style,
  classNames,
}) => {
  const {
    devices,
    selectedDevice,
    isConnected,
    error,
    isLoading,
    selectDeviceById,
    disconnect,
    refreshDevices,
  } = useMidiContext()

  const handleDeviceSelect = (deviceId: string) => {
    if (selectedDevice?.id === deviceId) {
      disconnect()
    } else {
      selectDeviceById(deviceId)
    }
  }

  const rootClassName = cx("rmc-device-selector", className, classNames?.root)
  const titleClassName = cx("rmc-device-selector__title", classNames?.title)
  const actionClassName = cx("rmc-device-selector__action", classNames?.action)

  if (error) {
    return (
      <div className={rootClassName} style={style} data-state="error">
        <h3 className={titleClassName}>MIDI Error</h3>
        <p className={cx("rmc-device-selector__error", classNames?.error)}>
          {error}
        </p>
        <button className={actionClassName} onClick={refreshDevices}>
          Retry
        </button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={rootClassName} style={style} data-state="loading">
        <h3 className={titleClassName}>Loading MIDI Devices...</h3>
      </div>
    )
  }

  const inputDevices = devices.filter((device) => device.type === "input")

  return (
    <div className={rootClassName} style={style} data-state="ready">
      <h3 className={titleClassName}>MIDI Input Devices</h3>
      {inputDevices.length === 0 ? (
        <div className={cx("rmc-device-selector__empty", classNames?.empty)}>
          <p>No MIDI input devices found.</p>
          <p>Please connect a MIDI device and refresh the page.</p>
          <button className={actionClassName} onClick={refreshDevices}>
            Refresh
          </button>
        </div>
      ) : (
        <div className={cx("rmc-device-selector__list", classNames?.list)}>
          {inputDevices.map((device) => {
            const isSelected = selectedDevice?.id === device.id
            const isAvailable = device.state === "connected"

            return (
              <button
                key={device.id}
                className={cx("rmc-device-selector__device", classNames?.device)}
                data-selected={isSelected ? "" : undefined}
                data-state={device.state}
                onClick={() => handleDeviceSelect(device.id)}
                disabled={!isAvailable}
              >
                <span
                  className={cx(
                    "rmc-device-selector__device-name",
                    classNames?.deviceName
                  )}
                >
                  {device.name}
                </span>
                {device.manufacturer && (
                  <span
                    className={cx(
                      "rmc-device-selector__device-manufacturer",
                      classNames?.deviceManufacturer
                    )}
                  >
                    {device.manufacturer}
                  </span>
                )}
                <span
                  className={cx(
                    "rmc-device-selector__device-status",
                    classNames?.deviceStatus
                  )}
                >
                  {!isAvailable
                    ? "○ Disconnected"
                    : isSelected
                      ? "● Connected"
                      : "○ Available"}
                </span>
              </button>
            )
          })}
        </div>
      )}
      {isConnected && selectedDevice && (
        <div className={cx("rmc-device-selector__status", classNames?.status)}>
          <p>
            ✓ Connected to: <strong>{selectedDevice.name}</strong>
          </p>
          <button className={actionClassName} onClick={disconnect}>
            Disconnect
          </button>
        </div>
      )}
    </div>
  )
}
