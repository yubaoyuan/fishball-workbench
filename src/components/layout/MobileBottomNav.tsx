import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardList, Receipt, ShoppingCart,
  Factory, Truck, Wallet, Video, Users, Bot, MoreHorizontal,
  BarChart3, Globe, Shield, Cloud, X
} from 'lucide-react';
import { clsx } from 'clsx';

const mainTabs = [
  { id: 'dashboard', label: '首页', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'orders', label: '订单', icon: ClipboardList, path: '/orders' },
  { id: 'sales', label: '销售', icon: Receipt, path: '/sales' },
  { id: 'production', label: '生产', icon: Factory, path: '/production' },
];

const moreTabs = [
  { id: 'purchasing', label: '采购', icon: ShoppingCart, path: '/purchasing' },
  { id: 'delivery', label: '配送', icon: Truck, path: '/delivery' },
  { id: 'finance', label: '财务', icon: Wallet, path: '/finance' },
  { id: 'content', label: '内容', icon: Video, path: '/content' },
  { id: 'customers', label: '客户', icon: Users, path: '/customers' },
  { id: 'ai', label: 'AI助手', icon: Bot, path: '/ai' },
  { id: 'analytics', label: '数据', icon: BarChart3, path: '/analytics' },
  { id: 'industry', label: '行业', icon: Globe, path: '/industry' },
  { id: 'users', label: '用户', icon: Shield, path: '/users' },
  { id: 'backup', label: '备份', icon: Cloud, path: '/backup' },
];

export default function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [moreOpen, setMoreOpen] = useState(false);

  const isMoreActive = moreTabs.some(t => location.pathname === t.path);

  return (
    <>
      {/* 更多菜单遮罩 */}
      {moreOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setMoreOpen(false)}
        />
      )}

      {/* 更多菜单弹出面板 */}
      <div className={clsx(
        'lg:hidden fixed bottom-16 left-0 right-0 bg-white/98 backdrop-blur-xl border-t border-warm-200 z-40 transition-all duration-300 rounded-t-2xl shadow-2xl',
        moreOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
      )}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-warm-100">
          <span className="text-sm font-semibold text-gray-700">全部功能</span>
          <button
            onClick={() => setMoreOpen(false)}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-warm-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-3 p-4 pb-6 max-h-64 overflow-y-auto">
          {moreTabs.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => { navigate(item.path); setMoreOpen(false); }}
                className={clsx(
                  'flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-500 hover:bg-warm-50'
                )}
              >
                <div className={clsx(
                  'w-11 h-11 rounded-xl flex items-center justify-center',
                  isActive ? 'bg-primary-100' : 'bg-warm-100'
                )}>
                  <Icon className={clsx('w-5 h-5', isActive && 'text-primary-600')} />
                </div>
                <span className={clsx(
                  'text-[11px] font-medium',
                  isActive && 'text-primary-600'
                )}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 底部导航栏 */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-warm-200 z-30 flex items-center justify-around px-1 safe-bottom">
        {mainTabs.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={clsx(
                'flex flex-col items-center justify-center gap-0.5 py-1 rounded-xl transition-colors min-w-0 flex-1',
                isActive
                  ? 'text-primary-600'
                  : 'text-gray-400 active:text-gray-600'
              )}
            >
              <Icon className={clsx('w-5 h-5', isActive && 'text-primary-500')} />
              <span className={clsx('text-[10px] font-medium', isActive && 'text-primary-600')}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute top-0 w-6 h-0.5 bg-primary-500 rounded-full" />
              )}
            </button>
          );
        })}

        {/* 更多按钮 */}
        <button
          onClick={() => setMoreOpen(!moreOpen)}
          className={clsx(
            'flex flex-col items-center justify-center gap-0.5 py-1 rounded-xl transition-colors min-w-0 flex-1',
            isMoreActive || moreOpen
              ? 'text-primary-600'
              : 'text-gray-400 active:text-gray-600'
          )}
        >
          <MoreHorizontal className={clsx('w-5 h-5', (isMoreActive || moreOpen) && 'text-primary-500')} />
          <span className={clsx('text-[10px] font-medium', (isMoreActive || moreOpen) && 'text-primary-600')}>
            更多
          </span>
        </button>
      </nav>
    </>
  );
}