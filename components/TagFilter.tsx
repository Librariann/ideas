'use client'

interface TagFilterProps {
  tags: string[]
  selected: string
  onSelect: (tag: string) => void
}

export default function TagFilter({ tags, selected, onSelect }: TagFilterProps) {
  if (tags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect('')}
        className="text-xs px-3 py-1.5 rounded-full transition-all"
        style={{
          background: selected === '' ? 'rgb(139 92 246 / 0.2)' : 'rgb(20 20 35)',
          color: selected === '' ? 'rgb(167 139 250)' : 'rgb(90 90 130)',
          border: selected === '' ? '1px solid rgb(139 92 246 / 0.4)' : '1px solid rgb(32 32 52)',
        }}
      >
        전체
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onSelect(selected === tag ? '' : tag)}
          className="text-xs px-3 py-1.5 rounded-full transition-all"
          style={{
            background: selected === tag ? 'rgb(139 92 246 / 0.2)' : 'rgb(20 20 35)',
            color: selected === tag ? 'rgb(167 139 250)' : 'rgb(90 90 130)',
            border: selected === tag ? '1px solid rgb(139 92 246 / 0.4)' : '1px solid rgb(32 32 52)',
          }}
        >
          #{tag}
        </button>
      ))}
    </div>
  )
}
