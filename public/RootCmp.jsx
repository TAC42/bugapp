const Router = ReactRouterDOM.BrowserRouter
const { Route, Routes } = ReactRouterDOM
import routes from './routes.js'

import { AppHeader } from './cmps/AppHeader.jsx'
import { AppFooter } from './cmps/AppFooter.jsx'
import { UserMsg } from './cmps/UserMsg.jsx'

export function App() {
  return (
    <Router>
      <div>
        <AppHeader />
        <main>
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.path}
                element={<route.component />}
                path={route.path}
              />
            ))}
          </Routes>
        </main>
        <AppFooter />
        <UserMsg />
      </div>
    </Router>
  )
}
