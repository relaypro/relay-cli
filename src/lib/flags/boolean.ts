// Copyright © 2022 Relay Inc.

import { Flags } from '@oclif/core'
import { parseArg } from '../utils'

export const booleanValue = Flags.custom({
  char: `b`,
  description: `Boolean name/value pair workflow arg`,
  multiple: true,
  required: false,
  helpValue: `arg1=[true|false]`,
  parse: async input => {
    const [success, name, value] = parseArg(input)
    if (success && (value === `true` || value === `false`)) {
      return {[name]: value === `true`}
    } else {
      throw new Error(`${input} is invalid. Must be in the format of 'foo=true' or 'foo=false'`)
    }
  },
})
