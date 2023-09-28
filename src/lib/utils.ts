// Copyright © 2022 Relay Inc.

import { CliUx } from '@oclif/core'
import { forEach, reduce, get, isEmpty, times, find, indexOf, isArray, join, keys, map, replace, startsWith } from 'lodash'
import { Geofence, MergedWorkflowInstance, ScheduledTask, Task, Workflow } from './api'
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
      case `on_geofence`: {
        return `geofence:${trigger}`
      }
      case `on_nfc`: {
        const { type, ...matchers } = workflow.config.trigger.on_nfc
        const _matchers = reduce(matchers, (str, value, key) => {
          str = `${str}\n${key}=${value}`
          return str
        }, ``)
        return `nfc:${type}${_matchers}`
      }
      case `on_position`: {
        return `position:${trigger.transition}:${trigger.position_id}`
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
      get: row => row.workflow_id,
      minWidth: 25,
    },
    name: {},
    type: {
      get: formatWorkflowType,
    },
    uri: {
      get: row => row.config.trigger.start.workflow.uri,
    },
    install: {
      header: `Installed on`,
      get: displayInstall,
    },
    args: {
      get: formatWorkflowArgs,
      extended: true,
    },
  }, options)
}

export const printGeofences = (geofences: Geofence[], flags: unknown): void => {
  const options = { ...(flags as Record<string, unknown>) }
  CliUx.ux.styledHeader(`Configured geofence${geofences.length > 1 ? `s` : ``}`)
  CliUx.ux.table(geofences, {
    geofence_id: {
      header: `ID`,
    },
    label: {
      header: `Name`,
    },
    radius: {},
    address: {},
    coordinates: {
      header: `Coordinates`,
      get: row => `${row.lat},${row.long}`,
    },
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
      header: `Instance id`,
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

export const printTasks = (tasks: Task[], flags: unknown): void => {
  const options = { ...(flags as Record<string, unknown>) }
  CliUx.ux.styledHeader(`Installed Task${tasks.length > 1 ? `s` : ``}`)
  CliUx.ux.table(tasks, {
    workflow_instance_id: {
      header: `Workflow Instance ID`,
      get: row=> row.workflow_instance_id
    },
    workflow_id: {
      header: `Workflow ID`,
      get: row=> row.workflow_id
    },
    timestamp: {
      header: `Timestamp`,
      get: row=> row.timestamp
    },
    task_name: {
      header: `Task name`,
      get: row => row.task_name,
    },
    task_id: {
      header: `Task ID`,
      get: row => row.task_id,
      minWidth: 25,
    },
    task_type_name: {
      header: `Task type name`,
      get: row => row.task_type_name,
    },
    status: {
      header: `Status`,
      get: row => row.status
    },
    task_type_namespace: {
      header: `Namespace`,
      get: row => row.task_type_namespace
    },
    assign_to: {
      header: `Assignee`,
      get: row => row.assign_to
    },
    task_type_major: {
      header: `Major`,
      get: row => row.task_type_major,
    },
    subscriber_id: {
      header: `Subscriber ID`,
      get: row => row.subscriber_id
    },
    args: {
      header: `Args`,
      get: row => row.args,
    },
  }, options)
}

export const printScheduledTasks = (tasks: ScheduledTask[], flags: unknown): void => {
  const options = { ...(flags as Record<string, unknown>) }
  CliUx.ux.styledHeader(`Installed Task${tasks.length > 1 ? `s` : ``}`)
  CliUx.ux.table(tasks, {
    task_name: {
      header: `Task name`,
      get: row => row.task_name,
    },
    scheduled_task_id: {
      header: `Scheduled Task ID`,
      get: row => row.scheduled_task_id,
      minWidth: 25
    },
    task_type_name: {
      header: `Task type name`,
      get: row => row.task_type_name,
    },
    task_type_namespace: {
      header: `Namespace`,
      get: row => row.task_type_namespace
    },
    start_time: {
      header: `Start time`,
      get: row => row.start_time
    },
    timezone: {
      header: `Timezone`,
      get: row => row.timezone
    },
    frequency: {
      header: `Frequency`,
      get: row => row.frequency
    },
    until: {
      header: `Until`,
      get: row => row.until
    },
    count: {
      header: `Count`,
      get: row => row.count
    },
    assign_to: {
      header: `Assignee`,
      get: row => row.assign_to
    },
    task_type_major: {
      header: `Major`,
      get: row => row.task_type_major,
    },
    subscriber_id: {
      header: `Subscriber ID`,
      get: row => row.subscriber_id
    },
    args: {
      header: `Args`,
      get: row => row.args,
    },
  }, options)
}

const mappings = {
  subscriberId: [`subId`, `sub_id`, `subscriber_id`, `subscriber`, `subscriberId`],
  userId: [`userId`, `uid`, `user_id`, `u_id`, `user`, `device`, `device_id`, `deviceId`, `userId`],
}

export const normalize = (endpoint: string, args: Record<string, string>) => {
  const _mappings = reduce(mappings, (result, alts, key) => {
    forEach(alts, alt => { result[alt] = key })
    return result
  }, {} as Record<string, string>)

  forEach(_mappings, (trueKey, key) => {
    const value = args[trueKey]
    if (value) {
      endpoint = replace(endpoint, `{${key}}`, value)
    }
  })

  return endpoint
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isTagMatch= (args: any, tag: string): boolean => {
  for (const t of args.tags) {
    if (t == tag) {
      return true
    }
  }
  return false
}

export const filterByTag = (tasks: Task[], tag: string): Task[] => {
  const filteredTasks: Task[] = []
  for (const task of tasks) {
    if (isTagMatch((task as Task).args, tag)) {
      filteredTasks.push(task as Task)
    }
  }
  return filteredTasks
}
