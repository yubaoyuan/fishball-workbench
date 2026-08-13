import { useState } from 'react';
import { Shield, Plus, Edit2, Trash2, X, Check, Users, KeyRound } from 'lucide-react';
import { useAuthStore, MOCK_USERS } from '../store/useAuthStore';
import { User, UserRole, ROLE_LABELS, ROLE_DEFAULT_MODULES } from '../types';
import Card from '../components/ui/Card';
import Tag from '../components/ui/Tag';
import { clsx } from 'clsx';

const roleColors: Record<UserRole, string> = {
  owner: 'bg-primary-100 text-primary-700',
  production_manager: 'bg-blue-100 text-blue-700',
  sales: 'bg-success-100 text-success-700',
  delivery: 'bg-warning-100 text-warning-700',
  finance: 'bg-purple-100 text-purple-700',
  content_creator: 'bg-pink-100 text-pink-700',
};

export default function UserManagement() {
  const { users, currentUser, addUser, updateUser, removeUser } = useAuthStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    role: 'sales' as UserRole,
    phone: '',
  });

  const handleAdd = () => {
    const newUser: User = {
      id: `u${Date.now()}`,
      username: formData.username,
      displayName: formData.displayName,
      role: formData.role,
      roleLabel: ROLE_LABELS[formData.role],
      avatar: '👤',
      phone: formData.phone,
      permissions: {
        modules: ROLE_DEFAULT_MODULES[formData.role],
        canEdit: formData.role === 'owner',
        canDelete: formData.role === 'owner',
        canExport: formData.role !== 'delivery',
      },
      active: true,
      createdAt: new Date().toISOString().split('T')[0],
    };
    addUser(newUser);
    setShowAddModal(false);
    setFormData({ username: '', displayName: '', role: 'sales', phone: '' });
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      displayName: user.displayName,
      role: user.role,
      phone: user.phone,
    });
  };

  const handleSaveEdit = () => {
    if (!editingUser) return;
    updateUser(editingUser.id, {
      displayName: formData.displayName,
      role: formData.role,
      roleLabel: ROLE_LABELS[formData.role],
      phone: formData.phone,
      permissions: {
        modules: ROLE_DEFAULT_MODULES[formData.role],
        canEdit: formData.role === 'owner',
        canDelete: formData.role === 'owner',
        canExport: formData.role !== 'delivery',
      },
    });
    setEditingUser(null);
    setFormData({ username: '', displayName: '', role: 'sales', phone: '' });
  };

  const handleDelete = (userId: string) => {
    if (userId === currentUser?.id) {
      alert('不能删除当前登录的用户');
      return;
    }
    if (confirm('确定要删除该用户吗？')) {
      removeUser(userId);
    }
  };

  const handleToggleActive = (user: User) => {
    updateUser(user.id, { active: !user.active });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">用户管理</h1>
          <p className="text-gray-500 mt-1">管理系统用户和权限，不同角色看到不同的功能模块</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          添加用户
        </button>
      </div>

      {/* 角色权限说明 */}
      <Card className="p-5">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary-500" />
          角色权限说明
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {(Object.entries(ROLE_LABELS) as [UserRole, string][]).map(([role, label]) => (
            <div key={role} className="p-3 bg-warm-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className={clsx('px-2 py-0.5 rounded-lg text-xs font-medium', roleColors[role])}>
                  {label}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {ROLE_DEFAULT_MODULES[role].filter(m => m !== 'users').map(mod => (
                  <span key={mod} className="px-1.5 py-0.5 bg-white rounded text-xs text-gray-600">
                    {mod === 'dashboard' ? '首页' : mod === 'orders' ? '订单' : mod === 'purchasing' ? '采购' :
                     mod === 'production' ? '生产' : mod === 'delivery' ? '配送' : mod === 'finance' ? '财务' :
                     mod === 'content' ? '内容' : mod === 'customers' ? '客户' : mod === 'ai-assistant' ? 'AI' :
                     mod === 'analytics' ? '数据' : mod === 'industry' ? '行业' : mod}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 用户列表 */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-warm-200">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">用户</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">角色</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">手机号</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">创建时间</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className={clsx(
                  'border-b border-warm-100 transition-colors',
                  currentUser?.id === user.id ? 'bg-primary-50/50' : 'hover:bg-warm-50'
                )}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{user.avatar}</span>
                      <div>
                        <div className="font-medium text-sm text-gray-800 flex items-center gap-2">
                          {user.displayName}
                          {currentUser?.id === user.id && (
                            <Tag variant="primary" size="sm">当前</Tag>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={clsx('px-2 py-0.5 rounded-lg text-xs font-medium', roleColors[user.role])}>
                      {user.roleLabel}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.phone}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(user)}
                      className={clsx(
                        'px-2 py-0.5 rounded-lg text-xs font-medium transition-colors',
                        user.active
                          ? 'bg-success-100 text-success-700 hover:bg-success-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      )}
                    >
                      {user.active ? '启用' : '禁用'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{user.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {currentUser?.id !== user.id && (
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 添加/编辑弹窗 */}
      {(showAddModal || editingUser) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-primary-500" />
                {editingUser ? '编辑用户' : '添加新用户'}
              </h3>
              <button
                onClick={() => { setShowAddModal(false); setEditingUser(null); }}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-warm-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                  placeholder="例如：张三"
                  className="w-full px-4 py-2.5 bg-warm-50 border border-warm-200 rounded-xl text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                  placeholder="登录用户名"
                  disabled={!!editingUser}
                  className={clsx(
                    'w-full px-4 py-2.5 border border-warm-200 rounded-xl text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100',
                    editingUser ? 'bg-gray-100 cursor-not-allowed' : 'bg-warm-50'
                  )}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">手机号</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="手机号码"
                  className="w-full px-4 py-2.5 bg-warm-50 border border-warm-200 rounded-xl text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">角色</label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="w-full px-4 py-2.5 bg-warm-50 border border-warm-200 rounded-xl text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
                >
                  {(Object.entries(ROLE_LABELS) as [UserRole, string][]).map(([role, label]) => (
                    <option key={role} value={role}>{label}</option>
                  ))}
                </select>
              </div>

              {/* 角色权限预览 */}
              <div className="p-3 bg-warm-50 rounded-xl">
                <div className="text-xs text-gray-500 mb-2">该角色可访问模块：</div>
                <div className="flex flex-wrap gap-1">
                  {ROLE_DEFAULT_MODULES[formData.role].filter(m => m !== 'users').map(mod => (
                    <span key={mod} className="px-2 py-0.5 bg-white rounded text-xs text-gray-600">
                      {mod === 'dashboard' ? '工作台首页' : mod === 'orders' ? '订单管理' :
                       mod === 'purchasing' ? '采购管理' : mod === 'production' ? '生产管理' :
                       mod === 'delivery' ? '配送快递' : mod === 'finance' ? '财务管理' :
                       mod === 'content' ? '内容创作' : mod === 'customers' ? '客户管理' :
                       mod === 'ai-assistant' ? 'AI助手' : mod === 'analytics' ? '数据分析' : mod === 'industry' ? '行业洞察' : mod}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowAddModal(false); setEditingUser(null); }}
                className="flex-1 py-2.5 border border-warm-200 text-gray-600 rounded-xl font-medium hover:bg-warm-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={editingUser ? handleSaveEdit : handleAdd}
                disabled={!formData.displayName || !formData.username}
                className={clsx(
                  'flex-1 py-2.5 rounded-xl font-medium text-white transition-all flex items-center justify-center gap-2',
                  !formData.displayName || !formData.username
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:shadow-lg'
                )}
              >
                <Check className="w-4 h-4" />
                {editingUser ? '保存修改' : '添加用户'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}