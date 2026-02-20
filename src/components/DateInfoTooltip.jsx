
import React from 'react';
import { Info, Calendar, AlertTriangle, ShieldCheck, Wrench } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { format } from 'date-fns';

const DateInfoTooltip = ({ tech }) => {
  if (!tech) return null;

  const dates = [
    { 
      label: 'End of Life', 
      value: tech.eol_date, 
      icon: AlertTriangle,
      color: 'text-red-400'
    },
    { 
      label: 'End of Support', 
      value: tech.end_of_support_date, 
      icon: ShieldCheck,
      color: 'text-orange-400'
    },
    { 
      label: 'Maintenance Ends', 
      value: tech.end_of_maintenance_date, 
      icon: Wrench,
      color: 'text-yellow-400'
    }
  ].filter(item => item.value);

  if (dates.length === 0) return null;

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors bg-black/20 border border-white/5 group/info"
            aria-label="View lifecycle dates"
          >
            <Info className="w-4 h-4 text-blue-400 group-hover/info:text-blue-300 transition-colors" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-slate-900 border-slate-700 p-3 shadow-xl">
          <div className="space-y-3 min-w-[200px]">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <p className="font-semibold text-white text-sm">Lifecycle Dates</p>
            </div>
            <div className="space-y-2">
              {dates.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-2">
                    <item.icon className={`w-3 h-3 ${item.color}`} />
                    {item.label}
                  </span>
                  <span className="font-mono text-slate-200">{formatDate(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DateInfoTooltip;
