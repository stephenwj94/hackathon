import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import CompanyTabBar from './CompanyTabBar';

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.02 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="min-h-screen bg-permira-dark"
    >
      <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <CompanyTabBar />
      <div className="flex relative">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden min-h-screen">
          <Outlet />
        </main>
      </div>
    </motion.div>
  );
}
