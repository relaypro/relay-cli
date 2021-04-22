import { flags } from '@oclif/command'
import { getDefaultSubscriberId } from '../session'

export const subscriberId = flags.string({
  char: `s`,
  description: `subscriber id`,
  required: true,
  hidden: false,
  multiple: false,
  env: `RELAY_SUBSCRIBER_ID`,
  default: () => {
    try {
      return getDefaultSubscriberId()
    } catch {
      return undefined
    }
  }
})
