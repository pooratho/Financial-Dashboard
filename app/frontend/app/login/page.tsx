'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4 font-sans">
      {/* 
        تغییرات در این خط اعمال شد:
        اضافه شدن shadow-[0_0_25px] و shadow-primary/30 برای هاله نور متناسب با تم
        و تغییر رنگ حاشیه به border-primary/30 
      */}
      <div className="w-full max-w-md rounded-xl border border-primary/30 bg-card text-card-foreground shadow-[0_0_25px] shadow-primary/30 transition-all duration-500">
        <div className="flex flex-col space-y-2 p-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            {isLogin ? 'ورود به سامانه' : 'ایجاد حساب کاربری'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isLogin
              ? 'برای ورود به داشبورد، ایمیل و رمز عبور خود را وارد کنید'
              : 'برای استفاده از امکانات حسابداری، ثبت‌نام کنید'}
          </p>
        </div>

        <div className="p-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="name">
                  نام و نام خانوادگی
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="مثال: علی رضایی"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="email">
                آدرس ایمیل
              </label>
              <input
                id="email"
                type="email"
                required
                dir="ltr"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-left"
                placeholder="name@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="password">
                رمز عبور
              </label>
              <input
                id="password"
                type="password"
                required
                dir="ltr"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-left"
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" className="w-full mt-2">
              {isLogin ? 'ورود به حساب' : 'ثبت‌نام'}
            </Button>
          </form>
        </div>

        <div className="flex items-center justify-center p-6 pt-0">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-muted-foreground hover:text-primary hover:underline underline-offset-4 transition-colors"
          >
            {isLogin ? 'حساب کاربری ندارید؟ ثبت‌نام کنید' : 'قبلاً ثبت‌نام کرده‌اید؟ وارد شوید'}
          </button>
        </div>
      </div>
    </div>
  )
}