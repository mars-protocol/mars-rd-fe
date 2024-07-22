import classNames from 'classnames'
import Card from 'components/common/Card'
import BarChartBody from 'components/common/Chart/BarChart/BarChartBody'

interface Props {
  data: BarChartData
  title?: string
  height?: string
  className?: string
  dataKeys: { [key: string]: string }
}

export default function BarChart(props: Props) {
  const { data, title, height, className, dataKeys } = props
  return (
    <Card className={classNames('w-full', className)} title={title} contentClassName='px-2 py-5'>
      <BarChartBody height={height} data={data} dataKeys={dataKeys} />
    </Card>
  )
}
