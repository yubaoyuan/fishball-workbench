import { useMemo } from 'react';
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
  TrendingDown,
  Users,
  Video,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Target,
} from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';
import TodoList from '../components/business/TodoList';
import OrderCard from '../components/business/OrderCard';

// 获取今天的日期字符串
function today(): string { return new Date().toISOString().split('T')[0]; }
function daysAgo(n: number): string {
  const d = new Date(); d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}
function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  return `${m}月${d}日`;
}
function getWeekday(): string {
  const days = ['日', '一', '二', '三', '四', '五', '六'];
  return `星期${days[new Date().getDay()]}`;
}

const quickActions = [
  { icon: FileText, label: '记订单', color: 'from-primary-400 to-primary-600', path: '/orders' },
  { icon: ShoppingCart, label: '记采购', color: 'from-success-400 to-success-600', path: '/purchasing' },
  { icon: Package, label: '生产记录', color: 'from-warning-400 to-warning-600', path: '/production' },
  { icon: Truck, label: '发快递', color: 'from-blue-400 to-blue-600', path: '/delivery' },
  { icon: Mic, label: 'AI语音记账', color: 'from-purple-400 to-purple-600', path: '/ai' },
  { icon: Video, label: '写视频脚本', color: 'from-pink-400 to-pink-600', path: '/content' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const currentUser = useAuthStore(s => s.currentUser);
  const orders = useDataStore(s => s.orders);
  const salesOrders = useDataStore(s => s.salesOrders);
  const financeRecords = useDataStore(s => s.financeRecords);
  const production = useDataStore(s => s.production);
  const todos = useDataStore(s => s.todos);
  const contents = useDataStore(s => s.contents);

  const todayStr = today();
  const yesterdayStr = daysAgo(1);

  // 今日数据
  const todayOrders = useMemo(() => salesOrders.filter(o => o.salesDate === todayStr), [salesOrders, todayStr]);
  const todayInProduction = useMemo(() => orders.filter(o => (o.status === 'pending' || o.status === 'confirmed' || o.status === 'producing')), [orders]);
  const todayShipping = useMemo(() => orders.filter(o => (o.status === 'shipping')), [orders]);
  const todayIncome = useMemo(() => financeRecords.filter(r => r.type === 'income' && r.date === todayStr).reduce((s, r) => s + r.amount, 0), [financeRecords, todayStr]);
  const todayExpense = useMemo(() => financeRecords.filter(r => r.type === 'expense' && r.date === todayStr).reduce((s, r) => s + r.amount, 0), [financeRecords, todayStr]);
  const todaySalesAmount = useMemo(() => todayOrders.reduce((s, o) => s + o.totalAmount, 0), [todayOrders]);
  const todayProduction = useMemo(() => production.filter(p => p.date === todayStr).reduce((s, p) => s + p.quantity, 0), [production, todayStr]);

  // 昨日数据（对比）
  const yesterdayIncome = useMemo(() => financeRecords.filter(r => r.type === 'income' && r.date === yesterdayStr).reduce((s, r) => s + r.amount, 0), [financeRecords, yesterdayStr]);
  const yesterdayExpense = useMemo(() => financeRecords.filter(r => r.type === 'expense' && r.date === yesterdayStr).reduce((s, r) => s + r.amount, 0), [financeRecords, yesterdayStr]);
  const yesterdayOrders = useMemo(() => salesOrders.filter(o => o.salesDate === yesterdayStr).length, [salesOrders, yesterdayStr]);
  const yesterdaySalesAmount = useMemo(() => salesOrders.filter(o => o.salesDate === yesterdayStr).reduce((s, o) => s + o.totalAmount, 0), [salesOrders, yesterdayStr]);

  // 趋势计算
  const incomeTrend = yesterdayIncome > 0 ? Math.round(((todayIncome - yesterdayIncome) / yesterdayIncome) * 100) : 0;
  const expenseTrend = yesterdayExpense > 0 ? Math.round(((todayExpense - yesterdayExpense) / yesterdayExpense) * 100) : 0;
  const orderTrend = yesterdayOrders > 0 ? Math.round(((todayOrders.length - yesterdayOrders) / yesterdayOrders) * 100) : 0;

  // 今日任务
  const completedTodos = todos.filter(t => t.completed).length;
  const totalTodos = todos.length;
  const todoProgress = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  const recentOrders = orders.slice(0, 3);
  const recentContents = contents.filter(c => c.status !== 'published').slice(0, 4);

  const aiSuggestions = [
    {
      type: 'warning' as const,
      title: '库存预警',
      content: todayProduction > 0 ? `今日已生产${todayProduction}斤鱼丸，草鱼库存需补充` : '今日尚未记录生产，请及时更新',
      icon: AlertTriangle,
    },
    {
      type: 'tip' as const,
      title: '待办提醒',
      content: todos.filter(t => !t.completed).length > 0 ? `还有${todos.filter(t => !t.completed).length}项待办未完成` : '今日待办已全部完成！',
      icon: Users,
    },
    {
      type: 'trend' as const,
      title: '经营数据',
      content: todayOrders.length > 0 ? `今日已接${todayOrders.length}单，销售额¥${todaySalesAmount.toLocaleString()}` : '今日暂无销售记录，加油！',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-5 lg:space-y-6">
      {/* 顶部问候 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-800">{currentUser?.displayName || '老板'}好！👋</h1>
          <p className="text-xs lg:text-sm text-gray-500 mt-1">{todayStr} {getWeekday()} · 祝您生意兴隆！</p>
        </div>
        <button
          onClick={() => navigate('/ai')}
          className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
        >
          <Sparkles className="w-5 h-5" />
          AI助手
        </button>
      </div>

      {/* 今日进度卡片 */}
      <Card className="p-4 lg:p-5 bg-gradient-to-r from-primary-50/50 via-white to-white border-primary-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary-500" />
            今日进度
          </h3>
          <span className="text-xs text-gray-400">{formatDate(todayStr)}</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          <div className="bg-white rounded-xl p-3 border border-warm-100">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">销售单</span>
              <span className="text-xs text-gray-400">{todayOrders.length}单</span>
            </div>
            <div className="text-lg font-bold text-gray-800">¥{todaySalesAmount.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-0.5">
              {orderTrend >= 0 ? (
                <TrendingUp className="w-3 h-3 text-success-500" />
              ) : (
                <TrendingDown className="w-3 h-3 text-danger-500" />
              )}
              <span className={`text-xs ${orderTrend >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                {orderTrend >= 0 ? '+' : ''}{orderTrend}% 较昨日
              </span>
            </div>
          </div>
          <div className="bg-white rounded-xl p-3 border border-warm-100">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">今日收入</span>
              <span className="text-xs text-gray-400">较昨日</span>
            </div>
            <div className="text-lg font-bold text-success-600">¥{todayIncome.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className={`text-xs ${incomeTrend >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                {incomeTrend >= 0 ? '+' : ''}{incomeTrend}%
              </span>
            </div>
          </div>
          <div className="bg-white rounded-xl p-3 border border-warm-100">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">今日支出</span>
              <span className="text-xs text-gray-400">较昨日</span>
            </div>
            <div className="text-lg font-bold text-danger-600">¥{todayExpense.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className={`text-xs ${expenseTrend <= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                {expenseTrend >= 0 ? '+' : ''}{expenseTrend}%
              </span>
            </div>
          </div>
          <div className="bg-white rounded-xl p-3 border border-warm-100">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">今日生产</span>
              <span className="text-xs text-gray-400">{todayProduction}斤</span>
            </div>
            <div className="text-lg font-bold text-primary-600">{todayProduction}斤</div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-xs text-gray-500">待处理 {todayInProduction.length} 单</span>
            </div>
          </div>
        </div>
        {/* 任务进度条 */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">今日任务</span>
              <span className="text-xs font-medium text-primary-600">{completedTodos}/{totalTodos}</span>
            </div>
            <div className="w-full h-2 bg-warm-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-500"
                style={{ width: `${todoProgress}%` }}
              />
            </div>
          </div>
          <span className="text-xs font-bold text-primary-600">{todoProgress}%</span>
        </div>
      </Card>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard
          title="今日营收"
          value={`¥${todayIncome.toLocaleString()}`}
          icon={<Wallet className="w-5 lg:w-6 h-5 lg:h-6" />}
          trend={incomeTrend}
          trendLabel="较昨日"
          color="primary"
        />
        <StatCard
          title="待处理"
          value={todayInProduction.length}
          icon={<ClipboardList className="w-5 lg:w-6 h-5 lg:h-6" />}
          color="warning"
        />
        <StatCard
          title="配送中"
          value={todayShipping.length}
          icon={<Truck className="w-5 lg:w-6 h-5 lg:h-6" />}
          color="info"
        />
        <StatCard
          title="今日支出"
          value={`¥${todayExpense.toLocaleString()}`}
          icon={<ShoppingCart className="w-5 lg:w-6 h-5 lg:h-6" />}
          trend={expenseTrend}
          trendLabel="较昨日"
          color="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
        <div className="col-span-2 space-y-5 lg:space-y-6">
          {/* 快捷操作 */}
          <Card className="p-4 lg:p-5">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Zap className="w-5 h-5 text-warning-500" />
                快捷操作
              </h3>
            </div>
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 lg:gap-3">
              {quickActions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => navigate(action.path)}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-warm-50 transition-all group"
                  >
                    <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 lg:w-6 h-5 lg:h-6 text-white" />
                    </div>
                    <span className="text-xs text-gray-600 font-medium">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* AI 智能提醒 */}
          <Card className="p-4 lg:p-5">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary-500" />
                AI智能提醒
              </h3>
              <span className="text-xs text-primary-500 flex items-center gap-1">
                根据实时数据
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
                    <button className="text-xs text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1 whitespace-nowrap">
                      处理 <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* 最近订单 */}
          <div>
            <div className="flex items-center justify-between mb-3 lg:mb-4">
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

        {/* 右侧栏 */}
        <div className="space-y-5 lg:space-y-6">
          <TodoList />

          {/* 待发布内容 */}
          <Card className="p-4 lg:p-5">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
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
            <div className="space-y-2">
              {recentContents.length > 0 ? recentContents.map(content => (
                <div
                  key={content.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-warm-50 cursor-pointer transition-colors"
                  onClick={() => navigate('/content')}
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
              )) : (
                <div className="text-center py-6 text-gray-400">
                  <Video className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">暂无待发布内容</p>
                  <button
                    onClick={() => navigate('/content')}
                    className="text-xs text-primary-500 mt-1 hover:text-primary-600"
                  >
                    去创建内容
                  </button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}