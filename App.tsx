import React, { useState } from 'react';
import { ProjectInput, AnalysisResult, DesignResult, DesignStage, VisualResult, AppStep } from './types';
import { INITIAL_FORM_DATA } from './constants';
import { analyzeRequirements, generateDesignSpecs, parseRoughIdea, refineDesignSpecs, generateVisualPrompts } from './services/geminiService';
import { BrainCircuit, AlertTriangle, ArrowLeft } from 'lucide-react';

// Components
import InputForm from './components/InputForm';
import AnalysisView from './components/AnalysisView';
import DesignResultView from './components/DesignResultView';
import VisualResultView from './components/VisualResultView';
import Loader from './components/Loader';
import IdeaInputView from './components/IdeaInputView';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.IDEA);
  const [formData, setFormData] = useState<ProjectInput>(INITIAL_FORM_DATA);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [designResult, setDesignResult] = useState<DesignResult | null>(null);
  const [visualResult, setVisualResult] = useState<VisualResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // --- Handlers ---
  const handleIdeaSubmit = async (idea: string) => {
    setStep(AppStep.PARSING_IDEA);
    setError(null);
    try {
      const parsedData = await parseRoughIdea(idea);
      setFormData(parsedData);
      setStep(AppStep.INPUT); // Move to Workspace
    } catch (e) {
      setError("无法解析创意，请尝试手动输入。");
      setStep(AppStep.INPUT);
    }
  };

  const handleInputSubmit = async (data: ProjectInput) => {
    setFormData(data);
    setStep(AppStep.ANALYZING);
    setError(null);
    try {
      const result = await analyzeRequirements(data);
      setAnalysisResult(result);
      setStep(AppStep.ADJUSTMENT);
    } catch (e) {
      setError("分析失败，请重试。");
      setStep(AppStep.INPUT);
    }
  };

  const handleAnalysisConfirm = async (updatedAnalysis: AnalysisResult) => {
    setAnalysisResult(updatedAnalysis);
    setStep(AppStep.DESIGNING);
    setError(null);
    try {
      const result = await generateDesignSpecs(formData, updatedAnalysis);
      setDesignResult(result);
      setStep(AppStep.RESULT);
    } catch (e) {
      setError("设计生成失败，请重试。");
      setStep(AppStep.ADJUSTMENT);
    }
  };

  const handleDesignRefinement = async (modifiedStages: DesignStage[]) => {
    if (!analysisResult) return;
    setStep(AppStep.REFINING);
    setError(null);
    try {
      const refinedResult = await refineDesignSpecs(formData, analysisResult, modifiedStages);
      setDesignResult(refinedResult);
      setStep(AppStep.RESULT);
    } catch (e) {
      setError("逻辑回检失败，请重试。");
      setStep(AppStep.RESULT);
    }
  };

  const handleGenerateVisuals = async (currentStages: DesignStage[]) => {
    // If user edited stages but didn't click "Refine", we use the current state passed from the component
    // We update the design result locally first to ensure coherence
    if (designResult) {
      const updatedDesign = { ...designResult, stages: currentStages };
      setDesignResult(updatedDesign);
      
      setStep(AppStep.VISUALIZING);
      setError(null);
      try {
        const visuals = await generateVisualPrompts(formData, updatedDesign);
        setVisualResult(visuals);
        setStep(AppStep.VISUAL_RESULT);
      } catch (e) {
        setError("视觉脚本生成失败，请重试。");
        setStep(AppStep.RESULT);
      }
    }
  };

  // --- Render Logic ---
  const isWorkspace = step > AppStep.IDEA && step !== AppStep.PARSING_IDEA;

  return (
    <div className="h-screen bg-slate-50 text-slate-900 flex flex-col font-sans overflow-hidden">
      
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex-shrink-0 z-50 px-6 flex items-center justify-between shadow-sm">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => { if(confirm("返回首页将丢失当前进度，确定吗？")) setStep(AppStep.IDEA); }}
        >
          <div className="bg-slate-900 p-1.5 rounded-lg">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900">
            Gemini Design <span className="text-blue-600">Architect</span>
          </span>
        </div>
        
        {isWorkspace && (
           <div className="flex items-center gap-2">
             <span className="text-xs font-mono px-2 py-1 bg-slate-100 rounded text-slate-500">
               {step === AppStep.INPUT && "STAGE 1: CONFIGURATION"}
               {step === AppStep.ANALYZING && "STAGE 2: ANALYSIS"}
               {step === AppStep.ADJUSTMENT && "STAGE 2: REVIEW"}
               {step === AppStep.DESIGNING && "STAGE 3: GENERATION"}
               {step === AppStep.REFINING && "STAGE 3: REFINEMENT"}
               {step === AppStep.RESULT && "STAGE 3: FINALIZATION"}
               {step === AppStep.VISUALIZING && "STAGE 4: VISUALIZING"}
               {step === AppStep.VISUAL_RESULT && "STAGE 4: PROTOTYPING"}
             </span>
           </div>
        )}
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Error Banner */}
        {error && (
          <div className="absolute top-20 right-6 z-50 p-4 bg-red-50 border border-red-200 rounded-xl shadow-lg flex items-center gap-3 text-red-600 animate-in slide-in-from-top-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium text-sm">{error}</span>
            <button onClick={() => setError(null)} className="ml-2 hover:bg-red-100 p-1 rounded">×</button>
          </div>
        )}

        {/* Step 0: Idea Input (Full Screen) */}
        {!isWorkspace && (
          <div className="w-full h-full overflow-y-auto bg-slate-50">
             {step === AppStep.PARSING_IDEA ? (
               <Loader title="正在构建工作区" subtitle="Gemini 正在理解您的创意并初始化项目参数..." />
             ) : (
               <IdeaInputView 
                  onSubmit={handleIdeaSubmit} 
                  onSkip={() => {
                    setFormData(INITIAL_FORM_DATA);
                    setStep(AppStep.INPUT);
                  }} 
                />
             )}
          </div>
        )}

        {/* Workspace: Split Layout */}
        {isWorkspace && (
          <>
            {/* Left Sidebar: Controls - Hide when in Visual Result Mode for full immersion */}
            {step !== AppStep.VISUAL_RESULT && (
              <aside className="w-[450px] border-r border-slate-200 bg-white flex flex-col shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] z-20">
                <InputForm 
                  initialData={formData} 
                  onSubmit={handleInputSubmit}
                  isAnalyzing={step === AppStep.ANALYZING}
                />
              </aside>
            )}

            {/* Right Main: Canvas / Output */}
            <section className="flex-1 bg-slate-50 overflow-y-auto relative custom-scrollbar p-8">
              <div className="max-w-6xl mx-auto h-full flex flex-col">
                
                {/* Empty State / Initial Loading */}
                {step === AppStep.INPUT && (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                    <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
                      <ArrowLeft className="w-8 h-8 opacity-20" />
                    </div>
                    <p>在左侧配置项目参数以开始</p>
                  </div>
                )}

                {/* Analysis Phase */}
                {step === AppStep.ANALYZING && (
                  <Loader title="逻辑压力测试中" subtitle="正在分析业务死角与交互闭环..." />
                )}

                {step === AppStep.ADJUSTMENT && analysisResult && (
                  <AnalysisView 
                    analysis={analysisResult} 
                    onConfirm={handleAnalysisConfirm}
                    isGenerating={false}
                  />
                )}

                 {/* Design Phase */}
                {step === AppStep.DESIGNING && (
                  <Loader title="生成交互脚本" subtitle="正在编排视觉 DNA 与用户旅程..." />
                )}

                {step === AppStep.REFINING && (
                  <Loader title="优化设计" subtitle="正在基于您的修改进行逻辑回检..." />
                )}

                {(step === AppStep.RESULT || step === AppStep.REFINING) && designResult && (
                  <DesignResultView 
                    result={designResult} 
                    projectName={formData.projectName}
                    onRefine={handleDesignRefinement}
                    onGenerateVisuals={handleGenerateVisuals}
                    isRefining={step === AppStep.REFINING}
                  />
                )}
                
                {/* Visual Phase */}
                {step === AppStep.VISUALIZING && (
                  <Loader title="构建 Nano 视觉原型" subtitle="正在将交互逻辑转化为 8 帧黑白极简指令..." />
                )}
                
                {step === AppStep.VISUAL_RESULT && visualResult && (
                  <VisualResultView 
                    result={visualResult}
                    projectName={formData.projectName}
                    onBack={() => setStep(AppStep.RESULT)}
                  />
                )}

              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default App;