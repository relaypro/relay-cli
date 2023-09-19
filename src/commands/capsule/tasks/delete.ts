import { Command } from '../../../lib/command'
import * as flags from '../../../lib/flags'
import debugFn = require('debug')
const debug = debugFn(`task`)
const { Confirm } = require('enquirer') // eslint-disable-line quotes

export default class TaskDeleteCommand extends Command {
    static description = `Delete a running or scheduled task`
    static hidden = true
    
    static flags = {
        ...flags.subscriber,
        ['task-id']: flags.string({
            char: 'i',
            required: true,
            multiple: false,
            description: `Task identifier to delete`,
        }),
        scheduled: flags.boolean({
            required: false,
            description: `Delete a scheduled task`,
        })
    }
    async run(): Promise<void> {
        const { flags } = await  this.parse(TaskDeleteCommand)
        const taskId = flags[`task-id`]
        const subscriberId = flags[`subscriber-id`]
        var taskEndpoint
        if (flags[`scheduled`]) {
            taskEndpoint = `scheduled_task`
        } else {
            taskEndpoint = `task`
        }
    
        debug(`flags`, flags)
    
        try {    
            const prompt = new Confirm({
              name: `question`,
              message: `Deleting ${taskId}. Are you sure?`
            })
    
            const answer = await prompt.run()
    
            if (answer) {
              const success = await this.relay.deleteTask(subscriberId, taskEndpoint, taskId)
              if (success) {
                this.log(`Task deleted`)
              } else {
                this.log(`Task NOT deleted`)
              }
            } else {
              this.log(`Task NOT deleted`)
            }
        } catch (err) {
          debug(err)
          this.safeError(err)
        }
      }
  }

