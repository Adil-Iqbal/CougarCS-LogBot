// Configuration Options.
const DEBUG = true;
const TIP_RATE = 0.15;

// Node Packages.
const fetch = require('node-fetch');
const _ = require('lodash');
require('dotenv').config();
const Discord = require('discord.js');

// Utilities.
const { roll, capitalStr } = require('./util');
const { fields } = require('./fields');
const { HELP_MESSAGE, PRO_TIPS, NOT_A_REQUEST, buildReceipt, serverLog } = require('./copy');

// Environment variables.
const channelId = process.env.CHANNEL_ID;

const discordClient = new Discord.Client();

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
        await msg.channel.send(`**Pro tip!** ${_.sample(PRO_TIPS)}`);
    }

    // User has requested instructions.
    if (msg.content === "?") { await msg.author.send(HELP_MESSAGE);
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

    // Improper chatting.
    if (_.isEmpty(post)) {
        await msg.reply(NOT_A_REQUEST);
        await msg.react('⚠️');
        return;
    }

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
    }

    // Add metadata.
    post.metadata = {
        "timestamp": new Date(),
        "discord_id": msg.author.id,
        "username": msg.author.username,
        "discriminator": msg.author.discriminator,
    }

    // Post data payload to server.
    const payload = {
        method: "POST",
        body: JSON.stringify(post),
        headers: { 'Content-Type': 'application/json' }
    };
    const respObj = await fetch('http://127.0.0.1:5000/logs', payload);
    const response = await respObj.json();
    if (DEBUG)
        console.log(serverLog(post, response));

    // Send confirmation receipt.
    const receipt = buildReceipt(post, response);
    await msg.author.send(receipt);

    if (DEBUG) {
        post.metadata.discord_id = "*".repeat(msg.author.id.length);
        msg.reply("```json\n" + JSON.stringify(post, null, 4) + "\n```");
    }
    await msg.react("✅");
    return;
});

discordClient.login(process.env.BOT_TOKEN);