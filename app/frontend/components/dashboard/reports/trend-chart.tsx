'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatToman } from '@/lib/accounting'
import type { TrendPoint } from '@/lib/reports'

const INCOME_COLOR = '#22a06b'
const EXPENSE_COLOR = '#e56353'

function compactToman(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 0 })}م`
  if (v >= 1_000) return `${(v / 1_000).toLocaleString('fa-IR', { maximumFractionDigits: 0 })}ه`
  return v.toLocaleString('fa-IR')
}

function TrendTooltip({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-right shadow-md">
      <p className="mb-1 text-xs font-semibold text-foreground">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="flex items-center justify-end gap-2 text-xs">
          <span className="text-muted-foreground">
            {p.dataKey === 'income' ? 'درآمد' : 'هزینه'}:
          </span>
          <span className="font-medium text-foreground">{formatToman(p.value)}</span>
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: p.fill }}
            aria-hidden="true"
          />
        </p>
      ))}
    </div>
  )
}

export function TrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-foreground">روند درآمد و هزینه</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">مقایسه درآمد و هزینه در طول زمان</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: INCOME_COLOR }} />
            درآمد
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: EXPENSE_COLOR }} />
            هزینه
          </span>
        </div>
      </div>

      {data.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          داده‌ای برای این بازه وجود ندارد.
        </p>
      ) : (
        <div className="h-72 w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="label"
                reversed
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'inherit' }}
                tickLine={false}
                axisLine={{ stroke: 'var(--border)' }}
                interval="preserveStartEnd"
              />
              <YAxis
                orientation="right"
                tickFormatter={compactToman}
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'inherit' }}
                tickLine={false}
                axisLine={false}
                width={48}
              />
              <Tooltip content={<TrendTooltip />} cursor={{ fill: 'var(--secondary)' }} />
              <Bar dataKey="income" fill={INCOME_COLOR} radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="expense" fill={EXPENSE_COLOR} radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
