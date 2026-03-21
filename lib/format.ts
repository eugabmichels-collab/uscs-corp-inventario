export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR")
}

export function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatRelativeTime(dateStr: string) {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMin / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMin < 1) return "agora"
  if (diffMin < 60) return `há ${diffMin}min`
  if (diffHours < 24) return `há ${diffHours}h`
  return `há ${diffDays}d`
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter((_, i, arr) => i === 0 || i === arr.length - 1)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export function getDuration(start: string, end: string | null) {
  if (!end) return null
  const diffMs = new Date(end).getTime() - new Date(start).getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 60) return `${diffMin} min`
  const hours = Math.floor(diffMin / 60)
  const mins = diffMin % 60
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
}
