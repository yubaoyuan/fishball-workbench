import { useState } from 'react';
import { Plus, Sparkles, LayoutGrid, List, Play, Eye, Heart, MessageCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Tag from '../components/ui/Tag';
import ContentCard from '../components/business/ContentCard';
import { useDataStore } from '../store/useDataStore';
import { clsx } from 'clsx';

export default function Content() {
  const contents = useDataStore(s => s.contents);
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const tabs = [
    { id: 'all', label: '全部', count: contents.length },
    { id: 'idea', label: '选题', count: contents.filter(c => c.status === 'idea').length },
    { id: 'scripting', label: '写脚本', count: contents.filter(c => c.status === 'scripting').length },
    { id: 'filming', label: '拍摄中', count: contents.filter(c => c.status === 'filming').length },
    { id: 'editing', label: '剪辑中', count: contents.filter(c => c.status === 'editing').length },
    { id: 'published', label: '已发布', count: contents.filter(c => c.status === 'published').length },
  ];

  const topicTags = [
    { id: 'all', label: '全部话题', count: contents.length },
    { id: 'make', label: '制作过程', count: 1 },
    { id: 'quality', label: '品质展示', count: 1 },
    { id: 'story', label: '幕后故事', count: 1 },
    { id: 'tutorial', label: '美食教程', count: 1 },
    { id: 'personal', label: '个人故事', count: 1 },
    { id: 'knowledge', label: '干货知识', count: 1 },
    { id: 'daily', label: '日常', count: 1 },
    { id: 'compare', label: '产品对比', count: 1 },
  ];

  const filteredContents = activeTab === 'all'
    ? contents
    : contents.filter(c => c.status === activeTab);

  const totalViews = contents.reduce((sum, c) => sum + (c.views || 0), 0);
  const totalLikes = contents.reduce((sum, c) => sum + (c.likes || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">内容创作</h1>
          <p className="text-gray-500 mt-1">管理视频选题、脚本、发布，AI帮您写文案</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-warm-100 text-gray-700 rounded-xl font-medium hover:bg-warm-200 transition-colors">
            <Sparkles className="w-4 h-4 text-primary-500" />
            AI生成脚本
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all">
            <Plus className="w-4 h-4" />
            新建选题
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <p className="text-sm text-gray-500 mb-1">总播放量</p>
          <p className="text-2xl font-bold text-gray-800">{(totalViews / 10000).toFixed(1)}w</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-gray-500 mb-1">总点赞</p>
          <p className="text-2xl font-bold text-gray-800">{(totalLikes / 1000).toFixed(1)}k</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-gray-500 mb-1">内容数量</p>
          <p className="text-2xl font-bold text-gray-800">{contents.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-gray-500 mb-1">待发布</p>
          <p className="text-2xl font-bold text-warning-500">{contents.filter(c => c.status !== 'published').length}</p>
        </Card>
      </div>

      <Card className="p-4 space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all',
                activeTab === tab.id
                  ? 'bg-primary-500 text-white font-medium shadow-sm'
                  : 'bg-warm-50 text-gray-600 hover:bg-warm-100'
              )}
            >
              {tab.label}
              <span className={clsx(
                'px-1.5 py-0.5 rounded-full text-xs',
                activeTab === tab.id ? 'bg-white/20' : 'bg-warm-200 text-gray-500'
              )}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-t border-warm-100 pt-4">
          <span className="text-xs text-gray-400 mr-2">话题：</span>
          {topicTags.map(tag => (
            <button
              key={tag.id}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs bg-warm-50 text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-colors whitespace-nowrap"
            >
              {tag.label}
              <span className="text-gray-400">{tag.count}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-warm-100">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>共 {filteredContents.length} 个内容</span>
            <span className="flex items-center gap-1">
              <Play className="w-4 h-4" /> 播放量排序
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-warm-50 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={clsx(
                  'p-1.5 rounded-lg transition-colors',
                  viewMode === 'grid' ? 'bg-white shadow-sm text-primary-500' : 'text-gray-400'
                )}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={clsx(
                  'p-1.5 rounded-lg transition-colors',
                  viewMode === 'list' ? 'bg-white shadow-sm text-primary-500' : 'text-gray-400'
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      <div className={clsx(
        'gap-4',
        viewMode === 'grid' ? 'grid grid-cols-2 lg:grid-cols-4' : 'flex flex-col'
      )}>
        {filteredContents.map(content => (
          <ContentCard key={content.id} content={content} />
        ))}
      </div>
    </div>
  );
}
