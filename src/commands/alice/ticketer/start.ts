// Copyright © 2023 Relay Inc.

import * as fs from 'fs'
import { CreateCommand } from '../../../lib/command'
// eslint-disable-next-line quotes
import debugFn = require('debug')

import * as flags from '../../../lib/flags'
import { NewWorkflow } from '../../../lib/api'
import { createTicketingWorkflow } from '../../../lib/workflow'
import { lowerCase, map } from 'lodash'

const debug = debugFn(`alice:ticketer:start`)

type PhraseWorkflow = NewWorkflow & { config: { trigger: { on_phrases: string[] }}}

export default class AliceTicketerStartCommand extends CreateCommand {
  static description = `something`

  static enableJsonFlag = true

  // static hidden = true

  static flags = {
    ...flags.subscriber,
    ...flags.aliceStartFlags,
    ...flags.installFlags,
    type: flags.string({
      char: `t`,
      required: true,
      multiple: false,
      description: `Name of the task type`
    }),
    phrases: flags.string({
      char: `p`,
      required: true,
      multiple: true,
      description: `List of phrase strings`
    }),
    service_id: flags.string({
      char: `I`,
      required: true,
      multiple: false,
      description: `Tickets are created in this Alice service`
    })
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(AliceTicketerStartCommand)
    debug(flags)

    flags.config = fs.readFileSync(flags.config,{ encoding: `utf8`, flag: `r` }).toString()
    const config = JSON.parse(flags.config)

    // build workflow args
    const wf_args: Record<string, unknown> = {
      task_type: {namespace: flags.namespace, name: flags.type, major: flags.major},
      task_name: flags.name,
      task_args: {config, service_id: flags.service_id}
    }

    // get source for the task-starting workflow
    const wf_source = fs.readFileSync(`src/commands/alice/task_trigger.lua`, { encoding: `utf8`, flag: `r`}).toString()
    // wf_source = JSON.stringify(wf_source)

    const workflow: PhraseWorkflow = await createTicketingWorkflow(flags, wf_source, wf_args) as PhraseWorkflow
    workflow.config.trigger.on_phrases = map(flags.phrases, lowerCase)

    await this.relay.saveAliceWorkflow(workflow)
  }
}