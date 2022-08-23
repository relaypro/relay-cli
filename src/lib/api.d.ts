// Copyright © 2022 Relay Inc.

export type HttpMethod = `get`|`post`|`put`|`delete`

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

export type MergedWorkflowInstance = HistoricalWorkflowInstance & {
  workflow?: Workflow,
}

export type WorkflowInstance = {
  instance_id: string,
  subscriber_id: string,
  triggering_user_id: string,
  workflow_id: string,
  workflow_uri: string,
  status: string,
}

export type HistoricalWorkflowInstance = WorkflowInstance & {
  terminate_reason?: string,
  end_time?: string,
}

export type WorkflowEvent = {
  category: string,
  content: string,
  jsonContent?: Record<string, string>,
  content_type: string,
  id: string,
  sub_id: string,
  timestamp: string,
  workflow_id: string,
  workflow_instance_id: string,
  user_id?: string,
}

export type WorkflowEvents = WorkflowEvent[]
export type WorkflowEventResults = {
  data: WorkflowEvents,
  cursor: string,
}

export type WorkflowEventQuery = {
  workflow_id?: string,
  workflow_instance_id?: string,
  category?: string,
  source_type?: string,
  user_id?: string,
  latest?: number,
  oldest?: number,
  cursor?: string,
  limit?: number,
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

export type Geofence = {
  geofence_id: string,
  label: string,
  address: string,
  lat: string,
  long: string,
  radius: number,
}

export type GeofenceResults = {
  results: Geofence[]
}

type ContentKey = `type`|`type_id`|`content_type`|`category`|`analytics_content`

export type Tag = {
  content: Record<ContentKey|string, string>,
  counter: number,
  subscriber_id: string,
  tag_id: string,
  uid: string,
}

export type TagForCreate = Pick<Tag, [`content`]>

export type TagResults = {
  results: Tag[],
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
