import getCirculatingSupply from 'api/tokenomics/getCirculatingSupply'
import useSWR from 'swr'

export default function useCirculatingSupply() {
  return useSWR('tokenomics/circulatingSupply', async () => getCirculatingSupply(), {
    refreshInterval: 60_000,
  })
}
