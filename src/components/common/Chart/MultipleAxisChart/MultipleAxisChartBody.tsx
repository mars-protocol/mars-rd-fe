import React from 'react'
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
import moment from 'moment'
import { BN } from 'utils/helpers'
import { PRICE_ORACLE_DECIMALS } from 'constants/query'
import DisplayCurrency from 'components/common/DisplayCurrency'
import { BNCoin } from 'types/classes/BNCoin'
import { Circle } from 'components/common/Icons'
import Text from 'components/common/Text'
import ChartTooltip from 'components/common/Chart/common/Tooltip/ChartTooltip'
import ChartLegend from 'components/common/Chart/common/Legend/ChartLegend'
import { FormattedNumber } from 'components/common/FormattedNumber'
import { formatValue } from 'utils/formatters'
import classNames from 'classnames'

interface SeriesConfig {
  type: 'bar' | 'line'
  dataKey: string
  name: string
  color: string
  isPercentage?: boolean
}

interface AxisConfig {
  series: SeriesConfig[]
}

interface Props {
  data: any[]
  primaryAxis: AxisConfig
  secondaryAxis: AxisConfig
  height?: string | number
}

const TooltipContent = ({
  payload,
  primaryAxis,
  secondaryAxis,
}: {
  payload: any[]
  primaryAxis: AxisConfig
  secondaryAxis: AxisConfig
}) => {
  if (!payload) return null

  return (
    <div className='flex flex-col gap-1'>
      {payload.map((entry: any, index: number) => {
        const seriesConfig = [...primaryAxis.series, ...secondaryAxis.series].find(
          (s) => s.dataKey === entry.dataKey,
        )

        if (!seriesConfig) return null
        const value = typeof entry.value === 'string' ? parseFloat(entry.value) : entry.value

        return (
          <div key={index} className='flex items-center gap-1'>
            <Circle className='fill-current h-2 w-2' color={entry.color || seriesConfig.color} />
            <Text size='xs'>{seriesConfig.name}: </Text>
            {seriesConfig.isPercentage ? (
              <FormattedNumber
                amount={value * 100}
                options={{ maxDecimals: 2, minDecimals: 0, suffix: '%' }}
                animate
                className='text-xs'
              />
            ) : (
              <DisplayCurrency
                coin={BNCoin.fromDenomAndBigNumber(
                  'usd',
                  BN(value).shiftedBy(-PRICE_ORACLE_DECIMALS),
                )}
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

export default function MultipleAxisChartBody({
  data,
  primaryAxis,
  secondaryAxis,
  height = 300,
}: Props) {
  const reversedData = [...data].reverse()

  return (
    <div className={classNames('-ml-6', height)}>
      <ResponsiveContainer width='100%' height='100%'>
        <ComposedChart data={reversedData}>
          <defs>
            {[...primaryAxis.series, ...secondaryAxis.series].map((series) => (
              <linearGradient
                key={series.dataKey}
                id={`gradient-${series.dataKey}`}
                x1='0'
                y1='0'
                x2='0'
                y2='1'
              >
                <stop offset='0%' stopColor={series.color} stopOpacity={0.6} />
                <stop offset='100%' stopColor={series.color} stopOpacity={0.1} />
              </linearGradient>
            ))}
          </defs>

          <CartesianGrid strokeDasharray='6 3' opacity={0.1} vertical={false} />

          <XAxis
            dataKey='date'
            stroke='rgba(255, 255, 255, 0.4)'
            fontSize={10}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => moment(value).format('DD MMM')}
            dy={10}
          />

          {/* Primary Y-Axis */}
          <YAxis
            yAxisId='left'
            orientation='left'
            stroke='rgba(255, 255, 255, 0.4)'
            fontSize={10}
            tickCount={6}
            axisLine={false}
            tickLine={false}
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

          {/* Secondary Y-Axis */}
          <YAxis
            yAxisId='right'
            orientation='right'
            stroke='rgba(255, 255, 255, 0.4)'
            fontSize={10}
            tickCount={6}
            axisLine={false}
            tickLine={false}
            domain={[0, 1.0]}
            tickFormatter={(value) =>
              formatValue(value * 100, {
                minDecimals: 0,
                maxDecimals: 0,
                suffix: '%',
              })
            }
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
                renderContent={(payload) => (
                  <TooltipContent
                    payload={payload}
                    primaryAxis={primaryAxis}
                    secondaryAxis={secondaryAxis}
                  />
                )}
              />
            }
          />

          <Legend content={<ChartLegend payload={[]} />} verticalAlign='top' />

          {/* Render primary axis series */}
          {primaryAxis.series.map((series) =>
            series.type === 'bar' ? (
              <Bar
                key={series.dataKey}
                yAxisId='left'
                dataKey={series.dataKey}
                name={series.name}
                fill={`url(#gradient-${series.dataKey})`}
                stroke={series.color}
                maxBarSize={24}
              />
            ) : (
              <Line
                key={series.dataKey}
                yAxisId='left'
                type='monotone'
                dataKey={series.dataKey}
                stroke={series.color}
                dot={false}
                strokeWidth={2}
              />
            ),
          )}

          {/* Render secondary axis series */}
          {secondaryAxis.series.map((series) => (
            <Line
              key={series.dataKey}
              yAxisId='right'
              type='monotone'
              dataKey={series.dataKey}
              stroke={series.color}
              dot={false}
              strokeWidth={2}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
