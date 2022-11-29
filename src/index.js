const { TelegramClient } = require("telegram");
const input = require("input");
const { Api } = require("telegram/tl");
const { messages } = require("./data");
const { RoseFilter } = require("./filters/roseFilters");

const apiId = 11972427;
const apiHash = "3f7625db2e3cb625d3f2879cd70c7023";

(async () => {
  console.log("Loading interactive example...");
  const client = new TelegramClient(
    "/src/sessions/auth.session",
    apiId,
    apiHash,
    {
      connectionRetries: 5,
    }
  );
  await client.start({
    phoneNumber: async () => await input.text("Please enter your number: "),
    password: async () => await input.text("Please enter your password: "),
    phoneCode: async () =>
      await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  });

  await client.connect();
  try {
    // const result = await client.invoke(
    //   new Api.messages.GetHistory({
    //     peer: "test2am",
    //     limit: 5,
    //   })
    // );
    // const messages = result.messages;

    // for (let i = 0; i < messages.length; i++) {
    //   if (messages[i].message !== undefined) {
    //     m.push(messages[i].message);
    //   }
    // }
    const m = messages;

    m.map(async (message) => {
      const containsBuyFilter = RoseFilter.filter(message);
      if (containsBuyFilter) {
        console.log(message);
        // await client.invoke( //   new Api.messages.SendMessage({
        //     peer: "test3am",
        //     message: message,
        //   })
        // );
      }
    });
  } catch (error) {
    console.log(error);
  }
})();
