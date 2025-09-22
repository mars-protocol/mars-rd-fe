export default async function getStakedSupply() {
  try {
    const response = await fetch('https://status.marsprotocol.io/st')
    const data = (await response.json()) as number
    return data
  } catch (e) {
    console.error(e)
    return 0 // Return 0 as fallback for staked supply
  }
}
