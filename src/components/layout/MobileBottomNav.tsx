import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Factory, Wallet, Video } from 'lucide-react';
import { clsx } from 'clsx';

const mobileNavItems = [
  { id: 'dashboard', label: '首页', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'orders', label: '订单', icon: ClipboardList, path: '/orders' },
  { id: 'production', label: '生产', icon: Factory, path: '/production' },
  { id: 'finance', label: '财务', icon: Wallet, path: '/finance' },
  { id: 'content', label: '内容', icon: Video, path: '/content' },
];

export default function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-warm-200 z-30 flex items-center justify-around px-2 safe-area-bottom">
      {mobileNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={clsx(
              'flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl transition-colors min-w-0 flex-1',
              isActive
                ? 'text-primary-600'
                : 'text-gray-400 hover:text-gray-600'
            )}
          >
            <Icon className={clsx(
              'w-5 h-5',
              isActive && 'text-primary-500'
            )} />
            <span className={clsx(
              'text-[10px] font-medium',
              isActive && 'text-primary-600'
            )}>
              {item.label}
            </span>
            {isActive && (
              <span className="absolute top-0 w-6 h-0.5 bg-primary-500 rounded-full" />
            )}
          </button>
        );
      })}
    </nav>
  );
}