import { Plus, Sparkles, TrendingUp, TrendingDown, Wallet, DollarSign } from 'lucide-react';
import Card from '../components/ui/Card';
import { useDataStore } from '../store/useDataStore';

const categories = {
  income: { label: '收入', color: 'text-success-600', bg: 'bg-success-50' },
  expense: { label: '支出', color: 'text-danger-600', bg: 'bg-danger-50' },
};

const typeLabels: Record<string, string> = {
  sale: '销售收入',
  purchase: '采购支出',
  salary: '工资发放',
  utility: '水电费',
  logistics: '物流运费',
};

export default function Finance() {
  const financeRecords = useDataStore(s => s.financeRecords);
  const income = financeRecords.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0);
  const expense = financeRecords.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0);
  const profit = income - expense;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">财务管理</h1>
          <p className="text-gray-500 mt-1">自动记账，AI帮您分析收支情况</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-warm-100 text-gray-700 rounded-xl font-medium hover:bg-warm-200 transition-colors">
            <Sparkles className="w-4 h-4 text-primary-500" />
            AI财务分析
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all">
            <Plus className="w-4 h-4" />
            记一笔
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500">今日收入</p>
            <div className="w-10 h-10 rounded-xl bg-success-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-success-600">¥{income.toLocaleString()}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500">今日支出</p>
            <div className="w-10 h-10 rounded-xl bg-danger-50 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-danger-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-danger-600">¥{expense.toLocaleString()}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500">今日利润</p>
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-primary-600">¥{profit.toLocaleString()}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500">应收款</p>
            <div className="w-10 h-10 rounded-xl bg-warning-50 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-warning-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-warning-600">¥12,800</p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-warm-100">
          <h3 className="font-semibold text-gray-800">最近交易记录</h3>
        </div>
        <div className="divide-y divide-warm-100">
          {financeRecords.map(record => {
            const cat = record.type === 'income' ? categories.income : categories.expense;
            return (
              <div key={record.id} className="p-4 flex items-center gap-4 hover:bg-warm-50 transition-colors">
                <div className={`w-10 h-10 rounded-xl ${cat.bg} flex items-center justify-center flex-shrink-0`}>
                  {record.type === 'income' ? (
                    <TrendingUp className="w-5 h-5 text-success-500" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-danger-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-800">{typeLabels[record.type] || record.type}</h4>
                  </div>
                  <p className="text-sm text-gray-500">{record.description} · {record.date}</p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${cat.color}`}>
                    {record.type === 'income' ? '+' : '-'}¥{record.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
