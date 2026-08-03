import { ArrowDownLeft, ArrowUpRight, TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { isPositive, transactionTypeLabels, type TransactionType } from '@/lib/accounting'

const iconMap = {
  income: TrendingUp,
  received: ArrowDownLeft,
  expense: TrendingDown,
  paid: ArrowUpRight,
} as const

export function TypePill({ type }: { type: TransactionType }) {
  const Icon = iconMap[type]
  const positive = isPositive(type)

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        positive
          ? 'bg-success-muted text-success'
          : 'bg-danger-muted text-danger',
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {transactionTypeLabels[type]}
    </span>
  )
}
