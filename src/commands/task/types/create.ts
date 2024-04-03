/* global debugScope */
// Copyright © 2023 Relay Inc.

import { Args } from '@oclif/core'
import util from 'node:util'
import { exec as _exec } from 'node:child_process'
import { readFileSync } from 'fs'
import debugFn from 'debug'

import * as flags from '../../../lib/flags/index.js'
import { createTaskType } from '../../../lib/task-types.js'
import { TaskType } from '../../../lib/api.js'
import { Command } from '../../../lib/command.js'
import { namespace } from '../../../lib/args.js'

const debug = debugFn(`task:types:create`)

const exec = util.promisify(_exec)

async function execute (command: string): Promise<string> {
  const { stdout } = (await exec(command))
  return stdout.toString().trimEnd()
}

export default class TaskTypesCreateCommand extends Command {

  static description = `Create a task type. Must have admin priviledges and RELAY_ADMIN_TOKEN env variable set to run this command.`
  static strict = false


  static flags = {
    ...flags.subscriber,
    key: flags.string ({
      char: `k`,
      required: false,
      multiple: false,
      description: `Git version of source file`,
      helpValue: `<branch>@<commit hash>`
    })
  }

  static args = {
    namespace,
    name: Args.string({
      name: `name`,
      required: true,
      description: `Task type name`,
    }),
    source: Args.string({
      name: `source`,
      required: true,
      description: `Capsule source file name`,
    }),
  }

  async run(): Promise<void> {
    const { flags, args } = await this.parse(TaskTypesCreateCommand)
    const subscriberId = flags[`subscriber-id`]
    const namespace = args.namespace
    const name = args.name
    let source = args.source

    try {
      if (!flags.key) {
        const scriptDir = (await execute(`dirname ${source}`))
        const gitBranch = (await execute(`cd ${scriptDir} && git branch --show-current`))
        const gitCommit = (await execute(`cd ${scriptDir} && git rev-parse HEAD`))
        flags.key = `${gitBranch}@${gitCommit}`
      }
      source = readFileSync(source, `utf-8`)
      const taskType: TaskType = await createTaskType(flags, source, name) as TaskType

      debug(taskType)

      const success = await this.relay.addTaskType(subscriberId, taskType, namespace)

      if (success) {
        this.log(`Successfully created task type`)
      } else {
        this.log(`Could not create task type`)
      }
    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}
