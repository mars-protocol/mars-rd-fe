import getMarsTokenPrice from 'api/tokenomics/getMarsTokenPrice'
import useSWR from 'swr'

export default function useMarsTokenPrice() {
  return useSWR('tokenomics/marsTokenPrice', async () => getMarsTokenPrice(), {
    refreshInterval: 60_000,
  })
}
