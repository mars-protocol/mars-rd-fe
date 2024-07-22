import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Circle } from 'components/common/Icons'
import CustomTooltip from 'components/common/Chart/Tooltip/CustomTooltip'
import moment from 'moment'
import Text from 'components/common/Text'
import { formatValue } from 'utils/formatters'

interface Props {
  selectedOption: string
  selectedTimeframe: string
  options: { value: string; label: string }[]
  data: DummyData
}

interface LegendEntry {
  inactive: boolean
  dataKey: string
  type: string
  color: string
  value: string
}

interface RenderLegendProps {
  payload: LegendEntry[]
}

export default function DuoLineChart(props: Props) {
  const { selectedOption, selectedTimeframe, options, data } = props
  const dummyData = data[selectedOption][selectedTimeframe]

  const renderTooltipContent = (payload: ChartDataPayloadProps[]) => {
    const value = Number(payload[0].value) ?? 0
    const value2 = Number(payload[1].value) ?? 0
    return (
      <>
        <Text size='sm'>
          {payload[0].name}: {formatValue(value, { minDecimals: 0, maxDecimals: 0, prefix: '$' })}
        </Text>

        <Text size='sm'>
          {payload[1].name}: {formatValue(value2, { minDecimals: 0, maxDecimals: 0, prefix: '$' })}
        </Text>
      </>
    )
  }
  return (
    <div className='-mr-6'>
      <ResponsiveContainer width='100%' height={400}>
        <LineChart data={dummyData}>
          <Line
            type='monotone'
            dataKey='value'
            stroke='#AB47BC'
            name={options.find((o) => o.value === selectedOption)?.label.split('/')[0]}
            dot={false}
          />
          <Line
            type='monotone'
            dataKey='value2'
            stroke='#8884d8'
            name={options.find((o) => o.value === selectedOption)?.label.split('/')[1]}
            dot={false}
          />
          <XAxis
            stroke='rgba(255, 255, 255, 0.3)'
            tickLine={false}
            tickFormatter={(value) => {
              return moment(value).format('DD MMM')
            }}
            fontSize={12}
            dataKey='date'
          />
          <YAxis
            stroke='rgba(255, 255, 255, 0.3)'
            axisLine={false}
            tickLine={false}
            tickCount={6}
            padding={{ top: 20 }}
            orientation='right'
            fontSize={12}
            tickFormatter={(value) => {
              return formatValue(value, {
                minDecimals: 0,
                maxDecimals: 0,
                prefix: '$',
                abbreviated: true,
              })
            }}
          />

          <Tooltip
            content={
              <CustomTooltip
                active={false}
                payload={[]}
                label={''}
                renderContent={renderTooltipContent}
              />
            }
          />

          <Legend content={<RenderLegend payload={[]} />} verticalAlign='bottom' />

          <CartesianGrid opacity={0.1} vertical={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function RenderLegend(props: RenderLegendProps) {
  const { payload } = props
  const colors = ['#AB47BC', '#8884d8']
  return (
    <div className='flex justify-center sm:justify-end sm:mr-7'>
      {payload.map((entry: LegendEntry, index: number) => (
        <div className='flex items-center' key={`item-${index}`}>
          <Circle className='fill-current h-2 w-2' color={colors[index]} />
          <Text size='xs' className='mx-2'>
            {entry.value}
          </Text>
        </div>
      ))}
    </div>
  )
}
