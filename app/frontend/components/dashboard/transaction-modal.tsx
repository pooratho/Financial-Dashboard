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

// 👇 ایمپورت‌های مربوط به تقویم شمسی
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"

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
  const [isSubmitting, setIsSubmitting] = useState(false)

useEffect(() => {
    if (!open) return
    if (editing) {
      const editData = editing as any; // 👈 این متغیر جادویی را اضافه کردیم تا گیرهای تایپ‌اسکریپت را دور بزنیم
      setForm({
        title: editData.title,
        transaction_type: editData.transaction_type,
        category_id: typeof editData.category === 'object' ? String(editData.category.id) : String(editData.category || editData.category_id),
        amount: String(editData.amount),
        date: editData.date,
        description: editData.descriptions ?? editData.description ?? '',
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

  const handleSubmit = async (e: React.FormEvent) => {
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

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        alert("لطفاً ابتدا وارد حساب کاربری شوید.")
        return
      }

      const payload = {
        title: form.title.trim(),
        transaction_type: form.transaction_type.toUpperCase(),
        category: form.category_id, 
        amount: amount,
        date: form.date, // اینجا تاریخ فرمت YYYY-MM-DD به بک‌اند ارسال میشه
        descriptions: form.description.trim() || "", 
      }

      const url = editing
        ? `${process.env.NEXT_PUBLIC_API_URL}/finance/transactions/${editing.id}/`
        : `${process.env.NEXT_PUBLIC_API_URL}/finance/transactions/`
      
      const method = editing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const responseText = await response.text()
      let data: any = {}
      
      try {
        if (responseText) {
          data = JSON.parse(responseText)
        }
      } catch (parseError) {
        console.error("❌ سرور به جای JSON یک متن نامعتبر فرستاد:", responseText)
        setErrors({ server: `خطای سرور (${response.status}): جنگو کرش کرد!` })
        setIsSubmitting(false)
        return
      }

      if (response.ok) {
        console.log("✅ تراکنش با موفقیت ذخیره شد:", data)
        onSave(data)
        onClose()
      } else {
        console.error("❌ خطای ولیدیشن بک‌اند:", data)
        let errorMessage = 'اطلاعات وارد شده نامعتبر است. لطفاً بررسی کنید.'
        if (data && typeof data === 'object') {
          const allErrors = Object.values(data).flat()
          if (allErrors.length > 0) {
            // @ts-ignore
            errorMessage = allErrors.join(' | ') 
          }
        }
        setErrors({ server: errorMessage })
      }
      
    } catch (error) {
      console.error("❌ خطا در ارتباط با سرور:", error)
      setErrors({ server: 'ارتباط با سرور قطع شد.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 👇 تبدیل تاریخ میلادی (استیت فرم) به آبجکتِ تقویم برای نمایش اولیه
  const getCurrentDateObject = () => {
    if (!form.date) return null
    return new Date(form.date)
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
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 id="modal-title" className="text-base font-bold text-foreground">
            {editing ? 'ویرایش تراکنش' : 'ثبت تراکنش جدید'}
          </h2>
          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="بستن"
            disabled={isSubmitting}
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="grid grid-cols-1 gap-4 overflow-y-auto px-6 py-5 md:grid-cols-2">
            
            {errors.server && (
              <div className="md:col-span-2 p-3 text-sm text-danger bg-danger-muted rounded-md border border-danger/20">
                {errors.server}
              </div>
            )}

            <div className="md:col-span-2">
              <Label htmlFor="m-title" required>عنوان</Label>
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
              <Label htmlFor="m-type" required>نوع تراکنش</Label>
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
              <Label htmlFor="m-cat" required>دسته‌بندی</Label>
              <Select
                id="m-cat"
                value={form.category_id}
                onChange={(e) => update('category_id', e.target.value)}
                aria-invalid={!!errors.category_id}
              >
                <option value="" disabled>انتخاب دسته‌بندی</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
              {errors.category_id && <p className="mt-1 text-xs text-danger">{errors.category_id}</p>}
            </div>

            <div>
              <Label htmlFor="m-amount" required>مبلغ (تومان)</Label>
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

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="m-date" required>تاریخ</Label>
              {/* 👇 جادوی تقویم شمسی اینجاست */}
              <DatePicker
                calendar={persian}
                locale={persian_fa}
                value={getCurrentDateObject()}
                onChange={(dateObject: any) => {
                  if (dateObject) {
                    // تبدیل تاریخ شمسی به میلادیِ استاندارد برای ذخیره در استیت و ارسال به سرور
                    const date = dateObject.toDate()
                    const y = date.getFullYear()
                    const m = String(date.getMonth() + 1).padStart(2, '0')
                    const d = String(date.getDate()).padStart(2, '0')
                    update('date', `${y}-${m}-${d}`)
                  } else {
                    update('date', '')
                  }
                }}
                inputClass={`flex h-10 w-full rounded-xl border bg-background px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.date ? 'border-danger' : 'border-input'}`}
                containerClassName="w-full"
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

          <div className="flex items-center justify-end gap-3 border-t border-border bg-secondary/40 px-6 py-4">
            <Button type="button" variant="outline" size="lg" onClick={onClose} disabled={isSubmitting}>
              انصراف
            </Button>
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? 'در حال ذخیره...' : 'ذخیره'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}