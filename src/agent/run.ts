import "dotenv/config";
//ai imports from vercel
import { generateText, type ModelMessage } from "ai";

//adapter module to switch between different modal provider -- open ai, claude with same sdk interface.This provide flexibility to change LLM providers without having to rewrite the code
import { openai } from "@ai-sdk/openai";

import { AgentCallbacks } from "../../types.ts";
import { SYSTEM_PROMPT } from "./system/prompt.ts";
import { tools } from "./tools/index.ts";
import { executeTools } from "./executeTools.ts";

//for tracing and testing used Laminar
import { Laminar, getTracer } from "@lmnr-ai/lmnr";

const MODAL_NAME = 'gpt-5-mini';

Laminar.initialize({
    projectApiKey: process.env.LMNR_PROJECT_API_KEY
})

export const runAgent = async(userMessage: string, conversationHistory?: ModelMessage[], callback?: AgentCallbacks): Promise<any>  => {


    //this function basically generate text with the modal you want
    const {text, toolCalls} = await generateText({
model: openai(MODAL_NAME),
prompt: userMessage,
system: SYSTEM_PROMPT,
tools: tools,
experimental_telemetry: {
    isEnabled: true,
    tracer: getTracer(),
}
    });

    // Forcing Laminar to send the events to the server instead of waiting to flush it in batches
    await Laminar.flush()
    console.log('done');

    // toolCalls.forEach(async(tc) => {
    //   console.log(await executeTools(tc.toolName, tc.input));
    // })
    return text;
}


runAgent("hello, what is the current time?");