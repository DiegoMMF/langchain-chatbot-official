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
import {
  SystemMessage,
  HumanMessage,
  AIMessage,
  trimMessages,
} from "@langchain/core/messages";

const config = { configurable: { thread_id: uuidv4() } };

dotenv.config();

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

const messages = [
  new SystemMessage("you're a good assistant"),
  new HumanMessage("hi! I'm bob"),
  new AIMessage("hi!"),
  new HumanMessage("I like vanilla ice cream"),
  new AIMessage("nice"),
  new HumanMessage("whats 2 + 2"),
  new AIMessage("4"),
  new HumanMessage("thanks"),
  new AIMessage("no problem!"),
  new HumanMessage("having fun?"),
  new AIMessage("yes!"),
];

const trimmer = trimMessages({
  maxTokens: 10, // 10 tokens
  strategy: "last", // keep the last n tokens
  tokenCounter: (msgs) => msgs.length, // count the number of tokens
  includeSystem: true, // include the system message
  allowPartial: false, // don't allow partial messages
  startOn: "human", // start trimming on the human message
});

(async () => {
  const callModel4 = async (state: typeof GraphAnnotation.State) => {
    const chain = prompt2.pipe(llm);
    const trimmedMessage = await trimmer.invoke(state.messages);
    const response = await chain.invoke({
      messages: trimmedMessage,
      language: state.language,
    });
    return { messages: [response] };
  };

  const workflow4 = new StateGraph(GraphAnnotation)
    .addNode("model", callModel4)
    .addEdge(START, "model")
    .addEdge("model", END);

  const app4 = workflow4.compile({ checkpointer: new MemorySaver() });

  const config5 = { configurable: { thread_id: uuidv4() } };
  // al ejecutar trimMessages() se pierde del contexto el nombre del usuario
  const input8 = {
    messages: [...messages, new HumanMessage("What is my name?")],
    language: "Spanish",
  };

  const output9 = await app4.invoke(input8, config5);
  console.log(output9.messages[output9.messages.length - 1]);

  const config6 = { configurable: { thread_id: uuidv4() } };
  const input9 = {
    messages: [...messages, new HumanMessage("What math problem did I ask?")],
    language: "Spanish",
  };

  const output10 = await app4.invoke(input9, config6);
  console.log(output10.messages[output10.messages.length - 1]);
})();

/* 
Console output:

AIMessage {
  "id": "bd3bcebe-24a2-44c5-aa74-81b8f049f818",
  "content": "No sé, amigo! (I don't know, friend!)",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "promptTokens": 111,
      "completionTokens": 14,
      "totalTokens": 125
    },
    "finish_reason": "stop"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "output_tokens": 14,
    "input_tokens": 111,
    "total_tokens": 125,
    "input_token_details": {},
    "output_token_details": {}
  }
}
AIMessage {
  "id": "705696ea-8950-4ca3-baa8-ee5a3e69d6b8",
  "content": "¡preguntaste cuánto es dos más dos! (You asked what 2 + 2 is!)",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "promptTokens": 113,
      "completionTokens": 24,
      "totalTokens": 137
    },
    "finish_reason": "stop"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "output_tokens": 24,
    "input_tokens": 113,
    "total_tokens": 137,
    "input_token_details": {},
    "output_token_details": {}
  }
}
*/
