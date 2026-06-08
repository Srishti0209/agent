import { evaluate } from "@lmnr-ai/lmnr";
import type { EvalData, EvalTarget } from "./types";
import { toolSelectionScore, toolOrderCorrect, toolsAvoided } from "./evaluators";
import { singleTurnEvaluatorWithMocks } from "./executors";
import dataset from './data/file-tools.json' with {type: 'json'}


const executor = async(data: EvalData) => {
return singleTurnEvaluatorWithMocks(data)
}

//experiments
evaluate({
    data: dataset as any,
    executor,
    evaluators: {
        selectionScore : (output: any, target:any) => {
            if(target.category === 'secondary')
                return 1;
            return toolSelectionScore(output, target)
        },
     // For negative prompts: did it avoid forbidden tools?
    toolsAvoided: (output, target) => {
      if (target?.category !== "negative") return 1; // Skip for non-negative
      return toolsAvoided(output, target);
    },
  
    },
    groupName: 'file-tool-selection'
})