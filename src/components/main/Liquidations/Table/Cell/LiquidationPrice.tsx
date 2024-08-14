import DisplayCurrency from 'components/common/DisplayCurrency'
import Text from 'components/common/Text'
import TitleAndSubCell from 'components/common/TitleAndSubCell'
import { BN } from 'utils/helpers'
import { BNCoin } from 'types/classes/BNCoin'
import { ORACLE_DENOM } from 'constants/oracle'

interface Props {
  value: BNCoin
}

export default function LiquidationPrice(props: Props) {
  return (
    <TitleAndSubCell
      title={
        <DisplayCurrency
          // TODO: update with real data (liquidation price)
          coin={BNCoin.fromDenomAndBigNumber(ORACLE_DENOM, BN(7))}
          className='text-xs'
          options={{ minDecimals: 1, maxDecimals: 2, abbreviated: true }}
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
