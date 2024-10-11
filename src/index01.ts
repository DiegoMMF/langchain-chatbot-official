import { ChatFireworks } from "@langchain/community/chat_models/fireworks";
import dotenv from "dotenv";

dotenv.config();

(async () => {
  const llm = new ChatFireworks({
    model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
    temperature: 0,
  });

  const result = await llm.invoke([{ role: "user", content: "Hi im bob" }]);
  console.log(result);

  const result2 = await llm.invoke([{ role: "user", content: "Whats my name?" }]);
  console.log(result2);
})();

/* 
Console output:

AIMessage {
  "id": "ac6729ec-919a-4087-b457-152bc84fdf10",
  "content": "Hi Bob! It's nice to meet you! Is there something I can help you with or would you like to chat?",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "promptTokens": 18,
      "completionTokens": 26,
      "totalTokens": 44
    },
    "finish_reason": "stop"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "output_tokens": 26,
    "input_tokens": 18,
    "total_tokens": 44,
    "input_token_details": {},
    "output_token_details": {}
  }
}

AIMessage {
  "id": "d9b4e67a-10f5-46fc-8e6c-9a158d7ee9d8",
  "content": "I don't know your name! I'm a large language model, I don't have the ability to know your personal information or recall previous conversations. Each time you interact with me, it's a new conversation and I don't retain any information about you. Would you like to tell me your name, though?",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "promptTokens": 19,
      "completionTokens": 64,
      "totalTokens": 83
    },
    "finish_reason": "stop"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "output_tokens": 64,
    "input_tokens": 19,
    "total_tokens": 83,
    "input_token_details": {},
    "output_token_details": {}
  }
}
*/