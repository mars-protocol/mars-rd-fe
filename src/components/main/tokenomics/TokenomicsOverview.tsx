import Card from 'components/common/Card'
import { FormattedNumber } from 'components/common/FormattedNumber'
import Loading from 'components/common/Loading'
import Text from 'components/common/Text'
import MarsTokenCard from 'components/main/tokenomics/MarsTokenCard'
import { CHART_COLORS } from 'constants/chartData'
import { MRC_98_BURN_AMOUNT } from 'constants/math'
import useCirculatingSupply from 'hooks/tokenomics/useCirculatingSupply'
import useTokenomicsData from 'hooks/tokenomics/useTokenomicsData'
import useTotalSupply from 'hooks/tokenomics/useTotalSupply'
import { useCallback, useMemo } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

// Constants
const DENOM = 'factory/neutron1ndu2wvkrxtane8se2tr48gv7nsm46y5gcqjhux/MARS'
const INITIAL_SUPPLY = 1_000_000_000
const CHART_CONFIG = {
  outerRadius: 90,
  innerRadius: 40,
  centerX: '50%',
  centerY: '45%',
  labelRadius: 35,
} as const

// Types
interface PieDataItem {
  name: string
  shortName: string
  value: number
  color: string
  gradientId: string
}

interface LabelProps {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
  value: number
  name: string
}

interface PriceChange {
  absoluteChange: number
  percentChange: number
  isPositive: boolean
}

export default function TokenomicsOverview() {
  // Data hooks
  const { data: circulatingSupplyData, isLoading: isLoadingCirculatingSupply } =
    useCirculatingSupply()
  const { data: totalSupplyData, isLoading: isLoadingTotalSupply } = useTotalSupply()
  const { data: tokenomicsData, isLoading: isLoadingTokenomicsData } = useTokenomicsData('30')

  // Computed values
  const circulatingSupply = circulatingSupplyData ?? 0
  const totalSupply = totalSupplyData ?? 0
  const isLoading = isLoadingCirculatingSupply || isLoadingTotalSupply || isLoadingTokenomicsData

  // Supply calculations
  const totalBurnedSupply = useMemo(() => {
    if (!tokenomicsData?.data?.burned_supply?.length) return MRC_98_BURN_AMOUNT
    return parseFloat(tokenomicsData.data.burned_supply[0].amount) + MRC_98_BURN_AMOUNT
  }, [tokenomicsData])

  const nonCirculatingSupply = useMemo(() => {
    return Math.max(0, totalSupply - circulatingSupply)
  }, [totalSupply, circulatingSupply])

  // Stable pie chart data structure - only values change, structure stays the same
  const pieData = useMemo((): PieDataItem[] => {
    // Create stable objects with consistent keys to prevent re-renders
    const data = [
      {
        name: 'Circulating Supply',
        shortName: 'Circulating',
        value: circulatingSupply,
        color: CHART_COLORS.primary,
        gradientId: 'circulating-gradient',
      },
      {
        name: 'Vested/Locked/DAO',
        shortName: 'Vested/Locked',
        value: nonCirculatingSupply,
        color: CHART_COLORS.secondary,
        gradientId: 'vested-gradient',
      },
      {
        name: 'Burned Supply',
        shortName: 'Burned',
        value: totalBurnedSupply,
        color: CHART_COLORS.quinary,
        gradientId: 'burned-gradient',
      },
    ]

    // Only return new array if values actually changed significantly
    return data
  }, [circulatingSupply, nonCirculatingSupply, totalBurnedSupply])

  // Stable label name mapping to prevent re-renders
  const labelMapping = useMemo(
    () => ({
      'Circulating Supply': 'Circulating',
      'Vested/Locked/DAO': 'Vested/Locked',
      'Burned Supply': 'Burned',
    }),
    [],
  )

  // Custom label renderer for donut chart - memoized to prevent re-renders
  const renderCustomizedLabel = useCallback(
    (props: LabelProps) => {
      const { cx, cy, midAngle, outerRadius, percent, name } = props

      if (percent < 0.03) return null // Don't show label if slice is too small

      const RADIAN = Math.PI / 180
      const radius = outerRadius + CHART_CONFIG.labelRadius
      const x = cx + radius * Math.cos(-midAngle * RADIAN)
      const y = cy + radius * Math.sin(-midAngle * RADIAN)

      const displayName = labelMapping[name as keyof typeof labelMapping] || name

      return (
        <g key={`label-${name}`}>
          {/* Label text with shadow effect */}
          <text
            x={x}
            y={y - 6}
            fill='#FFFFFF50'
            textAnchor='middle'
            dominantBaseline='central'
            fontSize={12}
            fontWeight={700}
            stroke='rgba(0,0,0,0.5)'
            strokeWidth={0.5}
            paintOrder='stroke fill'
          >
            {displayName}
          </text>
          {/* Percentage text with shadow effect */}
          <text
            x={x}
            y={y + 12}
            fill='rgba(255,255,255,0.9)'
            textAnchor='middle'
            dominantBaseline='central'
            fontSize={10}
            fontWeight={600}
            stroke='rgba(0,0,0,0.4)'
            strokeWidth={0.3}
            paintOrder='stroke fill'
          >
            {`${(percent * 100).toFixed(1)}%`}
          </text>
        </g>
      )
    },
    [labelMapping],
  )

  // Supply breakdown items
  const supplyBreakdownItems = useMemo(
    () => [
      {
        label: 'Initial Supply',
        value: INITIAL_SUPPLY,
        className: 'px-1',
        showDivider: false,
      },
      {
        label: 'Burned Supply',
        value: totalBurnedSupply,
        className: 'p-1 bg-gradient-to-r rounded-lg from-purple-500/20 to-purple-500/10',
        colorDot: CHART_COLORS.quinary,
        showDivider: true,
      },
      {
        label: 'Total Supply',
        value: totalSupply,
        className: 'p-1',
        isBold: true,
        showDivider: false,
      },
      {
        label: 'Vested/Locked/DAO',
        value: nonCirculatingSupply,
        className: 'p-1 bg-gradient-to-r rounded-lg from-purple-400/20 to-purple-400/10',
        colorDot: CHART_COLORS.secondary,
        showDivider: false,
      },
      {
        label: 'Circulating Supply',
        value: circulatingSupply,
        className: 'p-1 bg-gradient-to-r rounded-lg from-green-500/20 to-green-500/10',
        colorDot: CHART_COLORS.primary,
        showDivider: false,
      },
    ],
    [totalBurnedSupply, totalSupply, nonCirculatingSupply, circulatingSupply],
  )

  return (
    <Card className='p-4 h-full md:p-6 bg-white/5'>
      <MarsTokenCard />
      {/* Supply Breakdown and Chart Section */}
      <div className='flex flex-col p-4 pb-0 space-y-6 rounded-xl lg:flex-row lg:space-x-8 lg:space-y-0 bg-white/5'>
        {/* Left: Multi-step Calculation */}
        <div className='flex-1 space-y-4'>
          <Text size='lg' className='pt-4 font-bold text-white'>
            Token Supply Breakdown
          </Text>

          {isLoading ? (
            <div className='space-y-3'>
              {Array.from({ length: 5 }).map((_, i) => (
                <Loading key={i} className='w-full h-6' />
              ))}
            </div>
          ) : (
            <div className='space-y-3'>
              {supplyBreakdownItems.map((item, index) => (
                <div key={item.label}>
                  <div className={`flex justify-between items-center ${item.className}`}>
                    <div className='flex items-center space-x-2'>
                      {item.colorDot && (
                        <div
                          className='w-2 h-2 rounded-full'
                          style={{ backgroundColor: item.colorDot }}
                        />
                      )}
                      <Text
                        className={`text-xs md:text-sm text-white/90 ${item.isBold ? 'font-bold text-white' : ''}`}
                      >
                        {item.label}
                      </Text>
                    </div>
                    <FormattedNumber
                      amount={item.value}
                      className={`text-xs md:text-sm text-white ${item.isBold ? 'font-bold' : ''}`}
                      options={{ abbreviated: false, suffix: ' MARS' }}
                    />
                  </div>
                  {item.showDivider && <div className='my-2 border-t border-white/20' />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Donut Chart */}
        <div className='flex flex-1 justify-center items-center'>
          {isLoading ? (
            <Loading className='w-48 h-48' />
          ) : (
            <div className='w-full h-80'>
              <ResponsiveContainer width='100%' height='100%' key='stable-chart-container'>
                <PieChart key='stable-pie-chart'>
                  <defs>
                    {/* Linear gradient definitions */}
                    <linearGradient id='circulating-gradient' x1='0%' y1='0%' x2='100%' y2='100%'>
                      <stop offset='0%' stopColor={CHART_COLORS.primary} stopOpacity={0.7} />
                      <stop offset='50%' stopColor={CHART_COLORS.primary} stopOpacity={0.6} />
                      <stop offset='100%' stopColor={CHART_COLORS.primary} stopOpacity={0.5} />
                    </linearGradient>
                    <linearGradient id='vested-gradient' x1='0%' y1='0%' x2='100%' y2='100%'>
                      <stop offset='0%' stopColor={CHART_COLORS.secondary} stopOpacity={0.7} />
                      <stop offset='50%' stopColor={CHART_COLORS.secondary} stopOpacity={0.6} />
                      <stop offset='100%' stopColor={CHART_COLORS.secondary} stopOpacity={0.5} />
                    </linearGradient>
                    <linearGradient id='burned-gradient' x1='0%' y1='0%' x2='100%' y2='100%'>
                      <stop offset='0%' stopColor={CHART_COLORS.quinary} stopOpacity={0.7} />
                      <stop offset='50%' stopColor={CHART_COLORS.quinary} stopOpacity={0.6} />
                      <stop offset='100%' stopColor={CHART_COLORS.quinary} stopOpacity={0.5} />
                    </linearGradient>
                  </defs>
                  <Pie
                    data={pieData}
                    cx={CHART_CONFIG.centerX}
                    cy={CHART_CONFIG.centerY}
                    outerRadius={CHART_CONFIG.outerRadius}
                    innerRadius={CHART_CONFIG.innerRadius}
                    fill='#8884d8'
                    dataKey='value'
                    stroke='#FFFFFF00'
                    strokeWidth={10}
                    paddingAngle={10}
                    label={renderCustomizedLabel}
                    labelLine={false}
                  >
                    {pieData.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={`url(#${entry.gradientId})`} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
