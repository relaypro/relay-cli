import * as fs from 'fs';
import { integer, string } from '../../../../lib/flags'
import debugFn = require('debug')
import { appendTag, createTask } from '../../../../lib/tasks'
import { NewTask } from '../../../../lib/api'
import { Command } from '../../../../lib/command'

const debug = debugFn(`capsule:tasks:start:account`)

export default class TasksStartAccountCommand extends Command {

  static description = `Start an account task with the given configuration`
  static hidden = true

  static flags = { // NOTE: how to change ordering of these in help command?
    task_type_name: string({
      char: `N`,
      required: true,
      multiple: false,
      description: `Name of the task type for this task`,
    }),
    task_type_major: integer({
        char: `m`,
        required: true,
        multiple: false,
        description: `Major version of the task type`,
    }),
    task_name: string({
        char: `n`,
        required: true,
        multiple: false,
        description: `Name of the task`,
    }),
    assign_to: string({
        char: `a`,
        required: true,
        multiple: false,
        description: `Devices on which to start this task`,
    }),
    args: string({
        char: `A`,
        required: true,
        multiple: false,
        description: `Encoded JSON or @filename`,
    }),
    tag: string({
        char: `t`,
        required: false,
        multiple: false,
        description: `Optional tag to tie to your task`
    })
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(TasksStartAccountCommand)
    var encoded_string = flags.args
    if (encoded_string.charAt(0) == '@') {
      var encoded_string = fs.readFileSync(encoded_string.substring(1, encoded_string.length),{ encoding: 'utf8', flag: 'r' }).toString()
    }
    flags.args = JSON.parse(encoded_string)

    if (flags.tag) {
        flags.args = appendTag(flags.args, flags.tag)
    }
    try {
        const task: NewTask = await createTask(flags, `account`) as NewTask
        const success = await this.relay.startTask(task)

        if (success) {
            this.log(`Successfully created task`)
        } else {
            this.log(`Could not create task`)
        }

    } catch (err) {
        debug(err)
        this.safeError(err)
    }
  }
}

