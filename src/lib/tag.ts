import { ParsingToken } from '@oclif/core/lib/interfaces'
import { filter, reduce } from 'lodash'
import { TagForCreate } from './api'
import { TagFlags } from './flags'
import { parseArg } from './utils'

export const createTagContent = (flags: TagFlags, raw: ParsingToken[]): TagForCreate => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nfcArgsFlags = filter(raw, ({ flag }: any) => `arg` === flag)

  const nfcArgs: Record<string, string> = reduce(nfcArgsFlags, (args, flag) => {
    const [, name, value] = parseArg(flag.input)
    return { ...args, [name]: value }
  }, {})

  if (nfcArgs.type) {
    throw new Error(`An arg definition cannot have the name "type"; use flag "--type" instead`)
  }

  if (nfcArgs.category) {
    throw new Error(`An arg definition cannot have the name "type"; use flag "--category" instead`)
  }

  if (nfcArgs.label) {
    throw new Error(`An arg definition cannot have the name "type"; use flag "--label" instead`)
  }

  const tagContent = {
    type: flags.type,
    category: flags.category,
    label: flags.label,
    ...nfcArgs
  }

  return tagContent
}
