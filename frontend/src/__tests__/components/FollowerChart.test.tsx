import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import FollowerChart from '../../components/FollowerChart'
import type { FollowerDataPoint } from '../../types'

const mockData: FollowerDataPoint[] = [
  { date: '2024-01', count: 1000 },
  { date: '2024-02', count: 1200 },
  { date: '2024-03', count: 1150 },
]

describe('FollowerChart', () => {
  it('コンテナが描画される', () => {
    const { container } = render(<FollowerChart data={mockData} color="#1A1A1A" />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('データが空でもクラッシュしない', () => {
    const { container } = render(<FollowerChart data={[]} color="#1A1A1A" />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
