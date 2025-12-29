import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ProjectInput, AnalysisResult, DesignResult, DesignStage, VisualResult } from "../types";
import { ANALYST_SYSTEM_PROMPT, DESIGNER_SYSTEM_PROMPT, NANO_PRO_SYSTEM_PROMPT } from "../constants";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Schema for Step 0: Idea Parsing
const projectInputSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    projectName: { type: Type.STRING },
    coreGoal: { type: Type.STRING },
    targetAudience: { type: Type.STRING },
    cycle: { type: Type.STRING },
    coreMetaphor: { type: Type.STRING },
    keyActions: { type: Type.STRING },
    moodKeywords: { type: Type.STRING },
    wildIdeas: { type: Type.STRING, description: "从想法中推断出的创意或具体实现细节" },
  },
  required: ["projectName", "coreGoal", "coreMetaphor", "moodKeywords"]
};

// Schema for Step 1: Analysis
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    anchors: {
      type: Type.OBJECT,
      properties: {
        identity: { type: Type.STRING, description: "项目名称和潜在的标语/身份" },
        background: { type: Type.STRING, description: "时间背景和目标受众摘要" },
        coreNeed: { type: Type.STRING, description: "核心隐喻和基本元素" }
      },
      required: ["identity", "background", "coreNeed"]
    },
    risks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, enum: ['Time-State', 'Feedback Loop', 'Navigation', 'Redundancy'] },
          risk: { type: Type.STRING, description: "识别出的潜在逻辑缺陷 (中文)" },
          solution: { type: Type.STRING, description: "修复缺陷的架构方案 (中文)" }
        },
        required: ["category", "risk", "solution"]
      }
    },
    rawAnalysis: { type: Type.STRING, description: "分析简述 (中文)" }
  },
  required: ["anchors", "risks", "rawAnalysis"]
};

// Schema for Step 2: Design & Refinement
const designSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    visualDNA: {
      type: Type.OBJECT,
      properties: {
        typography: { type: Type.STRING, description: "中文描述" },
        controls: { type: Type.STRING, description: "中文描述" },
        lighting: { type: Type.STRING, description: "中文描述" }
      },
      required: ["typography", "controls", "lighting"]
    },
    stages: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          stageNumber: { type: Type.INTEGER },
          stageName: { type: Type.STRING, description: "阶段名称 (中文)" },
          logic: { type: Type.STRING, description: "交互逻辑和状态处理 (中文)" },
          visuals: { type: Type.STRING, description: "视觉描述 (中文)" }
        },
        required: ["stageNumber", "stageName", "logic", "visuals"]
      }
    }
  },
  required: ["visualDNA", "stages"]
};

// Schema for Step 3: Visual Prompts (Nano Pro)
const visualResultSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    keyframes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          stepName: { type: Type.STRING },
          logicPurpose: { type: Type.STRING, description: "逻辑与目的描述" },
          nanoPrompt: { type: Type.STRING, description: "Nano Pro 风格的绘图提示词" }
        },
        required: ["stepName", "logicPurpose", "nanoPrompt"]
      }
    }
  },
  required: ["keyframes"]
};

export const parseRoughIdea = async (idea: string): Promise<ProjectInput> => {
  if (!apiKey) throw new Error("API Key missing");

  const prompt = `
    你是一位专家创意总监。
    将这个粗略的项目想法转化为结构化的创意简报 (中文)。
    根据上下文创造性地推断缺失的细节。
    
    用户想法: "${idea}"
    
    要求:
    - 推断一个朗朗上口的 "projectName" (项目名称)。
    - 确定 "coreMetaphor" (核心隐喻，对视觉设计至关重要)。
    - 提取 "moodKeywords" (情绪关键词)。
    - 如果缺少细节，请根据现代交互式 Web 体验的标准，产生合理且高质量的默认值。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: projectInputSchema,
        thinkingConfig: { thinkingBudget: 1024 }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    return JSON.parse(text) as ProjectInput;
  } catch (error) {
    console.error("Idea parsing failed", error);
    throw error;
  }
};

export const analyzeRequirements = async (input: ProjectInput): Promise<AnalysisResult> => {
  if (!apiKey) throw new Error("API Key missing");

  const prompt = `
    分析此项目输入 (请用中文输出分析结果):
    项目: ${input.projectName}
    目标: ${input.coreGoal}
    受众: ${input.targetAudience}
    周期: ${input.cycle}
    隐喻: ${input.coreMetaphor}
    动作: ${input.keyActions}
    情绪: ${input.moodKeywords}
    狂野想法: ${input.wildIdeas}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: ANALYST_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        thinkingConfig: { thinkingBudget: 2048 } // Use thinking for deep logic analysis
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Analysis failed", error);
    throw error;
  }
};

export const generateDesignSpecs = async (
  input: ProjectInput, 
  analysis: AnalysisResult
): Promise<DesignResult> => {
  if (!apiKey) throw new Error("API Key missing");

  const prompt = `
    基于这些已批准的锚点生成高保真设计规范 (全中文输出):
    
    [语境]
    项目: ${input.projectName}
    隐喻: ${input.coreMetaphor}
    情绪: ${input.moodKeywords}
    
    [锚点]
    身份: ${analysis.anchors.identity}
    背景: ${analysis.anchors.background}
    核心需求: ${analysis.anchors.coreNeed}
    
    [逻辑风险与解决方案 (必须在流程中实现)]
    ${analysis.risks.map(r => `- ${r.category}: ${r.solution}`).join('\n')}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: DESIGNER_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: designSchema,
        thinkingConfig: { thinkingBudget: 4096 } // Higher budget for creative design generation
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    return JSON.parse(text) as DesignResult;
  } catch (error) {
    console.error("Design generation failed", error);
    throw error;
  }
};

export const refineDesignSpecs = async (
  input: ProjectInput,
  analysis: AnalysisResult,
  modifiedStages: DesignStage[]
): Promise<DesignResult> => {
  if (!apiKey) throw new Error("API Key missing");

  const prompt = `
    用户已经手动修改了设计流程的草稿。
    请作为一位资深的逻辑架构师，重新审查用户修改后的流程。
    
    [任务]
    1. 尊重用户的修改意图（不要随意覆盖用户的创意）。
    2. 执行“逻辑回检”：检查修改后的流程是否引入了新的逻辑漏洞（基于原始的风险分析）。
    3. 润色文案：使交互逻辑更严密，视觉描述更具画面感。
    4. 重新生成完整的 DesignResult 对象。

    [原始语境]
    项目: ${input.projectName}
    核心隐喻: ${input.coreMetaphor}

    [原始风险清单]
    ${analysis.risks.map(r => `- ${r.category}: ${r.solution}`).join('\n')}

    [用户修改后的流程草稿]
    ${JSON.stringify(modifiedStages, null, 2)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: DESIGNER_SYSTEM_PROMPT, // Re-use designer persona
        responseMimeType: "application/json",
        responseSchema: designSchema,
        thinkingConfig: { thinkingBudget: 4096 }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    return JSON.parse(text) as DesignResult;
  } catch (error) {
    console.error("Refinement failed", error);
    throw error;
  }
};

export const generateVisualPrompts = async (
  input: ProjectInput,
  designResult: DesignResult
): Promise<VisualResult> => {
  if (!apiKey) throw new Error("API Key missing");

  const prompt = `
    请接收我的【交互方案】，并将其转化为 8 段 Nano Pro 极简黑白交互原型视觉指令。
    
    [项目背景]
    项目名称: ${input.projectName}
    核心隐喻: ${input.coreMetaphor}

    [交互方案 (由交互设计师提供)]
    ${JSON.stringify(designResult.stages, null, 2)}
    
    [任务]
    1. 为这 8 个阶段生成对应的 Nano Pro Prompt。
    2. 严格遵循 System Prompt 中的“黑白灰层级美学”和“交互逻辑显性化”规则。
    3. 确保输出为 JSON 格式。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: NANO_PRO_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: visualResultSchema,
        thinkingConfig: { thinkingBudget: 4096 }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    return JSON.parse(text) as VisualResult;
  } catch (error) {
    console.error("Visual Prompt generation failed", error);
    throw error;
  }
};