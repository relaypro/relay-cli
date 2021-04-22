import { DateTime } from 'luxon'

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

export const getTimestampNow = (): string => {
  return DateTime.local().set({ millisecond: 0 }).toISO({ suppressMilliseconds: true, includeOffset: false })
}
