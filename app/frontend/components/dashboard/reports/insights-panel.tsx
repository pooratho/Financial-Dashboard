import { Lightbulb } from 'lucide-react'

export function InsightsPanel({ insights }: { insights: string[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <span className="flex size-8 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Lightbulb className="size-4" aria-hidden="true" />
        </span>
        <h2 className="text-base font-bold text-foreground">نکات کلیدی</h2>
      </div>
      <ul className="flex flex-col gap-3 p-5">
        {insights.length === 0 ? (
          <li className="text-sm text-muted-foreground">نکته‌ای برای نمایش وجود ندارد.</li>
        ) : (
          insights.map((text, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-xl bg-secondary/60 p-3 text-sm leading-relaxed text-foreground"
            >
              <span
                className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                aria-hidden="true"
              />
              <span className="text-pretty">{text}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
