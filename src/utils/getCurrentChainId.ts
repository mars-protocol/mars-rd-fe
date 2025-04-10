import { ChainInfoID } from 'types/enums'

export const getCurrentChainId = (urlSearchParams?: URLSearchParams): ChainInfoID => {
  const searchParams = urlSearchParams || new URLSearchParams(window.location.search)
  const urlChain = searchParams.get('chain')?.toLowerCase()

  switch (urlChain) {
    case 'osmosis':
      return ChainInfoID.Osmosis1
    case 'neutron':
      return ChainInfoID.Neutron1
    default:
      return ChainInfoID.Neutron1
  }
}
