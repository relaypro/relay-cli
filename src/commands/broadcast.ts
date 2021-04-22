import { Command } from '../lib/command'

import { subscriber, string, timerFlags, boolean, TimerWorkflow, TimerFlags } from '../lib/flags'
import { cli } from 'cli-ux'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Confirm } = require('enquirer') // eslint-disable-line quotes

import { createTimerWorkflow } from '../lib/workflow'

// eslint-disable-next-line quotes
import debugFn = require('debug')
import { uuid } from '../lib/utils'
import userId from '../lib/user-id'
import { getToken } from '../lib/session'
import isEmpty from 'lodash/isEmpty'
import reduce from 'lodash/reduce'
import diff from 'lodash/difference'
import find from 'lodash/find'
import join from 'lodash/join'

const debug = debugFn(`broadcast`)

export default class Broadcast extends Command {

  static hidden = true

  static description = `Send a broadcast to one or more Relays`

  static flags = {
    ...subscriber,
    ...timerFlags,
    acknowledgement: boolean({
      char: `a`,
      default: false,
      allowNo: true,
    }),
    everyone: boolean({ char: `y` }),
    group: string({
      char: `g`,
      multiple: true,
    }),
    device: string({
      char: `d`,
      multiple: true,
    }),
    text: string({
      char: `t`,
      required: true,
    })
  }

  async run(): Promise<void> {
    const { flags, /*argv,*/ raw } = this.parse(Broadcast)

    const token = getToken()

    if (!token?.uuid)  {
      throw new Error(`failed to discover `)
    }
    const subscriber_id = flags[`subscriber-id`]

    const selfId = userId(subscriber_id, token?.uuid)

    const workflowFlags: TimerFlags = {
      ...flags,
      name: `broadcast-${uuid()}`,
      uri: `relay-local://broadcast`,
      transient: false,
      http: false,
      hidden: true,
    }

    const workflow: TimerWorkflow = createTimerWorkflow(workflowFlags, [selfId], raw)

    const allDevices = await this.relay.devices(subscriber_id)

    let targets: string[] = []
    if (flags.everyone) {
      targets = allDevices
    } else {
      if (flags.device) {
        const invalidDevices = diff(flags.device, allDevices)
        if (!isEmpty(invalidDevices)) {
          throw new Error(`Invalid device IDs: ${invalidDevices}`)
        }
        targets = [...targets, ...flags.device]
      }
      if (flags.group) {
        const groups = await this.relay.groups(subscriber_id)
        const allGroupUsers = reduce(flags.group, (users: string[], groupIdOrName) => {
          const groupUsers = find(find(groups, g => (g.group_id === groupIdOrName || g.name === groupIdOrName))?.subscribers, { subscriber_id })?.users
          groupUsers !== undefined && users.push(...groupUsers)
          return users
        }, [])
        targets = [...targets, ...allGroupUsers]
      }
    }

    if (isEmpty(targets)) {
      throw new Error(`No broadcast targets specified. Use "--everyone", "--group" or "--device"`)
    }

    const _targets = join(targets, ` `)

    workflow.config.trigger.start.workflow.args = {
      targets: _targets,
      confirmation_required: flags.acknowledgement,
      text: flags.text,
    }

    debug(workflow)

    cli.styledObject({
      Who: _targets,
      When: flags.trigger === `immediately` ? `Immediately` : flags.start,
      How: flags.acknowledgement ? `Require Acknowledgement` : `Quick Announcement`,
      What: flags.text,
    })

    const prompt = new Confirm({
      name: `question`,
      message: `Please confirm the details of your broadcast...`,
    })

    if (await prompt.run()) {
      await this.relay.saveWorkflow(workflow)
      cli.log(`Broadcast saved!`)
    } else {
      cli.log(`Broadcast cancelled!`)
    }

  }
}
