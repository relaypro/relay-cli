
export type DeviceId = string

export type DeviceIds = {
  devices: DeviceId[]
}

export type Subscriber = {
  subscriber_id: string,
  users: string[]
}

export type Group = {
  group_id: string,
  name: string,
  owner: string,
  subscribers: Subscriber[],
}

export type ArgValueType = string | number | boolean | string[]

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
