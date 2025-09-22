import getCirculatingSupply from 'api/tokenomics/getCirculatingSupply'
import useChainConfig from 'hooks/chain/useChainConfig'
import useSWR from 'swr'

export default function useCirculatingSupply() {
  const chainConfig = useChainConfig()

  return useSWR(
    `chains/${chainConfig.id}/tokenomics/circulatingSupply`,
    async () => getCirculatingSupply(),
    {
      refreshInterval: 300_000,
    },
  )
}
