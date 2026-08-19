'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const router = useRouter()

  // استیت مربوط به نام کاربری
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username, // ارسال مستقیم نام کاربری به بک‌اند
          password: password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        console.log("✅ ورود با موفقیت انجام شد! جواب سرور:", data)
        
        // ذخیره توکن‌ها
        localStorage.setItem('accessToken', data.access)
        localStorage.setItem('refreshToken', data.refresh)
        
        alert("لاگین موفقیت‌آمیز بود! توکن در مرورگر ذخیره شد.")
        router.push('/')
      } else {
        console.error("❌ سرور اطلاعات را قبول نکرد:", data)
        alert("نام کاربری یا رمز عبور اشتباه است.")
      }
    } catch (error) {
      console.error("❌ اتصال به سرور برقرار نشد! دلیل:", error)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4 font-sans">
      <div className="w-full max-w-md rounded-xl border border-primary/30 bg-card text-card-foreground shadow-[0_0_25px] shadow-primary/30 transition-all duration-500">
        <div className="flex flex-col space-y-2 p-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            ورود به سامانه
          </h1>
          <p className="text-sm text-muted-foreground">
            برای ورود به داشبورد، نام کاربری و رمز عبور خود را وارد کنید
          </p>
        </div>

        <div className="p-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="username">
                نام کاربری
              </label>
              <input
                id="username"
                type="text"
                required
                dir="ltr"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-left"
                placeholder="مثال: admin"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-left"
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" className="w-full mt-4">
              ورود به حساب
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}