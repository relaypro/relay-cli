// Copyright © 2022 Relay Inc.

import { Command } from '../../lib/command'
import * as flags from '../../lib/flags'

import { filter, reduce } from 'lodash'
import { parseArg } from '../../lib/utils'

// eslint-disable-next-line quotes
import debugFn = require('debug')

const debug = debugFn(`nfc`)

export class NfcUpdateCommand extends Command {

  static description = `Updates an NFC tag configuration.`

  static flags = {
    ...flags.subscriber,
    [`tag-id`]: flags.string({
      char: `t`,
      required: true,
      multiple: false,
      description: `NFC tag identifier to update`,
    }),
    type: flags.enum({
      char: `t`,
      description: `Sets the NFC tag to profile or custom type`,
      options: [`user_profile`, `custom`],
      default: `custom`,
      multiple: false,
      required: true,
    }),
    arg: flags.string({
      char: `a`,
      multiple: true,
      required: false,
      description: `A content string name/value pair that can be used in the workflow trigger match and in the workflow START event`,
      helpValue: `"category=task"`,
    })
  }

  async run(): Promise<void> {
    const { flags, raw } = await  this.parse(NfcUpdateCommand)

    debug(`flags`, flags)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nfcArgsFlags = filter(raw, ({ flag }: any) => `arg` === flag)
    debug(`nfcArgsFlags`, nfcArgsFlags)
    const nfcArgs: Record<string, string> = reduce(nfcArgsFlags, (args, flag) => {
      const [, name, value] = parseArg(flag.input)
      return { ...args, [name]: value }
    }, {})
    debug(`nfcArgs`, nfcArgs)

    if (nfcArgs.type) {
      throw new Error(`An arg definition cannot have the name "type"; use flag "--type" instead`)
    }

    const tagContent = {
      type: flags.type,
      ...nfcArgs
    }

    debug(`tagContent`, tagContent)

    const response = await this.relay.updateNfcTag(flags[`subscriber-id`], flags[`tag-id`], tagContent)

    debug(`response`, response)
  }
}
