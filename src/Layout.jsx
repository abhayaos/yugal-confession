import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import BottomNavbar from './component/BottomNavbar'
import { useEffect } from 'react'

const Layout = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const isAuthPage = ['/auth', '/onboarding'].includes(location.pathname)
  const isLoggedIn = !!localStorage.getItem('token')

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Redirect if not logged in
  useEffect(() => {
    const protectedRoutes = ['/', '/messages', '/profile', '/create']

    if (!isLoggedIn && protectedRoutes.includes(location.pathname)) {
      if (!isAuthPage) {
        navigate('/auth')
      }
    }
  }, [isLoggedIn, location.pathname, navigate, isAuthPage])

  // If auth page, don't show nav
  if (isAuthPage) {
    return <Outlet />
  }

  return (
    <div className="min-h-screen pb-20">
      <Outlet />
      <BottomNavbar />
    </div>
  )
}

export default Layout
