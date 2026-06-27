import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageGalleryProps {
  images: string[]
  title: string
}

const Placeholder = () => (
  <div className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-gray-100 text-gray-400">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
    <p className="text-sm">No images available</p>
  </div>
)

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selected, setSelected] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({})

  const validImages = images.filter((_, i) => !imgErrors[i])

  const prev = useCallback(() => {
    setSelected(s => (s - 1 + validImages.length) % validImages.length)
  }, [validImages.length])

  const next = useCallback(() => {
    setSelected(s => (s + 1) % validImages.length)
  }, [validImages.length])

  // Keyboard navigation in lightbox
  useEffect(() => {
    if (!lightboxOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape')     setLightboxOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxOpen, prev, next])

  if (!images.length || validImages.length === 0) {
    return <div className="aspect-square w-full max-w-lg rounded-xl overflow-hidden"><Placeholder /></div>
  }

  const currentSrc = validImages[selected] ?? validImages[0]

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Main image */}
        <div className="group relative aspect-square w-full max-w-lg overflow-hidden rounded-xl bg-gray-100">
          <img
            src={currentSrc}
            alt={`${title} — image ${selected + 1}`}
            loading="lazy"
            className="h-full w-full object-cover"
            onError={() => setImgErrors(e => ({ ...e, [selected]: true }))}
          />

          {/* Navigation arrows */}
          {validImages.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow hover:bg-white transition opacity-0 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4 text-gray-800" />
              </button>
              <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow hover:bg-white transition opacity-0 group-hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4 text-gray-800" />
              </button>
            </>
          )}

          {/* Expand button */}
          <button
            onClick={() => setLightboxOpen(true)}
            className="absolute bottom-2 right-2 rounded-full bg-white/80 p-1.5 shadow hover:bg-white transition opacity-0 group-hover:opacity-100"
            aria-label="View fullscreen"
          >
            <ZoomIn className="h-4 w-4 text-gray-800" />
          </button>

          {/* Counter */}
          {validImages.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white">
              {selected + 1} / {validImages.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {validImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {validImages.map((src, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={cn(
                  'h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition',
                  i === selected ? 'border-indigo-500' : 'border-transparent hover:border-gray-300',
                )}
              >
                <img
                  src={src}
                  alt={`Thumbnail ${i + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover"
                  onError={() => setImgErrors(e => ({ ...e, [i]: true }))}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {validImages.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); prev() }}
                className="absolute left-4 rounded-full bg-white/20 p-3 text-white hover:bg-white/30 transition"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={e => { e.stopPropagation(); next() }}
                className="absolute right-4 rounded-full bg-white/20 p-3 text-white hover:bg-white/30 transition"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <img
            src={currentSrc}
            alt={title}
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
            onClick={e => e.stopPropagation()}
          />

          {validImages.length > 1 && (
            <div className="absolute bottom-4 text-sm text-white/70">
              {selected + 1} / {validImages.length}
            </div>
          )}
        </div>
      )}
    </>
  )
}
