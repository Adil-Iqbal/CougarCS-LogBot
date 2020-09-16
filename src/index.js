require('dotenv').config();

const guildId = process.env.GUILD_ID;
const channelId = process.env.CHANNEL_ID;

const Discord = require('discord.js');
const client = new Discord.Client();

const FORM_LABELS = [
    "Name",
    "Date",
    "Volunteer Type",
    "Duration",
    "Comment",
]

function extract(label, line) {
    return line.substring(label.length + 1);
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', async (msg) => {

    // Restrict bot to specific discord server and specific channel.
    if (msg.guild.id === guildId && 
        msg.channel.id === channelId && 
        !msg.author.bot) {

        // Parse message content.
        let content = msg.content;
        content = content.split("\n");
        for (let line of content) {
            for (let label of FORM_LABELS) {
                if (line.startsWith(`${label}:`)) {
                    let value = extract(label, line);
                    await msg.reply(value);
                }
            }
        }
        return;
    }
});

client.login(process.env.BOT_TOKEN);