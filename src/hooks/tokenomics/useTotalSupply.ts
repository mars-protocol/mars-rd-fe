import getTotalSupply from 'api/tokenomics/getTotalSupply'
import useChainConfig from 'hooks/chain/useChainConfig'
import useSWRImmutable from 'swr/immutable'

export default function useTotalSupply() {
  const chainConfig = useChainConfig()

  return useSWRImmutable(
    `chains/${chainConfig.id}/tokenomics/totalSupply`,
    async () => getTotalSupply(),
    {
      refreshInterval: 300_000,
    },
  )
}
