import { Hook } from "@oclif/config"

const debug = require(`debug`)(`migrate`)

export const analytics: Hook<`prerun`> = async function (options) {
  debug(options)
}
