import React from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Text from 'components/common/Text'
import { formatValue } from 'utils/formatters'
import CustomTooltip from 'components/common/Chart/Tooltip/CustomTooltip'
import { dummyBarChartData } from 'components/common/Chart/dummydata'

interface Props {
  data: BarChartData
  height?: string
  dataKeys: { [key: string]: string }
}

export default function BarChartBody(props: Props) {
  const renderTooltipContent = (payload: ChartDataPayloadProps[]) => {
    return (
      <>
        {Object.entries(props.dataKeys).map(([key, label]) => {
          const value = payload.find((p) => p.dataKey === key)?.value ?? 0
          const formattedValue = formatValue(value, {
            minDecimals: 0,
            maxDecimals: 0,
            prefix: '$',
            abbreviated: true,
          })
          return <Text size='sm'>{`${label}: ${formattedValue}`}</Text>
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
            fontSize={12}
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
          <Tooltip
            cursor={{ stroke: '#000', strokeWidth: 2, fill: 'rgba(255, 255, 255, 0.2)' }}
            content={<CustomTooltip payload={[]} label={''} renderContent={renderTooltipContent} />}
          />

          <Bar dataKey='valueTwo' fill='rgba(171, 66, 188, 0.5)' legendType='plainline' />
          <Bar dataKey='valueOne' fill='rgba(66, 188, 171, 0.8)' legendType='plainline' />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
