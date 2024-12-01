import useSWRImmutable from 'swr/immutable'
import useChainConfig from 'hooks/chain/useChainConfig'
import getTvl from 'api/tokenomics/getTvl'

export default function useTvl() {
  const chainConfig = useChainConfig()

  return useSWRImmutable(`chains/${chainConfig.id}/tvl`, () => getTvl(chainConfig))
}
