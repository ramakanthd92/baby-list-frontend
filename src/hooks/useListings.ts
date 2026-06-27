import { useQuery } from '@tanstack/react-query'
import { fetchListing, fetchListings } from '@/lib/api'
import type { ListingQueryParams } from '@/types'

export function useListings(params: ListingQueryParams = {}) {
  return useQuery({
    queryKey: ['listings', params],
    queryFn: () => fetchListings(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
    placeholderData: (prev) => prev,
  })
}

export function useListing(id: string) {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: () => fetchListing(id),
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(id),
  })
}
