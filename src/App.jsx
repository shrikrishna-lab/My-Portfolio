import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './pages/public/PublicLayout';
import Home from './pages/public/Home';
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import UnifiedPanel from './pages/admin/UnifiedPanel';
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
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    checkSession();
    setAuthReady(true);
    fetchAll();
  }, [checkSession, fetchAll]);

  if (!authReady) return null;

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
          <Route index element={<UnifiedPanel />} />
        </Route>
      </Routes>
    </Router>
  );
}
