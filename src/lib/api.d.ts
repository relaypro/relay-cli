
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

export type Capability =
  `sip_register` |
  `enable_audit_logs` |
  `escalated_sos` |
  `group_transcriptions` |
  `group_translations` |
  `remote_push_notifications` |
  `sos` |
  `ui_nfc` |
  `ui_user_profiles` |
  `devmon_event_support` |
  `dnd` |
  `eavesdrop_support` |
  `enable_team_support` |
  `intent_support` |
  `calling_between_devices_support` |
  `allow_sos_override` |
  `group_persistence` |
  `ui_translate` |
  `audit_rich_logging` |
  `calling` |
  `geofencing` |
  `indoor_positioning` |
  `offnet_calling` |
  `pstn_calling` |
  `ui_work_tracking` |
  `virtual_device_location_reporting` |
  `location_history` |
  `workflow_sdk` |
  `location` |
  `ui_allow_incident_resolution` |
  `ui_summon` |
  `background_audio` |
  `low_latency_audio`

export type Capabilities = Record<Capability, boolean>

export type SubscriberInfo = {
  capabilities: Capabilities
}
