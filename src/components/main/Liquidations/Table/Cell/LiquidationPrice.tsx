import { FormattedNumber } from 'components/common/FormattedNumber'
import Text from 'components/common/Text'
import TitleAndSubCell from 'components/common/TitleAndSubCell'

interface Props {
  value: BNCoin
}

export default function LiquidationPrice(props: Props) {
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
          {/* TODO: update with real data (collateral amount * liquidation price) */}
          <Text size='xs'>Total: $354</Text>
        </div>
      }
    />
  )
}
