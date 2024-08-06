import AssetImage from 'components/common/assets/AssetImage'
import { FormattedNumber } from 'components/common/FormattedNumber'
import Text from 'components/common/Text'
import TitleAndSubCell from 'components/common/TitleAndSubCell'
import { MIN_AMOUNT } from 'constants/math'
import useAsset from 'hooks/assets/useAsset'
import { BNCoin } from 'types/classes/BNCoin'
import { demagnify, getCoinValue } from 'utils/formatters'
import { Tooltip } from 'components/common/Tooltip'
import { InfoCircle } from 'components/common/Icons'

interface Props {
  value: BNCoin
  assetData: Asset[]
}

export default function CustomAssetCell(props: Props) {
  const { value, assetData } = props
  const asset = useAsset(value.denom)
  const assetValue = getCoinValue(value, assetData)

  if (!asset) return null
  const assetAmount = demagnify(value.amount.toString(), asset)

  const isZero = assetAmount === 0
  const isBelowMinAmount = assetAmount < MIN_AMOUNT
  const displayAmount = isBelowMinAmount ? MIN_AMOUNT : assetAmount

  return (
    <TitleAndSubCell
      title={
        <div className='flex align-center justify-end'>
          <AssetImage asset={asset} className='w-4 h-4 mr-1' />
          <FormattedNumber
            amount={displayAmount}
            smallerThanThreshold={!isZero && isBelowMinAmount}
            options={{ minDecimals: 1, maxDecimals: 2, abbreviated: true }}
            className='text-xs'
            animate
          />
          <Text size='xs' className='text-white/60'>
            {asset ? asset.symbol : 'Unknown Asset'}
          </Text>
        </div>
      }
      sub={
        <div className='flex items-center justify-end space-x-1'>
          <FormattedNumber
            amount={assetValue.toNumber()}
            options={{ minDecimals: 1, abbreviated: true, prefix: '$' }}
            className='text-xs'
            animate
          />
          <Tooltip
            type='info'
            className='pb-1'
            content={<Text size='xs'>Current Price of the Asset</Text>}
          >
            <InfoCircle className='w-3.5 h-3.5 text-white/40 hover:text-inherit' />
          </Tooltip>
        </div>
      }
    />
  )
}
