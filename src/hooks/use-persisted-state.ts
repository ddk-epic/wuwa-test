import { useEffect, useState } from "react"

function setItem(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.log("ls-set-item-error", err)
  }
}

function getItem<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : defaultValue
  } catch (err) {
    console.log("ls-get-item-error", err)
    return defaultValue
  }
}

export function usePersistedState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const saved = getItem(key, initialValue)
    return saved
  })

  // on mount
  useEffect(() => {
    const saved = getItem(key, initialValue)
    if (saved) {
      setValue(saved)
    }
  }, [])

  useEffect(() => {
    setItem(key, value)
  }, [key, value])

  return [value, setValue] as const
}
