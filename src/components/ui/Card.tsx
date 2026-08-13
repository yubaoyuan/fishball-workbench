import { clsx } from 'clsx';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className, hover = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white rounded-2xl shadow-card border border-warm-100',
        hover && 'hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer transition-all duration-200',
        className
      )}
    >
      {children}
    </div>
  );
}
