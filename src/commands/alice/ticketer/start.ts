// Copyright © 2023 Relay Inc.

import * as fs from 'fs'
import { CreateCommand } from '../../../lib/command'
// eslint-disable-next-line quotes
import debugFn = require('debug')

import * as flags from '../../../lib/flags'
import { NewWorkflow } from '../../../lib/api'
import { createTicketingWorkflow } from '../../../lib/workflow'
import { lowerCase, map } from 'lodash'
import { aliceTicketerStartArgs, integrationStartArgs } from '../../../lib/args'

const debug = debugFn(`alice:ticketer:start`)

type PhraseWorkflow = NewWorkflow & { config: { trigger: { on_phrases: string[] }}}

export default class AliceTicketerStartCommand extends CreateCommand {
  static description = `Start an Alice ticketing workflow with the given configuration`
  static strict = false

  static hidden = true

  static flags = {
    ...flags.subscriber,
    ...flags.installFlags,
    name: flags.string({
      char: `n`,
      required: true,
      multiple: false,
      default: `alice_webhook`,
      description: `Task name`
    }),
    tag: flags.string({
      required: false,
      multiple: true,
      description: `Tag to tie to webhook`
    }),
    phrases: flags.string({
      required: true,
      multiple: true,
      description: `List of phrase strings`
    })
  }

  static args = [
    ...integrationStartArgs,
    ...aliceTicketerStartArgs
  ]

  async run(): Promise<void> {
    const { flags, argv } = await this.parse(AliceTicketerStartCommand)
    const subscriberId = flags[`subscriber-id`]
    const namespace = argv[0] as string
    const major = argv[1] as string
    let config = argv[2] as string
    const type = argv[3] as string
    const serviceId = argv[4] as string

    debug(flags)

    config = fs.readFileSync(config,{ encoding: `utf8`, flag: `r` }).toString()
    const encodedConfig = JSON.parse(config)

    const wfArgs: Record<string, unknown> = {
      task_type: {namespace: namespace, name: type, major: major},
      task_name: flags.name,
      task_args: {encodedConfig, service_id: serviceId}
    }

    const wfSource = fs.readFileSync(`src/commands/alice/task_trigger.lua`, { encoding: `utf8`, flag: `r`}).toString()

    const workflow: PhraseWorkflow = await createTicketingWorkflow(flags, wfSource, wfArgs) as PhraseWorkflow
    workflow.config.trigger.on_phrases = map(flags.phrases, lowerCase)
    await this.relay.saveAliceWorkflow(subscriberId, workflow)
  }
}