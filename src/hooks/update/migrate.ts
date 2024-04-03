// Copyright © 2022 Relay Inc.

import { Hook } from '@oclif/core'

import debugFn from 'debug'

const debug = debugFn(`migrate`)

export const analytics: Hook<`prerun`> = async function (options) {
  debug(options)
}
