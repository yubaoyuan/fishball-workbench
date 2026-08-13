import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardList, ShoppingCart, Factory, Truck,
  Wallet, Video, Users, Bot, BarChart3, Globe, Fish, Shield, Cloud,
  ChevronLeft, ChevronRight, X, Receipt
} from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useAuthStore } from '../../store/useAuthStore';
import { clsx } from 'clsx';

const allNavGroups = [
  {
    title: '业务',
    items: [
      { id: 'dashboard', label: '首页', icon: LayoutDashboard, path: '/dashboard' },
      { id: 'orders', label: '订单', icon: ClipboardList, path: '/orders' },
      { id: 'sales', label: '销售单', icon: Receipt, path: '/sales' },
      { id: 'purchasing', label: '采购', icon: ShoppingCart, path: '/purchasing' },
      { id: 'production', label: '生产', icon: Factory, path: '/production' },
      { id: 'delivery', label: '配送', icon: Truck, path: '/delivery' },
      { id: 'finance', label: '财务', icon: Wallet, path: '/finance' },
    ]
  },
  {
    title: '营销',
    items: [
      { id: 'content', label: '内容', icon: Video, path: '/content' },
      { id: 'customers', label: '客户', icon: Users, path: '/customers' },
    ]
  },
  {
    title: '智能',
    items: [
      { id: 'ai-assistant', label: 'AI助手', icon: Bot, path: '/ai' },
      { id: 'analytics', label: '数据分析', icon: BarChart3, path: '/analytics' },
      { id: 'industry', label: '行业洞察', icon: Globe, path: '/industry' },
    ]
  },
  {
    title: '系统',
    items: [
      { id: 'users', label: '用户', icon: Shield, path: '/users' },
      { id: 'backup', label: '备份', icon: Cloud, path: '/backup' },
    ]
  }
];

export default function Sidebar() {
  const { sidebarCollapsed, mobileSidebarOpen, toggleSidebar, toggleMobileSidebar, setMobileSidebarOpen } = useUIStore();
  const { currentUser } = useAuthStore();
  const location = useLocation();

  const allowedModules = currentUser?.permissions.modules || [];
  const filteredNavGroups = allNavGroups.map(group => ({
    ...group,
    items: group.items.filter(item => allowedModules.includes(item.id)),
  })).filter(group => group.items.length > 0);

  const handleNavClick = () => setMobileSidebarOpen(false);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className={clsx(
        'h-10 flex items-center px-3 border-b border-warm-100',
        sidebarCollapsed ? 'justify-center' : 'justify-between'
      )}>
        <button onClick={toggleMobileSidebar} className="lg:hidden absolute right-2 top-2 p-1 text-gray-400 hover:text-gray-600 hover:bg-warm-100 rounded-lg">
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <Fish className="w-4 h-4 text-white" />
          </div>
          {!sidebarCollapsed && (
            <h1 className="font-bold text-gray-800 text-[14px]">渔宝源鱼丸店</h1>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {filteredNavGroups.map((group, groupIndex) => (
          <div key={groupIndex} className={clsx('mb-3', groupIndex > 0 && 'pt-2 border-t border-warm-100')}>
            {!sidebarCollapsed && (
              <div className="px-2 mb-1">
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{group.title}</span>
              </div>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    onClick={handleNavClick}
                    className={clsx(
                      'flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all text-[13px]',
                      isActive
                        ? 'bg-primary-50 text-primary-600 font-medium'
                        : 'text-gray-500 hover:bg-warm-50 hover:text-gray-700'
                    )}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <Icon className={clsx('w-4 h-4 flex-shrink-0', isActive ? 'text-primary-500' : 'text-gray-400')} />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-2 border-t border-warm-100">
        <button onClick={toggleSidebar} className="hidden lg:flex w-full items-center justify-center py-1.5 text-gray-400 hover:text-gray-600 hover:bg-warm-50 rounded-lg">
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-3.5 h-3.5" /><span className="text-[12px] ml-1">收起</span></>}
        </button>
      </div>
    </>
  );

  return (
    <>
      <aside className={clsx(
        'hidden lg:flex fixed left-0 top-0 h-screen bg-white border-r border-warm-200 flex-col z-40 transition-all duration-300',
        sidebarCollapsed ? 'w-[60px]' : 'w-[200px]'
      )}>
        {sidebarContent}
      </aside>

      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileSidebarOpen(false)} />
      )}

      <aside className={clsx(
        'lg:hidden fixed left-0 top-0 h-screen w-[200px] bg-white border-r border-warm-200 flex-col z-50 transition-transform duration-300 shadow-2xl',
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {sidebarContent}
      </aside>
    </>
  );
}