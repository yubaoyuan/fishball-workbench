import { Plus, Sparkles, Users, Phone, MapPin, Star } from 'lucide-react';
import Card from '../components/ui/Card';
import Tag from '../components/ui/Tag';
import { useDataStore } from '../store/useDataStore';

const levelLabels: Record<string, { label: string; variant: 'primary' | 'warning' | 'info' }> = {
  vip: { label: 'VIP客户', variant: 'primary' },
  regular: { label: '常客', variant: 'warning' },
  new: { label: '新客户', variant: 'info' },
};

export default function Customers() {
  const customers = useDataStore(s => s.customers);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">客户管理</h1>
          <p className="text-gray-500 mt-1">管理客户信息，AI帮您维护客户关系</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-warm-100 text-gray-700 rounded-xl font-medium hover:bg-warm-200 transition-colors">
            <Sparkles className="w-4 h-4 text-primary-500" />
            AI客户分析
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all">
            <Plus className="w-4 h-4" />
            添加客户
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">客户总数</p>
              <p className="text-xl font-bold text-gray-800">{customers.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning-50 flex items-center justify-center">
              <Star className="w-5 h-5 text-warning-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">VIP客户</p>
              <p className="text-xl font-bold text-gray-800">{customers.filter(c => c.level === 'vip').length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-success-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">本月新增</p>
              <p className="text-xl font-bold text-gray-800">2</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Phone className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">待回访</p>
              <p className="text-xl font-bold text-gray-800">3</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {customers.map(customer => {
          const level = levelLabels[customer.level];
          return (
            <Card key={customer.id} className="p-5 hover:shadow-card-hover transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{customer.name}</h3>
                    <Tag variant={level.variant} size="sm">{level.label}</Tag>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <Phone className="w-4 h-4" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-gray-500">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{customer.address}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Star className="w-4 h-4 text-warning-500" />
                  <span>累计消费 ¥{customer.totalSpent.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-warm-100">
                <button className="flex-1 py-2 bg-warm-50 text-gray-600 rounded-lg text-sm hover:bg-warm-100 transition-colors">
                  打电话
                </button>
                <button className="flex-1 py-2 bg-primary-50 text-primary-600 rounded-lg text-sm hover:bg-primary-100 transition-colors">
                  下订单
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
