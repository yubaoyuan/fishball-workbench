import { Plus, Sparkles, Package, Clock } from 'lucide-react';
import Card from '../components/ui/Card';
import Tag from '../components/ui/Tag';

const productionTasks = [
  { id: 1, product: '鳗鱼丸5斤', customer: '王记火锅店', quantity: '50斤', deadline: '今天10:00', status: 'producing', progress: 80 },
  { id: 2, product: '香菇贡丸3斤', customer: '陈记餐厅', quantity: '30斤', deadline: '今天14:00', status: 'pending', progress: 0 },
  { id: 3, product: '普通鱼丸10斤', customer: '散客订单', quantity: '100斤', deadline: '今天16:00', status: 'pending', progress: 0 },
  { id: 4, product: '紫菜鱼丸3斤', customer: '李记鱼丸店', quantity: '20斤', deadline: '明天08:00', status: 'planned', progress: 0 },
];

const statusConfig = {
  producing: { label: '生产中', variant: 'primary' as const, color: 'bg-primary-500' },
  pending: { label: '待生产', variant: 'warning' as const, color: 'bg-warning-500' },
  planned: { label: '已排期', variant: 'info' as const, color: 'bg-blue-500' },
  completed: { label: '已完成', variant: 'success' as const, color: 'bg-success-500' },
};

export default function Production() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">生产管理</h1>
          <p className="text-gray-500 mt-1">管理生产排期，AI智能排产优化效率</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-warm-100 text-gray-700 rounded-xl font-medium hover:bg-warm-200 transition-colors">
            <Sparkles className="w-4 h-4 text-primary-500" />
            AI智能排产
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all">
            <Plus className="w-4 h-4" />
            记生产
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">生产中</p>
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
              <p className="text-sm text-gray-500">待生产</p>
              <p className="text-xl font-bold text-gray-800">2单</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success-50 flex items-center justify-center">
              <Package className="w-5 h-5 text-success-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">今日完成</p>
              <p className="text-xl font-bold text-gray-800">0单</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">今日产量</p>
              <p className="text-xl font-bold text-gray-800">150斤</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-warm-100">
          <h3 className="font-semibold text-gray-800">生产任务</h3>
        </div>
        <div className="divide-y divide-warm-100">
          {productionTasks.map(task => {
            const status = statusConfig[task.status as keyof typeof statusConfig];
            return (
              <div key={task.id} className="p-4 hover:bg-warm-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Tag variant={status.variant} size="sm">{status.label}</Tag>
                    <span className="font-medium text-gray-800">{task.product}</span>
                  </div>
                  <span className="text-sm text-gray-500">{task.deadline}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">{task.customer} · {task.quantity}</span>
                  <span className="text-sm font-medium text-gray-700">{task.progress}%</span>
                </div>
                <div className="w-full h-2 bg-warm-100 rounded-full overflow-hidden">
                  <div className={`h-full ${status.color} rounded-full transition-all`} style={{ width: `${task.progress}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
