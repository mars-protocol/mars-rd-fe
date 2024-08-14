import classNames from 'classnames'
import Card from 'components/common/Card'
import ChartBody from 'components/common/Chart/ChartBody'
import ChartLoading from 'components/common/Chart/ChartLoading'
import BarChartBody from './BarChartBody'
import BarChartLoading from './BarChartLoading'

interface Props {
  data: BarChartData
  title?: string
  height?: string
  className?: string
  loading?: boolean
  dataKeys: { [key: string]: string }
}

export default function Chart(props: Props) {
  const { data, loading, height, title, className, dataKeys } = props
  return (
    <>
      {data === null || loading ? (
        <BarChartLoading height={height} />
      ) : (
        <BarChartBody height={height} data={data} dataKeys={dataKeys} />
      )}
    </>
  )
}
