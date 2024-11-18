import AreaChartLoading from 'components/common/Chart/common/AreaChartLoading'
import ChartCardWrapper from 'components/common/Chart/common/ChartWrapper/ChartCardWrapper'
import MultipleAxisChartBody from 'components/common/Chart/MultipleAxisChart/MultipleAxisChartBody'

interface SeriesConfig {
  type: 'bar' | 'line'
  dataKey: string
  name: string
  color: string
  isPercentage?: boolean
}

interface AxisConfig {
  series: SeriesConfig[]
}

interface Props {
  data: MergedChartData[]
  title: string | React.ReactNode
  loading?: boolean
  primaryAxis: AxisConfig
  secondaryAxis: AxisConfig
  height?: string
}

export default function MultipleAxisChart(props: Props) {
  const { data, loading, height = 'h-65', title, primaryAxis, secondaryAxis } = props

  return (
    <ChartCardWrapper title={title}>
      {data === null || loading ? (
        <AreaChartLoading height={height} />
      ) : (
        <MultipleAxisChartBody
          data={data}
          primaryAxis={primaryAxis}
          secondaryAxis={secondaryAxis}
          height={height}
        />
      )}
    </ChartCardWrapper>
  )
}
