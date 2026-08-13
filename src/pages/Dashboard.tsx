import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useDataStore } from '../store/useDataStore';
import {
  ClipboardList,
  Wallet,
  Truck,
  ShoppingCart,
  Zap,
  Plus,
  Mic,
  FileText,
  Package,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Users,
  Video,
  AlertTriangle,
} from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';
import TodoList from '../components/business/TodoList';
import OrderCard from '../components/business/OrderCard';
import ContentCard from '../components/business/ContentCard';

const quickActions = [
  { icon: FileText, label: '记订单', color: 'from-primary-400 to-primary-600', path: '/orders' },
  { icon: ShoppingCart, label: '记采购', color: 'from-success-400 to-success-600', path: '/purchasing' },
  { icon: Package, label: '生产记录', color: 'from-warning-400 to-warning-600', path: '/production' },
  { icon: Truck, label: '发快递', color: 'from-blue-400 to-blue-600', path: '/delivery' },
  { icon: Mic, label: 'AI语音记账', color: 'from-purple-400 to-purple-600', path: '/ai-assistant' },
  { icon: Video, label: '写视频脚本', color: 'from-pink-400 to-pink-600', path: '/content' },
];

const aiSuggestions = [
  {
    type: 'warning',
    title: '库存预警',
    content: '淀粉库存不足，建议今天采购30斤',
    icon: AlertTriangle,
  },
  {
    type: 'tip',
    title: '客户提醒',
    content: '赵老师团购客户7天未下单，建议回访',
    icon: Users,
  },
  {
    type: 'trend',
    title: '经营建议',
    content: '虾丸销量本周增长23%，建议明天多生产10斤',
    icon: TrendingUp,
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const currentUser = useAuthStore(s => s.currentUser);
  const orders = useDataStore(s => s.orders);
  const financeRecords = useDataStore(s => s.financeRecords);
  const contents = useDataStore(s => s.contents);

  const todayIncome = financeRecords
    .filter(r => r.type === 'income' && r.date === '2026-07-08')
    .reduce((sum, r) => sum + r.amount, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length;
  const shippingOrders = orders.filter(o => o.status === 'shipping' || o.status === 'producing').length;
  const todayPurchases = financeRecords
    .filter(r => r.type === 'expense' && r.date === '2026-07-08')
    .reduce((sum, r) => sum + r.amount, 0);

  const recentOrders = orders.slice(0, 3);
  const recentContents = contents.filter(c => c.status !== 'published').slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{currentUser?.displayName || '老板'}好！👋</h1>
          <p className="text-gray-500 mt-1">今天是 2026年7月8日 星期三，祝您生意兴隆！</p>
        </div>
        <button
          onClick={() => navigate('/ai-assistant')}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
        >
          <Sparkles className="w-5 h-5" />
          AI助手
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="今日营收"
          value={`¥${todayIncome}`}
          icon={<Wallet className="w-6 h-6" />}
          trend={12}
          trendLabel="较昨日"
          color="primary"
        />
        <StatCard
          title="待处理订单"
          value={pendingOrders}
          icon={<ClipboardList className="w-6 h-6" />}
          color="warning"
        />
        <StatCard
          title="配送/生产中"
          value={shippingOrders}
          icon={<Truck className="w-6 h-6" />}
          color="info"
        />
        <StatCard
          title="今日支出"
          value={`¥${todayPurchases}`}
          icon={<ShoppingCart className="w-6 h-6" />}
          trend={-5}
          trendLabel="较昨日"
          color="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Zap className="w-5 h-5 text-warning-500" />
                快捷操作
              </h3>
            </div>
            <div className="grid grid-cols-6 gap-3">
              {quickActions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => navigate(action.path)}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-warm-50 transition-all group"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-gray-600 font-medium">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary-500" />
                AI智能提醒
              </h3>
              <span className="text-xs text-primary-500 flex items-center gap-1">
                实时更新
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" />
              </span>
            </div>
            <div className="space-y-3">
              {aiSuggestions.map((suggestion, idx) => {
                const Icon = suggestion.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-gradient-to-r from-primary-50/50 to-transparent rounded-xl border border-primary-100/50"
                  >
                    <div className={
                      suggestion.type === 'warning'
                        ? 'w-9 h-9 rounded-lg bg-warning-100 flex items-center justify-center flex-shrink-0'
                        : suggestion.type === 'tip'
                        ? 'w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0'
                        : 'w-9 h-9 rounded-lg bg-success-100 flex items-center justify-center flex-shrink-0'
                    }>
                      <Icon className={
                        suggestion.type === 'warning'
                          ? 'w-5 h-5 text-warning-600'
                          : suggestion.type === 'tip'
                          ? 'w-5 h-5 text-blue-600'
                          : 'w-5 h-5 text-success-600'
                      } />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{suggestion.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{suggestion.content}</p>
                    </div>
                    <button className="text-xs text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1">
                      处理 <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </Card>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">最近订单</h3>
              <button
                onClick={() => navigate('/orders')}
                className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1"
              >
                查看全部 <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {recentOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <TodoList />

          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Video className="w-5 h-5 text-pink-500" />
                待发布内容
              </h3>
              <button
                onClick={() => navigate('/content')}
                className="text-sm text-primary-500 hover:text-primary-600"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {recentContents.map(content => (
                <div
                  key={content.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-warm-50 cursor-pointer transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: content.coverColor + '20' }}
                  >
                    <Video className="w-5 h-5" style={{ color: content.coverColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 truncate">{content.title}</p>
                    <p className="text-xs text-gray-400">{content.topic}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
