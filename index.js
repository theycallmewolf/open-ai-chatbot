import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  // @doc https://platform.openai.com/docs/guides/text-generation/chat-completions-api
  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "What is the capital of Portugal?" }],
    });
    console.log(chatCompletion.choices[0].message.content);
  } catch (error) {
    console.error(error);
  }
}

main();
