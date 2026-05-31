import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Home from '../../pages/Home'

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )
}

describe('Home', () => {
  it('X・Instagram・LINE・YouTubeの4枚SNSカードが表示される', () => {
    renderHome()
    expect(screen.getByRole('heading', { name: 'X' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Instagram' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'LINE' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'YouTube' })).toBeInTheDocument()
  })

  it('各カードにアカウント名が表示される', () => {
    renderHome()
    expect(screen.getByText('@haru_x')).toBeInTheDocument()
    expect(screen.getByText('@haru_ig')).toBeInTheDocument()
    expect(screen.getByText('@haru_line')).toBeInTheDocument()
    expect(screen.getByText('@haru_tube')).toBeInTheDocument()
  })

  it('各SNSカードに詳細ページへのリンクが存在する', () => {
    renderHome()
    const hrefs = screen.getAllByRole('link').map((l) => l.getAttribute('href'))
    expect(hrefs).toContain('/x')
    expect(hrefs).toContain('/instagram')
    expect(hrefs).toContain('/line')
    expect(hrefs).toContain('/youtube')
  })

  it('各カードに外部リンクボタンが存在する', () => {
    renderHome()
    expect(screen.getByRole('link', { name: 'Xアプリで見る' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Instagramアプリで見る' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'LINEアプリで見る' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'YouTubeアプリで見る' })).toBeInTheDocument()
  })

  it('フォロワーとインプレッションが4カード分表示される', () => {
    renderHome()
    expect(screen.getAllByText('フォロワー')).toHaveLength(4)
    expect(screen.getAllByText('インプレッション')).toHaveLength(4)
  })

  it('各カードにバズ投稿ランキング1位・2位が表示される', () => {
    renderHome()
    expect(screen.getAllByText('1位')).toHaveLength(4)
    expect(screen.getAllByText('2位')).toHaveLength(4)
  })

  it('運用ヒントカードが表示される', () => {
    renderHome()
    expect(screen.getByText(/ヒント/i)).toBeInTheDocument()
  })
})
