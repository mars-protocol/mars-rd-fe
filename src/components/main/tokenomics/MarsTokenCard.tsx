import Card from 'components/common/Card'
import { FormattedNumber } from 'components/common/FormattedNumber'
import { Copy } from 'components/common/Icons'
import Loading from 'components/common/Loading'
import Text from 'components/common/Text'
import { BN_ZERO } from 'constants/math'
import useTokenomicsData from 'hooks/tokenomics/useTokenomicsData'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import { BN } from 'utils/helpers'
const denom = 'factory/neutron1ndu2wvkrxtane8se2tr48gv7nsm46y5gcqjhux/MARS'
export default function MarsTokenCard() {
  const [copiedDenom, setCopiedDenom] = useState(false)
  const { data: tokenomicsData, isLoading: isLoadingTokenomicsData } = useTokenomicsData('30')

  // Get the latest MARS token price from tokenomics data
  const marsTokenPrice = useMemo(() => {
    if (!tokenomicsData?.data.price_usd?.length) return BN_ZERO
    return BN(tokenomicsData.data.price_usd[0].value_usd)
  }, [tokenomicsData])

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

  const isLoading = isLoadingTokenomicsData

  const copyDenom = async () => {
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
      <Card className='p-4 sm:p-6 bg-white/5'>
        <div className='flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0'>
          <div className='flex items-center space-x-3 sm:space-x-4'>
            <div className='flex flex-shrink-0 justify-center items-center w-12 h-12 rounded-full sm:w-16 sm:h-16'>
              <Image
                src='/token/MARS.svg'
                alt='MARS Token'
                width={48}
                height={48}
                className='rounded-full sm:w-16 sm:h-16'
              />
            </div>
            <div className='flex-1 min-w-0'>
              <div className='flex items-center space-x-2'>
                <Text size='lg' className='font-bold text-white sm:text-xl'>
                  Mars Protocol
                </Text>
                <Text size='base' className='font-medium text-white/60 sm:text-lg'>
                  MARS
                </Text>
              </div>
              <div className='flex items-center mt-1 space-x-2 min-w-0'>
                <Text size='xs' className='font-mono truncate text-white/60 sm:text-sm'>
                  {denom}
                </Text>
                <button
                  onClick={copyDenom}
                  className='p-1.5 rounded transition-colors hover:bg-white/10 flex-shrink-0'
                  title='Copy denom'
                >
                  <Copy className='w-4 h-4 text-white/60 hover:text-white' />
                </button>
                {copiedDenom && (
                  <Text size='xs' className='whitespace-nowrap text-primary'>
                    Copied!
                  </Text>
                )}
              </div>
            </div>
          </div>
          <div className='text-center sm:text-right'>
            {isLoading || marsTokenPrice.isEqualTo(BN_ZERO) ? (
              <Loading className='mx-auto w-32 h-8 sm:w-40 sm:h-10 sm:mx-0' />
            ) : (
              <FormattedNumber
                amount={marsTokenPrice.toNumber()}
                className='text-2xl font-semibold text-white sm:text-3xl'
                options={{
                  maxDecimals: 4,
                  minDecimals: 4,
                  prefix: '$',
                }}
              />
            )}
            {isLoading || marsTokenPrice.isEqualTo(BN_ZERO) ? (
              <Loading className='mx-auto mt-2 w-40 h-4 sm:w-48 sm:mx-0' />
            ) : (
              priceChange && (
                <div className='flex justify-center items-center mt-1 space-x-2 sm:justify-end'>
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
