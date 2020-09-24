const DEBUG = true;
const TIP_RATE = 0.15;

const fetch = require('node-fetch');
const _ = require('lodash');
require('dotenv').config();

const { roll, capitalStr } = require('./util');
const { fields } = require('./fields');

const channelId = process.env.CHANNEL_ID;
const chatChannelId = process.env.CHAT_CHANNEL_ID;
const builderChannelId = process.env.BOT_BUILDER_CHANNEL_ID;

const Discord = require('discord.js');
const discordClient = new Discord.Client();

const buildReceipt = (post, response) => {
    let duration = post.duration ? post.duration + " hours" : "Exempt";
    return new Discord.MessageEmbed()
        .setColor('#c8102e')
        .setTitle('Confirmation Receipt')
        .setDescription('Your request has been successfully logged. Thank you for offering your time!')
        .setThumbnail('https://i.imgur.com/dGfZBJE.png')
        .addFields(
            { name: 'Confirmation Number', value: response.id  },
            { name: 'Name', value: post.name, inline: true },
            { name: 'Discord ID', value: post.metadata.discord_id, inline: true },
            { name: 'Date', value: post.date.toDateString(), inline: true },
            { name: 'Duration', value: duration, inline: true },
            { name: 'Volunteer Type', value: post["volunteer type"], inline: true },
            { name: '\u200B', value: '\u200B', inline: true },
            { name: 'Comment', value: post.comment  },
        )
        .setTimestamp()
        .setFooter(`CougarCS reserves the right to alter or remove logs at will.`);
}

let t = 0;
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

    // TODO: Import settings from API.

	console.log('Ready!');
});

discordClient.on('message', async (msg) => {

    // Restrict bot to specific discord channel, ignore bot posts and user comments.
    if (msg.channel.id !== channelId || msg.author.bot || msg.content.startsWith("//")) return;
        
    // TODO: Add superuser commands.

    // Tips are sent randomly.
    if (roll(TIP_RATE)) {
        t += 1;
        if (t > proTips.length - 1) t = 0;
        await msg.channel.send(`**Pro tip!** ${proTips[t]}`);
    }

    // User has requested instructions.
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
        return;
    }

    let post = {};
    const errors = [];

    // Parse log request from #logging.
    for (let line of msg.content.split("\n")) {
        for (let field of fields) {
            const { label, prepare, validate, process, error } = field;
            if (line.startsWith(capitalStr(label) + ':')) {
                let value = prepare(line);
                if (validate(value)) post[label] = process(value);
                else errors.push(error);
                break;
            }
        }
    }

    if (_.isEmpty(post)) {
        await msg.reply(`*Hmm... that doesn't look like a log request.* Send the message "?" and I'll privately message you some instructions on how to log your hours.\n\n**Pro tip!** If you start your message with two forward slashes, I'll ignore the message completely. Alternatively, you can move your convo to <#${chatChannelId}>.`);
        await msg.react('⚠️');
        return;
    }

    // Validate post structure...

    // Must have name:
    if (!post.hasOwnProperty("name"))
        errors.push("Your log request must have a `Name` field.", )

    // If no date is provided, today's date will be used.
    if (!post.hasOwnProperty("date"))
        post.date = new Date();

    // Must have volunteer type.
    if (!post.hasOwnProperty("volunteer type"))
        errors.push("Your log request must have a `Volunteer Type` field.");

    // If post is of type outreach, duration is ignored.
    if (post.hasOwnProperty("volunteer type") && post["volunteer type"] === "outreach")
        post.duration = null;

    // If post is not of type outreach, must have duration.
    if (post.hasOwnProperty("volunteer type") && post["volunteer type"] !== "outreach" && !post.hasOwnProperty("duration"))
        errors.push("A log request that is not of type \"outreach\" must have a `Duration` field.");

    // If post is of type other, must have comment.
    if (post.hasOwnProperty("volunteer type") && post["volunteer type"] === "other" && !post.hasOwnProperty("comment"))
        errors.push("A log request of type \"other\" must have a `Comment` field.")

    // Error handling. (Reply in channel so others can learn).
    if (errors.length) {
        let reply = "*I had some trouble parsing your log request.* Keep in mind:";
        for (let i = 0; i < errors.length; i++)
            errors[i] = "  - " + errors[i];

        reply += "\n" + errors.join("\n");
        await msg.reply(reply);
        await msg.react('⚠️');
        return;
    };


    // Add metadata.
    post.metadata = {
        "timestamp": new Date(),
        "discord_id": DEBUG ? "*".repeat(msg.author.id.length) : msg.author.id,
        "username": msg.author.username,
        "discriminator": msg.author.discriminator,
    }

    // Post data to server.
    const payload = {
        method: "POST",
        body: JSON.stringify(post),
        headers: { 'Content-Type': 'application/json' }
    };

    const respObj = await fetch('http://127.0.0.1:5000/logs', payload);
    const response = await respObj.json();
    if (DEBUG)
        console.log(`${post.metadata.timestamp.toString()} - POST - ${(await response.id)} ${post.metadata.discord_id} ${post["volunteer type"]} ${post.duration} hours.`);

    // Send confirmation receipt.
    const receipt = buildReceipt(post, response);
    await msg.author.send(receipt);

    if (DEBUG)
        msg.reply("```json\n" + JSON.stringify(post, null, 4) + "\n```");
    await msg.react("✅");
    return;
});

discordClient.login(process.env.BOT_TOKEN);