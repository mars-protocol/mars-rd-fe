import classNames from 'classnames'
import Card from 'components/common/Card'
import { FormattedNumber } from 'components/common/FormattedNumber'
import Loading from 'components/common/Loading'
import Text from 'components/common/Text'
import MarsTokenCard from 'components/main/tokenomics/MarsTokenCard'
import { CHART_COLORS } from 'constants/chartData'
import { MRC_98_BURN_AMOUNT } from 'constants/math'
import useCirculatingSupply from 'hooks/tokenomics/useCirculatingSupply'
import useStakedSupply from 'hooks/tokenomics/useStakedSupply'
import useTokenomicsData from 'hooks/tokenomics/useTokenomicsData'
import useTotalSupply from 'hooks/tokenomics/useTotalSupply'
import { useCallback, useMemo } from 'react'
import { Cell, Pie, PieChart, PieLabelRenderProps, ResponsiveContainer } from 'recharts'

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
  [key: string]: unknown
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
  const { data: stakedSupplyData, isLoading: isLoadingStakedSupply } = useStakedSupply()
  const { data: totalSupplyData, isLoading: isLoadingTotalSupply } = useTotalSupply()
  const { data: tokenomicsData, isLoading: isLoadingTokenomicsData } = useTokenomicsData('30')

  // Computed values
  const circulatingSupply = circulatingSupplyData ?? 0
  const stakedSupply = stakedSupplyData ?? 0
  const totalSupply = totalSupplyData ?? 0
  const isLoading =
    isLoadingCirculatingSupply ||
    isLoadingStakedSupply ||
    isLoadingTotalSupply ||
    isLoadingTokenomicsData

  // Supply calculations
  const totalBurnedSupply = useMemo(() => {
    if (!tokenomicsData?.data?.burned_supply?.length) return MRC_98_BURN_AMOUNT
    return parseFloat(tokenomicsData.data.burned_supply[0].amount) + MRC_98_BURN_AMOUNT
  }, [tokenomicsData])

  const nonCirculatingSupply = useMemo(() => {
    return Math.max(0, totalSupply - circulatingSupply)
  }, [totalSupply, circulatingSupply])

  const unstakedCirculatingSupply = useMemo(() => {
    return Math.max(0, circulatingSupply - stakedSupply)
  }, [circulatingSupply, stakedSupply])

  // Stable pie chart data structure - only values change, structure stays the same
  const pieData = useMemo((): PieDataItem[] => {
    // Create stable objects with consistent keys to prevent re-renders
    const data = [
      {
        name: 'Non-Staked',
        shortName: 'Non-Staked',
        value: unstakedCirculatingSupply,
        color: CHART_COLORS.primary,
        gradientId: 'circulating-gradient',
      },
      {
        name: 'Staked Supply',
        shortName: 'Staked Circulating',
        value: stakedSupply,
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
  }, [unstakedCirculatingSupply, stakedSupply, nonCirculatingSupply, totalBurnedSupply])

  // Stable label name mapping to prevent re-renders
  const labelMapping = useMemo(
    () => ({
      'Non-Staked': 'Non-Staked',
      'Staked Supply': 'Staked',
      'Vested/Locked/DAO': 'Vested/Locked',
      'Burned Supply': 'Burned',
    }),
    [],
  )

  // Custom label renderer for donut chart - memoized to prevent re-renders
  const renderCustomizedLabel = useCallback(
    (props: PieLabelRenderProps) => {
      const { cx, cy, midAngle, outerRadius, percent, name } = props

      if (!cx || !cy || midAngle === undefined || !outerRadius || percent === undefined || !name)
        return null
      if (typeof percent === 'number' && percent < 0.03) return null // Don't show label if slice is too small

      const RADIAN = Math.PI / 180
      const radius = (outerRadius as number) + CHART_CONFIG.labelRadius
      const x = (cx as number) + radius * Math.cos(-(midAngle as number) * RADIAN)
      const y = (cy as number) + radius * Math.sin(-(midAngle as number) * RADIAN)

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
            {`${(Number(percent) * 100).toFixed(1)}%`}
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
        className: 'p-1 bg-gradient-to-r from-purple-500/20 to-purple-500/10',
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
        className: 'p-1 bg-gradient-to-r from-purple-400/20 to-purple-400/10',
        colorDot: CHART_COLORS.secondary,
        showDivider: false,
      },
      {
        label: 'Circulating Supply',
        value: circulatingSupply,
        className: 'p-1',
        isBold: true,
        showDivider: false,
      },
      {
        label: ' ↳ Non-Staked',
        value: unstakedCirculatingSupply,
        className: 'pl-4 pr-1 py-1 bg-gradient-to-r from-green-500/20 to-green-500/10',
        colorDot: CHART_COLORS.primary,
        showDivider: false,
        isSubItem: true,
      },
      {
        label: ' ↳ Staked',
        value: stakedSupply,
        className: 'pl-4 pr-1 py-1 bg-gradient-to-r from-green-500/15 to-green-500/8',
        colorDot: CHART_COLORS.primary,
        showDivider: false,
        isSubItem: true,
      },
    ],
    [
      totalBurnedSupply,
      totalSupply,
      nonCirculatingSupply,
      circulatingSupply,
      unstakedCirculatingSupply,
      stakedSupply,
    ],
  )

  return (
    <Card className='p-4 h-full md:p-6 bg-surface-light'>
      <MarsTokenCard />
      {/* Supply Breakdown and Chart Section */}
      <div className='flex flex-col p-4 pb-0 space-y-6 lg:flex-row lg:space-x-8 lg:space-y-0 bg-white/5'>
        {/* Left: Multi-step Calculation */}
        <div className='flex-1 space-y-4'>
          <Text size='lg' className='pt-4 font-bold text-white'>
            Token Supply Breakdown
          </Text>

          {isLoading ? (
            <div className='space-y-3 pb-4'>
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i}>
                  <div
                    className={`flex justify-between items-center p-1 ${i === 1 || i === 3 || i === 5 || i === 6 ? 'bg-gradient-to-r from-white/5 to-white/2' : ''}`}
                  >
                    <div className='flex items-center space-x-2'>
                      {/* Color dot placeholder for items that have them */}
                      {(i === 1 || i === 3 || i === 5 || i === 6) && (
                        <div className='w-2 h-2 rounded-full bg-white/20' />
                      )}
                      <Loading className='w-32 h-4' />
                    </div>
                    <Loading className='w-20 h-4' />
                  </div>
                  {/* Divider after "Burned Supply" item (index 1) */}
                  {i === 1 && <div className='my-2 border-t border-white/20' />}
                </div>
              ))}
            </div>
          ) : (
            <div className='space-y-3 pb-4'>
              {supplyBreakdownItems.map((item, index) => (
                <div key={item.label}>
                  <div className={classNames('flex justify-between items-center', item.className)}>
                    <div className='flex items-center space-x-2'>
                      {item.colorDot && (
                        <div
                          className='w-2 h-2 rounded-full'
                          style={{ backgroundColor: item.colorDot }}
                        />
                      )}
                      <Text
                        className={classNames(
                          'text-xs md:text-sm',
                          item.isSubItem ? 'text-white/70' : 'text-white/90',
                          item.isBold ? 'font-bold text-white' : '',
                        )}
                      >
                        {item.label}
                      </Text>
                    </div>
                    <FormattedNumber
                      amount={item.value}
                      className={classNames(
                        'text-xs md:text-sm',
                        item.isSubItem ? 'text-white/70' : 'text-white',
                        item.isBold ? 'font-bold' : '',
                      )}
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
