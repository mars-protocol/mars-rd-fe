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
    maxskew_ratio: [],
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
    { path: ['open_interest', 'total'], targetKey: 'total' },
  ],
  pnl: [
    { path: ['funding_and_pnl', 'unrealized_pnl'], targetKey: 'Unrealized' },
    { path: ['funding_and_pnl', 'realized_pnl'], targetKey: 'Realized' },
  ],
  fees: [
    { path: ['fees', 'trading_fee'], targetKey: 'trading_fees' },
    { path: ['fees', 'net_funding_fee'], targetKey: 'net_funding_fees' },
  ],
  skewData: [
    { path: ['skew_data', 'imbalance_long_ratio'], targetKey: 'imbalance_long' },
    { path: ['skew_data', 'skew'], targetKey: 'skew' },
  ],
  vaultData: [
    { path: ['vault_data', 'deposit'], targetKey: 'deposit' },
    { path: ['vault_data', 'vault_value'], targetKey: 'vault_value' },
  ],
  singleMetrics: [
    { path: ['notional_liquidated'], targetKey: 'notional_liquidated' },
    { path: ['daily_trading_volume'], targetKey: 'daily_trading_volume' },
  ],
}

export const PERPS_CHART_COLORS = {
  primary: '#30E0A1',
  secondary: '#AB47BC',
  tertiary: '#580DA3',
}

export const PERPS_LINE_CONFIGS = {
  vault: [
    { dataKey: 'deposit', color: PERPS_CHART_COLORS.secondary, name: 'Deposit' },
    { dataKey: 'vault_value', color: PERPS_CHART_COLORS.tertiary, name: 'Value' },
    // { dataKey: 'vault_collateralization_ratio', color: PERPS_CHART_COLORS.tertiary, name: 'Collateralization Ratio' },
  ],
  tradingFees: [
    { dataKey: 'trading_fees', color: PERPS_CHART_COLORS.secondary, name: 'Trading Fees' },
    { dataKey: 'net_funding_fees', color: PERPS_CHART_COLORS.tertiary, name: 'Net Funding Fees' },
  ],
  skew: [{ dataKey: 'skew', color: PERPS_CHART_COLORS.tertiary, name: 'Skew' }],
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
}
