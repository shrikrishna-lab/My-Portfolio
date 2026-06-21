import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import PublicLayout from './pages/public/PublicLayout';
import Home from './pages/public/Home';
import Sandbox from './pages/public/Sandbox';
import AdminPanel from './pages/admin/AdminPanel';
import SplashScreen from './components/SplashScreen';
import { useStore } from './lib/store';

function ScrollToHashElement() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [hash]);

  return null;
}

export default function App() {
  const isCrawler = typeof navigator !== 'undefined' && 
    /bot|google|baidu|bing|msn|duckduckgo|teoma|slurp|yandex|chrome-lighthouse|lighthouse|gptbot|perplexity|embedly|facebookexternalhit|twitterbot|linkedinbot/i.test(navigator.userAgent);

  const [splashDone, setSplashDone] = useState(isCrawler);
  const fetchAll = useStore((s) => s.fetchAll);

  useEffect(() => {
    fetchAll();
    if (isCrawler) {
      setSplashDone(true);
      return;
    }
    // Minimum 2.5s splash display
    const timer = setTimeout(() => setSplashDone(true), 2500);
    return () => clearTimeout(timer);
  }, [fetchAll, isCrawler]);

  return (
    <>
      <Router>
        <ScrollToHashElement />
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="sandbox" element={<Sandbox />} />
          </Route>
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Router>
      {!splashDone && <SplashScreen onFinish={() => setSplashDone(true)} />}
    </>
  );
}
