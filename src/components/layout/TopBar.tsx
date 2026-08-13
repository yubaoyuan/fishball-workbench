import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Menu } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useAuthStore } from '../../store/useAuthStore';
import { clsx } from 'clsx';

const tabs = [
  { id: 'dashboard', label: '首页', path: '/dashboard' },
  { id: 'orders', label: '订单', path: '/orders' },
  { id: 'sales', label: '销售', path: '/sales' },
  { id: 'purchasing', label: '采购', path: '/purchasing' },
  { id: 'production', label: '生产', path: '/production' },
  { id: 'delivery', label: '配送', path: '/delivery' },
  { id: 'finance', label: '财务', path: '/finance' },
  { id: 'content', label: '内容', path: '/content' },
  { id: 'customers', label: '客户', path: '/customers' },
  { id: 'ai', label: 'AI', path: '/ai' },
  { id: 'analytics', label: '数据', path: '/analytics' },
  { id: 'industry', label: '行业', path: '/industry' },
];

export default function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarCollapsed, toggleMobileSidebar } = useUIStore();
  const { currentUser } = useAuthStore();

  const allowedModules = currentUser?.permissions.modules || [];
  const visibleTabs = tabs.filter(tab => allowedModules.includes(tab.id));

  return (
    <header className={clsx(
      'fixed top-0 right-0 h-10 bg-white border-b border-warm-200 z-30 transition-all duration-300',
      'left-0 lg:left-[200px]',
      sidebarCollapsed && 'lg:left-[60px]',
    )}>
      <div className="h-full flex items-center px-2 lg:px-4">
        <div className="flex items-center gap-1.5 lg:hidden mr-1">
          <button onClick={toggleMobileSidebar} className="p-1 text-gray-500 hover:text-gray-700 hover:bg-warm-100 rounded-lg">
            <Menu className="w-4 h-4" />
          </button>
          <span className="font-bold text-gray-800 text-[13px]">渔宝源</span>
        </div>

        <div className="hidden lg:flex items-center gap-0.5 overflow-x-auto flex-1 scrollbar-hide">
          {visibleTabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={clsx(
                  'relative px-2.5 py-1 text-[13px] whitespace-nowrap rounded-md transition-all',
                  isActive
                    ? 'text-primary-600 font-semibold bg-primary-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-warm-50'
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          <button className="relative p-1 text-gray-400 hover:text-gray-600 hover:bg-warm-100 rounded-lg">
            <Bell className="w-3.5 h-3.5" />
          </button>
          {currentUser && (
            <div className="flex items-center gap-1">
              <span className="text-base leading-none">{currentUser.avatar}</span>
              <span className="hidden lg:block text-[13px] text-gray-600">{currentUser.displayName}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}