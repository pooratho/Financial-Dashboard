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
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setName(editing?.name ?? '')
    setType(editing?.type ?? 'income')
    setDescription(editing?.description ?? '')
    setError('')
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('نام دسته‌بندی الزامی است')
      return
    }
    onSave({
      id: editing?.id ?? `c-${Date.now()}`,
      name: name.trim(),
      type,
      description: description.trim() || undefined,
    })
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
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="بستن"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 px-6 py-5">
            <div>
              <Label htmlFor="c-name" required>
                نام دسته‌بندی
              </Label>
              <TextInput
                id="c-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثلاً فروش محصولات"
                aria-invalid={!!error}
              />
              {error && <p className="mt-1 text-xs text-danger">{error}</p>}
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
