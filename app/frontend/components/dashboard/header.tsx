'use client'

import { Menu, Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

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

        {/* Profile */}
        <div className="flex items-center gap-2.5 rounded-lg border border-border bg-card py-1 pr-1 pl-3">
          <div className="flex size-8 items-center justify-center rounded-md bg-accent text-sm font-bold text-accent-foreground">
            ح
          </div>
          <div className="hidden text-right sm:block">
            <p className="text-xs font-semibold text-foreground leading-tight">کارمند حسابداری</p>
            <p className="text-[11px] text-muted-foreground leading-tight">accountant@company.ir</p>
          </div>
        </div>
      </div>
    </header>
  )
}
