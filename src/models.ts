import { DateTime } from 'luxon'

export interface Person {
  name: string
  birth: DateTime
  death: DateTime
}
