import { X } from 'lucide-react'

interface Chip {
  key: string
  label: string
  onRemove: () => void
}

interface FilterChipsProps {
  chips: Chip[]
}

export function FilterChips({ chips }: FilterChipsProps) {
  if (!chips.length) return null

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map(chip => (
        <span
          key={chip.key}
          className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-800"
        >
          {chip.label}
          <button
            onClick={chip.onRemove}
            className="ml-0.5 rounded-full hover:text-indigo-600 transition"
            aria-label={`Remove ${chip.label} filter`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
    </div>
  )
}
