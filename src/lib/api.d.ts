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
  limit?: integer,
}

export type WorkflowLog = {
  level: string,
  timestamp: string,
  message: string,
  context: {
    subscriber_id: string,
    user_id: string,
    workflow_id: string,
  }
}

export type WorkflowLogQuery = {
  workflow_id?: string,
  user_id?: string,
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

export type Venue = {
  venue_id: string,
  venue_name: string,
}

export type Venues = Venue[]

export type VenueResults = {
  results: Venues,
}

export type Position = {
  position_id: string,
  tags: string[],
  venue_id: string,
}

export type Positions = Position[]

export type PositionResults = {
  results: Positions,
}

export type RawAuditEvent = {
  audit_id: string,
  action: string,
  data?: string,
  timestamp_action: string,
}

export type ProfileAuditEvent = Omit<RawAuditEvent, `data`> & {
  id: string,
  device_id: string,
}

export type RawAuditEventResults = {
  data: RawAuditEvent[],
  cursor: string,
}

export type ProfileAuditEventResults = {
  results: ProfileAuditEvent[],
  cursor: string,
}

export type AuditEventType = `ibot_user_profile`

export type PagingParams = {
  latest?: string,
  oldest?: string,
  cursor?: string,
  limit?: number,
}

export type TaskResults = {
  results: Task[],
}


export type TaskArgs = Record<string, unknown> & Record<`tags`, string[]>

export type TaskGroupMembers = Record<string, unknown>

export type NewTask = {
  task_name: string,
  task_type_name: string,
  task_type_namespace: string,
  task_type_major: integer,
  args: TaskArgs,
}

export type Task = NewTask & {
  workflow_instance_id: string,
  workflow_id: string,
  task_id: string,
  timestamp: string,
  status: string,
  subscriber_id: string
}

export type NewScheduledTask = NewTask & {
  timezone: string,
  start_time: string,
  frequency?: string,
  count?: integer,
  until?: string
}

export type ScheduledTask = Task & {
  scheduled_task_id: string,
  timezone: string,
  start_time: string,
  frequency?: string,
  count?: integer,
  until?: string
}

export type NewMinor = {
  capsule_source: string,
  comment: string
}

export type Minor = NewMinor & {
  minor: integer
}

export type NewMajor = {
  minor: NewMinor
}

export type Major = {
  major: integer,
  capsule_source: string,
  comment: string
}

export type TaskType = {
  name: string,
  major: NewMajor
}

export type TaskGroup = {
  timestamp: string,
  task_type_namespace: string,
  task_type_major: integer,
  subscriber_id: string,
  task_type_name: string,
  group_name: string,
  task_group_id: string
}


export type TaskTypeDump = {
  type: string,
  major: number,
  minor: number,
  comment: string
}

export type NewTaskGroup = {
  group_name: string,
  task_type_namespace: string,
  task_type_name: string,
  task_type_major: integer,
  members: TaskGroupMembers
}

export type TaskTypeResults = {
  results: TaskType[]
}

export type MajorResults = {
  results: Major[]
}

export type MinorResults = {
  results: Minor[]
}

export type TaskGroupResults = {
  results: TaskGroup[]
}
export type IntegrationConfig = Record<string, unknown>

export type ResourceEntity = {
  entity_attributes: {
    tag_type: `user`,
  },
  entity_id: string,
  entity_type: string,
  resource_entity_id: string,
  resource_folder_id: string,
  subscriber_id: string,
}

export type ResourceFolder = {
  folder_name: string,
  resource_folder_id: string,
  parent_id?: string,
  subscriber_id: string,
}

export type ResourceResults = {
  results: {
    folder: ResourceFolder,
    folders: ResourceFolder[],
    entities: ResourceEntity[],
  }
}
