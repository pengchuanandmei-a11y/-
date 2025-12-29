import React from 'react';
import { VisualResult } from '../types';
import { ArrowLeft, Copy, Image as ImageIcon, Terminal } from 'lucide-react';

interface Props {
  result: VisualResult;
  projectName: string;
  onBack: () => void;
}

const VisualResultView: React.FC<Props> = ({ result, projectName, onBack }) => {

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app, toast notification here
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-32 animate-in fade-in duration-700">
      
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{projectName}</h1>
          <p className="text-slate-500 mt-2 flex items-center gap-2">
            <span className="bg-slate-900 text-white text-xs px-2 py-0.5 rounded font-mono">NANO PRO</span>
            极简交互原型视觉指令
          </p>
        </div>
        <button onClick={onBack} className="text-slate-500 hover:text-slate-800 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-4 h-4" /> 返回脚本编辑
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {result.keyframes.map((frame, index) => (
          <div key={index} className="flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
            
            {/* Mock Image Placeholder / Header */}
            <div className="aspect-[4/5] bg-slate-100 border-b border-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
               <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:16px_16px]"></div>
               <div className="z-10 text-center">
                 <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3 group-hover:text-slate-400 transition-colors" />
                 <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block">Nano Pro Sketch</span>
                 <span className="text-xs font-bold text-slate-900 mt-1 block">{frame.stepName}</span>
               </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col gap-4">
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-mono font-bold">{index + 1}</span>
                  <h3 className="font-bold text-slate-900 text-sm">{frame.stepName}</h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed border-l-2 border-slate-200 pl-2">
                  {frame.logicPurpose}
                </p>
              </div>

              <div className="flex-1 bg-slate-50 rounded-lg p-3 border border-slate-200 relative group/code">
                <div className="absolute top-2 right-2 opacity-0 group-hover/code:opacity-100 transition-opacity">
                  <button 
                    onClick={() => copyToClipboard(frame.nanoPrompt)}
                    className="p-1.5 bg-white border border-slate-200 rounded hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                    title="复制 Prompt"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 mb-2">
                  <Terminal className="w-3 h-3" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Prompt</span>
                </div>
                <p className="text-[11px] text-slate-700 font-mono leading-relaxed line-clamp-6 hover:line-clamp-none transition-all">
                  {frame.nanoPrompt}
                </p>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisualResultView;