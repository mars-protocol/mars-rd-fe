import getCirculatingSupply from 'api/tokenomics/getCirculatingSupply'
import useSWRImmutable from 'swr/immutable'

export default function useCirculatingSupply() {
  return useSWRImmutable('tokenomics/circulatingSupply', async () => getCirculatingSupply())
}
