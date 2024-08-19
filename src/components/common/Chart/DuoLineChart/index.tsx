import BigNumber from 'bignumber.js'
import ChartLegend from 'components/common/Chart/Legend/ChartLegend'
import ChartTooltip from 'components/common/Chart/Tooltip/ChartTooltip'
import DisplayCurrency from 'components/common/DisplayCurrency'
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
import { BNCoin } from 'types/classes/BNCoin'
import { ORACLE_DENOM } from 'constants/oracle'

interface Props {
  selectedOption: string
  selectedTimeframe: string
  options: { value: string; label: string }[]
  data: DummyData
}

function TooltipContent(payload: ChartDataPayloadProps[]) {
  const amountOne = payload[0].value ?? 0
  const amountTwo = payload[1].value ?? 0

  const valueOne = BNCoin.fromDenomAndBigNumber(ORACLE_DENOM, new BigNumber(amountOne))
  const valueTwo = BNCoin.fromDenomAndBigNumber(ORACLE_DENOM, new BigNumber(amountTwo))

  return (
    <>
      <div className='flex space-x-1'>
        <Text size='xs'>{payload[0].name}: </Text>
        <DisplayCurrency coin={valueOne} className='text-xs' />
      </div>

      <div className='flex space-x-1'>
        <Text size='xs'>{payload[1].name}: </Text>
        <DisplayCurrency coin={valueTwo} className='text-xs' />
      </div>
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
