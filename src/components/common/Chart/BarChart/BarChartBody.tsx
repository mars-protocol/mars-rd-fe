// import ChartTooltip from 'components/common/Chart/common/Tooltip/ChartTooltip'
// import ChartLegend from 'components/common/Chart/common/Legend/ChartLegend'
// import DisplayCurrency from 'components/common/DisplayCurrency'
// import moment from 'moment'
// import React from 'react'
// import Text from 'components/common/Text'
// import {
//   Bar,
//   BarChart,
//   CartesianGrid,
//   Legend,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from 'recharts'
// import { BNCoin } from 'types/classes/BNCoin'
// import { formatValue } from 'utils/formatters'
// import { PRICE_ORACLE_DECIMALS } from 'constants/query'
// import { BN } from 'utils/helpers'

// interface Props {
//   data: any[]
//   // data: BarChartData
//   height?: number
//   dataKeys: { [key: string]: string }
//   stacked?: boolean
// }

// interface BarTooltipContentProps {
//   payload: ChartDataPayloadProps[]
//   dataKeys: { [key: string]: string }
// }

// function TooltipContent(props: BarTooltipContentProps) {
//   const { payload, dataKeys } = props

//   return Object.entries(dataKeys).map(([key, label]) => {
//     const amount = payload.find((p) => p.dataKey === label)?.value ?? 0
//     // const value = BNCoin.fromDenomAndBigNumber(ORACLE_DENOM, new BigNumber(amount))

//     return (
//       <div key={key} className='flex space-x-1'>
//         <Text size='xs'>{label}: </Text>
//         <Text size='xs'>{payload.value}</Text>

//         {/* <DisplayCurrency
//           coin={BNCoin.fromDenomAndBigNumber('usd', BN(amount).shiftedBy(-PRICE_ORACLE_DECIMALS))}
//           className='text-xs'
//         /> */}
//       </div>
//     )
//   })
// }

// export default function BarChartBody(props: Props) {
//   const { data, height = 400, dataKeys, stacked = true } = props
//   return (
//     <div className='h-full w-full'>
//       <ResponsiveContainer width='100%' height={height}>
//         <BarChart
//           data={data}
//           margin={{
//             top: 0,
//             right: 0,
//             left: 0,
//             bottom: 0,
//           }}
//         >
//           <CartesianGrid
//             horizontal={false}
//             stroke='rgba(255,255,255,0.1)'
//             strokeDasharray='6 3'
//             syncWithTicks={true}
//           />
//           <XAxis
//             dataKey='date'
//             stroke='rgba(255, 255, 255, 0.4)'
//             fontSize={12}
//             axisLine={false}
//             tickLine={false}
//             tickFormatter={(value) => {
//               return moment(value).format('DD MMM')
//             }}
//           />
//           <YAxis
//             orientation='right'
//             fontSize={12}
//             tickCount={4}
//             axisLine={false}
//             tickLine={false}
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
//             cursor={{
//               stroke: 'rgba(255, 255, 255, 0.1)',
//               strokeWidth: 2,
//               fill: 'rgba(255, 255, 255, 0.1)',
//             }}
//             content={
//               <ChartTooltip
//                 payload={[]}
//                 label={''}
//                 renderContent={(payload) => TooltipContent({ payload, dataKeys: props.dataKeys })}
//               />
//             }
//           />
//           <Legend content={<ChartLegend payload={[]} />} verticalAlign='bottom' />

//           <Bar
//             dataKey={dataKeys.valueOne}
//             fill='rgba(171, 66, 188, 0.5)'
//             legendType='plainline'
//             stackId={stacked ? 'a' : undefined}
//             maxBarSize={24}
//             activeBar={{ stroke: 'rgba(255, 255, 255, 0.1)', strokeWidth: 2 }}
//           />
//           <Bar
//             dataKey={dataKeys.valueTwo}
//             fill='rgb(255, 82, 82, 0.7)'
//             stackId={stacked ? 'a' : undefined}
//             legendType='plainline'
//             maxBarSize={24}
//             activeBar={{ stroke: 'rgba(255, 255, 255, 0.1)', strokeWidth: 2 }}
//           />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   )
// }
import ChartTooltip from 'components/common/Chart/common/Tooltip/ChartTooltip'
import ChartLegend from 'components/common/Chart/common/Legend/ChartLegend'
import DisplayCurrency from 'components/common/DisplayCurrency'
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
import { PRICE_ORACLE_DECIMALS } from 'constants/query'
import { BN } from 'utils/helpers'
import { Circle } from 'components/common/Icons'

interface SeriesConfig {
  key: string
  dataKey: string
  displayName: string
  color: string
  isPercentage?: boolean
}

interface Props {
  data: any[]
  height?: number
  series: SeriesConfig[]
  stacked?: boolean
}

interface BarTooltipContentProps {
  payload: any[]
  series: SeriesConfig[]
}

function TooltipContent(props: BarTooltipContentProps) {
  const { payload, series } = props

  return series.map((data) => {
    const entry = payload.find((p) => p.dataKey === data.dataKey)
    const amount = entry?.value ?? 0
    const value = data.isPercentage ? amount * 100 : amount

    return (
      <div key={data.key} className='flex items-center gap-1'>
        <Circle className='fill-current h-2 w-2' color={data.color} />
        <Text size='xs'>{data.displayName}: </Text>
        <Text size='xs'>
          {data.isPercentage
            ? `${value.toFixed(2)}%`
            : formatValue(value, {
                minDecimals: 0,
                maxDecimals: 2,
                prefix: '$',
                abbreviated: true,
              })}
        </Text>
      </div>
    )
  })
}

export default function BarChartBody(props: Props) {
  const { data, height = 400, series, stacked = true } = props

  const legendPayload = series.map((seriesConfig) => ({
    dataKey: seriesConfig.dataKey,
    inactive: false,
    type: 'plainline',
    color: seriesConfig.color,
    value: seriesConfig.displayName,
  }))
  console.log(legendPayload, 'legendPayload')

  return (
    <div className='h-full -ml-6'>
      <ResponsiveContainer width='100%' height={height}>
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            {series.map((seriesConfig) => (
              <linearGradient
                id={`gradient-${seriesConfig.key}`}
                x1='0'
                y1='0'
                x2='0'
                y2='1'
                key={seriesConfig.key}
              >
                <stop offset='0%' stopColor={seriesConfig.color} stopOpacity={0.6} />
                <stop offset='100%' stopColor={seriesConfig.color} stopOpacity={0.1} />
              </linearGradient>
            ))}
          </defs>

          <CartesianGrid
            horizontal={false}
            stroke='rgba(255,255,255,0.1)'
            strokeDasharray='6 3'
            syncWithTicks={true}
          />
          <XAxis
            dataKey='date'
            stroke='rgba(255, 255, 255, 0.4)'
            fontSize={10}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => moment(value).format('DD MMM')}
          />
          <YAxis
            orientation='left'
            fontSize={10}
            tickCount={6}
            {...(series[0]?.isPercentage && { domain: [0, 1.0] })}
            axisLine={false}
            tickLine={false}
            stroke='rgba(255, 255, 255, 0.4)'
            tickFormatter={(value) => {
              if (series[0]?.isPercentage) {
                return `${(value * 100).toFixed(0)}%`
              }
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
            cursor={{
              stroke: 'rgba(255, 255, 255, 0.1)',
              strokeWidth: 2,
              fill: 'rgba(255, 255, 255, 0.1)',
            }}
            content={
              <ChartTooltip
                payload={[]}
                label={''}
                renderContent={(payload) => TooltipContent({ payload, series })}
              />
            }
          />
          <Legend content={<ChartLegend payload={legendPayload} />} verticalAlign='top' />

          {series.map((seriesConfig, index) => (
            <Bar
              key={seriesConfig.key}
              dataKey={seriesConfig.dataKey}
              name={seriesConfig.displayName}
              fill={stacked ? seriesConfig.color : `url(#gradient-${seriesConfig.key})`}
              stackId={stacked ? 'a' : undefined}
              maxBarSize={24}
              stroke={seriesConfig.color}
              activeBar={{ stroke: 'rgba(255, 255, 255, 0.1)', strokeWidth: 2 }}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
