import Card from 'components/common/Card'
import SynchronizedAreaChartBody from 'components/common/Chart/SynchronizedAreaChart/SynchronizedAreaChartBody'
import SynchronizedAreaChartLoading from 'components/common/Chart/SynchronizedAreaChart/SynchronizedAreaChartLoading'
import Text from 'components/common/Text'
import TimeframeSelector from 'components/common/Chart/common/SelectionControlPanel/TimeframeSelector'
import { TIMEFRAME } from 'constants/timeframe'
import React, { useState } from 'react'

interface Props {
  data: MergedChartData[]
  title: string | React.ReactNode
  loading?: boolean
  dataKey1: string
  dataKey2: string
}

export default function SynchronizedAreaChart(props: Props) {
  const { data, loading, title, dataKey1, dataKey2 } = props
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>(TIMEFRAME[0])

  return (
    <Card
      className='w-full h-full bg-black/10'
      contentClassName='px-3 pb-2 flex items-center justify-center'
      title={
        <div className='px-4 flex items-center justify-between font-semibold bg-white/10'>
          <Text size='sm'>{title}</Text>
          <TimeframeSelector
            timeframe={TIMEFRAME}
            selectedTimeframe={selectedTimeframe}
            setSelectedTimeframe={setSelectedTimeframe}
            size='xs'
          />
        </div>
      }
    >
      {data === null || loading ? (
        <SynchronizedAreaChartLoading />
      ) : (
        <SynchronizedAreaChartBody data={data} dataKey1={dataKey1} dataKey2={dataKey2} />
      )}
    </Card>
  )
}
