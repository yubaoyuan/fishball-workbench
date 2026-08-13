import { Plus, Sparkles, AlertTriangle, ShoppingCart } from 'lucide-react';
import Card from '../components/ui/Card';
import Tag from '../components/ui/Tag';
import StatCard from '../components/ui/StatCard';
import { useDataStore } from '../store/useDataStore';
import { clsx } from 'clsx';

const statusConfig = {
  planned: { label: '待采购', variant: 'warning' as const },
  purchased: { label: '已采购', variant: 'info' as const },
  received: { label: '已到货', variant: 'success' as const },
};

export default function Purchasing() {
  const purchases = useDataStore(s => s.purchases);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">采购管理</h1>
          <p className="text-gray-500 mt-1">管理原材料采购，AI智能预测采购量</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-warm-100 text-gray-700 rounded-xl font-medium hover:bg-warm-200 transition-colors">
            <Sparkles className="w-4 h-4 text-primary-500" />
            AI采购建议
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all">
            <Plus className="w-4 h-4" />
            记采购
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="今日采购" value="¥1,640" icon={<ShoppingCart className="w-6 h-6" />} color="primary" />
        <StatCard title="待采购" value={purchases.filter(p => p.status === 'planned').length} icon={<AlertTriangle className="w-6 h-6" />} color="warning" />
        <StatCard title="供应商" value="4家" icon={<ShoppingCart className="w-6 h-6" />} color="success" />
        <StatCard title="本月采购" value="¥18,500" icon={<ShoppingCart className="w-6 h-6" />} color="info" />
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-warm-100">
          <h3 className="font-semibold text-gray-800">采购记录</h3>
        </div>
        <div className="divide-y divide-warm-100">
          {purchases.map(purchase => {
            const status = statusConfig[purchase.status];
            return (
              <div key={purchase.id} className="p-4 flex items-center gap-4 hover:bg-warm-50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <ShoppingCart className="w-5 h-5 text-primary-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-800">{purchase.materialName}</h4>
                    <Tag variant={status.variant} size="sm">{status.label}</Tag>
                  </div>
                  <p className="text-sm text-gray-500">
                    {purchase.supplierName} · {purchase.quantity}{purchase.unit} × ¥{purchase.unitPrice}
                    {purchase.remark && ` · ${purchase.remark}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">¥{purchase.totalPrice}</p>
                  <p className="text-xs text-gray-400">{purchase.purchaseDate}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
