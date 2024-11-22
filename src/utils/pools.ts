import { BN } from 'utils/helpers'

export function calculatePoolWeight(
  primary: AstroportPoolAsset,
  secondary: AstroportPoolAsset,
): PoolWeight {
  const primaryAmount = BN(primary?.amount ?? 0).shiftedBy((primary?.decimals ?? 6) * -1)
  const secondaryAmount = BN(secondary?.amount ?? 0).shiftedBy((secondary?.decimals ?? 6) * -1)

  return {
    primaryToSecondary: secondaryAmount.div(primaryAmount).toNumber(),
    secondaryToPrimary: primaryAmount.div(secondaryAmount).toNumber(),
  }
}
