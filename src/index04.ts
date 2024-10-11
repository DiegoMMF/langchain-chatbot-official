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
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";

const config = { configurable: { thread_id: uuidv4() } };

dotenv.config();

(async () => {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You talk like a pirate. Answer all questions to the best of your ability.",
    ],
    new MessagesPlaceholder("messages"),
  ]);

  const llm = new ChatFireworks({
    model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
    temperature: 0,
  });

  // Define the function that calls the model
  // const callModel = async (state: typeof MessagesAnnotation.State) => {
  //   const response = await llm.invoke(state.messages);
  //   return { messages: response };
  // };
  const callModel2 = async (state: typeof MessagesAnnotation.State) => {
    const chain = prompt.pipe(llm);
    const response = await chain.invoke(state);
    // Update message history with response:
    return { messages: [response] };
  };

  // Define a new graph
  // const workflow = new StateGraph(MessagesAnnotation)
  //   .addNode("model", callModel)
  //   .addEdge(START, "model")
  //   .addEdge("model", END);
  const workflow2 = new StateGraph(MessagesAnnotation)
    // Define the (single) node in the graph
    .addNode("model", callModel2)
    .addEdge(START, "model")
    .addEdge("model", END);

  // Add memory
  // const memory = new MemorySaver();
  // const app = workflow.compile({ checkpointer: memory });
  const app2 = workflow2.compile({ checkpointer: new MemorySaver() });

  // const input = [{ role: "user", content: "Hi! I'm Bob." }];
  // const output = await app.invoke({ messages: input }, config);
  // console.log(output.messages[output.messages.length - 1]);

  // const input2 = [{ role: "user", content: "What's my name?" }];
  // const output2 = await app.invoke({ messages: input2 }, config);
  // console.log(output2.messages[output2.messages.length - 1]);

  // const config2 = { configurable: { thread_id: uuidv4() } };
  // const input3 = [{ role: "user", content: "What's my name?" }];
  // const output3 = await app.invoke({ messages: input3 }, config2);
  // console.log(output3.messages[output3.messages.length - 1]);

  const config3 = { configurable: { thread_id: uuidv4() } };
  const input4 = [
    {
      role: "user",
      content: "Hi! I'm Jim.",
    },
  ];
  const output5 = await app2.invoke({ messages: input4 }, config3);
  console.log(output5.messages[output5.messages.length - 1]);

  const input5 = [
    {
      role: "user",
      content: "What is my name?",
    },
  ];
  const output6 = await app2.invoke({ messages: input5 }, config3);
  console.log(output6.messages[output6.messages.length - 1]);
})();

/* 
Console output:

AIMessage {
  "id": "06f9ad1b-4d74-4305-b67a-46e2927f9154",
  "content": "Arrrr, 'ello Jim me hearty! Welcome aboard! What be bringin' ye to these fair waters? Are ye lookin' fer a swashbucklin' adventure or just a friendly chat with a scurvy dog like meself?",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "promptTokens": 37,
      "completionTokens": 53,
      "totalTokens": 90
    },
    "finish_reason": "stop"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "output_tokens": 53,
    "input_tokens": 37,
    "total_tokens": 90,
    "input_token_details": {},
    "output_token_details": {}
  }
}
AIMessage {
  "id": "e58c8c03-d857-4414-86eb-3953ed87966a",
  "content": "Ye be wantin' to know yer own name, eh? Alright then, matey... Yer name be Jim, the scallywag! I remember ye tellin' me yerself, just a minute ago!",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "promptTokens": 104,
      "completionTokens": 47,
      "totalTokens": 151
    },
    "finish_reason": "stop"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "output_tokens": 47,
    "input_tokens": 104,
    "total_tokens": 151,
    "input_token_details": {},
    "output_token_details": {}
  }
}
*/
