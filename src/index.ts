import { ChatGroq } from "@langchain/groq";
import dotenv from "dotenv";

dotenv.config();

(async () => {
  const llm = new ChatGroq({
    model: "mixtral-8x7b-32768",
    temperature: 0,
  });

  const result = await llm.invoke([{ role: "user", content: "Hi im bob" }]);

  console.log(result);
})();
