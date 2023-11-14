// Copyright © 2022 Relay Inc.

import { zipObject } from "lodash"
import { TaskArgs, TaskGroupMembers } from "./api"

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

type CreateTaskGroupArgs = {
  namespace: string,
  name: string,
  type: string,
  major: string,
  assignTo: string,
  members: string | TaskGroupMembers
}

const createScheduleArgs = (args: string[]): ScheduleArgs => {
  return zipObject([`namespace`, `type`, `major`, `name`, `assignTo`, `args`, `start`, `timezone`],args) as ScheduleArgs
}

const createStartArgs = (args: string[]): StartArgs => {
  return zipObject([`namespace`, `type`,`major`, `name`, `assignTo`, `args`], args) as StartArgs
}

const createTaskGroupArgs = (args: string[]): CreateTaskGroupArgs => {
  return zipObject([`namespace`, `name`,`type`, `major`, `assignTo`, `members`], args) as CreateTaskGroupArgs
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

const taskGroupCreateArgs = [
  {
    name: `namespace`,
    required: true,
    description: `Namespace of the task type`,
    options: [`account`, `system`]
  },
  {
    name: `name`,
    required: true,
    description: `Group name`
  },
  {
    name: `type`,
    required: true,
    description: `Task type`
  },
  {
    name: `major`,
    required: true,
    description: `Major version`
  },
  {
    name: `assign-to`,
    required: true,
    description: `Device name`
  },
  {
    name: `members`,
    required: true,
    description: `Encoded JSON or @filename`
  }
]

const aliceWebhookStartArgs = [
  {
    name: `namespace`,
    required: true,
    description: `Namespace of the task type`,
    options: [`account`, `system`]
  },
  {
    name: `major`,
    required: true,
    description: `Major version`
  },
  {
    name: `config`,
    required: true,
    description: `Subscriber config file name`,
  }
]

const aliceTicketerStartArgs = [
  {
    name: `type`,
    required: true,
    description: `Name of task type`
  },
  {
    name: `service-id`,
    required: true,
    description: `Tickets are created in this Alice service`
  }
]

export {
  taskStartArgs,
  taskGroupCreateArgs,
  aliceWebhookStartArgs,
  aliceTicketerStartArgs,
  StartArgs,
  ScheduleArgs,
  CreateTaskGroupArgs,
  createStartArgs,
  createScheduleArgs,
  createTaskGroupArgs
}
