import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import SNSDetail from '../../pages/SNSDetail'

function renderSNSDetail(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <SNSDetail />
    </MemoryRouter>
  )
}

describe('SNSDetail - X', () => {
  it('フォロワー数が表示される', () => {
    renderSNSDetail('/x')
    expect(screen.getByText('12,500')).toBeInTheDocument()
  })

  it('「人気順」「新着順」ボタンが表示される', () => {
    renderSNSDetail('/x')
    expect(screen.getByRole('button', { name: '人気順' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '新着順' })).toBeInTheDocument()
  })

  it('投稿カードが2件表示される', () => {
    renderSNSDetail('/x')
    expect(screen.getByText(/Xのアルゴリズム変更/)).toBeInTheDocument()
    expect(screen.getByText(/インフォグラフィック/)).toBeInTheDocument()
  })

  it('フォロワー推移グラフのコンテナが存在する', () => {
    renderSNSDetail('/x')
    expect(screen.getByTestId('follower-chart')).toBeInTheDocument()
  })

  it('人気順をクリックするとviews数の多い投稿が先頭になる', async () => {
    renderSNSDetail('/x')
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: '人気順' }))
    const cards = screen.getAllByRole('listitem')
    expect(cards[0]).toHaveTextContent('Xのアルゴリズム変更')
  })

  it('フォロワー増加数が表示される', () => {
    renderSNSDetail('/x')
    expect(screen.getByText('+120')).toBeInTheDocument()
  })

  it('運用サマリーが4項目表示される', () => {
    renderSNSDetail('/x')
    expect(screen.getByText('今週の投稿数')).toBeInTheDocument()
    expect(screen.getByText('返信率')).toBeInTheDocument()
    expect(screen.getByText('ベストな時間帯')).toBeInTheDocument()
    expect(screen.getByText('伸びたフォーマット')).toBeInTheDocument()
  })
})

describe('SNSDetail - Instagram', () => {
  it('Instagramのフォロワー数が表示される', () => {
    renderSNSDetail('/instagram')
    expect(screen.getByText('8,900')).toBeInTheDocument()
  })

  it('Instagram投稿カードが表示される', () => {
    renderSNSDetail('/instagram')
    expect(screen.getByText(/朝のルーティン動画/)).toBeInTheDocument()
  })
})

describe('SNSDetail - LINE', () => {
  it('LINEのフォロワー数が表示される', () => {
    renderSNSDetail('/line')
    expect(screen.getByText('3,200')).toBeInTheDocument()
  })
})

describe('SNSDetail - YouTube', () => {
  it('YouTubeのフォロワー数が表示される', () => {
    renderSNSDetail('/youtube')
    expect(screen.getByText('5,600')).toBeInTheDocument()
  })
})
