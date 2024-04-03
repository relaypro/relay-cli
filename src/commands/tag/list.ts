// Copyright © 2022 Relay Inc.

import { ux } from '@oclif/core'

import { Command } from '../../lib/command.js'
import * as flags from '../../lib/flags/index.js'

import debugFn from 'debug'
import { capitalize, fill, filter, isEmpty, keys, map, mapValues, replace, size, union, zipObject } from 'lodash-es'
import { Tag } from '../../lib/api.js'
import { Ok, Result } from 'ts-results-es'

const debug = debugFn(`tag`)

const customTableFields = (tags: Tag[]): Record<`type`|string, unknown> => {
  const _keys = union(...map(tags, tag => keys(tag.content)))
  const _size = size(_keys)
  const filler = fill(Array(_size), {}, 0, _size)
  const fields = mapValues(zipObject(_keys, filler), (definition, key) => {
    return {
      ...definition,
      header: `${key}`,
      get: (row: Tag) => (row.content[key] ?? ``)
    }
  })
  return fields
}

export class TagListCommand extends Command {

  static description = `Lists all tag configurations.`

  static enableJsonFlag = true

  static flags = {
    ...flags.subscriber,
    ...ux.table.flags(),
    type: flags.string({
      char: `t`,
      description: `Show only profile or custom tags`,
      options: [`user_profile`, `custom`],
      default: `custom`,
      hidden: true,
      multiple: false,
      required: true,
    }),
    category: flags.string({
      char: `c`,
      description: `Show only tags of this category`,
      multiple: false,
      required: false,
    })
  }

  async run(): Promise<Result<Tag[], Error>> {
    const { flags } = await this.parse(TagListCommand)

    const tags = await this.relay.fetchNfcTags(flags[`subscriber-id`])

    debug(`tags`, tags)

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
              get: (row: Tag) => {
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
            get: (row: Tag) => row.content.type_id
          }
        }
      } else {
        tableFields = {}
      }

      debug(`flags`, flags)
      debug(`tableFields`, tableFields)

      ux.styledHeader(`${replace(capitalize(flags.category || flags.type), `_`, ` `)} Tag Configuration${filteredTags.length > 1 ? `s` : ``}`)

      if (!isEmpty(filteredTags)) {
        ux.table(filteredTags, {
          tag_id: {
            header: `Tag ID`,
            minWidth: 25,
          },
          uid: {
            header: `UID`,
            extended: true,
          },
          is_paired: {
            header: `Is Paired?`,
            get: row => !!row.uid
          },
          ...tableFields,
        }, {
          ...flags
        })
      } else {
        this.log(`No tags configured`)
      }

    }

    return Ok(filteredTags)
  }
}
