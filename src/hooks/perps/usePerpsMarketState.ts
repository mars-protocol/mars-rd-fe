import usePerpsAsset from 'hooks/perps/usePerpsAsset'
import { useMemo } from 'react'
import { byDenom } from 'utils/array'
import usePerpsMarketStates from 'hooks/perps/usePerpsMarketStates'

export default function usePerpsMarketState() {
  const { perpsAsset } = usePerpsAsset()
  const { data: perpsMarketStates } = usePerpsMarketStates()

  return useMemo(
    () => perpsMarketStates?.find(byDenom(perpsAsset.denom)),
    [perpsMarketStates, perpsAsset],
  )
}
