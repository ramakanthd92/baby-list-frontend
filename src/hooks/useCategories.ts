import { useQuery } from '@tanstack/react-query'
import { fetchCategories, fetchSources } from '@/lib/api'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 60, // 1 hour — taxonomy changes rarely
  })
}

export function useSources() {
  return useQuery({
    queryKey: ['sources'],
    queryFn: fetchSources,
    staleTime: 1000 * 60 * 10,
  })
}
