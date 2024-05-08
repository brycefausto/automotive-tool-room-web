export const isServer = (typeof window === 'undefined');

export function enumFromStringValue<T>(enm: { [s: string]: T }, value: string): T | undefined {
  return (Object.values(enm) as unknown as string[]).includes(value)
    ? value as unknown as T
    : undefined;
}

export function convertLinebreaks(s: string) {
  const separateLines = s.split(/\r?\n|\r|\n/g)

  return separateLines.join('\n')
}

export function convertLinebreaksText(s: string) {
  const separateLines = s.split(/\\n/g)

  return separateLines.join('\r')
}

export const isBrowser = typeof window !== 'undefined'

export function getStorageString(key: string) {
  if (isBrowser) {
    const obj = localStorage.getItem(key) 

    return obj
  }
}

export function setStorageString(key: string, value: string) {
  if (isBrowser) {
    localStorage.setItem(key, value)
  }
}

export function getStorageItem<T = any>(key: string) {
  if (isBrowser) {
    const obj = JSON.parse(localStorage.getItem(key) || '{}')

    return obj as T
  }
}

export function setStorageItem<T = any>(key: string, obj: T) {
  if (isBrowser) {
    localStorage.setItem(key, JSON.stringify(obj))
  }
}

export function clearStorageItem(key: string) {
  if (isBrowser) {
    localStorage.removeItem(key)
  }
}
