import BarChartBody from 'components/common/Chart/BarChart/BarChartBody'
import BarChartLoading from 'components/common/Chart/BarChart/BarChartLoading'
import ChartCardWrapper from 'components/common/Chart/common/ChartWrapper/ChartCardWrapper'

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

  return (
    <ChartCardWrapper title={title}>
      {data === null || loading ? (
        <BarChartLoading height={height} />
      ) : (
        <BarChartBody data={data} height={height} series={series} stacked={stacked} />
      )}
    </ChartCardWrapper>
  )
}
