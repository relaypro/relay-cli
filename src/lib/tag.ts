// Copyright © 2022 Relay Inc.

import { TagForCreate } from './api.js'
import { mergeArgs } from './utils.js'

export const createTagContent = (type: string, category: string, label: string, arg: Record<string, string>[]): TagForCreate => {
  const nfcArgs = mergeArgs(arg)

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
    type,
    category,
    label,
    ...nfcArgs
  }

  return tagContent
}
