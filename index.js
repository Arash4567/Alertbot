require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const { TOKEN, SERVER_URL } = process.env;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const URI = `/webhook/${TOKEN}`;
const WEBHOOK_URL = SERVER_URL + URI;

const app = express();
app.use(bodyParser.json());

const init = async () => {
  const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`);
  console.log(res.data);
};

// const chatID = 883945872
//test

app.post(URI, async (req, res) => {
  console.log(req.body);
  if (!req.body.message.from.id) {
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: req.body.message.from.id,
      text: "Your chat id: " + req.body.message.from.id,
    });
    return res.send();
  }
});

app.post("/send", async (req, res) => {
  try {
    const {chatID, text} = req.body;
    if (!chatID) {
      return res.status(400).json({
        message: "Please enter chat id!",
      });
    } else {
      await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatID,
        text: text
      })
      return res.status(200).json({
        message: "Successfully send message to telegram bot!",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message:
        "Internal Server Error!",
    });
  }
});

app.get("/", async (req, res) => {
    return res.send("Server is working...")
});

app.listen(process.env.PORT || 5000, async () => {
  console.log("app running on port: ", process.env.PORT || 5000);
  await init();
});
