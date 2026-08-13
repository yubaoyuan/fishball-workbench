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
    <div className="flex h-screen bg-warm-50">
      <Sidebar />
      <div className={clsx(
        'flex-1 flex flex-col min-h-screen transition-all duration-300',
        'lg:ml-[240px]', // 默认桌面端偏移
        sidebarCollapsed && 'lg:ml-[72px]', // 桌面端折叠后偏移
        // 手机端无偏移
      )}>
        <TopBar />
        <main className="flex-1 overflow-auto p-4 lg:p-6 pb-20 lg:pb-6">
          <Outlet />
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}