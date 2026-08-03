'use client'

import { useMemo, useState } from 'react'
import { Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  transactionTypeLabels,
  type Category,
  type Transaction,
  type TransactionType,
} from '@/lib/accounting'
import { Label, Select, TextInput } from './field'
import { TransactionsTable } from './transactions-table'

export function TransactionsView({
  transactions,
  categories,
  search,
  onEdit,
  onDelete,
}: {
  transactions: Transaction[]
  categories: Category[]
  search: string
  onEdit: (t: Transaction) => void
  onDelete: (t: Transaction) => void
}) {
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const filtered = useMemo(() => {
    return transactions
      .filter((t) => {
        if (typeFilter !== 'all' && t.transaction_type !== typeFilter) return false
        if (categoryFilter !== 'all' && t.category_id !== categoryFilter) return false
        if (fromDate && t.date < fromDate) return false
        if (toDate && t.date > toDate) return false
        if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
        return true
      })
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [transactions, typeFilter, categoryFilter, fromDate, toDate, search])

  const hasFilters =
    typeFilter !== 'all' || categoryFilter !== 'all' || fromDate || toDate

  const resetFilters = () => {
    setTypeFilter('all')
    setCategoryFilter('all')
    setFromDate('')
    setToDate('')
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
          <Filter className="size-4 text-muted-foreground" aria-hidden="true" />
          فیلترها
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label htmlFor="f-type">نوع تراکنش</Label>
            <Select
              id="f-type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as TransactionType | 'all')}
            >
              <option value="all">همه انواع</option>
              {(Object.keys(transactionTypeLabels) as TransactionType[]).map((k) => (
                <option key={k} value={k}>
                  {transactionTypeLabels[k]}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="f-cat">دسته‌بندی</Label>
            <Select
              id="f-cat"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">همه دسته‌ها</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="f-from">از تاریخ</Label>
            <TextInput
              id="f-from"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="f-to">تا تاریخ</Label>
            <TextInput
              id="f-to"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>

        {hasFilters && (
          <div className="mt-3 flex justify-start">
            <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-1.5">
              <X className="size-3.5" aria-hidden="true" />
              حذف فیلترها
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-base font-bold text-foreground">فهرست تراکنش‌ها</h2>
          <span className="text-xs text-muted-foreground">
            {filtered.length.toLocaleString('fa-IR')} تراکنش
          </span>
        </div>
        <TransactionsTable
          transactions={filtered}
          categories={categories}
          onEdit={onEdit}
          onDelete={onDelete}
          showActions
          showDescription
        />
      </div>
    </div>
  )
}
