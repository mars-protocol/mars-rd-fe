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
import { dummyBarChartData } from 'components/common/Chart/dummydata'
import { Circle } from 'components/common/Icons'

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
    return (
      <>
        {Object.entries(dataKeys).map(([key, label]) => {
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
        })}
      </>
    )
  }
  return (
    <div className='-ml-2 h-100'>
      <ResponsiveContainer width='100%' height={props.height || '100%'}>
        <BarChart
          data={dummyBarChartData}
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
            dataKey='name'
            stroke='rgba(255, 255, 255, 0.4)'
            fontSize={12}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId='left'
            orientation='left'
            fontSize={12}
            tickCount={4}
            axisLine={false}
            tickLine={false}
            padding={{ top: 10 }}
            tickFormatter={(value) => {
              return formatValue(value, {
                minDecimals: 0,
                maxDecimals: 0,
                prefix: '$',
                abbreviated: true,
              })
            }}
          />
          <YAxis
            yAxisId='right'
            orientation='right'
            fontSize={12}
            tickCount={4}
            axisLine={false}
            tickLine={false}
            padding={{ top: 10 }}
            tickFormatter={(value) => {
              return formatValue(value, {
                minDecimals: 0,
                maxDecimals: 0,
                prefix: '$',
                abbreviated: true,
              })
            }}
          />

          {/* <Tooltip
            cursor={{
              stroke: '#ccc',
              strokeWidth: 2,
              fill: '#f4f44',
            }}
            content={<CustomTooltip payload={[]} label={''} renderContent={renderTooltipContent} />}
          /> */}
          <Legend content={<RenderLegend payload={[]} />} verticalAlign='bottom' />

          <Bar
            dataKey='value'
            yAxisId='left'
            fill='rgba(171, 66, 188, 0.5)'
            legendType='plainline'
            maxBarSize={30}
          />
          {/* <Bar
            dataKey='value2'
            yAxisId='right'
            fill='rgba(66, 188, 171, 0.8)'
            legendType='plainline'
            maxBarSize={30}
          /> */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function RenderLegend(props: RenderLegendProps) {
  const { payload } = props
  const colors = ['#AB47BC', '#8884d8']
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
