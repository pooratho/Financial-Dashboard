import type { Category, Transaction } from './accounting'

export const mockCategories: Category[] = [
  { id: 'c1', name: 'فروش محصولات', type: 'income', description: 'درآمد حاصل از فروش کالا' },
  { id: 'c2', name: 'ارائه خدمات', type: 'income', description: 'درآمد پروژه‌ها و خدمات مشاوره' },
  { id: 'c3', name: 'حقوق و دستمزد', type: 'expense', description: 'حقوق ماهانه کارکنان' },
  { id: 'c4', name: 'اجاره', type: 'expense', description: 'اجاره دفتر مرکزی' },
  { id: 'c5', name: 'تجهیزات اداری', type: 'expense', description: 'خرید لوازم و تجهیزات' },
  { id: 'c6', name: 'بازاریابی و تبلیغات', type: 'expense', description: 'هزینه‌های تبلیغاتی' },
  { id: 'c7', name: 'قبوض و آب و برق', type: 'expense', description: 'هزینه‌های جاری ساختمان' },
  { id: 'c8', name: 'سرمایه‌گذاری', type: 'income', description: 'درآمد حاصل از سرمایه‌گذاری' },
]

/**
 * Deterministic pseudo-random generator
 */
function seeded(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const incomeTemplates: { title: string; category_id: string; type: 'income' | 'received' }[] = [
  { title: 'فروش قرارداد نرم‌افزاری', category_id: 'c1', type: 'income' },
  { title: 'فروش دوره آموزشی', category_id: 'c1', type: 'income' },
  { title: 'پروژه طراحی وب‌سایت', category_id: 'c2', type: 'income' },
  { title: 'دریافت از مشتری', category_id: 'c2', type: 'received' },
  { title: 'سود سرمایه‌گذاری', category_id: 'c8', type: 'received' },
]

const expenseTemplates: { title: string; category_id: string; type: 'expense' | 'paid' }[] = [
  { title: 'پرداخت حقوق پرسنل', category_id: 'c3', type: 'paid' },
  { title: 'پرداخت اجاره دفتر', category_id: 'c4', type: 'paid' },
  { title: 'خرید تجهیزات اداری', category_id: 'c5', type: 'expense' },
  { title: 'کمپین تبلیغاتی', category_id: 'c6', type: 'expense' },
  { title: 'پرداخت قبوض', category_id: 'c7', type: 'paid' },
  { title: 'خرید مواد اولیه', category_id: 'c1', type: 'expense' },
]

/**
 * Generates transactions using strict UTC dates to avoid SSR Hydration timezone mismatches.
 */
function generateHistory(): Transaction[] {
  const rnd = seeded(1387)
  const out: Transaction[] = []
  
  // استفاده از UTC برای جلوگیری از اختلاف ساعت سرور و کلاینت
  const start = new Date(Date.UTC(2026, 5, 1))
  const end = new Date(Date.UTC(2026, 7, 3))
  
  let id = 100
  
  // حلقه بر اساس روزهای UTC
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    if (rnd() > 0.55) continue
    const count = 1 + Math.floor(rnd() * 2)
    for (let i = 0; i < count; i++) {
      const isIncome = rnd() > 0.5
      const iso = d.toISOString().slice(0, 10)
      if (isIncome) {
        const tpl = incomeTemplates[Math.floor(rnd() * incomeTemplates.length)]
        out.push({
          id: `g${id++}`,
          transaction_type: tpl.type,
          title: tpl.title,
          amount: (2 + Math.floor(rnd() * 85)) * 1000000,
          category_id: tpl.category_id,
          date: iso,
        })
      } else {
        const tpl = expenseTemplates[Math.floor(rnd() * expenseTemplates.length)]
        out.push({
          id: `g${id++}`,
          transaction_type: tpl.type,
          title: tpl.title,
          amount: (1 + Math.floor(rnd() * 45)) * 1000000,
          category_id: tpl.category_id,
          date: iso,
        })
      }
    }
  }
  return out
}

const featuredTransactions: Transaction[] = [
  {
    id: 't1',
    transaction_type: 'income',
    title: 'فروش قرارداد نرم‌افزاری',
    amount: 85000000,
    category_id: 'c1',
    date: '2026-07-28',
    description: 'فاکتور شماره ۱۰۴۲',
  },
  {
    id: 't2',
    transaction_type: 'expense',
    title: 'پرداخت حقوق تیر ماه',
    amount: 42000000,
    category_id: 'c3',
    date: '2026-07-25',
    description: 'حقوق ۶ نفر پرسنل',
  },
  {
    id: 't3',
    transaction_type: 'received',
    title: 'دریافت از مشتری الف',
    amount: 30000000,
    category_id: 'c2',
    date: '2026-07-22',
    description: 'تسویه بخشی از بدهی',
  },
  {
    id: 't4',
    transaction_type: 'paid',
    title: 'پرداخت اجاره دفتر',
    amount: 18000000,
    category_id: 'c4',
    date: '2026-07-20',
    description: 'اجاره مرداد ماه',
  },
  {
    id: 't5',
    transaction_type: 'expense',
    title: 'خرید لپ‌تاپ',
    amount: 55000000,
    category_id: 'c5',
    date: '2026-07-18',
    description: 'دو دستگاه برای تیم فنی',
  },
  {
    id: 't6',
    transaction_type: 'income',
    title: 'پروژه طراحی وب‌سایت',
    amount: 48000000,
    category_id: 'c2',
    date: '2026-07-15',
    description: 'فاز اول پروژه',
  },
  {
    id: 't7',
    transaction_type: 'expense',
    title: 'کمپین تبلیغاتی اینستاگرام',
    amount: 12000000,
    category_id: 'c6',
    date: '2026-07-12',
    description: 'تبلیغات ماهانه',
  },
  {
    id: 't8',
    transaction_type: 'paid',
    title: 'پرداخت قبض برق',
    amount: 3500000,
    category_id: 'c7',
    date: '2026-07-10',
    description: 'قبض دوره تابستان',
  },
  {
    id: 't9',
    transaction_type: 'received',
    title: 'سود سرمایه‌گذاری',
    amount: 22000000,
    category_id: 'c8',
    date: '2026-07-08',
    description: 'سود سه ماهه',
  },
  {
    id: 't10',
    transaction_type: 'income',
    title: 'فروش دوره آموزشی',
    amount: 15000000,
    category_id: 'c1',
    date: '2026-07-05',
    description: 'فروش آنلاین',
  },
  {
    id: 't11',
    transaction_type: 'expense',
    title: 'خرید ملزومات اداری',
    amount: 4200000,
    category_id: 'c5',
    date: '2026-07-03',
    description: 'کاغذ و لوازم مصرفی',
  },
  {
    id: 't12',
    transaction_type: 'paid',
    title: 'پرداخت به تامین‌کننده',
    amount: 26000000,
    category_id: 'c1',
    date: '2026-07-01',
    description: 'خرید مواد اولیه',
  },
]

export const mockTransactions: Transaction[] = [...featuredTransactions, ...generateHistory()].sort(
  (a, b) => {
    // اصلاح باگ مرتب‌سازی: اگر تاریخ‌ها مساوی بودند، بر اساس آیدی مرتب کن
    if (a.date === b.date) {
      return a.id.localeCompare(b.id);
    }
    return a.date < b.date ? 1 : -1;
  }
)