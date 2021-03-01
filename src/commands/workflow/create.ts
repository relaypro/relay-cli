import { cli } from 'cli-ux'
import { filter, last, reduce, set } from 'lodash'

import { Command } from '../../lib/command'
import * as flags from '../../lib/flags'
import { formatWorkflowArgs, formatWorkflowType, parseArg } from '../../lib/utils'

const debug = require('debug')(`workflow`)

export class CreateWorkflowCommand extends Command {

  static description = `create or update a workflow`

  static strict = false

  static flags = {
    name: flags.string({
      multiple: false,
      required: true,
    }),
    uri: flags.string({
      multiple: false,
      required: true,
    }),
    transient: flags.boolean({
      char: `t`,
      default: false,
    }),
    hidden: flags.boolean({
      char: `i`,
      default: false,
    }),
    http: flags.boolean({
      char: `h`,
      default: false,
    }),
    type: flags.enum({
      multiple: false,
      required: true,
      default: `phrase`,
      options: [`phrase`, `button`, `http`],
    }),
    phrase: flags.string({
      multiple: false,
    }),
    button: flags.enum({
      multiple: false,
      default: `single`,
      options: [`single`, `double`],
    }),
    arg: flags.string({
      multiple: true,
      required: false,
      description: `string arg name/value pair`,
    }),
    boolean: flags.booleanValue(),
    number: flags.numberValue()
  }

  static args = [
    {
      name: `ID`,
      required: true,
      description: `device / user ID to install workflow on`,
    }
  ]

  async run() {
    const { flags, argv, raw } = this.parse(CreateWorkflowCommand)

    const workflow = {}

    try {

      if (flags.name) {
        set(workflow, `name`, flags.name)
      }

      set(workflow, `config_content_type`, `application/json`)

      set(workflow, [`options`, `transient`], flags.transient)
      set(workflow, [`options`, `hidden`], flags.hidden)
      set(workflow, [`options`, `remote_invoke`], flags.http)

      if (flags.type === `phrase`) {
        if (flags.phrase) {
          set(workflow, [`config`, `trigger`, `on_phrase`], flags.phrase)
        } else {
          throw new Error(`Trigger type phrase requires specifying a phrase. For instance '--phrase hello'`)
        }
      }

      if (flags.type === `button`) {
        if (flags.button) {
          set(workflow, [`config`, `trigger`, `on_button`], `action_button_${flags.phrase}_tap`)
        } else {
          throw new Error(`Trigger type 'button' requires specifying a button action. For instance '--button single'`)
        }
      }

      set(workflow, [`config`, `trigger`, `start`, `workflow`, `uri`], flags.uri)

      const normalArgFlags = filter(raw, ({ flag }: any) => `arg` === flag)
      const normalArgs = reduce(normalArgFlags, (args, flag) => {
        const [, name, value] = parseArg(flag.input)
        return { ...args, [name]: value }
      }, {})

      const booleanFlags = filter(raw, ({ flag }: any) => `boolean` === flag)
      const booleanArgs = reduce(booleanFlags, (args: Record<string, any>, flag) => {
        const nameValue = CreateWorkflowCommand.flags.boolean.parse(flag.input, null)
        return { ...args, ...nameValue }
      }, {})

      const numberFlags = filter(raw, ({ flag }: any) => `number` === flag)
      const numberArgs = reduce(numberFlags, (args: Record<string, any>, flag) => {
        const nameValue = CreateWorkflowCommand.flags.number.parse(flag.input, null)
        return { ...args, ...nameValue }
      }, {})

      const args = { ...normalArgs, ...booleanArgs, ...numberArgs }
      set(workflow, [`config`, `trigger`, `start`, `workflow`, `args`], args)

      set(workflow, `install`, argv)

      const savedWorkflow = await this.relay.saveWorkflow(workflow)

      cli.styledHeader(`Installed Workflow`)

      cli.table(savedWorkflow, {
        workflow_id: {
          header: `ID`,
          get: row => last(row.workflow_id.split(`_`))
        },
        name: {},
        type: {
          get: formatWorkflowType,
        },
        uri: {
          get: row => row.config.trigger.start.workflow.uri,
        },
        args: {
          get: formatWorkflowArgs,
        },
        install: {
          header: `Installed on`,
          get: row => row.install.join(`\n`),
        }
      }, {
        printLine: this.log,
      })

    } catch (err) {
      debug(err)
      this.error(err)
    }
  }
}
