import { Hook } from '@oclif/config'

// eslint-disable-next-line quotes
import debugFn = require('debug')

const debug = debugFn(`migrate`)

export const analytics: Hook<`prerun`> = async function (options) {
  debug(options)
}
