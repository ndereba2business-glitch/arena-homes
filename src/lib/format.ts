const ksh = new Intl.NumberFormat('en-KE', { maximumFractionDigits: 0 })

/** 15500 → "KSh 15,500" */
export const formatKsh = (amount: number) => `KSh ${ksh.format(amount)}`

/** Local-date ISO string (YYYY-MM-DD) — avoids the UTC shift of toISOString(). */
export const toISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export const parseISODate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const todayISO = () => toISODate(new Date())

export const addDays = (iso: string, days: number) => {
  const d = parseISODate(iso)
  d.setDate(d.getDate() + days)
  return toISODate(d)
}

export const nightsBetween = (from: string, to: string) =>
  Math.round((parseISODate(to).getTime() - parseISODate(from).getTime()) / 86_400_000)

const dateFmt = new Intl.DateTimeFormat('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })

/** "2026-10-01" → "1 Oct 2026" */
export const formatDate = (iso: string) => (iso ? dateFmt.format(parseISODate(iso)) : '')

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`
