import { Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  formatToman,
  formatPersianDate,
  isPositive,
  type Category,
  type Transaction,
} from '@/lib/accounting'
import { TypePill } from './type-pill'

export function TransactionsTable({
  transactions,
  categories,
  onEdit,
  onDelete,
  showActions = false,
  showDescription = false,
}: {
  transactions: Transaction[]
  categories: Category[]
  onEdit?: (t: Transaction) => void
  onDelete?: (t: Transaction) => void
  showActions?: boolean
  showDescription?: boolean
}) {
  const categoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? '—'

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <p className="text-sm font-medium text-foreground">تراکنشی یافت نشد</p>
        <p className="text-xs text-muted-foreground">
          با تغییر فیلترها یا ثبت تراکنش جدید، اطلاعات اینجا نمایش داده می‌شود.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-right">
        <thead>
          <tr className="border-b border-border text-xs text-muted-foreground">
            <th className="whitespace-nowrap px-4 py-3 font-medium">عنوان</th>
            <th className="whitespace-nowrap px-4 py-3 font-medium">نوع تراکنش</th>
            <th className="whitespace-nowrap px-4 py-3 font-medium">دسته‌بندی</th>
            <th className="whitespace-nowrap px-4 py-3 font-medium">تاریخ</th>
            <th className="whitespace-nowrap px-4 py-3 font-medium">مبلغ</th>
            {showDescription && (
              <th className="whitespace-nowrap px-4 py-3 font-medium">توضیحات</th>
            )}
            {showActions && (
              <th className="whitespace-nowrap px-4 py-3 font-medium">عملیات</th>
            )}
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr
              key={t.id}
              className="border-b border-border/60 text-sm transition-colors last:border-0 hover:bg-secondary/50"
            >
              <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">
                {t.title}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <TypePill type={t.transaction_type} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                {categoryName(t.category_id)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                {formatPersianDate(t.date)}
              </td>
              <td
                className={cn(
                  'whitespace-nowrap px-4 py-3 font-semibold',
                  isPositive(t.transaction_type) ? 'text-success' : 'text-danger',
                )}
              >
                {isPositive(t.transaction_type) ? '+' : '−'} {formatToman(t.amount)}
              </td>
              {showDescription && (
                <td className="max-w-56 truncate px-4 py-3 text-muted-foreground">
                  {t.description || '—'}
                </td>
              )}
              {showActions && (
                <td className="whitespace-nowrap px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEdit?.(t)}
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                      aria-label={`ویرایش ${t.title}`}
                    >
                      <Pencil className="size-4" aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => onDelete?.(t)}
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-danger-muted hover:text-danger"
                      aria-label={`حذف ${t.title}`}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
