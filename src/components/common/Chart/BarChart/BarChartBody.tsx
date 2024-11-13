import ChartTooltip from 'components/common/Chart/common/Tooltip/ChartTooltip'
import ChartLegend from 'components/common/Chart/common/Legend/ChartLegend'
import DisplayCurrency from 'components/common/DisplayCurrency'
import moment from 'moment'
import React from 'react'
import Text from 'components/common/Text'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatValue } from 'utils/formatters'
import { PRICE_ORACLE_DECIMALS } from 'constants/query'
import { BN } from 'utils/helpers'
import { Circle } from 'components/common/Icons'
import { FormattedNumber } from 'components/common/FormattedNumber'
import { BNCoin } from 'types/classes/BNCoin'

interface SeriesConfig {
  key: string
  dataKey: string
  displayName: string
  color: string
  isPercentage?: boolean
}

interface Props {
  data: MergedChartData[]
  height?: number
  series: SeriesConfig[]
  stacked?: boolean
}

interface BarTooltipContentProps {
  payload: ChartDataPayloadProps[]
  series: SeriesConfig[]
}

function TooltipContent(props: BarTooltipContentProps) {
  const { payload, series } = props

  return series.map((data) => {
    const entry = payload.find((p) => p.dataKey === data.dataKey)
    const value = typeof entry?.value === 'string' ? parseFloat(entry.value) : entry?.value ?? 0

    return (
      <div key={data.key} className='flex items-center gap-1'>
        <Circle className='fill-current h-2 w-2' color={data.color} />
        <Text size='xs'>{data.displayName}: </Text>
        {data?.isPercentage ? (
          <FormattedNumber
            amount={value * 100}
            options={{ maxDecimals: 2, minDecimals: 0, suffix: '%' }}
            animate
            className='text-xs'
          />
        ) : (
          <DisplayCurrency
            coin={BNCoin.fromDenomAndBigNumber('usd', BN(value).shiftedBy(-PRICE_ORACLE_DECIMALS))}
            className='text-xs'
            showSignPrefix
          />
        )}
      </div>
    )
  })
}

export default function BarChartBody(props: Props) {
  const { data, height = 400, series, stacked = true } = props

  return (
    <div className='h-full -ml-6'>
      <ResponsiveContainer width='100%' height={height}>
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            {series.map((seriesConfig) => (
              <linearGradient
                id={`gradient-${seriesConfig.key}`}
                x1='0'
                y1='0'
                x2='0'
                y2='1'
                key={seriesConfig.key}
              >
                <stop offset='0%' stopColor={seriesConfig.color} stopOpacity={0.6} />
                <stop offset='100%' stopColor={seriesConfig.color} stopOpacity={0.1} />
              </linearGradient>
            ))}
          </defs>

          <CartesianGrid
            horizontal={false}
            stroke='rgba(255,255,255,0.1)'
            strokeDasharray='6 3'
            syncWithTicks={true}
          />
          <XAxis
            dataKey='date'
            stroke='rgba(255, 255, 255, 0.4)'
            fontSize={10}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => moment(value).format('DD MMM')}
          />
          <YAxis
            orientation='left'
            fontSize={10}
            tickCount={6}
            {...(series[0]?.isPercentage && { domain: [0, 1.0] })}
            axisLine={false}
            tickLine={false}
            stroke='rgba(255, 255, 255, 0.4)'
            tickFormatter={(value) => {
              if (series[0]?.isPercentage) {
                return `${(value * 100).toFixed(0)}%`
              }
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
            cursor={{
              stroke: 'rgba(255, 255, 255, 0.1)',
              strokeWidth: 2,
              fill: 'rgba(255, 255, 255, 0.1)',
            }}
            content={
              <ChartTooltip
                payload={[]}
                label={''}
                renderContent={(payload) => TooltipContent({ payload, series })}
              />
            }
          />
          <Legend content={<ChartLegend payload={[]} />} verticalAlign='top' />

          {series.map((seriesConfig) => (
            <Bar
              key={seriesConfig.key}
              dataKey={seriesConfig.dataKey}
              name={seriesConfig.displayName}
              fill={stacked ? seriesConfig.color : `url(#gradient-${seriesConfig.key})`}
              stackId={stacked ? 'a' : undefined}
              maxBarSize={24}
              stroke={seriesConfig.color}
              activeBar={{ stroke: 'rgba(255, 255, 255, 0.1)', strokeWidth: 2 }}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
