
export type DeviceId = string

export type DeviceIds = {
  devices: DeviceId[]
}

export type ArgValueType = string | number | boolean

export type Args = {
  [x: string]: ArgValueType
}

type StartWorkflow = {
  workflow: {
    uri: string,
    args: Args
  }
}

// type OnTimerTrigger = {
//   on_timer?: {
//     start_time: string
//   }
// }

// type OnButtonTrigger = {
//   on_button?: string
// }

// type OnPhraseTrigger = {
//   on_phrase?: string
// }

// type OnDeviceEventTrigger = {
//   on_device_event?: `emergency`
// }

export type Workflow = {
  workflow_id: string
  name: string,
  install: string[],
  options: {
    hidden: boolean
    transient: boolean
    allow_remote_invoke: boolean
  }
  config: {
    trigger: {
      start: StartWorkflow
    }
  }
}

export type NewWorkflow = Omit<Workflow, `workflow_id`>

export type Workflows = {
  results: Workflow[]
}
