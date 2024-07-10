import getTotalSupply from 'api/tokenomics/getTotalSupply'
import useSWRImmutable from 'swr/immutable'

export default function useTotalSupply() {
  return useSWRImmutable('tokenomics/totalSupply', async () => getTotalSupply())
}
