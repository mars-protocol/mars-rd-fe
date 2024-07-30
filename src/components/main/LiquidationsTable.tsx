import { FormattedNumber } from 'components/common/FormattedNumber'
import Loading from 'components/common/Loading'
import Table from 'components/common/Table'
import { BN_ZERO } from 'constants/math'
import useAssets from 'hooks/assets/useAssets'
import useLiquidations from 'hooks/liquidations/useLiquidations'
import { getCoinValue } from 'utils/formatters'
import { BN } from 'utils/helpers'

interface Row {
  id: string
  original: {
    account_id: string
    collateral_asset_won: {
      amount: string
      denom: string
    }
    debt_asset_repaid: {
      amount: string
      denom: string
    }
    liquidation_type: string
    protocol_fee_coin: {
      amount: string
      denom: string
    }
  }
}

export default function LiquidationsTable() {
  const { data: liquidityData, isLoading: isLiquidityDataLoading } = useLiquidations()
  const { data: assetsData } = useAssets()

  const columns = [
    {
      accessorKey: 'account_id',
      header: 'Account ID',
    },
    {
      accessorKey: 'collateral_asset_won',
      header: 'Collateral Asset Amount',
      cell: (props) => {
        const value = props.getValue()
        const formattedValue = getCoinValue(value, assetsData)

        if (!value || !value.amount) return <Loading />

        return (
          <FormattedNumber
            amount={formattedValue.toNumber()}
            options={{
              prefix: '$',
              maxDecimals: 2,
              minDecimals: 2,
              abbreviated: true,
            }}
            animate
          />
        )
      },
    },
    {
      accessorKey: 'debt_asset_repaid',
      header: 'Debt Asset Amount',
      cell: (props) => {
        const value = props.getValue()
        const formattedValue = getCoinValue(value, assetsData)

        if (!value || !value.amount) return <Loading />

        return (
          <FormattedNumber
            amount={formattedValue.toNumber()}
            options={{
              prefix: '$',
              maxDecimals: 2,
              minDecimals: 2,
              abbreviated: true,
            }}
            animate
          />
        )
      },
    },
    {
      accessorKey: 'liquidation_type',
      header: 'Liquidation Type',
    },
    {
      accessorKey: 'protocol_fee_coin',
      header: 'Protocol Fee Amount',
      cell: (props) => {
        const value = props.getValue()
        const formattedValue = getCoinValue(value, assetsData)

        if (!value || !value.amount) return <Loading />

        return (
          <FormattedNumber
            amount={formattedValue.toNumber()}
            options={{
              prefix: '$',
              maxDecimals: 2,
              minDecimals: 2,
              abbreviated: true,
            }}
            animate
          />
        )
      },
    },
  ]

  return (
    <>
      {isLiquidityDataLoading ? (
        <div>Fetching Data...</div>
      ) : (
        <Table
          title='Liquidations Data'
          columns={columns}
          data={liquidityData.data}
          initialSorting={[]}
        />
      )}
    </>
  )
}
