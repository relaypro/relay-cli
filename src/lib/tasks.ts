import { IntegrationConfig, NewScheduledTask, NewTask, NewTaskGroup, TaskArgs, TaskGroupMembers } from './api'
import { CreateTaskGroupArgs, ScheduleArgs, StartArgs } from './args'
import { IntegrationStartFlags, ScheduledTaskFlags } from './flags'

export const deviceUri = (deviceName: string): string => {
  let deviceUri = deviceName
  if (deviceName.substring(0,3) != `urn`) {
    deviceUri = `urn:relay-resource:name:device:` + encodeURI(deviceName.toLowerCase())
  }
  return deviceUri
}

export const createTask = async (startArgs: StartArgs): Promise<NewTask> => {
  const task: NewTask = {
    task_type_name: startArgs.type,
    task_type_major: +startArgs.major,
    task_name: startArgs.name,
    assign_to: [deviceUri(startArgs.assignTo)],
    task_type_namespace: startArgs.namespace,
    args: startArgs.args as TaskArgs,
  }
  return task
}

export const createScheduledTask = async (flags: ScheduledTaskFlags, scheduleArgs: ScheduleArgs): Promise<NewScheduledTask> => {
  const scheduledTask: NewScheduledTask = {
    task_type_name: scheduleArgs.type,
    task_type_major: +scheduleArgs.major,
    task_name: scheduleArgs.name,
    assign_to: [deviceUri(scheduleArgs.assignTo)],
    task_type_namespace: scheduleArgs.namespace,
    args: scheduleArgs.args as TaskArgs,
    frequency: flags.frequency,
    count: flags.count,
    until: flags.until,
    start_time: scheduleArgs.start,
    timezone: scheduleArgs.timezone
  }
  return scheduledTask
}

export const createTaskGroup = async (createGroupArgs: CreateTaskGroupArgs): Promise<NewTaskGroup> => {
  const taskGroup: NewTaskGroup = {
    group_name: createGroupArgs.name,
    task_type_namespace: createGroupArgs.namespace,
    task_type_name: createGroupArgs.type,
    task_type_major: +createGroupArgs.major,
    assign_to: [deviceUri(createGroupArgs.assignTo)],
    members: createGroupArgs.members as TaskGroupMembers
  }
  return taskGroup
}

export const createAliceArgs = async (config: IntegrationConfig, flags: IntegrationStartFlags, namespace: string, major: string): Promise<TaskArgs> => {
  const args: TaskArgs = {
    alice_creds: config.alice_creds,
    ticket_routing: config.ticket_routing,
    request_path: `/alice`,
    done_path: `/_alice/` + flags.name + `.done`,
    task_types: {
      alert: {namespace: namespace, name: `alice_alert`, major: major},
      ticket: {namespace: namespace, name: `alice_ticket`, major: major},
      assign_to: [config.assign_to]
    },
    tags: [`alice_webhook`]
  }
  return args
}

export const createHotSOSArgs = async (config: IntegrationConfig, flags: IntegrationStartFlags, namespace: string, major: string): Promise<TaskArgs> => {
  const args: TaskArgs = {
    hotsos_creds: config.hotsos_creds,
    ticket_routing: config.ticket_routing,
    done_path: `/_hotsos/` + flags.name + `.done`,
    task_types: {
      alert: {namespace: namespace, name: `hotsos_alert`, major: major},
    },
    tags: [`hotsos_poller`]
  }
  return args
}
