import { NavLink } from "react-router"
import { navbarClass, navContainerClass, navLinksClass, navLinkClass, navLinkActiveClass } from "../styles/common"
import { useAuth } from '../store/authStore'

function Header() {
  const currentUser = useAuth(state => state.currentUser)

  const getDashboardRoute = () => {
    if (currentUser?.role === 'USER') return '/userdashboard'
    if (currentUser?.role === 'AUTHOR') return '/authordashboard'
    if (currentUser?.role === 'ADMIN') return '/admindashboard'
    return '/'
  }

  return (
     <div className={navbarClass}>
        <div className={navContainerClass}>
        <NavLink to="/">
          <img width="80px" className="p-2 cursor-pointer hover:opacity-80 transition-opacity" src="https://static.vecteezy.com/system/resources/previews/000/626/702/original/education-book-logo-template-vector-illustration.jpg" alt="Home" />
        </NavLink>

        <ul className={navLinksClass}>
            <li>
                <NavLink to="/" className={({isActive})=>isActive?navLinkActiveClass:navLinkClass} >Home</NavLink>
            </li>
            
            {!currentUser ? (
              <>
                <li>
                    <NavLink to="/register" className={({isActive})=>isActive?navLinkActiveClass:navLinkClass}>Register</NavLink>
                </li>
                <li>
                    <NavLink to="/login" className={({isActive})=>isActive?navLinkActiveClass:navLinkClass}>Login</NavLink>
                </li>
              </>
            ) : (
                <li>
                    <NavLink to={getDashboardRoute()} className={({isActive})=>isActive?navLinkActiveClass:navLinkClass}>
                      Dashboard
                    </NavLink>
                </li>
            )}
        </ul>
        </div>
    </div>
  )
}

export default Header