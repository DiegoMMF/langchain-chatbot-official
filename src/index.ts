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
