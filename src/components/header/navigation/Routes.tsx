import { Navigate, Outlet, Route, Routes as RoutesWrapper } from 'react-router-dom'

import MainPage from 'pages/MainPage'
import Layout from 'pages/_layout'
import LiquidationsPage from 'pages/LiquidationsPage'
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
        <Route path='/main' element={<MainPage />} />
        <Route path='/liquidations' element={<LiquidationsPage />} />
        <Route path='/perps' element={<PerpsOverviewPage />} />

        <Route path='/' element={<MainPage />} />
        <Route path='*' element={<Navigate to='/' />} />
      </Route>
    </RoutesWrapper>
  )
}
