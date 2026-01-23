import React, { Children } from 'react'
import { useAuthStore } from '../store/authStore'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    if (!isAuthenticated) return <Navigate to='/sign-in' replace/>

    return children;
};

export default ProtectedRoute