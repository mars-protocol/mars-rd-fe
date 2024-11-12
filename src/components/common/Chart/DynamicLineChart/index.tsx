import Card from 'components/common/Card'
import DynamicLineChartBody from 'components/common/Chart/DynamicLineChart/DynamicLineChartBody'
import Text from 'components/common/Text'
import { TIMEFRAME } from 'constants/timeframe'
import { useState } from 'react'
import TimeframeSelector from 'components/common/Chart/common/SelectionControlPanel/TimeframeSelector'

interface LineConfig {
  dataKey: string
  color: string
  name: string
}

interface Props {
  data: MergedChartData[]
  title: string | React.ReactNode
  lines: LineConfig[]
  height?: number
}

export default function DynamicLineChart(props: Props) {
  const { data, lines, height, title } = props
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>(TIMEFRAME[0])

  return (
    <Card
      className='w-full bg-black/10'
      contentClassName='px-3 pb-2'
      title={
        <div className='px-4 flex items-center justify-between font-semibold bg-white/10'>
          <Text size='sm' className=''>
            {title}
          </Text>
          <TimeframeSelector
            timeframe={TIMEFRAME}
            selectedTimeframe={selectedTimeframe}
            setSelectedTimeframe={setSelectedTimeframe}
            size='xs'
          />
        </div>
      }
    >
      {/* {data === null || loading ? (
        <DynamicLineChartLoading height={height} />
      ) : ( */}
      <DynamicLineChartBody data={data} lines={lines} height={height} />
      {/* )} */}
    </Card>
  )
}
