import colors from "colors";
import readlineSync from "readline-sync";
import openai from "./config/open-ai.js";

const DEBUG = false;
const BOT_NAME = "R2";
const BOT_SIGN = {
  INFO: colors.bold.green(`[${BOT_NAME}]:`),
  ALERT: colors.bold.red(`[${BOT_NAME}]:`),
};
const USER_NAME = "Wolf";

async function main() {
  greet();

  // Store chat history
  const chatHistory = [
    [
      "system",
      "When I ask for help to write something, you will write your reply based on the Star Wars droid R2-D2.",
    ],
  ];

  while (true) {
    const userQuestion = readlineSync.question(
      colors.bold.yellow(`${USER_NAME}: `)
    );

    try {
      // construct messages by iterating over `chatHistory`
      const messageList = chatHistory.map(([role, content]) => ({
        role,
        content,
      }));

      // add latest user message
      messageList.push({ role: "user", content: userQuestion });

      switch (userQuestion.toLowerCase()) {
        case "exit":
          reply("INFO", `See you soon ${USER_NAME}! Beep-boop-beep!`);
          return;

        case "":
          reply("ALERT", "Please enter a question.");
          continue;

        case "clear":
          console.clear();
          continue;

        case "help":
        case "h":
          reply(
            "INFO",
            "You can ask me anything!",
            "or type:",
            "-'exit' to quit.",
            "-'clear' to clear the screen.",
            "-'help' or 'h' to see this message again."
          );
          continue;

        default:
          // const messageList = updateMessageHistory(userQuestion);

          DEBUG && console.log(colors.cyan("[DEBUG]"), messageList);
          const message = await getGPTResponse(messageList);
          console.info(`${BOT_SIGN.INFO} ${message}`);

          // update history with user input and assistant response
          chatHistory.push(["user", userQuestion]);
          chatHistory.push(["assistant", message]);
      }
    } catch (error) {
      console.error(colors.red(error));
    }
  }
}

// Utils
function greet() {
  const date = new Date();
  const hour = date.getHours();
  let timeGreet = "";

  if (hour >= 0 && hour < 12) {
    timeGreet = "Good morning";
  } else if (hour >= 12 && hour < 18) {
    timeGreet = "Good afternoon";
  } else {
    timeGreet = "Good evening";
  }

  console.info(
    colors.bold.green(`
-----------------------------------
 ${BOT_SIGN.INFO} Beep-boop-beep!
 ${BOT_SIGN.INFO} 👋 ${timeGreet} Master ${USER_NAME}!
 ${BOT_SIGN.INFO} I'm ${BOT_NAME}, your personal assistant.
-----------------------------------
  `)
  );
}

function reply(type = "INFO", ...messages) {
  for (const message of messages) {
    console.info(`${BOT_SIGN[type.toUpperCase()]} ${message}`);
  }
}

async function getGPTResponse(messages) {
  // @doc https://platform.openai.com/docs/guides/text-generation/chat-completions-api
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4", // "gpt-3.5-turbo",
      temperature: 0.6,
      messages,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    return error;
  }
}

main();
