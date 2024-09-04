import { Bech32Address } from '@keplr-wallet/cosmos'

import { ChainInfoID, NETWORK } from 'types/enums'

const Neutron1: ChainConfig = {
  id: ChainInfoID.Neutron1,
  stables: ['ibc/F082B65C88E4B6D5EF1DB243CDA1D331D002759E938A0F5CD3FFDC5D53B3E349'],
  defaultTradingPair: {
    buy: 'untrn',
    sell: 'ibc/F082B65C88E4B6D5EF1DB243CDA1D331D002759E938A0F5CD3FFDC5D53B3E349',
  },
  name: 'Neutron',
  contracts: {
    redBank: 'neutron1n97wnm7q6d2hrcna3rqlnyqw2we6k0l8uqvmyqq6gsml92epdu7quugyph',
    incentives: 'neutron1aszpdh35zsaz0yj80mz7f5dtl9zq5jfl8hgm094y0j0vsychfekqxhzd39',
    oracle: 'neutron1dwp6m7pdrz6rnhdyrx5ha0acsduydqcpzkylvfgspsz60pj2agxqaqrr7g',
    params: 'neutron1x4rgd7ry23v2n49y7xdzje0743c5tgrnqrqsvwyya2h6m48tz4jqqex06x',
    creditManager: 'neutron1qdzn3l4kn7gsjna2tfpg3g3mwd6kunx4p50lfya59k02846xas6qslgs3r',
    accountNft: 'neutron184kvu96rqtetmunkkmhu5hru8yaqg7qfhd8ldu5avjnamdqu69squrh3f5',
    perps: 'neutron14v9g7regs90qvful7djcajsvrfep5pg9qau7qm6wya6c2lzcpnms692dlt',
    pyth: 'neutron1m2emc93m9gpwgsrsf2vylv9xvgqh654630v7dfrhrkmr5slly53spg85wv',
  },
  endpoints: {
    routes: 'https://app.astroport.fi/api/routes',
    rpc: process.env.NEXT_PUBLIC_NEUTRON_RPC ?? 'https://rpc-kralum.neutron-1.neutron.org',
    rest: process.env.NEXT_PUBLIC_NEUTRON_REST ?? 'https://rest-kralum.neutron-1.neutron.org',
    swap: 'https://neutron.astroport.fi/swap',
    pools: '', //TODO: ⛓️ Implement this
    explorer: 'https://mintscan.io/neutron',
    dexAssets: 'https://api.astroport.fi/api/tokens?chainId=neutron-1',
    aprs: {
      vaults: '',
      stride: 'https://edge.stride.zone/api/stake-stats',
    },
  },
  network: NETWORK.MAINNET,
  vaults: [],
  dexName: 'Astroport',
  explorerName: 'Mintscan',
  bech32Config: Bech32Address.defaultBech32Config('neutron'),
  defaultCurrency: {
    coinDenom: 'NTRN',
    coinMinimalDenom: 'untrn',
    coinDecimals: 6,
    coinGeckoId: 'neutron',
    gasPriceStep: {
      low: 0,
      average: 0.015,
      high: 0.025,
    },
  },
  features: ['ibc-transfer', 'ibc-go'],
  gasPrice: '0.015untrn',
  hls: false,
  perps: false,
  farm: false,
  anyAsset: true,
}

export default Neutron1
