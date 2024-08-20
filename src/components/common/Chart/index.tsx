import classNames from 'classnames'
import Card from 'components/common/Card'
import ChartBody from 'components/common/Chart/ChartBody'
import ChartLoading from 'components/common/Chart/ChartLoading'

interface Props {
  data: ChartData | null
  title?: string
  height?: string
  className?: string
  loading?: boolean
}

export default function Chart(props: Props) {
  const { data, loading, height, title, className } = props
  return (
    <Card className={classNames('w-full', className)} title={title} contentClassName='px-3 py-3'>
      {data === null || loading ? (
        <ChartLoading height={height} />
      ) : (
        <ChartBody height={height} data={data} />
      )}
    </Card>
  )
}
