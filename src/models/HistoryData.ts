interface EventData {
  name: string,
  date: string
  url: string
}

interface EraData {
  name: string,
  start: string,
  end: string,
  url: string
}

interface PersonData {
  name: string,
  birth: string,
  death: string,
  url: string,
  events?: EventData[]
  short_name?: string
}

export interface HistoryData {
  events?: EventData[],
  eras?: EraData[],
  people?: PersonData[],
}

