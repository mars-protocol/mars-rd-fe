import ChartTooltip from 'components/common/Chart/common/Tooltip/ChartTooltip'
import ChartLegend from 'components/common/Chart/common/Legend/ChartLegend'
import DisplayCurrency from 'components/common/DisplayCurrency'
import moment from 'moment'
import Text from 'components/common/Text'
import useLocalStorage from 'hooks/localStorage/useLocalStorage'
import {
  Area,
  AreaChart,
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
import { BNCoin } from 'types/classes/BNCoin'
import { BN } from 'utils/helpers'
import { Circle } from 'components/common/Icons'
import { DEFAULT_SETTINGS } from 'constants/defaultSettings'
import { formatValue } from 'utils/formatters'
import { LocalStorageKeys } from 'constants/localStorageKeys'
import { PRICE_ORACLE_DECIMALS } from 'constants/query'
import { useMemo } from 'react'

interface Props {
  data: MergedChartData[]
  dataKey1: string
  dataKey2: string
}

// function TooltipContent(props: TooltipContentProps) {
//   const { payload } = props
//   const amount = Number(payload[0].value) ?? 0
//   const label = payload[0].name ?? 'Value'

//   return (
//     <div key={label} className='flex items-center gap-1'>
//       <Circle className='fill-current h-2 w-2' color={payload[0].stroke} />

//       <Text size='xs'>{label}: </Text>
//       <DisplayCurrency
//         coin={BNCoin.fromDenomAndBigNumber('usd', BN(amount).shiftedBy(-PRICE_ORACLE_DECIMALS))}
//         options={{ minDecimals: 0, maxDecimals: 2, abbreviated: true }}
//         className='text-xs'
//         showSignPrefix
//       />
//     </div>
//   )
// }

// export default function SynchronizedAreaChartBody(props: Props) {
//   const { data, dataKey1, dataKey2 } = props
//   const [reduceMotion] = useLocalStorage<boolean>(
//     LocalStorageKeys.REDUCE_MOTION,
//     DEFAULT_SETTINGS.reduceMotion,
//   )
//   const reversedData = [...data].reverse()

//   return (
//     <div className={`-ml-4 w-full h-[560px]`}>
//       <ResponsiveContainer width='100%' height={'50%'}>
//         <AreaChart
//           data={reversedData}
//           syncId='chart'
//           margin={{
//             top: 10,
//             right: 0,
//             left: 0,
//             bottom: 0,
//           }}
//         >
//           <defs>
//             <linearGradient id='chartGradient1' x1='0' y1='0' x2='0' y2='1'>
//               <stop offset='0%' stopColor={'#82ca9d'} stopOpacity={0.2} />
//               <stop offset='100%' stopColor={'#82ca9d'} stopOpacity={0.02} />
//             </linearGradient>
//           </defs>

//           <CartesianGrid strokeDasharray='6 3' opacity={0.1} vertical={false} />
//           <XAxis
//             stroke='rgba(255, 255, 255, 0.4)'
//             tickFormatter={(value) => {
//               return moment(value).format('DD MMM')
//             }}
//             axisLine={false}
//             tickLine={false}
//             fontSize={10}
//             dataKey='date'
//             dy={10}
//           />
//           <YAxis
//             axisLine={false}
//             tickLine={false}
//             fontSize={10}
//             tickCount={6}
//             stroke='rgba(255, 255, 255, 0.4)'
//             tickFormatter={(value) => {
//               const adjustedValue = BN(value).shiftedBy(-PRICE_ORACLE_DECIMALS).toNumber()
//               return formatValue(adjustedValue, {
//                 minDecimals: 0,
//                 maxDecimals: 2,
//                 prefix: '$',
//                 abbreviated: true,
//               })
//             }}
//           />
//           <Tooltip
//             cursor={false}
//             isAnimationActive={!reduceMotion}
//             wrapperStyle={{ outline: 'none' }}
//             content={
//               <ChartTooltip
//                 payload={[]}
//                 label={''}
//                 renderContent={(payload) => <TooltipContent payload={payload} />}
//               />
//             }
//           />
//           <Legend content={<ChartLegend payload={[]} />} verticalAlign='top' />

//           <Area
//             type='monotone'
//             dataKey={dataKey1}
//             stroke='#82ca9d'
//             strokeWidth={2}
//             fill='url(#chartGradient1)'
//             isAnimationActive={!reduceMotion}
//           />
//         </AreaChart>
//       </ResponsiveContainer>

//       <ResponsiveContainer width='100%' height={'50%'}>
//         <AreaChart
//           data={reversedData}
//           syncId='chart'
//           margin={{
//             top: 10,
//             right: 0,
//             left: 0,
//             bottom: 0,
//           }}
//         >
//           <defs>
//             <linearGradient id='chartGradient2' x1='0' y1='0' x2='0' y2='1'>
//               <stop offset='0%' stopColor={'#AB47BC'} stopOpacity={0.2} />
//               <stop offset='100%' stopColor={'#AB47BC'} stopOpacity={0.02} />
//             </linearGradient>
//           </defs>

//           <CartesianGrid strokeDasharray='6 3' opacity={0.1} vertical={false} />
//           <XAxis
//             stroke='rgba(255, 255, 255, 0.4)'
//             tickFormatter={(value) => {
//               return moment(value).format('DD MMM')
//             }}
//             axisLine={false}
//             tickLine={false}
//             fontSize={10}
//             dataKey='date'
//             dy={10}
//           />
//           <YAxis
//             axisLine={false}
//             tickLine={false}
//             fontSize={10}
//             tickCount={6}
//             stroke='rgba(255, 255, 255, 0.4)'
//             tickFormatter={(value) => {
//               const adjustedValue = BN(value).shiftedBy(-PRICE_ORACLE_DECIMALS).toNumber()
//               return formatValue(adjustedValue, {
//                 minDecimals: 0,
//                 maxDecimals: 2,
//                 prefix: '$',
//                 abbreviated: true,
//               })
//             }}
//           />
//           <Tooltip
//             cursor={false}
//             isAnimationActive={!reduceMotion}
//             wrapperStyle={{ outline: 'none' }}
//             content={
//               <ChartTooltip
//                 payload={[]}
//                 label={''}
//                 renderContent={(payload) => <TooltipContent payload={payload} />}
//               />
//             }
//           />
//           <Legend content={<ChartLegend payload={[]} />} verticalAlign='top' />

//           <Area
//             type='monotone'
//             dataKey={dataKey2}
//             stroke='#AB47BC'
//             strokeWidth={2}
//             fill='url(#chartGradient2)'
//             isAnimationActive={!reduceMotion}
//           />
//         </AreaChart>
//       </ResponsiveContainer>
//     </div>
//   )
// }

function TooltipContent(props: TooltipContentProps) {
  const { payload } = props

  if (!payload || !payload.length) return null

  return (
    <div className='flex flex-col gap-2 p-2 rounded'>
      {payload.map((entry, index) => {
        const amount = Number(entry.value) ?? 0
        const label = entry.dataKey.includes('daily') ? entry.name : entry.name

        return (
          <div key={index} className='flex items-center gap-1'>
            <Circle className='fill-current h-2 w-2' color={entry.stroke || entry.fill} />
            <Text size='xs'>{label}: </Text>
            <DisplayCurrency
              coin={BNCoin.fromDenomAndBigNumber(
                'usd',
                BN(amount).shiftedBy(-PRICE_ORACLE_DECIMALS),
              )}
              options={{
                minDecimals: 0,
                maxDecimals: 2,
                abbreviated: true,
              }}
              className='text-xs'
              showSignPrefix
            />
          </div>
        )
      })}
    </div>
  )
}

export default function SynchronizedAreaChartBody(props: Props) {
  const { data, dataKey1, dataKey2 } = props
  const [reduceMotion] = useLocalStorage<boolean>(
    LocalStorageKeys.REDUCE_MOTION,
    DEFAULT_SETTINGS.reduceMotion,
  )

  console.log('data', data)
  const transformedData = useMemo(() => {
    return data.map((item, index) => {
      const prevItem = index < data.length - 1 ? data[index + 1] : null

      return {
        date: item.date,
        cumulativeRealized: item.Realized,
        cumulativeUnrealized: item.Unrealized,
        dailyRealizedChange: prevItem ? BN(item.Realized).minus(prevItem.Realized).toNumber() : 0,
        dailyUnrealizedChange: prevItem
          ? BN(item.Unrealized).minus(prevItem.Unrealized).toNumber()
          : 0,
      }
    })
  }, [data])

  const reversedData = [...transformedData].reverse()

  return (
    <div className={`-ml-4 w-full h-[560px]`}>
      <ResponsiveContainer width='100%' height={'50%'}>
        <ComposedChart
          data={reversedData}
          syncId='chart'
          margin={{
            top: 10,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id='chartGradient1' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='0%' stopColor={'#82ca9d'} stopOpacity={0.2} />
              <stop offset='100%' stopColor={'#82ca9d'} stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray='6 3' opacity={0.1} vertical={false} />
          <XAxis
            stroke='rgba(255, 255, 255, 0.4)'
            tickFormatter={(value) => {
              return moment(value).format('DD MMM')
            }}
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
            cursor={false}
            isAnimationActive={!reduceMotion}
            wrapperStyle={{ outline: 'none' }}
            content={
              <ChartTooltip
                payload={[]}
                label={''}
                renderContent={(payload) => <TooltipContent payload={payload} />}
              />
            }
          />
          <Legend content={<ChartLegend payload={[]} />} verticalAlign='top' />
          <Bar
            dataKey='dailyRealizedChange'
            name='Daily Realized Change'
            fill='url(#gradientRealized)'
            stroke='#82ca9d'
            maxBarSize={24}
          />
          <Area
            type='monotone'
            dataKey='cumulativeRealized'
            name='Cumulative Realized PnL'
            stroke='#580DA3'
            strokeWidth={2}
            fill='url(#chartGradient1)'
            isAnimationActive={!reduceMotion}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <ResponsiveContainer width='100%' height={'50%'}>
        <ComposedChart
          data={reversedData}
          syncId='chart'
          margin={{
            top: 10,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id='chartGradient2' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='0%' stopColor={'#AB47BC'} stopOpacity={0.2} />
              <stop offset='100%' stopColor={'#AB47BC'} stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray='6 3' opacity={0.1} vertical={false} />
          <XAxis
            stroke='rgba(255, 255, 255, 0.4)'
            tickFormatter={(value) => {
              return moment(value).format('DD MMM')
            }}
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
            cursor={false}
            isAnimationActive={!reduceMotion}
            wrapperStyle={{ outline: 'none' }}
            content={
              <ChartTooltip
                payload={[]}
                label={''}
                renderContent={(payload) => <TooltipContent payload={payload} />}
              />
            }
          />
          <Legend content={<ChartLegend payload={[]} />} verticalAlign='top' />
          <Bar
            dataKey='dailyUnrealizedChange'
            name='Daily Unrealized Change'
            fill='url(#gradientUnrealized)'
            stroke='#AB47BC'
            maxBarSize={24}
          />
          <Line
            type='monotone'
            dot={false}
            dataKey='cumulativeUnrealized'
            name='Cumulative Unrealized PnL'
            stroke='#580DA3'
            strokeWidth={2}
            fill='url(#chartGradient2)'
            isAnimationActive={!reduceMotion}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
