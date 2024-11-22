import { Navigate, Outlet, Route, Routes as RoutesWrapper } from 'react-router-dom'

import MainPage from 'pages/MainPage'
import Layout from 'pages/_layout'
import LiquidationsPage from 'pages/LiquidationsPage'
import PerpsOverviewPage from 'pages/PerpsOverviewPage'
import useChainConfig from 'hooks/chain/useChainConfig'

export default function Routes() {
  const chainConfig = useChainConfig()

  return (
    <RoutesWrapper>
      <Route
        element={
          <Layout>
            <Outlet />
          </Layout>
        }
      >
        <Route path='*' element={<Navigate to='/' />} />
        <Route path='/' element={<MainPage />} />

        <Route path='/main' element={<MainPage />} />
        <Route path='/liquidations' element={<LiquidationsPage />} />
        {chainConfig.perps && <Route path='/perps' element={<PerpsOverviewPage />} />}
      </Route>
    </RoutesWrapper>
  )
}
