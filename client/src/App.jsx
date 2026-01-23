import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Signup from './pages/Signup'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import ProtectedRoute from './components/ProtectedRoute'
import AuthRedirect from './components/AuthRedirect'
import Dashboard from './pages/Dashboard'
import { useEffect, useRef } from 'react'
import { useAuthStore } from './store/authStore'
import DashboardLayout from './layouts/DashboardLayout'
import PublicLayout from './layouts/PublicLayout'
import Profile from './pages/Profile'

function App() {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const initAuth = async () => {
      const { refreshToken, setAuth, logout, user } =
        useAuthStore.getState();

      if (!refreshToken) return;

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          }
        );

        if (!res.ok) throw new Error("Session expired");

        const data = await res.json();
        setAuth(user, data.accessToken, refreshToken);
      } catch {
        logout();
      }
    };

    initAuth();
  }, []);


  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path='/dashboard' element={<ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>} />
        </Route>
        <Route element={<DashboardLayout />}>
          <Route path='/profile' element={<ProtectedRoute>
            <Profile />
          </ProtectedRoute>} />
        </Route>
        <Route element={<PublicLayout />}>
          <Route element={<Home />} path='/' />
        </Route>
        <Route element={<AuthRedirect>
          <Signup />
        </AuthRedirect>} path='/sign-up' />
        <Route element={<AuthRedirect>
          <SignIn />
        </AuthRedirect>} path='/sign-in' />
      </Routes>
    </BrowserRouter>
  )
}

export default App
