import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Analytics from '../../pages/Analytics'

function renderAnalytics() {
  return render(
    <MemoryRouter>
      <Analytics />
    </MemoryRouter>
  )
}

describe('Analytics', () => {
  it('期間切替ボタンが3つ表示される', () => {
    renderAnalytics()
    expect(screen.getByRole('button', { name: '週' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '月' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '3ヶ月' })).toBeInTheDocument()
  })

  it('4プラットフォームのサマリーカードが表示される', () => {
    renderAnalytics()
    expect(screen.getByText('@haru_x')).toBeInTheDocument()
    expect(screen.getByText('@haru_ig')).toBeInTheDocument()
    expect(screen.getByText('@haru_line')).toBeInTheDocument()
    expect(screen.getByText('@haru_tube')).toBeInTheDocument()
  })

  it('フォロワー推移グラフのコンテナが存在する', () => {
    renderAnalytics()
    expect(screen.getByTestId('analytics-chart')).toBeInTheDocument()
  })

  it('期間切替ボタンをクリックするとアクティブが変わる', async () => {
    renderAnalytics()
    const user = userEvent.setup()
    const monthBtn = screen.getByRole('button', { name: '月' })
    await user.click(monthBtn)
    expect(monthBtn).toHaveAttribute('aria-pressed', 'true')
  })

  it('今月のベスト投稿セクションが表示される', () => {
    renderAnalytics()
    expect(screen.getByText(/ベスト投稿/)).toBeInTheDocument()
  })
})
