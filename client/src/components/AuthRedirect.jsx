import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

function AuthRedirect({children}) {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    if(isAuthenticated) return <Navigate to='/dashboard' replace/>
    return children;
    
}

export default AuthRedirect