import { flags } from '@oclif/command'
import { parseArg } from '../utils'

export const booleanValue = flags.build({
  char: `b`,
  description: `boolean arg name/value pair`,
  multiple: true,
  required: false,
  parse: input => {
    const [success, name, value] = parseArg(input)
    if (success && (value === `true` || value === `false`)) {
      return {[name]: value === `true`}
    } else {
      throw new Error(`${input} is invalid. Must be in the format of 'foo=true' or 'foo=false'`)
    }
  }
})
