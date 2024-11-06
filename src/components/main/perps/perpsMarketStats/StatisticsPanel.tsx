import classNames from 'classnames'
import Card from 'components/common/Card'
import DisplayCurrency from 'components/common/DisplayCurrency'
import { FormattedNumber } from 'components/common/FormattedNumber'
import Loading from 'components/common/Loading'
import Text from 'components/common/Text'
import { ORACLE_DENOM } from 'constants/oracle'
import { BNCoin } from 'types/classes/BNCoin'
import { BN } from 'utils/helpers'

export default function StatisticsPanel() {
  const metrics: Metric[] = [
    {
      value: BN(100000000),
      label: 'Trading Volume',
      isCurrency: true,
      formatOptions: { maxDecimals: 4, minDecimals: 2, abbreviated: true },
    },
    {
      value: BN(100000000),
      label: 'Open Interest Long',
      isCurrency: true,
      formatOptions: {
        maxDecimals: 2,
        minDecimals: 2,
        abbreviated: true,
      },
    },
    {
      value: BN(100000000),
      label: 'Open Interest Short',
      isCurrency: true,
      formatOptions: { abbreviated: true },
    },
    {
      value: BN(100000000),
      label: 'Trading Fees',
      isCurrency: true,
      formatOptions: { abbreviated: true },
    },
    {
      value: BN(100000000),
      label: 'Funding Fees',
      isCurrency: true,
      formatOptions: { maxDecimals: 2, minDecimals: 2, abbreviated: true },
    },
    {
      value: BN(100000000),
      label: 'Notional at Risk',
      isCurrency: true,
      formatOptions: { maxDecimals: 2, minDecimals: 2, abbreviated: true },
    },
    {
      value: BN(100000),
      label: 'Total Users',
      formatOptions: { maxDecimals: 0, minDecimals: 0 },
    },
  ]

  const isLoading = false

  return (
    <div className='flex flex-col gap-3'>
      {metrics.map((metric, index) => {
        return (
          <Card className='py-5 text-center w-60 bg-white/5' key={index}>
            {isLoading ? (
              <div className='flex items-center justify-center px-10 w-full h-8'>
                <Loading />
              </div>
            ) : metric.isCurrency ? (
              <DisplayCurrency
                coin={BNCoin.fromDenomAndBigNumber(ORACLE_DENOM, metric.value)}
                options={metric.formatOptions}
              />
            ) : (
              <FormattedNumber
                amount={metric.value.toNumber()}
                options={metric.formatOptions}
                animate
              />
            )}
            <Text size='sm' className='pt-1 text-white/40'>
              {metric.label}
            </Text>
          </Card>
        )
      })}
    </div>
  )
}
