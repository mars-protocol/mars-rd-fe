import classNames from 'classnames'
import Card from 'components/common/Card'
import AreaChartBody from 'components/common/Chart/AreaChart/AreaChartBody'
import AreaChartLoading from 'components/common/Chart/AreaChart/AreaChartLoading'

interface Props {
  data: ChartData | null
  title?: string
  height?: string
  className?: string
  loading?: boolean
}

export default function AreaChart(props: Props) {
  const { data, loading, height, title, className } = props
  return (
    <Card className={classNames('w-full', className)} title={title} contentClassName='px-3 py-3'>
      {data === null || loading ? (
        <AreaChartLoading height={height} />
      ) : (
        <AreaChartBody height={height} data={data} />
      )}
    </Card>
  )
}
