import { Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import CareerIntentPage from './pages/CareerIntentPage.jsx';
import GithubPage from './pages/GithubPage.jsx';
import ResumePage from './pages/ResumePage.jsx';
import RoadmapPage from './pages/RoadmapPage.jsx';
import CareerDecisionPage from './pages/CareerDecisionPage.jsx';
import TrendsPage from './pages/TrendsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import MentorModePage from './pages/MentorModePage.jsx';
import SmartMockTestPage from './pages/SmartMockTestPage.jsx';
import Layout from './components/Layout.jsx';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-obsidian-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gold-400 font-semibold">Loading DevGap AI...</p>
      </div>
    </div>
  );
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? children : <Navigate to="/dashboard" />;
};

// Redirects /mentor?action=X → /mentor-mode?action=X
function MentorRedirect() {
  const [searchParams] = useSearchParams();
  const action = searchParams.get('action');
  return <Navigate to={action ? `/mentor-mode?action=${action}` : '/mentor-mode'} replace />;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="mentor-mode" element={<MentorModePage />} />
          {/* Alias: /mentor?action=fix_resume → /mentor-mode?action=fix_resume */}
          <Route path="mentor" element={<MentorRedirect />} />
          <Route path="career-intent" element={<CareerIntentPage />} />
          <Route path="github" element={<GithubPage />} />
          <Route path="resume" element={<ResumePage />} />
          <Route path="roadmap" element={<RoadmapPage />} />
          <Route path="career-decision" element={<CareerDecisionPage />} />
          <Route path="trends" element={<TrendsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="mock-test" element={<SmartMockTestPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
