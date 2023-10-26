// Copyright © 2023 Relay Inc.

import { CliUx } from '@oclif/core'

import { Command } from '../../lib/command'
import * as flags from '../../lib/flags'
import { printMajors, printMinors } from '../../lib/utils'
// eslint-disable-next-line quotes
import debugFn = require('debug')

const debug = debugFn(`task-types:list`)

export default class TaskTypesFetchCommand extends Command {
  static description = `fetch a specific task types major or minor`
  // static hidden = true

  static flags = {
    ...flags.subscriber,
    ...CliUx.ux.table.flags(),
    namespace: flags.string({
      char: `N`,
      required: true,
      multiple: false,
      default: `account`,
      options: [`account`, `system`],
      description: `Namespace of the task type`
    }),
    type: flags.string({
      char: `t`,
      required: true,
      multiple: false,
      description: `Task type name`
    }),
    major: flags.string({
      char: `M`,
      required: true,
      multiple: false,
      description: `Major version. Use "latest" to get latest.`
    }),
    minor: flags.string({
      char: `m`,
      required: false,
      multiple: false,
      dependsOn: [`major`],
      description: `Minor Version. Use "latest" to get latest.`
    })
  }
  async run(): Promise<void> {
    const { flags } = await this.parse(TaskTypesFetchCommand)
    const subscriberId = flags[`subscriber-id`]

    try {
      if (flags.minor && flags.major) {
        const minor = [await this.relay.fetchMinor(subscriberId, flags.namespace, flags.type, flags.major, flags.minor)]
        debug(`minor`, minor)
        flags.minor === `latest` ? printMinors(minor, flags, flags.type, true) : printMinors(minor, flags, flags.type, false)
      } else if (flags.major) {
        const major = [await this.relay.fetchMajor(subscriberId, flags.namespace, flags.type, flags.major)]
        debug(`major`, major)
        flags.major === `latest` ? printMajors(major, flags, flags.type, true) : printMajors(major, flags, flags.type, false)
      } else {
        this.log(`Must provide a minor and/or major`)
      }
    } catch (err) {
      debug(err)
      this.safeError(err)
    }

  }
}



