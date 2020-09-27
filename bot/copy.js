require('dotenv').config();
const Discord = require('discord.js');

// Environment variables.
const channelId = process.env.CHANNEL_ID;
const chatChannelId = process.env.CHAT_CHANNEL_ID;
const builderChannelId = process.env.BOT_BUILDER_CHANNEL_ID;

exports.PRO_TIPS = [
    "If you start any message with two forward slashes, I'll ignore that message completely.",
    "If your log request is of type \"outreach\", then the \`Duration\` field is ignored.",
    "If your log request is of type \"other\", you must have a \`Comment\`.",
    "If you send a message with just a question mark and nothing else, I'll send you a direct message with detailed instructions on how to log your hours.",
    "My code is open source, and you can see it here: https://github.com/Adil-Iqbal/CougarCS-LogBot",
    "Keeping the \`Name\` field consistent across all your log requests makes it easier to credit you for your work.",
    "Never submit a log request for someone else! If they've helped you, remind them to submit their own request to receive credit.",
    "Did you know that I attach your Discord ID to every log request you submit? It helps us detect any shenanigans and keeps the process fair for everyone.",
    `You can help make me better by contributing on the <#${builderChannelId}> channel! Any time spent contributing can be logged for credit.`,
    "When I react to a log request with a check mark emoji, it means that the request was successfully logged. That user should have a confirmation receipt in their direct messages.",
    "When I react to a log request with a warning emoji, it means that there was a problem with the log request. If your log request has a problem, I'll reply with helpful details!",
    `This channel is not the easiest place to have a conversation. Consider moving the discussion to <#${chatChannelId}>? :heart:`,
    "Did you know that the `Duration` field is converted to a decimal representing the logged hours? The following examples all evaluate to 1.5 hours:\n```\nDuration: 1h 30m\nDuration: 30m 1h\nDuration: 90m\n```",
]

exports.HELP_MESSAGE = `**DO NOT REPLY**

**How To Log Your Hours**

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

Thank you so much for your time! :heart:
`;

exports.NOT_A_REQUEST = `*Hmm... that doesn't look like a log request.* Send the message "?" and I'll privately message you some instructions on how to log your hours.

**Pro tip!** If you start your message with two forward slashes, I'll ignore the message completely. Alternatively, you can move your convo to <#${chatChannelId}>.`;

exports.API_DOWN = `*Oops! The API is acting weird.* Would you mind trying again later? Also, informing the folks at <#${builderChannelId}> might speed things along.`


exports.PERMISSION_DENIED = `*I'm not allowed to do that! Your credentials don't check out.* Your next step is to check with the folks at  <#${builderChannelId}>. They may not be able to change your credentials, but they can give you more info than I can.`;

exports.LOCKED = "*I'm not allowed to do that! I've been locked.* You'll have to ask one of the head honchos to unlock before I can take any requests. You can still use commands.";

exports.buildReceipt = (post, response) => {
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

exports.serverLog = async (post, response) => `${post.metadata.timestamp.toString()} - POST - ${(await response.id)} ${post.metadata.discord_id} ${post["volunteer type"]} ${post.duration} hours.`;

exports.debugText = (title, source, lang="") => `*${title}*\n\`\`\`${lang}\n${source}\n\`\`\``;