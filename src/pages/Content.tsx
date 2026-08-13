import { useState } from 'react';
import { Plus, Sparkles, LayoutGrid, List, Play, Eye, Heart, MessageCircle, Trash2, Edit3 } from 'lucide-react';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Tag from '../components/ui/Tag';
import ContentCard from '../components/business/ContentCard';
import { useDataStore } from '../store/useDataStore';
import { clsx } from 'clsx';
import type { Content, ContentStatus, ContentPlatform } from '../types';

const statusConfig: Record<ContentStatus, { label: string; variant: 'default' | 'info' | 'warning' | 'primary' | 'success' }> = {
  idea: { label: '选题', variant: 'default' },
  scripting: { label: '写脚本', variant: 'info' },
  filming: { label: '拍摄中', variant: 'warning' },
  editing: { label: '剪辑中', variant: 'primary' },
  published: { label: '已发布', variant: 'success' },
};

const platformLabels: Record<ContentPlatform, string> = {
  douyin: '抖音', xiaohongshu: '小红书', shipinhao: '视频号', other: '其他',
};

const topicOptions = ['制作过程', '品质展示', '幕后故事', '美食教程', '个人故事', '干货知识', '日常', '产品对比'];

const colorOptions = ['#E85D3C', '#5B8C5A', '#F5A623', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#10B981'];

function today(): string { return new Date().toISOString().split('T')[0]; }

export default function Content() {
  const { contents, addContent, updateContent, deleteContent } = useDataStore();
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '', topic: '制作过程', platform: 'douyin' as ContentPlatform,
    status: 'idea' as ContentStatus, coverColor: '#E85D3C',
  });

  const tabs = [
    { id: 'all', label: '全部', count: contents.length },
    { id: 'idea', label: '选题', count: contents.filter(c => c.status === 'idea').length },
    { id: 'scripting', label: '写脚本', count: contents.filter(c => c.status === 'scripting').length },
    { id: 'filming', label: '拍摄中', count: contents.filter(c => c.status === 'filming').length },
    { id: 'editing', label: '剪辑中', count: contents.filter(c => c.status === 'editing').length },
    { id: 'published', label: '已发布', count: contents.filter(c => c.status === 'published').length },
  ];

  const filteredContents = activeTab === 'all' ? contents : contents.filter(c => c.status === activeTab);

  const totalViews = contents.reduce((sum, c) => sum + (c.views || 0), 0);
  const totalLikes = contents.reduce((sum, c) => sum + (c.likes || 0), 0);

  const resetForm = () => setForm({ title: '', topic: '制作过程', platform: 'douyin', status: 'idea', coverColor: '#E85D3C' });

  const openAdd = () => { setEditingId(null); resetForm(); setModalOpen(true); };
  const openEdit = (c: Content) => {
    setEditingId(c.id);
    setForm({ title: c.title, topic: c.topic, platform: c.platform, status: c.status, coverColor: c.coverColor });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    if (editingId) {
      updateContent(editingId, { title: form.title.trim(), topic: form.topic, platform: form.platform, status: form.status, coverColor: form.coverColor });
    } else {
      addContent({
        id: `${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
        title: form.title.trim(), topic: form.topic, platform: form.platform,
        status: form.status, coverColor: form.coverColor,
      });
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => { if (window.confirm('确定删除这个内容吗？')) deleteContent(id); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">内容创作</h1>
          <p className="text-gray-500 mt-1">管理视频选题、脚本、发布</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-warm-100 text-gray-700 rounded-xl font-medium hover:bg-warm-200 transition-colors">
            <Sparkles className="w-4 h-4 text-primary-500" />
            AI生成脚本
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all">
            <Plus className="w-4 h-4" />
            新建选题
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5"><p className="text-sm text-gray-500 mb-1">总播放量</p><p className="text-2xl font-bold text-gray-800">{totalViews > 0 ? `${(totalViews/10000).toFixed(1)}w` : '0'}</p></Card>
        <Card className="p-5"><p className="text-sm text-gray-500 mb-1">总点赞</p><p className="text-2xl font-bold text-gray-800">{totalLikes > 0 ? `${(totalLikes/1000).toFixed(1)}k` : '0'}</p></Card>
        <Card className="p-5"><p className="text-sm text-gray-500 mb-1">内容数量</p><p className="text-2xl font-bold text-gray-800">{contents.length}</p></Card>
        <Card className="p-5"><p className="text-sm text-gray-500 mb-1">待发布</p><p className="text-2xl font-bold text-warning-500">{contents.filter(c => c.status !== 'published').length}</p></Card>
      </div>

      <Card className="p-4 space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={clsx('flex items-center gap-1.5 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all', activeTab === tab.id ? 'bg-primary-500 text-white font-medium shadow-sm' : 'bg-warm-50 text-gray-600 hover:bg-warm-100')}>
              {tab.label}
              <span className={clsx('px-1.5 py-0.5 rounded-full text-xs', activeTab === tab.id ? 'bg-white/20' : 'bg-warm-200 text-gray-500')}>{tab.count}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-warm-100">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>共 {filteredContents.length} 个内容</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-warm-50 rounded-xl p-1">
              <button onClick={() => setViewMode('grid')} className={clsx('p-1.5 rounded-lg transition-colors', viewMode === 'grid' ? 'bg-white shadow-sm text-primary-500' : 'text-gray-400')}><LayoutGrid className="w-4 h-4" /></button>
              <button onClick={() => setViewMode('list')} className={clsx('p-1.5 rounded-lg transition-colors', viewMode === 'list' ? 'bg-white shadow-sm text-primary-500' : 'text-gray-400')}><List className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </Card>

      {filteredContents.length === 0 ? (
        <div className="py-16 text-center text-gray-400">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-warm-100 flex items-center justify-center"><Play className="w-8 h-8 text-gray-300" /></div>
          <p className="text-sm mb-2">暂无内容</p>
          <button onClick={openAdd} className="text-sm text-primary-500 font-medium">点击创建第一个选题</button>
        </div>
      ) : (
        <div className={clsx('gap-4', viewMode === 'grid' ? 'grid grid-cols-2 lg:grid-cols-4' : 'flex flex-col')}>
          {filteredContents.map(content => (
            <div key={content.id} className="group relative">
              <ContentCard content={content} />
              <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(content)} className="p-1.5 bg-white/90 backdrop-blur-sm text-gray-600 hover:text-primary-500 rounded-lg shadow-sm"><Edit3 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(content.id)} className="p-1.5 bg-white/90 backdrop-blur-sm text-gray-600 hover:text-danger-500 rounded-lg shadow-sm"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? '编辑内容' : '新建选题'}>
        <div className="p-4 space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">标题 *</label><input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="例如：手工鱼丸制作全过程" className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">话题</label><select value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300">{topicOptions.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">平台</label><select value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value as ContentPlatform }))} className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"><option value="douyin">抖音</option><option value="xiaohongshu">小红书</option><option value="shipinhao">视频号</option><option value="other">其他</option></select></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">状态</label><select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as ContentStatus }))} className="w-full px-3 py-2 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"><option value="idea">选题</option><option value="scripting">写脚本</option><option value="filming">拍摄中</option><option value="editing">剪辑中</option><option value="published">已发布</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">封面颜色</label><div className="flex items-center gap-2 flex-wrap mt-1">{colorOptions.map(c => <button key={c} onClick={() => setForm(f => ({ ...f, coverColor: c }))} className={`w-6 h-6 rounded-full border-2 transition-all ${form.coverColor === c ? 'border-gray-800 scale-110' : 'border-transparent'}`} style={{ backgroundColor: c }} />)}</div></div>
          </div>
          <button onClick={handleSubmit} className="w-full py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">{editingId ? '保存修改' : '创建选题'}</button>
        </div>
      </Modal>
    </div>
  );
}