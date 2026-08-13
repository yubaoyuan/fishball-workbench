import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardList, Receipt, Factory,
  MoreHorizontal, ShoppingCart, Truck, Wallet, Video, Users, Bot,
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
      {moreOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setMoreOpen(false)} />
      )}

      <div className={clsx(
        'lg:hidden fixed bottom-12 left-0 right-0 bg-white/98 backdrop-blur-xl border-t border-warm-200 z-40 transition-all duration-300 rounded-t-2xl shadow-2xl',
        moreOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
      )}>
        <div className="flex items-center justify-between px-3 py-2 border-b border-warm-100">
          <span className="text-[13px] font-semibold text-gray-700">全部功能</span>
          <button onClick={() => setMoreOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-warm-100 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2 p-3 pb-4 max-h-56 overflow-y-auto">
          {moreTabs.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => { navigate(item.path); setMoreOpen(false); }}
                className={clsx(
                  'flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-colors',
                  isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-500 hover:bg-warm-50'
                )}
              >
                <div className={clsx('w-9 h-9 rounded-lg flex items-center justify-center', isActive ? 'bg-primary-100' : 'bg-warm-100')}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-12 bg-white/95 backdrop-blur-md border-t border-warm-200 z-30 flex items-center justify-around safe-bottom">
        {mainTabs.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={clsx(
                'flex flex-col items-center justify-center gap-0.5 flex-1 h-full',
                isActive ? 'text-primary-600' : 'text-gray-400'
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
        <button
          onClick={() => setMoreOpen(!moreOpen)}
          className={clsx(
            'flex flex-col items-center justify-center gap-0.5 flex-1 h-full',
            isMoreActive || moreOpen ? 'text-primary-600' : 'text-gray-400'
          )}
        >
          <MoreHorizontal className="w-4 h-4" />
          <span className="text-[10px] font-medium">更多</span>
        </button>
      </nav>
    </>
  );
}