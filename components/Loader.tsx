import React from 'react';
import { Loader2 } from 'lucide-react';

interface Props {
  title: string;
  subtitle: string;
}

const Loader: React.FC<Props> = ({ title, subtitle }) => {
  return (
    <div className="flex flex-col items-center justify-center py-40 space-y-6 animate-in fade-in duration-500">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-100 blur-xl opacity-50 animate-pulse rounded-full"></div>
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin relative z-10" />
      </div>
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <p className="text-slate-500 text-sm">{subtitle}</p>
      </div>
    </div>
  );
};

export default Loader;