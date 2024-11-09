import classNames from 'classnames'
import Card from 'components/common/Card'
import DynamicLineChartBody from './DynamicLineChartBody'
import Text from 'components/common/Text'

// Define types for our props
interface LineConfig {
  dataKey: string
  color: string
  name: string
}

interface Props {
  data: any[]
  lines: LineConfig[]
  height?: number
  width?: string
}

export default function DynamicLineChart(props: Props) {
  const { data, lines, height, width } = props
  return (
    <Card className={classNames('w-full bg-white/5')} contentClassName='px-3 py-3'>
      {/* {data === null || loading ? (
        <DynamicLineChartLoading height={height} />
      ) : ( */}
      <Text size='sm' className='text-white text-center'>
        Open Interest
      </Text>
      <DynamicLineChartBody data={data} lines={lines} height={height} width={width} />
      {/* )} */}
    </Card>
  )
}
