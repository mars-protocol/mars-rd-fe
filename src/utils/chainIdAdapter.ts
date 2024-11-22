type ChainIdMap = {
  [key: string]: string
}

export function getSimplifiedChainId(chainInfoId: string): string {
  const chain: ChainIdMap = {
    'neutron-1': 'neutron',
    'pion-1': 'neutron',
    'osmosis-1': 'osmosis',
  }

  return chain[chainInfoId] || chainInfoId
}
