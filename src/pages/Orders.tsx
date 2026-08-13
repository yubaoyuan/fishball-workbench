import { useState } from 'react';
import { Search, Plus, LayoutGrid, List, Filter, Sparkles, Trash2, Edit3 } from 'lucide-react';
import OrderCard from '../components/business/OrderCard';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import { clsx } from 'clsx';
import { useDataStore } from '../store/useDataStore';
import type { Order, OrderStatus, OrderSource } from '../types';

const statusConfig: Record<OrderStatus, { label: string; variant: 'warning' | 'info' | 'primary' | 'default' | 'success' | 'danger' }> = {
  pending: { label: '待处理', variant: 'warning' },
  confirmed: { label: '已确认', variant: 'info' },
  producing: { label: '生产中', variant: 'primary' },
  shipping: { label: '配送中', variant: 'default' },
  delivered: { label: '已送达', variant: 'success' },
  cancelled: { label: '已取消', variant: 'danger' },
};

const sourceLabels: Record<string, string> = {
  wechat: '微信', phone: '电话', offline: '到店', other: '其他',
};

function today(): string { return new Date().toISOString().split('T')[0]; }

interface ProductForm { name: string; quantity: string; unit: string; price: string; }

export default function Orders() {
  const { orders, addOrder, updateOrder, deleteOrder } = useDataStore();
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    customerName: '', phone: '', address: '', status: 'pending' as OrderStatus,
    source: 'wechat' as OrderSource, remark: '', deliveryDate: '',
  });
  const [products, setProducts] = useState<ProductForm[]>([{ name: '', quantity: '', unit: '斤', price: '' }]);

  const tabs = [
    { id: 'all', label: '全部', count: orders.length },
    { id: 'pending', label: '待处理', count: orders.filter(o => o.status === 'pending').length },
    { id: 'producing', label: '生产中', count: orders.filter(o => o.status === 'producing').length },
    { id: 'shipping', label: '配送中', count: orders.filter(o => o.status === 'shipping').length },
    { id: 'delivered', label: '已完成', count: orders.filter(o => o.status === 'delivered').length },
  ];

  const filteredOrders = orders.filter(o => {
    const matchTab = activeTab === 'all' || o.status === activeTab;
    const matchSearch = !search || o.customerName.includes(search) || o.orderNo.includes(search);
    return matchTab && matchSearch;
  });

  const resetForm = () => {
    setForm({ customerName: '', phone: '', address: '', status: 'pending', source: 'wechat', remark: '', deliveryDate: '' });
    setProducts([{ name: '', quantity: '', unit: '斤', price: '' }]);
  };

  const openAdd = () => { setEditingId(null); resetForm(); setModalOpen(true); };
  const openEdit = (o: Order) => {
    setEditingId(o.id);
    setForm({ customerName: o.customerName, phone: o.phone || '', address: o.address || '', status: o.status, source: o.source, remark: o.remark || '', deliveryDate: o.deliveryDate || '' });
    setProducts(o.products.map(p => ({ name: p.name, quantity: String(p.quantity), unit: p.unit, price: String(p.price) })));
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!form.customerName.trim()) return;
    const validProducts = products.filter(p => p.name.trim() && parseFloat(p.quantity) > 0 && parseFloat(p.price) > 0);
    if (validProducts.length === 0) return;
    const productList = validProducts.map((p, i) => {
      const qty = parseFloat(p.quantity);
      const price = parseFloat(p.price);
      return { name: p.name.trim(), quantity: qty, unit: p.unit, price };
    });
    const total = productList.reduce((s, p) => s + p.quantity * p.price, 0);
    const d = new Date();
    const orderNo = `YW${String(d.getFullYear()).slice(2)}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}${String(orders.length+1).padStart(3,'0')}`;
    if (editingId) {
      updateOrder(editingId, {
        customerName: form.customerName.trim(), phone: form.phone.trim(), address: form.address.trim(),
        status: form.status, source: form.source, remark: form.remark.trim(),
        deliveryDate: form.deliveryDate, products: productList, totalAmount: total,
      });
    } else {
      addOrder({
        id: `${Date.now()}_${Math.random().toString(36).slice(2,6)}`, orderNo, customerId: '',
        customerName: form.customerName.trim(), phone: form.phone.trim(), address: form.address.trim(),
        status: form.status, source: form.source, remark: form.remark.trim(),
        orderDate: today(), deliveryDate: form.deliveryDate, products: productList, totalAmount: total,
      });
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => { if (window.confirm('确定删除这个订单吗？')) deleteOrder(id); };

  const addProduct = () => setProducts([...products, { name: '', quantity: '', unit: '斤', price: '' }]);
  const removeProduct = (i: number) => { if (products.length > 1) setProducts(products.filter((_, idx) => idx !== i)); };
  const updateProduct = (i: number, f: Partial<ProductForm>) => {
    const newProducts = [...products];
    newProducts[i] = { ...newProducts[i], ...f };
    setProducts(newProducts);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">订单管理</h1>
          <p className="text-gray-500 mt-1">管理所有订单，支持AI自动识别录入</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-warm-100 text-gray-700 rounded-xl font-medium hover:bg-warm-200 transition-colors">
            <Sparkles className="w-4 h-4 text-primary-500" />
            AI智能录单
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all">
            <Plus className="w-4 h-4" />
            新建订单
          </button>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all',
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white font-medium shadow-sm'
                    : 'text-gray-600 hover:bg-warm-50'
                )}
              >
                {tab.label}
                <span className={clsx(
                  'px-1.5 py-0.5 rounded-full text-xs',
                  activeTab === tab.id ? 'bg-white/20' : 'bg-warm-200 text-gray-500'
                )}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="搜索订单、客户..."
                className="w-48 pl-9 pr-4 py-2 bg-warm-50 border border-transparent rounded-xl text-sm focus:outline-none focus:bg-white focus:border-primary-200"
              />
            </div>
            <button className="p-2 text-gray-500 hover:bg-warm-100 rounded-xl transition-colors">
              <Filter className="w-5 h-5" />
            </button>
            <div className="flex bg-warm-50 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={clsx(
                  'p-1.5 rounded-lg transition-colors',
                  viewMode === 'grid' ? 'bg-white shadow-sm text-primary-500' : 'text-gray-400'
                )}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={clsx(
                  'p-1.5 rounded-lg transition-colors',
                  viewMode === 'list' ? 'bg-white shadow-sm text-primary-500' : 'text-gray-400'
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {filteredOrders.length === 0 ? (
        <div className="py-16 text-center text-gray-400">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-warm-100 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-sm mb-2">暂无订单数据</p>
          <button onClick={openAdd} className="text-sm text-primary-500 hover:text-primary-600 font-medium">点击创建第一个订单</button>
        </div>
      ) : (
        <div className={clsx(
          'gap-4',
          viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-3' : 'flex flex-col'
        )}>
          {filteredOrders.map(order => (
            <div key={order.id} className="group relative">
              <OrderCard order={order} />
              <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(order)} className="p-1.5 bg-white text-gray-500 hover:text-primary-500 hover:bg-primary-50 rounded-lg shadow-sm"><Edit3 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(order.id)} className="p-1.5 bg-white text-gray-500 hover:text-danger-500 hover:bg-danger-50 rounded-lg shadow-sm"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? '编辑订单' : '新建订单'} size="lg">
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">客户名称 *</label><input type="text" value={form.customerName} onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))} placeholder="例如：陈记火锅店" className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">手机号</label><input type="text" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="138****5678" className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">地址</label><input type="text" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="选填" className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
          <div>
            <div className="flex items-center justify-between mb-2"><label className="text-sm font-medium text-gray-700">产品明细</label><button type="button" onClick={addProduct} className="text-xs text-primary-500 font-medium">+ 添加产品</button></div>
            {products.map((p, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <input type="text" value={p.name} onChange={e => updateProduct(i, { name: e.target.value })} placeholder="产品名" className="flex-1 px-2 py-2 border border-warm-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                <input type="number" value={p.quantity} onChange={e => updateProduct(i, { quantity: e.target.value })} placeholder="数量" className="w-16 px-2 py-2 border border-warm-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                <select value={p.unit} onChange={e => updateProduct(i, { unit: e.target.value })} className="w-16 px-1 py-2 border border-warm-200 rounded-lg text-sm focus:outline-none"><option>斤</option><option>盒</option><option>袋</option><option>个</option></select>
                <input type="number" value={p.price} onChange={e => updateProduct(i, { price: e.target.value })} placeholder="单价" className="w-20 px-2 py-2 border border-warm-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                {products.length > 1 && <button onClick={() => removeProduct(i)} className="p-1.5 text-gray-400 hover:text-danger-500 rounded-lg"><Trash2 className="w-4 h-4" /></button>}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">状态</label><select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as OrderStatus }))} className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"><option value="pending">待处理</option><option value="confirmed">已确认</option><option value="producing">生产中</option><option value="shipping">配送中</option><option value="delivered">已送达</option><option value="cancelled">已取消</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">来源</label><select value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value as OrderSource }))} className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"><option value="wechat">微信</option><option value="phone">电话</option><option value="offline">到店</option><option value="other">其他</option></select></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">配送日期</label><input type="date" value={form.deliveryDate} onChange={e => setForm(f => ({ ...f, deliveryDate: e.target.value }))} className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">备注</label><input type="text" value={form.remark} onChange={e => setForm(f => ({ ...f, remark: e.target.value }))} placeholder="选填" className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
          </div>
          <button onClick={handleSubmit} className="w-full py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">{editingId ? '保存修改' : '创建订单'}</button>
        </div>
      </Modal>
    </div>
  );
}