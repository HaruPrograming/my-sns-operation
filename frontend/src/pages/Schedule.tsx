import { useState } from 'react'
import { scheduledPosts, snsAccounts, platformColors, platformLabels } from '../data'

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

export default function Schedule() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const goToPrevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1) }
    else setMonth(month - 1)
  }

  const goToNextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1) }
    else setMonth(month + 1)
  }

  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const monthPosts = scheduledPosts.filter((p) => {
    const d = new Date(p.scheduledAt)
    return d.getFullYear() === year && d.getMonth() === month
  })

  const postDays = new Set(monthPosts.map((p) => new Date(p.scheduledAt).getDate()))

  const cells: (number | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const isToday = (day: number) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear()

  const sortedPosts = [...monthPosts].sort(
    (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
  )

  const formatDate = (scheduledAt: string) => {
    const d = new Date(scheduledAt)
    return `${d.getMonth() + 1}月${d.getDate()}日`
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <button
          aria-label="前の月"
          onClick={goToPrevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 text-lg"
        >
          ‹
        </button>
        <h2 className="text-base font-bold text-gray-800">
          {year}年{month + 1}月
        </h2>
        <button
          aria-label="次の月"
          onClick={goToNextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 text-lg"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-1">
        {WEEKDAYS.map((d) => <div key={d}>{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center">
        {cells.map((day, i) => (
          <div key={i} className="flex flex-col items-center py-0.5">
            {day !== null && (
              <>
                <span
                  {...(isToday(day) ? { 'data-testid': 'today-cell' } : {})}
                  className={`w-7 h-7 flex items-center justify-center rounded-full text-sm ${
                    isToday(day) ? 'bg-gray-800 text-white font-bold' : 'text-gray-700'
                  }`}
                >
                  {day}
                </span>
                {postDays.has(day) && (
                  <span
                    data-testid="post-dot"
                    className="mt-0.5 w-1.5 h-1.5 rounded-full bg-blue-500"
                  />
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {sortedPosts.length > 0 && (
        <div className="space-y-3 pt-2">
          <p className="text-sm font-medium text-gray-700">今月の投稿予定</p>
          {sortedPosts.map((post) => {
            const account = snsAccounts.find((a) => a.platform === post.platform)
            const color = platformColors[post.platform]
            return (
              <div key={post.id} className="rounded-lg bg-white p-3 shadow space-y-1.5">
                <p className="text-xs text-gray-400">{formatDate(post.scheduledAt)}</p>
                <div className="flex items-center gap-2">
                  <span
                    className="rounded px-1.5 py-0.5 text-xs font-bold text-white"
                    style={{ backgroundColor: color }}
                  >
                    {platformLabels[post.platform]}
                  </span>
                  <span className="text-xs text-gray-500">{account?.accountName}</span>
                </div>
                <p className="text-sm text-gray-800">{post.content}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
