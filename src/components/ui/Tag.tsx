import { clsx } from 'clsx';
import type { ReactNode } from 'react';

type TagVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
type TagSize = 'sm' | 'md';

interface TagProps {
  children: ReactNode;
  variant?: TagVariant;
  size?: TagSize;
  className?: string;
}

const variantStyles: Record<TagVariant, string> = {
  default: 'bg-gray-100 text-gray-600',
  primary: 'bg-primary-100 text-primary-700',
  success: 'bg-success-100 text-success-700',
  warning: 'bg-warning-100 text-warning-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
};

const sizeStyles: Record<TagSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
};

export default function Tag({ children, variant = 'default', size = 'md', className }: TagProps) {
  return (
    <span className={clsx(
      'inline-flex items-center rounded-full font-medium',
      variantStyles[variant],
      sizeStyles[size],
      className
    )}>
      {children}
    </span>
  );
}
