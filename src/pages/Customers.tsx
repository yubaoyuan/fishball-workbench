import { useState } from 'react';
import { Plus, Sparkles, Users, Phone, MapPin, Star, Trash2, Edit3 } from 'lucide-react';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Tag from '../components/ui/Tag';
import { useDataStore } from '../store/useDataStore';
import type { Customer } from '../types';

const levelLabels: Record<string, { label: string; variant: 'primary' | 'warning' | 'info' }> = {
  vip: { label: 'VIP客户', variant: 'primary' },
  regular: { label: '常客', variant: 'warning' },
  new: { label: '新客户', variant: 'info' },
};

function today(): string { return new Date().toISOString().split('T')[0]; }

export default function Customers() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useDataStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '', phone: '', address: '', level: 'regular' as 'vip' | 'regular' | 'new', tags: '', remark: '',
  });

  const resetForm = () => setForm({ name: '', phone: '', address: '', level: 'regular', tags: '', remark: '' });

  const openAdd = () => { setEditingId(null); resetForm(); setModalOpen(true); };
  const openEdit = (c: Customer) => {
    setEditingId(c.id);
    setForm({ name: c.name, phone: c.phone, address: c.address || '', level: c.level, tags: c.tags.join(', '), remark: c.remark || '' });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.phone.trim()) return;
    const tagList = form.tags.split(',').map(t => t.trim()).filter(Boolean);
    if (editingId) {
      updateCustomer(editingId, { name: form.name.trim(), phone: form.phone.trim(), address: form.address.trim(), level: form.level, tags: tagList, remark: form.remark.trim() });
    } else {
      addCustomer({
        id: `${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
        name: form.name.trim(), phone: form.phone.trim(), address: form.address.trim(),
        tags: tagList, level: form.level, totalOrders: 0, totalAmount: 0, totalSpent: 0,
        lastOrderDate: today(), remark: form.remark.trim(),
      });
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => { if (window.confirm('确定删除这个客户吗？')) deleteCustomer(id); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">客户管理</h1>
          <p className="text-gray-500 mt-1">管理客户信息</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-warm-100 text-gray-700 rounded-xl font-medium hover:bg-warm-200 transition-colors">
            <Sparkles className="w-4 h-4 text-primary-500" />
            AI客户分析
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all">
            <Plus className="w-4 h-4" />
            添加客户
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center"><Users className="w-5 h-5 text-primary-500" /></div>
            <div><p className="text-sm text-gray-500">客户总数</p><p className="text-xl font-bold text-gray-800">{customers.length}</p></div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning-50 flex items-center justify-center"><Star className="w-5 h-5 text-warning-500" /></div>
            <div><p className="text-sm text-gray-500">VIP客户</p><p className="text-xl font-bold text-gray-800">{customers.filter(c => c.level === 'vip').length}</p></div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success-50 flex items-center justify-center"><Users className="w-5 h-5 text-success-500" /></div>
            <div><p className="text-sm text-gray-500">常客</p><p className="text-xl font-bold text-gray-800">{customers.filter(c => c.level === 'regular').length}</p></div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><Phone className="w-5 h-5 text-blue-500" /></div>
            <div><p className="text-sm text-gray-500">新客户</p><p className="text-xl font-bold text-gray-800">{customers.filter(c => c.level === 'new').length}</p></div>
          </div>
        </Card>
      </div>

      {customers.length === 0 ? (
        <div className="py-16 text-center text-gray-400">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-warm-100 flex items-center justify-center"><Users className="w-8 h-8 text-gray-300" /></div>
          <p className="text-sm mb-2">暂无客户数据</p>
          <button onClick={openAdd} className="text-sm text-primary-500 font-medium">点击添加第一个客户</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {customers.map(customer => {
            const level = levelLabels[customer.level];
            return (
              <Card key={customer.id} className="p-5 hover:shadow-card-hover transition-shadow group relative">
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
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(customer)} className="p-1.5 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(customer.id)} className="p-1.5 text-gray-400 hover:text-danger-500 hover:bg-danger-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-500"><Phone className="w-4 h-4" /><span>{customer.phone}</span></div>
                  {customer.address && <div className="flex items-start gap-2 text-gray-500"><MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" /><span>{customer.address}</span></div>}
                  <div className="flex items-center gap-2 text-gray-500"><Star className="w-4 h-4 text-warning-500" /><span>累计消费 ¥{customer.totalSpent.toLocaleString()}</span></div>
                  {customer.tags.length > 0 && <div className="flex flex-wrap gap-1">{customer.tags.map(t => <span key={t} className="px-2 py-0.5 bg-warm-100 text-gray-500 rounded text-xs">{t}</span>)}</div>}
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-warm-100">
                  <button className="flex-1 py-2 bg-warm-50 text-gray-600 rounded-lg text-sm hover:bg-warm-100 transition-colors">打电话</button>
                  <button className="flex-1 py-2 bg-primary-50 text-primary-600 rounded-lg text-sm hover:bg-primary-100 transition-colors">下订单</button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? '编辑客户' : '添加客户'}>
        <div className="p-4 space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">客户名称 *</label><input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="例如：陈记火锅店" className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">手机号 *</label><input type="text" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="138****5678" className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">地址</label><input type="text" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="选填" className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">客户等级</label><select value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value as 'vip' | 'regular' | 'new' }))} className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"><option value="vip">VIP客户</option><option value="regular">常客</option><option value="new">新客户</option></select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">标签 (逗号分隔)</label><input type="text" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="例如：火锅店, 老客户, 周结" className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">备注</label><input type="text" value={form.remark} onChange={e => setForm(f => ({ ...f, remark: e.target.value }))} placeholder="选填" className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
          <button onClick={handleSubmit} className="w-full py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">{editingId ? '保存修改' : '添加客户'}</button>
        </div>
      </Modal>
    </div>
  );
}