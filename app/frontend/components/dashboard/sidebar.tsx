'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  ArrowLeftRight,
  FolderTree,
  FileBarChart,
  LogOut,
  Wallet,
  ChevronRight,
  ChevronLeft
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
  // تعریف متغیر وضعیت برای باز و بسته بودن نوار کناری در دسکتاپ
  const [isCollapsed, setIsCollapsed] = useState(false)

  // هوک روتینگ برای انتقال بین صفحات
  const router = useRouter()

  // تابع مدیریت خروج
  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    router.push('/login') // هدایت کاربر به صفحه لاگین
  }

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
          'fixed inset-y-0 right-0 z-50 flex flex-col border-l border-sidebar-border bg-sidebar transition-all duration-300 lg:static lg:translate-x-0 relative',
          mobileOpen ? 'translate-x-0' : 'translate-x-full',
          // تغییر عرض سایدبار بر اساس وضعیت
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        {/* دکمه باز و بسته کردن سایدبار (فقط در دسکتاپ نمایش داده می‌شود) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -left-3 top-7 z-50 hidden size-6 items-center justify-center rounded-full border border-sidebar-border bg-background text-muted-foreground shadow-sm transition-colors hover:text-foreground lg:flex"
        >
          {isCollapsed ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
        </button>

        {/* Brand */}
        <div className={cn("flex items-center py-6 transition-all duration-300", isCollapsed ? "justify-center px-0" : "gap-3 px-5")}>
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Wallet className="size-5" aria-hidden="true" />
          </div>
          {/* مخفی کردن متن لوگو در حالت جمع‌شده */}
          {!isCollapsed && (
            <div className="overflow-hidden whitespace-nowrap">
              <p className="text-sm font-bold text-sidebar-foreground">سامانه حسابداری</p>
              <p className="text-xs text-muted-foreground">مدیریت مالی</p>
            </div>
          )}
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
                title={isCollapsed ? item.label : undefined} // نمایش نام به صورت تولتیپ در حالت جمع‌شده
                className={cn(
                  'flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isCollapsed ? 'justify-center' : 'gap-3',
                  active
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-secondary hover:text-sidebar-foreground',
                )}
                aria-current={active ? 'page' : undefined}
              >
                <item.icon className="size-5 shrink-0" aria-hidden="true" />
                {/* مخفی کردن متن منوها در حالت جمع‌شده */}
                {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-sidebar-border p-3">
          <button 
            onClick={handleLogout}
            title={isCollapsed ? "خروج" : undefined}
            className={cn(
              "flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-danger-muted hover:text-danger",
              isCollapsed ? 'justify-center' : 'gap-3'
            )}
          >
            <LogOut className="size-5 shrink-0" aria-hidden="true" />
            {!isCollapsed && <span className="whitespace-nowrap">خروج</span>}
          </button>
        </div>
      </aside>
    </>
  )
}