import { Circle } from 'components/common/Icons'
import Text from 'components/common/Text'

interface LegendEntry {
  inactive: boolean
  dataKey: string
  type: string
  color: string
  value: string
  payload: {
    stroke: string
    fill?: string
    legendType: string
    name: string
    dataKey: string
    [key: string]: any
  }
}

interface Props {
  payload: LegendEntry[]
}

export default function ChartLegend(props: Props) {
  const { payload } = props

  return (
    <div className='flex justify-center sm:justify-end'>
      {payload.map((entry, index) => (
        <div className='flex items-center' key={`item-${index}`}>
          <Circle className='fill-current h-2 w-2' color={entry.payload.stroke} />
          <Text size='xs' className='mx-2'>
            {entry.value}
          </Text>
        </div>
      ))}
    </div>
  )
}
