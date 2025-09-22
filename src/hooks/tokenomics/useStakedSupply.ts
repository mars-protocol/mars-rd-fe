import getStakedSupply from 'api/tokenomics/getStakedSupply'
import useChainConfig from 'hooks/chain/useChainConfig'
import useSWR from 'swr'

export default function useStakedSupply() {
  const chainConfig = useChainConfig()

  return useSWR(`chains/${chainConfig.id}/tokenomics/stakedSupply`, async () => getStakedSupply(), {
    refreshInterval: 300_000,
  })
}
