export interface ProjectInput {
  projectName: string;
  coreGoal: string;
  targetAudience: string;
  cycle: string;
  coreMetaphor: string;
  keyActions: string;
  moodKeywords: string;
  wildIdeas: string;
}

export interface LogicRisk {
  category: 'Time-State' | 'Feedback Loop' | 'Navigation' | 'Redundancy';
  risk: string;
  solution: string;
}

export interface AnalysisResult {
  anchors: {
    identity: string;
    background: string;
    coreNeed: string;
  };
  risks: LogicRisk[];
  rawAnalysis: string;
}

export interface DesignStage {
  stageName: string;
  stageNumber: number;
  logic: string;
  visuals: string;
}

export interface DesignResult {
  visualDNA: {
    typography: string;
    controls: string;
    lighting: string;
  };
  stages: DesignStage[];
}

export interface VisualKeyframe {
  stepName: string;
  logicPurpose: string;
  nanoPrompt: string;
}

export interface VisualResult {
  keyframes: VisualKeyframe[];
}

export enum AppStep {
  IDEA = 0,
  PARSING_IDEA = 1,
  INPUT = 2,
  ANALYZING = 3,
  ADJUSTMENT = 4,
  DESIGNING = 5,
  REFINING = 6,
  RESULT = 7,
  VISUALIZING = 8,
  VISUAL_RESULT = 9
}