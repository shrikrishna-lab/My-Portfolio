import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './pages/public/PublicLayout';
import Home from './pages/public/Home';
import AdminPanel from './pages/admin/AdminPanel';
import SplashScreen from './components/SplashScreen';
import { useStore } from './lib/store';

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const fetchAll = useStore((s) => s.fetchAll);

  useEffect(() => {
    fetchAll();
    // Minimum 2.5s splash display
    const timer = setTimeout(() => setSplashDone(true), 2500);
    return () => clearTimeout(timer);
  }, [fetchAll]);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
          </Route>
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Router>
      {!splashDone && <SplashScreen onFinish={() => setSplashDone(true)} />}
    </>
  );
}
