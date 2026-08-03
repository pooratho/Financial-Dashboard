'use client'

import {
  LayoutDashboard,
  ArrowLeftRight,
  FolderTree,
  FileBarChart,
  LogOut,
  Wallet,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type ViewKey = 'dashboard' | 'transactions' | 'categories' | 'reports'

const navItems: { key: ViewKey; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'dashboard', label: 'داشبورد', icon: LayoutDashboard },
  { key: 'transactions', label: 'تراکنش‌ها', icon: ArrowLeftRight },
  { key: 'categories', label: 'دسته‌بندی‌ها', icon: FolderTree },
  { key: 'reports', label: 'گزارش‌ها', icon: FileBarChart },
]

export function Sidebar({
  activeView,
  onNavigate,
  mobileOpen,
  onCloseMobile,
}: {
  activeView: ViewKey
  onNavigate: (view: ViewKey) => void
  mobileOpen: boolean
  onCloseMobile: () => void
}) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/40 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-64 flex-col border-l border-sidebar-border bg-sidebar transition-transform duration-300 lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-6">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Wallet className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-bold text-sidebar-foreground">سامانه حسابداری</p>
            <p className="text-xs text-muted-foreground">مدیریت مالی</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
          {navItems.map((item) => {
            const active = activeView === item.key
            return (
              <button
                key={item.key}
                onClick={() => {
                  onNavigate(item.key)
                  onCloseMobile()
                }}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-secondary hover:text-sidebar-foreground',
                )}
                aria-current={active ? 'page' : undefined}
              >
                <item.icon className="size-5" aria-hidden="true" />
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-sidebar-border p-3">
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-danger-muted hover:text-danger">
            <LogOut className="size-5" aria-hidden="true" />
            خروج
          </button>
        </div>
      </aside>
    </>
  )
}
