'use client'

import { useState } from 'react'
import { Menu, Plus, Search, User, Mail, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Header({
  title,
  search,
  onSearchChange,
  onAddNew,
  onToggleSidebar,
}: {
  title: string
  search: string
  onSearchChange: (value: string) => void
  onAddNew: () => void
  onToggleSidebar: () => void
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-sm md:px-6">
      <button
        onClick={onToggleSidebar}
        className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground lg:hidden"
        aria-label="باز کردن منو"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      <h1 className="text-lg font-bold text-foreground">{title}</h1>

      <div className="order-last flex w-full items-center gap-3 md:order-none md:mr-auto md:w-auto">
        {/* Search */}
        <div className="relative flex-1 md:w-64 md:flex-none">
          <Search
            className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="جستجو..."
            className="h-9 w-full rounded-lg border border-input bg-card pr-9 pl-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
          />
        </div>

        <Button onClick={onAddNew} size="lg" className="gap-1.5">
          <Plus className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">ثبت تراکنش جدید</span>
          <span className="sm:hidden">ثبت</span>
        </Button>

        {/* Profile Section */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={cn(
              "flex items-center gap-2.5 rounded-lg border border-border bg-card py-1 pr-1 pl-2 transition-all hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isProfileOpen && "bg-muted ring-2 ring-ring/50"
            )}
          >
            <div className="flex size-8 items-center justify-center rounded-md bg-accent text-sm font-bold text-accent-foreground">
              ح
            </div>
            <div className="hidden text-right sm:block">
              {/* تغییر متن از سمت به نام کاربر */}
              <p className="text-xs font-semibold text-foreground leading-tight">حسن سعیدی</p>
              <p className="text-[11px] text-muted-foreground leading-tight">accountant@company.ir</p>
            </div>
            <ChevronDown className={cn("hidden size-4 text-muted-foreground transition-transform sm:block", isProfileOpen && "rotate-180")} />
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsProfileOpen(false)}
                aria-hidden="true"
              />
              
              <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-xl border border-border bg-card p-2 shadow-lg animate-in fade-in slide-in-from-top-2">
                <div className="mb-2 px-2 pb-2 pt-1 border-b border-border">
                  <p className="text-sm font-semibold text-foreground">اطلاعات حساب کاربری</p>
                </div>
                
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3 rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                    <User className="size-4 shrink-0" />
                    <span className="flex-1 truncate">نام: حسن سعیدی</span>
                  </div>
                  {/* بخش سمت (Briefcase) کاملاً حذف شد */}
                  <div className="flex items-center gap-3 rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                    <Mail className="size-4 shrink-0" />
                    <span className="flex-1 truncate" dir="ltr">accountant@company.ir</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}