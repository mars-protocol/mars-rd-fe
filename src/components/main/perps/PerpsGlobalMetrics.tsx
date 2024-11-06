import MetricsCard from 'components/common/Card/MetricsCard'
import { GridGlobe } from 'components/common/Icons'
import { BN } from 'utils/helpers'

export default function PerpsGlobalMetrics() {
  return (
    <MetricsCard
      hideBackground={false}
      background={
        <div className='absolute right-0 top-0 md:w-[500px] transform scale-y-[-1]'>
          <GridGlobe />
        </div>
      }
      title='PERPS STATS'
      copy='Explore the Mars Protocol Perps Stats Dashboard to track key performance metrics.'
      metrics={[
        // TODO: Replace with actual data
        {
          value: BN(121422433),
          label: 'Weekly Trading Volume',
          isCurrency: true,
          formatOptions: {
            suffix: '+',
            maxDecimals: 0,
            thousandSeparator: false,
            abbreviated: true,
          },
        },
        {
          value: BN(433000),
          label: 'Active Users',
          formatOptions: {
            suffix: '+',
            maxDecimals: 0,
            thousandSeparator: false,
            abbreviated: true,
          },
        },
        {
          value: BN(43303485),
          label: 'Realized Pnl',
          formatOptions: {
            suffix: '+',
            maxDecimals: 0,
            thousandSeparator: false,
            abbreviated: true,
          },
        },
        {
          value: BN(539093),
          label: 'Unrealized Pnl',
          isCurrency: true,
          formatOptions: {
            suffix: '+',
            maxDecimals: 0,
            thousandSeparator: false,
            abbreviated: true,
          },
        },
      ]}
      className='w-full gap-5 sm:gap-10 md:gap-18 sm:p-10 mx-auto'
      numberClassName='text-2xl md:text-5xl'
    />
  )
}
