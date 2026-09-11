import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 👇 این تابع جدید برای شمسی کردن تاریخ‌ها اضافه شد
export function toPersianDate(dateString: string | undefined | null) {
  if (!dateString) return 'ندارد'
  
  const date = new Date(dateString)
  
  // بررسی اینکه آیا تاریخ معتبر است یا خیر
  if (isNaN(date.getTime())) return 'تاریخ نامعتبر'

  return new Intl.DateTimeFormat('fa-IR', { 
    year: 'numeric', 
    month: 'long',  // مثلاً "مرداد"
    day: 'numeric' 
  }).format(date)
}