'use client'

import { useEffect, useRef, useState } from 'react'
import { Calendar, ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { rangeLabels, type RangeKey } from '@/lib/reports'

const order: RangeKey[] = ['week', 'month', 'lastMonth', 'year', 'all']

export function DateRangePicker({
  value,
  onChange,
}: {
  value: RangeKey
  onChange: (key: RangeKey) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-secondary sm:w-56"
      >
        <span className="flex items-center gap-2">
          <Calendar className="size-4 text-muted-foreground" aria-hidden="true" />
          {rangeLabels[value]}
        </span>
        <ChevronDown
          className={cn('size-4 text-muted-foreground transition-transform', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 z-20 mt-2 w-full overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-lg sm:w-56"
        >
          {order.map((key) => (
            <li key={key}>
              <button
                type="button"
                role="option"
                aria-selected={value === key}
                onClick={() => {
                  onChange(key)
                  setOpen(false)
                }}
                className={cn(
                  'flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-right text-sm transition-colors',
                  value === key
                    ? 'bg-accent text-accent-foreground'
                    : 'text-foreground hover:bg-secondary',
                )}
              >
                {rangeLabels[key]}
                {value === key && <Check className="size-4" aria-hidden="true" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
