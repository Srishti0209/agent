//Its mostly going to be doing a switch statement on all of our tools from index

// import { Toolname } from '../../types.ts';
import {tools} from './tools/index.ts';

export type Toolname = keyof typeof tools;

export const executeTools = async (name: Toolname, args: any) => {
 const tool = tools[name as Toolname];

 if(!tool){
    return 'This tool does not exist. Please use some other tool';
 }
 const executeTool = tool.execute;
 if(!executeTool){
    //Tell LLM that this tool doesn't have an execute function. 
    return 'This is not a registered tool'
 }
 const result = await executeTool(args, {
    toolCallId : '',
    messages: []
 });

 return String(result)
}