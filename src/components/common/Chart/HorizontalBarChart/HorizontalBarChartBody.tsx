import Card from 'components/common/Card'
import Text from 'components/common/Text'
import React from 'react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function HorizontalBarChartBody() {
  const data = [
    { name: 'Long', value: 65, color: 'rgba(171, 66, 188, 0.5)' },
    { name: 'Short', value: 35, color: 'rgb(255, 82, 82, 0.7)' },
  ]

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className='bg-white p-2 border rounded shadow-lg'>
          <p className='font-medium' style={{ color: payload[0].payload.color }}>
            {payload[0].payload.name}: {payload[0].value}%
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className='w-full max-w-md bg-white/5 pr-4 py-2'>
      <div className='h-36'>
        <Text size='sm' className='text-white/60 ml-4'>
          Skew Interest
        </Text>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={data} layout='vertical' margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
            <XAxis
              type='number'
              stroke='rgba(255, 255, 255, 0.4)'
              fontSize={12}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis
              dataKey='name'
              stroke='rgba(255, 255, 255, 0.4)'
              fontSize={12}
              type='category'
              tick={{ fill: '#666' }}
            />
            {/* <Tooltip content={<CustomTooltip />} /> */}
            <Bar
              dataKey='value'
              radius={[4, 4, 4, 4]}
              barSize={30}
              data={data.map((item) => ({
                ...item,
                fill: item.color,
              }))}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className=' flex justify-end gap-2 text-sm mt-2'>
        <div className='flex items-center'>
          <div className='w-3 h-3 rounded-full bg-[#8884d8] mr-2 '></div>
          <Text size='xs' className='text-white/60'>
            Long: {data[0].value}%
          </Text>
        </div>
        <div className='flex items-center'>
          <div className='w-3 h-3 rounded-full bg-[#f87171] mr-2'></div>
          <Text size='xs' className='text-white/60'>
            Short: {data[1].value}%
          </Text>
        </div>
      </div>
    </Card>
  )
}
