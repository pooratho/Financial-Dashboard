'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Category, Transaction } from '@/lib/accounting'
import { SummaryCards } from './summary-cards'
import { IncomeExpenseChart } from './income-expense-chart'
import { TransactionsTable } from './transactions-table'

export function DashboardView({
  categories, // دسته‌بندی‌ها رو فعلا نگه می‌داریم اگر جدول بهش نیاز داشت
}: {
  categories: Category[]
}) {
  const router = useRouter()
  // استیت‌های لودینگ و دیتای داشبورد
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // هوک دریافت اطلاعات به محض لود شدن صفحه
  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem('accessToken')
      
      if (!token) {
        router.push('/login')
        return
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/finance/dashboard/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        })

        if (response.ok) {
          const data = await response.json()
          console.log("✅ دیتای داشبورد دریافت شد:", data)
          setDashboardData(data)
        } else if (response.status === 401) {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          router.push('/login')
        }
      } catch (error) {
        console.error("❌ خطا در دریافت اطلاعات داشبورد:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboard()
  }, [router])

  // تا زمانی که دیتا از سرور نرسیده، یک پیام لودینگ نشان می‌دهیم
  if (isLoading) {
    return <div className="flex h-64 items-center justify-center text-muted-foreground">در حال بارگذاری اطلاعات داشبورد...</div>
  }

  // اگر دیتا به هر دلیلی دریافت نشد
  if (!dashboardData) {
    return <div className="flex h-64 items-center justify-center text-red-500">خطا در ارتباط با سرور</div>
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 
        تغییر مهم: حالا به جای تراکنش‌های خام، دیتای آماده داشبورد را پاس می‌دهیم. 
        باید فایل summary-cards را هم در قدم بعدی آپدیت کنیم تا این دیتا را بخواند.
      */}
      <SummaryCards data={dashboardData} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-base font-bold text-foreground">تراکنش‌های اخیر</h2>
            <span className="text-xs text-muted-foreground">۵ مورد آخر</span> 
          </div>
          {/* لیست ۵ تراکنش آخر مستقیماً از بک‌اند گرفته می‌شود */}
          <TransactionsTable transactions={dashboardData.recent_transactions} categories={categories} />
        </div>

        {/* برای چارت فعلاً همین تراکنش‌های اخیر را می‌دهیم تا نمودار خالی نماند */}
        <IncomeExpenseChart transactions={dashboardData.recent_transactions} />
      </div>
    </div>
  )
}