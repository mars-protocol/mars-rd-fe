import AssetImage from 'components/common/assets/AssetImage'
import { FormattedNumber } from 'components/common/FormattedNumber'
import Text from 'components/common/Text'
import TitleAndSubCell from 'components/common/TitleAndSubCell'
import useAsset from 'hooks/assets/useAsset'
import { BNCoin } from 'types/classes/BNCoin'

interface Props {
  value: BNCoin
}

export default function CustomLiquidationPriceCell(props: Props) {
  const { value } = props
  const asset = useAsset(value.denom)

  if (!asset) return null

  return (
    <TitleAndSubCell
      title={
        <FormattedNumber
          amount={7}
          options={{ minDecimals: 1, maxDecimals: 2, abbreviated: true, prefix: '$' }}
          className='text-xs'
          animate
        />
      }
      sub={
        <div className='flex items-center justify-end space-x-1'>
          <Text size='xs'>Total: $354</Text>
          {/* collateral amount * liquidation price */}
        </div>
      }
    />
  )
}
