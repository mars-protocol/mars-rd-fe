import { ImageResponse } from 'next/og'
import { neutronPerps } from '../../../../../data/assets/neutron-perps'

// Use Node.js runtime to avoid disabling SSG for other pages
export const runtime = 'nodejs'

export async function GET(request: Request, context: any) {
  try {
    const marketParam = context.params.market
    const marketDenom = `perps/${decodeURIComponent(
      Array.isArray(marketParam) ? marketParam[0] : marketParam,
    )}`

    // Find the market asset data
    const marketAsset = neutronPerps.find((asset) => asset.denom === marketDenom)
    const marketSymbol = marketAsset?.symbol || marketDenom.replace('perps/', '').toUpperCase()

    // Fetch the market icon
    const iconUrl =
      marketAsset?.icon ||
      `https://raw.githubusercontent.com/mars-protocol/perps-markets/refs/heads/main/logos/${marketSymbol}.svg`

    // Fetch the background image
    const backgroundImageUrl = `${new URL(request.url).origin}/og-images/perps-market.jpg`

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            position: 'relative',
            backgroundImage: `url(${backgroundImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Market Icon - 170x170px, 200px from top, 280px from right */}
          <img
            src={iconUrl}
            style={{
              position: 'absolute',
              top: '200px',
              left: '120px',
              width: '170px',
              height: '170px',
            }}
            alt={marketSymbol}
          />

          {/* Market Symbol Text - 100px white text, 50px to the right of icon, vertically centered */}
          <div
            style={{
              position: 'absolute',
              top: '200px', // Same top position as icon
              // Icon is at right: 280px, width: 170px, so icon left edge is at 280px - 170px = 110px from right
              // Text should be 50px to the right of icon, so at 110px - 50px = 60px from right
              left: '320px',
              fontSize: '100px',
              fontWeight: '600',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              height: '170px', // Same height as icon for vertical centering
              letterSpacing: '2px',
            }}
          >
            {marketSymbol}
          </div>
        </div>
      ),
      {
        width: 1032,
        height: 540,
      },
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
