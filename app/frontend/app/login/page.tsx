'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Mail } from 'lucide-react' // 👈 آیکون ایمیل هم اضافه شد

export default function LoginPage() {
  const router = useRouter()

  // 👇 استیت جدید برای ایمیل
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,       // 👈 ارسال ایمیل (اگر بک‌اند نیاز ندارد این خط را پاک کن)
          username: username,
          password: password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        console.log("✅ ورود با موفقیت انجام شد! جواب سرور:", data)
        
        localStorage.setItem('accessToken', data.access)
        localStorage.setItem('refreshToken', data.refresh)
        
        alert("لاگین موفقیت‌آمیز بود! توکن در مرورگر ذخیره شد.")
        router.push('/')
      } else {
        console.error("❌ سرور اطلاعات را قبول نکرد:", data)
        alert("اطلاعات وارد شده اشتباه است.")
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
            برای ورود به داشبورد، اطلاعات خود را وارد کنید
          </p>
        </div>

        <div className="p-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* 👇 فیلد جدید ایمیل */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="email">
                آدرس ایمیل
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background py-2 pl-3 pr-10 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-left"
                  placeholder="name@example.com"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                </div>
              </div>
            </div>

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
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background py-2 pl-3 pr-10 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-left"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
                  aria-label={showPassword ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
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