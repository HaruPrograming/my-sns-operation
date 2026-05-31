import { render, screen, fireEvent } from '@testing-library/react'
import { test, expect, describe } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Settings from '../../pages/Settings'
import { AuthContext } from '../../contexts/AuthContext'

const mockContextValue = {
  user: { name: 'テスト', email: 'test@test.com', avatar: null, x_connected: true },
  loading: false,
  logout: async () => {},
}

function renderSettings(search = '') {
  return render(
    <AuthContext.Provider value={mockContextValue}>
      <MemoryRouter initialEntries={[`/settings${search}`]}>
        <Settings />
      </MemoryRouter>
    </AuthContext.Provider>
  )
}

describe('SNSアカウント連携', () => {
  test('「SNSアカウント連携」の見出しが表示される', () => {
    renderSettings()
    expect(screen.getByText('SNSアカウント連携')).toBeInTheDocument()
  })

  test('連携済みと未連携のステータスが表示される', () => {
    renderSettings()
    expect(screen.getAllByText('連携済み').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('未連携').length).toBeGreaterThanOrEqual(1)
  })

  test('SNSをクリックすると連携モーダルが表示される', () => {
    renderSettings()
    fireEvent.click(screen.getByRole('button', { name: 'X連携済み' }))
    expect(screen.getByText('X 連携設定')).toBeInTheDocument()
  })

  test('モーダルのキャンセルで閉じることができる', () => {
    renderSettings()
    fireEvent.click(screen.getByRole('button', { name: 'X連携済み' }))
    fireEvent.click(screen.getByRole('button', { name: 'キャンセル' }))
    expect(screen.queryByText('X 連携設定')).not.toBeInTheDocument()
  })
})

describe('目標設定', () => {
  test('「目標設定」の見出しが表示される', () => {
    renderSettings()
    expect(screen.getByText('目標設定')).toBeInTheDocument()
  })

  test('目標フォロワー数のラベルが4つ表示される', () => {
    renderSettings()
    expect(screen.getAllByText('目標フォロワー数')).toHaveLength(4)
  })

  test('目標投稿数のラベルが4つ表示される', () => {
    renderSettings()
    expect(screen.getAllByText('目標投稿数/月')).toHaveLength(4)
  })
})

describe('通知設定', () => {
  test('「通知設定」の見出しが表示される', () => {
    renderSettings()
    expect(screen.getByText('通知設定')).toBeInTheDocument()
  })

  test('4つのスライドトグルが表示される', () => {
    renderSettings()
    expect(screen.getAllByRole('switch')).toHaveLength(4)
  })

  test('トグルの初期状態はすべてON', () => {
    renderSettings()
    screen.getAllByRole('switch').forEach((sw) => {
      expect(sw).toHaveAttribute('aria-checked', 'true')
    })
  })

  test('X のトグルをクリックするとOFFになる', () => {
    renderSettings()
    const xSwitch = screen.getByRole('switch', { name: 'X' })
    fireEvent.click(xSwitch)
    expect(xSwitch).toHaveAttribute('aria-checked', 'false')
  })
})

describe('連携成功トースト', () => {
  test('x_connected=1 のクエリパラメータがあると成功メッセージが表示される', () => {
    renderSettings('?x_connected=1')
    expect(screen.getByText(/X との連携が完了しました/)).toBeInTheDocument()
  })
})
