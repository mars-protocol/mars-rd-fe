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
        // TODO: Replace with actual data
        {
          value: BN(121422433),
          label: 'Volume',
          isCurrency: true,
          formatOptions: {
            maxDecimals: 0,
            thousandSeparator: false,
            abbreviated: true,
          },
        },
        {
          value: BN(43303485),
          label: 'Unique Wallets',
          formatOptions: {
            maxDecimals: 0,
            thousandSeparator: false,
            abbreviated: true,
          },
        },
        {
          value: BN(539093),
          label: 'Treasury',
          isCurrency: true,
          formatOptions: {
            maxDecimals: 0,
            thousandSeparator: false,
            abbreviated: true,
          },
        },
      ]}
      className='w-full gap-5 mx-auto sm:gap-10 md:gap-18 sm:p-10'
      numberClassName='text-2xl md:text-5xl'
    />
  )
}
