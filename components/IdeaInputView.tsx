import React, { useState } from 'react';
import { Sparkles, ArrowRight, Lightbulb } from 'lucide-react';

interface Props {
  onSubmit: (idea: string) => void;
  onSkip: () => void;
}

const IdeaInputView: React.FC<Props> = ({ onSubmit, onSkip }) => {
  const [idea, setIdea] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idea.trim()) onSubmit(idea);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[80vh] animate-in fade-in zoom-in duration-500">
      <div className="text-center mb-10 space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 mb-4 shadow-sm border border-blue-100">
          <Lightbulb className="w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
          今天我们要构建什么？
        </h1>
        <p className="text-xl text-slate-500 max-w-xl mx-auto font-light">
          用自然语言描述你的想法。AI 将帮你梳理需求并规划逻辑流程。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl relative group">
        <div className="relative">
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="例如：一个赛博朋克主题的音乐节投票 App，用户可以通过摇晃手机来进行投票..."
            className="w-full h-48 bg-white border border-slate-200 rounded-2xl p-6 text-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none shadow-xl shadow-slate-200/50 transition-all"
          />
          <div className="absolute bottom-4 right-4 flex gap-3">
             <button
              type="button"
              onClick={onSkip}
              className="px-4 py-2 text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              跳过，手动录入
            </button>
            <button
              type="submit"
              disabled={!idea.trim()}
              className="bg-slate-900 text-white px-6 py-2 rounded-xl font-medium hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-slate-900/20"
            >
              <Sparkles className="w-4 h-4 text-blue-300" />
              分析创意
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default IdeaInputView;