import React from 'react';
import { Info, AlertTriangle, Lightbulb, CheckCircle2, Award, Zap } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Badge } from '../badges/Badge';

export type CalloutVariant = 'info' | 'warning' | 'tip' | 'success' | 'expert' | 'sponsored';

export interface CalloutCardProps {
  variant: CalloutVariant;
  title?: string;
  content: string | React.ReactNode;
  className?: string;
}

export const CalloutCard: React.FC<CalloutCardProps> = ({
  variant,
  title,
  content,
  className
}) => {
  const configs: Record<CalloutVariant, { bg: string; border: string; text: string; iconText: string; icon: React.ReactNode; badgeLabel: string; badgeVariant: "default" | "outline" | "red" | "orange" | "blue" | "purple" | "green" | "gray" }> = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      text: 'text-blue-900',
      iconText: 'text-blue-500',
      icon: <Info className="w-5 h-5" />,
      badgeLabel: 'Information',
      badgeVariant: 'blue'
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-900',
      iconText: 'text-amber-600',
      icon: <AlertTriangle className="w-5 h-5" />,
      badgeLabel: 'Important',
      badgeVariant: 'orange'
    },
    tip: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-100',
      text: 'text-indigo-900',
      iconText: 'text-indigo-500',
      icon: <Lightbulb className="w-5 h-5" />,
      badgeLabel: 'Pro Tip',
      badgeVariant: 'purple'
    },
    success: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      text: 'text-emerald-900',
      iconText: 'text-emerald-600',
      icon: <CheckCircle2 className="w-5 h-5" />,
      badgeLabel: 'Success',
      badgeVariant: 'green'
    },
    expert: {
      bg: 'bg-slate-900',
      border: 'border-slate-800',
      text: 'text-slate-100',
      iconText: 'text-slate-400',
      icon: <Award className="w-5 h-5" />,
      badgeLabel: 'Expert Note',
      badgeVariant: 'gray'
    },
    sponsored: {
      bg: 'bg-[#FF5B00]/10',
      border: 'border-[#FF5B00]/20',
      text: 'text-slate-900',
      iconText: 'text-[#FF5B00]',
      icon: <Zap className="w-5 h-5" />,
      badgeLabel: 'Sponsored',
      badgeVariant: 'orange'
    }
  };

  const config = configs[variant];

  return (
    <div className={cn("rounded-2xl p-6 border flex gap-4 items-start", config.bg, config.border, className)}>
      <div className={cn("shrink-0 mt-0.5", config.iconText)}>
        {config.icon}
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2 mb-1">
          {title && (
            <h4 className={cn("font-bold text-base", config.text)}>{title}</h4>
          )}
          {!title && (
            <Badge variant={config.badgeVariant} className={cn(variant === 'expert' && 'bg-slate-700 text-white border-transparent')}>{config.badgeLabel}</Badge>
          )}
        </div>
        <div className={cn("text-sm font-medium leading-relaxed", config.text, variant === 'expert' ? 'text-slate-300' : '')}>
          {content}
        </div>
      </div>
    </div>
  );
};
