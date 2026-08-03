import { cn } from '@/lib/utils'
import { formatToman, type Transaction } from '@/lib/accounting'

export function IncomeExpenseChart({ transactions }: { transactions: Transaction[] }) {
  const totals = { income: 0, expense: 0, received: 0, paid: 0 }
  for (const t of transactions) totals[t.transaction_type] += t.amount

  const bars = [
    { label: 'درآمد', value: totals.income, tone: 'success' as const },
    { label: 'دریافت', value: totals.received, tone: 'success' as const },
    { label: 'هزینه', value: totals.expense, tone: 'danger' as const },
    { label: 'پرداخت', value: totals.paid, tone: 'danger' as const },
  ]

  const max = Math.max(...bars.map((b) => b.value), 1)

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-base font-bold text-foreground">مقایسه درآمد و هزینه</h2>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-success" /> ورودی
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-danger" /> خروجی
          </span>
        </div>
      </div>

      <div className="flex h-56 items-end justify-around gap-4">
        {bars.map((bar) => (
          <div key={bar.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              {formatToman(bar.value)}
            </span>
            <div
              className={cn(
                'w-full max-w-16 rounded-t-lg transition-all',
                bar.tone === 'success' ? 'bg-success' : 'bg-danger',
              )}
              style={{ height: `${(bar.value / max) * 100}%` }}
            />
            <span className="text-sm font-medium text-foreground">{bar.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
