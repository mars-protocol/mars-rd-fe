export enum DocURL {
  FEATURE_URL = 'https://github.com/mars-protocol/mars-rd-fe/releases/tag/',
  COUNCIL_LEAP = 'https://cosmos.leapwallet.io/chains/mars/governance',
  COUNCIL_STATION = 'https://station.terra.money/gov#PROPOSAL_STATUS_VOTING_PERIOD',
  COUNCIL_KEPLR = 'https://wallet.keplr.app/chains/mars-hub?tab=governance',
}

export enum NETWORK {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
}

export enum SearchParams {
  ACCOUNT_ID = 'accountId',
}

export enum VaultStatus {
  ACTIVE = 'active',
}

export enum WalletID {
  Leap = 'leap-cosmos',
  Station = 'station',
}

export enum ChainInfoID {
  Osmosis1 = 'osmosis-1',
  Pion1 = 'pion-1',
  Neutron1 = 'neutron-1',
}

enum AstroportSwapPoolType {
  XYK = 'xyk',
  PCL = 'pcl',
}

enum RewardsCenterType {
  Token = 'token',
  Position = 'position',
}

export enum FundingRateTimeBase {
  HOURLY = '1h',
  DAILY = '24h',
  YEARLY = '1y',
}
