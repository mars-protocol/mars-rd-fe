import classNames from 'classnames'
import ChartLegend from 'components/common/Chart/common/Legend/ChartLegend'
import ChartTooltip from 'components/common/Chart/common/Tooltip/ChartTooltip'
import { FormattedNumber } from 'components/common/FormattedNumber'
import { Circle } from 'components/common/Icons'
import Text from 'components/common/Text'
import { DEFAULT_SETTINGS } from 'constants/defaultSettings'
import { LocalStorageKeys } from 'constants/localStorageKeys'
import { PRICE_ORACLE_DECIMALS } from 'constants/query'
import useLocalStorage from 'hooks/localStorage/useLocalStorage'
import moment from 'moment'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatValue } from 'utils/formatters'
import { BN } from 'utils/helpers'

interface Props {
  data: MergedChartData[]
  lines: LineConfig[]
  height?: string
  customYAxisDomain?: (values: number[]) => [number, number]
  timeframe?: string
  baselineLeft?: number
  baselineRight?: number
  leftDomainFn?: (values: number[]) => [number, number]
  rightDomainFn?: (values: number[]) => [number, number]
}

const TooltipContent = ({
  payload,
  lines,
}: {
  payload: ChartDataPayloadProps[]
  lines: LineConfig[]
}) => {
  const uniqueEntries = new Map()

  return (
    <div className='flex flex-col gap-1 py-2'>
      {payload.map((item, index) => {
        const lineConfig = lines.find((line) => line.dataKey === item.dataKey)

        if (uniqueEntries.has(item.name)) {
          return null
        }
        uniqueEntries.set(item.name, true)

        const value = typeof item.value === 'string' ? parseFloat(item.value) : item.value

        return (
          <div key={index} className='flex gap-1 items-center'>
            <Circle className='w-2 h-2 fill-current' color={item.color} />
            <Text size='xs'>{item.name}: </Text>
            {lineConfig?.isPercentage ? (
              <FormattedNumber
                amount={value}
                options={{ maxDecimals: 2, minDecimals: 0, suffix: '%' }}
                className='text-xs'
              />
            ) : lineConfig?.isUSD ? (
              <FormattedNumber
                amount={(lineConfig?.isNormalized
                  ? BN(value)
                  : BN(value).shiftedBy(-PRICE_ORACLE_DECIMALS)
                ).toNumber()}
                options={{ maxDecimals: 2, minDecimals: 2, abbreviated: true, prefix: '$' }}
                className='text-xs'
              />
            ) : (
              <FormattedNumber
                amount={value}
                options={{ maxDecimals: 0, minDecimals: 0, thousandSeparator: true }}
                className='text-xs'
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function DynamicLineChartBody(props: Props) {
  const {
    data,
    lines,
    height = 'h-65',
    customYAxisDomain,
    timeframe = '',
    baselineLeft,
    baselineRight,
    leftDomainFn,
    rightDomainFn,
  } = props
  const [reduceMotion] = useLocalStorage<boolean>(
    LocalStorageKeys.REDUCE_MOTION,
    DEFAULT_SETTINGS.reduceMotion,
  )
  const reversedData = [...data].reverse()

  // domain setting for large percentage values and custom domains
  const getYAxisDomain = () => {
    const extractValues = () =>
      reversedData
        .map((item) =>
          lines.map((line) => {
            const value = item[line.dataKey]
            return typeof value === 'string' ? parseFloat(value) : (value as number)
          }),
        )
        .flat()

    // if customYAxisDomain is a function
    if (typeof customYAxisDomain === 'function') {
      return customYAxisDomain(extractValues())
    }

    // Default percentage handling only
    if (!lines[0]?.isPercentage) return undefined

    const values = extractValues()
    const maxValue = Math.max(...values)
    const minValue = Math.min(...values)

    // Add 10% padding to the domain y-axis without forcing zero
    const padding = (maxValue - minValue) * 0.1
    return [minValue - padding, maxValue + padding]
  }

  // Build domains per axis when provided
  const leftValues = reversedData
    .map((item) =>
      lines
        .filter((l) => (l.yAxisId ?? 'left') === 'left')
        .map((l) =>
          typeof item[l.dataKey] === 'string'
            ? parseFloat(item[l.dataKey] as string)
            : (item[l.dataKey] as number),
        ),
    )
    .flat()
  const rightValues = reversedData
    .map((item) =>
      lines
        .filter((l) => l.yAxisId === 'right')
        .map((l) =>
          typeof item[l.dataKey] === 'string'
            ? parseFloat(item[l.dataKey] as string)
            : (item[l.dataKey] as number),
        ),
    )
    .flat()
  const leftDomain = leftDomainFn && leftValues.length ? leftDomainFn(leftValues) : undefined
  const rightDomain = rightDomainFn && rightValues.length ? rightDomainFn(rightValues) : undefined

  return (
    <div className={classNames('-ml-2', height)}>
      <ResponsiveContainer width='100%' height='100%'>
        <AreaChart
          data={reversedData}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            {lines.map((lineConfig, index) => (
              <linearGradient
                id={`gradient-${lineConfig.color}`}
                x1='0'
                y1='0'
                x2='0'
                y2='1'
                key={`gradient-${index}`}
              >
                <stop offset='0%' stopColor={lineConfig.color} stopOpacity={0.2} />
                <stop offset='100%' stopColor={lineConfig.color} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>

          {lines.map((lineConfig, index) => (
            <Area
              key={index}
              type='monotone'
              dataKey={lineConfig.dataKey}
              stroke={lineConfig.color}
              fill={`url(#gradient-${lineConfig.color})`}
              name={lineConfig.name}
              dot={false}
              strokeWidth={2}
              isAnimationActive={!reduceMotion}
              strokeDasharray={lineConfig.strokeDasharray}
              yAxisId={lineConfig.yAxisId ?? 'left'}
            />
          ))}

          <XAxis
            axisLine={false}
            tickLine={false}
            fontSize={10}
            padding={{ left: 5, right: 10 }}
            dataKey='date'
            dy={10}
            stroke='rgba(255, 255, 255, 0.4)'
            tickFormatter={(value) => {
              if (timeframe === '24') {
                return moment(value).format('HH:mm')
              }
              return moment(value).format('DD MMM')
            }}
            interval={reversedData.length > 10 ? Math.floor(reversedData.length / 7) : 0}
          />
          <YAxis
            yAxisId='left'
            axisLine={false}
            tickLine={false}
            fontSize={8}
            tickCount={8}
            stroke='rgba(255, 255, 255, 0.4)'
            domain={leftDomain ?? getYAxisDomain()}
            tickFormatter={(value) => {
              if (lines[0]?.isPercentage) {
                return formatValue(value, {
                  minDecimals: 0,
                  maxDecimals: 0,
                  suffix: '%',
                })
              }
              // Check if any left axis line is USD
              const hasUSDOnLeft = lines.some(
                (line) => (line.yAxisId ?? 'left') === 'left' && line.isUSD,
              )
              if (hasUSDOnLeft) {
                const hasNormalizedData = lines.some(
                  (line) => (line.yAxisId ?? 'left') === 'left' && line.isUSD && line.isNormalized,
                )
                const adjustedValue = hasNormalizedData
                  ? value
                  : BN(value).shiftedBy(-PRICE_ORACLE_DECIMALS).toNumber()
                return formatValue(adjustedValue, {
                  minDecimals: 0,
                  maxDecimals: 2,
                  prefix: '$',
                  abbreviated: true,
                })
              }
              return formatValue(value, {
                minDecimals: 0,
                maxDecimals: 0,
                thousandSeparator: true,
                abbreviated: true,
              })
            }}
          />
          {lines.some((l) => l.yAxisId === 'right') && (
            <YAxis
              yAxisId='right'
              orientation='right'
              axisLine={false}
              tickLine={false}
              fontSize={8}
              tickCount={8}
              stroke='rgba(255, 255, 255, 0.4)'
              domain={rightDomain}
              tickFormatter={(value) => {
                // Check if any right axis line is USD
                const hasUSDOnRight = lines.some((line) => line.yAxisId === 'right' && line.isUSD)
                if (hasUSDOnRight) {
                  const hasNormalizedData = lines.some(
                    (line) => line.yAxisId === 'right' && line.isUSD && line.isNormalized,
                  )
                  const adjustedValue = hasNormalizedData
                    ? value
                    : BN(value).shiftedBy(-PRICE_ORACLE_DECIMALS).toNumber()
                  return formatValue(adjustedValue, {
                    minDecimals: 0,
                    maxDecimals: 2,
                    prefix: '$',
                    abbreviated: true,
                  })
                }
                return formatValue(value, {
                  minDecimals: 0,
                  maxDecimals: 2,
                  prefix: '$',
                  abbreviated: true,
                })
              }}
            />
          )}

          <Tooltip
            content={
              <ChartTooltip
                active={false}
                payload={[]}
                label={''}
                renderContent={(payload) => <TooltipContent payload={payload} lines={lines} />}
              />
            }
          />
          <Legend content={<ChartLegend payload={[]} data={reversedData} />} verticalAlign='top' />

          <CartesianGrid opacity={0.1} vertical={false} />
          {typeof baselineLeft === 'number' ? (
            <ReferenceLine
              y={baselineLeft}
              yAxisId='left'
              stroke='rgba(255, 255, 255, 0.2)'
              strokeWidth={2}
            />
          ) : (
            <ReferenceLine y={0} yAxisId='left' stroke='rgba(255, 255, 255, 0.2)' strokeWidth={2} />
          )}
          {lines.some((l) => l.yAxisId === 'right') &&
            (typeof baselineRight === 'number' ? (
              <ReferenceLine
                y={baselineRight}
                yAxisId='right'
                stroke='rgba(255, 255, 255, 0.2)'
                strokeWidth={2}
              />
            ) : null)}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
