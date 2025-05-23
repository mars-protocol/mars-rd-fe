import Text from 'components/common/Text'
import useAsset from 'hooks/assets/useAsset'
import { FormattedNumber } from 'components/common/FormattedNumber'
import { BN } from 'utils/helpers'
import { BNCoin } from 'types/classes/BNCoin'
import { BN_ZERO } from 'constants/math'
import { demagnify } from 'utils/formatters'
import { PRICE_ORACLE_DECIMALS } from 'constants/query'
import { useMemo } from 'react'

interface Props {
  protocolFee: BNCoin
}

export default function LiquidationFees(props: Props) {
  const { protocolFee } = props
  const asset = useAsset(protocolFee.denom)

  // Calculate total fee (protocol fee is 25% of total)
  const totalFeeAmount = useMemo(() => {
    if (!protocolFee.amount || protocolFee.amount === BN_ZERO) {
      return BN_ZERO
    }
    return BN(protocolFee.amount).multipliedBy(4)
  }, [protocolFee.amount])

  // Calculate liquidator's share (75% of total)
  const liquidatorShareAmount = useMemo(() => {
    if (!totalFeeAmount || totalFeeAmount === BN_ZERO) {
      return BN_ZERO
    }
    return totalFeeAmount.multipliedBy(0.75)
  }, [totalFeeAmount])

  const protocolFeeAmount = asset ? demagnify(protocolFee.amount, asset) : 0
  const liquidatorFeeAmount = asset ? demagnify(liquidatorShareAmount, asset) : 0
  const totalAmount = asset ? demagnify(totalFeeAmount, asset) : 0

  if (!asset) return null

  return (
    <div className='flex flex-col gap-1'>
      <div className='flex items-center gap-1'>
        <Text size='xs'>Total liquidation fee: </Text>
        <FormattedNumber
          amount={totalAmount}
          className='text-xs'
          options={{ minDecimals: 2, maxDecimals: PRICE_ORACLE_DECIMALS, suffix: asset.symbol }}
        />
      </div>
      <div className='flex items-center gap-1'>
        <Text size='xs'> • Protocol fee (25%): </Text>
        <FormattedNumber
          amount={protocolFeeAmount}
          className='text-xs'
          options={{ minDecimals: 2, maxDecimals: PRICE_ORACLE_DECIMALS, suffix: asset.symbol }}
        />
      </div>
      <div className='flex items-center gap-1'>
        <Text size='xs'> • Liquidator share (75%): </Text>
        <FormattedNumber
          amount={liquidatorFeeAmount}
          className='text-xs'
          options={{ minDecimals: 2, maxDecimals: PRICE_ORACLE_DECIMALS, suffix: asset.symbol }}
        />
      </div>
    </div>
  )
}
