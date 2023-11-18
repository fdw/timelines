import { DateTime } from 'luxon'

export interface Person {
  name: string
  birth: DateTime
  death: DateTime
  url: string
}

export interface Event {
  title: string
  date: DateTime
  url: string
}
