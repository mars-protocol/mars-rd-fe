import { Bech32Address } from '@keplr-wallet/cosmos'

import { ChainInfoID, NETWORK } from 'types/enums'

const Neutron1: ChainConfig = {
  id: ChainInfoID.Neutron1,
  isOsmosis: false,
  name: 'Neutron',
  stables: ['ibc/B559A80D62249C8AA07A380E2A2BEA6E5CA9A6F079C912C3A9E9B494105E4F81'],
  campaignAssets: [],
  deprecated: [
    'ibc/3649CE0C8A2C79048D8C6F31FF18FA69C9BC7EB193512E0BD03B733011290445',
    'ibc/F082B65C88E4B6D5EF1DB243CDA1D331D002759E938A0F5CD3FFDC5D53B3E349',
  ],
  defaultTradingPair: {
    buy: 'untrn',
    sell: 'ibc/B559A80D62249C8AA07A380E2A2BEA6E5CA9A6F079C912C3A9E9B494105E4F81',
  },
  contracts: {
    redBank: 'neutron1n97wnm7q6d2hrcna3rqlnyqw2we6k0l8uqvmyqq6gsml92epdu7quugyph',
    incentives: 'neutron1aszpdh35zsaz0yj80mz7f5dtl9zq5jfl8hgm094y0j0vsychfekqxhzd39',
    oracle: 'neutron1dwp6m7pdrz6rnhdyrx5ha0acsduydqcpzkylvfgspsz60pj2agxqaqrr7g',
    params: 'neutron1x4rgd7ry23v2n49y7xdzje0743c5tgrnqrqsvwyya2h6m48tz4jqqex06x',
    creditManager: 'neutron1qdzn3l4kn7gsjna2tfpg3g3mwd6kunx4p50lfya59k02846xas6qslgs3r',
    accountNft: 'neutron184kvu96rqtetmunkkmhu5hru8yaqg7qfhd8ldu5avjnamdqu69squrh3f5',
    perps: 'neutron1g3catxyv0fk8zzsra2mjc0v4s69a7xygdjt85t54l7ym3gv0un4q2xhaf6',
    pyth: 'neutron1m2emc93m9gpwgsrsf2vylv9xvgqh654630v7dfrhrkmr5slly53spg85wv',
  },
  endpoints: {
    routes: 'https://app.astroport.fi/api/routes',
    rpc: process.env.NEXT_PUBLIC_NEUTRON_RPC ?? 'https://rpc-lb.neutron.org',
    fallbackRpc: 'https://neutron-rpc.cosmos-apis.com',
    rest: process.env.NEXT_PUBLIC_NEUTRON_REST ?? 'https://rest-lb.neutron.org',
    swap: 'https://neutron.astroport.fi/swap',
    explorer: 'https://mintscan.io/neutron',
    dexAssets: 'https://cache.marsprotocol.io/api/neutron-1/tokens',
    dexPools: 'https://cache.marsprotocol.io/api/neutron-1/pools',
    gasPrices: '/feemarket/v1/gas_price/untrn',
    aprs: {
      vaults: '',
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
  },
  features: ['ibc-transfer', 'ibc-go'],
  gasPrice: '0.015untrn',
  perps: true,
  farm: true,
  anyAsset: true,
  slinky: true,
}

export default Neutron1
