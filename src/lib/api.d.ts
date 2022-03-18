
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
  install_rule?: string,
  install?: string[],
  options: {
    hidden: boolean,
    transient: boolean,
    absorb_triggers?: string[],
  }
  config: {
    trigger: {
      start: StartWorkflow,
    }
  }
}

export type NewWorkflow = Omit<Workflow, `workflow_id`>

export type Workflows = {
  results: Workflow[]
}

export type CustomAudio = {
  id?: string,
  subscriber_id: string,
  audio_format: string,
  short_name: string
}

export type CustomAudioUpload = {
  result: CustomAudio,
  s3_upload_url: string,
}

export type DayLabel = `MO`|`TU`|`WE`|`TH`|`TH`|`FR`|`SA`|`SU`
export type DayName = `Monday`|`Tuesday`|`Wednesday`|`Thursday`|`Friday`|`Saturday`|`Sunday`
export type DayValue = 1|2|3|4|5|6|7

export type Day = {
  label: DayLabel,
  name: DayName,
  value: DayValue,
}
