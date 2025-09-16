import { FundingRateTimeBase } from 'types/enums'
import { BN } from 'utils/helpers'

export const CHART_COLORS = {
  primary: '#30E0A1',
  secondary: '#AB47BC',
  tertiary: '#580DA3',
  quaternary: '#3DB2FF',
  quinary: '#FF4D4D',
}

export const DEFAULT_PERPS_GLOBAL_DATA: PerpsGlobalData = {
  trading_volume: [],
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
  },
  funding_and_pnl: {
    funding_rate: [],
    unrealized_pnl: [],
    realized_pnl: [],
    realized_price_pnl: [],
  },
  fees: {
    realized_trading_fee: [],
    realized_net_funding_fee: [],
    unrealized_net_funding_fee: [],
  },
  vault_data: {
    deposit: [],
    vault_value: [],
    vault_collateralization_ratio: [],
  },
  notional_liquidated: [],
  cumulative_trading_volume: '0',
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
      formatFn: (value: number) => value * 100,
    },
  ],
  pnl: [
    { path: ['funding_and_pnl', 'unrealized_pnl'], targetKey: 'unrealized' },
    { path: ['funding_and_pnl', 'realized_pnl'], targetKey: 'realized' },
  ],
  realizedPnlBreakdown: [
    { path: ['fees', 'realized_trading_fee'], targetKey: 'realized_trading_fees' },
    { path: ['fees', 'realized_net_funding_fee'], targetKey: 'realized_net_funding_fees' },
    { path: ['funding_and_pnl', 'realized_price_pnl'], targetKey: 'realized_price_pnl' },
  ],
  fees: [
    { path: ['fees', 'realized_trading_fee'], targetKey: 'realized_trading_fees' },
    { path: ['fees', 'realized_net_funding_fee'], targetKey: 'realized_net_funding_fees' },
    { path: ['fees', 'unrealized_net_funding_fee'], targetKey: 'unrealized_net_funding_fees' },
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
      formatFn: (value: number) => value * 100,
    },
  ],
  singleMetrics: [
    { path: ['notional_liquidated'], targetKey: 'notional_liquidated' },
    { path: ['trading_volume'], targetKey: 'trading_volume' },
    {
      path: ['skew_data', 'imbalance_long_ratio'],
      targetKey: 'imbalance_long',
      formatFn: (value: number) => value * 100,
    },
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
  vaultApy: [{ path: ['apy'], targetKey: 'apy' }],
}

export const PERPS_CHART_CONFIGS = {
  openInterest: {
    bars: [
      {
        dataKey: 'long',
        name: 'Long Positions',
        color: CHART_COLORS.tertiary,
        yAxisId: 'right',
        isUSD: true,
      },
      {
        dataKey: 'short',
        name: 'Short Positions',
        color: CHART_COLORS.secondary,
        yAxisId: 'right',
        isUSD: true,
      },
    ],
    line: {
      dataKey: 'max_oi_long',
      name: 'Max OI',
      color: CHART_COLORS.primary,
      yAxisId: 'left',
      isUSD: true,
    },
  },
  openInterestGlobal: {
    bars: [
      {
        dataKey: 'long',
        name: 'Long Positions',
        color: CHART_COLORS.tertiary,
        isUSD: true,
      },
      {
        dataKey: 'short',
        name: 'Short Positions',
        color: CHART_COLORS.secondary,
        isUSD: true,
      },
    ],
  },
  tradingFees: [
    {
      dataKey: 'realized_trading_fees',
      color: CHART_COLORS.secondary,
      name: 'Realized Trading Fees',
      isUSD: true,
    },
    {
      dataKey: 'realized_net_funding_fees',
      color: CHART_COLORS.tertiary,
      name: 'Realized Funding Fees',
      isUSD: true,
    },
  ],
  skew: [
    { dataKey: 'skew', color: CHART_COLORS.tertiary, name: 'Skew', isUSD: true },
    {
      dataKey: 'max_oi_positive',
      color: CHART_COLORS.secondary,
      name: 'Max Net OI',
      strokeDasharray: '5 8',
      isUSD: true,
    },
    {
      dataKey: 'max_oi_negative',
      color: CHART_COLORS.secondary,
      name: 'Max Net OI',
      strokeDasharray: '5 8',
      isUSD: true,
    },
  ],
  notional: [
    {
      dataKey: 'notional_liquidated',
      color: CHART_COLORS.secondary,
      name: 'Notional Liquidated',
      isUSD: true,
    },
  ],
  tradingVolume: [
    {
      dataKey: 'trading_volume',
      color: CHART_COLORS.primary,
      name: 'Trading Volume',
      isUSD: true,
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
    { dataKey: 'deposit', color: CHART_COLORS.secondary, name: 'Deposit', isUSD: true },
    { dataKey: 'vault_value', color: CHART_COLORS.tertiary, name: 'Value', isUSD: true },
  ],
  vaultCollateralization: [
    {
      dataKey: 'vault_collateralization_ratio',
      color: CHART_COLORS.primary,
      name: 'Vault Collateralization Ratio',
      isPercentage: true,
    },
  ],
  netFundingFees: [
    {
      dataKey: 'realized_net_funding_fees',
      color: CHART_COLORS.tertiary,
      name: 'Realized Funding Fees',
      isUSD: true,
    },
    {
      dataKey: 'unrealized_net_funding_fees',
      color: CHART_COLORS.secondary,
      name: 'Unrealized Funding Fees',
      isUSD: true,
    },
    {
      dataKey: 'netTotal',
      color: CHART_COLORS.primary,
      name: 'Net Funding Fees',
      isUSD: true,
    },
  ],
  realizedPnlBreakdown: [
    {
      dataKey: 'realized_trading_fees',
      color: CHART_COLORS.tertiary,
      name: 'Realized Trading Fees',
      isUSD: true,
    },
    {
      dataKey: 'realized_net_funding_fees',
      color: CHART_COLORS.secondary,
      name: 'Realized Funding Fees',
      isUSD: true,
    },
    {
      dataKey: 'realized_price_pnl',
      color: CHART_COLORS.quaternary,
      name: 'Realized Price PnL',
      isUSD: true,
    },
    {
      dataKey: 'total',
      color: CHART_COLORS.primary,
      name: 'Total',
      isUSD: true,
    },
  ],
  totalPnl: [
    {
      dataKey: 'realized',
      color: CHART_COLORS.tertiary,
      name: 'Cumulative Realized PnL',
      isUSD: true,
    },
    {
      dataKey: 'unrealized',
      color: CHART_COLORS.secondary,
      name: 'Unrealized PnL',
      isUSD: true,
    },
    {
      dataKey: 'netTotal',
      color: CHART_COLORS.primary,
      name: 'Net Total PnL',
      isUSD: true,
    },
  ],
  pnl: {
    primaryChart: {
      bar: {
        dataKey: 'dailyRealizedChange',
        name: 'Daily Realized Change',
        color: CHART_COLORS.tertiary,
        isUSD: true,
      },
      line: {
        dataKey: 'cumulativeRealized',
        name: 'Cumulative Realized PnL',
        color: CHART_COLORS.primary,
        isUSD: true,
      },
    },
    secondaryChart: {
      bar: {
        dataKey: 'dailyUnrealizedChange',
        name: 'Daily Unrealized Change',
        color: CHART_COLORS.secondary,
        isUSD: true,
      },
      line: {
        dataKey: 'cumulativeUnrealized',
        name: 'Cumulative Unrealized PnL',
        color: CHART_COLORS.primary,
        isUSD: true,
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
        isUSD: true,
      },
      {
        dataKey: 'max_oi_negative',
        color: CHART_COLORS.secondary,
        name: 'Max Net OI',
        strokeDasharray: '5 8',
        isUSD: true,
      },
      {
        dataKey: 'skew',
        color: CHART_COLORS.tertiary,
        name: 'Skew',
        isUSD: true,
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
  vaultApy: [
    {
      dataKey: 'apy',
      name: 'Vault APY',
      color: CHART_COLORS.primary,
      isPercentage: true,
      multiplyBy100: false,
    },
  ],
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
      isUSD: true,
    },
  ],
  supplyBorrow: {
    bars: [
      {
        dataKey: 'supply',
        name: 'Total Supply',
        color: CHART_COLORS.tertiary,
        isUSD: true,
      },
      {
        dataKey: 'borrow',
        name: 'Total Borrow',
        color: CHART_COLORS.secondary,
        isUSD: true,
      },
    ],
  },
}

const TOKENOMICS_CHART_TRANSFORMATIONS = {
  burned: [
    {
      path: ['burned_supply'],
      targetKey: 'burned_amount',
      formatFn: (value: TokenomicsDataPoint) => parseFloat(BN(value.amount).toString()),
    },
    {
      path: ['burned_supply'],
      targetKey: 'burned_value_usd',
      formatFn: (value: TokenomicsDataPoint) => BN(value.value_usd).toNumber(),
    },
  ],
  liquidity: [
    {
      path: ['on_chain_liquidity_usd'],
      targetKey: 'liquidity_usd',
      formatFn: (value: TokenomicsDataPoint) => BN(value.value_usd).toNumber(),
    },
  ],
}

export const TOKENOMICS_CHART_CONFIGS = {
  burned: [
    {
      dataKey: 'burned_amount',
      color: CHART_COLORS.quinary,
      name: 'Burned Amount (MARS)',
      yAxisId: 'left',
    },
    {
      dataKey: 'burned_value_usd',
      color: CHART_COLORS.tertiary,
      name: 'Burned Value (USD)',
      yAxisId: 'right',
      isUSD: true,
      isNormalized: true,
    },
  ],
  liquidity: [
    {
      dataKey: 'liquidity_usd',
      color: CHART_COLORS.primary,
      name: 'On-Chain Liquidity (USD)',
      isUSD: true,
      isNormalized: true,
    },
  ],
  treasury: [
    {
      dataKey: 'treasury_amount',
      color: CHART_COLORS.secondary,
      name: 'Treasury Amount (MARS)',
      yAxisId: 'left',
    },
    {
      dataKey: 'treasury_value_usd',
      color: CHART_COLORS.tertiary,
      name: 'Treasury Value (USD)',
      yAxisId: 'right',
      isUSD: true,
      isNormalized: true,
    },
  ],
}
