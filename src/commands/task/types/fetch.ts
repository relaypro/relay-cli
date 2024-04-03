// Copyright © 2023 Relay Inc.

import { ux } from '@oclif/core'

import { Command } from '../../../lib/command.js'
import * as flags from '../../../lib/flags/index.js'
import { printMinors } from '../../../lib/utils.js'
import debugFn from 'debug'
import { major, minor, namespace, type } from '../../../lib/args.js'

const debug = debugFn(`task:types:list`)

export default class TaskTypesFetchCommand extends Command {
  static description = `Fetch a specific minor`
  static strict = false

  static flags = {
    ...flags.subscriber,
    ...ux.table.flags()
  }

  static args = {
    namespace,
    type,
    major,
    minor,
  }

  async run(): Promise<void> {
    const { flags, argv } = await this.parse(TaskTypesFetchCommand)
    const subscriberId = flags[`subscriber-id`]
    const namespace = argv[0] as string
    const type = argv[1] as string
    const major = argv[2] as string
    const iminor = argv[3] as string

    try {
      const minor = [await this.relay.fetchMinor(subscriberId, namespace, type, major, iminor)]

      debug(`minor`, minor)

      flags.minor === `latest` ? printMinors(minor, flags, type, true, namespace) : printMinors(minor, flags, type, false, namespace)
    } catch (err) {
      debug(err)
      this.safeError(err)
    }

  }
}
