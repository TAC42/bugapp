import { userService } from '../services/user.service.js'
import { LoginSignup } from './LoginSignup.jsx'

const { NavLink, Link } = ReactRouterDOM
const { useEffect, useState } = React
const { useNavigate } = ReactRouter

import { UserMsg } from './UserMsg.jsx'

export function AppHeader() {
  const [user, setUser] = useState(userService.getLoggedinUser())
  const navigate = useNavigate()

  function onLogout() {
    userService
      .logout()
      .then(() => {
        onSetUser(null)
      })
      .catch((err) => {
        showErrorMsg('OOPs try again')
      })
  }

  function onSetUser(user) {
    setUser(user)
    navigate('/')
  }

  return (
    <header className="app-header full main-layout">
      <UserMsg />
      <div className="header-container">
        <h1>Bugs are Forever</h1>
        <nav className="app-nav">
          <NavLink to="/">Home</NavLink> |<NavLink to="/bug">Bugs</NavLink> |
          <NavLink to="/about">About</NavLink>
        </nav>
      </div>
      {user ? (
        <section>
          <Link to={`/user/${user._id}`}>Hello {user.fullname}</Link>
          <button onClick={onLogout}>Logout</button>
        </section>
      ) : (
        <section>
          <LoginSignup onSetUser={onSetUser} />
        </section>
      )}
    </header>
  )
}
