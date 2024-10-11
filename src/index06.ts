import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import {
  SystemMessage,
  HumanMessage,
  AIMessage,
  trimMessages,
} from "@langchain/core/messages";

dotenv.config();

(async () => {
  const trimmer = trimMessages({
    maxTokens: 10, // 10 tokens
    strategy: "last", // keep the last n tokens
    tokenCounter: (msgs) => msgs.length, // count the number of tokens
    includeSystem: true, // include the system message
    allowPartial: false, // don't allow partial messages
    startOn: "human", // start trimming on the human message
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

  const result = await trimmer.invoke(messages);
  console.log(result);
})();

/* 
Console output:

[
  SystemMessage {
    "content": "you're a good assistant",
    "additional_kwargs": {},
    "response_metadata": {}
  },
  HumanMessage {
    "content": "I like vanilla ice cream",
    "additional_kwargs": {},
    "response_metadata": {}
  },
  AIMessage {
    "content": "nice",
    "additional_kwargs": {},
    "response_metadata": {},
    "tool_calls": [],
    "invalid_tool_calls": []
  },
  HumanMessage {
    "content": "whats 2 + 2",
    "additional_kwargs": {},
    "response_metadata": {}
  },
  AIMessage {
    "content": "4",
    "additional_kwargs": {},
    "response_metadata": {},
    "tool_calls": [],
    "invalid_tool_calls": []
  },
  HumanMessage {
    "content": "thanks",
    "additional_kwargs": {},
    "response_metadata": {}
  },
  AIMessage {
    "content": "no problem!",
    "additional_kwargs": {},
    "response_metadata": {},
    "tool_calls": [],
    "invalid_tool_calls": []
  },
  HumanMessage {
    "content": "having fun?",
    "additional_kwargs": {},
    "response_metadata": {}
  },
  AIMessage {
    "content": "yes!",
    "additional_kwargs": {},
    "response_metadata": {},
    "tool_calls": [],
    "invalid_tool_calls": []
  }
]
*/
