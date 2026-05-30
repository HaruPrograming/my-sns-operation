import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import TabBar from '../../components/TabBar'

function renderTabBar(activeTab = 'home', onTabChange = vi.fn()) {
  return render(
    <MemoryRouter>
      <TabBar activeTab={activeTab} onTabChange={onTabChange} />
    </MemoryRouter>
  )
}

describe('TabBar', () => {
  it('4つのタブが表示される', () => {
    renderTabBar()
    expect(screen.getByRole('button', { name: /ホーム/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /分析/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /予定/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /設定/i })).toBeInTheDocument()
  })

  it('タブをクリックすると onTabChange が呼ばれる', async () => {
    const onTabChange = vi.fn()
    renderTabBar('home', onTabChange)
    await userEvent.click(screen.getByRole('button', { name: /分析/i }))
    expect(onTabChange).toHaveBeenCalledWith('analytics')
  })

  it('activeTab に対応するタブがアクティブスタイルを持つ', () => {
    renderTabBar('analytics')
    const analyticsBtn = screen.getByRole('button', { name: /分析/i })
    expect(analyticsBtn).toHaveClass('text-blue-600')
  })
})
