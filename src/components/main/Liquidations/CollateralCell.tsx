import AmountAndValue from 'components/common/AmountAndValue'
import AssetImage from 'components/common/assets/AssetImage'
import { BN_ZERO } from 'constants/math'
import useAsset from 'hooks/assets/useAsset'

interface Props {
  data: {
    denom: string
    amount: BigNumber
  }
}

export default function CollateralCell(props: Props) {
  const { data } = props
  const { denom, amount } = data

  const asset = useAsset(denom)

  if (!asset) return null

  return (
    <div className='flex justify-end gap-3'>
      <AssetImage asset={asset} className='w-8 h-8' />
      <AmountAndValue asset={asset} amount={amount ?? BN_ZERO} />
    </div>
  )
}
