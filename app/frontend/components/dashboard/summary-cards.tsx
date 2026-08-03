import {
  TrendingUp,
  TrendingDown,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatToman, type Transaction } from '@/lib/accounting'

function computeTotals(transactions: Transaction[]) {
  const totals = { income: 0, expense: 0, received: 0, paid: 0 }
  for (const t of transactions) totals[t.transaction_type] += t.amount
  const balance = totals.income + totals.received - totals.expense - totals.paid
  return { ...totals, balance }
}

export function SummaryCards({ transactions }: { transactions: Transaction[] }) {
  const totals = computeTotals(transactions)

  const cards = [
    {
      label: 'مجموع درآمدها',
      value: totals.income,
      icon: TrendingUp,
      tone: 'success' as const,
    },
    {
      label: 'مجموع هزینه‌ها',
      value: totals.expense,
      icon: TrendingDown,
      tone: 'danger' as const,
    },
    {
      label: 'مجموع دریافت‌ها',
      value: totals.received,
      icon: ArrowDownLeft,
      tone: 'success' as const,
    },
    {
      label: 'مجموع پرداخت‌ها',
      value: totals.paid,
      icon: ArrowUpRight,
      tone: 'danger' as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{card.label}</span>
            <span
              className={cn(
                'flex size-9 items-center justify-center rounded-xl',
                card.tone === 'success'
                  ? 'bg-success-muted text-success'
                  : 'bg-danger-muted text-danger',
              )}
            >
              <card.icon className="size-5" aria-hidden="true" />
            </span>
          </div>
          <p
            className={cn(
              'mt-3 text-xl font-bold',
              card.tone === 'success' ? 'text-success' : 'text-danger',
            )}
          >
            {formatToman(card.value)}
          </p>
        </div>
      ))}

      {/* Balance card (highlighted) */}
      <div className="rounded-2xl border border-primary/20 bg-primary p-5 text-primary-foreground shadow-sm sm:col-span-2 xl:col-span-1">
        <div className="flex items-center justify-between">
          <span className="text-sm text-primary-foreground/80">مانده فعلی</span>
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary-foreground/15">
            <Wallet className="size-5" aria-hidden="true" />
          </span>
        </div>
        <p className="mt-3 text-xl font-bold">{formatToman(totals.balance)}</p>
      </div>
    </div>
  )
}
