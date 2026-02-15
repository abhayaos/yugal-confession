import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Messages from './pages/Messages'
import Profile from './pages/Profile'
import Auth from './pages/Auth'
import Onboarding from './pages/Onboarding'
import CreateConfession from './pages/CreateConfession'
import PageNotFound from './component/PageNotFound'
import Layout from './Layout'
import Admin from './pages/Admin'


import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout /> }>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateConfession />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/admin" element={<Admin />} />
        
        {/* Auth routes - no layout */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/onboarding" element={<Onboarding />} />
  
        {/* 404 — no navbars */}
        <Route path="/404" element={<PageNotFound />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  )
}

export default App
