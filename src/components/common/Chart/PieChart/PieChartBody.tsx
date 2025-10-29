import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts'

interface PieChartData {
  name: string
  value: number
  color: string
  [key: string]: unknown
}

interface Props {
  data: PieChartData[]
  height?: string
}

const RADIAN = Math.PI / 180

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  if (percent < 0.05) return null // Don't show label if slice is too small

  return (
    <text
      x={x}
      y={y}
      fill='white'
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline='central'
      fontSize={12}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  )
}

export default function PieChartBody({ data, height = 'h-80' }: Props) {
  return (
    <div className={`w-full ${height} flex items-center justify-center`}>
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart>
          <Pie
            data={data}
            cx='50%'
            cy='45%'
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius='80%'
            innerRadius='0%'
            fill='#8884d8'
            dataKey='value'
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend
            verticalAlign='bottom'
            height={60}
            wrapperStyle={{
              paddingTop: '10px',
              fontSize: '12px',
            }}
            formatter={(value, entry) => (
              <span style={{ color: entry.color, fontWeight: 600, fontSize: '12px' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
