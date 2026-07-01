require("dotenv").config();

const{App} = require("@slack/bolt");
const {WebClient} = require("@slack/web-api");

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true,
});

const client = new WebClient(process.env.SLACK_BOT_TOKEN)

app.command("/ping-dinos", async({command, ack}) => {
    await ack();

    const arg = command.text.trim().toLowerCase();
    const text = "<@U0AK24A5EA2> get pung!!!";

    await client.chat.postMessage({
        channel: command.channel_id,
        text,
        link_names: true,
        as_user: true,
    });
});

(async () => {
    await app.start();
    console.log("bot is running!");
})();