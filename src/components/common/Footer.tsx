import { DocURL } from 'types/enums'
import { TextLink } from 'components/common/TextLink'
import useStore from 'store'

import packageInfo from '../../../package.json'
import { useSearchParams } from 'react-router-dom'

export default function Footer() {
  const version = `v${packageInfo.version}`
  const flatVersion = packageInfo.version.split('.').join('')

  const [searchParams] = useSearchParams()
  const isIframeView = searchParams.get('iframeView') === 'on'

  if (isIframeView) return null

  return (
    <footer className='flex items-center justify-center w-full h-6 -mt-6'>
      <div className='w-full p-2 pt-0 text-right md:p-4'>
        <TextLink
          className='text-xs text-white opacity-50 hover:text-white hover:opacity-80'
          href={`${DocURL.FEATURE_URL}${version}`}
          target='_blank'
          title={`Mars Protocol ${version} change log`}
        >
          {version}
        </TextLink>
      </div>
    </footer>
  )
}
