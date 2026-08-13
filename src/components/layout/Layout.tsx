import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MobileBottomNav from './MobileBottomNav';
import { useUIStore } from '../../store/useUIStore';
import { useDataStore } from '../../store/useDataStore';
import { clsx } from 'clsx';

export default function Layout() {
  const { sidebarCollapsed } = useUIStore();
  const init = useDataStore(s => s.init);
  const initialized = useDataStore(s => s.initialized);

  useEffect(() => {
    if (!initialized) {
      init();
    }
  }, [init, initialized]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className={clsx(
        'flex-1 flex flex-col min-h-screen transition-all duration-300',
        'lg:ml-[200px]',
        sidebarCollapsed && 'lg:ml-[60px]',
      )}>
        <TopBar />
        <main className="flex-1 overflow-auto p-3 lg:p-4 pb-16 lg:pb-4">
          <Outlet />
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}