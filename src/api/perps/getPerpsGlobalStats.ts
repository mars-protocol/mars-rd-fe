export default async function getPerpsGlobalStats() {
  try {
    const response = await fetch(
      `https://testnet-api.marsprotocol.io/v2/perps_overview?chain=ndeutron&days=7&product=creditmanager&response_type=global`,
    )
    const data = (await response.json()) as PerpsGlobalOverview

    return data.global_overview
  } catch (error) {
    console.error('Could not fetch perps global overview data.', error)
    return {
      daily_trading_volume: [
        { date: '2024-11-05', value: '752417236988' },
        { date: '2024-11-04', value: '13313584987' },
        { date: '2024-11-03', value: '124087236988' },
        { date: '2024-11-02', value: '14623649871' },
        { date: '2024-11-01', value: '215474536987' },
      ],
      open_interest: {
        long: [
          { date: '2024-11-05', value: '734874648856' },
          { date: '2024-11-04', value: '734874648856' },
          { date: '2024-11-03', value: '685536285724' },
          { date: '2024-11-02', value: '702365482964' },
          { date: '2024-11-01', value: '695874839281' },
        ],
        short: [
          { date: '2024-11-05', value: '679493401824' },
          { date: '2024-11-04', value: '709130913170' },
          { date: '2024-11-03', value: '687453401824' },
          { date: '2024-11-02', value: '692341832774' },
          { date: '2024-11-01', value: '668120913170' },
        ],
        total: [
          { date: '2024-11-05', value: '1414368050680' },
          { date: '2024-11-04', value: '1444005562027' },
          { date: '2024-11-03', value: '1372984687548' },
          { date: '2024-11-02', value: '1394707315738' },
          { date: '2024-11-01', value: '1363995752451' },
        ],
        oi_max_oi_long_ratio: [],
        oi_max_oi_short_ratio: [],
      },
      skew_data: {
        skew: [
          { date: '2024-11-07', value: '51381247032' },
          { date: '2024-11-06', value: '58381247032' },
          { date: '2024-11-05', value: '55381247032' },
          { date: '2024-11-04', value: '25743735686' },
          { date: '2024-11-03', value: '45912345678' },
          { date: '2024-11-02', value: '37129384765' },
          { date: '2024-11-01', value: '31248594857' },
        ],
        imbalance_long_ratio: [
          { date: '2024-11-07', value: '0.509578' },
          { date: '2024-11-06', value: '0.5378' },
          { date: '2024-11-05', value: '0.519578' },
          { date: '2024-11-04', value: '0.508914' },
          { date: '2024-11-03', value: '0.524890' },
          { date: '2024-11-02', value: '0.515372' },
          { date: '2024-11-01', value: '0.529482' },
        ],
        imbalance_short_ratio: [
          { date: '2024-11-07', value: '0.440421' },
          { date: '2024-11-06', value: '0.510421' },
          { date: '2024-11-05', value: '0.480421' },
          { date: '2024-11-04', value: '0.491085' },
          { date: '2024-11-03', value: '0.475110' },
          { date: '2024-11-02', value: '0.484628' },
          { date: '2024-11-01', value: '0.470518' },
        ],
        maxskew_ratio: [],
      },
      funding_and_pnl: {
        funding_rate: [],
        unrealized_pnl: [
          { date: '2024-11-05', value: '6692504575' },
          { date: '2024-11-04', value: '0' },
          { date: '2024-11-03', value: '4352354235' },
          { date: '2024-11-02', value: '5642345345' },
          { date: '2024-11-01', value: '2134768987' },
        ],
        realized_pnl: [
          { date: '2024-11-05', value: '-4867095158' },
          { date: '2024-11-04', value: '-967645379' },
          { date: '2024-11-03', value: '-123456789' },
          { date: '2024-11-02', value: '-234567891' },
          { date: '2024-11-01', value: '-345678912' },
        ],
      },
      fees: {
        trading_fee: [
          { date: '2024-11-05', value: '10553320505' },
          { date: '2024-11-04', value: '10473359030' },
          { date: '2024-11-03', value: '9567832498' },
          { date: '2024-11-02', value: '9875623987' },
          { date: '2024-11-01', value: '9985632499' },
        ],
        net_funding_fee: [
          { date: '2024-11-05', value: '-163201436477' },
          { date: '2024-11-04', value: '-130783195410' },
          { date: '2024-11-03', value: '-145896234098' },
          { date: '2024-11-02', value: '-134562839821' },
          { date: '2024-11-01', value: '-125893402176' },
        ],
      },
      vault_data: {
        deposit: [
          { date: '2024-11-05', value: '70003067702998' },
          { date: '2024-11-04', value: '33008994487434' },
          { date: '2024-11-03', value: '51002356701987' },
          { date: '2024-11-02', value: '61205678904567' },
          { date: '2024-11-01', value: '40804567890123' },
        ],
        vault_value: [
          { date: '2024-11-05', value: '59112743598558' },
          { date: '2024-11-04', value: '59776401549996' },
          { date: '2024-11-03', value: '58986543212345' },
          { date: '2024-11-02', value: '59438245678910' },
          { date: '2024-11-01', value: '58890765734567' },
        ],
        vault_collateralization_ratio: [
          { date: '2024-11-05', value: '0.000000' },
          { date: '2024-11-04', value: '0.000000' },
          { date: '2024-11-03', value: '0.000000' },
          { date: '2024-11-02', value: '0.000000' },
          { date: '2024-11-01', value: '0.000000' },
        ],
      },
      notional_liquidated: [
        { date: '2024-11-05', value: '222354420' },
        { date: '2024-11-04', value: '1223512430' },
        { date: '2024-11-03', value: '4214455440' },
        { date: '2024-11-02', value: '3566455250' },
        { date: '2024-11-01', value: '6443555540' },
      ],
      notional_at_risk: '1302056670182',
      accounts_at_risk: '15',
      total_accounts: '30',
    }
  }
}
