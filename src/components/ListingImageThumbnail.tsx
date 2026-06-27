import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ListingImageThumbnailProps {
  images: string[]
  title: string
  className?: string
}

const PLACEHOLDER = (
  <div className="flex h-full w-full flex-col items-center justify-center bg-gray-100 text-gray-400">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-10 mb-1"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
    <span className="text-xs">No image</span>
  </div>
)

export function ListingImageThumbnail({ images, title, className }: ListingImageThumbnailProps) {
  const [errored, setErrored] = useState(false)
  const src = images[0]

  if (!src || errored) {
    return <div className={cn('overflow-hidden', className)}>{PLACEHOLDER}</div>
  }

  return (
    <div className={cn('overflow-hidden bg-gray-100', className)}>
      <img
        src={src}
        alt={title}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        onError={() => setErrored(true)}
      />
    </div>
  )
}
