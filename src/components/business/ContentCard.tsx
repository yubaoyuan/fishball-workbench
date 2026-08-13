import { Play, Heart, MessageCircle, Eye, MoreHorizontal, Sparkles } from 'lucide-react';
import Card from '../ui/Card';
import Tag from '../ui/Tag';
import type { Content } from '../../types';

const statusConfig = {
  idea: { label: '选题', variant: 'default' as const },
  scripting: { label: '写脚本', variant: 'info' as const },
  filming: { label: '拍摄中', variant: 'warning' as const },
  editing: { label: '剪辑中', variant: 'primary' as const },
  published: { label: '已发布', variant: 'success' as const },
};

const platformLabels = {
  douyin: '抖音',
  xiaohongshu: '小红书',
  shipinhao: '视频号',
  other: '其他',
};

function formatNumber(num?: number) {
  if (!num) return '0';
  if (num >= 10000) return `${(num / 10000).toFixed(1)}w`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
}

interface ContentCardProps {
  content: Content;
}

export default function ContentCard({ content }: ContentCardProps) {
  const status = statusConfig[content.status];

  return (
    <Card hover className="overflow-hidden">
      <div
        className="h-40 relative flex items-center justify-center"
        style={{ backgroundColor: content.coverColor }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="relative z-10 w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
          <Play className="w-6 h-6 text-white ml-1" fill="white" />
        </div>
        <div className="absolute top-3 left-3 flex gap-2">
          <Tag variant="default" size="sm" className="bg-white/90 text-gray-700">
            {platformLabels[content.platform]}
          </Tag>
          <Tag variant={status.variant} size="sm">{status.label}</Tag>
        </div>
        {content.status !== 'published' && (
          <div className="absolute top-3 right-3">
            <button className="p-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors">
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-gray-800 text-sm leading-snug flex-1 line-clamp-2 pr-2">
            {content.title}
          </h4>
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-400 mb-3">
          {content.topic}
          {content.publishDate && ` · ${content.publishDate}`}
        </p>
        {content.status === 'published' && content.views !== undefined && (
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {formatNumber(content.views)}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" />
              {formatNumber(content.likes)}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" />
              {formatNumber(content.comments)}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
