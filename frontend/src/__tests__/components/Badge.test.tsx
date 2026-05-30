import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Badge from '../../components/Badge'

describe('Badge', () => {
  it('テキストが表示される', () => {
    render(<Badge type="success" label="増加中" />)
    expect(screen.getByText('増加中')).toBeInTheDocument()
  })

  it('type=success のとき緑系のクラスを持つ', () => {
    render(<Badge type="success" label="好調" />)
    const badge = screen.getByText('好調')
    expect(badge.className).toMatch(/green|success|\[#1D9E75\]/i)
  })

  it('type=error のとき赤系のクラスを持つ', () => {
    render(<Badge type="error" label="減少" />)
    const badge = screen.getByText('減少')
    expect(badge.className).toMatch(/red|error|\[#E24B4A\]/i)
  })

  it('type=neutral のとき中立系のクラスを持つ', () => {
    render(<Badge type="neutral" label="横ばい" />)
    const badge = screen.getByText('横ばい')
    expect(badge.className).toMatch(/gray|neutral/i)
  })
})
