import React from 'react'
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
import Text from 'components/common/Text'
import { formatValue } from 'utils/formatters'
import CustomTooltip from 'components/common/Chart/Tooltip/CustomTooltip'
import { Circle } from 'components/common/Icons'
import moment from 'moment'

interface Props {
  data: BarChartData
  height?: string
  dataKeys: { [key: string]: string }
}
interface LegendEntry {
  inactive: boolean
  dataKey: string
  type: string
  color: string
  value: string
}

interface RenderLegendProps {
  payload: LegendEntry[]
}

export default function BarChartBody(props: Props) {
  const { data, height, dataKeys } = props
  const renderTooltipContent = (payload: ChartDataPayloadProps[]) => {
    return Object.entries(dataKeys).map(([key, label]) => {
      const value = payload.find((p) => p.dataKey === key)?.value ?? 0
      const formattedValue = formatValue(value, {
        minDecimals: 0,
        maxDecimals: 0,
        prefix: '$',
        abbreviated: true,
      })
      return (
        <Text size='sm'>
          {label}: {formattedValue}
        </Text>
      )
    })
  }
  return (
    <div className='h-100 w-full'>
      <ResponsiveContainer width='100%' height={props.height || '100%'}>
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
            content={<CustomTooltip payload={[]} label={''} renderContent={renderTooltipContent} />}
          />
          <Legend content={<RenderLegend payload={[]} />} verticalAlign='bottom' />

          <Bar
            dataKey='supply'
            fill='rgba(171, 66, 188, 0.5)'
            legendType='plainline'
            stackId='a'
            maxBarSize={24}
            activeBar={{ stroke: 'rgba(255, 255, 255, 0.1)', strokeWidth: 2 }}
          />
          <Bar
            dataKey='borrow'
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

function RenderLegend(props: RenderLegendProps) {
  const { payload } = props
  const colors = ['#AB47BC', '#FF5252']
  return (
    <div className='flex justify-center sm:justify-end sm:mr-7'>
      {payload.map((entry: LegendEntry, index: number) => (
        <div className='flex items-center' key={`item-${index}`}>
          <Circle className='fill-current h-2 w-2' color={colors[index]} />
          <Text size='xs' className='mx-2'>
            {entry.value}
          </Text>
        </div>
      ))}
    </div>
  )
}
