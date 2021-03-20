
export type DeviceId = string

export interface DeviceIds {
  devices: DeviceId[]
}

export interface Workflows {
  results: Workflow[]
}

export type ArgValueType = string | number | boolean

export type Args = {
  [x: string]: ArgValueType
}

interface StartWorkflow {
  workflow: {
    uri: string,
    args: Args
  }
}

interface OnTimerTrigger {
  on_timer: {
    start_time: string
  }
  start: StartWorkflow
}

interface OnButtonTrigger {
  on_phrase?: string
  start: StartWorkflow
}

interface OnPhraseTrigger {
  on_phrase: string
  start: StartWorkflow
}

interface OnDeviceEvent {
  on_device_event: `emergency`
  start: StartWorkflow
}

export interface Workflow {
  workflow_id: string
  name: string,
  install: string[],
  options?: {
    hidden?: boolean
    transient?: boolean
    remote_invoke?: boolean
  }
  config: {
    trigger:
      OnButtonTrigger |
      OnPhraseTrigger |
      OnTimerTrigger |
      OnDeviceEvent
  }
}
