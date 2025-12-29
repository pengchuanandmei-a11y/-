import React, { useState } from 'react';
import { AnalysisResult, LogicRisk } from '../types';
import { ShieldAlert, ArrowRight, Anchor, Edit2, Save, CheckCircle2 } from 'lucide-react';

interface Props {
  analysis: AnalysisResult;
  onConfirm: (data: AnalysisResult) => void;
  isGenerating: boolean;
}

const AnalysisView: React.FC<Props> = ({ analysis, onConfirm, isGenerating }) => {
  const [data, setData] = useState<AnalysisResult>(analysis);
  const [editingRisk, setEditingRisk] = useState<number | null>(null);

  const handleAnchorChange = (field: keyof typeof analysis.anchors, value: string) => {
    setData({
      ...data,
      anchors: { ...data.anchors, [field]: value }
    });
  };

  const handleRiskChange = (index: number, field: keyof LogicRisk, value: string) => {
    const newRisks = [...data.risks];
    newRisks[index] = { ...newRisks[index], [field]: value };
    setData({ ...data, risks: newRisks });
  };

  const getRiskCategoryLabel = (category: string) => {
    switch(category) {
      case 'Time-State': return '时态逻辑';
      case 'Feedback Loop': return '反馈循环';
      case 'Navigation': return '导航拓扑';
      case 'Redundancy': return '冗余检查';
      default: return category;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">逻辑压力测试</h1>
          <p className="text-slate-500 mt-1">AI 架构师已识别潜在风险，请确认以下锚点与解决方案。</p>
        </div>
      </div>

      {/* Anchors Section */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
          <Anchor className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold text-slate-900">需求锚点提取</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">项目身份</label>
            <textarea
              value={data.anchors.identity}
              onChange={(e) => handleAnchorChange('identity', e.target.value)}
              className="w-full bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm text-slate-800 focus:border-blue-500 focus:bg-white outline-none h-24 resize-none transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">背景语境</label>
            <textarea
              value={data.anchors.background}
              onChange={(e) => handleAnchorChange('background', e.target.value)}
              className="w-full bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm text-slate-800 focus:border-blue-500 focus:bg-white outline-none h-24 resize-none transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">核心需求</label>
            <textarea
              value={data.anchors.coreNeed}
              onChange={(e) => handleAnchorChange('coreNeed', e.target.value)}
              className="w-full bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm text-slate-800 focus:border-blue-500 focus:bg-white outline-none h-24 resize-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Risks Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-bold text-slate-900">逻辑风险评估</h3>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {data.risks.map((risk, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all group relative">
              <div className="flex justify-between items-start mb-3">
                <span className={`text-xs font-bold px-2 py-1 rounded-md bg-slate-100 ${
                  risk.category === 'Time-State' ? 'text-blue-600 bg-blue-50' :
                  risk.category === 'Feedback Loop' ? 'text-emerald-600 bg-emerald-50' :
                  risk.category === 'Navigation' ? 'text-purple-600 bg-purple-50' : 'text-amber-600 bg-amber-50'
                }`}>
                  {getRiskCategoryLabel(risk.category)}
                </span>
                <button 
                  onClick={() => setEditingRisk(editingRisk === idx ? null : idx)}
                  className="text-slate-400 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  {editingRisk === idx ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                </button>
              </div>

              {editingRisk === idx ? (
                <div className="space-y-3">
                   <div>
                    <label className="text-xs text-slate-500 font-medium">识别风险</label>
                    <input 
                      value={risk.risk}
                      onChange={(e) => handleRiskChange(idx, 'risk', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-sm text-slate-700"
                    />
                   </div>
                   <div>
                    <label className="text-xs text-slate-500 font-medium">解决方案</label>
                    <textarea 
                      value={risk.solution}
                      onChange={(e) => handleRiskChange(idx, 'solution', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-sm text-emerald-700 h-20"
                    />
                   </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-red-50/50 p-3 rounded-lg border border-red-100">
                    <p className="text-xs text-red-400 font-bold mb-1">RISK</p>
                    <p className="text-sm font-medium text-slate-700">{risk.risk}</p>
                  </div>
                  <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                    <p className="text-xs text-emerald-500 font-bold mb-1">SOLUTION</p>
                    <p className="text-sm font-medium text-slate-700">{risk.solution}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-slate-200">
        <button
          onClick={() => onConfirm(data)}
          disabled={isGenerating}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-wait"
        >
          {isGenerating ? '生成设计中...' : '确认架构并生成原型'}
          {!isGenerating && <ArrowRight className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

export default AnalysisView;