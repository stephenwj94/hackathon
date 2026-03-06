import { HashRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './hooks/useAuth';
import PasswordGate from './components/auth/PasswordGate';
import AppShell from './components/layout/AppShell';
import Dashboard from './views/Dashboard';
import BenchmarkView from './views/BenchmarkView';
import CompanyProfile from './views/CompanyProfile';
import UploadCenter from './views/UploadCenter';

export default function App() {
  const { isAuthenticated, login } = useAuth();

  return (
    <AnimatePresence mode="wait">
      {!isAuthenticated ? (
        <PasswordGate key="gate" onLogin={login} />
      ) : (
        <HashRouter key="app">
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/benchmark" element={<BenchmarkView />} />
              <Route path="/company/:slug" element={<CompanyProfile />} />
              <Route path="/upload" element={<UploadCenter />} />
            </Route>
          </Routes>
        </HashRouter>
      )}
    </AnimatePresence>
  );
}
