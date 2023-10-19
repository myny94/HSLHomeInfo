function zeroPad(n: number) {
  return n < 10 ? `0${n}` : n
}

export const timeConverter = (UNIX_timestamp: number) => {
  const a = new Date(UNIX_timestamp * 1000)
  const today = new Date().getDate()
  const date = a.getDate()
  const hour = zeroPad(a.getHours())
  const min = zeroPad(a.getMinutes())
  if (today === date) {
    return ['today', `${hour}:${min}`]
  }
  return ['tomorrow', `${hour}:${min}`]
}

export const remainingTimeConverter = (UNIX_timestamp: number) => {
  const currentTime = Math.floor(Date.now() / 1000)
  const TimeDiff = Math.floor((UNIX_timestamp - currentTime) / 60)
  const min = TimeDiff % 60
  const hour = Math.floor(TimeDiff / 60) % 24

  if (hour === 0) {
    if (min > 0 && min < 50) {
      return `${min} min`
    }
    if (min < 0) {
      return `${Math.abs(min)} min ago`
    }
  }
  return ''
}

// Type guard
export const isDefined = <T>(variable: T | undefined | null): variable is T =>
  variable !== null && variable !== undefined

export const stringToIconName = (string: string) =>
  `/images/${string.toLowerCase()}Icon.svg`
