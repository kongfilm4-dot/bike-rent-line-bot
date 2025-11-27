import express from "express";
import line from "@line/bot-sdk";

const app = express();

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
};

const client = new line.Client(config);

app.post("/webhook", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

function handleEvent(event) {
  // ตอบกลับข้อความ echo
  if (event.type === "message" && event.message.type === "text") {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: "คุณพิมพ์ว่า: " + event.message.text
    });
  }

  return Promise.resolve(null);
}

app.get("/", (req, res) => {
  res.send("LINE Bot is running");
});

// สำหรับการ deploy
app.listen(3000, () => {
  console.log("Running on port 3000");
});
