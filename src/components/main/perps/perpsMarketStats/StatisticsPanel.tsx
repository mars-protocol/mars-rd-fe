import classNames from 'classnames'
import Card from 'components/common/Card'
import DisplayCurrency from 'components/common/DisplayCurrency'
import { FormattedNumber } from 'components/common/FormattedNumber'
import Loading from 'components/common/Loading'
import Text from 'components/common/Text'
import { PRICE_ORACLE_DECIMALS } from 'constants/query'
import { BNCoin } from 'types/classes/BNCoin'
import { BN } from 'utils/helpers'

interface Props {
  data: PerpsGlobalData
}

export default function StatisticsPanel(props: Props) {
  const { data } = props

  const getLatestValue = (dateValues: DateValue[] = []) => {
    if (dateValues.length === 0) return BN(0)

    // If today's value (first in array) is non-zero, use it
    if (dateValues[0].value !== '0') {
      return BN(dateValues[0].value)
    }

    // If today is zero and we have yesterday's data, use yesterday
    if (dateValues.length > 1) {
      return BN(dateValues[1].value)
    }

    return BN(0)
  }

  const metrics: Metric[] = [
    {
      value: getLatestValue(data.daily_trading_volume),
      label: 'Daily Trading Volume',
      isCurrency: true,
      formatOptions: { maxDecimals: 4, minDecimals: 2, abbreviated: true },
    },
    {
      value: getLatestValue(data.open_interest.total),
      label: 'Total Open Interest',
      isCurrency: true,
      formatOptions: {
        maxDecimals: 2,
        minDecimals: 2,
        abbreviated: true,
      },
    },
    {
      value: getLatestValue(data.fees.trading_fee),
      label: 'Daily Trading Fees',
      isCurrency: true,
      formatOptions: { abbreviated: true },
    },
    {
      value: BN(data.notional_at_risk),
      label: 'Notional at Risk',
      isCurrency: true,
      formatOptions: { maxDecimals: 2, minDecimals: 2, abbreviated: true },
    },
    {
      value: BN(data.accounts_at_risk),
      label: 'Accounts at Risk',
      formatOptions: { maxDecimals: 0, minDecimals: 0 },
    },
    {
      value: BN(data.total_accounts),
      label: 'Total Users',
      formatOptions: { maxDecimals: 0, minDecimals: 0 },
    },
  ]

  const isLoading = false

  return (
    <div className='flex items-center justify-center gap-2'>
      {metrics.map((metric, index) => {
        return (
          <Card className='text-center py-3 w-45 bg-white/5' key={index}>
            {isLoading ? (
              <div className='flex items-center justify-center px-8 w-full h-8'>
                <Loading />
              </div>
            ) : metric.isCurrency ? (
              <DisplayCurrency
                coin={BNCoin.fromDenomAndBigNumber(
                  'usd',
                  BN(metric.value).shiftedBy(-PRICE_ORACLE_DECIMALS),
                )}
                options={metric.formatOptions}
                className='text-sm'
              />
            ) : (
              <FormattedNumber
                amount={metric.value.toNumber()}
                options={metric.formatOptions}
                animate
                className='text-sm'
              />
            )}
            <Text size='xs' className='pt-1 text-white/40'>
              {metric.label}
            </Text>
            <Text size='xs' className={classNames('pt-1', 'text-profit')}>
              +24k
            </Text>
          </Card>
        )
      })}
    </div>
  )
}
