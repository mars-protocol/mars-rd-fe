import useSWRImmutable from 'swr/immutable'

export default function useActivePerpsMarketsCount() {
  return useSWRImmutable(
    'perps/activeMarketsCount',
    async () => {
      try {
        const response = await fetch(
          'https://perps-historical-data.marsprotocol.io/api/get_perp_items',
        )
        if (!response.ok) return 0
        const data = await response.json()
        if (Array.isArray(data)) return data.length
        return 0
      } catch {
        return 0
      }
    },
    {
      // No fallback value; let undefined indicate not-yet-fetched
      revalidateOnFocus: false,
    },
  )
}
