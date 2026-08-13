import { useState } from 'react';
import { Search, Plus, LayoutGrid, List, Filter, Sparkles } from 'lucide-react';
import OrderCard from '../components/business/OrderCard';
import Card from '../components/ui/Card';
import { clsx } from 'clsx';
import { useDataStore } from '../store/useDataStore';

export default function Orders() {
  const orders = useDataStore(s => s.orders);
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const tabs = [
    { id: 'all', label: '全部', count: orders.length },
    { id: 'pending', label: '待处理', count: orders.filter(o => o.status === 'pending').length },
    { id: 'producing', label: '生产中', count: orders.filter(o => o.status === 'producing').length },
    { id: 'shipping', label: '配送中', count: orders.filter(o => o.status === 'shipping').length },
    { id: 'delivered', label: '已完成', count: orders.filter(o => o.status === 'delivered').length },
  ];

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter(o => o.status === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">订单管理</h1>
          <p className="text-gray-500 mt-1">管理所有订单，支持AI自动识别录入</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-warm-100 text-gray-700 rounded-xl font-medium hover:bg-warm-200 transition-colors">
            <Sparkles className="w-4 h-4 text-primary-500" />
            AI智能录单
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all">
            <Plus className="w-4 h-4" />
            新建订单
          </button>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all',
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white font-medium shadow-sm'
                    : 'text-gray-600 hover:bg-warm-50'
                )}
              >
                {tab.label}
                <span className={clsx(
                  'px-1.5 py-0.5 rounded-full text-xs',
                  activeTab === tab.id ? 'bg-white/20' : 'bg-warm-200 text-gray-500'
                )}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索订单、客户..."
                className="w-48 pl-9 pr-4 py-2 bg-warm-50 border border-transparent rounded-xl text-sm focus:outline-none focus:bg-white focus:border-primary-200"
              />
            </div>
            <button className="p-2 text-gray-500 hover:bg-warm-100 rounded-xl transition-colors">
              <Filter className="w-5 h-5" />
            </button>
            <div className="flex bg-warm-50 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={clsx(
                  'p-1.5 rounded-lg transition-colors',
                  viewMode === 'grid' ? 'bg-white shadow-sm text-primary-500' : 'text-gray-400'
                )}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={clsx(
                  'p-1.5 rounded-lg transition-colors',
                  viewMode === 'list' ? 'bg-white shadow-sm text-primary-500' : 'text-gray-400'
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      <div className={clsx(
        'gap-4',
        viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-3' : 'flex flex-col'
      )}>
        {filteredOrders.map(order => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
