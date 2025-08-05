// Web MIDI API Type Definitions
interface MIDIOptions {
  sysex?: boolean
  software?: boolean
}

interface MIDIAccess extends EventTarget {
  readonly inputs: MIDIInputMap
  readonly outputs: MIDIOutputMap
  readonly sysexEnabled: boolean
  onstatechange: ((this: MIDIAccess, ev: MIDIConnectionEvent) => any) | null
}

interface MIDIInputMap extends ReadonlyMap<string, MIDIInput> {}
interface MIDIOutputMap extends ReadonlyMap<string, MIDIOutput> {}

interface MIDIPort extends EventTarget {
  readonly id: string
  readonly manufacturer?: string
  readonly name?: string
  readonly type: MIDIPortType
  readonly version?: string
  readonly state: MIDIPortDeviceState
  readonly connection: MIDIPortConnectionState
  onstatechange: ((this: MIDIPort, ev: MIDIConnectionEvent) => any) | null
  open(): Promise<MIDIPort>
  close(): Promise<MIDIPort>
}

interface MIDIInput extends MIDIPort {
  readonly type: "input"
  onmidimessage: ((this: MIDIInput, ev: MIDIMessageEvent) => any) | null
}

interface MIDIOutput extends MIDIPort {
  readonly type: "output"
  send(data: Uint8Array | number[], timestamp?: number): void
  clear(): void
}

interface MIDIMessageEvent extends Event {
  readonly data: Uint8Array
  readonly timeStamp: number
}

interface MIDIConnectionEvent extends Event {
  readonly port: MIDIPort
}

type MIDIPortType = "input" | "output"
type MIDIPortDeviceState = "disconnected" | "connected"
type MIDIPortConnectionState = "open" | "closed" | "pending"

declare global {
  interface Navigator {
    requestMIDIAccess(options?: MIDIOptions): Promise<MIDIAccess>
  }
}

export {}
