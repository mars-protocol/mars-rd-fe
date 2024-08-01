import AssetImage from 'components/common/assets/AssetImage'
import { FormattedNumber } from 'components/common/FormattedNumber'
import Text from 'components/common/Text'
import TitleAndSubCell from 'components/common/TitleAndSubCell'
import Image from 'next/image'
import { byDenom } from 'utils/array'
import { getCoinValue } from 'utils/formatters'

interface Props {
  value: BNCoin
  assetsData: Asset[]
}

export default function CustomAssetCell(props: Props) {
  const { value, assetsData } = props
  const asset = assetsData.find(byDenom(value.denom))
  //   const logo = asset?.logo
  //   console.log(logo, 'logo')

  console.log(asset, 'assetsData')
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
      sub={
        <span className='flex align-center justify-end'>
          <AssetImage asset={asset} className='w-4 h-4 mr-1' />
          <Text size='xs'>{asset ? asset.symbol : 'Unknown Asset'}</Text>
        </span>
      }
    />
  )
}
