import {tool} from 'ai';

//its a run time schema maker that we can use to validate objects or any primitive value
import {z} from 'zod';

//tool will have 3 arguments : description, input schema and execute function
export const dateTime = tool({
    description: "Returns the current date and time. Use this tool before any date or time related task. ",
    inputSchema: z.object({}),
    execute: async() => {
        // you can only place text into the prompt as thats only serializable on the network. Also LLM only understand language.  so we need to convert this date to iso string
        return `The current date time in ISO format is ${new Date().toISOString()}`;
    }

})

