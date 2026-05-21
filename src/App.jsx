import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import RatingsPage from './pages/RatingsPage';
import useThemeStore from './store/useThemeStore';
import useAppStore from './store/useAppStore';

export default function App() {
  const initTheme = useThemeStore(s => s.init);
  const hydrateImages = useAppStore(s => s.hydrateImages);

  // Initialize dark mode class on mount
  useEffect(() => {
    initTheme();
  }, [initTheme]);

  useEffect(() => {
    hydrateImages();
  }, [hydrateImages]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/ratings" element={<RatingsPage />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
