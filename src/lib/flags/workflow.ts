import { Flags } from '@oclif/core'

export const workflowId = Flags.string({
  char: `w`,
  description: `workflow id`,
  required: true,
  hidden: false,
  multiple: false,
  env: `RELAY_WORKFLOW_ID`
})
