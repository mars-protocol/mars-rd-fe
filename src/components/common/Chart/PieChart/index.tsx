import AreaChartLoading from 'components/common/Chart/common/AreaChartLoading'
import ChartCardWrapper from 'components/common/Chart/common/ChartWrapper/ChartCardWrapper'
import PieChartBody from 'components/common/Chart/PieChart/PieChartBody'

interface PieChartData {
  name: string
  value: number
  color: string
}

interface Props {
  data: PieChartData[]
  title: string | React.ReactNode
  loading?: boolean
  height?: string
}

export default function PieChart(props: Props) {
  const { data, loading, height = 'h-80', title } = props

  return (
    <ChartCardWrapper title={title}>
      {!data.length || loading ? (
        <AreaChartLoading height={height} />
      ) : (
        <PieChartBody data={data} height={height} />
      )}
    </ChartCardWrapper>
  )
}
