const { TelegramClient } = require("telegram");
const input = require("input");
const { Api } = require("telegram/tl");
const fs = require("fs");
const { RoseFilter } = require("./filters/roseFilters");
const path = require("path");

const apiId = 11972427;
const apiHash = "3f7625db2e3cb625d3f2879cd70c7023";

const main = async () => {
  try {
    // * uncomment this block while using with telegram
    // * creating telegram client session
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

    // * getting chat history of channel
    const history = await client.invoke(
      new Api.messages.GetHistory({
        peer: "artemistest1",
        limit: 5,
      })
    );

    // * removing invalid messages
    const chat = history.messages;
    const messages = [];
    for (let i = 0; i < chat.length; i++)
      if (chat[i].message !== undefined) messages.push(chat[i].message);

    // * applying rose filters
    const filteredMessages = [];
    for (let i = 0; i < messages.length; i++) {
      const isContainingBuySignal = RoseFilter.filter(messages[i]);
      if (isContainingBuySignal) filteredMessages.push(messages[i]);
    }

    try {
      // checking does message.json exists
      const doesSavedMessagesExist = fs.existsSync(path.join("messages.json"));
      if (!doesSavedMessagesExist) {
        // * saving new copy of messages if does'nt exist
        const json = JSON.stringify(filteredMessages);
        fs.writeFile("messages.json", json, "utf8", function (err) {
          if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
          }
          console.log("JSON file has been saved.");
        });
      }
      // * reading messages from json file
      const data = fs.readFileSync("messages.json");
      const savedMessages = JSON.parse(data);

      // * checking for new messages
      const newMessages = filteredMessages.filter(
        (x) => !savedMessages.includes(x)
      );

      // * send messages to telegram channel
      for (let i = 0; i < newMessages.length; i++) {
        console.log(newMessages[i]);
        const result = await client.invoke(
          new Api.messages.SendMessage({
            peer: "artemistest2",
            message: newMessages[i],
          })
        );
        console.log(result);
      }

      // * if contains new messages overrwrite messages.json
      if (newMessages.length > 0) {
        fs.writeFile(
          "messages.json",
          JSON.stringify(filteredMessages),
          "utf8",
          function (err) {
            if (err) {
              console.log(
                "An error occured while writing JSON Object to File."
              );
              return console.log(err);
            }
            console.log("JSON file has been saved.");
          }
        );
      }
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.log(error);
  }
};

main();
