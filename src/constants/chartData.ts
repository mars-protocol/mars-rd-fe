import { FundingRateTimeBase } from 'types/enums'

export const CHART_COLORS = {
  primary: '#30E0A1',
  secondary: '#AB47BC',
  tertiary: '#580DA3',
}

export const DEFAULT_PERPS_GLOBAL_DATA: PerpsGlobalData = {
  daily_trading_volume: [],
  open_interest: {
    long: [],
    short: [],
    total: [],
    max_oi_long: [],
    max_oi_short: [],
    max_oi_net: [],
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
    { path: ['open_interest', 'max_oi_long'], targetKey: 'max_oi_long' },
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
    {
      path: ['open_interest', 'max_oi_net'],
      targetKey: 'max_oi_positive',
      formatFn: (value: number) => Math.abs(value),
    },
    {
      path: ['open_interest', 'max_oi_net'],
      targetKey: 'max_oi_negative',
      formatFn: (value: number) => -Math.abs(value),
    },
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
    {
      path: ['open_interest', 'max_oi_net'],
      targetKey: 'max_oi_positive',
      formatFn: (value: number) => Math.abs(value),
    },
    {
      path: ['open_interest', 'max_oi_net'],
      targetKey: 'max_oi_negative',
      formatFn: (value: number) => -Math.abs(value),
    },
    {
      path: ['funding_and_pnl', 'funding_rate'],
      targetKey: 'funding_rate',
      formatFn: (value: number) => value * 365,
    },
  ],
}

export const PERPS_CHART_CONFIGS = {
  openInterest: {
    bars: [
      {
        dataKey: 'long',
        name: 'Long Positions',
        color: CHART_COLORS.tertiary,
        yAxisId: 'right',
      },
      {
        dataKey: 'short',
        name: 'Short Positions',
        color: CHART_COLORS.secondary,
        yAxisId: 'right',
      },
    ],
    line: {
      dataKey: 'max_oi_long',
      name: 'Max OI',
      color: CHART_COLORS.primary,
      yAxisId: 'left',
    },
  },
  tradingFees: [
    { dataKey: 'trading_fees', color: CHART_COLORS.secondary, name: 'Trading Fees' },
    { dataKey: 'net_funding_fees', color: CHART_COLORS.tertiary, name: 'Net Funding Fees' },
  ],
  skew: [
    { dataKey: 'skew', color: CHART_COLORS.tertiary, name: 'Skew' },
    {
      dataKey: 'max_oi_positive',
      color: CHART_COLORS.secondary,
      name: 'Max Net OI',
      strokeDasharray: '5 8',
    },
    {
      dataKey: 'max_oi_negative',
      color: CHART_COLORS.secondary,
      name: 'Max Net OI',
      strokeDasharray: '5 8',
    },
  ],
  notional: [
    {
      dataKey: 'notional_liquidated',
      color: CHART_COLORS.secondary,
      name: 'Notional Liquidated',
    },
  ],
  tradingVolume: [
    {
      dataKey: 'daily_trading_volume',
      color: CHART_COLORS.primary,
      name: 'Daily Trading Volume',
    },
  ],
  imbalanceRatio: [
    {
      dataKey: 'imbalance_long',
      color: CHART_COLORS.primary,
      name: 'Imbalance Long Ratio',
      isPercentage: true,
    },
  ],
  fundingRate: [
    {
      dataKey: 'funding_rate',
      color: CHART_COLORS.secondary,
      name: 'Funding Rate',
      isPercentage: true,
      isFundingRate: true,
    },
  ],
  vault: [
    { dataKey: 'deposit', color: CHART_COLORS.secondary, name: 'Deposit' },
    { dataKey: 'vault_value', color: CHART_COLORS.tertiary, name: 'Value' },
  ],
  vaultCollateralization: [
    {
      dataKey: 'vault_collateralization_ratio',
      color: CHART_COLORS.primary,
      name: 'Vault Collateralization Ratio',
      isPercentage: true,
    },
  ],
  totalPnl: [
    {
      dataKey: 'realized',
      color: CHART_COLORS.tertiary,
      name: 'Cumulative Realized PnL',
    },
    {
      dataKey: 'unrealized',
      color: CHART_COLORS.secondary,
      name: 'Cumulative Unrealized PnL',
    },
    {
      dataKey: 'netTotal',
      color: CHART_COLORS.primary,
      name: 'Net Total PnL',
    },
  ],
  pnl: {
    primaryChart: {
      bar: {
        dataKey: 'dailyRealizedChange',
        name: 'Daily Realized Change',
        color: CHART_COLORS.tertiary,
      },
      line: {
        dataKey: 'cumulativeRealized',
        name: 'Cumulative Realized PnL',
        color: CHART_COLORS.primary,
      },
    },
    secondaryChart: {
      bar: {
        dataKey: 'dailyUnrealizedChange',
        name: 'Daily Unrealized Change',
        color: CHART_COLORS.secondary,
      },
      line: {
        dataKey: 'cumulativeUnrealized',
        name: 'Cumulative Unrealized PnL',
        color: CHART_COLORS.primary,
      },
    },
  },
  combinedChart: {
    primary: [
      {
        dataKey: 'max_oi_positive',
        color: CHART_COLORS.secondary,
        name: 'Max Net OI',
        strokeDasharray: '5 8',
      },
      {
        dataKey: 'max_oi_negative',
        color: CHART_COLORS.secondary,
        name: 'Max Net OI',
        strokeDasharray: '5 8',
      },
      {
        dataKey: 'skew',
        color: CHART_COLORS.tertiary,
        name: 'Skew',
      },
    ],
    secondary: [
      {
        dataKey: 'funding_rate',
        name: 'Funding Rate (Annualized)',
        color: CHART_COLORS.primary,
        isPercentage: true,
      },
    ],
  },
}

export const FUNDING_RATE_OPTIONS: TimeframeOption[] = [
  { value: FundingRateTimeBase.HOURLY, label: '1H' },
  { value: FundingRateTimeBase.DAILY, label: '24H' },
  { value: FundingRateTimeBase.YEARLY, label: '1Y' },
]

export const OVERVIEW_CHART_TRANSFORMATIONS = {
  tvl: [
    {
      path: ['total_value_locked'],
      targetKey: 'total_value_locked',
    },
  ],
  supplyBorrow: [
    {
      path: ['total_supply'],
      targetKey: 'supply',
    },
    {
      path: ['total_borrow'],
      targetKey: 'borrow',
    },
  ],
}

export const OVERVIEW_CHART_CONFIGS = {
  tvl: [
    {
      dataKey: 'total_value_locked',
      color: CHART_COLORS.primary,
      name: 'Total Value Locked',
    },
  ],
  supplyBorrow: {
    bars: [
      {
        dataKey: 'supply',
        name: 'Total Supply',
        color: CHART_COLORS.tertiary,
      },
      {
        dataKey: 'borrow',
        name: 'Total Borrow',
        color: CHART_COLORS.secondary,
      },
    ],
  },
}
