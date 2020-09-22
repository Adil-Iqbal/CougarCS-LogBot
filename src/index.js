// Once live, change DEBUG to false.
const DEBUG = false;

const fetch = require('node-fetch');
const _ = require('lodash');
require('dotenv').config();

const { extract, convertTime, getDate, roll, truncateString } = require('./util');
//const { fields } = require('./fields');

const guildId = process.env.GUILD_ID;
const channelId = process.env.CHANNEL_ID;
const chatChannelId = process.env.CHAT_CHANNEL_ID;
const builderChannelId = process.env.BOT_BUILDER_CHANNEL_ID;

const Discord = require('discord.js');
const discordClient = new Discord.Client();

const FORM_LABELS = [
    "Name",
    "Date",
    "Volunteer Type",
    "Duration",
    "Comment",
]

let t = 0;
let tipRate = 0.15;
const proTips = [
    "If you start any message with two forward slashes, I'll ignore that message completely.",
    "If your log request is of type \"outreach\", then the \`Duration\` field is ignored.",
    "If your log request is of type \"other\", you must have a \`Comment\`.",
    "If you send a message with just a question mark and nothing else, I'll send you a direct message with detailed instructions on how to log your hours.",
    "My code is open source, and you can see it here: https://github.com/Adil-Iqbal/CougarCS-LogBot",
    "Keeping the \`Name\` field consistent across all your log requests makes it easier to credit you for your work.",
    "Never submit a log request for someone else! If they've helped you, remind them to submit their own request to receive credit.",
    "Did you know that I attach your Discord username and discriminator to every log request you submit? It helps us detect any shenanigans and keeps the process fair for everyone.",
    `You can help make me better by contributing on the <#${builderChannelId}> channel! Any time spent contributing can be logged for credit.`,
    "When I react to a log request with :white_check_mark:, it means that the request was successfully logged.",
    "When I react to a log request with :warning:, it means that the log request was denied. If your log request is ever denied, check your direct messages for more info.",
    `This channel is not the easiest place to have a conversation. Consider moving the discussion to <#${chatChannelId}>? :heart:`,
    "The `Duration` field accept the standard `Xh Ym` format *or* the reversed `Ym Xh` format (where X and Y are integers representing hours and minutes respectively). You can also use the terms alone; the entries `Duration: 55m` and `Duration: 3h` are both acceptable.",
]

discordClient.once('ready', () => {
	console.log('Ready!');
});

discordClient.on('message', async (msg) => {

    // Restrict bot to specific discord server and specific channel.
    if (msg.guild.id === guildId && 
        msg.channel.id === channelId && 
        !msg.author.bot &&
        !msg.content.startsWith("//")) {
        
        // TODO: Add superuser commands. 
        
        // Tips are sent on average every 1/5 log requests.
        if (roll(tipRate)) {
            if (t > proTips.length - 1) t = 0;
            await msg.channel.send(`**Pro tip!** ${proTips[t]}`);
            t++;
        }

        // Send basic instructions.
        if (msg.content === "?") { await msg.author.send(`**How To Log Your Hours**

Copy the template below and paste it into <#${channelId}>. Update all the info for your use case:
\`\`\`
Name: Thomas Jefferson
Date: 7/4/1776
Volunteer Type: group
Duration: 1h 45m
Comment: declared independence
\`\`\`
**Rules**
- All requests must have a \`Name\` field.
- The \`Date\` field accepts the following formats: MM/DD/YYYY, MM/DD/YY, MM/DD
- If the \`Date\` field is omitted, the log request will assume today's date.
- All requests must have a \`Volunteer Type\` field.
- The \`Volunteer Type\` field should contain one of the following words: text, voice, group, outreach, other.
    - An "other" request *must* have a \`Comment\` field.
    - An "outreach" request does *not* need a \`Duration\` field.
- The \`Duration\` field should be in the format "Xh Ym" with X and Y being an integer of hours and minutes respectively.
- The value of the \`Comment\` field will always be truncated to 140 characters.

**Best Practices**
- Keep the value of the \`Name\` field consistent across all your requests.
- Never submit a log request for someone other than yourself.
- If anyone helped you in your task, they should submit their own request.
- Try to limit conversation in <#${channelId}>.

Thank you so much for your time! <3
`); 
await msg.react("👍");
return; }

        // Parse message content.
        let content = msg.content;
        content = content.split("\n");

        let post = {};

        for (let line of content) {
            for (let label of FORM_LABELS) {
                if (line.startsWith(`${label}:`)) {
                    let value = extract(label, line);
                    if (label === "Date") {
                        post[label.toLowerCase()] = getDate(value);
                    }
                    else if (label === "Duration") {
                            post[label.toLowerCase()] = convertTime(value);
                    } else if (label === "Comment") {
                        post[label.toLowerCase()] = truncateString(value, 140);
                    } else {
                        post[label.toLowerCase()] = value;
                    }
                }
            }
        }

        if (_.isEmpty(post)) {
            await msg.reply(`*Hmm... that doesn't look like a log request.* Send the message "?" and I'll privately message you some instructions on how to log your hours.\n\n**Pro tip!** If you start your message with two forward slashes, I'll ignore the message completely. Alternatively, you can move your convo to <#${chatChannelId}>.`);
            await msg.react('⚠️');
            return; 
        }

        // TODO: Validate post
        
        // Add metadata.
        post.metadata = {
            "timestamp": new Date(),
            "discord_id": DEBUG ? "hidden" : msg.author.id,
            "username": msg.author.username,
            "discriminator": msg.author.discriminator,
        }

        // TODO: Post to server.
        const payload = {
            method: "POST",
            body: JSON.stringify(post),
            headers: { 'Content-Type': 'application/json' }
        };
        fetch('http://127.0.0.1:5000/logs', payload).then(resp => console.log(resp.json())).catch(err => console.err(err));

        // TODO: Send confirmation receipt.

        msg.reply(JSON.stringify(post, null, 4));
        await msg.react("✅");
        return;
    }
});

discordClient.login(process.env.BOT_TOKEN);