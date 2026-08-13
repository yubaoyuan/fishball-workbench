import { Phone, MapPin, MessageCircle, MoreHorizontal } from 'lucide-react';
import Card from '../ui/Card';
import Tag from '../ui/Tag';
import type { Order } from '../../types';
import { clsx } from 'clsx';

const statusConfig = {
  pending: { label: '待处理', variant: 'warning' as const },
  confirmed: { label: '已确认', variant: 'info' as const },
  producing: { label: '生产中', variant: 'primary' as const },
  shipping: { label: '配送中', variant: 'default' as const },
  delivered: { label: '已送达', variant: 'success' as const },
  cancelled: { label: '已取消', variant: 'danger' as const },
};

const sourceLabels = {
  wechat: '微信',
  phone: '电话',
  offline: '到店',
  other: '其他',
};

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const status = statusConfig[order.status];
  const productSummary = order.products.map(p => `${p.name}${p.quantity}${p.unit}`).join('、');

  return (
    <Card hover className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-800">{order.customerName}</h4>
            <Tag variant={status.variant} size="sm">{status.label}</Tag>
          </div>
          <p className="text-xs text-gray-400">{order.orderNo} · {sourceLabels[order.source]}</p>
        </div>
        <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-warm-100 rounded-lg transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{productSummary}</p>

      {order.remark && (
        <div className="bg-warm-50 rounded-lg px-3 py-2 mb-3">
          <p className="text-xs text-warning-700">📝 {order.remark}</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-warm-100">
        <div className="flex items-center gap-3">
          {order.phone && (
            <button className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors">
              <Phone className="w-4 h-4" />
            </button>
          )}
          {order.address && (
            <button className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors">
              <MapPin className="w-4 h-4" />
            </button>
          )}
          <button className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors">
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-primary-600">¥{order.totalAmount}</p>
          <p className="text-xs text-gray-400">{order.orderDate}</p>
        </div>
      </div>
    </Card>
  );
}
