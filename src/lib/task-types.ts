import { NewMinor, TaskType, NewMajor } from './api'
import { TaskTypeFlags, UpdateFlags } from './flags'

export const createTaskType = async (flags: TaskTypeFlags, source: string, name: string): Promise<TaskType> => {
  const minor: NewMinor = {
    capsule_source: source,
    comment: flags.key as string
  }
  const major: NewMajor = {
    minor: minor
  }
  const taskType: TaskType = {
    name: name,
    major: major
  }
  return taskType
}

export const updateMajor = async (flags: UpdateFlags, source: string): Promise<NewMajor> => {
  const minor: NewMinor = {
    capsule_source: source,
    comment: flags.key as string
  }
  const major: NewMajor = {
    minor: minor
  }
  return major
}

export const updateMinor = async (flags: UpdateFlags, source: string): Promise<NewMinor> => {
  const minor: NewMinor = {
    capsule_source: source,
    comment: flags.key as string
  }
  return minor
}
