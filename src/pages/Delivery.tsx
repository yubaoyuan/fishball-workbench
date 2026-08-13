import { Plus, Sparkles, Truck, MapPin, Clock, CheckCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Tag from '../components/ui/Tag';

const deliveries = [
  { id: 1, customer: '王记火锅店', address: '城厢区建设路88号', items: '鳗鱼丸5斤×15袋', time: '09:30出发', status: 'shipping' },
  { id: 2, customer: '陈记餐厅', address: '荔城区文献路123号', items: '香菇贡丸3斤×10袋', time: '11:00出发', status: 'pending' },
  { id: 3, customer: '李记鱼丸店', address: '涵江区宫下路45号', items: '紫菜鱼丸3斤×7袋', time: '14:00出发', status: 'pending' },
  { id: 4, customer: '张记小吃', address: '秀屿区笏石镇67号', items: '普通鱼丸10斤×10袋', time: '15:30出发', status: 'planned' },
];

const statusConfig = {
  shipping: { label: '配送中', variant: 'primary' as const, icon: <Truck className="w-4 h-4" /> },
  pending: { label: '待配送', variant: 'warning' as const, icon: <Clock className="w-4 h-4" /> },
  planned: { label: '已规划', variant: 'info' as const, icon: <MapPin className="w-4 h-4" /> },
  delivered: { label: '已送达', variant: 'success' as const, icon: <CheckCircle className="w-4 h-4" /> },
};

export default function Delivery() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">配送管理</h1>
          <p className="text-gray-500 mt-1">管理配送路线，AI智能规划最优路线</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-warm-100 text-gray-700 rounded-xl font-medium hover:bg-warm-200 transition-colors">
            <Sparkles className="w-4 h-4 text-primary-500" />
            AI规划路线
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all">
            <Plus className="w-4 h-4" />
            记配送
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
              <Truck className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">配送中</p>
              <p className="text-xl font-bold text-gray-800">1单</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-warning-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">待配送</p>
              <p className="text-xl font-bold text-gray-800">2单</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success-50 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">今日已送</p>
              <p className="text-xl font-bold text-gray-800">0单</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">配送点</p>
              <p className="text-xl font-bold text-gray-800">4个</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-warm-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">今日配送单</h3>
          <button className="text-sm text-primary-500 font-medium hover:text-primary-600">查看地图 →</button>
        </div>
        <div className="divide-y divide-warm-100">
          {deliveries.map((d, index) => {
            const status = statusConfig[d.status as keyof typeof statusConfig];
            return (
              <div key={d.id} className="p-4 flex items-center gap-4 hover:bg-warm-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-800">{d.customer}</span>
                    <Tag variant={status.variant} size="sm" className="flex items-center gap-1">
                      {status.icon}
                      {status.label}
                    </Tag>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{d.address}</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{d.items}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">{d.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
