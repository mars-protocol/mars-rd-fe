import { Navigate, Outlet, Route, Routes as RoutesWrapper } from 'react-router-dom'

import Layout from 'pages/_layout'
import LiquidationsPage from 'pages/LiquidationsPage'
import MainPage from 'pages/MainPage'
import PerpsOverviewPage from 'pages/PerpsOverviewPage'

export default function Routes() {
  return (
    <RoutesWrapper>
      <Route
        element={
          <Layout>
            <Outlet />
          </Layout>
        }
      >
        <Route path='/' element={<MainPage />} />
        <Route path='/main' element={<MainPage />} />
        <Route path='/liquidations' element={<LiquidationsPage />} />
        <Route path='/perps' element={<PerpsOverviewPage />}>
          <Route path=':asset' element={<PerpsOverviewPage />} />
        </Route>
      </Route>
      <Route path='*' element={<Navigate to='/main' replace />} />
    </RoutesWrapper>
  )
}
