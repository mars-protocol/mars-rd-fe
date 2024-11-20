import React from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import moment from 'moment'
import { formatValue } from 'utils/formatters'
import ChartLegend from 'components/common/Chart/common/Legend/ChartLegend'
import ChartTooltip from 'components/common/Chart/common/Tooltip/ChartTooltip'
import DisplayCurrency from 'components/common/DisplayCurrency'
import Text from 'components/common/Text'
import { BNCoin } from 'types/classes/BNCoin'
import { BN } from 'utils/helpers'
import { PRICE_ORACLE_DECIMALS } from 'constants/query'
import { Circle } from 'components/common/Icons'
import classNames from 'classnames'
import { FormattedNumber } from 'components/common/FormattedNumber'

interface LineConfig {
  dataKey: string
  color: string
  name: string
  isPercentage?: boolean
}

interface Props {
  data: MergedChartData[]
  lines: LineConfig[]
  height?: string
}

const TooltipContent = ({
  payload,
  lines,
}: {
  payload: ChartDataPayloadProps[]
  lines: LineConfig[]
}) => {
  return payload.map((item, index) => {
    const lineConfig = lines.find((line) => line.dataKey === item.dataKey)
    const value = typeof item.value === 'string' ? parseFloat(item.value) : item.value

    return (
      <div key={index} className='flex items-center gap-1'>
        <Circle className='fill-current h-2 w-2' color={item.color} />
        <Text size='xs'>{item.name}: </Text>
        {lineConfig?.isPercentage ? (
          <FormattedNumber
            amount={value * 100}
            options={{ maxDecimals: 3, minDecimals: 0, suffix: '%' }}
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

export default function DynamicLineChartBody(props: Props) {
  const { data, lines, height = 'h-65' } = props

  const reversedData = [...data].reverse()

  return (
    <div className={classNames('-ml-6', height)}>
      <ResponsiveContainer width='100%' height='100%'>
        <AreaChart
          data={reversedData}
          margin={{
            top: 10,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            {lines.map((lineConfig) => (
              <linearGradient
                id={`gradient-${lineConfig.color}`}
                x1='0'
                y1='0'
                x2='0'
                y2='1'
                key={`gradient-${lineConfig.color}`}
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
              return moment(value).format('DD MMM')
            }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            fontSize={10}
            tickCount={8}
            stroke='rgba(255, 255, 255, 0.4)'
            {...(lines[0]?.isPercentage && { domain: [-1, 1] })}
            tickFormatter={(value) => {
              if (lines[0]?.isPercentage) {
                return formatValue(value * 100, {
                  minDecimals: 0,
                  maxDecimals: 2,
                  suffix: '%',
                })
              }
              const adjustedValue = BN(value).shiftedBy(-PRICE_ORACLE_DECIMALS).toNumber()
              return formatValue(adjustedValue, {
                minDecimals: 0,
                maxDecimals: 0,
                prefix: '$',
                abbreviated: true,
              })
            }}
          />

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
          <Legend content={<ChartLegend payload={[]} />} verticalAlign='top' />

          <CartesianGrid strokeDasharray='6 3' opacity={0.1} vertical={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
