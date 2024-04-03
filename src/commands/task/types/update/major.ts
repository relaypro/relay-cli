// Copyright © 2023 Relay Inc.

import util from 'node:util'
import { exec as _exec } from 'node:child_process'
import { readFileSync } from 'fs'
import { Args } from '@oclif/core'

import * as flags from '../../../../lib/flags/index.js'
import { updateMajor } from '../../../../lib/task-types.js'
import { NewMajor } from '../../../../lib/api.js'
import { Command } from '../../../../lib/command.js'
import { namespace } from '../../../../lib/args.js'

import debugFn from 'debug'
const debug = debugFn(`task:types:update:major`)

const exec = util.promisify(_exec)

async function execute (command: string): Promise<string> {
  const { stdout } = (await exec(command))
  return stdout.toString().trimEnd()
}

export default class TaskTypesUpdateMajorCommand extends Command {

  static description = `Update a task type's major. Must have admin priviledges and RELAY_ADMIN_TOKEN env variable set to run this command.`
  static strict = false

  static flags = {
    ...flags.subscriber,
    key: flags.string ({
      char: `k`,
      required: false,
      multiple: false,
      description: `Git version of source file`,
      helpValue: `<branch>@<commit hash>`
    }),
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
    const { flags, args } = await this.parse(TaskTypesUpdateMajorCommand)
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
      const major: NewMajor = await updateMajor(flags, source) as NewMajor
      const success = await this.relay.createMajor(subscriberId, name, namespace, major)
      if (success) {
        this.log(`Successfully updated major`)
      } else {
        this.log(`Could not update major`)
      }
    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}
