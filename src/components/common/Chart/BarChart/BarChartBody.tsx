import ChartTooltip from 'components/common/Chart/Tooltip/ChartTooltip'
import ChartLegend from 'components/common/Chart/Legend/ChartLegend'
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

interface Props {
  data: BarChartData
  height?: string
  dataKeys: { [key: string]: string }
}

interface BarTooltipContentProps {
  payload: ChartDataPayloadProps[]
  dataKeys: { [key: string]: string }
}

function TooltipContent(props: BarTooltipContentProps) {
  const { payload, dataKeys } = props
  return Object.entries(dataKeys).map(([key, label]) => {
    const value = payload.find((p) => p.dataKey === label)?.value ?? 0
    const formattedValue = formatValue(value, {
      minDecimals: 2,
      maxDecimals: 2,
      prefix: '$',
      abbreviated: true,
    })
    return <Text key={key} size='sm'>{`${label}: ${formattedValue}`}</Text>
  })
}

export default function BarChartBody(props: Props) {
  const { data, height, dataKeys } = props

  return (
    <div className='h-100 w-full'>
      <ResponsiveContainer width='100%' height={height || '100%'}>
        <BarChart
          data={data}
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid
            horizontal={false}
            stroke='rgba(255,255,255,0.1)'
            strokeDasharray='6 3'
            syncWithTicks={true}
          />
          <XAxis
            dataKey='date'
            stroke='rgba(255, 255, 255, 0.4)'
            fontSize={12}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => {
              return moment(value).format('DD MMM')
            }}
          />
          <YAxis
            orientation='right'
            fontSize={12}
            tickCount={4}
            axisLine={false}
            tickLine={false}
            stroke='rgba(255, 255, 255, 0.4)'
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
            cursor={{
              stroke: 'rgba(255, 255, 255, 0.1)',
              strokeWidth: 2,
              fill: 'rgba(255, 255, 255, 0.1)',
            }}
            content={
              <ChartTooltip
                payload={[]}
                label={''}
                renderContent={(payload) => TooltipContent({ payload, dataKeys: props.dataKeys })}
              />
            }
          />
          <Legend content={<ChartLegend payload={[]} />} verticalAlign='bottom' />

          <Bar
            dataKey={dataKeys.valueOne}
            fill='rgba(171, 66, 188, 0.5)'
            legendType='plainline'
            stackId='a'
            maxBarSize={24}
            activeBar={{ stroke: 'rgba(255, 255, 255, 0.1)', strokeWidth: 2 }}
          />
          <Bar
            dataKey={dataKeys.valueTwo}
            fill='rgb(255, 82, 82, 0.7)'
            stackId='a'
            legendType='plainline'
            maxBarSize={24}
            activeBar={{ stroke: 'rgba(255, 255, 255, 0.1)', strokeWidth: 2 }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
