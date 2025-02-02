import ChartCardWrapper from 'components/common/Chart/common/ChartWrapper/ChartCardWrapper'
import SynchronizedChartBody from 'components/common/Chart/SynchronizedChart/SynchronizedChartBody'
import SynchronizedChartLoading from 'components/common/Chart/SynchronizedChart/SynchronizedChartLoading'
import React from 'react'

interface ChartConfig {
  primaryChart: {
    bar: LineConfig
    line: LineConfig
  }
  secondaryChart: {
    bar: LineConfig
    line: LineConfig
  }
}
interface Props {
  data: MergedChartData[]
  title: string | React.ReactNode
  loading?: boolean
  config: ChartConfig
  timeframe?: string
}

export default function SynchronizedChart(props: Props) {
  const { data, loading, title, config, timeframe } = props

  return (
    <ChartCardWrapper title={title}>
      {data === null || loading ? (
        <SynchronizedChartLoading />
      ) : (
        <SynchronizedChartBody data={data} config={config} timeframe={timeframe} />
      )}
    </ChartCardWrapper>
  )
}
