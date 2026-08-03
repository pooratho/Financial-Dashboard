import {
  isPositive,
  type Category,
  type Transaction,
} from './accounting'

/* ---------- Date range presets ---------- */

export type RangeKey = 'week' | 'month' | 'lastMonth' | 'year' | 'all'

export const rangeLabels: Record<RangeKey, string> = {
  week: 'این هفته',
  month: 'این ماه',
  lastMonth: 'ماه گذشته',
  year: 'امسال',
  all: 'کل دوره',
}

// Fixed "today" for the demo dataset (matches generated mock history).
const TODAY = new Date('2026-08-03')

export function getRange(key: RangeKey): { from: Date; to: Date } {
  const to = new Date(TODAY)
  to.setHours(23, 59, 59, 999)
  const from = new Date(TODAY)
  from.setHours(0, 0, 0, 0)

  switch (key) {
    case 'week':
      from.setDate(from.getDate() - 6)
      break
    case 'month':
      from.setDate(1)
      break
    case 'lastMonth': {
      from.setMonth(from.getMonth() - 1, 1)
      const end = new Date(from.getFullYear(), from.getMonth() + 1, 0)
      end.setHours(23, 59, 59, 999)
      return { from, to: end }
    }
    case 'year':
      from.setMonth(0, 1)
      break
    case 'all':
      from.setFullYear(2000, 0, 1)
      break
  }
  return { from, to }
}

export function filterByRange(transactions: Transaction[], key: RangeKey) {
  const { from, to } = getRange(key)
  return transactions.filter((t) => {
    const d = new Date(t.date)
    return d >= from && d <= to
  })
}

/* ---------- Aggregations ---------- */

export interface CategoryBreakdownRow {
  category: Category
  amount: number
  count: number
  percent: number
}

export function expenseBreakdown(
  transactions: Transaction[],
  categories: Category[],
): CategoryBreakdownRow[] {
  const map = new Map<string, { amount: number; count: number }>()
  let total = 0
  for (const t of transactions) {
    if (isPositive(t.transaction_type)) continue
    const entry = map.get(t.category_id) ?? { amount: 0, count: 0 }
    entry.amount += t.amount
    entry.count += 1
    total += t.amount
    map.set(t.category_id, entry)
  }
  return categories
    .map((c) => {
      const e = map.get(c.id) ?? { amount: 0, count: 0 }
      return {
        category: c,
        amount: e.amount,
        count: e.count,
        percent: total > 0 ? (e.amount / total) * 100 : 0,
      }
    })
    .filter((row) => row.amount > 0)
    .sort((a, b) => b.amount - a.amount)
}

export interface TrendPoint {
  label: string
  income: number
  expense: number
}

/** Buckets income/expense over time. Groups by day for short ranges, month otherwise. */
export function buildTrend(transactions: Transaction[], key: RangeKey): TrendPoint[] {
  const byMonth = key === 'year' || key === 'all'
  const buckets = new Map<string, { income: number; expense: number; sort: string }>()

  for (const t of transactions) {
    const d = new Date(t.date)
    const bucketKey = byMonth
      ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      : t.date
    const label = byMonth
      ? new Intl.DateTimeFormat('fa-IR', { month: 'long' }).format(d)
      : new Intl.DateTimeFormat('fa-IR', { day: 'numeric', month: 'short' }).format(d)
    const entry = buckets.get(bucketKey) ?? { income: 0, expense: 0, sort: bucketKey }
    if (isPositive(t.transaction_type)) entry.income += t.amount
    else entry.expense += t.amount
    buckets.set(bucketKey, entry)
    // store label alongside
    ;(entry as unknown as { label: string }).label = label
  }

  return Array.from(buckets.entries())
    .sort((a, b) => (a[1].sort < b[1].sort ? -1 : 1))
    .map(([, v]) => ({
      label: (v as unknown as { label: string }).label,
      income: v.income,
      expense: v.expense,
    }))
}

/* ---------- Pastel chart palette ---------- */

export const donutPalette = [
  '#7c9df0',
  '#8fd6b4',
  '#f5b9a1',
  '#f6cf7d',
  '#c7a8e8',
  '#a3d4e0',
  '#eaa6c3',
  '#b8c99a',
]

/* ---------- Insights ---------- */

export function buildInsights(
  transactions: Transaction[],
  categories: Category[],
  breakdown: CategoryBreakdownRow[],
): string[] {
  const insights: string[] = []
  if (breakdown.length > 0) {
    const top = breakdown[0]
    insights.push(
      `بیشترین هزینه شما در این بازه مربوط به «${top.category.name}» با ${top.percent.toLocaleString(
        'fa-IR',
        { maximumFractionDigits: 0 },
      )} درصد از کل هزینه‌ها بوده است.`,
    )
  }

  const income = transactions
    .filter((t) => isPositive(t.transaction_type))
    .reduce((s, t) => s + t.amount, 0)
  const expense = transactions
    .filter((t) => !isPositive(t.transaction_type))
    .reduce((s, t) => s + t.amount, 0)

  if (income > 0) {
    const rate = (expense / income) * 100
    if (rate < 70) {
      insights.push(
        `وضعیت مالی مطلوب است؛ هزینه‌ها تنها ${rate.toLocaleString('fa-IR', {
          maximumFractionDigits: 0,
        })} درصد از درآمد شما را تشکیل می‌دهند.`,
      )
    } else if (rate > 100) {
      insights.push('هزینه‌های این بازه از درآمد بیشتر شده است؛ جریان نقدی منفی است.')
    } else {
      insights.push(
        `نسبت هزینه به درآمد ${rate.toLocaleString('fa-IR', {
          maximumFractionDigits: 0,
        })} درصد است؛ فضای بیشتری برای پس‌انداز ایجاد کنید.`,
      )
    }
  }

  const incomeCount = transactions.filter((t) => isPositive(t.transaction_type)).length
  if (incomeCount > 0) {
    insights.push(`در این بازه ${incomeCount.toLocaleString('fa-IR')} تراکنش درآمدی ثبت شده است.`)
  }

  return insights
}
