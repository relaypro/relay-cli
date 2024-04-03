// Copyright © 2022 Relay Inc.

import {readFile, stat} from 'node:fs/promises'

import { Args } from '@oclif/core'

import { TaskArgs, TaskGroupMembers } from './api.js'

type StartArgs = {
  namespace: string,
  type: string,
  major: string,
  name: string,
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
  members: string | TaskGroupMembers
}

const fileOrStringArg = Args.custom<string>({
  async parse(argsOrFilename) {
    if (argsOrFilename.charAt(0) == `@`) {
      const filename = argsOrFilename.substring(1, argsOrFilename.length)
      const stats = await stat(filename)
      const fileSizeInMegabytes = stats.size / (1024*1024)
      if (fileSizeInMegabytes > 10) {
        throw new Error(`args file is too large`)
      }
      return await readFile(filename,  { encoding: `utf8`, flag: `r` }).toString()
    } else {
      return argsOrFilename
    }
  }
})

export const namespace = Args.string({
  name: `namespace`,
  required: true,
  description: `Namespace of the task type`,
  options: [`account`, `system`] as const,
  default: `account`,
})

export const type = Args.string({
  name: `type`,
  required: true,
  description: `Name of the task type for this task`,
})

export const major = Args.string({
  name: `major`,
  required: true,
  description: `Major version`
})

export const minor = Args.string({
  name: `minor`,
  required: true,
  description: `Minor version. Pass in "latest" to get latest version`
})

const taskStartArgs = {
  namespace,
  type,
  major,
  name: Args.string({
    name: `name`,
    required: true,
    description: `Name of the task`
  }),
  args: fileOrStringArg({
    name: `args`,
    required: true,
    description: `Encoded JSON or @filename`,
  }),
}

const taskGroupCreateArgs = {
  namespace,
  type,
  major,
  name: Args.string({
    name: `name`,
    required: true,
    description: `Group name`
  }),
  members: fileOrStringArg({
    name: `members`,
    required: true,
    description: `Encoded JSON or @filename`
  }),
}

const integrationStartArgs = {
  namespace,
  major,
  config: fileOrStringArg({
    name: `config`,
    required: true,
    description: `Subscriber config file name`,
    exists: true,
  })
}

const aliceTicketerStartArgs = {
  type,
  [`service-id`]: Args.string({
    name: `service-id`,
    required: true,
    description: `Tickets are created in this Alice service`
  })
}

export {
  taskStartArgs,
  taskGroupCreateArgs,
  integrationStartArgs,
  aliceTicketerStartArgs,
  StartArgs,
  ScheduleArgs,
  CreateTaskGroupArgs,
}
