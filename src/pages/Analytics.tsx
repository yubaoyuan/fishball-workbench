import { useMemo } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Package, Users, Eye, BarChart3, AlertCircle, Lightbulb } from 'lucide-react';
import Card from '../components/ui/Card';
import { useDataStore } from '../store/useDataStore';

function today(): string { return new Date().toISOString().split('T')[0]; }
function daysAgo(n: number): string {
  const d = new Date(); d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

export default function Analytics() {
  const { salesOrders, orders, financeRecords, customers, contents, production } = useDataStore();

  // 本月数据
  const now = new Date();
  const thisMonth = String(now.getMonth() + 1).padStart(2, '0');
  const thisYear = String(now.getFullYear());
  const isThisMonth = (d: string) => d.startsWith(`${thisYear}-${thisMonth}`);

  const monthSales = salesOrders.filter(o => isThisMonth(o.salesDate));
  const monthRevenue = monthSales.reduce((s, o) => s + o.totalAmount, 0);
  const monthPaid = monthSales.reduce((s, o) => s + o.paidAmount, 0);
  const monthOrders = monthSales.length;

  const monthExpense = financeRecords.filter(r => r.type === 'expense' && isThisMonth(r.date)).reduce((s, r) => s + r.amount, 0);
  const monthIncome = financeRecords.filter(r => r.type === 'income' && isThisMonth(r.date)).reduce((s, r) => s + r.amount, 0);

  const repeatRate = customers.length > 0
    ? Math.round(customers.filter(c => c.totalOrders > 1).length / customers.length * 100)
    : 0;

  const totalViews = contents.reduce((s, c) => s + (c.views || 0), 0);

  // 近7天营收趋势
  const last7Days = useMemo(() => {
    const days: { date: string; label: string; revenue: number; orders: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = daysAgo(i);
      const daySales = salesOrders.filter(o => o.salesDate === d);
      days.push({
        date: d,
        label: ['日', '一', '二', '三', '四', '五', '六'][new Date(d).getDay()],
        revenue: daySales.reduce((s, o) => s + o.totalAmount, 0),
        orders: daySales.length,
      });
    }
    return days;
  }, [salesOrders]);

  const maxRevenue = Math.max(...last7Days.map(d => d.revenue), 1);

  // 产品销量排行
  const productRanking = useMemo(() => {
    const map: Record<string, number> = {};
    salesOrders.forEach(o => {
      o.products.forEach(p => {
        map[p.name] = (map[p.name] || 0) + p.quantity;
      });
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [salesOrders]);

  const maxQty = productRanking.length > 0 ? productRanking[0][1] : 1;

  // 客户排行
  const customerRanking = useMemo(() => {
    const map: Record<string, number> = {};
    salesOrders.forEach(o => {
      map[o.customerName] = (map[o.customerName] || 0) + o.totalAmount;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [salesOrders]);

  const maxCustomerAmount = customerRanking.length > 0 ? customerRanking[0][1] : 1;

  // AI 建议
  const aiSuggestions: { title: string; desc: string; type: 'success' | 'warning' | 'info' }[] = [];
  if (monthOrders === 0) {
    aiSuggestions.push({ title: '暂无数据', desc: '添加销售订单后，AI将自动分析经营状况并给出建议', type: 'info' });
  } else {
    const unpaidTotal = monthSales.filter(o => o.paymentStatus !== 'paid').reduce((s, o) => s + o.totalAmount - o.paidAmount, 0);
    if (unpaidTotal > 0) {
      aiSuggestions.push({ title: '待收款提醒', desc: `本月还有 ¥${unpaidTotal.toLocaleString()} 未收款项，建议及时催收`, type: 'warning' });
    }
    if (productRanking.length > 0) {
      aiSuggestions.push({ title: '畅销产品', desc: `"${productRanking[0][0]}" 本月销量最高，建议保持库存充足`, type: 'success' });
    }
    if (monthExpense > monthIncome * 0.5) {
      aiSuggestions.push({ title: '成本控制', desc: '本月支出占收入比例较高，建议审查采购成本', type: 'warning' });
    }
    if (customers.length > 0 && repeatRate < 30) {
      aiSuggestions.push({ title: '客户留存', desc: `复购率仅 ${repeatRate}%，建议加强客户回访和优惠活动`, type: 'warning' });
    }
  }

  const summaryCards = [
    { label: '本月营收', value: `¥${monthRevenue.toLocaleString()}`, icon: <DollarSign className="w-5 h-5" />, color: 'bg-primary-50 text-primary-500' },
    { label: '本月订单', value: `${monthOrders}单`, icon: <Package className="w-5 h-5" />, color: 'bg-success-50 text-success-500' },
    { label: '客户复购率', value: `${repeatRate}%`, icon: <Users className="w-5 h-5" />, color: 'bg-warning-50 text-warning-500' },
    { label: '视频总播放', value: totalViews > 0 ? `${(totalViews/10000).toFixed(1)}w` : '0', icon: <Eye className="w-5 h-5" />, color: 'bg-blue-50 text-blue-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">数据分析</h1>
        <p className="text-gray-500 mt-1">基于你的真实经营数据，AI实时分析</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => (
          <Card key={i} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">{card.label}</p>
              <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center`}>
                {card.icon}
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{card.value}</p>
          </Card>
        ))}
      </div>

      {/* 趋势图 + 排行 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 营收趋势 */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary-500" />
            近7天营收趋势
          </h3>
          {maxRevenue === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">暂无数据，添加销售订单后显示</div>
          ) : (
            <div className="h-48 flex items-end justify-between gap-2">
              {last7Days.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">¥{d.revenue}</span>
                  <div
                    className="w-full bg-gradient-to-t from-primary-500 to-primary-300 rounded-t-lg transition-all min-h-[4px]"
                    style={{ height: `${Math.max((d.revenue / maxRevenue) * 100, 4)}%` }}
                  />
                  <span className="text-xs text-gray-400">周{d.label}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* 产品销量排行 */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary-500" />
            产品销量排行
          </h3>
          {productRanking.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">暂无数据</div>
          ) : (
            <div className="space-y-4">
              {productRanking.map(([name, qty], i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{name}</span>
                    <span className="text-gray-500">{qty}斤</span>
                  </div>
                  <div className="w-full h-2 bg-warm-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
                      style={{ width: `${Math.round((qty / maxQty) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* 客户排行 */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-primary-500" />
            客户消费排行
          </h3>
          {customerRanking.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">暂无数据</div>
          ) : (
            <div className="space-y-4">
              {customerRanking.map(([name, amount], i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{name}</span>
                    <span className="text-gray-500">¥{amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-warm-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-success-400 to-success-600 rounded-full"
                      style={{ width: `${Math.round((amount / maxCustomerAmount) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* 收支概览 */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary-500" />
            本月收支概览
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-success-50 rounded-xl">
              <span className="text-sm text-gray-600">收入</span>
              <span className="text-lg font-bold text-success-600">¥{monthIncome.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
              <span className="text-sm text-gray-600">支出</span>
              <span className="text-lg font-bold text-red-600">¥{monthExpense.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-primary-50 rounded-xl">
              <span className="text-sm text-gray-600">结余</span>
              <span className="text-lg font-bold text-primary-600">¥{(monthIncome - monthExpense).toLocaleString()}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* AI 经营建议 */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-warning-500" />
          AI 经营建议
        </h3>
        {aiSuggestions.length === 0 ? (
          <div className="py-8 text-center text-gray-400 text-sm">暂无数据</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {aiSuggestions.map((s, i) => (
              <div key={i} className={`
                p-4 rounded-xl border
                ${s.type === 'success' ? 'bg-success-50 border-success-100' : ''}
                ${s.type === 'warning' ? 'bg-warning-50 border-warning-100' : ''}
                ${s.type === 'info' ? 'bg-primary-50 border-primary-100' : ''}
              `}>
                <p className={`font-medium text-sm mb-1
                  ${s.type === 'success' ? 'text-success-700' : ''}
                  ${s.type === 'warning' ? 'text-warning-700' : ''}
                  ${s.type === 'info' ? 'text-primary-700' : ''}
                `}>{s.title}</p>
                <p className={`text-xs
                  ${s.type === 'success' ? 'text-success-600' : ''}
                  ${s.type === 'warning' ? 'text-warning-600' : ''}
                  ${s.type === 'info' ? 'text-primary-600' : ''}
                `}>{s.desc}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}