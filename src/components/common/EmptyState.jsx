import React from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  Navigation, 
  Users, 
  BarChart3, 
  Plus, 
  Upload, 
  ShieldCheck, 
  Compass,
  FileText
} from 'lucide-react';

export default function EmptyState({ 
  type = 'incidents', 
  title = null, 
  description = null, 
  onAction = null, 
  actionLabel = null,
  onSecondaryAction = null,
  secondaryActionLabel = null 
}) {
  const configs = {
    incidents: {
      icon: MapPin,
      defaultTitle: 'Roads are quiet here',
      defaultDesc: 'No traffic incidents or obstructions have been recorded yet. Add your first report or import a CSV dataset to initiate traffic intelligence.',
      defaultAction: '+ Report First Hazard',
      iconColor: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10 border-cyan-500/20'
    },
    journeys: {
      icon: Navigation,
      defaultTitle: 'Your journey history will appear here',
      defaultDesc: 'No active or completed commute journeys logged yet. Plan a route to start your first live commute tracking session.',
      defaultAction: 'Plan a Route',
      iconColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20'
    },
    employees: {
      icon: Users,
      defaultTitle: 'No employees added yet',
      defaultDesc: 'No employee commute records in the roster. Add an employee or upload a department CSV to begin consented commute delay monitoring.',
      defaultAction: '+ Add Employee',
      iconColor: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/20'
    },
    analytics: {
      icon: BarChart3,
      defaultTitle: 'Analytics will populate as data is added',
      defaultDesc: 'Historical trends, hourly peak curves, and recurring bottleneck charts will generate automatically from your stored or imported records.',
      defaultAction: 'Import Incident Data',
      iconColor: 'text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/20'
    },
    hotspots: {
      icon: AlertTriangle,
      defaultTitle: 'No recurring traffic hotspots identified',
      defaultDesc: 'Hotspot clustering and municipal audit dossiers require multiple incident reports on the same corridor axis.',
      defaultAction: 'Add Incident Records',
      iconColor: 'text-red-400',
      bgColor: 'bg-red-500/10 border-red-500/20'
    },
    alerts: {
      icon: ShieldCheck,
      defaultTitle: 'All routes clear',
      defaultDesc: 'Zero active road hazards affecting transit corridors in the current dataset.',
      defaultAction: 'View Map',
      iconColor: 'text-teal-400',
      bgColor: 'bg-teal-500/10 border-teal-500/20'
    }
  };

  const cfg = configs[type] || configs.incidents;
  const Icon = cfg.icon;

  return (
    <div className="p-8 sm:p-12 text-center rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm max-w-lg mx-auto space-y-5 my-6">
      <div className={`w-16 h-16 mx-auto rounded-2xl border flex items-center justify-center ${cfg.bgColor}`}>
        <Icon className={`w-8 h-8 ${cfg.iconColor}`} />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-black text-white tracking-tight">
          {title || cfg.defaultTitle}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
          {description || cfg.defaultDesc}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        {onAction && (
          <button
            onClick={onAction}
            className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5"
          >
            <span>{actionLabel || cfg.defaultAction}</span>
          </button>
        )}

        {onSecondaryAction && (
          <button
            onClick={onSecondaryAction}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-colors border border-slate-700 flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>{secondaryActionLabel || 'Import CSV Data'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
