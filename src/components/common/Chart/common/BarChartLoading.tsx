import classNames from 'classnames'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'

interface Props {
  height?: number
}

const loadingData = [
  { date: '2023-05-15', valueOne: 1501271, valueTwo: 2501271 },
  { date: '2023-05-16', valueOne: 9804718, valueTwo: 1804718 },
  { date: '2023-05-17', valueOne: 4901520, valueTwo: 4901520 },
  { date: '2023-05-18', valueOne: 8500000, valueTwo: 5500000 },
  { date: '2023-05-19', valueOne: 486720, valueTwo: 8486720 },
  { date: '2023-05-20', valueOne: 5412721, valueTwo: 2412721 },
  { date: '2023-05-21', valueOne: 302321, valueTwo: 6032321 },
  { date: '2023-05-21', valueOne: 4303231, valueTwo: 632321 },
  { date: '2023-05-21', valueOne: 9032321, valueTwo: 3032321 },
]

export default function BarChartLoading(props: Props) {
  return (
    <div className={classNames('-mr-6 animate-pulse', props.height)}>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart
          data={loadingData}
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
            tickFormatter={() => {
              return '...'
            }}
          />
          <YAxis
            orientation='right'
            fontSize={12}
            tickCount={4}
            axisLine={false}
            tickLine={false}
            stroke='rgba(255, 255, 255, 0.4)'
            tickFormatter={() => {
              return '...'
            }}
          />

          <Bar
            dataKey='valueOne'
            fill='rgba(255, 255, 255, 0.2)'
            legendType='plainline'
            stackId='a'
            maxBarSize={24}
            activeBar={{ stroke: 'rgba(255, 255, 255, 0.1)', strokeWidth: 2 }}
          />
          <Bar
            dataKey='valueTwo'
            fill='rgba(255, 255, 255, 0.1)'
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
