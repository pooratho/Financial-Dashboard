'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  transactionTypeLabels,
  type Category,
  type Transaction,
  type TransactionType,
} from '@/lib/accounting'
import { Label, Select, TextInput, Textarea } from './field'

type FormState = {
  title: string
  transaction_type: TransactionType
  category_id: string
  amount: string
  date: string
  description: string
}

const emptyForm = (categories: Category[]): FormState => ({
  title: '',
  transaction_type: 'income',
  category_id: categories[0]?.id ?? '',
  amount: '',
  date: new Date().toISOString().slice(0, 10),
  description: '',
})

export function TransactionModal({
  open,
  onClose,
  onSave,
  categories,
  editing,
}: {
  open: boolean
  onClose: () => void
  onSave: (t: Transaction) => void
  categories: Category[]
  editing: Transaction | null
}) {
  const [form, setForm] = useState<FormState>(emptyForm(categories))
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!open) return
    if (editing) {
      setForm({
        title: editing.title,
        transaction_type: editing.transaction_type,
        category_id: editing.category_id,
        amount: String(editing.amount),
        date: editing.date,
        description: editing.description ?? '',
      })
    } else {
      setForm(emptyForm(categories))
    }
    setErrors({})
  }, [open, editing, categories])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  const update = (key: keyof FormState, value: string) =>
    setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (!form.title.trim()) nextErrors.title = 'عنوان الزامی است'
    const amount = Number(form.amount)
    if (!form.amount || Number.isNaN(amount) || amount <= 0)
      nextErrors.amount = 'مبلغ باید عددی مثبت باشد'
    if (!form.category_id) nextErrors.category_id = 'دسته‌بندی را انتخاب کنید'
    if (!form.date) nextErrors.date = 'تاریخ الزامی است'

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    onSave({
      id: editing?.id ?? `t-${Date.now()}`,
      title: form.title.trim(),
      transaction_type: form.transaction_type,
      category_id: form.category_id,
      amount,
      date: form.date,
      description: form.description.trim() || undefined,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 id="modal-title" className="text-base font-bold text-foreground">
            {editing ? 'ویرایش تراکنش' : 'ثبت تراکنش جدید'}
          </h2>
          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="بستن"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="grid grid-cols-1 gap-4 overflow-y-auto px-6 py-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label htmlFor="m-title" required>
                عنوان
              </Label>
              <TextInput
                id="m-title"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="مثلاً فروش قرارداد نرم‌افزاری"
                aria-invalid={!!errors.title}
              />
              {errors.title && <p className="mt-1 text-xs text-danger">{errors.title}</p>}
            </div>

            <div>
              <Label htmlFor="m-type" required>
                نوع تراکنش
              </Label>
              <Select
                id="m-type"
                value={form.transaction_type}
                onChange={(e) => update('transaction_type', e.target.value)}
              >
                {(Object.keys(transactionTypeLabels) as TransactionType[]).map((k) => (
                  <option key={k} value={k}>
                    {transactionTypeLabels[k]}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="m-cat" required>
                دسته‌بندی
              </Label>
              <Select
                id="m-cat"
                value={form.category_id}
                onChange={(e) => update('category_id', e.target.value)}
                aria-invalid={!!errors.category_id}
              >
                <option value="" disabled>
                  انتخاب دسته‌بندی
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
              {errors.category_id && (
                <p className="mt-1 text-xs text-danger">{errors.category_id}</p>
              )}
            </div>

            <div>
              <Label htmlFor="m-amount" required>
                مبلغ (تومان)
              </Label>
              <TextInput
                id="m-amount"
                type="number"
                min={0}
                step={1000}
                inputMode="numeric"
                value={form.amount}
                onChange={(e) => update('amount', e.target.value)}
                placeholder="0"
                aria-invalid={!!errors.amount}
              />
              {errors.amount && <p className="mt-1 text-xs text-danger">{errors.amount}</p>}
            </div>

            <div>
              <Label htmlFor="m-date" required>
                تاریخ
              </Label>
              <TextInput
                id="m-date"
                type="date"
                value={form.date}
                onChange={(e) => update('date', e.target.value)}
                aria-invalid={!!errors.date}
              />
              {errors.date && <p className="mt-1 text-xs text-danger">{errors.date}</p>}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="m-desc">توضیحات (اختیاری)</Label>
              <Textarea
                id="m-desc"
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                placeholder="توضیحات تکمیلی درباره این تراکنش..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-border bg-secondary/40 px-6 py-4">
            <Button type="button" variant="outline" size="lg" onClick={onClose}>
              انصراف
            </Button>
            <Button type="submit" size="lg">
              ذخیره
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
