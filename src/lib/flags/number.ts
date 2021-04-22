import { flags } from '@oclif/command'
import { isNaN, toNumber } from 'lodash'
import { parseArg } from '../utils'

export const numberValue = flags.build({
  char: `r`,
  description: `Number name/value pair workflow arg`,
  multiple: true,
  required: false,
  helpValue: `arg1=100.0`,
  parse: input => {
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
