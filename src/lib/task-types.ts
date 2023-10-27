<<<<<<< HEAD
import { NewMinor, TaskType, NewMajor, TaskTypeDump } from './api'
=======
import { NewMinor, TaskType, NewMajor } from './api'
>>>>>>> Convert all required flags from tasks/task-types into positional args, fix update command, cleanup
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

<<<<<<< HEAD

export const createTaskTypeDump = async (type: string, major: number, minor: number, comment: string): Promise<TaskTypeDump> => {
  const taskTypeDump: TaskTypeDump = {
    type: type,
    major: major,
    minor: minor,
    comment: comment
  }
  return taskTypeDump
}

=======
>>>>>>> Convert all required flags from tasks/task-types into positional args, fix update command, cleanup
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
