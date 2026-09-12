import React from 'react';
import { InquiryStatus } from '../../types/tradeFlow';
import { Clock, CheckCircle2, MessageSquare, AlertCircle, XCircle, ShieldCheck } from 'lucide-react';

interface StatusBadgeProps {
  status: InquiryStatus | 'Confirmed' | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
}) => {
  let colorClasses = 'bg-stone-100 text-stone-700 border-stone-300';
  let icon = <Clock className="w-3.5 h-3.5" />;
  let label = status;

  switch (status) {
    case 'Pending':
      colorClasses = 'bg-amber-50 text-amber-900 border-amber-300';
      icon = <Clock className="w-3.5 h-3.5 text-amber-700" />;
      label = 'Pending Quotation';
      break;
    case 'Quotation Received':
      colorClasses = 'bg-sky-50 text-sky-900 border-sky-300';
      icon = <MessageSquare className="w-3.5 h-3.5 text-sky-700" />;
      label = 'Quotation Received';
      break;
    case 'Negotiating':
      colorClasses = 'bg-indigo-50 text-indigo-900 border-indigo-300';
      icon = <AlertCircle className="w-3.5 h-3.5 text-indigo-700" />;
      label = 'Negotiation Active';
      break;
    case 'Accepted':
      colorClasses = 'bg-emerald-50 text-emerald-900 border-emerald-300';
      icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />;
      label = 'Quotation Accepted';
      break;
    case 'Order Confirmed':
    case 'Confirmed':
      colorClasses = 'bg-emerald-100 text-emerald-950 border-emerald-400 font-bold';
      icon = <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />;
      label = 'Order Confirmed 🔒';
      break;
    case 'Rejected':
      colorClasses = 'bg-rose-50 text-rose-900 border-rose-300';
      icon = <XCircle className="w-3.5 h-3.5 text-rose-700" />;
      label = 'Rejected';
      break;
  }

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${sizeClasses} ${colorClasses} tracking-tight`}
    >
      {showIcon && icon}
      <span>{label}</span>
    </span>
  );
};
