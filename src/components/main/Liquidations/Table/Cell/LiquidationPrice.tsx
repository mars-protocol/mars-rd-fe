import { PRICE_ORACLE_DECIMALS } from 'constants/query'
import useAssets from 'hooks/assets/useAssets'
import { useMemo } from 'react'
import { byDenom } from 'utils/array'
import { BN } from 'utils/helpers'
import { getPriceDecimals } from 'utils/formatters'
import { FormattedNumber } from 'components/common/FormattedNumber'

interface Props {
  value: LiquidationDataItem
}

export default function LiquidationPrice(props: Props) {
  const { value } = props
  const { data: assets } = useAssets()

  const liquidationPrice = useMemo(() => {
    if (!value.price_liquidated || !value.collateral_asset_won || !assets) return null

    // Find the asset for the collateral
    const asset = assets.find(byDenom(value.collateral_asset_won.denom))
    if (!asset) return null

    const actualPrice = BN(value.price_liquidated).shiftedBy(asset.decimals - PRICE_ORACLE_DECIMALS)

    return actualPrice
  }, [value.price_liquidated, value.collateral_asset_won, assets])

  if (!liquidationPrice) return <span>-</span>

  return (
    <FormattedNumber
      className='text-xs text-white/50'
      amount={liquidationPrice.toNumber()}
      options={{
        abbreviated: false,
        maxDecimals: getPriceDecimals(liquidationPrice),
        prefix: '$',
      }}
    />
  )
}
