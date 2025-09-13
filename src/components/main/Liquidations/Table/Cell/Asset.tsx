import AssetImage from 'components/common/assets/AssetImage'
import { FormattedNumber } from 'components/common/FormattedNumber'
import { InfoCircle } from 'components/common/Icons'
import Text from 'components/common/Text'
import TitleAndSubCell from 'components/common/TitleAndSubCell'
import { Tooltip } from 'components/common/Tooltip'
import { BN_ZERO, MIN_AMOUNT } from 'constants/math'
import useAsset from 'hooks/assets/useAsset'
import { useMemo } from 'react'
import { BNCoin } from 'types/classes/BNCoin'
import { demagnify, getCoinValue } from 'utils/formatters'
import { BN } from 'utils/helpers'

interface Props {
  value: BNCoin
  assetData: Asset[]
  historicalPrice?: string
  hidePrice?: boolean
}

export default function Asset(props: Props) {
  const { value, assetData, historicalPrice, hidePrice } = props
  const asset = useAsset(value.denom)

  const assetAmount = asset ? demagnify(value.amount.toString(), asset) : 0
  const isZero = assetAmount === 0
  const isBelowMinAmount = assetAmount < MIN_AMOUNT
  const displayAmount = isBelowMinAmount ? MIN_AMOUNT : assetAmount

  const calculateValue = useMemo(() => {
    if (!value.amount || value.amount === BN_ZERO) {
      return BN_ZERO
    }

    if (historicalPrice === 'null') {
      return 'N/A'
    }

    if (historicalPrice) {
      return BN(historicalPrice).multipliedBy(assetAmount)
    }
    const currentValue = getCoinValue(value, assetData)
    // If we don't have a price for this asset, return 'N/A'
    if (currentValue.isZero()) return 'N/A'
    return currentValue
  }, [historicalPrice, assetAmount, value, assetData])

  const assetValue = calculateValue

  if (!asset) return null

  return (
    <TitleAndSubCell
      title={
        <div className='flex justify-end items-center'>
          <AssetImage asset={asset} className='mr-1 w-4 h-4' />
          <FormattedNumber
            amount={displayAmount}
            smallerThanThreshold={!isZero && isBelowMinAmount}
            options={{ minDecimals: 1, maxDecimals: 2, abbreviated: true }}
            className='text-xs'
          />
          <Text size='xs' className='text-white/60 pl-0.5'>
            {asset ? asset.symbol : 'Unknown Asset'}
          </Text>
        </div>
      }
      sub={
        hidePrice ? undefined : (
          <div className='flex gap-1 justify-end items-center'>
            {assetValue === 'N/A' ? (
              <Text size='xs' className='text-white/60'>
                N/A
              </Text>
            ) : (
              <FormattedNumber
                amount={BN(assetValue).toNumber()}
                className='text-xs'
                options={{ minDecimals: 1, maxDecimals: 2, abbreviated: true, prefix: '$' }}
              />
            )}
            <Tooltip
              type='info'
              content={
                <Text size='xs'>
                  {historicalPrice
                    ? 'Price of the asset when liquidation happened'
                    : 'Current price of the asset'}
                </Text>
              }
            >
              <InfoCircle className='w-3.5 h-3.5 text-white/40 hover:text-inherit' />
            </Tooltip>
          </div>
        )
      }
    />
  )
}
