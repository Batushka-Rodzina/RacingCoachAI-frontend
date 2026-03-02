// src/routes.ts
import LoginPage from './pages/login-page';
import RegisterPage from './pages/register-page';
import LandingPage from './pages/landing-page';
import DashboardPage from './pages/dashboard-page';
import TelemetryPage from './pages/telemetry-page'; // Import nowej strony
import CommunityPage from './pages/community-page';
import TeamPage from './pages/team-page';


export const routes = [
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  // Nowa trasa:
  {
    path: '/telemetry',
    element: <TelemetryPage />,
  },

// Dodaj do routes:
{
	path: '/community',
	element: <CommunityPage />,
},
{
	path: '/team',
	element: <TeamPage />,
}
];