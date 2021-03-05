import { Hook } from "@oclif/config"

const debug = require(`debug`)(`analytics`)

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
