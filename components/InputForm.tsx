import React, { useState, useEffect } from 'react';
import { ProjectInput } from '../types';
import { Sparkles, Layers, Box, Zap, Heart } from 'lucide-react';

interface Props {
  initialData: ProjectInput;
  onSubmit: (data: ProjectInput) => void;
  isAnalyzing: boolean;
}

const InputForm: React.FC<Props> = ({ initialData, onSubmit, isAnalyzing }) => {
  const [data, setData] = useState<ProjectInput>(initialData);

  // Sync state if initialData changes (e.g. from AI parsing)
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(data);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 custom-scrollbar">
        
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-slate-900">项目参数</h2>
          <p className="text-sm text-slate-500 mt-1">配置核心需求与视觉锚点</p>
        </div>

        <form id="project-form" onSubmit={handleSubmit} className="space-y-8">
          
          {/* Group 1: Identity */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Box className="w-4 h-4 text-blue-600" />
              <span>基础信息</span>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-2">项目名称</label>
                <textarea
                  required
                  rows={2}
                  name="projectName"
                  value={data.projectName}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-2">活动周期</label>
                <textarea
                  rows={3}
                  name="cycle"
                  value={data.cycle}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-2">目标受众</label>
                <textarea
                  rows={3}
                  name="targetAudience"
                  value={data.targetAudience}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100"></div>

          {/* Group 2: Core Logic */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Zap className="w-4 h-4 text-purple-600" />
              <span>核心逻辑</span>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-2">核心目标</label>
                <textarea
                  required
                  rows={5}
                  name="coreGoal"
                  value={data.coreGoal}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all resize-none"
                />
              </div>
               <div>
                <label className="block text-xs font-medium text-slate-500 mb-2">关键动作</label>
                <textarea
                  rows={3}
                  name="keyActions"
                  value={data.keyActions}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100"></div>

          {/* Group 3: Visuals */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Heart className="w-4 h-4 text-pink-600" />
              <span>视觉与情绪</span>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-2">核心隐喻 (Metaphor)</label>
                <textarea
                  required
                  rows={3}
                  name="coreMetaphor"
                  value={data.coreMetaphor}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-900 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-2">情绪关键词</label>
                <textarea
                  rows={2}
                  name="moodKeywords"
                  value={data.moodKeywords}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-900 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-2">狂野想法</label>
                <textarea
                  rows={5}
                  name="wildIdeas"
                  value={data.wildIdeas}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-900 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-slate-100 bg-white">
        <button
          form="project-form"
          type="submit"
          disabled={isAnalyzing}
          className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait transition-all"
        >
          {isAnalyzing ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              分析中...
            </span>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              生成逻辑架构
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputForm;