// Copyright © 2023 Relay Inc.

import { readFileSync } from 'fs'
import { Args } from '@oclif/core'
import util from 'node:util'
import { exec as _exec } from 'node:child_process'

import * as flags from '../../../../lib/flags/index.js'
import { updateMinor } from '../../../../lib/task-types.js'
import { NewMinor } from '../../../../lib/api.js'
import { Command } from '../../../../lib/command.js'
import { major, namespace } from '../../../../lib/args.js'

import debugFn from 'debug'
const debug = debugFn(`task:types:update:minor`)

const exec = util.promisify(_exec)

async function execute (command: string): Promise<string> {
  const { stdout } = (await exec(command))
  return stdout.toString().trimEnd()
}

export default class TaskTypesUpdateMinorCommand extends Command {

  static description = `Update a task type. Must have admin priviledges and RELAY_ADMIN_TOKEN env variable set to run this command.`
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
    major,
    source: Args.string({
      name: `source`,
      required: true,
      description: `Capsule source file name`,
    }),
  }

  async run(): Promise<void> {
    const { flags, args } = await this.parse(TaskTypesUpdateMinorCommand)
    const subscriberId = flags[`subscriber-id`]
    const namespace = args.namespace
    const name = args.name
    const major = args.major
    let source = args.source

    try {
      if (!flags.key) {
        const scriptDir = (await execute(`dirname ${source}`))
        const gitBranch = (await execute(`cd ${scriptDir} && git branch --show-current`))
        const gitCommit = (await execute(`cd ${scriptDir} && git rev-parse HEAD`))
        flags.key = `${gitBranch}@${gitCommit}`
      }
      source = readFileSync(source, `utf-8`)
      const minor: NewMinor = await updateMinor(flags, source) as NewMinor
      const success = await this.relay.createMinor(subscriberId, name, namespace, major, minor)
      if (success) {
        this.log(`Successfully updated minor`)
      } else {
        this.log(`Could not update minor`)
      }
    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}
