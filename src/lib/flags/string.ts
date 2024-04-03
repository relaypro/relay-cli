// Copyright © 2022 Relay Inc.

import { Flags } from '@oclif/core'
import { toString } from 'lodash-es'
import { parseArg } from '../utils.js'


export const stringValue = Flags.custom<{ [x: string]: string; }>({
  char: `a`,
  description: `Number name/value pair workflow arg`,
  multiple: true,
  required: false,
  helpValue: `arg1=alice`,
  parse: async input => {
    const [success, name, value] = parseArg(input)
    if (success) {
      const stringValue = toString(value)
      return {[name]: stringValue}
    } else {
      throw new Error(`${input} is invalid. Must be in the format of '${name||`foo`}=alice'`)
    }
  }
})
