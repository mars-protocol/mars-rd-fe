import getTotalSupply from 'api/tokenomics/getTotalSupply'
import useSWR from 'swr'

export default function useTotalSupply() {
  return useSWR('tokenomics/totalSupply', async () => getTotalSupply(), {
    refreshInterval: 60_000,
  })
}
