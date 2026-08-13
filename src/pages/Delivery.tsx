import { useState } from 'react';
import { Plus, Truck, MapPin, Clock, CheckCircle, Trash2, Edit3 } from 'lucide-react';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Tag from '../components/ui/Tag';
import { useDataStore } from '../store/useDataStore';
import type { Delivery } from '../types';

const statusConfig: Record<string, { label: string; variant: 'primary' | 'warning' | 'info' | 'success' }> = {
  shipping: { label: '配送中', variant: 'primary' },
  waiting: { label: '待配送', variant: 'warning' },
  transit: { label: '运输中', variant: 'info' },
  delivered: { label: '已送达', variant: 'success' },
};

function today(): string { return new Date().toISOString().split('T')[0]; }

export default function Delivery() {
  const { deliveries, addDelivery, updateDelivery, deleteDelivery } = useDataStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ customerName: '', company: '自配送', trackingNo: '', status: 'waiting' as string, shipDate: today() });

  const sorted = [...deliveries].sort((a, b) => (b.shipDate || '').localeCompare(a.shipDate || ''));
  const shipping = deliveries.filter(d => d.status === 'shipped' || d.status === 'transit').length;
  const waiting = deliveries.filter(d => d.status === 'waiting').length;

  const openAdd = () => { setEditingId(null); setForm({ customerName: '', company: '自配送', trackingNo: '', status: 'waiting', shipDate: today() }); setModalOpen(true); };
  const openEdit = (d: Delivery) => { setEditingId(d.id); setForm({ customerName: d.customerName, company: d.company, trackingNo: d.trackingNo || '', status: d.status, shipDate: d.shipDate || today() }); setModalOpen(true); };
  const handleSubmit = () => {
    if (!form.customerName.trim()) return;
    if (editingId) {
      updateDelivery(editingId, { customerName: form.customerName.trim(), company: form.company.trim(), trackingNo: form.trackingNo.trim(), status: form.status as Delivery['status'], shipDate: form.shipDate });
    } else {
      addDelivery({ id: `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, orderId: '', customerName: form.customerName.trim(), company: form.company.trim(), trackingNo: form.trackingNo.trim(), status: form.status as Delivery['status'], shipDate: form.shipDate });
    }
    setModalOpen(false);
  };
  const handleDelete = (id: string) => { if (window.confirm('确定删除吗？')) deleteDelivery(id); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-800">配送管理</h1><p className="text-gray-500 mt-1">管理配送任务和物流跟踪</p></div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"><Plus className="w-4 h-4" />记配送</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center"><Truck className="w-5 h-5 text-primary-500" /></div><div><p className="text-sm text-gray-500">配送中</p><p className="text-xl font-bold text-gray-800">{shipping}单</p></div></div></Card>
        <Card className="p-5"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-warning-50 flex items-center justify-center"><Clock className="w-5 h-5 text-warning-500" /></div><div><p className="text-sm text-gray-500">待配送</p><p className="text-xl font-bold text-gray-800">{waiting}单</p></div></div></Card>
        <Card className="p-5"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-success-50 flex items-center justify-center"><CheckCircle className="w-5 h-5 text-success-500" /></div><div><p className="text-sm text-gray-500">已送达</p><p className="text-xl font-bold text-gray-800">{deliveries.filter(d => d.status === 'delivered').length}单</p></div></div></Card>
        <Card className="p-5"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><MapPin className="w-5 h-5 text-blue-500" /></div><div><p className="text-sm text-gray-500">总任务</p><p className="text-xl font-bold text-gray-800">{deliveries.length}单</p></div></div></Card>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-warm-100"><h3 className="font-semibold text-gray-800">配送列表</h3></div>
        <div className="divide-y divide-warm-100">
          {sorted.length === 0 ? (
            <div className="py-12 text-center text-gray-400"><Truck className="w-10 h-10 mx-auto mb-2 opacity-50" /><p className="text-sm">暂无配送记录，点击右上角"记配送"开始</p></div>
          ) : sorted.map((d, i) => {
            const s = statusConfig[d.status];
            return (
              <div key={d.id} className="p-4 flex items-center gap-4 hover:bg-warm-50 transition-colors group">
                <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1"><span className="font-medium text-gray-800">{d.customerName}</span><Tag variant={s.variant} size="sm">{s.label}</Tag></div>
                  <p className="text-sm text-gray-500">{d.company}{d.trackingNo ? ` · ${d.trackingNo}` : ''}</p>
                </div>
                <div className="text-right"><p className="text-sm text-gray-500">{d.shipDate || '待定'}</p></div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(d)} className="p-1.5 text-gray-400 hover:text-primary-500 hover:bg-warm-100 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(d.id)} className="p-1.5 text-gray-400 hover:text-danger-500 hover:bg-danger-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? '编辑配送' : '记配送'}>
        <div className="p-4 space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">客户名称</label><input type="text" value={form.customerName} onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))} placeholder="例如：陈记火锅店" className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">配送方式</label><select value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"><option>自配送</option><option>顺丰速运</option><option>中通快递</option><option>圆通快递</option><option>韵达快递</option></select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">快递单号 (选填)</label><input type="text" value={form.trackingNo} onChange={e => setForm(f => ({ ...f, trackingNo: e.target.value }))} placeholder="例如：SF1234567890" className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">状态</label><select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"><option value="waiting">待配送</option><option value="shipping">配送中</option><option value="transit">运输中</option><option value="delivered">已送达</option></select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">日期</label><input type="date" value={form.shipDate} onChange={e => setForm(f => ({ ...f, shipDate: e.target.value }))} className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
          <button onClick={handleSubmit} className="w-full py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">{editingId ? '保存修改' : '确认添加'}</button>
        </div>
      </Modal>
    </div>
  );
}