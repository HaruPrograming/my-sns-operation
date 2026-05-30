import type { BadgeType } from '../types'

interface Props {
  type: BadgeType
  label: string
}

const classMap: Record<BadgeType, string> = {
  success: 'bg-[#1D9E75]/10 text-[#1D9E75]',
  error: 'bg-[#E24B4A]/10 text-[#E24B4A]',
  neutral: 'bg-gray-100 text-gray-500',
}

export default function Badge({ type, label }: Props) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${classMap[type]}`}>
      {label}
    </span>
  )
}
