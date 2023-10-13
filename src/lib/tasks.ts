import { NewScheduledTask, NewTask } from './api'
import { ScheduledTaskFlags, TaskFlags } from './flags'

export const deviceUri = (deviceName: string): string => {
  let deviceUri = deviceName
  if (deviceName.substring(0,3) != `urn`) {
    deviceUri = `urn:relay-resource:name:device:` + encodeURI(deviceName.toLowerCase())
  }
  return deviceUri
}

export const createTask = async (flags: TaskFlags): Promise<NewTask> => {
  const task = {
    task_type_name: flags.type,
    task_type_major: flags.major,
    task_name: flags.name,
    assign_to: [deviceUri(flags[`assign-to`])],
    task_type_namespace: flags.namespace,
    args: flags.args,
  }
  return task
}

export const createScheduledTask = async (flags: ScheduledTaskFlags): Promise<NewScheduledTask> => {
  const scheduledTask: NewScheduledTask = {
    task_type_name: flags.type,
    task_type_major: flags.major,
    task_name: flags.name,
    assign_to: [deviceUri(flags[`assign-to`])],
    task_type_namespace: flags.namespace,
    args: flags.args,
    frequency: flags.frequency,
    count: flags.count,
    until: flags.until,
    start_time: flags.start,
    timezone: flags.timezone
  }
  return scheduledTask
}