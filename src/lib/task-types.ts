import { Minor, TaskType, NewMajor } from './api'
import { TaskTypeFlags } from './flags'

export const createTaskType = async (flags: TaskTypeFlags): Promise<TaskType> => {
  const minor: Minor = {
    capsule_source: flags.source,
    comment: flags.key as string
  }
  const major: NewMajor = {
    minor: minor
  }
  const taskType: TaskType = {
    name: flags.name,
    major: major
  }
  return taskType
}

export const updateMajor = async (flags: TaskTypeFlags): Promise<NewMajor> => {
  const minor: Minor = {
    capsule_source: flags.source,
    comment: flags.key as string
  }
  const major: NewMajor = {
    minor: minor
  }
  return major
}

export const updateMinor = async (flags: TaskTypeFlags): Promise<Minor> => {
  const minor: Minor = {
    capsule_source: flags.source,
    comment: flags.key as string
  }
  return minor
}
