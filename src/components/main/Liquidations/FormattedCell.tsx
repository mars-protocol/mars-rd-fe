import { FormattedNumber } from 'components/common/FormattedNumber'
import Loading from 'components/common/Loading'
import { getCoinValue } from 'utils/formatters'

interface Props {
  value: BNCoin
  assetsData: Asset[]
}

export default function FormattedCell(props: Props) {
  const { value, assetsData } = props
  const formattedValue = getCoinValue(value, assetsData)

  if (!assetsData || !value) {
    return <Loading />
  }
  return (
    <FormattedNumber
      amount={formattedValue.toNumber()}
      options={{
        prefix: '$',
        maxDecimals: 2,
        minDecimals: 2,
        abbreviated: true,
      }}
      animate
    />
  )
}
