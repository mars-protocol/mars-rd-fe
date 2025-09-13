import useSWR from 'swr'

import useAssets from 'hooks/assets/useAssets'
import useChainConfig from 'hooks/chain/useChainConfig'
import useMarketsInfo from 'hooks/markets/useMarketsInfo'
import useAssetParams from 'hooks/params/useAssetParams'
import {
  AssetParamsBaseForAddr as AssetParams,
  TotalDepositResponse,
} from 'types/generated/mars-params/MarsParams.types'
import { Market as RedBankMarket } from 'types/generated/mars-red-bank/MarsRedBank.types'
import { byDenom } from 'utils/array'
import { resolveMarketResponse } from 'utils/resolvers'

export default function useMarkets() {
  const chainConfig = useChainConfig()
  const { data: assets } = useAssets()
  const { data: marketInfos } = useMarketsInfo()
  const { data: assetParams } = useAssetParams()
  const result = useSWR(
    !!marketInfos?.length &&
      !!assetParams?.length &&
      !!assets?.length &&
      `chains/${chainConfig.id}/markets`,
    () => {
      return assets!.map((asset) =>
        resolveMarketResponse(
          asset,
          marketInfos!.find(byDenom(asset.denom)) as RedBankMarket & Partial<Market>,
          assetParams!.find(byDenom(asset.denom)) as AssetParams,
        ),
      )
    },
    {
      fallbackData: [],
    },
  )

  return result.data
}
