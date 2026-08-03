'use client'

import { Pencil, Trash2, TrendingUp, TrendingDown, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { categoryTypeLabels, type Category, type Transaction } from '@/lib/accounting'

export function CategoriesView({
  categories,
  transactions,
  onEdit,
  onDelete,
  onAddNew,
}: {
  categories: Category[]
  transactions: Transaction[]
  onEdit: (c: Category) => void
  onDelete: (c: Category) => void
  onAddNew: () => void
}) {
  const countFor = (id: string) =>
    transactions.filter((t) => t.category_id === id).length

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {categories.length.toLocaleString('fa-IR')} دسته‌بندی ثبت شده است
        </p>
        <Button onClick={onAddNew} size="sm" className="gap-1.5">
          <Plus className="size-4" aria-hidden="true" />
          دسته‌بندی جدید
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => {
          const income = c.type === 'income'
          const Icon = income ? TrendingUp : TrendingDown
          return (
            <div
              key={c.id}
              className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'flex size-10 items-center justify-center rounded-xl',
                      income
                        ? 'bg-success-muted text-success'
                        : 'bg-danger-muted text-danger',
                    )}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{c.name}</p>
                    <span
                      className={cn(
                        'text-xs font-medium',
                        income ? 'text-success' : 'text-danger',
                      )}
                    >
                      {categoryTypeLabels[c.type]}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEdit(c)}
                    className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                    aria-label={`ویرایش ${c.name}`}
                  >
                    <Pencil className="size-4" aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => onDelete(c)}
                    className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-danger-muted hover:text-danger"
                    aria-label={`حذف ${c.name}`}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                {c.description || 'بدون توضیحات'}
              </p>

              <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
                {countFor(c.id).toLocaleString('fa-IR')} تراکنش مرتبط
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
