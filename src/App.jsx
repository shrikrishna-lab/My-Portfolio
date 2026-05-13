import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './pages/public/PublicLayout';
import Home from './pages/public/Home';
import { useStore } from './lib/store';

export default function App() {
  const fetchAll = useStore((s) => s.fetchAll);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}
