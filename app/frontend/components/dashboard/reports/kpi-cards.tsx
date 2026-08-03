import { ArrowDownLeft, ArrowUpRight, Scale, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatToman } from '@/lib/accounting'

export interface Kpi {
  totalIncome: number
  totalExpense: number
  netFlow: number
  totalBalance: number
}

export function KpiCards({ kpi }: { kpi: Kpi }) {
  const cards = [
    {
      label: 'مجموع درآمد',
      value: kpi.totalIncome,
      icon: ArrowUpRight,
      tone: 'success' as const,
      forceTone: true,
    },
    {
      label: 'مجموع هزینه',
      value: kpi.totalExpense,
      icon: ArrowDownLeft,
      tone: 'danger' as const,
      forceTone: true,
    },
    {
      label: 'جریان نقدی خالص',
      value: kpi.netFlow,
      icon: Scale,
      tone: kpi.netFlow >= 0 ? ('success' as const) : ('danger' as const),
      forceTone: false,
    },
    {
      label: 'مانده کل',
      value: kpi.totalBalance,
      icon: Wallet,
      tone: kpi.totalBalance >= 0 ? ('success' as const) : ('danger' as const),
      forceTone: false,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((c) => {
        const Icon = c.icon
        const positive = c.tone === 'success'
        return (
          <div
            key={c.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{c.label}</p>
              <span
                className={cn(
                  'flex size-9 items-center justify-center rounded-full',
                  positive ? 'bg-success-muted text-success' : 'bg-danger-muted text-danger',
                )}
              >
                <Icon className="size-4.5" aria-hidden="true" />
              </span>
            </div>
            <p
              className={cn(
                'mt-3 text-2xl font-bold tracking-tight',
                positive ? 'text-success' : 'text-danger',
              )}
            >
              {formatToman(c.value)}
            </p>
          </div>
        )
      })}
    </div>
  )
}
