import { Cell, Legend, Pie, PieChart, PieLabelRenderProps, ResponsiveContainer } from 'recharts'

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

const renderCustomizedLabel = (props: PieLabelRenderProps) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props

  // Type guards for numeric properties
  const cxNum = typeof cx === 'number' ? cx : 0
  const cyNum = typeof cy === 'number' ? cy : 0
  const midAngleNum = typeof midAngle === 'number' ? midAngle : 0
  const innerRadiusNum = typeof innerRadius === 'number' ? innerRadius : 0
  const outerRadiusNum = typeof outerRadius === 'number' ? outerRadius : 0
  const percentNum = typeof percent === 'number' ? percent : 0

  const radius = innerRadiusNum + (outerRadiusNum - innerRadiusNum) * 0.5
  const x = cxNum + radius * Math.cos(-midAngleNum * RADIAN)
  const y = cyNum + radius * Math.sin(-midAngleNum * RADIAN)

  if (percentNum < 0.05) return null // Don't show label if slice is too small

  return (
    <text
      x={x}
      y={y}
      fill='white'
      textAnchor={x > cxNum ? 'start' : 'end'}
      dominantBaseline='central'
      fontSize={12}
      fontWeight={600}
    >
      {`${(percentNum * 100).toFixed(1)}%`}
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
