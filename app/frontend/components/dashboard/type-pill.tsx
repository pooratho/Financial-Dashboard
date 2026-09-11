import { ArrowDownLeft, ArrowUpRight, TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { isPositive, transactionTypeLabels, type TransactionType } from '@/lib/accounting'

const iconMap = {
  income: TrendingUp,
  received: ArrowDownLeft,
  expense: TrendingDown,
  paid: ArrowUpRight,
} as const

// 👈 تایپ string رو هم اضافه کردیم تا دیتای خام بک‌اند رو قبول کنه
export function TypePill({ type }: { type: TransactionType | string }) {
  // 🌟 جادوی اصلی: یکسان‌سازی حروف برای جلوگیری از undefined شدن آیکون
  const normalizedType = String(type).toLowerCase() as TransactionType
  
  const Icon = iconMap[normalizedType]
  const positive = isPositive(normalizedType)

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        positive
          ? 'bg-success-muted text-success'
          : 'bg-danger-muted text-danger',
      )}
    >
      {/* 👈 یک چک امنیتی اضافه کردیم تا اگر به هر دلیلی آیکون پیدا نشد، اپلیکیشن کرش نکند */}
      {Icon && <Icon className="size-3.5" aria-hidden="true" />}
      {transactionTypeLabels[normalizedType] || normalizedType}
    </span>
  )
}