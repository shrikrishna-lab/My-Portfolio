import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './pages/public/PublicLayout';
import Home from './pages/public/Home';
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import ProjectsMgmt from './pages/admin/ProjectsMgmt';
import SkillsMgmt from './pages/admin/SkillsMgmt';
import PagesMgmt from './pages/admin/PagesMgmt';
import AchievementsMgmt from './pages/admin/AchievementsMgmt';
import MessagesDashboard from './pages/admin/MessagesDashboard';
import Settings from './pages/admin/Settings';
import { useStore } from './lib/store';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useStore((state) => state.auth.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

export default function App() {
  const fetchAll = useStore((s) => s.fetchAll);
  const checkSession = useStore((s) => s.checkSession);

  useEffect(() => {
    checkSession();
    fetchAll();
  }, [checkSession, fetchAll]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<ProjectsMgmt />} />
          <Route path="skills" element={<SkillsMgmt />} />
          <Route path="pages" element={<PagesMgmt />} />
          <Route path="achievements" element={<AchievementsMgmt />} />
          <Route path="messages" element={<MessagesDashboard />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}
