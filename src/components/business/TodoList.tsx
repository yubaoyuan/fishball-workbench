import { useState } from 'react';
import { Check, Sparkles, AlertCircle, Clock, Plus, X, Trash2, Edit3 } from 'lucide-react';
import { useDataStore } from '../../store/useDataStore';
import Card from '../ui/Card';
import { clsx } from 'clsx';

const priorityConfig = {
  high: { color: 'text-red-500', bg: 'bg-red-50', label: '紧急' },
  medium: { color: 'text-warning-500', bg: 'bg-warning-50', label: '重要' },
  low: { color: 'text-gray-400', bg: 'bg-gray-50', label: '普通' },
};

export default function TodoList() {
  const { todos, toggleTodo, addTodo, deleteTodo } = useDataStore();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');

  const handleAdd = () => {
    if (!input.trim()) return;
    addTodo({ content: input.trim(), priority, completed: false });
    setInput('');
    setPriority('medium');
    setAdding(false);
  };

  const handleEdit = (id: string, content: string, p: string) => {
    setEditingId(id);
    setInput(content);
    setPriority(p as 'high' | 'medium' | 'low');
    setAdding(true);
  };

  const handleSaveEdit = () => {
    if (!input.trim() || !editingId) return;
    // Delete old and add new (simpler approach)
    deleteTodo(editingId);
    addTodo({ content: input.trim(), priority, completed: false });
    setInput('');
    setEditingId(null);
    setAdding(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定删除这条待办吗？')) deleteTodo(id);
  };

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary-500" />
          今日待办
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">
            {todos.filter(t => !t.completed).length} 项待处理
          </span>
          <button
            onClick={() => { setAdding(!adding); setEditingId(null); setInput(''); setPriority('medium'); }}
            className="p-1 text-gray-400 hover:text-primary-500 hover:bg-warm-100 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {adding && (
        <div className="mb-3 p-3 bg-warm-50 rounded-xl border border-warm-200">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') editingId ? handleSaveEdit() : handleAdd(); if (e.key === 'Escape') { setAdding(false); setEditingId(null); } }}
            placeholder="输入待办事项..."
            className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 mb-2"
            autoFocus
          />
          <div className="flex items-center gap-2">
            <select value={priority} onChange={e => setPriority(e.target.value as 'high' | 'medium' | 'low')} className="px-2 py-1.5 border border-warm-200 rounded-lg text-xs focus:outline-none">
              <option value="high">紧急</option>
              <option value="medium">重要</option>
              <option value="low">普通</option>
            </select>
            <div className="flex-1" />
            <button onClick={() => { setAdding(false); setEditingId(null); }} className="px-3 py-1.5 text-xs text-gray-500 hover:bg-warm-200 rounded-lg">取消</button>
            <button onClick={editingId ? handleSaveEdit : handleAdd} className="px-3 py-1.5 text-xs bg-primary-500 text-white rounded-lg hover:bg-primary-600">{editingId ? '保存' : '添加'}</button>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
        {todos.length === 0 ? (
          <div className="py-6 text-center text-gray-400">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">暂无待办，点击 + 添加</p>
          </div>
        ) : todos.map((todo) => {
          const p = priorityConfig[todo.priority];
          return (
            <div
              key={todo.id}
              className={clsx(
                'flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all group',
                todo.completed ? 'bg-gray-50' : 'bg-warm-50 hover:bg-warm-100'
              )}
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className={clsx(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all',
                  todo.completed
                    ? 'bg-success-500 border-success-500 text-white'
                    : 'border-gray-300 hover:border-primary-400 group-hover:border-primary-400'
                )}
              >
                {todo.completed && <Check className="w-3 h-3" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className={clsx(
                  'text-sm leading-relaxed',
                  todo.completed ? 'text-gray-400 line-through' : 'text-gray-700'
                )}>
                  {todo.content}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={clsx('inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium', p.bg, p.color)}>
                    <AlertCircle className="w-3 h-3" />{p.label}
                  </span>
                  {todo.isAI && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-primary-50 text-primary-600">
                      <Sparkles className="w-3 h-3" />AI建议
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); handleEdit(todo.id, todo.content, todo.priority); }}
                  className="p-1 text-gray-400 hover:text-primary-500 hover:bg-warm-100 rounded"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(todo.id); }}
                  className="p-1 text-gray-400 hover:text-danger-500 hover:bg-danger-50 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}