import { FormattedNumber } from 'components/common/FormattedNumber'
import Text from 'components/common/Text'
import TitleAndSubCell from 'components/common/TitleAndSubCell'
import { byDenom } from 'utils/array'
import { getCoinValue } from 'utils/formatters'

interface Props {
  value: BNCoin
  assetsData: Asset[]
}

export default function CustomAssetCell(props: Props) {
  const { value, assetsData } = props
  const asset = assetsData.find(byDenom(value.denom))

  console.log(asset?.symbol, 'assetsData')
  const formattedValue = getCoinValue(value, assetsData)

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
      sub={<Text size='xs'>{asset ? asset.symbol : 'Unknown Asset'}</Text>}
    />
  )
}
