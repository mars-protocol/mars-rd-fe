import classNames from 'classnames'
import Card from 'components/common/Card'
import DisplayCurrency from 'components/common/DisplayCurrency'
import { FormattedNumber } from 'components/common/FormattedNumber'
import Loading from 'components/common/Loading'
import Text from 'components/common/Text'
import { BN_ZERO } from 'constants/math'
import { ORACLE_DENOM } from 'constants/oracle'
import useCirculatingSupply from 'hooks/tokenomics/useCirculatingSupply'
import useMarsTokenPrice from 'hooks/tokenomics/useMarsTokenPrice'
import useTotalSupply from 'hooks/tokenomics/useTotalSupply'
import { useMemo } from 'react'
import { BNCoin } from 'types/classes/BNCoin'
import { BN } from 'utils/helpers'

export default function TokenMetrics() {
  const { data: circulatingSupplyData, isLoading: isLoadingCirculatingSupply } =
    useCirculatingSupply()
  const { data: totalSupplyData, isLoading: isLoadingTotalSupply } = useTotalSupply()
  const { data: marsTokenPriceData, isLoading: isLoadingMarsTokenPrice } = useMarsTokenPrice()

  const circulatingSupply = circulatingSupplyData ?? 0
  const totalSupply = totalSupplyData ?? 0
  const marsTokenPrice = marsTokenPriceData ?? BN_ZERO

  const marketCap = useMemo(
    () => BN(circulatingSupply).multipliedBy(marsTokenPrice),
    [circulatingSupply, marsTokenPrice],
  )
  const FDV = useMemo(
    () => BN(totalSupply).multipliedBy(marsTokenPrice),
    [totalSupply, marsTokenPrice],
  )

  const metrics: Metric[] = [
    {
      value: marsTokenPrice,
      label: 'MARS Token Price',
      isCurrency: true,
      formatOptions: { maxDecimals: 4, minDecimals: 4, abbreviated: true },
    },
    {
      value: marketCap,
      label: 'Market Cap',
      isCurrency: true,
      formatOptions: {
        maxDecimals: 2,
        minDecimals: 2,
        abbreviated: true,
      },
    },
    {
      value: BN(totalSupply),
      label: 'Total Supply',
      formatOptions: { abbreviated: true },
    },
    {
      value: BN(circulatingSupply),
      label: 'Circulating Supply',
      formatOptions: { abbreviated: true },
    },
    {
      value: FDV,
      label: 'FDV',
      isCurrency: true,
      formatOptions: { maxDecimals: 2, minDecimals: 2, abbreviated: true },
    },
  ]

  const isLoading = isLoadingCirculatingSupply || isLoadingTotalSupply || isLoadingMarsTokenPrice

  return (
    <div className='grid w-full grid-cols-2 gap-4 md:grid-cols-5'>
      {metrics.map((metric, index) => {
        return (
          <Card
            className={classNames(
              'md:col-span-1 py-6 text-center bg-white/5',
              index === 0 ? 'col-span-2' : 'col-span-1',
            )}
            key={index}
          >
            {isLoading ? (
              <div className='flex items-center justify-center w-full h-8 px-6'>
                <Loading />
              </div>
            ) : metric.isCurrency ? (
              <DisplayCurrency
                coin={BNCoin.fromDenomAndBigNumber(ORACLE_DENOM, metric.value)}
                className='w-full text-sm'
                options={metric.formatOptions}
              />
            ) : (
              <FormattedNumber
                className='w-full text-sm'
                amount={metric.value.toNumber()}
                options={metric.formatOptions}
              />
            )}
            <Text size='xs' className='w-full text-white/40'>
              {metric.label}
            </Text>
          </Card>
        )
      })}
    </div>
  )
}
