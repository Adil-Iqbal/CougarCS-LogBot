require('dotenv').config();
const _ = require('lodash');

const guildId = process.env.GUILD_ID;
const channelId = process.env.CHANNEL_ID;
const chatChannelId = process.env.CHAT_CHANNEL_ID;
const builderChannelId = process.env.BOT_BUILDER_CHANNEL_ID;

const Discord = require('discord.js');
const client = new Discord.Client();

const FORM_LABELS = [
    "Name",
    "Date",
    "Volunteer Type",
    "Duration",
    "Comment",
]

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
]

function extract(label, line) {
    return line.substring(label.length + 1).trim();
}

const convertTime = time => {
    const tokens = time.split(" ");
    let output = 0;
   
    tokens.forEach( token => {
      if ( token.indexOf('h') != -1 ) output += parseInt( token.substring( 0, token.indexOf('h') ) );
   
      else if ( token.indexOf('m') != -1 ) {
        let minutes = parseInt( token.substring( 0, token.indexOf('m') ) );
   
        while ( minutes >= 60 ) { minutes -= 60; output++; }
   
        output += minutes/60;
      }
    } );
   
    return Number(output.toFixed(2));
  };

function getDate(string) {
    if (!string) return new Date();
  
    let [ month, day, year ] = string.split('/');
  
    year = Number(year);
    month = Number(month);
    day = Number(day);
  
    if (isNaN(year) || (year < 1000 && year >= 100)) year = new Date().getFullYear();
    if (year <= 50) year += 2000;
    if (year < 100 && year > 50) year += 1900;
  
    return new Date(year, month - 1, day);
  };

const roll = function(n) {
    return !!n && Math.random() <= n;
};


client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', async (msg) => {

    // Restrict bot to specific discord server and specific channel.
    if (msg.guild.id === guildId && 
        msg.channel.id === channelId && 
        !msg.author.bot &&
        !msg.content.startsWith("//")) {
        
        // Tips are sent on average every 1/5 log requests.
        if (roll(0.2)) {
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
        
        // msg.reply(JSON.stringify(post, null, 4));
        await msg.react("✅");
        return;
    }
});

client.login(process.env.BOT_TOKEN);