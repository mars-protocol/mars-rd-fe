import React from 'react'
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
import moment from 'moment'
import { formatValue } from 'utils/formatters'
import ChartLegend from 'components/common/Chart/Legend/ChartLegend'
import ChartTooltip from 'components/common/Chart/Tooltip/ChartTooltip'
import DisplayCurrency from 'components/common/DisplayCurrency'
import Text from 'components/common/Text'
import { BNCoin } from 'types/classes/BNCoin'
import { BN } from 'utils/helpers'
import { PRICE_ORACLE_DECIMALS } from 'constants/query'
import { Circle } from 'components/common/Icons'

interface LineConfig {
  dataKey: string
  color: string
  name: string
}

interface Props {
  data: any[]
  lines: LineConfig[]
  height?: number
  width?: string
}

const TooltipContent = (payload: ChartDataPayloadProps[]) => {
  return (
    <>
      {payload.map((item: any, index: number) => (
        <div key={index} className='flex space-x-1 items-center'>
          <Circle className='fill-current h-2 w-2' color={item.color} />

          <Text size='xs'>{item.name}: </Text>
          <DisplayCurrency
            coin={BNCoin.fromDenomAndBigNumber(
              'usd',
              BN(item.value).shiftedBy(-PRICE_ORACLE_DECIMALS),
            )}
            className='text-xs'
          />
        </div>
      ))}
    </>
  )
}

export default function DynamicLineChartBody(props: Props) {
  const { data, lines, height = 400, width = '100%' } = props

  const reversedData = [...data].reverse()

  return (
    <div className='-ml-6'>
      <ResponsiveContainer width={width} height={height}>
        <LineChart data={reversedData}>
          {lines.map((lineConfig, index) => (
            <Line
              key={index}
              type='monotone'
              dataKey={lineConfig.dataKey}
              stroke={lineConfig.color}
              name={lineConfig.name}
              dot={false}
              strokeWidth={2}
            />
          ))}

          <XAxis
            stroke='rgba(255, 255, 255, 0.4)'
            tickFormatter={(value) => {
              return moment(value).format('DD MMM')
            }}
            padding={{ left: 5, right: 10 }}
            axisLine={false}
            tickLine={false}
            fontSize={10}
            dataKey='date'
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            fontSize={10}
            tickCount={10}
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

          <Tooltip
            content={
              <ChartTooltip active={false} payload={[]} label={''} renderContent={TooltipContent} />
            }
          />
          <Legend content={<ChartLegend payload={[]} />} verticalAlign='bottom' />

          <CartesianGrid strokeDasharray='6 3' opacity={0.1} vertical={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
