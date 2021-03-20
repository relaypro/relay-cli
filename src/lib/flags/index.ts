export * from '@oclif/command/lib/flags'

import { subscriberId } from './subscriber'

export { workflowId } from './workflow'
export { booleanValue } from './boolean'
export { numberValue } from './number'

export const subscriber = {
  [`subscriber-id`]: subscriberId,
}
