import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './component/Navbar'
import BottomNavbar from './component/BottomNavbar'
import Sidebar from './component/Sidebar'
import { useEffect, useState } from 'react'

const Layout = () => {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Check if on auth pages
  const isAuthPage = ['/auth', '/onboarding'].includes(location.pathname)
  
  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem('token')
  
  // Auto scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  // Hide navbars on auth pages or if not logged in
  const hideTopNav = isAuthPage || location.pathname === '/404' || location.pathname === '/profile' || location.pathname === '/create'
  const hideBottomNav = isAuthPage || location.pathname === '/404'
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }
  
  // Determine if we should show the sidebar
  const shouldShowNav = !isAuthPage && !hideTopNav
  


  // Redirect to login if not logged in and trying to access protected routes
  useEffect(() => {
    const protectedRoutes = ['/', '/messages', '/profile', '/create'];
    if (!isLoggedIn && protectedRoutes.some(route => location.pathname.startsWith(route))) {
      if (location.pathname !== '/auth' && location.pathname !== '/onboarding') {
        window.location.href = '/auth';
      }
    }
  }, [isLoggedIn, location.pathname]);

  if (isAuthPage) {
    return <Outlet />;
  }

  return (
    <>
      {!hideTopNav && <div className="lg:hidden"><Navbar /></div>}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`transition-all duration-300 min-h-screen lg:ml-64`}>
        <Outlet />
      </div>
      {/* Show bottom navbar only on mobile */}
      {!hideBottomNav && <div className="lg:hidden"><BottomNavbar /></div>}
    </>
  )
}

export default Layout
