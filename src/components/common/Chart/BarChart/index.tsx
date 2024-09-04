import BarChartBody from 'components/common/Chart/BarChart/BarChartBody'
import BarChartLoading from 'components/common/Chart/BarChart/BarChartLoading'

interface Props {
  data: BarChartData | null
  height?: string
  loading?: boolean
  dataKeys: { [key: string]: string }
}

export default function BarChart(props: Props) {
  const { data, loading, height, dataKeys } = props
  return (
    <div className='w-full'>
      {data === null || loading ? (
        <BarChartLoading height={height} />
      ) : (
        <BarChartBody height={height} data={data} dataKeys={dataKeys} />
      )}
    </div>
  )
}
