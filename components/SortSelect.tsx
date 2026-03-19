'use client'

interface SortSelectProps {
  value: string
  onChange: (value: string) => void
  options?: { value: string; label: string }[]
}

const DEFAULT_SORT_OPTIONS = [
  { value: 'newest', label: '최신순' },
  { value: 'oldest', label: '오래된순' },
  { value: 'feasibility-desc', label: '사업성 높은순' },
  { value: 'feasibility-asc', label: '사업성 낮은순' },
  { value: 'difficulty-asc', label: '난이도 낮은순' },
  { value: 'difficulty-desc', label: '난이도 높은순' },
  { value: 'bookmarked', label: '즐겨찾기 우선' },
]

export default function SortSelect({ value, onChange, options = DEFAULT_SORT_OPTIONS }: SortSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-[13px] px-3 py-2 rounded-lg appearance-none cursor-pointer outline-none"
      style={{
        background: 'rgb(18 18 30)',
        color: 'rgb(160 155 210)',
        border: '1px solid rgb(35 35 60)',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 4.5l3 3 3-3' stroke='%237c7ca0' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 10px center',
        paddingRight: '32px',
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
