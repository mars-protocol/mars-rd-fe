export default async function getTokenomicsData(days: string): Promise<TokenomicsApiResponse> {
  const url = `https://tokenomics.marsprotocol.io/api/tokenomics?days=${days}`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`)
    }

    const data = (await response.json()) as TokenomicsApiResponse
    return data
  } catch (e) {
    console.error('Error fetching tokenomics data:', e)
    throw e
  }
}
