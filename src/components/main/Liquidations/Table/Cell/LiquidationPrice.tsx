import { FormattedNumber } from 'components/common/FormattedNumber'
import Text from 'components/common/Text'
import TitleAndSubCell from 'components/common/TitleAndSubCell'
import { BN_ZERO } from 'constants/math'
import { PRICE_ORACLE_DECIMALS } from 'constants/query'
import { useMemo } from 'react'
import { BN } from 'utils/helpers'

interface Props {
  value: LiquidationDataItem
}

export default function LiquidationPrice(props: Props) {
  const { value } = props

  const isInvalidPrice =
    !value.price_liquidated ||
    value.price_liquidated === 'null' ||
    !value.collateral_asset_won?.amount

  const totalValue = useMemo(() => {
    if (isInvalidPrice) {
      return BN_ZERO
    }
    return BN(value.price_liquidated!)
      .multipliedBy(BN(value.collateral_asset_won!.amount))
      .shiftedBy(-PRICE_ORACLE_DECIMALS)
  }, [value.price_liquidated, value.collateral_asset_won, isInvalidPrice])

  if (isInvalidPrice) {
    return <Text size='xs'>N/A</Text>
  }

  return (
    <TitleAndSubCell
      title={
        <FormattedNumber
          amount={BN(value.price_liquidated!).toNumber()}
          className='text-xs'
          options={{ minDecimals: 1, maxDecimals: 2, abbreviated: true, prefix: '$' }}
        />
      }
      sub={undefined}
    />
  )
}
