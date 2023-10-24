// Copyright © 2023 Relay Inc.

import * as flags from '../../lib/flags'
// eslint-disable-next-line quotes
import debugFn = require('debug')

import { updateMajor, updateMinor } from '../../lib/task-types'
import { Minor, NewMajor } from '../../lib/api'
import { Command } from '../../lib/command'
import { readFileSync } from 'fs'

import util from 'node:util'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const exec = util.promisify(require(`node:child_process`).exec)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = debugFn(`task-types:update`)

async function execute (command: string): Promise<string> {
  const { stdout } = (await exec(command))
  return stdout.toString().trimEnd()
}

export default class TaskTypesUpdateCommand extends Command {

  static description = `Update a task type. Must have admin priviledges and RELAY_ADMIN_TOKEN env variable set to run this command.`
  // static hidden = true

  static flags = {
    ...flags.subscriber,
    namespace: flags.string({
      char: `N`,
      required: true,
      multiple: false,
      default: `account`,
      options: [`account`, `system`],
      description: `Namespace of the task type`
    }),
    name: flags.string({
      char: `n`,
      required: true,
      multiple: false,
      description: `Task type name`
    }),
    source: flags.string ({
      char: `S`,
      required: true,
      multiple: false,
      description: `Capsule source file name`
    }),
    key: flags.string ({
      char: `k`,
      required: false,
      multiple: false,
      description: `Git version of source file`,
      helpValue: `<branch>@<commit hash>`
    }),
    major: flags.string ({
      char: `M`,
      required: false,
      multiple: false,
      dependsOn: [`source`],
      description: `Update a task types major`,
    }),
    minor: flags.string ({
      char: `m`,
      required: false,
      multiple: false,
      dependsOn: [`version`, `source`],
      description: `Update a task types minor`,
    }),
    version: flags.integer ({
      char: `v`,
      required: false,
      multiple: false,
      dependsOn: [`minor`, `source`],
      description: `Major version of task type; for updating minor`,
    }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(TaskTypesUpdateCommand)
    const subscriberId = flags[`subscriber-id`]
    try {
      if (!flags.key) {
        const scriptDir = (await execute(`dirname ${flags.source}`))
        const gitBranch = (await execute(`cd ${scriptDir} && git branch --show-current`))
        const gitCommit = (await execute(`cd ${scriptDir} && git rev-parse HEAD`))
        flags.key = `${gitBranch}@${gitCommit}`
      }
      flags.source = readFileSync(flags.source, `utf-8`)
      if (flags.major) {
        const major: NewMajor = await updateMajor(flags) as NewMajor
        console.log(major)
        const success = await this.relay.createMajor(subscriberId, flags.name, flags.namespace, major)
        if (success) {
          this.log(`Successfully created task type`)
        } else {
          this.log(`Could not create task type`)
        }
      } else if (flags.minor && flags.version) {
        const minor: Minor = await updateMinor(flags) as Minor
        console.log(minor)
        const success = await this.relay.createMinor(subscriberId, flags.name, flags.namespace, flags.version, minor)
        if (success) {
          this.log(`Successfully created task type`)
        } else {
          this.log(`Could not create task type`)
        }
      }
    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}
