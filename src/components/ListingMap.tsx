import { useEffect, useRef } from 'react'

interface ListingMapProps {
  lat: number
  lon: number
  title: string
  className?: string
}

export function ListingMap({ lat, lon, title, className }: ListingMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<unknown>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Dynamic import to avoid SSR issues and reduce initial bundle
    void import('leaflet').then(L => {
      if (mapRef.current || !containerRef.current) return

      // Fix default icon URLs
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(containerRef.current!).setView([lat, lon], 13)
      mapRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      L.marker([lat, lon])
        .addTo(map)
        .bindPopup(`<strong>${title}</strong>`)
        .openPopup()
    })

    return () => {
      if (mapRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(mapRef.current as any).remove()
        mapRef.current = null
      }
    }
  }, [lat, lon, title])

  return (
    <div
      ref={containerRef}
      className={className ?? 'h-56 w-full rounded-xl overflow-hidden'}
      style={{ zIndex: 0 }}
    />
  )
}
