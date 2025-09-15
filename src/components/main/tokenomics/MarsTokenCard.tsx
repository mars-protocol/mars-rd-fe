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
    <>
      <div className='flex flex-wrap gap-4 justify-between pb-4 w-full h-full lg:gap-6'>
        <div className='flex flex-wrap gap-4 w-full sm:flex-row sm:justify-between sm:items-start sm:space-y-0'>
          <div className='flex flex-1 gap-3 items-center sm:gap-4'>
            <div className='flex flex-shrink-0 justify-center items-center w-12 h-12 rounded-full sm:w-16 sm:h-16'>
              <Image
                src='/token/MARS.svg'
                alt='MARS Token'
                width={48}
                height={48}
                className='rounded-full sm:w-16 sm:h-16'
              />
            </div>
            <div className='flex flex-wrap w-full'>
              <div className='flex gap-2 items-center w-full'>
                <Text size='lg' className='font-bold text-white sm:text-xl'>
                  Mars Protocol
                </Text>
                <Text size='base' className='font-medium text-white/60 sm:text-lg'>
                  MARS
                </Text>
              </div>
              <div className='flex gap-2 items-center mt-1 w-ful'>
                {/* Mobile: Truncated denom */}
                <Text
                  size='xs'
                  className='font-mono text-white/60 truncate max-w-[200px] sm:hidden'
                >
                  {denom}
                </Text>
                {/* Desktop: Full denom */}
                <Text size='xs' className='hidden font-mono text-white/60 sm:block sm:text-sm'>
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
        </div>

        {/* Price Section */}
        <div className='w-full text-center lg:text-right md:w-auto'>
          {isLoading || marsTokenPrice.isEqualTo(BN_ZERO) ? (
            <div className='space-y-2'>
              <Loading className='mx-auto w-32 h-8 sm:w-40 sm:h-10' />
              <Loading className='mx-auto w-40 h-4 sm:w-48' />
            </div>
          ) : (
            <div className='space-y-2'>
              <FormattedNumber
                amount={marsTokenPrice.toNumber()}
                className='text-3xl font-bold text-white'
                options={{
                  maxDecimals: 4,
                  minDecimals: 4,
                  prefix: '$',
                }}
              />
              {priceChange && (
                <div className='flex'>
                  <Text
                    size='base'
                    className={`font-semibold ${
                      priceChange.isPositive ? 'text-profit' : 'text-loss'
                    }`}
                  >
                    {priceChange.isPositive ? '+' : ''}
                    {priceChange.percentChange.toFixed(2)}%
                  </Text>
                  <Text size='sm' className='pl-2 text-white/60'>
                    (${priceChange.absoluteChange.toFixed(5)})
                  </Text>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
