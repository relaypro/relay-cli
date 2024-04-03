import { NewMinor, TaskType, NewMajor, TaskTypeDump } from './api.js'
import { TaskTypeFlags, UpdateFlags } from './flags/index.js'

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


export const createTaskTypeDump = async (type: string, major: number, minor: number, comment: string): Promise<TaskTypeDump> => {
  const taskTypeDump: TaskTypeDump = {
    type: type,
    major: major,
    minor: minor,
    comment: comment
  }
  return taskTypeDump
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
