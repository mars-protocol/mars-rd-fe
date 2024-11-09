import { Circle } from 'components/common/Icons'
import Text from 'components/common/Text'

interface LegendEntry {
  inactive: boolean
  dataKey: string
  type: string
  color: string
  value: string
}

interface Props {
  payload: LegendEntry[]
}

export default function ChartLegend(props: Props) {
  const { payload } = props

  return (
    <div className='flex justify-center sm:justify-end sm:mr-7'>
      {payload.map((entry: LegendEntry, index: number) => (
        <div className='flex items-center' key={`item-${index}`}>
          <Circle className='fill-current h-2 w-2' color={entry.color} />
          <Text size='xs' className='mx-2'>
            {entry.value}
          </Text>
        </div>
      ))}
    </div>
  )
}
