import { Check, Sparkles, AlertCircle, Clock } from 'lucide-react';
import { useDataStore } from '../../store/useDataStore';
import Card from '../ui/Card';
import { clsx } from 'clsx';

const priorityConfig = {
  high: { color: 'text-red-500', bg: 'bg-red-50', label: '紧急' },
  medium: { color: 'text-warning-500', bg: 'bg-warning-50', label: '重要' },
  low: { color: 'text-gray-400', bg: 'bg-gray-50', label: '普通' },
};

export default function TodoList() {
  const { todos, toggleTodo } = useDataStore();

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary-500" />
          今日待办
        </h3>
        <span className="text-xs text-gray-400">
          {todos.filter(t => !t.completed).length} 项待处理
        </span>
      </div>
      <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
        {todos.map((todo) => {
          const priority = priorityConfig[todo.priority];
          return (
            <div
              key={todo.id}
              onClick={() => toggleTodo(todo.id)}
              className={clsx(
                'flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all group',
                todo.completed ? 'bg-gray-50' : 'bg-warm-50 hover:bg-warm-100'
              )}
            >
              <button
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
                  <span className={clsx(
                    'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium',
                    priority.bg,
                    priority.color
                  )}>
                    <AlertCircle className="w-3 h-3" />
                    {priority.label}
                  </span>
                  {todo.isAI && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-primary-50 text-primary-600">
                      <Sparkles className="w-3 h-3" />
                      AI建议
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
