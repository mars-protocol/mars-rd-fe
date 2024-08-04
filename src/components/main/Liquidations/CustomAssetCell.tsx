import AssetImage from 'components/common/assets/AssetImage'
import { FormattedNumber } from 'components/common/FormattedNumber'
import Text from 'components/common/Text'
import TitleAndSubCell from 'components/common/TitleAndSubCell'
import { MIN_AMOUNT } from 'constants/math'
import useAsset from 'hooks/assets/useAsset'
import { BNCoin } from 'types/classes/BNCoin'
import { demagnify } from 'utils/formatters'

interface Props {
  value: BNCoin
}

export default function CustomAssetCell(props: Props) {
  const {
    value: { amount, denom },
  } = props
  const asset = useAsset(denom)

  if (!asset) return null
  const assetAmount = demagnify(amount.toString(), asset)

  const isZero = assetAmount === 0
  const isBelowMinAmount = assetAmount < MIN_AMOUNT
  const displayAmount = isBelowMinAmount ? MIN_AMOUNT : assetAmount

  return (
    <TitleAndSubCell
      title={
        <FormattedNumber
          amount={displayAmount}
          smallerThanThreshold={!isZero && isBelowMinAmount}
          options={{ minDecimals: 2, maxDecimals: 3, abbreviated: true }}
          className='text-xs'
          animate
        />
      }
      sub={
        <span className='flex align-center justify-end'>
          <AssetImage asset={asset} className='w-4 h-4 mr-1' />
          <Text size='xs'>{asset ? asset.symbol : 'Unknown Asset'}</Text>
        </span>
      }
    />
  )
}
