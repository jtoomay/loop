import { useMemo } from 'react'

export default function useTimezone() {
  return useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, [])
}
