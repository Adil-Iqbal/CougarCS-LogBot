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

function getDate(string) {
    if (!string) return new Date();
  
    let [ month, day, year ] = string.split('/');
  
    year = Number(year);
    month = Number(month);
    day = Number(day);
  
    if (isNaN(year)) year = new Date().getFullYear();
    if (year <= 50) year += 2000;
    if (year < 100 && year > 50) year += 1900;
  
    return new Date(year, month - 1, day);
  };

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

        let post = {};
        let outreach = false;
        let other = false;
        for (let line of content) {
            for (let label of FORM_LABELS) {
                if (line.startsWith(`${label}:`)) {
                    let value = extract(label, line);

                    if (label === "Date") {
                        post[label.toLowerCase()] = getDate(value.trim());
                    } else {
                        post[label.toLowerCase()] = value.trim();
                    }
                }
            }
        }
        msg.reply(JSON.stringify(post, null, 4));
        return;
    }
});

client.login(process.env.BOT_TOKEN);