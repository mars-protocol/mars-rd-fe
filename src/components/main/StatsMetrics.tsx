import MetricsCard from 'components/common/Card/MetricsCard'
import { GridGlobe } from 'components/common/Icons'
import { BN } from 'utils/helpers'

export default function StatsMetrics() {
  return (
    <MetricsCard
      hideBackground={false}
      background={
        <div className='absolute right-0 top-0 md:w-[500px] transform scale-y-[-1]'>
          <GridGlobe />
        </div>
      }
      title='MARS PROTOCOL'
      copy='Explore the Mars Protocol Stats Dashboard to track key performance metrics.'
      metrics={[
        {
          value: BN(121422433),
          label: 'Volume',
          formatOptions: {
            prefix: '$',
            suffix: '+',
            maxDecimals: 0,
            thousandSeparator: false,
            abbreviated: true,
          },
        },
        {
          value: BN(433000),
          label: 'Transactions',
          formatOptions: {
            suffix: '+',
            maxDecimals: 0,
            thousandSeparator: false,
            abbreviated: true,
          },
        },
        {
          value: BN(43303485),
          label: 'Unique Wallets',
          formatOptions: {
            suffix: '+',
            maxDecimals: 0,
            thousandSeparator: false,
            abbreviated: true,
          },
        },
        {
          value: BN(539093),
          label: 'Treasury',
          formatOptions: {
            prefix: '$',
            suffix: '+',
            maxDecimals: 0,
            thousandSeparator: false,
            abbreviated: true,
          },
        },
      ]}
      className='sm:p-10 gap-5 sm:gap-10 md:gap-18 w-full md:w-[1100px] mx-auto'
      formattedNumberClassName='text-2xl md:text-5xl'
    />
  )
}
