import AreaChartLoading from 'components/common/Chart/common/AreaChartLoading'
import ChartCardWrapper from 'components/common/Chart/common/ChartWrapper/ChartCardWrapper'
import ComposedChartBody from 'components/common/Chart/ComposedChart/ComposedChartBody'
import React from 'react'
interface Props {
  data: MergedChartData[]
  title: string | React.ReactNode
  loading?: boolean
  config: ChartConfig
  height?: string
  timeframe?: string
  requiresOracleAdjustment?: boolean
}

export default function ComposedChart(props: Props) {
  const { data, loading, config, height, title, timeframe, requiresOracleAdjustment } = props

  return (
    <ChartCardWrapper title={title}>
      {data === null || loading ? (
        <AreaChartLoading />
      ) : (
        <ComposedChartBody
          data={data}
          config={config}
          height={height}
          timeframe={timeframe}
          requiresOracleAdjustment={requiresOracleAdjustment}
        />
      )}
    </ChartCardWrapper>
  )
}
