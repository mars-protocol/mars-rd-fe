import Card from 'components/common/Card'
import BarChartBody from 'components/common/Chart/BarChart/BarChartBody'
import BarChartLoading from 'components/common/Chart/BarChart/BarChartLoading'
import Text from 'components/common/Text'
import TimeframeSelector from 'components/common/Chart/common/SelectionControlPanel/TimeframeSelector'
import { TIMEFRAME } from 'constants/timeframe'
import { useState } from 'react'

interface SeriesConfig {
  key: string
  dataKey: string
  displayName: string
  color: string
  isPercentage?: boolean
}

interface Props {
  data: MergedChartData[]
  height?: number
  loading?: boolean
  series: SeriesConfig[]
  stacked?: boolean
  title: string | React.ReactNode
}

export default function BarChart(props: Props) {
  const { data, title, loading, height = 400, series, stacked } = props
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>(TIMEFRAME[2])

  return (
    <Card
      className='w-full bg-black/10'
      contentClassName='px-3 pb-2'
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
        <BarChartLoading height={height} />
      ) : (
        <BarChartBody data={data} height={height} series={series} stacked={stacked} />
      )}
    </Card>
  )
}
