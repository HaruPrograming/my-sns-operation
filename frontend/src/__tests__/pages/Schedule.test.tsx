import { render, screen, fireEvent } from '@testing-library/react'
import { vi, test, expect, beforeEach, afterEach } from 'vitest'
import Schedule from '../../pages/Schedule'

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-05-15'))
})

afterEach(() => {
  vi.useRealTimers()
})

test('現在の月名が表示される', () => {
  render(<Schedule />)
  expect(screen.getByText('2026年5月')).toBeInTheDocument()
})

test('翌月ボタンで翌月に切り替わる', () => {
  render(<Schedule />)
  fireEvent.click(screen.getByRole('button', { name: '次の月' }))
  expect(screen.getByText('2026年6月')).toBeInTheDocument()
})

test('前月ボタンで前月に切り替わる', () => {
  render(<Schedule />)
  fireEvent.click(screen.getByRole('button', { name: '前の月' }))
  expect(screen.getByText('2026年4月')).toBeInTheDocument()
})

test('今日の日付がハイライトされる', () => {
  render(<Schedule />)
  const todayCell = screen.getByTestId('today-cell')
  expect(todayCell).toBeInTheDocument()
  expect(todayCell).toHaveTextContent('15')
})

test('投稿予定がある日にドットが表示される', () => {
  render(<Schedule />)
  expect(screen.getAllByTestId('post-dot').length).toBeGreaterThan(0)
})

test('投稿リストに日付が表示される', () => {
  render(<Schedule />)
  expect(screen.getByText('5月10日')).toBeInTheDocument()
})

test('投稿リストにプラットフォームとアカウント名が表示される', () => {
  render(<Schedule />)
  expect(screen.getByText('@haru_x')).toBeInTheDocument()
})

test('投稿リストに投稿内容が表示される', () => {
  render(<Schedule />)
  expect(screen.getByText('Xアルゴリズムの最新情報をまとめたスレッドを投稿予定')).toBeInTheDocument()
})
