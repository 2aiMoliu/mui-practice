import { useState } from 'react'

const NS = 'unipa-demo:'

/** useState that mirrors its value into localStorage. */
export function useStored<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(NS + key)
      return raw === null ? initial : (JSON.parse(raw) as T)
    } catch {
      return initial
    }
  })
  const set = (next: T | ((prev: T) => T)) =>
    setValue((prev) => {
      const v = typeof next === 'function' ? (next as (p: T) => T)(prev) : next
      try {
        localStorage.setItem(NS + key, JSON.stringify(v))
      } catch {
        // storage unavailable (private mode etc.) — keep in-memory state
      }
      return v
    })
  return [value, set] as const
}
