import { TrendingUp, TrendingDown, DollarSign, Package, Users, Eye } from 'lucide-react';
import Card from '../components/ui/Card';

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">数据分析</h1>
        <p className="text-gray-500 mt-1">AI智能分析经营数据，助您决策</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500">本月营收</p>
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">¥86,400</p>
          <p className="text-sm text-success-600 flex items-center gap-1 mt-1">
            <TrendingUp className="w-4 h-4" /> +12.5% 较上月
          </p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500">本月订单</p>
            <div className="w-10 h-10 rounded-xl bg-success-50 flex items-center justify-center">
              <Package className="w-5 h-5 text-success-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">128单</p>
          <p className="text-sm text-success-600 flex items-center gap-1 mt-1">
            <TrendingUp className="w-4 h-4" /> +8.3% 较上月
          </p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500">客户复购率</p>
            <div className="w-10 h-10 rounded-xl bg-warning-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-warning-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">68%</p>
          <p className="text-sm text-danger-600 flex items-center gap-1 mt-1">
            <TrendingDown className="w-4 h-4" /> -2.1% 较上月
          </p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500">视频播放量</p>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">12.5w</p>
          <p className="text-sm text-success-600 flex items-center gap-1 mt-1">
            <TrendingUp className="w-4 h-4" /> +45.2% 较上月
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-gray-800 mb-4">营收趋势（近7天）</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {[60, 75, 65, 80, 95, 85, 72].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-primary-500 to-primary-300 rounded-t-lg transition-all hover:from-primary-600 hover:to-primary-400"
                  style={{ height: `${h}%` }}
                />
                <span className="text-xs text-gray-400">周{['一', '二', '三', '四', '五', '六', '日'][i]}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold text-gray-800 mb-4">产品销量排行</h3>
          <div className="space-y-4">
            {[
              { name: '普通鱼丸10斤', sales: 45, pct: 90 },
              { name: '鳗鱼丸5斤', sales: 32, pct: 64 },
              { name: '香菇贡丸3斤', sales: 28, pct: 56 },
              { name: '紫菜鱼丸3斤', sales: 20, pct: 40 },
              { name: '虾丸5斤', sales: 15, pct: 30 },
            ].map((product, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{product.name}</span>
                  <span className="text-gray-500">{product.sales}单</span>
                </div>
                <div className="w-full h-2 bg-warm-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
                    style={{ width: `${product.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold text-gray-800 mb-4">🤖 AI经营建议</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-4 bg-success-50 rounded-xl border border-success-100">
            <p className="font-medium text-success-700 mb-1">📈 销量洞察</p>
            <p className="text-sm text-success-600">鳗鱼丸销量近期增长15%，建议提前准备原材料</p>
          </div>
          <div className="p-4 bg-warning-50 rounded-xl border border-warning-100">
            <p className="font-medium text-warning-700 mb-1">⚠️ 客户提醒</p>
            <p className="text-sm text-warning-600">张记小吃已15天未下单，建议主动回访</p>
          </div>
          <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
            <p className="font-medium text-primary-700 mb-1">💡 内容建议</p>
            <p className="text-sm text-primary-600">"鱼丸制作过程"类视频播放量最高，建议多拍同类内容</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="font-medium text-blue-700 mb-1">💰 成本优化</p>
            <p className="text-sm text-blue-600">原材料成本本周上涨3%，可考虑批量采购</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
