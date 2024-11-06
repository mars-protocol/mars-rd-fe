import BigNumber from 'bignumber.js'
import ChartTooltip from 'components/common/Chart/Tooltip/ChartTooltip'
import ChartLegend from 'components/common/Chart/Legend/ChartLegend'
import DisplayCurrency from 'components/common/DisplayCurrency'
import moment from 'moment'
import React from 'react'
import Text from 'components/common/Text'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { BNCoin } from 'types/classes/BNCoin'
import { formatValue } from 'utils/formatters'
import { ORACLE_DENOM } from 'constants/oracle'

interface Props {
  data: BarChartData
  height?: string
  dataKeys: { [key: string]: string }
}

interface BarTooltipContentProps {
  payload: ChartDataPayloadProps[]
  dataKeys: { [key: string]: string }
}

// function TooltipContent(props: BarTooltipContentProps) {
//   const { payload, dataKeys } = props

//   return Object.entries(dataKeys).map(([key, label]) => {
//     const amount = payload.find((p) => p.dataKey === label)?.value ?? 0
//     const value = BNCoin.fromDenomAndBigNumber(ORACLE_DENOM, new BigNumber(amount))

//     return (
//       <div key={key} className='flex space-x-1'>
//         <Text size='xs'>{label}: </Text>
//         <DisplayCurrency coin={value} className='text-xs' />
//       </div>
//     )
//   })
// }

const data = [
  { name: 'short', value: 65 },
  { name: 'long', value: 35 },
]

const COLORS = ['#0088FE', '#00C49F']

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text x={x} y={y} fill='white' textAnchor={x > cx ? 'start' : 'end'} dominantBaseline='central'>
      {`${(percent * 100).toFixed(0)}% ${data[index].name}`}
    </text>
  )
}

export default function PieChartBody() {
  // const { data, height, dataKeys } = props

  return (
    <div className='h-100 w-full'>
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart width={400} height={400}>
          <Pie
            dataKey='value'
            startAngle={180}
            endAngle={0}
            labelLine={false}
            data={data}
            cx='50%'
            cy='50%'
            // outerRadius={80}
            fill='#8884d8'
            label={renderCustomizedLabel}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Text size='lg' className='text-center'>
            Skew Interest
          </Text>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
