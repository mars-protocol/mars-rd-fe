import ChartTooltip from 'components/common/Chart/common/Tooltip/ChartTooltip'
import ChartLegend from 'components/common/Chart/common/Legend/ChartLegend'
import DisplayCurrency from 'components/common/DisplayCurrency'
import moment from 'moment'
import Text from 'components/common/Text'
import useLocalStorage from 'hooks/localStorage/useLocalStorage'
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { BNCoin } from 'types/classes/BNCoin'
import { BN } from 'utils/helpers'
import { Circle } from 'components/common/Icons'
import { DEFAULT_SETTINGS } from 'constants/defaultSettings'
import { formatValue } from 'utils/formatters'
import { LocalStorageKeys } from 'constants/localStorageKeys'
import { PRICE_ORACLE_DECIMALS } from 'constants/query'
import classNames from 'classnames'
import { FormattedNumber } from 'components/common/FormattedNumber'

interface Props {
  data: MergedChartData[]
  config: ChartConfig
  height?: string
}

function TooltipContent(props: TooltipContentProps) {
  const { payload, config } = props

  if (!payload || !payload.length) return null

  return (
    <div className='flex flex-col gap-2 p-2 rounded'>
      {payload.map((entry, index) => {
        const seriesConfig = [...(config?.primary || []), ...(config?.secondary || [])].find(
          (s) => s.dataKey === entry.dataKey,
        )
        const amount = Number(entry.value) ?? 0
        const label = entry.name

        return (
          <div key={index} className='flex items-center gap-1'>
            <Circle className='fill-current h-2 w-2' color={entry.stroke || entry.fill} />
            <Text size='xs'>{label}: </Text>
            {seriesConfig?.isPercentage ? (
              <FormattedNumber
                amount={amount * 100}
                options={{
                  minDecimals: 0,
                  maxDecimals: 0,
                  suffix: '%',
                }}
                animate
                className='text-xs'
              />
            ) : (
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
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function ComposedChartBody(props: Props) {
  const { data, config, height } = props
  const [reduceMotion] = useLocalStorage<boolean>(
    LocalStorageKeys.REDUCE_MOTION,
    DEFAULT_SETTINGS.reduceMotion,
  )

  const reversedData = [...data].reverse()
  const hasSecondaryAxis = config.secondary && config.secondary.length > 0

  return (
    <div className={classNames('w-full', height, hasSecondaryAxis ? 'ml-1' : '-ml-2')}>
      <ResponsiveContainer width='100%' height='100%'>
        <ComposedChart
          data={reversedData}
          margin={{
            top: 10,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          {config.bars && (
            <defs>
              {config.bars.map((bar, index) => (
                <linearGradient
                  key={`gradient-${index}`}
                  id={`gradient-${index}`}
                  x1='0'
                  y1='0'
                  x2='0'
                  y2='1'
                >
                  <stop offset='0%' stopColor={bar.color} stopOpacity={0.6} />
                  <stop offset='100%' stopColor={bar.color} stopOpacity={0.1} />
                </linearGradient>
              ))}
            </defs>
          )}

          <CartesianGrid strokeDasharray='6 3' opacity={0.1} vertical={false} />

          <XAxis
            dataKey='date'
            stroke='rgba(255, 255, 255, 0.4)'
            tickFormatter={(value) => moment(value).format('DD MMM')}
            axisLine={false}
            tickLine={false}
            fontSize={10}
            dy={10}
          />

          {/* Primary Y-axis */}
          <YAxis
            yAxisId='left'
            axisLine={false}
            tickLine={false}
            fontSize={10}
            tickCount={8}
            stroke='rgba(255, 255, 255, 0.4)'
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

          {/* Secondary Y-axis for percentages */}
          {hasSecondaryAxis && (
            <YAxis
              yAxisId='right'
              orientation='right'
              axisLine={false}
              tickLine={false}
              fontSize={10}
              tickCount={8}
              stroke='rgba(255, 255, 255, 0.4)'
              tickFormatter={(value) =>
                formatValue(value * 100, {
                  minDecimals: 0,
                  maxDecimals: 0,
                  suffix: '%',
                })
              }
            />
          )}

          <Tooltip
            cursor={{ stroke: 'rgba(255, 255, 255, 0.1)', strokeWidth: 2 }}
            content={
              <ChartTooltip
                payload={[]}
                label={''}
                renderContent={(payload) => <TooltipContent payload={payload} config={config} />}
              />
            }
          />

          <Legend content={<ChartLegend payload={[]} />} verticalAlign='top' />

          {config.bars?.map((bar, index) => (
            <Bar
              key={bar.dataKey}
              yAxisId='left'
              dataKey={bar.dataKey}
              name={bar.name}
              stackId='positions'
              fill={`url(#gradient-${index})`}
              stroke={bar.color}
              maxBarSize={24}
            />
          ))}

          {config.line && (
            <Line
              yAxisId='left'
              type='monotone'
              dataKey={config.line.dataKey}
              name={config.line.name}
              stroke={config.line.color}
              strokeWidth={2}
              dot={false}
              isAnimationActive={!reduceMotion}
            />
          )}

          {config.primary?.map((line) => (
            <Line
              key={line.dataKey}
              yAxisId='left'
              type='monotone'
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color}
              strokeWidth={2}
              dot={false}
              isAnimationActive={!reduceMotion}
            />
          ))}
          {config.secondary?.map((line) => (
            <Line
              key={line.dataKey}
              yAxisId='right'
              type='monotone'
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color}
              strokeWidth={2}
              dot={false}
              isAnimationActive={!reduceMotion}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
