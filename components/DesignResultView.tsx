import React, { useState, useEffect } from 'react';
import { DesignResult, DesignStage } from '../types';
import { Palette, Layers, CheckCircle, RefreshCw, Type, MousePointer2, Lightbulb, Image as ImageIcon } from 'lucide-react';

interface Props {
  result: DesignResult;
  projectName: string;
  onRefine: (modifiedStages: DesignStage[]) => void;
  onGenerateVisuals: (finalStages: DesignStage[]) => void;
  isRefining: boolean;
}

const DesignResultView: React.FC<Props> = ({ result, projectName, onRefine, onGenerateVisuals, isRefining }) => {
  const [stages, setStages] = useState<DesignStage[]>(result.stages);

  // Sync stages if result changes externally
  useEffect(() => {
    setStages(result.stages);
  }, [result]);

  const handleStageChange = (index: number, field: 'logic' | 'visuals', value: string) => {
    const newStages = [...stages];
    newStages[index] = { ...newStages[index], [field]: value };
    setStages(newStages);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-32 animate-in fade-in duration-700">
      
      {/* Visual DNA Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Palette className="w-5 h-5 text-pink-500" />
          <h2 className="text-lg font-bold text-slate-900">视觉 DNA 规范</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <Type className="w-3 h-3" /> 排版 (Typography)
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{result.visualDNA.typography}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
               <MousePointer2 className="w-3 h-3" /> 控件 (Controls)
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{result.visualDNA.controls}</p>
          </div>
          <div className="space-y-2">
             <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
               <Lightbulb className="w-3 h-3" /> 氛围 (Lighting)
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{result.visualDNA.lighting}</p>
          </div>
        </div>
      </div>

      {/* Interactive Script / Flow */}
      <div className="space-y-6">
        <div className="flex items-center justify-between sticky top-0 bg-slate-50/95 backdrop-blur z-20 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2 text-blue-600">
            <Layers className="w-5 h-5" />
            <h2 className="text-lg font-bold text-slate-900">全链路交互脚本</h2>
          </div>
          
          <div className="flex gap-3">
             <button 
              onClick={() => onRefine(stages)}
              disabled={isRefining}
              className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-wait"
            >
              {isRefining ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  逻辑回检中...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  更新文本
                </>
              )}
            </button>
            
            <button 
              onClick={() => onGenerateVisuals(stages)}
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg shadow-slate-900/10 transition-all"
            >
              <ImageIcon className="w-4 h-4 text-emerald-400" />
              生成视觉原型脚本
            </button>
          </div>
        </div>

        <div className="relative border-l-2 border-slate-200 ml-6 space-y-12 py-4">
          {stages.map((stage, index) => (
            <div key={stage.stageNumber} className="relative pl-10 group">
              {/* Timeline Dot */}
              <div className="absolute -left-[9px] top-6 w-5 h-5 rounded-full bg-white border-4 border-slate-300 group-hover:border-blue-500 transition-colors shadow-sm"></div>
              
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 group-focus-within:ring-2 group-focus-within:ring-blue-500/20 group-focus-within:border-blue-500 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-slate-900 flex items-center gap-3">
                    <span className="text-slate-400 font-mono text-sm">STAGE {stage.stageNumber}</span>
                    {stage.stageName}
                  </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Logic Editor */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-blue-600 uppercase tracking-wider block">交互逻辑</label>
                    <textarea
                      value={stage.logic}
                      onChange={(e) => handleStageChange(index, 'logic', e.target.value)}
                      className="w-full h-auto min-h-[160px] bg-slate-50 border-0 rounded-lg p-3 text-sm text-slate-700 leading-relaxed focus:ring-1 focus:ring-blue-500 focus:bg-white transition-colors resize-none"
                    />
                  </div>

                  {/* Visuals Editor */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-pink-600 uppercase tracking-wider block">视觉呈现</label>
                    <textarea
                      value={stage.visuals}
                      onChange={(e) => handleStageChange(index, 'visuals', e.target.value)}
                      className="w-full h-auto min-h-[160px] bg-slate-50 border-0 rounded-lg p-3 text-sm text-slate-700 leading-relaxed focus:ring-1 focus:ring-pink-500 focus:bg-white transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DesignResultView;