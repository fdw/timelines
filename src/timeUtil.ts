import { DateTime } from 'luxon'

import { Person } from './models'

export const DATE_SCALE_FACTOR = 3
export const DATE_SCALE_UNIT = 'months'
export const DATE_ORIGIN = DateTime.fromISO('0000-01-01')

export function calculateAbsoluteX(date: DateTime): number {
  return calculateRelativeX(DATE_ORIGIN, date)
}

export function calculateRelativeX(start: DateTime, end: DateTime): number {
  return end.diff(start, DATE_SCALE_UNIT).as(DATE_SCALE_UNIT) / DATE_SCALE_FACTOR
}

export function sortByBirth(a: Person, b: Person): number {
  return a.birth < b.birth ? -1 : a.birth > b.birth ? 1 : 0
}

export function sortByDate(a: {date: DateTime}, b: {date: DateTime}): number {
  return a.date < b.date ? -1 : a.date > b.date ? 1 : 0
}

export function parseDate(string: string): DateTime {
  if (string === 'now') {
    return DateTime.local()
  } else if (string.startsWith('-')) {
    return DateTime.fromISO(`-00${string.substring(1)}`)
  }
  return DateTime.fromISO(string)
}
