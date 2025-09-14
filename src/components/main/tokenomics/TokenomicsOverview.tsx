import Card from 'components/common/Card'
import { FormattedNumber } from 'components/common/FormattedNumber'
import { Copy } from 'components/common/Icons'
import Loading from 'components/common/Loading'
import Text from 'components/common/Text'
import { CHART_COLORS } from 'constants/chartData'
import { BN_ZERO, MRC_98_BURN_AMOUNT } from 'constants/math'
import useCirculatingSupply from 'hooks/tokenomics/useCirculatingSupply'
import useTokenomicsData from 'hooks/tokenomics/useTokenomicsData'
import useTotalSupply from 'hooks/tokenomics/useTotalSupply'
import Image from 'next/image'
import { useCallback, useMemo, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { BN } from 'utils/helpers'

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

/**
 * TokenomicsOverview - Comprehensive view of MARS token distribution and pricing
 *
 * Features:
 * - Token price and price change display
 * - Multi-step supply calculation breakdown
 * - Interactive donut chart with gradients
 * - Responsive design for mobile and desktop
 */
export default function TokenomicsOverview() {
  const [copiedDenom, setCopiedDenom] = useState(false)

  // Data hooks
  const { data: circulatingSupplyData, isLoading: isLoadingCirculatingSupply } =
    useCirculatingSupply()
  const { data: totalSupplyData, isLoading: isLoadingTotalSupply } = useTotalSupply()
  const { data: tokenomicsData, isLoading: isLoadingTokenomicsData } = useTokenomicsData('30')

  // Computed values
  const circulatingSupply = circulatingSupplyData ?? 0
  const totalSupply = totalSupplyData ?? 0
  const isLoading = isLoadingCirculatingSupply || isLoadingTotalSupply || isLoadingTokenomicsData

  // MARS token price calculation
  const marsTokenPrice = useMemo(() => {
    if (!tokenomicsData?.data?.price_usd?.length) return BN_ZERO
    return BN(tokenomicsData.data.price_usd[0].value_usd)
  }, [tokenomicsData])

  // Price change calculation
  const priceChange = useMemo((): PriceChange | null => {
    if (!tokenomicsData?.data.price_usd?.length) return null

    const prices = tokenomicsData.data.price_usd
    const currentPrice = prices[0].value_usd
    const previousPrice = prices.length > 1 ? prices[1].value_usd : 0.02152152

    const change = currentPrice - previousPrice
    const changePercent = (change / previousPrice) * 100

    return {
      absoluteChange: change,
      percentChange: changePercent,
      isPositive: change >= 0,
    }
  }, [tokenomicsData])

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

  // Event handlers
  const copyDenom = async () => {
    try {
      await navigator.clipboard.writeText(DENOM)
      setCopiedDenom(true)
      setTimeout(() => setCopiedDenom(false), 2000)
    } catch (err) {
      console.error('Failed to copy denom:', err)
    }
  }

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
    <Card className='p-6 h-full bg-white/5'>
      <div className='flex flex-col space-y-6 h-full'>
        {/* Header: Token Info and Price */}
        <div className='flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0'>
          <div className='flex items-center space-x-4'>
            <div className='flex flex-shrink-0 justify-center items-center w-16 h-16 rounded-full'>
              <Image
                src='/token/MARS.svg'
                alt='MARS Token'
                width={64}
                height={64}
                className='rounded-full'
              />
            </div>
            <div className='flex-1'>
              <div className='flex items-center space-x-3'>
                <Text size='xl' className='font-bold text-white'>
                  Mars Protocol
                </Text>
                <Text size='lg' className='font-medium text-white/60'>
                  MARS
                </Text>
              </div>
              <div className='flex items-center mt-1 space-x-2'>
                <Text size='xs' className='font-mono truncate text-white/50 max-w-[300px]'>
                  {DENOM}
                </Text>
                <button
                  onClick={copyDenom}
                  className='flex-shrink-0 p-1 rounded transition-colors hover:bg-white/10'
                  title='Copy denom'
                  type='button'
                >
                  <Copy className='w-3 h-3 text-white/50 hover:text-white' />
                </button>
                {copiedDenom && (
                  <Text size='xs' className='whitespace-nowrap text-primary'>
                    Copied!
                  </Text>
                )}
              </div>
            </div>
          </div>

          {/* Price Section */}
          <div className='text-center lg:text-right'>
            {isLoading || marsTokenPrice.isEqualTo(BN_ZERO) ? (
              <div className='space-y-2'>
                <Loading className='w-32 h-8' />
                <Loading className='w-24 h-4' />
              </div>
            ) : (
              <div className='space-y-1'>
                <FormattedNumber
                  amount={marsTokenPrice.toNumber()}
                  className='text-4xl font-bold text-white'
                  options={{
                    maxDecimals: 4,
                    minDecimals: 4,
                    prefix: '$',
                  }}
                />
                {priceChange && (
                  <div className='flex justify-center items-center space-x-2 lg:justify-end'>
                    <Text
                      size='base'
                      className={`font-semibold ${
                        priceChange.isPositive ? 'text-profit' : 'text-loss'
                      }`}
                    >
                      {priceChange.isPositive ? '+' : ''}
                      {priceChange.percentChange.toFixed(2)}%
                    </Text>
                    <Text size='sm' className='text-white/60'>
                      (${priceChange.absoluteChange.toFixed(5)})
                    </Text>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

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
                          size='sm'
                          className={`font-medium text-white/90 ${item.isBold ? 'font-bold text-white' : ''}`}
                        >
                          {item.label}
                        </Text>
                      </div>
                      <FormattedNumber
                        amount={item.value}
                        className={`text-sm text-white ${item.isBold ? 'font-bold' : ''}`}
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
      </div>
    </Card>
  )
}
