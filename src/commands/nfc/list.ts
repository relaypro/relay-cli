// Copyright © 2022 Relay Inc.

import { CliUx } from '@oclif/core'

import { Command } from '../../lib/command'
import * as flags from '../../lib/flags'

// eslint-disable-next-line quotes
import debugFn = require('debug')
import { capitalize, fill, filter, keys, map, mapValues, size, union, zipObject } from 'lodash'
import { NfcTag } from '../../lib/api'
import { Ok, Result } from 'ts-results'

const debug = debugFn(`nfc`)

const customTableFields = (tags: NfcTag[]) => {
  const _keys = union(...map(tags, tag => keys(tag.content)))
  const _size = size(_keys)
  const filler = fill(Array(_size), {}, 0, _size)
  const fields = mapValues(zipObject(_keys, filler), (definition, key) => {
    return {
      ...definition,
      header: `${key}`,
      get: (row: NfcTag) => (row.content[key] ?? ``)
    }
  })
  return fields
}
filter
export class NfcTagListCommand extends Command {

  static description = `Lists all NFC tag configurations.`

  static enableJsonFlag = true

  static flags = {
    ...flags.subscriber,
    ...CliUx.ux.table.flags(),
    type: flags.enum({
      char: `t`,
      description: `Show only profile or custom NFC tags`,
      options: [`user_profile`, `custom`],
      default: `custom`,
      multiple: false,
      required: true,
    }),
    category: flags.string({
      char: `c`,
      description: `Show only NFC tags of this category`,
      multiple: false,
      required: false,
    })
  }

  async run(): Promise<Result<NfcTag[], Error>> {
    const { flags } = await this.parse(NfcTagListCommand)

    const tags = await this.relay.fetchNfcTags(flags[`subscriber-id`])

    debug(`NFC tags`, tags)

    const contentMatcher: Partial<Record<`type`|`category`, string>> = {  }
    if (flags.type) {
      contentMatcher.type = flags.type
    }
    if (flags.category) {
      contentMatcher.category = flags.category
    }

    const filteredTags = filter(tags, { content: contentMatcher })

    if (!this.jsonEnabled()) {
      let tableFields
      if (flags.type === `custom`) {
        if (flags.category === `routines`) {
          tableFields = {
            analytics: {
              extended: true,
              get: (row: NfcTag) => {
                const analyticsContent = row?.content?.analytics_content
                if (analyticsContent) {
                  const _analytics = JSON.parse(analyticsContent)
                  return JSON.stringify(_analytics, null, 2)
                } else {
                  return ``
                }
              }
            }
          }
        } else {
          tableFields = customTableFields(filteredTags)
        }
      } else if (flags.type === `user_profile`) {
        tableFields = {
          profile: {
            get: (row: NfcTag) => row.content.type_id
          }
        }
      } else {
        tableFields = {}
      }

      debug(`flags`, flags)
      debug(`tableFields`, tableFields)

      CliUx.ux.styledHeader(`${capitalize(flags.category || flags.type)} NFC Tag Configuration${filteredTags.length > 1 ? `s` : ``}`)
      CliUx.ux.table(filteredTags, {
        tag_id: {
          header: `Tag ID`,
          minWidth: 20,
        },
        uid: {
          header: `UID`,
          extended: true,
        },
        is_assigned: {
          header: `Is Assigned?`,
          get: row => !!row.uid
        },
        ...tableFields,
      }, {
        ...flags
      })
    }

    return Ok(filteredTags)
  }
}
