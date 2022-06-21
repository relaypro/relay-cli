// Copyright © 2022 Relay Inc.

import { Hook } from "@oclif/core"
// eslint-disable-next-line quotes
import debugFn = require('debug')

const debug = debugFn(`analytics`)

export const analytics: Hook<`prerun`> = async function (options) {
  // debug(options)
  debug({
    id: options.Command.id,
    version: options.config.version,
    channel: options.config.channel,
    arch: options.config.arch,
    platform: options.config.platform,
    userAgent: options.config.userAgent,
    shell: options.config.shell,
    args: options.argv.join(` `)
  })
}
