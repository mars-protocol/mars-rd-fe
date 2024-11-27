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

  const totalValue = useMemo(() => {
    if (!value.price_liquidated || !value.collateral_asset_won?.amount) {
      return BN_ZERO
    }
    const price = BN(value.price_liquidated)
    const amount = BN(value.collateral_asset_won.amount)

    return price.multipliedBy(amount)
  }, [value.price_liquidated, value.collateral_asset_won])

  return value.price_liquidated && value.collateral_asset_won?.amount ? (
    <TitleAndSubCell
      title={
        <DisplayCurrency
          coin={BNCoin.fromDenomAndBigNumber(ORACLE_DENOM, BN(value.price_liquidated))}
          className='text-xs'
          options={{ minDecimals: 1, maxDecimals: 2, abbreviated: true }}
          animate={false}
        />
      }
      sub={
        <div className='flex items-center justify-end space-x-1'>
          <Text size='xs'>Total: </Text>
          <DisplayCurrency
            coin={BNCoin.fromDenomAndBigNumber(
              ORACLE_DENOM,
              totalValue.shiftedBy(-PRICE_ORACLE_DECIMALS),
            )}
            className='text-xs'
            options={{ minDecimals: 1, maxDecimals: 2, abbreviated: true }}
            animate={false}
          />
        </div>
      }
    />
  ) : (
    <Text size='xs'>N/A</Text>
  )
}
