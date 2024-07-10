export default async function getCirculatingSupply() {
  try {
    const response = await fetch('https://status.marsprotocol.io/cs')
    const data = (await response.json()) as number
    return data
  } catch (e) {
    console.log(e)
    return 367608907
  }
}
