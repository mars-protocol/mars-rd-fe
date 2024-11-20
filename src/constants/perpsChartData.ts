export const DEFAULT_PERPS_GLOBAL_DATA: PerpsGlobalData = {
  daily_trading_volume: [],
  open_interest: {
    long: [],
    short: [],
    total: [],
    oi_max_oi_long_ratio: [],
    oi_max_oi_short_ratio: [],
  },
  skew_data: {
    skew: [],
    imbalance_long_ratio: [],
    imbalance_short_ratio: [],
    max_skew: [],
  },
  funding_and_pnl: {
    funding_rate: [],
    unrealized_pnl: [],
    realized_pnl: [],
  },
  fees: {
    trading_fee: [],
    net_funding_fee: [],
  },
  vault_data: {
    deposit: [],
    vault_value: [],
    vault_collateralization_ratio: [],
  },
  notional_liquidated: [],
  notional_at_risk: '0',
  accounts_at_risk: '0',
  total_accounts: '0',
}

export const PERPS_CHART_TRANSFORMATIONS = {
  openInterest: [
    { path: ['open_interest', 'long'], targetKey: 'long' },
    { path: ['open_interest', 'short'], targetKey: 'short' },
    { path: ['open_interest', 'max_net_oi'], targetKey: 'max_net_oi' },
  ],
  fundingRate: [
    {
      path: ['funding_and_pnl', 'funding_rate'],
      targetKey: 'funding_rate',
    },
  ],
  pnl: [
    { path: ['funding_and_pnl', 'unrealized_pnl'], targetKey: 'unrealized' },
    { path: ['funding_and_pnl', 'realized_pnl'], targetKey: 'realized' },
  ],
  fees: [
    { path: ['fees', 'trading_fee'], targetKey: 'trading_fees' },
    { path: ['fees', 'net_funding_fee'], targetKey: 'net_funding_fees' },
  ],
  skewData: [
    { path: ['skew_data', 'skew'], targetKey: 'skew' },
    { path: ['skew_data', 'max_skew'], targetKey: 'max_skew' },
  ],
  vaultData: [
    { path: ['vault_data', 'deposit'], targetKey: 'deposit' },
    { path: ['vault_data', 'vault_value'], targetKey: 'vault_value' },
    {
      path: ['vault_data', 'vault_collateralization_ratio'],
      targetKey: 'vault_collateralization_ratio',
    },
  ],
  singleMetrics: [
    { path: ['notional_liquidated'], targetKey: 'notional_liquidated' },
    { path: ['daily_trading_volume'], targetKey: 'daily_trading_volume' },
    { path: ['skew_data', 'imbalance_long_ratio'], targetKey: 'imbalance_long' },
  ],
  combinedMetrics: [
    { path: ['skew_data', 'skew'], targetKey: 'skew' },
    { path: ['skew_data', 'max_skew'], targetKey: 'max_skew' },
    {
      path: ['funding_and_pnl', 'funding_rate'],
      targetKey: 'funding_rate',
      formatFn: (value: number) => value * 365,
    },
  ],
}

export const PERPS_CHART_COLORS = {
  primary: '#30E0A1',
  secondary: '#AB47BC',
  tertiary: '#580DA3',
}

export const PERPS_CHART_CONFIGS = {
  openInterest: {
    bars: [
      {
        dataKey: 'long',
        name: 'Long Positions',
        color: PERPS_CHART_COLORS.tertiary,
      },
      {
        dataKey: 'short',
        name: 'Short Positions',
        color: PERPS_CHART_COLORS.secondary,
      },
    ],
    line: {
      dataKey: 'max_net_oi',
      name: 'Max Net OI',
      color: PERPS_CHART_COLORS.primary,
    },
  },
  tradingFees: [
    { dataKey: 'trading_fees', color: PERPS_CHART_COLORS.secondary, name: 'Trading Fees' },
    { dataKey: 'net_funding_fees', color: PERPS_CHART_COLORS.tertiary, name: 'Net Funding Fees' },
  ],
  skew: [
    { dataKey: 'skew', color: PERPS_CHART_COLORS.tertiary, name: 'Skew' },
    {
      dataKey: 'max_skew',
      color: PERPS_CHART_COLORS.secondary,
      name: 'Max Skew',
    },
  ],
  notional: [
    {
      dataKey: 'notional_liquidated',
      color: PERPS_CHART_COLORS.secondary,
      name: 'Notional Liquidated',
    },
  ],
  tradingVolume: [
    {
      dataKey: 'daily_trading_volume',
      color: PERPS_CHART_COLORS.primary,
      name: 'Daily Trading Volume',
    },
  ],
  imbalanceRatio: [
    {
      dataKey: 'imbalance_long',
      color: PERPS_CHART_COLORS.primary,
      name: 'Imbalance Long Ratio',
      isPercentage: true,
    },
  ],
  fundingRate: [
    {
      dataKey: 'funding_rate',
      color: PERPS_CHART_COLORS.secondary,
      name: 'Funding Rate',
      isPercentage: true,
      isFundingRate: true,
    },
  ],
  vault: [
    { dataKey: 'deposit', color: PERPS_CHART_COLORS.secondary, name: 'Deposit' },
    { dataKey: 'vault_value', color: PERPS_CHART_COLORS.tertiary, name: 'Value' },
  ],
  vaultCollateralization: [
    {
      dataKey: 'vault_collateralization_ratio',
      color: PERPS_CHART_COLORS.primary,
      name: 'Vault Collateralization Ratio',
      isPercentage: true,
    },
  ],
  pnl: {
    primaryChart: {
      bar: {
        dataKey: 'dailyRealizedChange',
        name: 'Daily Realized Change',
        color: PERPS_CHART_COLORS.tertiary,
      },
      line: {
        dataKey: 'cumulativeRealized',
        name: 'Cumulative Realized PnL',
        color: PERPS_CHART_COLORS.primary,
      },
    },
    secondaryChart: {
      bar: {
        dataKey: 'dailyUnrealizedChange',
        name: 'Daily Unrealized Change',
        color: PERPS_CHART_COLORS.secondary,
      },
      line: {
        dataKey: 'cumulativeUnrealized',
        name: 'Cumulative Unrealized PnL',
        color: PERPS_CHART_COLORS.primary,
      },
    },
  },
  combinedChart: {
    primary: [
      {
        dataKey: 'max_skew',
        color: PERPS_CHART_COLORS.secondary,
        name: 'Max Skew',
      },
      { dataKey: 'skew', color: PERPS_CHART_COLORS.tertiary, name: 'Skew' },
    ],
    secondary: [
      {
        dataKey: 'funding_rate',
        name: 'Funding Rate (Annualized)',
        color: PERPS_CHART_COLORS.primary,
        isPercentage: true,
      },
    ],
  },
}

export enum FundingRateTimeBase {
  HOURLY = '1h',
  DAILY = '24h',
  YEARLY = '1y',
}

export const FUNDING_RATE_OPTIONS: TimeframeOption[] = [
  { value: FundingRateTimeBase.HOURLY, label: '1H' },
  { value: FundingRateTimeBase.DAILY, label: '24H' },
  { value: FundingRateTimeBase.YEARLY, label: '1Y' },
]
