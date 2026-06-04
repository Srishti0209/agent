import { tools } from "./src/agent/tools";
export interface AgentCallbacks {
    onToken: (token: string) => void;
    onToolCallStart: (name: string, args: unknown) => void;
    onToolCallEnd: (name: string, result: string) => void;
    onComplete: (response: string) => void;
    onToolApproval: (name: string, args: unknown) => Promise<boolean>;
    onTokenUsage?: (usage: TokenUsageInfo) => void;
}
export interface TokenUsageInfo {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    contextWindow: number;
    threshold: number;
    percentage: number;
}
export type Toolname = keyof typeof tools;
