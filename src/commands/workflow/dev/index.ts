// Copyright © 2022 Relay Inc.

// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-var-requires */
import { Command } from '../../../lib/command'

// eslint-disable-next-line quotes
import debugFn = require('debug')
const debug = debugFn(`dev`)

export default class Dev extends Command {
  static description = `workflow development`

  static hidden = true

  static args = [
    {
      name: `file`,
      required: true,
      description: `nodejs app entry point`
    }
  ]

  async run(): Promise<void> {
    const { args } = await this.parse(Dev)

    debug(args)

    const nodemon = require(`nodemon`)
    const ngrok = require(`ngrok`)
    const port = 3000

    nodemon({
      script: args.file,
      ext: `js`,
    })

    let url: string

    nodemon.on(`start`, async () => {
      if (!url) {
        url = await ngrok.connect({ port })
        console.log(`Server now available at ${url}`)
      }
    })

    nodemon.on(`quit`, async () => {
      await ngrok.kill()
    })
  }
}
