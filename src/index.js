require('dotenv').config();

const guildId = process.env.GUILD_ID;
const channelId = process.env.CHANNEL_ID;

const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', async (msg) => {

    // Restrict bot to specific discord server and specific channel.
	if (msg.guild.id === guildId && msg.channel.id === channelId) {

        // Parse message content.
        if (msg.content === "!ping") {
            await msg.channel.send("Pong!");
        } else if (msg.content === "!beep") {
            await msg.channel.send("Boop!")
        }
    }
});

client.login(process.env.BOT_TOKEN);