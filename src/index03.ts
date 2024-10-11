import { ChatFireworks } from "@langchain/community/chat_models/fireworks";
import dotenv from "dotenv";
import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
} from "@langchain/langgraph";
import { v4 as uuidv4 } from "uuid";

const config = { configurable: { thread_id: uuidv4() } };

dotenv.config();

(async () => {
  const llm = new ChatFireworks({
    model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
    temperature: 0,
  });

  // Define the function that calls the model
  const callModel = async (state: typeof MessagesAnnotation.State) => {
    const response = await llm.invoke(state.messages);
    return { messages: response };
  };

  // Define a new graph
  const workflow = new StateGraph(MessagesAnnotation)
    // Define the node and edge
    .addNode("model", callModel)
    .addEdge(START, "model")
    .addEdge("model", END);

  // Add memory
  const memory = new MemorySaver();
  const app = workflow.compile({ checkpointer: memory });

  const input = [{ role: "user", content: "Hi! I'm Bob." }];
  const output = await app.invoke({ messages: input }, config);
  // The output contains all messages in the state.
  // This will long the last message in the conversation.
  console.log(output.messages[output.messages.length - 1]);

  const input2 = [{ role: "user", content: "What's my name?" }];
  const output2 = await app.invoke({ messages: input2 }, config);
  console.log(output2.messages[output2.messages.length - 1]);

  // Create a new thread: note that the thread_id is different so
  // the model will not remember the previous conversation
  const config2 = { configurable: { thread_id: uuidv4() } };
  const input3 = [{ role: "user", content: "What's my name?" }];
  const output3 = await app.invoke({ messages: input3 }, config2);
  console.log(output3.messages[output3.messages.length - 1]);
})();

/* 
Console output:

AIMessage {
  "id": "13a18863-932f-4535-a25e-e25ac338ec31",
  "content": "Hi Bob! It's nice to meet you! Is there something I can help you with or would you like to chat?",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "promptTokens": 21,
      "completionTokens": 26,
      "totalTokens": 47
    },
    "finish_reason": "stop"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "output_tokens": 26,
    "input_tokens": 21,
    "total_tokens": 47,
    "input_token_details": {},
    "output_token_details": {}
  }
}
AIMessage {
  "id": "a1c9792e-b3ca-4648-a17b-83d937a69ce3",
  "content": "Your name is Bob!",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "promptTokens": 61,
      "completionTokens": 6,
      "totalTokens": 67
    },
    "finish_reason": "stop"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "output_tokens": 6,
    "input_tokens": 61,
    "total_tokens": 67,
    "input_token_details": {},
    "output_token_details": {}
  }
}
*/
