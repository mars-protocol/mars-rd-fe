import AssetImage from 'components/common/assets/AssetImage'
import useWhitelistedAssets from 'hooks/assets/useWhitelistedAssets'

export default function Assets() {
  const assets = useWhitelistedAssets()

  return (
    <>
      {assets.map((asset) => (
        <div className='flex items-center gap-2' key={asset.denom}>
          <div className='w-6 h-6 overflow-hidden rounded-full'>
            <AssetImage asset={asset} />
          </div>
          {asset.symbol}
        </div>
      ))}
    </>
  )
}
