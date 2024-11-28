export default async function getTotalSupply() {
  try {
    return await fetch('https://status.marsprotocol.io/ts').then(async (res) => {
      const data = (await res.json()) as number
      return data
    })
  } catch (e) {
    console.error(e)
    return 699992780.223
  }
}
