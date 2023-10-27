// Copyright © 2022 Relay Inc.

import { TaskArgs } from "./api"

type StartArgs = {
  namespace: string,
  type: string,
  major: string,
  name: string,
  assignTo: string,
  args: string | TaskArgs,
}

type ScheduleArgs = StartArgs & {
  start: string,
  timezone: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createScheduleArgs = (args: string[]): ScheduleArgs => {
  const scheduleArgs = {
    namespace: args[0] as string,
    type: args[1] as string,
    major: args[2] as string,
    name: args[3] as string,
    assignTo: args[4] as string,
    args: args[5] as string,
    start: args[6] as string,
    timezone: args[7] as string
  }
  return scheduleArgs
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createStartArgs = (args: string[]): StartArgs => {
  const startArgs = {
    namespace: args[0] as string,
    type: args[1] as string,
    major: args[2] as string,
    name: args[3] as string,
    assignTo: args[4] as string,
    args: args[5] as string,
  }
  return startArgs
}

const taskStartArgs = [
  {
    name: `namespace`,
    required: true,
    description: `Namespace of the task type`,
    options: [`account`, `system`]
  },
  {
    name: `type`,
    required: true,
    description: `Name of the task type for this task`
  },
  {
    name: `major`,
    required: true,
    description: `Major version of the task type`
  },
  {
    name: `name`,
    required: true,
    description: `Name of the task`
  },
  {
    name: `assign-to`,
    required: true,
    description: `Devices on which to start this task`
  },
  {
    name: `args`,
    required: true,
    description: `Encoded JSON or @filename`
  }
]

export {
  taskStartArgs,
  StartArgs,
  ScheduleArgs,
  createStartArgs,
  createScheduleArgs
}
