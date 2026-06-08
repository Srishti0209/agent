import type {
  EvalData,
  SingleTurnResult,
  MultiTurnEvalData,
  MultiTurnResult,
} from "./types.ts";
import {z} from 'zod';
import { buildMessages } from "./utils.ts";
import { generateText, stepCountIs, tool, ToolSet } from "ai";
import { openai } from "@ai-sdk/openai";

const TOOL_DEFINATIONS : any= {
  readFile:{
    description: 'Read the content of the given file at the specified path',
    parameters: z.object({
      path: z.string().describe('The path to the file that you want to read')
    })
  },
  writeFile: {
    description: 'Write given content to the file at the given specified path',
    parameters: z.object({
      path: z.string().describe('The path of the file that you want to read'),
      content: z.string().describe("The content you want to write to the file")
    })
  },
  listFiles:{
    description: 'List all the files in a directory', 
    parameters: z.object({
      path: z.string().describe('The path of the directory you want to list the files from'),
      
    })
  },
  deleteFile:{
    description: 'Delete the given file at the specified path',
    parameters: z.object({
      path: z.string().describe('The path to the file your want to delete'),
      
    })
  },
  runCommand: {
    description: "Execute the shell commmand and return its output",
    parameters: z.string().describe("The shell command to execute")
  }
}


export const singleTurnEvaluatorWithMocks = async(data: EvalData) =>{
  const messages = buildMessages(data);
  const tools : ToolSet = {};
  for(const toolName of data.tools){
    const defination = TOOL_DEFINATIONS[toolName as any];
    if(defination){
      tools[toolName] = tool({
        description: defination.description,
        inputSchema: defination.parameters
      })
    }

  }
  const {toolCalls} = await generateText({
    model: openai(data.config?.model ?? 'gpt-5-mini'),
    messages: messages,
    tools: tools,
    //because we are testing single turn eval
    stopWhen: stepCountIs(1),
    //undefined as base because we are using gpt-5-mini
    temperature: data.config?.temperature ?? undefined,
    providerOptions: {
      openai: {
        reasoningEffort : 'high'
      }
    }
  });

  const calls = toolCalls?.map((tc) => ({
    toolName: tc.toolName,
    args: "args" in tc ? tc.args : {}
  }));

  const toolNames = toolCalls?.map((tc) => tc.toolName);

  return {
    toolCalls,
    toolNames,

    //helper method to quickly see if any tools has been selected or not
    selectedAny : toolNames?.length > 0
  };
}