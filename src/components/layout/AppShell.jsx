import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import TopBar from './TopBar';
import Sidebar from './Sidebar';

export default function AppShell() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.02 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="min-h-screen bg-permira-dark"
    >
      <TopBar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </motion.div>
  );
}
