// src/routes.ts
import CoachPage from './pages/coach-page'
import CommunityPage from './pages/community-page'
import DashboardPage from './pages/dashboard-page'
import LandingPage from './pages/landing-page'
import LoginPage from './pages/login-page'
import RegisterPage from './pages/register-page'
import TeamPage from './pages/team-page'

// === NOWE IMPORTY TELEMETRII ===
import SessionsListPage from './pages/SessionsListPage'
import TelemetryAnalysisPage from './pages/TelemetryAnalysisPage'

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

	// === ROZDZIELONE TRASY TELEMETRII ===
	{
		path: '/telemetry',
		element: <SessionsListPage />,
	},
	{
		path: '/telemetry/session/:sessionId/lap/:lapNum',
		element: <TelemetryAnalysisPage />,
	},

	{
		path: '/community',
		element: <CommunityPage />,
	},
	{
		path: '/coach',
		element: <CoachPage />,
	},
	{
		path: '/team',
		element: <TeamPage />,
	},
]
