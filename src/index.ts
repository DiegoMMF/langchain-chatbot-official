import { ChatFireworks } from "@langchain/community/chat_models/fireworks";
import dotenv from "dotenv";

dotenv.config();

(async () => {
  const llm = new ChatFireworks({
    model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
    temperature: 0,
  });

  const result = await llm.invoke([
    { role: "user", content: "Hi! I'm Bob" },
    { role: "assistant", content: "Hello Bob! How can I assist you today?" },
    { role: "user", content: "What's my name?" },
  ]);

  console.log(result);
})();

/* 
Console output:

AIMessage {
  "id": "324a54f6-d8cd-4fba-b905-69c20b416d14",
  "content": "Your name is Bob!",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "promptTokens": 45,
      "completionTokens": 6,
      "totalTokens": 51
    },
    "finish_reason": "stop"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "output_tokens": 6,
    "input_tokens": 45,
    "total_tokens": 51,
    "input_token_details": {},
    "output_token_details": {}
  }
}
*/
