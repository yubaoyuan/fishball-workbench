import { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, Wallet, DollarSign, Trash2, Edit3 } from 'lucide-react';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Tag from '../components/ui/Tag';
import { useDataStore } from '../store/useDataStore';
import type { FinanceRecord, PaymentMethod } from '../types';

const paymentMethods = ['wechat', 'alipay', 'cash', 'bank', 'other'] as const;
const paymentLabels: Record<string, string> = {
  wechat: '微信', alipay: '支付宝', cash: '现金', bank: '银行转账', other: '其他'
};
const incomeCategories = ['鱼丸销售', '礼盒销售', '零售', '其他收入'];
const expenseCategories = ['原材料', '快递费', '包装材料', '水电煤气', '工资', '其他支出'];

function today(): string { return new Date().toISOString().split('T')[0]; }

export default function Finance() {
  const { financeRecords, addFinanceRecord, updateFinanceRecord, deleteFinanceRecord } = useDataStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    type: 'income' as 'income' | 'expense',
    category: incomeCategories[0],
    amount: '',
    date: today(),
    description: '',
    paymentMethod: 'wechat' as PaymentMethod,
  });

  const income = financeRecords.filter(r => r.type === 'income').reduce((s, r) => s + r.amount, 0);
  const expense = financeRecords.filter(r => r.type === 'expense').reduce((s, r) => s + r.amount, 0);
  const profit = income - expense;
  const sorted = [...financeRecords].sort((a, b) => b.date.localeCompare(a.date) || (b.id > a.id ? 1 : -1));

  const openAdd = () => {
    setEditingId(null);
    setForm({ type: 'income', category: incomeCategories[0], amount: '', date: today(), description: '', paymentMethod: 'wechat' });
    setModalOpen(true);
  };

  const openEdit = (r: FinanceRecord) => {
    setEditingId(r.id);
    setForm({ type: r.type, category: r.category, amount: String(r.amount), date: r.date, description: r.description, paymentMethod: r.paymentMethod || 'wechat' });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    const amount = parseFloat(form.amount);
    if (!amount || amount <= 0 || !form.description.trim()) return;
    if (editingId) {
      updateFinanceRecord(editingId, { type: form.type, category: form.category, amount, date: form.date, description: form.description.trim(), paymentMethod: form.paymentMethod });
    } else {
      addFinanceRecord({ id: `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, type: form.type, category: form.category, amount, date: form.date, description: form.description.trim(), paymentMethod: form.paymentMethod });
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定删除这条记录吗？')) deleteFinanceRecord(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">财务管理</h1>
          <p className="text-gray-500 mt-1">记录每日收支，自动统计盈亏</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" />记一笔
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3"><p className="text-sm text-gray-500">总收入</p><div className="w-10 h-10 rounded-xl bg-success-50 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-success-500" /></div></div>
          <p className="text-2xl font-bold text-success-600">¥{income.toLocaleString()}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3"><p className="text-sm text-gray-500">总支出</p><div className="w-10 h-10 rounded-xl bg-danger-50 flex items-center justify-center"><TrendingDown className="w-5 h-5 text-danger-500" /></div></div>
          <p className="text-2xl font-bold text-danger-600">¥{expense.toLocaleString()}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3"><p className="text-sm text-gray-500">利润</p><div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center"><Wallet className="w-5 h-5 text-primary-500" /></div></div>
          <p className="text-2xl font-bold text-primary-600">¥{profit.toLocaleString()}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3"><p className="text-sm text-gray-500">记录数</p><div className="w-10 h-10 rounded-xl bg-warning-50 flex items-center justify-center"><DollarSign className="w-5 h-5 text-warning-500" /></div></div>
          <p className="text-2xl font-bold text-warning-600">{financeRecords.length}笔</p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-warm-100"><h3 className="font-semibold text-gray-800">交易记录</h3></div>
        <div className="divide-y divide-warm-100">
          {sorted.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <Wallet className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">暂无记录，点击右上角"记一笔"开始</p>
            </div>
          ) : sorted.map(record => (
            <div key={record.id} className="p-4 flex items-center gap-4 hover:bg-warm-50 transition-colors group">
              <div className={`w-10 h-10 rounded-xl ${record.type === 'income' ? 'bg-success-50' : 'bg-danger-50'} flex items-center justify-center flex-shrink-0`}>
                {record.type === 'income' ? <TrendingUp className="w-5 h-5 text-success-500" /> : <TrendingDown className="w-5 h-5 text-danger-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-800">{record.description}</span>
                  <Tag variant="default" size="sm">{record.category}</Tag>
                </div>
                <p className="text-sm text-gray-500">{record.date} · {paymentLabels[record.paymentMethod] || record.paymentMethod}</p>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${record.type === 'income' ? 'text-success-600' : 'text-danger-600'}`}>
                  {record.type === 'income' ? '+' : '-'}¥{record.amount.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(record)} className="p-1.5 text-gray-400 hover:text-primary-500 hover:bg-warm-100 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(record.id)} className="p-1.5 text-gray-400 hover:text-danger-500 hover:bg-danger-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? '编辑记录' : '记一笔'}>
        <div className="p-4 space-y-4">
          <div className="flex gap-2">
            <button onClick={() => setForm(f => ({ ...f, type: 'income', category: incomeCategories[0] }))} className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${form.type === 'income' ? 'bg-success-500 text-white' : 'bg-warm-100 text-gray-600'}`}>收入</button>
            <button onClick={() => setForm(f => ({ ...f, type: 'expense', category: expenseCategories[0] }))} className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${form.type === 'expense' ? 'bg-danger-500 text-white' : 'bg-warm-100 text-gray-600'}`}>支出</button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300">
              {(form.type === 'income' ? incomeCategories : expenseCategories).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">金额 (元)</label>
            <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0.00" className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">说明</label>
            <input type="text" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="例如：陈记火锅店货款" className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">支付方式</label>
            <select value={form.paymentMethod} onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value as PaymentMethod }))} className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300">
              {paymentMethods.map(m => <option key={m} value={m}>{paymentLabels[m]}</option>)}
            </select>
          </div>
          <button onClick={handleSubmit} className="w-full py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">{editingId ? '保存修改' : '确认记账'}</button>
        </div>
      </Modal>
    </div>
  );
}