import getMarsTokenPrice from 'api/tokenomics/getMarsTokenPrice'
import useStore from 'store'
import useSWR from 'swr'

export default function useMarsTokenPrice() {
  const chainConfig = useStore((state) => state.chainConfig)

  return useSWR('tokenomics/marsTokenPrice', async () => getMarsTokenPrice(chainConfig.id), {
    refreshInterval: 60_000,
  })
}
