export type CategoryType = 'income' | 'expense'

export type TransactionType = 'income' | 'expense' | 'received' | 'paid'

export interface Category {
  id: string
  name: string
  type: CategoryType
  description?: string
}

export interface Transaction {
  id: string
  transaction_type: TransactionType
  title: string
  amount: number
  category_id: string
  date: string // ISO date (YYYY-MM-DD)
  description?: string
}

/* ---------- Labels (Persian) ---------- */

export const transactionTypeLabels: Record<TransactionType, string> = {
  income: 'درآمد',
  expense: 'هزینه',
  received: 'دریافت',
  paid: 'پرداخت',
}

export const categoryTypeLabels: Record<CategoryType, string> = {
  income: 'درآمد',
  expense: 'هزینه',
}

// Types that increase the balance (shown in green)
export const positiveTypes: TransactionType[] = ['income', 'received']
// Types that decrease the balance (shown in red)
export const negativeTypes: TransactionType[] = ['expense', 'paid']

export function isPositive(type: string) {
  if (!type) return false;
  
  // تبدیل به حروف کوچک تا بین INCOME و income تفاوتی نباشد
  const normalizedType = type.toLowerCase() as TransactionType; 
  
  return positiveTypes.includes(normalizedType);
}

/* ---------- Formatting helpers ---------- */

const faNumber = new Intl.NumberFormat('fa-IR')

export function formatToman(amount: number) {
  return `${faNumber.format(amount)} تومان`
}

export function formatNumber(amount: number) {
  return faNumber.format(amount)
}

export function formatPersianDate(iso: string) {
  const date = new Date(iso)
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}
