import classNames from 'classnames'
import moment from 'moment'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { DEFAULT_SETTINGS } from 'constants/defaultSettings'
import { LocalStorageKeys } from 'constants/localStorageKeys'
import useLocalStorage from 'hooks/localStorage/useLocalStorage'

function createLoadingData() {
  const data = []
  const dataValues1 = [10, 20, 80, 30, 60, 50, 60]
  const dataValues2 = [60, 50, 30, 70, 40, 20, 40]
  const startDate = moment().subtract(7, 'days')
  const endDate = moment()
  const days = endDate.diff(startDate, 'days')

  for (let i = 0; i < days; i++) {
    const date = moment(startDate).add(i, 'days')
    data.push({
      date: date.format('YYYY-MM-DD'),
      value1: dataValues1[i],
      value2: dataValues2[i],
    })
  }
  return data
}

export default function SynchronizedChartLoading() {
  const [reduceMotion] = useLocalStorage<boolean>(
    LocalStorageKeys.REDUCE_MOTION,
    DEFAULT_SETTINGS.reduceMotion,
  )
  const loadingData = createLoadingData()

  return (
    <div className={classNames('-ml-8 h-[560px]', !reduceMotion && 'animate-pulse')}>
      <ResponsiveContainer width='100%' height='50%'>
        <AreaChart
          data={loadingData}
          syncId='loading-chart'
          margin={{
            top: 10,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id='loadingGradient1' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='0%' stopColor='#FFF' stopOpacity={0.2} />
              <stop offset='100%' stopColor='#FFF' stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid
            horizontal={false}
            stroke='rgba(255,255,255,0.1)'
            strokeDasharray='6 3'
            syncWithTicks={true}
          />
          <XAxis
            stroke='rgba(255, 255, 255, 0.3)'
            tickFormatter={() => '...'}
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
            tickCount={6}
            stroke='rgba(255, 255, 255, 0.3)'
            tickFormatter={() => '...'}
          />
          <Area
            type='monotone'
            dataKey='value1'
            stroke='rgba(255, 255, 255, 0.3)'
            strokeWidth={2}
            fill='url(#loadingGradient1)'
            isAnimationActive={!reduceMotion}
          />
        </AreaChart>
      </ResponsiveContainer>

      <ResponsiveContainer width='100%' height='50%'>
        <AreaChart
          data={loadingData}
          syncId='loading-chart'
          margin={{
            top: 10,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id='loadingGradient2' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='0%' stopColor='#FFF' stopOpacity={0.2} />
              <stop offset='100%' stopColor='#FFF' stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid
            horizontal={false}
            stroke='rgba(255,255,255,0.1)'
            strokeDasharray='6 3'
            syncWithTicks={true}
          />
          <XAxis
            stroke='rgba(255, 255, 255, 0.3)'
            tickFormatter={() => '...'}
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
            tickCount={6}
            stroke='rgba(255, 255, 255, 0.3)'
            tickFormatter={() => '...'}
          />
          <Area
            type='monotone'
            dataKey='value2'
            stroke='rgba(255, 255, 255, 0.3)'
            strokeWidth={2}
            fill='url(#loadingGradient2)'
            isAnimationActive={!reduceMotion}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
