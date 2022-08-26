// Copyright © 2022 Relay Inc.

import { Flags } from '@oclif/core'
import { isNaN, toNumber } from 'lodash'
import { parseArg } from '../utils'


export const numberValue = Flags.custom({
  char: `r`,
  description: `Number name/value pair workflow arg`,
  multiple: true,
  required: false,
  helpValue: `arg1=100.0`,
  parse: async input => {
    const [success, name, value] = parseArg(input)
    if (success) {
      const numberValue = toNumber(value)
      if (isNaN(numberValue)) {
        throw new Error(`${input} is invalid. Must contain a parsable number.`)
      }
      return {[name]: numberValue}
    } else {
      throw new Error(`${input} is invalid. Must be in the format of '${name||`foo`}=1.0'`)
    }
  }
})

export const coordinate = Flags.custom({
  multiple: false,
  required: false,
  exclusive: [`address`],
  async parse(input) {
    const numberValue = toNumber(input)
    if (isNaN(numberValue)) {
      throw new Error(`${input} is invalid. Must contain a parsable number.`)
    } else if (!(numberValue >= -90 && numberValue <= 90)) {
      throw new Error(`${input} is invalid. Must be between -90 and 90.`)
    }
    return numberValue
  },
})
