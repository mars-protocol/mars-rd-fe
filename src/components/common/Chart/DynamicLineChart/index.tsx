import AreaChartLoading from 'components/common/Chart/common/AreaChartLoading'
import ChartCardWrapper from 'components/common/Chart/common/ChartWrapper/ChartCardWrapper'
import DynamicLineChartBody from 'components/common/Chart/DynamicLineChart/DynamicLineChartBody'

interface LineConfig {
  dataKey: string
  color: string
  name: string
  isPercentage?: boolean
}

interface Props {
  data: MergedChartData[]
  title: string | React.ReactNode
  loading?: boolean
  lines: LineConfig[]
  height?: string
}

export default function DynamicLineChart(props: Props) {
  const { data, loading, lines, height = 'h-65', title } = props

  return (
    <ChartCardWrapper title={title}>
      {data === null || loading ? (
        <AreaChartLoading height={height} />
      ) : (
        <DynamicLineChartBody data={data} lines={lines} height={height} />
      )}
    </ChartCardWrapper>
  )
}
