import type { Category, Transaction } from '@/lib/accounting'
import { SummaryCards } from './summary-cards'
import { IncomeExpenseChart } from './income-expense-chart'
import { TransactionsTable } from './transactions-table'

export function DashboardView({
  transactions,
  categories,
}: {
  transactions: Transaction[]
  categories: Category[]
}) {
  const recent = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6)

  return (
    <div className="flex flex-col gap-6">
      <SummaryCards transactions={transactions} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-base font-bold text-foreground">تراکنش‌های اخیر</h2>
            <span className="text-xs text-muted-foreground">۶ مورد آخر</span>
          </div>
          <TransactionsTable transactions={recent} categories={categories} />
        </div>

        <IncomeExpenseChart transactions={transactions} />
      </div>
    </div>
  )
}
