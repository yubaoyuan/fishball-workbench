import { useState } from 'react';
import { Plus, Package, Clock, CheckCircle, Trash2, Edit3 } from 'lucide-react';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Tag from '../components/ui/Tag';
import { useDataStore } from '../store/useDataStore';
import type { Production } from '../types';

function today(): string { return new Date().toISOString().split('T')[0]; }

export default function Production() {
  const { production, addProduction, updateProduction, deleteProduction } = useDataStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ productName: '', quantity: '', unit: '斤', goodRate: '98', date: today() });

  const sorted = [...production].sort((a, b) => b.date.localeCompare(a.date));
  const todayTotal = production.filter(p => p.date === today()).reduce((s, p) => s + p.quantity, 0);
  const avgRate = production.length > 0 ? Math.round(production.reduce((s, p) => s + p.goodRate, 0) / production.length) : 0;

  const openAdd = () => { setEditingId(null); setForm({ productName: '', quantity: '', unit: '斤', goodRate: '98', date: today() }); setModalOpen(true); };
  const openEdit = (p: Production) => { setEditingId(p.id); setForm({ productName: p.productName, quantity: String(p.quantity), unit: p.unit, goodRate: String(p.goodRate), date: p.date }); setModalOpen(true); };
  const handleSubmit = () => {
    const qty = parseFloat(form.quantity);
    const rate = parseInt(form.goodRate);
    if (!form.productName.trim() || !qty || qty <= 0) return;
    if (editingId) {
      updateProduction(editingId, { productName: form.productName.trim(), quantity: qty, unit: form.unit, goodRate: rate, date: form.date });
    } else {
      addProduction({ id: `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, productName: form.productName.trim(), quantity: qty, unit: form.unit, goodRate: rate, date: form.date });
    }
    setModalOpen(false);
  };
  const handleDelete = (id: string) => { if (window.confirm('确定删除吗？')) deleteProduction(id); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-800">生产管理</h1><p className="text-gray-500 mt-1">记录每日生产数据</p></div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"><Plus className="w-4 h-4" />记生产</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center"><Package className="w-5 h-5 text-primary-500" /></div><div><p className="text-sm text-gray-500">今日产量</p><p className="text-xl font-bold text-gray-800">{todayTotal}斤</p></div></div></Card>
        <Card className="p-5"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-warning-50 flex items-center justify-center"><Clock className="w-5 h-5 text-warning-500" /></div><div><p className="text-sm text-gray-500">生产批次</p><p className="text-xl font-bold text-gray-800">{production.length}批</p></div></div></Card>
        <Card className="p-5"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-success-50 flex items-center justify-center"><CheckCircle className="w-5 h-5 text-success-500" /></div><div><p className="text-sm text-gray-500">平均良品率</p><p className="text-xl font-bold text-gray-800">{avgRate}%</p></div></div></Card>
        <Card className="p-5"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><Package className="w-5 h-5 text-blue-500" /></div><div><p className="text-sm text-gray-500">总产量</p><p className="text-xl font-bold text-gray-800">{production.reduce((s, p) => s + p.quantity, 0)}斤</p></div></div></Card>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-warm-100"><h3 className="font-semibold text-gray-800">生产记录</h3></div>
        <div className="divide-y divide-warm-100">
          {sorted.length === 0 ? (
            <div className="py-12 text-center text-gray-400"><Package className="w-10 h-10 mx-auto mb-2 opacity-50" /><p className="text-sm">暂无生产记录，点击右上角"记生产"开始</p></div>
          ) : sorted.map(p => (
            <div key={p.id} className="p-4 flex items-center gap-4 hover:bg-warm-50 transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0"><Package className="w-5 h-5 text-primary-500" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1"><span className="font-medium text-gray-800">{p.productName}</span><Tag variant={p.goodRate >= 98 ? 'success' : 'warning'} size="sm">良品率{p.goodRate}%</Tag></div>
                <p className="text-sm text-gray-500">{p.quantity}{p.unit} · {p.date}</p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(p)} className="p-1.5 text-gray-400 hover:text-primary-500 hover:bg-warm-100 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(p.id)} className="p-1.5 text-gray-400 hover:text-danger-500 hover:bg-danger-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? '编辑生产记录' : '记生产'}>
        <div className="p-4 space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">产品名称</label><input type="text" value={form.productName} onChange={e => setForm(f => ({ ...f, productName: e.target.value }))} placeholder="例如：手工鱼丸" className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">产量</label><input type="number" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} placeholder="80" className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">单位</label><select value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"><option>斤</option><option>盒</option><option>袋</option></select></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">良品率 (%)</label><input type="number" value={form.goodRate} onChange={e => setForm(f => ({ ...f, goodRate: e.target.value }))} min="0" max="100" className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">日期</label><input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
          <button onClick={handleSubmit} className="w-full py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">{editingId ? '保存修改' : '确认添加'}</button>
        </div>
      </Modal>
    </div>
  );
}