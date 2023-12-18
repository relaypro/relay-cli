// Copyright © 2023 Relay Inc.

import * as flags from '../../../../lib/flags'
// eslint-disable-next-line quotes
import debugFn = require('debug')

import { updateMajor } from '../../../../lib/task-types'
import { NewMajor } from '../../../../lib/api'
import { Command } from '../../../../lib/command'
import { readFileSync } from 'fs'

import util from 'node:util'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const exec = util.promisify(require(`node:child_process`).exec)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = debugFn(`task-types:update:major`)

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

  static args = [
    {
      name: `namespace`,
      required: true,
      description: `Namespace of the task type`,
      options: [`account`, `system`],
    },
    {
      name: `name`,
      required: true,
      description: `Task type name`,
    },
    {
      name: `source`,
      required: true,
      description: `Capsule source file name`,
    }
  ]

  async run(): Promise<void> {
    const { flags, argv } = await this.parse(TaskTypesUpdateMajorCommand)
    const subscriberId = flags[`subscriber-id`]
    const namespace = argv[0] as string
    const name = argv[1] as string
    let source = argv[2] as string
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
