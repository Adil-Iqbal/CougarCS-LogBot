// Environment variables.
require('dotenv').config();
const channelId = process.env.CHANNEL_ID;

// Configuration Options.
let config = require('./config.json');

// Node Packages.
const path = require("path");
const _ = require('lodash');
const fs = require('fs');
const Discord = require('discord.js');

// Utilities.
const { roll, capitalStr } = require('./util');
const { fields } = require('./fields');
const { HELP_MESSAGE, PRO_TIPS, NOT_A_REQUEST, LOCKED, buildReceipt, serverLog, safeFetch, debugText } = require('./copy');

const client = new Discord.Client();

// Retrieve commands.
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync(path.resolve(__dirname, "./commands")).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {

    // TODO: Import settings from API.

	console.log('Ready!');
});

client.on('message', async (message) => {

    // Restrict bot to specific discord channel, ignore bot posts, ignore comments, and ignore commands.
    if (message.channel.id !== channelId || message.author.bot || message.content.startsWith(config.commentPrefix) ) return;

    // Parse commands.
    if (message.content.startsWith(config.prefix)) {
        const args = message.content.slice(config.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        // Command not found.
        if (!client.commands.has(commandName)) {
            await message.react('⚠️');
            await message.reply("*I don't know that command.*");
            return;
        };

        try {
            // Retrieve command.
            const command = client.commands.get(commandName);

            // Required argument verification.
            if (command.args && !args.length) {
                let reply = "*You didn't provide any arguments.*"
                if (command.usage) reply += `The proper usage is: ${config.prefix}${command.name} ${command.usage}`;
                await message.react('⚠️');
                await message.reply(reply);
                return;
            }
                
            // Execute command.
            command.execute(message, args, config);
            return;
        } catch (error) {
            await message.react('⚠️');
            if (config.config.debug) await message.reply(debugText("Javascript Error", e.stack));
            else await message.reply('*I had trouble trying to execute that command.*');
            return;
        }
    }

    // When bot is locked, 
    if (config.lock) {
        await message.react('⚠️');
        await message.reply(LOCKED);
        return;
    }

    // Tips are sent randomly.
    if (roll(config.tipRate)) {
        await message.channel.send(`**Pro tip!** ${_.sample(PRO_TIPS)}`);
    }

    // User has requested instructions.
    if (message.content === "?") { await message.author.send(HELP_MESSAGE);
        await message.react("👍");
        return;
    }

    let post = {};
    const errors = [];

    // Parse log request from #logging.
    for (let line of message.content.split("\n")) {
        for (let field of fields) {
            const { label, prepare, validate, process, error } = field;
            if (line.startsWith(capitalStr(label) + ':')) {
                post[label] = undefined;
                let value = prepare(line);
                if (validate(value)) post[label] = process(value);
                else errors.push(error);
                break;
            }
        }
    }

    // Illegal chatting.
    if (_.isEmpty(post)) {
        await message.reply(NOT_A_REQUEST);
        await message.react('⚠️');
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

    if (post.hasOwnProperty("duration") && post["duration"] !== null && post["duration"] > config.maxHours)
        errors.push(`You cannot log more than ${config.maxHours} in a single post.`);

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
        await message.reply(reply);
        await message.react('⚠️');
        return;
    }

    // Add metadata.
    post.metadata = {
        "timestamp": new Date(),
        "discord_id": message.author.id,
        "username": message.author.username,
        "discriminator": message.author.discriminator,
    }

    // Post data payload to server.
    const payload = {
        method: "POST",
        body: JSON.stringify(post),
        headers: { 'Content-Type': 'application/json' }
    };

    if (config.debug) {
        post.metadata.discord_id = "*".repeat(message.author.id.length);
        await message.reply(debugText("Request Body", JSON.stringify(post, null, 4), "json"))
    }

    // const [ respObj, response ] = await safeFetch(message, 'http://127.0.0.1:5000/logs', payload);
    // if (respObj === null && response === null) return;


    let respObj, response;
    try {
    
        // Send post request to API.
        respObj = await fetch('http://127.0.0.1:5000/logs', payload);
    
        if (respObj.status === 401) {
            await message.react('⚠️');
            await message.reply(PERMISSION_DENIED);
            return;
        }
    
        response = await respObj.json();
    
        // Server responds with a server error.
        if (response.server_error) {
            await message.react('⚠️');
            if (config.debug) await message.reply("*Server Error*\n```\n" + response.server_error + "\n```");
            else await message.reply(API_DOWN);
            return;
        }
    
    // Server does not respond.
    } catch (e) {
        await message.react('⚠️');
        if (config.debug) {
            await message.reply(debugText("Javascript Error", e.stack));
            if (respObj && respObj.status) 
                await message.reply(debugText("Response Status", `${respObj.status}: ${respObj.statusText}`));
        } else
            await message.reply(API_DOWN);
        return;
    }

    // Log all requests sent to bot console.
    if (config.debug)
        console.log(serverLog(post, response));

    // Send confirmation receipt.
    const receipt = buildReceipt(post, response);
    await message.author.send(receipt);

    await message.react("✅");
    return;
});

client.login(process.env.BOT_TOKEN);