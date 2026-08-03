'use client'

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { formatToman } from '@/lib/accounting'
import { donutPalette, type CategoryBreakdownRow } from '@/lib/reports'

function DonutTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload?.length) return null
  const row = payload[0].payload as CategoryBreakdownRow & { fill: string }
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-right shadow-md">
      <p className="text-sm font-semibold text-foreground">{row.category.name}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{formatToman(row.amount)}</p>
      <p className="text-xs text-muted-foreground">
        {row.percent.toLocaleString('fa-IR', { maximumFractionDigits: 1 })}٪ از کل
      </p>
    </div>
  )
}

export function CategoryDonut({ rows }: { rows: CategoryBreakdownRow[] }) {
  const total = rows.reduce((s, r) => s + r.amount, 0)

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-base font-bold text-foreground">هزینه‌ها بر اساس دسته‌بندی</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          توزیع هزینه‌ها به تفکیک دسته در بازه انتخابی
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-2">
        {/* Chart */}
        <div className="relative flex items-center justify-center">
          {rows.length === 0 ? (
            <p className="py-16 text-sm text-muted-foreground">داده‌ای برای نمایش وجود ندارد.</p>
          ) : (
            <>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={rows}
                      dataKey="amount"
                      nameKey="category.name"
                      innerRadius="62%"
                      outerRadius="92%"
                      paddingAngle={2}
                      stroke="none"
                    >
                      {rows.map((_, i) => (
                        <Cell key={i} fill={donutPalette[i % donutPalette.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<DonutTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs text-muted-foreground">مجموع هزینه</span>
                <span className="mt-1 text-lg font-bold text-foreground">
                  {formatToman(total)}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Legend / details table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="pb-2 pr-1 font-medium">دسته‌بندی</th>
                <th className="pb-2 font-medium">تعداد</th>
                <th className="pb-2 font-medium">مبلغ</th>
                <th className="pb-2 font-medium">درصد</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.category.id} className="border-b border-border/60 last:border-0">
                  <td className="py-2.5 pr-1">
                    <span className="flex items-center gap-2">
                      <span
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: donutPalette[i % donutPalette.length] }}
                        aria-hidden="true"
                      />
                      <span className="text-sm font-medium text-foreground">
                        {row.category.name}
                      </span>
                    </span>
                  </td>
                  <td className="py-2.5 text-sm text-muted-foreground">
                    {row.count.toLocaleString('fa-IR')}
                  </td>
                  <td className="py-2.5 text-sm font-semibold text-foreground">
                    {row.amount.toLocaleString('fa-IR')}
                  </td>
                  <td className="py-2.5">
                    <span className="text-sm font-medium text-muted-foreground">
                      {row.percent.toLocaleString('fa-IR', { maximumFractionDigits: 1 })}٪
                    </span>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                    داده‌ای موجود نیست.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
