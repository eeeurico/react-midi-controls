import { useState, useEffect, useCallback } from "react"
import "./App.css"

interface MIDIMessage {
  id: number
  timestamp: number
  type: string
  channel: number
  note?: number
  velocity?: number
  controller?: number
  value?: number
  raw: Uint8Array
}

interface MIDIControl {
  type: "note" | "controller" | "pitchbend"
  channel: number
  number: number
  min: number
  max: number
  current: number
  isRelative?: boolean // For knobs that send relative changes
}

function App() {
  const [midiAccess, setMidiAccess] = useState<any>(null)
  const [selectedDevice, setSelectedDevice] = useState<any>(null)
  const [devices, setDevices] = useState<any[]>([])
  const [messages, setMessages] = useState<MIDIMessage[]>([])
  const [controls, setControls] = useState<Map<string, MIDIControl>>(new Map())
  const [messageId, setMessageId] = useState(0)

  // Initialize MIDI access
  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      navigator
        .requestMIDIAccess()
        .then((access: any) => {
          setMidiAccess(access)
          updateDevices(access)

          // Listen for device changes
          access.onstatechange = () => updateDevices(access)
        })
        .catch((error) => {
          console.error("Failed to access MIDI devices:", error)
        })
    } else {
      console.error("Web MIDI API not supported")
    }
  }, [])

  const updateDevices = (access: any) => {
    const inputs: any[] = []
    access.inputs.forEach((input: any) => inputs.push(input))
    setDevices(inputs)
  }

  const parseMIDIMessage = (
    data: Uint8Array
  ): Omit<MIDIMessage, "id" | "timestamp"> => {
    const [status, data1, data2] = data
    const messageType = status & 0xf0
    const channel = (status & 0x0f) + 1

    switch (messageType) {
      case 0x90: // Note On
        return {
          type: "Note On",
          channel,
          note: data1,
          velocity: data2,
          raw: data,
        }
      case 0x80: // Note Off
        return {
          type: "Note Off",
          channel,
          note: data1,
          velocity: data2,
          raw: data,
        }
      case 0xb0: // Control Change
        return {
          type: "Control Change",
          channel,
          controller: data1,
          value: data2,
          raw: data,
        }
      case 0xe0: // Pitch Bend
        // MIDI pitch bend: LSB in data1, MSB in data2
        // Standard range is 0-16383 with 8192 as center
        const pitchValue = data1 | (data2 << 7)
        return {
          type: "Pitch Bend",
          channel,
          value: pitchValue,
          raw: data,
        }
      default:
        return {
          type: `Unknown (0x${messageType.toString(16)})`,
          channel,
          raw: data,
        }
    }
  }

  const handleMIDIMessage = useCallback(
    (event: any) => {
      if (!event.data) return

      const parsedMessage = parseMIDIMessage(event.data)
      const newMessage: MIDIMessage = {
        id: messageId,
        timestamp: event.timeStamp,
        ...parsedMessage,
      }

      setMessageId((prev) => prev + 1)
      setMessages((prev) => [newMessage, ...prev.slice(0, 49)]) // Keep last 50 messages

      // Update controls map
      if (
        parsedMessage.type === "Control Change" &&
        parsedMessage.controller !== undefined &&
        parsedMessage.value !== undefined
      ) {
        const { controller, value } = parsedMessage
        const controlKey = `cc_${parsedMessage.channel}_${controller}`
        setControls((prev) => {
          const newControls = new Map(prev)
          const existing = newControls.get(controlKey)

          // Detect if this is a relative knob (values jump between 1 and 65)
          const isRelativeKnob =
            existing &&
            ((existing.current <= 10 && value >= 60) ||
              (existing.current >= 60 && value <= 10) ||
              value === 1 ||
              value === 65) // Common relative knob values

          if (isRelativeKnob || (!existing && (value === 1 || value === 65))) {
            // Handle relative knob - increment/decrement from current position
            const direction = value === 1 ? 1 : -1 // 1 = right/up, 65 = left/down
            const currentValue = existing ? existing.current : 64 // Start at middle if new
            const newValue = Math.max(
              0,
              Math.min(127, currentValue + direction)
            )

            newControls.set(controlKey, {
              type: "controller",
              channel: parsedMessage.channel,
              number: controller,
              min: 0,
              max: 127,
              current: newValue,
              isRelative: true,
            })
          } else {
            // Handle absolute control (normal slider/fader)
            newControls.set(controlKey, {
              type: "controller",
              channel: parsedMessage.channel,
              number: controller,
              min: existing ? Math.min(existing.min, value) : value,
              max: existing ? Math.max(existing.max, value) : value,
              current: value,
              isRelative: false,
            })
          }
          return newControls
        })
      }

      // Handle pitch bend
      if (
        parsedMessage.type === "Pitch Bend" &&
        parsedMessage.value !== undefined
      ) {
        const pitchValue = parsedMessage.value
        const controlKey = `pb_${parsedMessage.channel}`
        setControls((prev) => {
          const newControls = new Map(prev)
          newControls.set(controlKey, {
            type: "pitchbend",
            channel: parsedMessage.channel,
            number: 0, // Pitch bend doesn't have a controller number
            min: 0, // Pitch bend always ranges from 0
            max: 16256, // to 16383 (14-bit) - center is 8192
            current: pitchValue,
            isRelative: false,
          })
          return newControls
        })
      }
    },
    [messageId]
  )

  const selectDevice = (device: any) => {
    // Remove listener from previous device
    if (selectedDevice) {
      selectedDevice.onmidimessage = null
    }

    // Add listener to new device
    device.onmidimessage = handleMIDIMessage
    setSelectedDevice(device)
    setMessages([]) // Clear previous messages
    setControls(new Map()) // Clear previous controls
  }

  const sendControlChange = (
    channel: number,
    controller: number,
    value: number
  ) => {
    if (!midiAccess) return

    // Find an output device (for testing)
    const outputs = Array.from(midiAccess.outputs.values())
    if (outputs.length > 0) {
      const message = [0xb0 | (channel - 1), controller, value]
      const output = outputs[0] as any
      output.send(new Uint8Array(message))
    }
  }

  const sendPitchBend = (channel: number, value: number) => {
    if (!midiAccess) return

    // Find an output device (for testing)
    const outputs = Array.from(midiAccess.outputs.values())
    if (outputs.length > 0) {
      // Convert 14-bit pitch bend value to two 7-bit values
      const lsb = value & 0x7f
      const msb = (value >> 7) & 0x7f
      const message = [0xe0 | (channel - 1), lsb, msb]
      const output = outputs[0] as any
      output.send(new Uint8Array(message))
    }
  }

  const clearMessages = () => {
    setMessages([])
    setControls(new Map())
  }

  return (
    <div className="midi-controller-app">
      <h1>MIDI Controller Tester</h1>

      <div className="device-selection">
        <h2>Select MIDI Device</h2>
        {devices.length === 0 ? (
          <p>
            No MIDI devices found. Make sure your MIDI controller is connected.
          </p>
        ) : (
          <select
            value={selectedDevice?.id || ""}
            onChange={(e) => {
              const device = devices.find((d) => d.id === e.target.value)
              if (device) selectDevice(device)
            }}
          >
            <option value="">Select a device...</option>
            {devices.map((device) => (
              <option key={device.id} value={device.id}>
                {device.name || "Unknown Device"}
              </option>
            ))}
          </select>
        )}
      </div>

      {selectedDevice && (
        <>
          <div className="current-device">
            <h3>Connected to: {selectedDevice.name}</h3>
            <button onClick={clearMessages}>Clear Messages</button>
          </div>

          <div className="controls-section">
            <h2>Detected Controls</h2>
            {controls.size === 0 ? (
              <p>Move knobs, sliders, or press buttons to detect controls...</p>
            ) : (
              <div className="controls-grid">
                {Array.from(controls.entries()).map(([key, control]) => (
                  <div key={key} className="control-item">
                    <h4>
                      {control.type === "pitchbend"
                        ? `Pitch Bend (Ch. ${control.channel})`
                        : `CC ${control.number} (Ch. ${control.channel})`}
                      {control.isRelative && " - Knob"}
                    </h4>
                    <div className="control-info">
                      <span>
                        Range: {control.min} - {control.max}
                      </span>
                      <span>Current: {control.current}</span>
                      {control.isRelative && (
                        <span className="control-type">Relative</span>
                      )}
                    </div>
                    <input
                      type="range"
                      min={
                        control.isRelative
                          ? 0
                          : control.type === "pitchbend"
                          ? 0
                          : control.min
                      }
                      max={
                        control.isRelative
                          ? 127
                          : control.type === "pitchbend"
                          ? 16256
                          : control.max
                      }
                      value={control.current}
                      onChange={(e) => {
                        const value = parseInt(e.target.value)

                        if (control.type === "pitchbend") {
                          sendPitchBend(control.channel, value)
                        } else {
                          sendControlChange(
                            control.channel,
                            control.number,
                            value
                          )
                        }

                        setControls((prev) => {
                          const newControls = new Map(prev)
                          const updated = { ...control, current: value }
                          // Update range for non-relative controls
                          if (
                            !control.isRelative &&
                            control.type !== "pitchbend"
                          ) {
                            updated.min = Math.min(updated.min, value)
                            updated.max = Math.max(updated.max, value)
                          }
                          newControls.set(key, updated)
                          return newControls
                        })
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="messages-section">
            <h2>MIDI Messages</h2>
            <div className="messages-list">
              {messages.length === 0 ? (
                <p>No messages received yet...</p>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="message-item">
                    <div className="message-header">
                      <span className="message-type">{message.type}</span>
                      <span className="message-channel">
                        Ch. {message.channel}
                      </span>
                      <span className="message-time">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="message-details">
                      {message.note !== undefined && (
                        <span>
                          Note: {message.note} Velocity: {message.velocity}
                        </span>
                      )}
                      {message.controller !== undefined && (
                        <span>
                          CC: {message.controller} Value: {message.value}
                        </span>
                      )}
                      {message.value !== undefined &&
                        message.controller === undefined &&
                        message.note === undefined && (
                          <span>Value: {message.value}</span>
                        )}
                      <span className="raw-data">
                        Raw: [
                        {Array.from(message.raw)
                          .map((b) => b.toString(16).padStart(2, "0"))
                          .join(", ")}
                        ]
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default App
