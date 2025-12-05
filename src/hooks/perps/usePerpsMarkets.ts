import getPerpsMarkets from 'api/perps/getPerpsMarkets'
import useSWR from 'swr'

export default function usePerpsMarkets() {
  return useSWR('perps/markets/neutron-1', async () => getPerpsMarkets(), {
    revalidateOnFocus: false,
  })
}
