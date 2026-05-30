import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import SNSTabBar from '../../components/SNSTabBar'

function renderSNSTabBar(activeTab = 'x', onTabChange = vi.fn()) {
  return render(<SNSTabBar activeTab={activeTab} onTabChange={onTabChange} />)
}

describe('SNSTabBar', () => {
  it('5つのSNSタブが表示される', () => {
    renderSNSTabBar()
    expect(screen.getByRole('button', { name: /x/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /instagram/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /line/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /youtube/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /全体/i })).toBeInTheDocument()
  })

  it('タブをクリックすると onTabChange が呼ばれる', async () => {
    const onTabChange = vi.fn()
    renderSNSTabBar('x', onTabChange)
    await userEvent.click(screen.getByRole('button', { name: /instagram/i }))
    expect(onTabChange).toHaveBeenCalledWith('instagram')
  })

  it('activeTab のタブがアクティブスタイルを持つ', () => {
    renderSNSTabBar('line')
    const lineBtn = screen.getByRole('button', { name: /line/i })
    expect(lineBtn).toHaveClass('border-b-2')
  })
})
