import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage     from './pages/LandingPage'
import LoginPage       from './pages/LoginPage'
import Dashboard       from './pages/Dashboard'
import Cadastro        from './pages/Cadastro'
import Estoque         from './pages/Estoque'
import Administrativo  from './pages/Administrativo'
import Financeiro      from './pages/Financeiro'
import WorkInProgress  from './pages/WorkInProgress'

export default function App() {
  const [user,          setUser]          = useState(null)
  const [sidebarAberta, setSidebarAberta] = useState(false)

  useEffect(() => {
    const raw   = localStorage.getItem('stockeasy_user')
    const token = localStorage.getItem('stockeasy_token')
    if (raw && token) {
      try { setUser(JSON.parse(raw)) } catch { setUser(null) }
    }
  }, [])

  function handleLogin(userObj) {
    localStorage.setItem('stockeasy_user', JSON.stringify(userObj))
    setUser(userObj)
  }

  function handleLogout() {
    localStorage.removeItem('stockeasy_user')
    localStorage.removeItem('stockeasy_token')
    setUser(null)
  }

  const sharedProps = {
    user,
    onLogout:        handleLogout,
    sidebarAberta,
    onToggleSidebar: () => setSidebarAberta(v => !v),
    onFecharSidebar: () => setSidebarAberta(false),
  }

  return (
    <Routes>
      <Route path="/"         element={<LandingPage />} />
      <Route path="/login"    element={user ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />} />
      <Route path="/register" element={<Navigate to="/login" replace />} />

      <Route path="/dashboard/*"      element={user ? <Dashboard      {...sharedProps} /> : <Navigate to="/login" replace />} />
      <Route path="/cadastro/"     element={user ? <Cadastro       {...sharedProps} /> : <Navigate to="/login" replace />} />
      <Route path="/estoque"        element={user ? <Estoque        {...sharedProps} /> : <Navigate to="/login" replace />} />
      <Route path="/administrativo" element={user ? <Administrativo {...sharedProps} /> : <Navigate to="/login" replace />} />
      <Route path="/financeiro"     element={user ? <Financeiro     {...sharedProps} /> : <Navigate to="/login" replace />} />
      <Route path="/ajuda"          element={user ? <WorkInProgress {...sharedProps} title="Ajuda" /> : <Navigate to="/login" replace />} />

      <Route path="/relatorios" element={<Navigate to="/" replace />} />
      <Route path="*"           element={<Navigate to="/" replace />} />
    </Routes>
  )
}