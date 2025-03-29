import DisplayCurrency from 'components/common/DisplayCurrency'
import Text from 'components/common/Text'
import TitleAndSubCell from 'components/common/TitleAndSubCell'
import { BN } from 'utils/helpers'
import { BNCoin } from 'types/classes/BNCoin'
import { ORACLE_DENOM } from 'constants/oracle'
import { useMemo } from 'react'
import { BN_ZERO } from 'constants/math'
import { PRICE_ORACLE_DECIMALS } from 'constants/query'

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
        <DisplayCurrency
          coin={BNCoin.fromDenomAndBigNumber(ORACLE_DENOM, BN(value.price_liquidated!))}
          className='text-xs'
          options={{ minDecimals: 1, maxDecimals: 2, abbreviated: true }}
        />
      }
      sub={
        <div className='flex items-center justify-end space-x-1'>
          <Text size='xs'>Total: </Text>
          <DisplayCurrency
            coin={BNCoin.fromDenomAndBigNumber(ORACLE_DENOM, totalValue)}
            className='text-xs'
            options={{ minDecimals: 1, maxDecimals: 2, abbreviated: true }}
          />
        </div>
      }
    />
  )
}
