import { Hook } from '@oclif/core'

// eslint-disable-next-line quotes
import debugFn = require('debug')

const debug = debugFn(`migrate`)

export const analytics: Hook<`prerun`> = async function (options) {
  debug(options)
}
