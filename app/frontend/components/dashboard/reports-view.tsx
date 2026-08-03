'use client'

import { useMemo, useState } from 'react'
import { isPositive, type Category, type Transaction } from '@/lib/accounting'
import {
  buildInsights,
  buildTrend,
  expenseBreakdown,
  filterByRange,
  type RangeKey,
} from '@/lib/reports'
import { DateRangePicker } from './reports/date-range-picker'
import { KpiCards } from './reports/kpi-cards'
import { CategoryDonut } from './reports/category-donut'
import { TrendChart } from './reports/trend-chart'
import { InsightsPanel } from './reports/insights-panel'

export function ReportsView({
  transactions,
  categories,
}: {
  transactions: Transaction[]
  categories: Category[]
}) {
  const [range, setRange] = useState<RangeKey>('lastMonth')

  const scoped = useMemo(() => filterByRange(transactions, range), [transactions, range])

  const kpi = useMemo(() => {
    const totalIncome = scoped
      .filter((t) => isPositive(t.transaction_type))
      .reduce((s, t) => s + t.amount, 0)
    const totalExpense = scoped
      .filter((t) => !isPositive(t.transaction_type))
      .reduce((s, t) => s + t.amount, 0)
    // Total balance is computed across ALL transactions, not just the range.
    const totalBalance = transactions.reduce(
      (s, t) => s + (isPositive(t.transaction_type) ? t.amount : -t.amount),
      0,
    )
    return {
      totalIncome,
      totalExpense,
      netFlow: totalIncome - totalExpense,
      totalBalance,
    }
  }, [scoped, transactions])

  const breakdown = useMemo(() => expenseBreakdown(scoped, categories), [scoped, categories])
  const trend = useMemo(() => buildTrend(scoped, range), [scoped, range])
  const insights = useMemo(
    () => buildInsights(scoped, categories, breakdown),
    [scoped, categories, breakdown],
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Header + global filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">گزارش‌های مالی</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            تحلیل درآمد، هزینه و روند مالی کسب‌وکار شما
          </p>
        </div>
        <DateRangePicker value={range} onChange={setRange} />
      </div>

      {/* KPI summaries */}
      <KpiCards kpi={kpi} />

      {/* Category breakdown */}
      <CategoryDonut rows={breakdown} />

      {/* Temporal trends + insights */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <TrendChart data={trend} />
        </div>
        <div className="xl:col-span-1">
          <InsightsPanel insights={insights} />
        </div>
      </div>
    </div>
  )
}
