import getDexAssets from 'api/assets/getDexAssets'
import useChainConfig from 'hooks/chain/useChainConfig'
import useSWR from 'swr'

export default function useAssets() {
  const chainConfig = useChainConfig()

  return useSWR(`chains/${chainConfig.id}/assets`, async () => getDexAssets(chainConfig), {
    fallbackData: [],
  })
}
