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

const chatID = 883945872

app.post(URI, async (req, res) => {
  console.log(req.body);
  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: chatID,
    text: req.body.message.text
  })
  return res.send();
});

app.post("/send", async (req, res) => {
  try {
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatID,
      text: req.body
    })
    return res.send("Successfull!");
  } catch (err) {
    return res.status(500).json({
      message:
        "Serverda xatoliq yuzaga keldi, iltimos qaytadan harakat qilib ko'ring!",
    });
  }
});

app.listen(process.env.PORT || 5000, async () => {
  console.log("app running on port: ", process.env.PORT || 5000);
  await init();
});
