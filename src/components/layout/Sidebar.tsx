import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  ShoppingCart,
  Factory,
  Truck,
  Wallet,
  Video,
  Users,
  Bot,
  BarChart3,
  Globe,
  Fish,
  Shield,
  Cloud,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
  LogOut,
  Receipt
} from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useAuthStore } from '../../store/useAuthStore';
import { clsx } from 'clsx';

const allNavGroups = [
  {
    title: '工作台',
    items: [
      { id: 'dashboard', label: '工作台首页', icon: LayoutDashboard, path: '/dashboard', badge: 0 },
    ]
  },
  {
    title: '业务管理',
    items: [
      { id: 'orders', label: '订单管理', icon: ClipboardList, path: '/orders', badge: 12 },
      { id: 'sales', label: '销售单', icon: Receipt, path: '/sales', badge: 8 },
      { id: 'purchasing', label: '采购管理', icon: ShoppingCart, path: '/purchasing', badge: 3 },
      { id: 'production', label: '生产管理', icon: Factory, path: '/production', badge: 0 },
      { id: 'delivery', label: '配送快递', icon: Truck, path: '/delivery', badge: 5 },
      { id: 'finance', label: '财务管理', icon: Wallet, path: '/finance', badge: 0 },
    ]
  },
  {
    title: '营销增长',
    items: [
      { id: 'content', label: '内容创作', icon: Video, path: '/content', badge: 8 },
      { id: 'customers', label: '客户管理', icon: Users, path: '/customers', badge: 0 },
    ]
  },
  {
    title: 'AI智能',
    items: [
      { id: 'ai-assistant', label: 'AI助手', icon: Bot, path: '/ai', badge: 0 },
      { id: 'analytics', label: '数据分析', icon: BarChart3, path: '/analytics', badge: 0 },
    ]
  },
  {
    title: '行业洞察',
    items: [
      { id: 'industry', label: '行业洞察', icon: Globe, path: '/industry', badge: 0 },
    ]
  },
  {
    title: '系统管理',
    items: [
      { id: 'users', label: '用户管理', icon: Shield, path: '/users', badge: 0 },
      { id: 'backup', label: '数据备份', icon: Cloud, path: '/backup', badge: 0 },
    ]
  }
];

export default function Sidebar() {
  const { sidebarCollapsed, mobileSidebarOpen, toggleSidebar, toggleMobileSidebar, setMobileSidebarOpen } = useUIStore();
  const { currentUser, logout } = useAuthStore();
  const location = useLocation();

  // 根据角色过滤可见菜单
  const allowedModules = currentUser?.permissions.modules || [];
  const filteredNavGroups = allNavGroups.map(group => ({
    ...group,
    items: group.items.filter(item => allowedModules.includes(item.id)),
  })).filter(group => group.items.length > 0);

  const handleNavClick = () => {
    setMobileSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMobileSidebarOpen(false);
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className={clsx(
        'h-16 flex items-center px-4 border-b border-warm-100',
        sidebarCollapsed ? 'justify-center' : 'justify-between'
      )}>
        {/* 手机端关闭按钮 */}
        <button
          onClick={toggleMobileSidebar}
          className="lg:hidden absolute right-3 top-3 p-2 text-gray-400 hover:text-gray-600 hover:bg-warm-100 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md">
            <Fish className="w-6 h-6 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div>
              <h1 className="font-bold text-gray-800 text-base leading-tight">渔宝源鱼丸店</h1>
              <p className="text-xs text-gray-500">AI智能工作台</p>
            </div>
          )}
        </div>
      </div>

      {/* 当前用户信息 */}
      {currentUser && !sidebarCollapsed && (
        <div className="px-4 py-3 border-b border-warm-100 bg-gradient-to-r from-primary-50 to-warm-50">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{currentUser.avatar}</span>
            <div className="min-w-0">
              <div className="font-medium text-sm text-gray-800 truncate">{currentUser.displayName}</div>
              <div className="text-xs text-gray-500">{currentUser.roleLabel}</div>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {filteredNavGroups.map((group, groupIndex) => (
          <div key={groupIndex} className={clsx('mb-6', groupIndex > 0 && 'pt-4 border-t border-warm-100')}>
            {!sidebarCollapsed && (
              <div className="px-3 mb-2">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {group.title}
                </span>
              </div>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    onClick={handleNavClick}
                    className={clsx(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group',
                      isActive
                        ? 'bg-primary-50 text-primary-600 font-medium shadow-sm'
                        : 'text-gray-600 hover:bg-warm-50 hover:text-gray-800'
                    )}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <Icon className={clsx(
                      'w-5 h-5 flex-shrink-0',
                      isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-600'
                    )} />
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1 text-sm">{item.label}</span>
                        {item.badge > 0 && (
                          <span className={clsx(
                            'min-w-[20px] h-5 px-1.5 rounded-full text-xs font-medium flex items-center justify-center',
                            isActive
                              ? 'bg-primary-500 text-white'
                              : 'bg-warm-200 text-gray-600'
                          )}>
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-warm-100">
        {!sidebarCollapsed && currentUser ? (
          <>
            <div className="bg-gradient-to-br from-warm-50 to-primary-50 rounded-xl p-3 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Cloud className="w-4 h-4 text-primary-500" />
                <span className="text-xs font-medium text-gray-700">数据同步</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 bg-warm-200 rounded-full h-1.5">
                  <div className="bg-primary-500 h-1.5 rounded-full w-3/4"></div>
                </div>
                <span className="text-xs text-gray-500">75%</span>
              </div>
              <button className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-white rounded-lg text-xs text-primary-600 font-medium hover:bg-primary-50 transition-colors">
                <RefreshCw className="w-3 h-3" />
                立即同步
              </button>
            </div>
            {/* 退出登录 */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-xs">退出登录</span>
            </button>
          </>
        ) : null}
        {/* 桌面端折叠按钮 */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex w-full items-center justify-center gap-2 py-2.5 text-gray-400 hover:text-gray-600 hover:bg-warm-50 rounded-lg transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-xs">收起侧栏</span>
            </>
          )}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* 桌面端侧栏 */}
      <aside
        className={clsx(
          'hidden lg:flex fixed left-0 top-0 h-screen bg-white border-r border-warm-200 flex-col z-40 transition-all duration-300',
          sidebarCollapsed ? 'w-[72px]' : 'w-[240px]'
        )}
      >
        {sidebarContent}
      </aside>

      {/* 手机端遮罩 */}
      {mobileSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* 手机端侧栏（抽屉式） */}
      <aside
        className={clsx(
          'lg:hidden fixed left-0 top-0 h-screen w-[240px] bg-white border-r border-warm-200 flex flex-col z-50 transition-transform duration-300 shadow-2xl',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}