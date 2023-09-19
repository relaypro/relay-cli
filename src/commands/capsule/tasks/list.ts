import { CliUx } from '@oclif/core'

import { Command } from '../../../lib/command'
import * as flags from '../../../lib/flags'
import debugFn = require('debug')
const debug = debugFn(`task`)
import { isEmpty } from 'lodash'
import { printTasks } from '../../../lib/utils'

export default class TaskListCommand extends Command {
    static description = `List task configurations`
    static hidden = true
    
    static flags = {
        ...flags.subscriber,
        ...CliUx.ux.table.flags(),
        scheduled: flags.boolean({
            description: `List the scheduld tasks`,
            required: false,
        })
    }
    async run(): Promise<void> {
      const { flags } = await this.parse(TaskListCommand)
      try {
        var taskEndpoint
        if (flags[`scheduled`]) {
          taskEndpoint = `scheduled_task`
        } else {
          taskEndpoint = `task`
        }

        const tasks = await this.relay.fetchTasks(flags[`subscriber-id`], taskEndpoint)

        debug(`tasks`, tasks)

        if (!isEmpty(tasks)) {
          printTasks(tasks, flags)
        } else {
          this.log(`No tasks have been created yet`)
        }
      } catch (err) {
        debug(err)
        this.safeError(err)
      }
      
    }
  }

