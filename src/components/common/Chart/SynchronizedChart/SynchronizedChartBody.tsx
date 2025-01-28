import ChartTooltip from 'components/common/Chart/common/Tooltip/ChartTooltip'
import ChartLegend from 'components/common/Chart/common/Legend/ChartLegend'
import DisplayCurrency from 'components/common/DisplayCurrency'
import moment from 'moment'
import Text from 'components/common/Text'
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { BNCoin } from 'types/classes/BNCoin'
import { BN } from 'utils/helpers'
import { Circle } from 'components/common/Icons'
import { formatValue } from 'utils/formatters'
import { PRICE_ORACLE_DECIMALS } from 'constants/query'
import useLocalStorage from 'hooks/localStorage/useLocalStorage'
import { LocalStorageKeys } from 'constants/localStorageKeys'
import { DEFAULT_SETTINGS } from 'constants/defaultSettings'
interface ChartConfig {
  primaryChart: {
    bar: LineConfig
    line: LineConfig
  }
  secondaryChart: {
    bar: LineConfig
    line: LineConfig
  }
}
interface Props {
  data: MergedChartData[]
  config: ChartConfig
}

function TooltipContent(props: TooltipContentProps) {
  const { payload } = props

  if (!payload || !payload.length) return null

  return (
    <div className='flex flex-col gap-2 p-2 rounded'>
      {payload.map((entry, index) => {
        const amount = Number(entry.value) ?? 0
        const label = entry.name

        return (
          <div key={index} className='flex items-center gap-1'>
            <Circle className='fill-current h-2 w-2' color={entry.stroke || entry.fill} />
            <Text size='xs'>{label}: </Text>
            <DisplayCurrency
              coin={BNCoin.fromDenomAndBigNumber(
                'usd',
                BN(amount).shiftedBy(-PRICE_ORACLE_DECIMALS),
              )}
              options={{
                minDecimals: 0,
                maxDecimals: 2,
                abbreviated: true,
              }}
              className='text-xs'
              showSignPrefix
            />
          </div>
        )
      })}
    </div>
  )
}

export default function SynchronizedChartBody(props: Props) {
  const { data, config } = props
  const [reduceMotion] = useLocalStorage<boolean>(
    LocalStorageKeys.REDUCE_MOTION,
    DEFAULT_SETTINGS.reduceMotion,
  )
  const reversedData = [...data].reverse()

  const getYAxisDomain = (data: MergedChartData[]) => {
    const allValues = data.flatMap((item) => [
      Number(item[config.primaryChart.bar.dataKey]),
      Number(item[config.primaryChart.line.dataKey]),
      Number(item[config.secondaryChart.bar.dataKey]),
      Number(item[config.secondaryChart.line.dataKey]),
    ])

    const maxValue = Math.max(...allValues)
    const minValue = Math.min(...allValues)

    // Add 1% padding to ensure bars are visible
    const padding = (maxValue - minValue) * 0.01

    return [Math.min(0, minValue - padding), maxValue + padding]
  }

  return (
    <div className='-ml-4 w-full h-140'>
      <ResponsiveContainer width='100%' height='50%'>
        <ComposedChart
          data={reversedData}
          syncId='chart'
          margin={{
            top: 10,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id='chartGradient1' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='0%' stopColor={config.primaryChart.bar.color} stopOpacity={0.5} />
              <stop offset='100%' stopColor={config.primaryChart.bar.color} stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid opacity={0.1} vertical={false} />
          <ReferenceLine y={0} stroke='rgba(255, 255, 255, 0.2)' strokeWidth={2} />

          <XAxis
            stroke='rgba(255, 255, 255, 0.4)'
            axisLine={false}
            tickLine={false}
            fontSize={10}
            dataKey='date'
            dy={10}
            tickFormatter={(value) => {
              return moment(value).format('DD MMM')
            }}
            interval={reversedData.length > 10 ? Math.floor(reversedData.length / 7) : 0}
          />

          <YAxis
            stroke='rgba(255, 255, 255, 0.4)'
            axisLine={false}
            tickLine={false}
            fontSize={8}
            tickCount={6}
            domain={getYAxisDomain(reversedData)}
            tickFormatter={(value) => {
              const adjustedValue = BN(value).shiftedBy(-PRICE_ORACLE_DECIMALS).toNumber()
              return formatValue(adjustedValue, {
                minDecimals: 0,
                maxDecimals: 2,
                prefix: '$',
                abbreviated: true,
              })
            }}
          />

          <Tooltip
            cursor={false}
            content={
              <ChartTooltip
                payload={[]}
                label={''}
                renderContent={(payload) => <TooltipContent payload={payload} />}
              />
            }
          />
          <Legend content={<ChartLegend payload={[]} data={reversedData} />} verticalAlign='top' />
          <Bar
            dataKey={config.primaryChart.bar.dataKey}
            name={config.primaryChart.bar.name}
            fill='url(#chartGradient1)'
            stroke={config.primaryChart.bar.color}
            maxBarSize={24}
            isAnimationActive={!reduceMotion}
          />
          <Line
            type='monotone'
            dataKey={config.primaryChart.line.dataKey}
            name={config.primaryChart.line.name}
            stroke={config.primaryChart.line.color}
            strokeWidth={1}
            dot={false}
            isAnimationActive={!reduceMotion}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <ResponsiveContainer width='100%' height='50%'>
        <ComposedChart
          data={reversedData}
          syncId='chart'
          margin={{
            top: 10,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id='chartGradient2' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='0%' stopColor={config.secondaryChart.bar.color} stopOpacity={0.5} />
              <stop offset='100%' stopColor={config.secondaryChart.bar.color} stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid opacity={0.1} vertical={false} />
          <ReferenceLine y={0} stroke='rgba(255, 255, 255, 0.2)' strokeWidth={2} />

          <XAxis
            stroke='rgba(255, 255, 255, 0.4)'
            axisLine={false}
            tickLine={false}
            fontSize={10}
            dataKey='date'
            dy={10}
            tickFormatter={(value) => {
              return moment(value).format('DD MMM')
            }}
            interval={reversedData.length > 10 ? Math.floor(data.length / 7) : 0}
          />
          <YAxis
            stroke='rgba(255, 255, 255, 0.4)'
            axisLine={false}
            tickLine={false}
            fontSize={8}
            tickCount={6}
            domain={getYAxisDomain(reversedData)}
            tickFormatter={(value) => {
              const adjustedValue = BN(value).shiftedBy(-PRICE_ORACLE_DECIMALS).toNumber()
              return formatValue(adjustedValue, {
                minDecimals: 0,
                maxDecimals: 2,
                prefix: '$',
                abbreviated: true,
              })
            }}
          />

          <Tooltip
            cursor={false}
            content={
              <ChartTooltip
                payload={[]}
                label={''}
                renderContent={(payload) => <TooltipContent payload={payload} />}
              />
            }
          />

          <Legend content={<ChartLegend payload={[]} />} verticalAlign='top' />

          <Bar
            dataKey={config.secondaryChart.bar.dataKey}
            name={config.secondaryChart.bar.name}
            fill='url(#chartGradient2)'
            stroke={config.secondaryChart.bar.color}
            maxBarSize={24}
            isAnimationActive={!reduceMotion}
          />
          <Line
            type='monotone'
            dataKey={config.secondaryChart.line.dataKey}
            name={config.secondaryChart.line.name}
            stroke={config.secondaryChart.line.color}
            strokeWidth={1}
            dot={false}
            isAnimationActive={!reduceMotion}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
