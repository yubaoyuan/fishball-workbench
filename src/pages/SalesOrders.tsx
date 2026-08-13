import { useState } from 'react';
import { Plus, Search, Filter, DollarSign, FileText, CheckCircle, AlertCircle, Phone, MapPin, ChevronDown, Trash2, Edit3 } from 'lucide-react';
import Card from '../components/ui/Card';
import Tag from '../components/ui/Tag';
import Modal from '../components/ui/Modal';
import { clsx } from 'clsx';
import { useDataStore } from '../store/useDataStore';
import type { SalesOrder, SalesOrderStatus, PaymentStatus, PaymentMethod } from '../types';

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
  cash: '现金', wechat: '微信', alipay: '支付宝', bank: '银行转账',
};

const tabs = [
  { id: 'all', label: '全部' },
  { id: 'draft', label: '草稿' },
  { id: 'confirmed', label: '已确认' },
  { id: 'delivered', label: '已发货' },
  { id: 'cancelled', label: '已取消' },
];

function today(): string { return new Date().toISOString().split('T')[0]; }

interface ProductForm { name: string; quantity: string; unit: string; unitPrice: string; }

export default function SalesOrders() {
  const { salesOrders, addSalesOrder, updateSalesOrder, deleteSalesOrder } = useDataStore();
  const [activeTab, setActiveTab] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    customerName: '', customerPhone: '', address: '', salesDate: today(), deliveryDate: '', paymentMethod: 'wechat' as PaymentMethod,
    paymentStatus: 'unpaid' as PaymentStatus, paidAmount: '', status: 'draft' as SalesOrderStatus, remark: '', salesperson: '老板',
  });
  const [products, setProducts] = useState<ProductForm[]>([{ name: '', quantity: '', unit: '斤', unitPrice: '' }]);

  const filteredOrders = salesOrders.filter(o => {
    const matchTab = activeTab === 'all' || o.status === activeTab;
    const matchSearch = !search || o.customerName.includes(search) || o.orderNo.includes(search);
    return matchTab && matchSearch;
  });

  const totalAmount = salesOrders.reduce((s, o) => s + o.totalAmount, 0);
  const totalPaid = salesOrders.reduce((s, o) => s + o.paidAmount, 0);
  const unpaidAmount = salesOrders.filter(o => o.paymentStatus !== 'paid').reduce((s, o) => s + (o.totalAmount - o.paidAmount), 0);

  const resetForm = () => {
    setForm({ customerName: '', customerPhone: '', address: '', salesDate: today(), deliveryDate: '', paymentMethod: 'wechat' as PaymentMethod, paymentStatus: 'unpaid', paidAmount: '', status: 'draft', remark: '', salesperson: '老板' });
    setProducts([{ name: '', quantity: '', unit: '斤', unitPrice: '' }]);
  };

  const openAdd = () => { setEditingId(null); resetForm(); setModalOpen(true); };
  const openEdit = (o: SalesOrder) => {
    setEditingId(o.id);
    setForm({ customerName: o.customerName, customerPhone: o.customerPhone, address: o.address || '', salesDate: o.salesDate, deliveryDate: o.deliveryDate || '', paymentMethod: o.paymentMethod, paymentStatus: o.paymentStatus, paidAmount: String(o.paidAmount), status: o.status, remark: o.remark || '', salesperson: o.salesperson });
    setProducts(o.products.map(p => ({ name: p.name, quantity: String(p.quantity), unit: p.unit, unitPrice: String(p.unitPrice) })));
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!form.customerName.trim()) return;
    const validProducts = products.filter(p => p.name.trim() && parseFloat(p.quantity) > 0 && parseFloat(p.unitPrice) > 0);
    if (validProducts.length === 0) return;
    const productList = validProducts.map((p, i) => {
      const qty = parseFloat(p.quantity);
      const price = parseFloat(p.unitPrice);
      return { id: `p${Date.now()}_${i}`, name: p.name.trim(), quantity: qty, unit: p.unit, unitPrice: price, totalPrice: Math.round(qty * price * 100) / 100 };
    });
    const total = productList.reduce((s, p) => s + p.totalPrice, 0);
    const paid = parseFloat(form.paidAmount) || 0;
    const d = new Date();
    const orderNo = `XS${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}${String(salesOrders.length+1).padStart(3,'0')}`;
    if (editingId) {
      updateSalesOrder(editingId, { customerName: form.customerName.trim(), customerPhone: form.customerPhone.trim(), address: form.address.trim(), salesDate: form.salesDate, deliveryDate: form.deliveryDate, paymentMethod: form.paymentMethod, paymentStatus: form.paymentStatus, paidAmount: paid, status: form.status, remark: form.remark.trim(), salesperson: form.salesperson.trim(), products: productList, totalAmount: total });
    } else {
      addSalesOrder({ id: `${Date.now()}_${Math.random().toString(36).slice(2,6)}`, orderNo, customerId: '', customerName: form.customerName.trim(), customerPhone: form.customerPhone.trim(), address: form.address.trim(), salesDate: form.salesDate, deliveryDate: form.deliveryDate, paymentMethod: form.paymentMethod, paymentStatus: form.paymentStatus, paidAmount: paid, status: form.status, remark: form.remark.trim(), salesperson: form.salesperson.trim(), products: productList, totalAmount: total });
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => { if (window.confirm('确定删除这张销售单吗？')) deleteSalesOrder(id); };

  const addProduct = () => setProducts([...products, { name: '', quantity: '', unit: '斤', unitPrice: '' }]);
  const removeProduct = (i: number) => { if (products.length > 1) setProducts(products.filter((_, idx) => idx !== i)); };
  const updateProduct = (i: number, f: Partial<ProductForm>) => {
    const newProducts = [...products];
    newProducts[i] = { ...newProducts[i], ...f };
    setProducts(newProducts);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-800">销售单管理</h1><p className="text-gray-500 mt-1">管理销售单据，跟踪收款与发货状态</p></div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"><Plus className="w-4 h-4" />新建销售单</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><FileText className="w-5 h-5 text-blue-500" /></div><div><p className="text-xs text-gray-500">销售单数</p><p className="text-xl font-bold text-gray-800">{salesOrders.length}</p></div></div></Card>
        <Card className="p-5"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center"><DollarSign className="w-5 h-5 text-green-500" /></div><div><p className="text-xs text-gray-500">销售总额</p><p className="text-xl font-bold text-gray-800">¥{totalAmount.toLocaleString()}</p></div></div></Card>
        <Card className="p-5"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center"><CheckCircle className="w-5 h-5 text-emerald-500" /></div><div><p className="text-xs text-gray-500">已收款</p><p className="text-xl font-bold text-gray-800">¥{totalPaid.toLocaleString()}</p></div></div></Card>
        <Card className="p-5"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center"><AlertCircle className="w-5 h-5 text-red-500" /></div><div><p className="text-xs text-gray-500">待收款</p><p className="text-xl font-bold text-red-500">¥{unpaidAmount.toLocaleString()}</p></div></div></Card>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={clsx('px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all font-medium', activeTab === tab.id ? 'bg-primary-500 text-white shadow-sm' : 'text-gray-600 hover:bg-warm-50')}>{tab.label}</button>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索客户或单号..." className="w-48 pl-9 pr-4 py-2 bg-warm-50 border border-transparent rounded-xl text-sm focus:outline-none focus:bg-white focus:border-primary-200" /></div>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="py-12 text-center text-gray-400"><FileText className="w-10 h-10 mx-auto mb-2 opacity-50" /><p className="text-sm">暂无销售单，点击右上角"新建销售单"开始</p></div>
        ) : filteredOrders.map(order => (
          <Card key={order.id} className="overflow-hidden group">
            <div className="p-4 flex items-center gap-4 cursor-pointer hover:bg-warm-50/50 transition-colors" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
              <ChevronDown className={clsx('w-4 h-4 text-gray-400 flex-shrink-0 transition-transform', expandedOrder === order.id && 'rotate-180')} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1"><span className="font-semibold text-gray-800">{order.customerName}</span><Tag variant={statusConfig[order.status].variant} size="sm">{statusConfig[order.status].label}</Tag><Tag variant={paymentConfig[order.paymentStatus].variant} size="sm">{paymentConfig[order.paymentStatus].label}</Tag></div>
                <div className="flex items-center gap-3 text-xs text-gray-400"><span>{order.orderNo}</span><span>·</span><span>{order.salesDate}</span><span>·</span><span>{paymentMethodLabels[order.paymentMethod]}</span></div>
              </div>
              <div className="text-right flex-shrink-0"><p className="text-lg font-bold text-primary-600">¥{order.totalAmount.toLocaleString()}</p></div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                <button onClick={() => openEdit(order)} className="p-1.5 text-gray-400 hover:text-primary-500 hover:bg-warm-100 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(order.id)} className="p-1.5 text-gray-400 hover:text-danger-500 hover:bg-danger-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            {expandedOrder === order.id && (
              <div className="border-t border-warm-100 bg-warm-50/30 p-4 space-y-4">
                <div><h4 className="text-sm font-medium text-gray-700 mb-2">产品明细</h4>
                  <div className="bg-white rounded-xl overflow-hidden border border-warm-100">
                    <table className="w-full text-sm"><thead><tr className="bg-warm-50 text-gray-500"><th className="text-left px-4 py-2.5 font-medium">产品名称</th><th className="text-center px-4 py-2.5 font-medium">数量</th><th className="text-center px-4 py-2.5 font-medium">单价</th><th className="text-right px-4 py-2.5 font-medium">小计</th></tr></thead>
                      <tbody>{order.products.map((p, i) => (<tr key={i} className="border-t border-warm-50"><td className="px-4 py-2.5 text-gray-800">{p.name}</td><td className="px-4 py-2.5 text-center text-gray-600">{p.quantity}{p.unit}</td><td className="px-4 py-2.5 text-center text-gray-600">¥{p.unitPrice}</td><td className="px-4 py-2.5 text-right text-gray-800 font-medium">¥{p.totalPrice}</td></tr>))}</tbody>
                      <tfoot><tr className="border-t-2 border-warm-100 bg-warm-50/50"><td colSpan={3} className="px-4 py-2.5 text-right font-medium text-gray-700">合计</td><td className="px-4 py-2.5 text-right font-bold text-primary-600">¥{order.totalAmount.toLocaleString()}</td></tr></tfoot>
                    </table>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 border border-warm-100"><h4 className="text-sm font-medium text-gray-700 mb-3">付款信息</h4>
                    <div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-gray-500">总金额</span><span className="text-gray-800 font-medium">¥{order.totalAmount.toLocaleString()}</span></div><div className="flex justify-between"><span className="text-gray-500">已付</span><span className="text-green-600 font-medium">¥{order.paidAmount.toLocaleString()}</span></div><div className="flex justify-between"><span className="text-gray-500">未付</span><span className={clsx('font-medium', order.totalAmount - order.paidAmount > 0 ? 'text-red-500' : 'text-gray-400')}>¥{(order.totalAmount - order.paidAmount).toLocaleString()}</span></div><div className="flex justify-between"><span className="text-gray-500">方式</span><span className="text-gray-800">{paymentMethodLabels[order.paymentMethod]}</span></div></div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-warm-100"><h4 className="text-sm font-medium text-gray-700 mb-3">客户信息</h4>
                    <div className="space-y-2 text-sm"><div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /><span className="text-gray-800">{order.customerPhone}</span></div>{order.address && <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /><span className="text-gray-800">{order.address}</span></div>}{order.deliveryDate && <div className="flex items-center gap-2"><span className="text-gray-500">发货：{order.deliveryDate}</span></div>}{order.remark && <div className="mt-2 pt-2 border-t border-warm-100"><p className="text-gray-500 text-xs">备注：{order.remark}</p></div>}</div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? '编辑销售单' : '新建销售单'} size="lg">
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">客户名称 *</label><input type="text" value={form.customerName} onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))} placeholder="例如：陈记火锅店" className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">手机号</label><input type="text" value={form.customerPhone} onChange={e => setForm(f => ({ ...f, customerPhone: e.target.value }))} placeholder="138****5678" className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">地址</label><input type="text" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="选填" className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
          <div>
            <div className="flex items-center justify-between mb-2"><label className="text-sm font-medium text-gray-700">产品明细</label><button type="button" onClick={addProduct} className="text-xs text-primary-500 hover:text-primary-600 font-medium">+ 添加产品</button></div>
            {products.map((p, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <input type="text" value={p.name} onChange={e => updateProduct(i, { name: e.target.value })} placeholder="产品名" className="flex-1 px-2 py-2 border border-warm-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                <input type="number" value={p.quantity} onChange={e => updateProduct(i, { quantity: e.target.value })} placeholder="数量" className="w-16 px-2 py-2 border border-warm-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                <select value={p.unit} onChange={e => updateProduct(i, { unit: e.target.value })} className="w-16 px-1 py-2 border border-warm-200 rounded-lg text-sm focus:outline-none"><option>斤</option><option>盒</option><option>袋</option><option>个</option></select>
                <input type="number" value={p.unitPrice} onChange={e => updateProduct(i, { unitPrice: e.target.value })} placeholder="单价" className="w-20 px-2 py-2 border border-warm-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                {products.length > 1 && <button onClick={() => removeProduct(i)} className="p-1.5 text-gray-400 hover:text-danger-500 rounded-lg"><Trash2 className="w-4 h-4" /></button>}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">销售日期</label><input type="date" value={form.salesDate} onChange={e => setForm(f => ({ ...f, salesDate: e.target.value }))} className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">支付方式</label><select value={form.paymentMethod} onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value as PaymentMethod }))} className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"><option value="cash">现金</option><option value="wechat">微信</option><option value="alipay">支付宝</option><option value="bank">银行转账</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">已付金额</label><input type="number" value={form.paidAmount} onChange={e => setForm(f => ({ ...f, paidAmount: e.target.value }))} placeholder="0" className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">状态</label><select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as SalesOrderStatus }))} className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"><option value="draft">草稿</option><option value="confirmed">已确认</option><option value="delivered">已发货</option><option value="cancelled">已取消</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">备注</label><input type="text" value={form.remark} onChange={e => setForm(f => ({ ...f, remark: e.target.value }))} placeholder="选填" className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
          </div>
          <button onClick={handleSubmit} className="w-full py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">{editingId ? '保存修改' : '创建销售单'}</button>
        </div>
      </Modal>
    </div>
  );
}