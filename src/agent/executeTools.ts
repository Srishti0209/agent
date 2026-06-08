//Its mostly going to be doing a switch statement on all of our tools from index

// import { Toolname } from '../../types.ts';
import { tools } from "./tools/index.ts";

export type Toolname = keyof typeof tools;

export async function executeTool(
  name: string,
  args: Record<string, unknown>,
): Promise<string> {
  const tool = tools[name as Toolname];

  if (!tool) {
    return ` ${name} tool does not exist. Please use some other tool`;
  }

  const execute = tool.execute;
  if (!execute) {
    // Provider tools (like webSearch) are executed by OpenAI, not us
    return `Provider tool ${name} - executed by model provider`;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await execute(args as any, {
    toolCallId: "",
    messages: [],
  });

  return String(result);
}
