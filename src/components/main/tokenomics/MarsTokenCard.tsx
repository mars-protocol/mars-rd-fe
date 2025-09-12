import Card from 'components/common/Card'
import DisplayCurrency from 'components/common/DisplayCurrency'
import { Copy } from 'components/common/Icons'
import Loading from 'components/common/Loading'
import Text from 'components/common/Text'
import { BN_ZERO } from 'constants/math'
import { ORACLE_DENOM } from 'constants/oracle'
import useMarsTokenPrice from 'hooks/tokenomics/useMarsTokenPrice'
import useTokenomicsData from 'hooks/tokenomics/useTokenomicsData'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import { BNCoin } from 'types/classes/BNCoin'

export default function MarsTokenCard() {
  const [copiedDenom, setCopiedDenom] = useState(false)
  const { data: marsTokenPriceData, isLoading: isLoadingMarsTokenPrice } = useMarsTokenPrice()
  const { data: tokenomicsData, isLoading: isLoadingTokenomicsData } = useTokenomicsData('30')

  const marsTokenPrice = marsTokenPriceData ?? BN_ZERO

  // Calculate price change
  const priceChange = useMemo(() => {
    if (!tokenomicsData?.data.price_usd?.length) return null

    const prices = tokenomicsData.data.price_usd
    const currentPrice = prices[0].value_usd

    // Use previous price if we have multiple data points, otherwise use fallback
    const previousPrice = prices.length > 1 ? prices[1].value_usd : 0.02152152

    const change = currentPrice - previousPrice
    const changePercent = (change / previousPrice) * 100

    return {
      absoluteChange: change,
      percentChange: changePercent,
      isPositive: change >= 0,
    }
  }, [tokenomicsData])

  const isLoading = isLoadingMarsTokenPrice || isLoadingTokenomicsData

  const copyDenom = async () => {
    const denom = 'factory/neutron1ndu2wvkrxtane8se2tr48gv7nsm46y5gcqjhux/MARS'
    try {
      await navigator.clipboard.writeText(denom)
      setCopiedDenom(true)
      setTimeout(() => setCopiedDenom(false), 2000)
    } catch (err) {
      console.error('Failed to copy denom:', err)
    }
  }

  // Render cards with placeholders to avoid layout shift

  return (
    <div className='space-y-4 w-full'>
      {/* Header card moved to TokenomicsMetrics */}

      {/* MARS Token Card */}
      <Card className='p-6 bg-white/5'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center space-x-4'>
            <div className='flex justify-center items-center w-16 h-16 rounded-full'>
              <Image
                src='/token/MARS.svg'
                alt='MARS Token'
                width={64}
                height={64}
                className='rounded-full'
              />
            </div>
            <div>
              <div className='flex items-center space-x-2'>
                <Text size='xl' className='font-bold text-white'>
                  Mars Protocol
                </Text>
                <Text size='lg' className='font-medium text-white/60'>
                  MARS
                </Text>
              </div>
              <div className='flex items-center mt-1 space-x-2'>
                <Text size='sm' className='font-mono text-white/60'>
                  factory/neutron1ndu2wvkrxtane8se2tr48gv7nsm46y5gcqjhux/MARS
                </Text>
                <button
                  onClick={copyDenom}
                  className='p-1 rounded transition-colors hover:bg-white/10'
                  title='Copy denom'
                >
                  <Copy className='w-4 h-4 text-white/60 hover:text-white' />
                </button>
                {copiedDenom && (
                  <Text size='xs' className='text-primary'>
                    Copied!
                  </Text>
                )}
              </div>
            </div>
          </div>
          <div className='text-right'>
            {isLoading ? (
              <Loading className='w-40 h-10' />
            ) : (
              <DisplayCurrency
                coin={BNCoin.fromDenomAndBigNumber(ORACLE_DENOM, marsTokenPrice)}
                className='text-3xl font-semibold text-white'
                options={{ maxDecimals: 4, minDecimals: 4 }}
              />
            )}
            {isLoading ? (
              <Loading className='mt-2 w-48 h-4' />
            ) : (
              priceChange && (
                <div className='flex justify-end items-center mt-1 space-x-2'>
                  <Text
                    size='sm'
                    className={`font-medium ${
                      priceChange.isPositive ? 'text-profit' : 'text-loss'
                    }`}
                  >
                    {priceChange.isPositive ? '+' : ''}
                    {priceChange.percentChange.toFixed(2)}% ($
                    {priceChange.absoluteChange.toFixed(5)})
                  </Text>
                </div>
              )
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
