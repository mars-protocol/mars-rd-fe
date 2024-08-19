import ChartLegend from 'components/common/Chart/Legend/ChartLegend'
import ChartTooltip from 'components/common/Chart/Tooltip/ChartTooltip'
import moment from 'moment'
import Text from 'components/common/Text'
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
import { formatValue } from 'utils/formatters'

interface Props {
  selectedOption: string
  selectedTimeframe: string
  options: { value: string; label: string }[]
  data: DummyData
}

function TooltipContent(payload: ChartDataPayloadProps[]) {
  const value = payload[0].value ?? 0
  const value2 = payload[1].value ?? 0

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

export default function DuoLineChart(props: Props) {
  const { selectedOption, selectedTimeframe, options, data } = props
  const dummyData = data[selectedOption][selectedTimeframe]

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
            tickCount={7}
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
              <ChartTooltip active={false} payload={[]} label={''} renderContent={TooltipContent} />
            }
          />

          <Legend content={<ChartLegend payload={[]} />} verticalAlign='bottom' />

          <CartesianGrid opacity={0.1} vertical={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
