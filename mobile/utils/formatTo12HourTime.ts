export default function formatTo12HourTime(timeStr: string): string {
  // Remove microseconds if present (split at '.')
  const cleanTime = timeStr.split('.')[0] // "12:17:00"

  // Parse with Date (we use an arbitrary date)
  const date = new Date(`2000-01-01T${cleanTime}`)

  // Use Intl.DateTimeFormat for locale-aware 12-hour format
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric', // 1–12
    minute: '2-digit', // 00–59 with leading zero
    hour12: true, // AM/PM
  }).format(date)
}
