import ChartCardWrapper from 'components/common/Chart/common/ChartWrapper/ChartCardWrapper'
import SynchronizedAreaChartBody from 'components/common/Chart/SynchronizedAreaChart/SynchronizedAreaChartBody'
import SynchronizedAreaChartLoading from 'components/common/Chart/SynchronizedAreaChart/SynchronizedAreaChartLoading'
import React from 'react'

interface Props {
  data: MergedChartData[]
  title: string | React.ReactNode
  loading?: boolean
  dataKey1: string
  dataKey2: string
}

export default function SynchronizedAreaChart(props: Props) {
  const { data, loading, title, dataKey1, dataKey2 } = props

  return (
    <ChartCardWrapper title={title}>
      {data === null || loading ? (
        <SynchronizedAreaChartLoading />
      ) : (
        <SynchronizedAreaChartBody data={data} dataKey1={dataKey1} dataKey2={dataKey2} />
      )}
    </ChartCardWrapper>
  )
}
