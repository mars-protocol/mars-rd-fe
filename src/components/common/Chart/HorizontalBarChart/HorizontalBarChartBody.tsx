// import Card from 'components/common/Card'
// import Text from 'components/common/Text'
// import React from 'react'
// import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

// export default function HorizontalBarChartBody() {
//   const data = [
//     { name: 'Long', value: 65, color: 'rgba(171, 66, 188, 0.5)' },
//     { name: 'Short', value: 35, color: 'rgb(255, 82, 82, 0.7)' },
//   ]

//   const CustomTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className='bg-white p-2 border rounded shadow-lg'>
//           <p className='font-medium' style={{ color: payload[0].payload.color }}>
//             {payload[0].payload.name}: {payload[0].value}%
//           </p>
//         </div>
//       )
//     }
//     return null
//   }

//   return (
//     <Card className='w-full max-w-md bg-white/5 pr-4 py-2'>
//       <div className='h-36'>
//         <Text size='sm' className='text-white/60 ml-4'>
//           Skew Interest
//         </Text>
//         <ResponsiveContainer width='100%' height='100%'>
//           <BarChart data={data} layout='vertical' margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
//             <XAxis
//               type='number'
//               stroke='rgba(255, 255, 255, 0.4)'
//               fontSize={12}
//               domain={[0, 100]}
//               tickFormatter={(value) => `${value}%`}
//             />
//             <YAxis
//               dataKey='name'
//               stroke='rgba(255, 255, 255, 0.4)'
//               fontSize={12}
//               type='category'
//               tick={{ fill: '#666' }}
//             />
//             {/* <Tooltip content={<CustomTooltip />} /> */}
//             <Bar
//               dataKey='value'
//               radius={[4, 4, 4, 4]}
//               barSize={30}
//               data={data.map((item) => ({
//                 ...item,
//                 fill: item.color,
//               }))}
//             />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       <div className=' flex justify-end gap-2 text-sm mt-2'>
//         <div className='flex items-center'>
//           <div className='w-3 h-3 rounded-full bg-[#8884d8] mr-2 '></div>
//           <Text size='xs' className='text-white/60'>
//             Long: {data[0].value}%
//           </Text>
//         </div>
//         <div className='flex items-center'>
//           <div className='w-3 h-3 rounded-full bg-[#f87171] mr-2'></div>
//           <Text size='xs' className='text-white/60'>
//             Short: {data[1].value}%
//           </Text>
//         </div>
//       </div>
//     </Card>
//   )
// }
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
import { BN } from 'utils/helpers'
import { PRICE_ORACLE_DECIMALS } from 'constants/query'
import { formatValue } from 'utils/formatters'
import moment from 'moment'
import ChartTooltip from 'components/common/Chart/common/Tooltip/ChartTooltip'
import ChartLegend from 'components/common/Chart/common/Legend/ChartLegend'
import Text from 'components/common/Text'

interface Props {
  data: any[]
  height?: number
}

interface TooltipContentProps {
  payload: any[]
  label: string
}

const TooltipContent = ({ payload }: TooltipContentProps) => {
  if (!payload) return null

  return (
    <>
      {payload.map((entry, index) => {
        const value = entry.value
        let formattedValue

        if (entry.dataKey === 'skew') {
          const adjustedValue = BN(value).shiftedBy(-PRICE_ORACLE_DECIMALS).toNumber()
          formattedValue = formatValue(adjustedValue, {
            minDecimals: 0,
            maxDecimals: 2,
            prefix: '$',
            abbreviated: true,
          })
        } else {
          formattedValue = `${value.toFixed(1)}%`
        }

        return (
          <div key={index} className='flex space-x-1'>
            <Text size='xs'>{entry.name}: </Text>
            <Text size='xs'>{formattedValue}</Text>
          </div>
        )
      })}
    </>
  )
}

export default function ComposedChartBody({ data, height = 400 }: Props) {
  // Pre-process data to scale percentages
  const scaledData = data.map((item) => ({
    ...item,
    imbalance_long: item.imbalance_long * 100,
    imbalance_short: item.imbalance_short * 100,
    date: item.date,
    skew: item.skew,
  }))

  return (
    <div className='h-full w-full'>
      <ResponsiveContainer width='100%' height={height}>
        <ComposedChart data={scaledData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid
            horizontal={false}
            stroke='rgba(255,255,255,0.1)'
            strokeDasharray='6 3'
            syncWithTicks={true}
          />
          <XAxis
            dataKey='date'
            tickFormatter={(value) => moment(value).format('DD MMM')}
            stroke='rgba(255, 255, 255, 0.4)'
            fontSize={12}
            axisLine={false}
            tickLine={false}
          />
          {/* Left Y-axis for percentages */}
          <YAxis
            yAxisId='left'
            tickFormatter={(value) => `${value}%`}
            domain={[0, 100]}
            orientation='left'
            stroke='rgba(255, 255, 255, 0.4)'
            fontSize={12}
            axisLine={false}
            tickLine={false}
          />
          {/* Right Y-axis for skew */}
          <YAxis
            yAxisId='right'
            orientation='right'
            tickFormatter={(value) => {
              const adjustedValue = BN(value).shiftedBy(-PRICE_ORACLE_DECIMALS).toNumber()
              return formatValue(adjustedValue, {
                minDecimals: 0,
                maxDecimals: 2,
                prefix: '$',
                abbreviated: true,
              })
            }}
            stroke='rgba(255, 255, 255, 0.4)'
            fontSize={12}
            axisLine={false}
            tickLine={false}
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
                renderContent={(payload) => <TooltipContent payload={payload} label={''} />}
              />
            }
          />
          <Legend content={<ChartLegend payload={[]} />} verticalAlign='bottom' />

          {/* Bars for imbalance */}
          <Bar
            yAxisId='left'
            dataKey='imbalance_long'
            name='Imbalance Long'
            fill='rgba(171, 66, 188, 0.5)'
            maxBarSize={24}
            activeBar={{ stroke: 'rgba(255, 255, 255, 0.1)', strokeWidth: 2 }}
          />
          <Bar
            yAxisId='left'
            dataKey='imbalance_short'
            name='Imbalance Short'
            fill='rgba(255, 82, 82, 0.7)'
            maxBarSize={24}
            activeBar={{ stroke: 'rgba(255, 255, 255, 0.1)', strokeWidth: 2 }}
          />

          {/* Line for skew */}
          <Line
            yAxisId='right'
            type='monotone'
            dataKey='skew'
            name='Skew'
            stroke='#30E0A1'
            dot={false}
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
