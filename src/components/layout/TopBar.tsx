import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Plus, Menu, ChevronDown, RefreshCw, LogOut } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useAuthStore, MOCK_USERS } from '../../store/useAuthStore';
import { clsx } from 'clsx';

const tabs = [
  { id: 'dashboard', label: '首页', path: '/dashboard' },
  { id: 'orders', label: '订单', path: '/orders', count: 12 },
  { id: 'purchasing', label: '采购', path: '/purchasing', count: 3 },
  { id: 'production', label: '生产', path: '/production' },
  { id: 'delivery', label: '配送', path: '/delivery', count: 5 },
  { id: 'finance', label: '财务', path: '/finance' },
  { id: 'content', label: '内容', path: '/content', count: 8 },
  { id: 'customers', label: '客户', path: '/customers' },
  { id: 'ai', label: 'AI', path: '/ai' },
  { id: 'analytics', label: '数据', path: '/analytics' },
  { id: 'industry', label: '行业', path: '/industry' },
];

export default function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarCollapsed, toggleMobileSidebar } = useUIStore();
  const { currentUser, switchUser, logout } = useAuthStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 过滤当前用户可见的标签
  const allowedModules = currentUser?.permissions.modules || [];
  const visibleTabs = tabs.filter(tab => allowedModules.includes(tab.id));

  const handleSwitchUser = (userId: string) => {
    switchUser(userId);
    setUserMenuOpen(false);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  return (
    <header className={clsx(
      'fixed top-0 right-0 h-14 lg:h-16 bg-white/80 backdrop-blur-md border-b border-warm-200 z-30 transition-all duration-300',
      'left-0 lg:left-[240px]',
      sidebarCollapsed && 'lg:left-[72px]',
    )}>
      <div className="h-full flex items-center px-3 lg:px-6">
        {/* 手机端汉堡菜单 + Logo */}
        <div className="flex items-center gap-2 lg:hidden mr-2">
          <button
            onClick={toggleMobileSidebar}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-warm-100 rounded-xl transition-colors"
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
                  'relative px-3 lg:px-4 py-2 text-sm whitespace-nowrap transition-all duration-200 rounded-lg',
                  isActive
                    ? 'text-primary-600 font-semibold'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-warm-50'
                )}
              >
                <span className="flex items-center gap-1.5">
                  {tab.label}
                  {tab.count && (
                    <span className={clsx(
                      'min-w-[18px] h-[18px] px-1 rounded-full text-xs flex items-center justify-center',
                      isActive ? 'bg-primary-100 text-primary-600' : 'bg-warm-100 text-gray-500'
                    )}>
                      {tab.count}
                    </span>
                  )}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* 右侧操作区 */}
        <div className="flex items-center gap-2 lg:gap-3 ml-auto">
          {/* 搜索 */}
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索..."
              className="w-36 lg:w-48 pl-9 pr-4 py-2 bg-warm-50 border border-transparent rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-primary-200 focus:ring-2 focus:ring-primary-100 transition-all"
            />
          </div>

          <button className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-warm-100 rounded-xl transition-colors">
            <Search className="w-5 h-5" />
          </button>

          <button className="relative p-2 lg:p-2.5 text-gray-500 hover:text-gray-700 hover:bg-warm-100 rounded-xl transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
          </button>

          <button className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-md hover:shadow-lg">
            <Plus className="w-4 h-4" />
            新建
          </button>

          {/* 用户菜单 */}
          {currentUser && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 hover:bg-warm-50 rounded-xl transition-colors"
              >
                <span className="text-xl">{currentUser.avatar}</span>
                <span className="hidden lg:block text-sm text-gray-700 font-medium">{currentUser.displayName}</span>
                <ChevronDown className={clsx(
                  'hidden lg:block w-4 h-4 text-gray-400 transition-transform',
                  userMenuOpen && 'rotate-180'
                )} />
              </button>

              {/* 下拉菜单 */}
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-warm-200 py-2 z-50">
                  {/* 当前用户 */}
                  <div className="px-4 py-2 border-b border-warm-100">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{currentUser.avatar}</span>
                      <div>
                        <div className="font-medium text-sm text-gray-800">{currentUser.displayName}</div>
                        <div className="text-xs text-gray-500">{currentUser.roleLabel}</div>
                      </div>
                    </div>
                  </div>

                  {/* 切换用户 */}
                  <div className="px-3 py-2">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2 px-1">
                      <RefreshCw className="w-3.5 h-3.5" />
                      切换身份
                    </div>
                    {MOCK_USERS.filter(u => u.id !== currentUser.id).map(user => (
                      <button
                        key={user.id}
                        onClick={() => handleSwitchUser(user.id)}
                        className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-warm-50 transition-colors text-left"
                      >
                        <span className="text-xl">{user.avatar}</span>
                        <div>
                          <div className="text-sm text-gray-700">{user.displayName}</div>
                          <div className="text-xs text-gray-500">{user.roleLabel}</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* 退出 */}
                  <div className="border-t border-warm-100 pt-2 px-3">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">退出登录</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}