import { Neutron, Osmo } from 'components/common/Icons'
import { ChainInfoID } from 'types/enums'

interface Props {
  chainID: ChainInfoID
  className?: string
}

export default function ChainLogo(props: Props) {
  const { chainID, className } = props

  switch (chainID) {
    case ChainInfoID.Neutron1:
      return <Neutron className={className} />

    default:
      return <Osmo className={className} />
  }
}
