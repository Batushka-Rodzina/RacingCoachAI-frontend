// src/routes.tsx

import type { RouteObject } from 'react-router-dom'
import LandingPage from './pages/landing-page' 
import LoginPage from './pages/login-page' 
import RegisterPage from './pages/register-page'
import DashboardPage from './pages/dashboard-page';

export const routes: RouteObject[] = [
  { 
    path: '/', 
    element: <LandingPage /> 
  },
  { 
    path: '/login', 
    element: <LoginPage /> 
  },
  { 
    path: '/register', 
    element: <RegisterPage /> 
  },
  {
    path: '/dashboard', // Dodajemy trasę dashboard
    element: <DashboardPage />,
  },
]