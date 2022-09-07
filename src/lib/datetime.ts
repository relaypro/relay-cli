// Copyright © 2022 Relay Inc.

import { DateTime } from 'luxon'
import { Day, DayValue } from './api'
import { timerFlags } from './flags'

export const getFormattedTimestamp = (value: string, format: string): string => {
  if (format === `relative`) {
    const result =  DateTime.fromISO(value).toRelative()
    return result ?? value
  } else {
    return value
  }
}

export const getTimestampFromFlag = (value: string, zone: string): string => {
  const dateTime = DateTime.fromISO(value, { zone })
  const dateTimeUTC = dateTime.toUTC()
  const timestamp = dateTimeUTC.toISO({ suppressMilliseconds: true, includeOffset: false })
  if (!timestamp) {
    throw new Error(`failed to parse ${value} with timezone ${zone}`)
  } else {
    return timestamp
  }
}

export const resolveTimezone = (zone: string): string => {
  if (zone === `local`) {
    const localTz = DateTime.local().zoneName
    if (timerFlags.timezone.options?.includes(localTz)) {
      return localTz
    } else {
      throw new Error(`local timezone ${localTz} not valid`)
    }
  } else {
    return zone
  }
}

export const withoutZ = (dateTimeStr: string): string => {
  const dateTime = DateTime.fromISO(dateTimeStr)
  return `${dateTime.toFormat(`y-LL-dd`)}T${dateTime.toFormat(`HH:mm:ss`)}`
}

const format = (dateTime: DateTime): string  => {
  return dateTime.set({ millisecond: 0 }).toISO({ suppressMilliseconds: true, includeOffset: false })
}

export const getTimestampFarFuture = (): string => {
  const dateTime = DateTime.local().plus({ years: 10 })
  return format(dateTime)
}

export const getTimestampNextHour = (): string => {
  const dateTime = DateTime.local().plus({ hours: 1 }).startOf(`hour`)
  return format(dateTime)
}

export const getTimestampNow = (): string => {
  const dateTime = DateTime.local()
  return format(dateTime)
}

export const resolveDay = (label: string): Day => {
  const day = days.find(day => day.label === label)
  if (!day) {
    throw new Error(`failed to resolve day with value '${label}''`)
  }
  return day
}

export const resolveDayValues = (labels: string[]): DayValue[] => {
  return labels.map(label => resolveDay(label).value)
}

export const days: Day[] = [{
  label: `MO`,
  name: `Monday`,
  value: 1
}, {
  label: `TU`,
  name: `Tuesday`,
  value: 2
}, {
  label: `WE`,
  name: `Wednesday`,
  value: 3
}, {
  label: `TH`,
  name: `Thursday`,
  value: 4
}, {
  label: `FR`,
  name: `Friday`,
  value: 5
}, {
  label: `SA`,
  name: `Saturday`,
  value: 6
}, {
  label: `SU`,
  name: `Sunday`,
  value: 7
}]
