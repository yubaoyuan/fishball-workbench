import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Menu, Fish } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useAuthStore } from '../../store/useAuthStore';
import { clsx } from 'clsx';

const tabs = [
  { id: 'dashboard', label: '首页', path: '/dashboard' },
  { id: 'orders', label: '订单', path: '/orders' },
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
      'fixed top-0 right-0 h-12 bg-white/80 backdrop-blur-md border-b border-warm-200 z-30 transition-all duration-300',
      'left-0 lg:left-[240px]',
      sidebarCollapsed && 'lg:left-[72px]',
    )}>
      <div className="h-full flex items-center px-3 lg:px-6">
        {/* 手机端汉堡菜单 + Logo */}
        <div className="flex items-center gap-2 lg:hidden mr-2">
          <button
            onClick={toggleMobileSidebar}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-warm-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-gray-800 text-sm">渔宝源鱼丸店</span>
        </div>

        {/* 顶部标签栏 */}
        <div className="hidden lg:flex items-center gap-1 overflow-x-auto flex-1 scrollbar-hide">
          {visibleTabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={clsx(
                  'relative px-3 py-1.5 text-sm whitespace-nowrap transition-all duration-200 rounded-lg',
                  isActive
                    ? 'text-primary-600 font-semibold'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-warm-50'
                )}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-primary-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* 右侧操作区 - 简化 */}
        <div className="flex items-center gap-2 ml-auto">
          <button className="relative p-1.5 text-gray-400 hover:text-gray-600 hover:bg-warm-100 rounded-lg transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          {currentUser && (
            <div className="flex items-center gap-1.5">
              <span className="text-lg">{currentUser.avatar}</span>
              <span className="hidden lg:block text-sm text-gray-600">{currentUser.displayName}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}