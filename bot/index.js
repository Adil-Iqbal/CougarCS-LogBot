// Environment variables.
require('dotenv').config();
const channelId = process.env.CHANNEL_ID;
const host = process.env.HOST;

// Configuration Options.
let config = require('./config.json');

// Node Packages.
const path = require("path");
const _ = require('lodash');
const fs = require('fs');
const Discord = require('discord.js');
const fetch = require('node-fetch');

// Utilities.
const { roll, capitalStr, safeFetch, stampPost } = require('./util');
const { fields } = require('./fields');
const { WELCOME, HELP_MESSAGE, PRO_TIPS, NOT_A_REQUEST, LOCKED, buildReceipt, serverLog, debugText, LR_TEMPLATE, API_DOWN } = require('./copy');

const client = new Discord.Client();

// Retrieve commands.
const LR_CMD_NAME = 'log request';
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync(path.resolve(__dirname, "./commands")).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (command.name == LR_CMD_NAME) {
        console.error(`A command cannot be named "${LR_CMD_NAME}" since that is reserved for log requests. Your "${LR_CMD_NAME}" command has been ignored.`);
        continue;
    }
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.once('ready', async () => {
    const channel = client.channels.cache.get(String(channelId));

    try {
        const payload = {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        }
        const respObj = await fetch(`${host}/config`, payload)
        const response = await respObj.json();
    
        if (respObj && respObj.ok) {
            config = await response.body;
        }
    
        if (config.debug) {
            if (respObj && respObj.status)
                await channel.send(debugText("Server Status", `${respObj.status}: ${respObj.statusText}`));
            await channel.send(debugText("Configuration", config, "json"));
        }
    
        await channel.send(WELCOME);
        console.log('Ready!');

    } catch (e) {
        await channel.send(API_DOWN);
        if (config.debug) await channel.send(debugText("Javascript Error", e.stack));
        console.error(e);
        return;
    }
});

client.on('message', async (message) => {
    try {
        // Restrict bot to specific discord channel, ignore bot posts, ignore comments, and ignore commands.
        if (message.channel.id !== channelId || message.author.bot || message.content.startsWith(config.commentPrefix) ) return;

        // Parse commands.
        if (message.content.startsWith(config.prefix)) {
            const args = message.content.slice(config.prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();
            const command = client.commands.get(commandName);

            // Command not found.
            if (!client.commands.has(commandName)) {
                await message.react('⚠️');
                await message.reply("*I don't know that command.*");
                return;
            };

            if (config.lock && command.useApi && !command.lockExempt) {
                await message.react('⚠️');
                await message.reply(LOCKED);
                return;
            }

            // Create command cooldown.
            if (!cooldowns.has(command.name)) {
                cooldowns.set(command.name, new Discord.Collection());
            }
            
            const now = Date.now();
            const timestamps = cooldowns.get(command.name);
            const cooldownAmount = (command.cooldown || config.cooldown) * 1000;
            
            if (timestamps.has(message.author.id)) {
                const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    await message.react('⚠️');
                    return await message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
                }
            }

            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

            try {
                // Retrieve command.
                const command = client.commands.get(commandName);

                // Required argument verification.
                if (command.args && !args.length) {
                    let reply = "*You didn't provide any arguments.* "
                    if (command.usage) reply += `The proper usage is: \n\`\`\`\n${config.prefix}${command.name} ${command.usage}\n\`\`\``;
                    await message.react('⚠️');
                    await message.reply(reply);
                    return;
                }
                    
                // Execute command.
                await command.execute(message, args, config, client);
                return;
            } catch (e) {
                await message.react('⚠️');
                if (config.debug) await message.reply(debugText("Javascript Error", e.stack));
                await message.reply('*I had trouble trying to execute that command.*');
                console.error(e.stack);
                return;
            }
        }

        // User has requested instructions.
        if (message.content === config.requestHelp) { 
            await message.react("✅");
            await message.author.send(HELP_MESSAGE);
            return;
        }

        // When bot is locked, 
        if (config.lock) {
            await message.react('⚠️');
            await message.reply(LOCKED);
            return;
        }

        // Log request cooldowns.
        if (!cooldowns.has(LR_CMD_NAME)) {
            cooldowns.set(LR_CMD_NAME, new Discord.Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(LR_CMD_NAME);
        const cooldownAmount = (config.cooldown) * 1000;
        
        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                await message.react('⚠️');
                return await message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before logging a request.`);
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        let post = {};
        const errors = [];

        if (message.content === LR_TEMPLATE && !config.debug) 
            errors.push("The template should be updated with your info.");

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
	
	// When `Name` field is used on its own, use $setname endpoint.
	if (post.hasOwnProperty("name") && Object.getOwnPropertyNames(post).length == 1) {

	    if (errors.length) {
                let reply = "*I had some trouble parsing your log request.* Keep in mind:";
                for (let i = 0; i < errors.length; i++)
                    errors[i] = "  - " + errors[i];
                reply += "\n" + errors.join("\n");
                await message.reply(reply);
                await message.react('⚠️');
                return;
            }

	    const payload = {
                method: "UPDATE",
                body: JSON.stringify({ "new_name": post['name'] }),
                headers: { 'Content-Type': 'application/json' }
            }

            const [ respObj, response ] = await safeFetch(message, config, `/users/name/${message.author.id}`, payload);
            if (!respObj && !response) return;

            if (respObj.status == s.HTTP_200_OK) {
                await message.react("✅");
                const [ updatedName ] = response.body;
                let content = `Now, when you omit the \`Name\` field, the name in your log requests will auto-populate with **${updatedName}**.\nIf this was not your intention, you might want to read up on how the \`$setname\` command works: <https://tinyurl.com/cmddocs1>`;
                await message.reply(content);
                return;
            }
	
	    await message.react("⚠️");
            await message.reply(UNKNOWN_ISSUE);
            return;
	}

        // Must have Name field, and Name field value must not be blank:
        if (!post.hasOwnProperty("name") || (post.hasOwnProperty("name") && !post['name'].length)) {
            const [ respObj, response ] = await safeFetch(message, config, `/users/name/${message.author.id}`, { method: 'GET' });
            if (respObj === null && response === null) return;

            const [ lastNameUsed ] = response.body;
            if (lastNameUsed.length) post['name'] = lastNameUsed;
            else errors.push("The `Name` field should be submitted at least once.");
        }

        // If no date is provided, today's date will be used.
        if (!post.hasOwnProperty("date"))
            post.date = new Date();

        // Must have volunteer type.
        if (!post.hasOwnProperty("volunteer type"))
            errors.push("The \`Volunteer Type\` field should not be omitted.");

        // If post is of type outreach, duration is ignored.
        if (post.hasOwnProperty("volunteer type") && post["volunteer type"] === "outreach")
            post.duration = null;

        // Duration must not exceed max hours.
        if (post.hasOwnProperty("duration") && post["duration"] !== null && post["duration"] > config.maxHours)
            errors.push(`The \`Duration\` field has a maximum hours cap set by moderators. *Currently, the cap is ${config.maxHours} hours.*`);

        // If post is not of type outreach, must have duration.
        if (post.hasOwnProperty("volunteer type") && post["volunteer type"] !== "outreach" && !post.hasOwnProperty("duration"))
            errors.push("The `Duration` field should *not* be omitted if the `Volunteer Type` field does not evaluate to \"outreach\".");

        // If post is of type other, must have comment.
        if (post.hasOwnProperty("volunteer type") && post["volunteer type"] === "other" && !post.hasOwnProperty("comment"))
            errors.push("The \`Comment\` field is mandatory if the \`Volunteer Type\` field evaluates to \"other\".")
        
        // If post is not of type other and comment is empty, add a dummy comment field.
        if (post.hasOwnProperty("volunteer type") && post["volunteer type"] !== "other" && !post.hasOwnProperty("comment"))
            post.comment = "No comment.";

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

        post = stampPost(message, post);

        // Post data payload to server.
        const payload = {
            method: "POST",
            body: JSON.stringify(post),
            headers: { 'Content-Type': 'application/json' }
        };

        const [ respObj, response ] = await safeFetch(message, config, "/logs", payload);
        if (respObj === null && response === null) return;

        // Log all requests sent to bot console.
        if (config.debug)
            console.log(serverLog(post, response));

        // Send confirmation receipt.
        await message.react("✅");
        const receipt = buildReceipt(post, response);
        await message.author.send(receipt);

        // Tips are sent randomly.
        if (roll(config.tipRate)) {
            await message.channel.send(`**Pro tip!** ${_.sample(PRO_TIPS)}`);
        }

        return;
    
    // (debug) forward error to discord.
    } catch (e) {
        if (config.debug) await message.reply(debugText("Javascript Error", e.stack));
        console.error(e.stack);
        return;
    }
});

client.login(process.env.BOT_TOKEN);
