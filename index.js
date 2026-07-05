require("dotenv").config();

const {App} = require("@slack/bolt");
const {WebClient} = require("@slack/web-api");
const axios = require("axios");

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true,
});
const client = new WebClient(process.env.SLACK_BOT_TOKEN);

const EMOJI = "ajay-pat";
const invitePosts = new Set();

app.command("/ping-dinos", async ({command, ack}) => {
    await ack();
    const res = await client.chat.postMessage({
        channel: command.channel_id,
        text: `Heyy gng!!, react with :${EMOJI}: to get added to my private channel(I maay. MAY. yap.):)`,
    });
    invitePosts.add(res.ts);
});

app.command("/ping-dinos-cat-facts", async({command, ack}) => {
    await ack();

    try{
        const res = await axios.get("https://catfact.ninja/fact");
        await client.chat.postMessage({
            channel: command.channel_id,
            text: `Cat fact: ${res.data.fact}`
        })
    }
    catch(err){
        await client.chat.postMessage({
            channel: command.channel_id,
            text: "Failed to fetch cat fact:("
        })
    }


});

app.command("/ping-dinos-joke", async({command, ack}) => {
    await ack();
    try{
        const res = await axios.get("https://official-joke-api.appspot.com/random_joke");
        await client.chat.postMessage({
            channel: command.channel_id,
            text: `Dino-joke: ${res.data.setup} \n${res.data.punchline}`
        })
    }
    catch(err){
        await client.chat.postMessage({
            channel: command.channel_id,
            text: "Failed to fetch a joke:("
        })
    }
});


app.command ("/ping-dinos-help", async ({command, ack}) => {
    await ack();
    await client.chat.postMessage({
        channel: command.channel_id,
        text: "Commands in this bot: \n/ping-dinos-cat-facts - Show cat facts \n/ping-dinos-joke - to get a dino joke \n/ping-dinos-help - to show this help message"
    })
});

app.event("reaction_added", async ({event}) => {
    if (event.reaction !== EMOJI || !invitePosts.has(event.item.ts)) return;
    try {
        await client.conversations.invite({ channel: `${process.env.CHANNEL_ID}`, users: event.user });
    } catch (e) {
        console.log("invite failed:", e.data?.error || e.message);
    }
});

(async () => {
    await app.start();
    console.log("bot running");
})();

