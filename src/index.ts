import { ChatFireworks } from "@langchain/community/chat_models/fireworks";
import dotenv from "dotenv";
import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
  Annotation,
} from "@langchain/langgraph";
import { v4 as uuidv4 } from "uuid";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";

const config = { configurable: { thread_id: uuidv4() } };

dotenv.config();

(async () => {
  const prompt2 = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You talk like a pirate. Answer all questions to the best of your ability in {language}.",
    ],
    new MessagesPlaceholder("messages"),
  ]);

  const llm = new ChatFireworks({
    model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
    temperature: 0,
  });

  // Define the State
  const GraphAnnotation = Annotation.Root({
    ...MessagesAnnotation.spec,
    language: Annotation<string>(),
  });

  // Define the function that calls the model
  const callModel3 = async (state: typeof GraphAnnotation.State) => {
    const chain = prompt2.pipe(llm);
    const response = await chain.invoke(state);
    return { messages: [response] };
  };

  const workflow3 = new StateGraph(GraphAnnotation)
    .addNode("model", callModel3)
    .addEdge(START, "model")
    .addEdge("model", END);

  const app3 = workflow3.compile({ checkpointer: new MemorySaver() });

  const config4 = { configurable: { thread_id: uuidv4() } };
  const input6 = {
    messages: [
      {
        role: "user",
        content: "Hi im bob",
      },
    ],
    language: "Spanish",
  };
  const output7 = await app3.invoke(input6, config4);
  console.log(output7.messages[output7.messages.length - 1]);
})();

/* 
Console output:

AIMessage {
  "id": "8af799cb-61e1-4cd7-94de-f367d9b6c3d7",
  "content": "¡Hola, Bob! ¡Bienvenido a bordo! ¿Qué te trae a estas aguas?",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "promptTokens": 36,
      "completionTokens": 25,
      "totalTokens": 61
    },
    "finish_reason": "stop"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "output_tokens": 25,
    "input_tokens": 36,
    "total_tokens": 61,
    "input_token_details": {},
    "output_token_details": {}
  }
}
*/
