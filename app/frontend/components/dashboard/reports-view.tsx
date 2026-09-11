'use client'

import { useEffect, useMemo, useState } from 'react'
import { isPositive, type Category, type Transaction } from '@/lib/accounting'
import { buildInsights, filterByRange } from '@/lib/reports'
import { DateRangePicker } from './reports/date-range-picker'
import { KpiCards } from './reports/kpi-cards'
import { CategoryDonut } from './reports/category-donut'
import { TrendChart } from './reports/trend-chart'
import { InsightsPanel } from './reports/insights-panel'

// تابع تبدیل کلمات کلیدی به بازه تاریخ واقعی
// تابع جدید برای تبدیل کلمات کلیدی به بازه تاریخ واقعی (مقاوم در برابر اختلاف ساعت)
function getDateRange(range: string): { from: string; to: string } {
  const from = new Date()
  const to = new Date()

  switch (range) {
    case 'thisWeek':
      from.setDate(from.getDate() - 6) // ۷ روز گذشته
      break
    case 'thisMonth':
      from.setDate(1) // روز اول همین ماه
      break
    case 'lastMonth':
      from.setMonth(from.getMonth() - 1)
      from.setDate(1)
      to.setDate(0) // آخرین روز ماه قبل
      break
    case 'thisYear':
      from.setMonth(0, 1) // اول فروردین/ژانویه امسال
      break
    case 'all':
      return { from: '', to: '' }
    default:
      // پیش‌فرض: یک ماه اخیر
      from.setDate(from.getDate() - 30)
  }

  // 🌟 جادوی اصلی: استفاده از زمان محلیِ دستگاه کاربر به جای UTC
  const formatLocal = (date: Date) => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}` // خروجی استاندارد برای جنگو: YYYY-MM-DD
  }

  return {
    from: formatLocal(from),
    to: formatLocal(to),
  }
}

export function ReportsView({
  transactions,
  categories,
}: {
  transactions: Transaction[]
  categories: Category[]
}) {
const [range, setRange] = useState<any>('thisMonth')  
  const [reportData, setReportData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 👇 حل مشکل آپدیت نشدن: متغیر transactions به انتهای این هوک اضافه شد
  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true)
      const token = localStorage.getItem('accessToken')
      if (!token) return

      try {
        const { from, to } = getDateRange(range)
        const params = new URLSearchParams()
        
        if (from) params.append('from_date', from)
        if (to) params.append('to_date', to)

        const url = `${process.env.NEXT_PUBLIC_API_URL}/finance/reports/?${params.toString()}`

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setReportData(data)
        }
      } catch (error) {
        console.error("❌ خطا در دریافت گزارش‌ها:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReports()
  }, [range, transactions]) // 👈 با اضافه شدن transactions، ثبت تراکنش جدید باعث رفرش نمودارها می‌شود

  
  const kpi = useMemo(() => {
    if (!reportData) return { totalIncome: 0, totalExpense: 0, netFlow: 0, totalBalance: 0 }
    const { summary } = reportData
    return {
      totalIncome: summary.total_income || 0,
      totalExpense: summary.total_expense || 0,
      netFlow: summary.net_profit || 0,
      totalBalance: summary.overall_balance || 0,
    }
  }, [reportData])

  const breakdown = useMemo(() => {
    if (!reportData?.category_ranking) return []
    return reportData.category_ranking
      .filter((cat: any) => cat.category__category_type === 'EXPENSE')
      .map((cat: any) => ({
        // 👇 حل مشکل کرش: ساختار category را دقیقاً همانطور که buildInsights می‌خواهد شبیه‌سازی کردیم
        category: {
          id: cat.category__id,
          name: cat.category__name,
          type: 'expense'
        },
        id: cat.category__id,
        name: cat.category__name,
        amount: cat.total_amount,
percent: cat.percentage,
count: cat.transactions_count || 1,      }))
  }, [reportData])

  const trend = useMemo(() => {
    if (!reportData?.chart_data) return []

    let formattedData = reportData.chart_data.map((item: any) => ({
      date: item.date,
      income: Number(item.income ?? item.INCOME ?? 0),
      expense: Number(item.expense ?? item.EXPENSE ?? 0),
    }))

    if (formattedData.length === 1) {
      formattedData = [
        { date: 'شروع', income: 0, expense: 0 },
        ...formattedData
      ]
    }
    
    return reportData.chart_data
  }, [reportData])

  const scoped = useMemo(() => filterByRange(transactions, range), [transactions, range])
  
  const insights = useMemo(
    () => buildInsights(scoped, categories, breakdown),
    [scoped, categories, breakdown],
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">گزارش‌های مالی</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            تحلیل درآمد، هزینه و روند مالی کسب‌وکار شما
          </p>
        </div>
        <DateRangePicker value={range} onChange={setRange} />
      </div>

      {isLoading && !reportData ? (
        <div className="flex h-64 flex-col items-center justify-center space-y-4 rounded-2xl border border-border bg-card">
          <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">در حال پردازش گزارشات از سرور...</p>
        </div>
      ) : (
        <>
          <KpiCards kpi={kpi} />
          <CategoryDonut rows={breakdown} />
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <TrendChart data={trend} />
            </div>
            <div className="xl:col-span-1">
              <InsightsPanel insights={insights} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}