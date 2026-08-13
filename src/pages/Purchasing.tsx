import { useState } from 'react';
import { Plus, ShoppingCart, Trash2, Edit3, Package } from 'lucide-react';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Tag from '../components/ui/Tag';
import { useDataStore } from '../store/useDataStore';
import type { Purchase } from '../types';

const statusConfig: Record<string, { label: string; variant: 'warning' | 'info' | 'success' }> = {
  planned: { label: '待采购', variant: 'warning' },
  purchased: { label: '已采购', variant: 'info' },
  received: { label: '已到货', variant: 'success' },
};

function today(): string { return new Date().toISOString().split('T')[0]; }

export default function Purchasing() {
  const { purchases, addPurchase, updatePurchase, deletePurchase } = useDataStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    materialName: '', quantity: '', unit: '斤', unitPrice: '', supplierName: '', status: 'planned' as string, remark: '',
  });

  const sorted = [...purchases].sort((a, b) => b.purchaseDate.localeCompare(a.purchaseDate));
  const totalAmount = purchases.reduce((s, p) => s + p.totalPrice, 0);

  const openAdd = () => { setEditingId(null); setForm({ materialName: '', quantity: '', unit: '斤', unitPrice: '', supplierName: '', status: 'planned', remark: '' }); setModalOpen(true); };
  const openEdit = (p: Purchase) => { setEditingId(p.id); setForm({ materialName: p.materialName, quantity: String(p.quantity), unit: p.unit, unitPrice: String(p.unitPrice), supplierName: p.supplierName, status: p.status, remark: p.remark || '' }); setModalOpen(true); };
  const handleSubmit = () => {
    const qty = parseFloat(form.quantity);
    const price = parseFloat(form.unitPrice);
    if (!form.materialName.trim() || !qty || qty <= 0 || !price || price <= 0) return;
    const totalPrice = Math.round(qty * price * 100) / 100;
    if (editingId) {
      updatePurchase(editingId, { materialName: form.materialName.trim(), quantity: qty, unit: form.unit, unitPrice: price, totalPrice, supplierName: form.supplierName.trim(), status: form.status as Purchase['status'], remark: form.remark.trim() });
    } else {
      addPurchase({ id: `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, materialName: form.materialName.trim(), quantity: qty, unit: form.unit, unitPrice: price, totalPrice, supplierId: `s${Date.now()}`, supplierName: form.supplierName.trim(), purchaseDate: today(), status: form.status as Purchase['status'], remark: form.remark.trim() });
    }
    setModalOpen(false);
  };
  const handleDelete = (id: string) => { if (window.confirm('确定删除吗？')) deletePurchase(id); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-800">采购管理</h1><p className="text-gray-500 mt-1">管理原材料采购记录</p></div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"><Plus className="w-4 h-4" />记采购</button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center"><ShoppingCart className="w-5 h-5 text-primary-500" /></div><div><p className="text-sm text-gray-500">采购总额</p><p className="text-xl font-bold text-gray-800">¥{totalAmount.toLocaleString()}</p></div></div></Card>
        <Card className="p-5"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-warning-50 flex items-center justify-center"><ShoppingCart className="w-5 h-5 text-warning-500" /></div><div><p className="text-sm text-gray-500">待采购</p><p className="text-xl font-bold text-gray-800">{purchases.filter(p => p.status === 'planned').length}项</p></div></div></Card>
        <Card className="p-5"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-success-50 flex items-center justify-center"><Package className="w-5 h-5 text-success-500" /></div><div><p className="text-sm text-gray-500">已到货</p><p className="text-xl font-bold text-gray-800">{purchases.filter(p => p.status === 'received').length}项</p></div></div></Card>
        <Card className="p-5"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><ShoppingCart className="w-5 h-5 text-blue-500" /></div><div><p className="text-sm text-gray-500">供应商</p><p className="text-xl font-bold text-gray-800">{new Set(purchases.map(p => p.supplierName)).size}家</p></div></div></Card>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-warm-100"><h3 className="font-semibold text-gray-800">采购记录</h3></div>
        <div className="divide-y divide-warm-100">
          {sorted.length === 0 ? (
            <div className="py-12 text-center text-gray-400"><ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-50" /><p className="text-sm">暂无采购记录，点击右上角"记采购"开始</p></div>
          ) : sorted.map(p => {
            const s = statusConfig[p.status];
            return (
              <div key={p.id} className="p-4 flex items-center gap-4 hover:bg-warm-50 transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0"><ShoppingCart className="w-5 h-5 text-primary-500" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1"><span className="font-medium text-gray-800">{p.materialName}</span><Tag variant={s.variant} size="sm">{s.label}</Tag></div>
                  <p className="text-sm text-gray-500">{p.supplierName} · {p.quantity}{p.unit} × ¥{p.unitPrice}{p.remark ? ` · ${p.remark}` : ''}</p>
                </div>
                <div className="text-right"><p className="font-semibold text-gray-800">¥{p.totalPrice}</p><p className="text-xs text-gray-400">{p.purchaseDate}</p></div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(p)} className="p-1.5 text-gray-400 hover:text-primary-500 hover:bg-warm-100 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-1.5 text-gray-400 hover:text-danger-500 hover:bg-danger-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? '编辑采购' : '记采购'}>
        <div className="p-4 space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">原料名称</label><input type="text" value={form.materialName} onChange={e => setForm(f => ({ ...f, materialName: e.target.value }))} placeholder="例如：新鲜草鱼" className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">数量</label><input type="number" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} placeholder="100" className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">单位</label><select value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"><option>斤</option><option>个</option><option>盒</option><option>袋</option><option>公斤</option></select></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">单价 (元)</label><input type="number" value={form.unitPrice} onChange={e => setForm(f => ({ ...f, unitPrice: e.target.value }))} placeholder="8" className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">供应商</label><input type="text" value={form.supplierName} onChange={e => setForm(f => ({ ...f, supplierName: e.target.value }))} placeholder="例如：老王水产" className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">状态</label><select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"><option value="planned">待采购</option><option value="purchased">已采购</option><option value="received">已到货</option></select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">备注</label><input type="text" value={form.remark} onChange={e => setForm(f => ({ ...f, remark: e.target.value }))} placeholder="选填" className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
          <button onClick={handleSubmit} className="w-full py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">{editingId ? '保存修改' : '确认添加'}</button>
        </div>
      </Modal>
    </div>
  );
}