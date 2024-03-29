// Copyright © 2022 Relay Inc.

import { Flags } from '@oclif/core'
import { getDefaultSubscriberId } from '../session'

export const subscriberId = Flags.string({
  char: `s`,
  description: `subscriber id`,
  required: true,
  hidden: false,
  multiple: false,
  env: `RELAY_SUBSCRIBER_ID`,
  default: async () => {
    try {
      return getDefaultSubscriberId()
    } catch {
      return undefined
    }
  }
})
