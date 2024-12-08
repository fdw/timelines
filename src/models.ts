import { DateTime } from 'luxon'

export interface TimeRange {
  name: string
  start: DateTime
  stop: DateTime
  url: string
}

export interface SingularEvent {
  title: string
  date: DateTime
  url: string
}
