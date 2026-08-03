'use client'

import { useState } from 'react'
import type { Category, Transaction } from '@/lib/accounting'
import { mockCategories, mockTransactions } from '@/lib/mock-data'
import { Sidebar, type ViewKey } from './sidebar'
import { Header } from './header'
import { DashboardView } from './dashboard-view'
import { TransactionsView } from './transactions-view'
import { CategoriesView } from './categories-view'
import { ReportsView } from './reports-view'
import { TransactionModal } from './transaction-modal'
import { CategoryModal } from './category-modal'

const viewTitles: Record<ViewKey, string> = {
  dashboard: 'داشبورد',
  transactions: 'تراکنش‌ها',
  categories: 'دسته‌بندی‌ها',
  reports: 'گزارش‌ها',
}

export function AppShell() {
  const [view, setView] = useState<ViewKey>('dashboard')
  const [search, setSearch] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [categories, setCategories] = useState<Category[]>(mockCategories)

  const [txModalOpen, setTxModalOpen] = useState(false)
  const [editingTx, setEditingTx] = useState<Transaction | null>(null)

  const [catModalOpen, setCatModalOpen] = useState(false)
  const [editingCat, setEditingCat] = useState<Category | null>(null)

  /* ---- Transaction handlers ---- */
  const openNewTx = () => {
    setEditingTx(null)
    setTxModalOpen(true)
  }
  const openEditTx = (t: Transaction) => {
    setEditingTx(t)
    setTxModalOpen(true)
  }
  const saveTx = (t: Transaction) => {
    setTransactions((prev) => {
      const exists = prev.some((x) => x.id === t.id)
      return exists ? prev.map((x) => (x.id === t.id ? t : x)) : [t, ...prev]
    })
    setTxModalOpen(false)
  }
  const deleteTx = (t: Transaction) => {
    if (window.confirm(`آیا از حذف تراکنش «${t.title}» مطمئن هستید؟`)) {
      setTransactions((prev) => prev.filter((x) => x.id !== t.id))
    }
  }

  /* ---- Category handlers ---- */
  const openNewCat = () => {
    setEditingCat(null)
    setCatModalOpen(true)
  }
  const openEditCat = (c: Category) => {
    setEditingCat(c)
    setCatModalOpen(true)
  }
  const saveCat = (c: Category) => {
    setCategories((prev) => {
      const exists = prev.some((x) => x.id === c.id)
      return exists ? prev.map((x) => (x.id === c.id ? c : x)) : [...prev, c]
    })
    setCatModalOpen(false)
  }
  const deleteCat = (c: Category) => {
    const used = transactions.some((t) => t.category_id === c.id)
    if (used) {
      window.alert('این دسته‌بندی در تراکنش‌ها استفاده شده و قابل حذف نیست.')
      return
    }
    if (window.confirm(`آیا از حذف دسته‌بندی «${c.name}» مطمئن هستید؟`)) {
      setCategories((prev) => prev.filter((x) => x.id !== c.id))
    }
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar
        activeView={view}
        onNavigate={setView}
        mobileOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          title={viewTitles[view]}
          search={search}
          onSearchChange={setSearch}
          onAddNew={openNewTx}
          onToggleSidebar={() => setSidebarOpen(true)}
        />

        <main className="flex-1 px-4 py-6 md:px-6">
          {view === 'dashboard' && (
            <DashboardView transactions={transactions} categories={categories} />
          )}
          {view === 'transactions' && (
            <TransactionsView
              transactions={transactions}
              categories={categories}
              search={search}
              onEdit={openEditTx}
              onDelete={deleteTx}
            />
          )}
          {view === 'categories' && (
            <CategoriesView
              categories={categories}
              transactions={transactions}
              onEdit={openEditCat}
              onDelete={deleteCat}
              onAddNew={openNewCat}
            />
          )}
          {view === 'reports' && (
            <ReportsView transactions={transactions} categories={categories} />
          )}
        </main>
      </div>

      <TransactionModal
        open={txModalOpen}
        onClose={() => setTxModalOpen(false)}
        onSave={saveTx}
        categories={categories}
        editing={editingTx}
      />
      <CategoryModal
        open={catModalOpen}
        onClose={() => setCatModalOpen(false)}
        onSave={saveCat}
        editing={editingCat}
      />
    </div>
  )
}
