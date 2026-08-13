import { useState } from 'react';
import { Plus, Search, Filter, Sparkles, Printer, Download, DollarSign, FileText, CheckCircle, Clock, AlertCircle, Phone, MapPin, MoreHorizontal, ChevronDown } from 'lucide-react';
import Card from '../components/ui/Card';
import Tag from '../components/ui/Tag';
import { clsx } from 'clsx';
import { useDataStore } from '../store/useDataStore';
import type { SalesOrderStatus, PaymentStatus } from '../types';

const statusConfig: Record<SalesOrderStatus, { label: string; variant: 'warning' | 'info' | 'success' | 'danger' }> = {
  draft: { label: '草稿', variant: 'warning' },
  confirmed: { label: '已确认', variant: 'info' },
  delivered: { label: '已发货', variant: 'success' },
  cancelled: { label: '已取消', variant: 'danger' },
};

const paymentConfig: Record<PaymentStatus, { label: string; variant: 'danger' | 'warning' | 'success' }> = {
  unpaid: { label: '未付款', variant: 'danger' },
  partial: { label: '部分付款', variant: 'warning' },
  paid: { label: '已付款', variant: 'success' },
};

const paymentMethodLabels: Record<string, string> = {
  cash: '现金',
  wechat: '微信',
  alipay: '支付宝',
  bank: '银行转账',
};

const tabs = [
  { id: 'all', label: '全部' },
  { id: 'draft', label: '草稿' },
  { id: 'confirmed', label: '已确认' },
  { id: 'delivered', label: '已发货' },
  { id: 'cancelled', label: '已取消' },
];

export default function SalesOrders() {
  const salesOrders = useDataStore(s => s.salesOrders);
  const [activeTab, setActiveTab] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filteredOrders = activeTab === 'all'
    ? salesOrders
    : salesOrders.filter(o => o.status === activeTab);

  const totalAmount = salesOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalPaid = salesOrders.reduce((sum, o) => sum + o.paidAmount, 0);
  const unpaidAmount = salesOrders
    .filter(o => o.paymentStatus !== 'paid')
    .reduce((sum, o) => sum + (o.totalAmount - o.paidAmount), 0);

  const toggleExpand = (id: string) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">销售单管理</h1>
          <p className="text-gray-500 mt-1">管理销售单据，跟踪收款与发货状态</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-warm-100 text-gray-700 rounded-xl font-medium hover:bg-warm-200 transition-colors">
            <Download className="w-4 h-4" />
            导出
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all">
            <Plus className="w-4 h-4" />
            新建销售单
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">销售单数</p>
              <p className="text-xl font-bold text-gray-800">{salesOrders.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">销售总额</p>
              <p className="text-xl font-bold text-gray-800">¥{totalAmount.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">已收款</p>
              <p className="text-xl font-bold text-gray-800">¥{totalPaid.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">待收款</p>
              <p className="text-xl font-bold text-red-500">¥{unpaidAmount.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* 筛选栏 */}
      <Card className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all font-medium',
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-warm-50'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索销售单..."
                className="w-48 pl-9 pr-4 py-2 bg-warm-50 border border-transparent rounded-xl text-sm focus:outline-none focus:bg-white focus:border-primary-200"
              />
            </div>
            <button className="p-2 text-gray-500 hover:bg-warm-100 rounded-xl transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Card>

      {/* 销售单列表 */}
      <div className="space-y-3">
        {filteredOrders.map(order => (
          <Card key={order.id} className="overflow-hidden">
            {/* 折叠头部 */}
            <div
              className="p-4 flex items-center gap-4 cursor-pointer hover:bg-warm-50/50 transition-colors"
              onClick={() => toggleExpand(order.id)}
            >
              <ChevronDown className={clsx(
                'w-4 h-4 text-gray-400 flex-shrink-0 transition-transform',
                expandedOrder === order.id && 'rotate-180'
              )} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-800">{order.customerName}</span>
                  <Tag variant={statusConfig[order.status].variant} size="sm">
                    {statusConfig[order.status].label}
                  </Tag>
                  <Tag variant={paymentConfig[order.paymentStatus].variant} size="sm">
                    {paymentConfig[order.paymentStatus].label}
                  </Tag>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>{order.orderNo}</span>
                  <span>·</span>
                  <span>{order.salesDate}</span>
                  <span>·</span>
                  <span>{paymentMethodLabels[order.paymentMethod]}</span>
                  <span>·</span>
                  <span>经手人：{order.salesperson}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-lg font-bold text-primary-600">¥{order.totalAmount.toLocaleString()}</p>
                {order.paymentStatus !== 'paid' && (
                  <p className="text-xs text-red-500">
                    欠 ¥{(order.totalAmount - order.paidAmount).toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            {/* 展开详情 */}
            {expandedOrder === order.id && (
              <div className="border-t border-warm-100 bg-warm-50/30 p-4 space-y-4">
                {/* 产品明细 */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">产品明细</h4>
                  <div className="bg-white rounded-xl overflow-hidden border border-warm-100">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-warm-50 text-gray-500">
                          <th className="text-left px-4 py-2.5 font-medium">产品名称</th>
                          <th className="text-center px-4 py-2.5 font-medium">数量</th>
                          <th className="text-center px-4 py-2.5 font-medium">单价</th>
                          <th className="text-right px-4 py-2.5 font-medium">小计</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.products.map((product, idx) => (
                          <tr key={idx} className="border-t border-warm-50">
                            <td className="px-4 py-2.5 text-gray-800">{product.name}</td>
                            <td className="px-4 py-2.5 text-center text-gray-600">{product.quantity}{product.unit}</td>
                            <td className="px-4 py-2.5 text-center text-gray-600">¥{product.unitPrice}</td>
                            <td className="px-4 py-2.5 text-right text-gray-800 font-medium">¥{product.totalPrice}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-warm-100 bg-warm-50/50">
                          <td colSpan={3} className="px-4 py-2.5 text-right font-medium text-gray-700">合计</td>
                          <td className="px-4 py-2.5 text-right font-bold text-primary-600">¥{order.totalAmount.toLocaleString()}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* 付款与客户信息 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 border border-warm-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">付款信息</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">总金额</span>
                        <span className="text-gray-800 font-medium">¥{order.totalAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">已付金额</span>
                        <span className="text-green-600 font-medium">¥{order.paidAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">未付金额</span>
                        <span className={clsx(
                          'font-medium',
                          order.totalAmount - order.paidAmount > 0 ? 'text-red-500' : 'text-gray-400'
                        )}>
                          ¥{(order.totalAmount - order.paidAmount).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">付款方式</span>
                        <span className="text-gray-800">{paymentMethodLabels[order.paymentMethod]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">付款状态</span>
                        <Tag variant={paymentConfig[order.paymentStatus].variant} size="sm">
                          {paymentConfig[order.paymentStatus].label}
                        </Tag>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-warm-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">客户信息</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-800">{order.customerPhone}</span>
                      </div>
                      {order.address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-800">{order.address}</span>
                        </div>
                      )}
                      {order.deliveryDate && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-800">发货日期：{order.deliveryDate}</span>
                        </div>
                      )}
                      {order.remark && (
                        <div className="mt-2 pt-2 border-t border-warm-100">
                          <p className="text-gray-500 text-xs">备注：{order.remark}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex items-center gap-2 pt-2">
                  <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:bg-warm-100 rounded-lg transition-colors">
                    <Printer className="w-4 h-4" />
                    打印
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                    <Sparkles className="w-4 h-4" />
                    AI分析
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:bg-warm-100 rounded-lg transition-colors ml-auto">
                    <MoreHorizontal className="w-4 h-4" />
                    更多
                  </button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}