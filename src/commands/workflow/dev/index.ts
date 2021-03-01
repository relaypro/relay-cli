import { Command } from '../../../lib/command'

const debug = require('debug')(`dev`)

export default class Dev extends Command {
  static description = 'workflow development'

  static args = [
    {
      name: `file`,
      required: true,
      description: `nodejs app entry point`
    }
  ]

  async run() {
    const { args } = this.parse(Dev)

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
