import { CliUx } from '@oclif/core'
import { get, isEmpty, times, find, indexOf, isArray, join, keys, map, replace, startsWith } from 'lodash'
import { MergedWorkflowInstance, Workflow } from './api'
import { ALL } from './constants'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const formatWorkflowArgs = (workflow: any, json=false): string => { // eslint-disable-line @typescript-eslint/no-explicit-any
  const args = workflow?.config?.trigger?.start?.workflow?.args||{}
  if (json) {
    return JSON.stringify(args, null, 2)
  } else {
    const strings = map(args, (value, arg) => (`${arg}=${value} | ${typeof value}`))
    return join(strings, `\n`)
  }
}

export const parseArg = (input: string): ([boolean, string]|[boolean, string, string]) => {
  const idx = indexOf(input, `=`)
  if (idx === -1) {
    return [false, input]
  }
  const name = input.slice(0, idx)
  const value = input.slice(idx+1)
  return [true, name, value]
}


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const formatWorkflowType = (workflow: any): string => { // eslint-disable-line @typescript-eslint/no-explicit-any
  const type = find<string>(keys(workflow.config.trigger), key => startsWith(key, `on_`))
  if (type) {
    const trigger = workflow.config.trigger[type]
    switch (type) {
      case `on_device_event`: {
        return `device:${trigger}`
      }
      case `on_phrases`:
      case `on_phrase`: { // `on_phrase` is deprecated, but leave in for backwards compatibilty
        return `phrases:${isArray(trigger) ? join(trigger,`,`) : trigger}`
      }
      case `on_button`: {
        return `button:${replace(trigger, /action_button_|_tap/g, ``)}`
      }
      case `on_call_request`: {
        return `call:outbound`
      }
      case `on_incoming_call`: {
        return `call:inbound`
      }
      case `on_timer`: {
        return `timer`
      }
      case `on_battery_discharge`: {
        return `battery:discharge:${trigger}`
      }
      case `on_battery_charge`: {
        return `battery:charge:${trigger}`
      }
      case `on_http`: {
        return `http:${trigger}`
      }
    }
  }
  return `unknown`
}

export function getOrThrow(obj: unknown, path: string[]): string {
  const value = get(obj, path)
  if (isEmpty(value)) {
    throw new Error(`required string is undefined, null, or empty`)
  }
  return value
}

export function s4(): string {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1)
}

export function uuid(): string {
  return join(times(11, s4), `_`)
}

export function base64url(str: string): string {
  return str.replace(/\+/g, `-`).replace(/\//g, `_`).replace(/=+$/, ``)
}

const displayInstall = (workflow: Workflow) => {
  if (workflow.install_rule) {
    if (workflow.install_rule === ALL) {
      return `all devices`
    } else {
      return `unknown rule`
    }
  } else if (workflow.install) {
    return workflow.install.join(`\n`)
  } else {
    return ``
  }
}

export const printWorkflows = (workflows: Workflow[], flags: unknown): void => {
  const options = { ...(flags as Record<string, unknown>) }
  CliUx.ux.styledHeader(`Installed Workflow${workflows.length > 1 ? `s` : ``}`)
  CliUx.ux.table(workflows, {
    workflow_id: {
      header: `ID`,
      get: row => row.workflow_id //last(row.workflow_id.split(`_`))
    },
    name: {},
    type: {
      get: formatWorkflowType,
    },
    uri: {
      get: row => row.config.trigger.start.workflow.uri,
      extended: true,
    },
    args: {
      get: formatWorkflowArgs,
      extended: true,
    },
    install: {
      header: `Installed on`,
      get: row => displayInstall(row),
      extended: true,
    }
  }, options)
}

const formatTerminateReason = (reason = ``): string => {
  return reason.replace(/[{|}]/g, ``).replace(/,/g, `:`)
}

export const printWorkflowInstances = (instances: MergedWorkflowInstance[], flags: unknown): void => {
  const options = { ...(flags as Record<string, unknown>) }
  CliUx.ux.styledHeader(`Workflow Instance${instances.length > 1 ? `s` : ``}`)
  CliUx.ux.table(instances, {
    instance_id: {
      header: `ID`,
      minWidth: 25,
      get: row => row.instance_id
    },
    workflow_id: {},
    name: {
      get: row => row.workflow?.name,
    },
    triggered_by: {
      header: `Triggered By`,
      get: row => row.triggering_user_id,
    },
    status: {},
    terminate_reason: {
      extended: true,
      get: row => formatTerminateReason(row.terminate_reason)
    },
    end_time: {
      extended: true,
      get: row => row.end_time ?? ``
    },
    type: {
      get: row => formatWorkflowType(row.workflow),
      extended: true,
    },
    uri: {
      get: row => row.workflow_uri,
      extended: true,
    },

  }, options)
}
