import React from 'react'
import AreaChartLoading from 'components/common/Chart/common/AreaChartLoading'
import ChartCardWrapper from 'components/common/Chart/common/ChartWrapper/ChartCardWrapper'
import ComposedChartBody from 'components/common/Chart/ComposedChart/ComposedChartBody'
interface Props {
  data: MergedChartData[]
  title: string | React.ReactNode
  loading?: boolean
  config: ChartConfig
  height?: string
  timeframe?: string
}

export default function ComposedChart(props: Props) {
  const { data, loading, config, height, title, timeframe } = props

  return (
    <ChartCardWrapper title={title}>
      {data === null || loading ? (
        <AreaChartLoading />
      ) : (
        <ComposedChartBody data={data} config={config} height={height} timeframe={timeframe} />
      )}
    </ChartCardWrapper>
  )
}
