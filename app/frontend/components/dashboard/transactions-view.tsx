'use client'

import { useEffect, useState } from 'react'
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

// 👇 ایمپورت‌های مربوط به تقویم شمسی
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"

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

  const [serverData, setServerData] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFilteredTransactions = async () => {
      setIsLoading(true)
      const token = localStorage.getItem('accessToken')
      if (!token) return

      try {
        const params = new URLSearchParams()
        
        if (typeFilter !== 'all') params.append('transaction_type', typeFilter.toUpperCase())
        if (categoryFilter !== 'all') params.append('category', categoryFilter)
        if (fromDate) params.append('from_date', fromDate)
        if (toDate) params.append('to_date', toDate)
        if (search) params.append('search', search)

        const url = `${process.env.NEXT_PUBLIC_API_URL}/finance/transactions/?${params.toString()}`

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setServerData(data.results || data)
        } else {
          console.error("❌ خطا در دریافت تراکنش‌ها:", await response.text())
        }
      } catch (error) {
        console.error("❌ خطای ارتباط با سرور:", error)
      } finally {
        setIsLoading(false)
      }
    }

    const delayDebounceFn = setTimeout(() => {
      fetchFilteredTransactions()
    }, 300)

    return () => clearTimeout(delayDebounceFn)

  }, [typeFilter, categoryFilter, fromDate, toDate, search, transactions]) 

  const hasFilters = typeFilter !== 'all' || categoryFilter !== 'all' || fromDate || toDate

  const resetFilters = () => {
    setTypeFilter('all')
    setCategoryFilter('all')
    setFromDate('')
    setToDate('')
  }

  // 👇 توابع کمکی برای تبدیل تاریخ بین فرمت میلادی (برای سرور) و آبجکت تقویم (برای نمایش)
  const getPickerDate = (dateStr: string) => {
    if (!dateStr) return null
    return new Date(dateStr)
  }

  const handleDateChange = (dateObject: any, setter: (val: string) => void) => {
    if (dateObject) {
      const date = dateObject.toDate()
      const y = date.getFullYear()
      const m = String(date.getMonth() + 1).padStart(2, '0')
      const d = String(date.getDate()).padStart(2, '0')
      setter(`${y}-${m}-${d}`)
    } else {
      setter('')
    }
  }

  // کلاس‌های استاندارد تیلویند برای هماهنگی ظاهر تقویم با بقیه فیلدها
  const pickerInputClass = "flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
          <Filter className="size-4 text-muted-foreground" aria-hidden="true" />
          فیلترها
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          
          <div className="flex flex-col gap-1.5">
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

          <div className="flex flex-col gap-1.5">
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

          {/* 👇 جایگزینی فیلد "از تاریخ" با تقویم شمسی */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="f-from">از تاریخ</Label>
            <DatePicker
              calendar={persian}
              locale={persian_fa}
              value={getPickerDate(fromDate)}
              onChange={(date) => handleDateChange(date, setFromDate)}
              inputClass={pickerInputClass}
              containerClassName="w-full"
              placeholder="انتخاب تاریخ..."
            />
          </div>

          {/* 👇 جایگزینی فیلد "تا تاریخ" با تقویم شمسی */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="f-to">تا تاریخ</Label>
            <DatePicker
              calendar={persian}
              locale={persian_fa}
              value={getPickerDate(toDate)}
              onChange={(date) => handleDateChange(date, setToDate)}
              inputClass={pickerInputClass}
              containerClassName="w-full"
              placeholder="انتخاب تاریخ..."
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

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-base font-bold text-foreground">فهرست تراکنش‌ها</h2>
          <span className="text-xs text-muted-foreground">
            {isLoading ? 'در حال جستجو...' : `${serverData.length.toLocaleString('fa-IR')} تراکنش`}
          </span>
        </div>
        
        {isLoading && serverData.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-muted-foreground">
            در حال بارگذاری اطلاعات از سرور...
          </div>
        ) : (
          <TransactionsTable
            transactions={serverData}
            categories={categories}
            onEdit={onEdit}
            onDelete={onDelete}
            showActions
            showDescription
          />
        )}
      </div>
    </div>
  )
}