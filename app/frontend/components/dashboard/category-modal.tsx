'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  categoryTypeLabels,
  type Category,
  type CategoryType,
} from '@/lib/accounting'
import { Label, Select, TextInput, Textarea } from './field'

export function CategoryModal({
  open,
  onClose,
  onSave,
  editing,
}: {
  open: boolean
  onClose: () => void
  onSave: (c: Category) => void
  editing: Category | null
}) {
  const [name, setName] = useState('')
  const [type, setType] = useState<CategoryType>('income')
  const [description, setDescription] = useState('')
  
  // 👇 تبدیل error استرینگ به آبجکت برای مدیریت خطاهای مختلف
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return
    setName(editing?.name ?? '')
    
    // 👇 هماهنگ‌سازی فیلد category_type از بک‌اند با type در فرانت‌اند
    const initialType = (editing as any)?.category_type?.toLowerCase() || editing?.type || 'income'
    setType(initialType as CategoryType)
    
    setDescription(editing?.description ?? '')
    setErrors({})
  }, [open, editing])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  // 👇 تابع به async تبدیل شد تا ریکوئست بفرستد
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors: Record<string, string> = {}

    if (!name.trim()) {
      nextErrors.name = 'نام دسته‌بندی الزامی است'
      setErrors(nextErrors)
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        alert('لطفاً ابتدا وارد حساب کاربری شوید.')
        setIsSubmitting(false)
        return
      }

      // ۱. آماده‌سازی دیتا دقیقاً مطابق با CategorySerializer جنگو
      const payload = {
        name: name.trim(),
        category_type: type.toUpperCase(), // ارسال با حروف بزرگ برای بک‌اند
        description: description.trim(),
      }

      // ۲. تشخیص ثبت جدید (POST) یا ویرایش (PUT)
      const url = editing
        ? `${process.env.NEXT_PUBLIC_API_URL}/finance/categories/${editing.id}/`
        : `${process.env.NEXT_PUBLIC_API_URL}/finance/categories/`
      
      const method = editing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      // ۳. دریافت امن جواب سرور (جلوگیری از کرش هنگام خطای ۵۰۰)
      const responseText = await response.text()
      let data: any = {}
      
      if (responseText) {
        try {
          data = JSON.parse(responseText)
        } catch (err) {
          console.error("❌ سرور متن نامعتبر فرستاد:", responseText)
          setErrors({ server: `خطای سرور (${response.status}): جنگو کرش کرد!` })
          setIsSubmitting(false)
          return
        }
      }

      if (response.ok) {
        console.log("✅ دسته‌بندی با موفقیت ذخیره شد:", data)
        onSave(data) // اضافه کردن دیتای تایید شده به لیست در فرانت‌اند
        onClose() // بستن مودال
      } else {
        console.error("❌ خطای ولیدیشن بک‌اند:", data)
        if (data.name) nextErrors.name = data.name[0]
        if (data.category_type) nextErrors.server = data.category_type[0]
        if (!data.name && !data.category_type) nextErrors.server = 'خطا در ثبت اطلاعات.'
        
        setErrors(nextErrors)
      }

    } catch (error) {
      console.error("❌ خطا در ارتباط با سرور:", error)
      setErrors({ server: 'ارتباط با سرور قطع شد.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cat-modal-title"
        className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 id="cat-modal-title" className="text-base font-bold text-foreground">
            {editing ? 'ویرایش دسته‌بندی' : 'دسته‌بندی جدید'}
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="بستن"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 px-6 py-5">
            {/* نمایش ارورهای سرور */}
            {errors.server && (
              <div className="p-3 text-sm text-danger bg-danger-muted rounded-md border border-danger/20">
                {errors.server}
              </div>
            )}

            <div>
              <Label htmlFor="c-name" required>
                نام دسته‌بندی
              </Label>
              <TextInput
                id="c-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثلاً فروش محصولات"
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="mt-1 text-xs text-danger">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="c-type" required>
                نوع
              </Label>
              <Select
                id="c-type"
                value={type}
                onChange={(e) => setType(e.target.value as CategoryType)}
              >
                {(Object.keys(categoryTypeLabels) as CategoryType[]).map((k) => (
                  <option key={k} value={k}>
                    {categoryTypeLabels[k]}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="c-desc">توضیحات (اختیاری)</Label>
              <Textarea
                id="c-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="توضیحات درباره این دسته‌بندی..."
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