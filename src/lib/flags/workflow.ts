import { flags } from '@oclif/command'

export const workflowId = flags.string({
  char: `w`,
  description: `workflow id`,
  required: true,
  hidden: false,
  multiple: false,
  env: `RELAY_WORKFLOW_ID`
})
