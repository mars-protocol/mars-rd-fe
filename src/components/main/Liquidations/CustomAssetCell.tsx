import AssetImage from 'components/common/assets/AssetImage'
import { FormattedNumber } from 'components/common/FormattedNumber'
import Loading from 'components/common/Loading'
import Text from 'components/common/Text'
import TitleAndSubCell from 'components/common/TitleAndSubCell'
import { byDenom } from 'utils/array'
import { getCoinAmount, getCoinValue } from 'utils/formatters'
import { BN } from 'utils/helpers'

interface Props {
  value: BNCoin
  assetsData: Asset[]
}

export default function CustomAssetCell(props: Props) {
  const { value, assetsData } = props
  const asset = assetsData.find(byDenom(value.denom))
  const formattedValue = getCoinValue(value, assetsData)

  const coinAmount = getCoinAmount(value.denom, formattedValue, assetsData)
  console.log(coinAmount.toNumber(), 'amount of coins')

  if (!asset || !formattedValue) {
    return <Loading />
  }

  return (
    <TitleAndSubCell
      title={
        <FormattedNumber
          amount={formattedValue.toNumber()}
          options={{ minDecimals: 2, abbreviated: true, prefix: '$' }}
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
