import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { FollowerDataPoint } from '../types'

interface Props {
  data: FollowerDataPoint[]
  color: string
}

export default function FollowerChart({ data, color }: Props) {
  return (
    <ResponsiveContainer width="100%" height={120}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} />
        <Tooltip />
        <Line type="monotone" dataKey="count" stroke={color} dot={false} strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}
