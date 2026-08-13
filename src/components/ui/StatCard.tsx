import type { ReactNode } from 'react';
import { clsx } from 'clsx';
import Card from './Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: number;
  trendLabel?: string;
  color?: 'primary' | 'success' | 'warning' | 'info';
  className?: string;
}

const colorMap = {
  primary: {
    bg: 'bg-primary-50',
    icon: 'text-primary-500',
    trend: 'text-success-500',
  },
  success: {
    bg: 'bg-success-50',
    icon: 'text-success-500',
    trend: 'text-success-500',
  },
  warning: {
    bg: 'bg-warning-50',
    icon: 'text-warning-500',
    trend: 'text-warning-500',
  },
  info: {
    bg: 'bg-blue-50',
    icon: 'text-blue-500',
    trend: 'text-blue-500',
  },
};

export default function StatCard({
  title,
  value,
  icon,
  trend,
  trendLabel,
  color = 'primary',
  className,
}: StatCardProps) {
  const colors = colorMap[color];

  return (
    <Card hover className={clsx('p-5', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {trend >= 0 ? (
                <TrendingUp className="w-4 h-4 text-success-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={clsx(
                'text-xs font-medium',
                trend >= 0 ? 'text-success-600' : 'text-red-500'
              )}>
                {trend >= 0 ? '+' : ''}{trend}%
              </span>
              {trendLabel && (
                <span className="text-xs text-gray-400">{trendLabel}</span>
              )}
            </div>
          )}
        </div>
        <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center', colors.bg)}>
          <div className={colors.icon}>{icon}</div>
        </div>
      </div>
    </Card>
  );
}
