export function getRoute(page: Page, searchParams: URLSearchParams) {
  let nextUrl = ''

  nextUrl += `/${page}`

  let url = new URL(nextUrl, 'https://risk.marsprotocol.io')

  Array.from(searchParams?.entries() || []).map(([key, value]) =>
    url.searchParams.append(key, value),
  )

  return url.pathname + url.search
}

export function getPage(pathname: string): Page {
  const pages: Page[] = ['main']
  const segments = pathname.split('/')

  const page = segments.find((segment) => pages.includes(segment as Page))

  if (!page) return 'main' as Page

  return page as Page
}

export function getSearchParamsObject(searchParams: URLSearchParams) {
  const params: { [key: string]: string } = {}

  Array.from(searchParams?.entries() || []).forEach(([key, value]) => (params[key] = value))

  return params
}
