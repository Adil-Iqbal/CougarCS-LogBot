require('dotenv').config();
const _ = require('lodash');
const Discord = require('discord.js');

// Environment variables.
const channelId = process.env.CHANNEL_ID;
const chatChannelId = process.env.CHAT_CHANNEL_ID;
const builderChannelId = process.env.BOT_BUILDER_CHANNEL_ID;

const PRO_TIPS = [
    "If you start any message with two forward slashes, I'll ignore that message completely.",
    "If your log request is of type \"outreach\", then the \`Duration\` field is ignored.",
    "If your log request is of type \"other\", you must have a \`Comment\` field.",
    "If you send a message with just a question mark and nothing else, I'll send you a direct message with detailed instructions on how to log your hours.",
    "My code is open source, and you can see it here: <https://github.com/Adil-Iqbal/CougarCS-LogBot>",
    "Keeping the \`Name\` field consistent across all your log requests makes it easier to credit you for your work.",
    "Never submit a log request for someone else! If they've helped you, remind them to submit their own request to receive credit.",
    "Did you know that I attach your Discord ID to every log request you submit? It helps us detect any shenanigans and keeps the process fair for everyone.",
    `You can help make me better by contributing on the <#${builderChannelId}> channel! Any time spent contributing can be logged for credit.`,
    "When I react to a log request with a check mark emoji, it means that the request was successfully logged. That user should have a confirmation receipt in their direct messages.",
    "When I react to a log request with a warning emoji, it means that there was a problem with the log request. If your log request has a problem, I'll reply with helpful details!",
    `This channel is not the easiest place to have a conversation. Consider moving the discussion to <#${chatChannelId}>? :heart:`,
    "Did you know that the `Duration` field is converted to a decimal representing the logged hours? The following examples all evaluate to 1.5 hours:\n```\nDuration: 1h 30m\nDuration: 30m 1h\nDuration: 90m\n```",
    "You can get more detailed information about log requests by reading the documentation. Link: <https://tinyurl.com/logdocs1>",
    "You can get more detailed information about command requests by reading the documentation. Link: <https://tinyurl.com/cmddocs1>",
    "Whenever you post a successful log request, you are given a receipt that has a confirmation number. Did you know that you can cancel that request by using the `cancel` command? For example, if your confirmation number is `5f78dfc4bfc4ed66e5c321e3`, than you can cancel that log request using the following command:\n```\n$cancel 5f78dfc4bfc4ed66e5c321e3\n```",
    "There are certain commands you can run in this channel. Type `$help` and I'll reply with a list of those commands.",
    "You can check how many volunteer hours you've accrued and how many times you've reached out by using the `$stats` command in the chat.",
    "You'll never win if you're too busy counting the ways you'll lose.",
]

const LR_TEMPLATE = `Name: John Doe
Date: 03/08/2020
Volunteer Type: text
Duration: 1h 30m
Comment: Helped someone with linked lists.`

const WELCOME = `(version 1.0.0-BETA)
Copyright © 2020 All Rights Reserved.

**How To Log Your Hours**

Copy the template below and paste it into the chat. 
*IMPORTANT: Remember to update the info for your situation!*

\`\`\`
${LR_TEMPLATE}
\`\`\`
*This is a BETA test. Make sure to log your hours in <#${754386732312559676}>*`;

const HELP_MESSAGE = `**DO NOT REPLY**

**How To Log Your Hours**

Copy the template below and paste it into <#${channelId}>. 
*IMPORTANT: Remember to update the info for your situation!*

\`\`\`
${LR_TEMPLATE}
\`\`\`

**Best Practices**
- Keep the value of the \`Name\` field consistent across all your requests.
- Never submit a log request for someone other than yourself.
- If anyone helped you in your task, remind them that they should submit their own log request.
- Try to limit conversation in <#${channelId}>.

**Cliff Notes on Log Requests:**
- The \`Name\` field should not be omitted.
- The \`Name\` field should not exceed 100 characters.
- The \`Date\` field accepts the following formats: \`mm/dd/yyyy\`, \`mm/dd/yy\`, \`mm/dd\`
- The \`Date\` field assumes *current year* when the year is omitted.
- The \`Date\` field assumes *today* when its omitted entirely.
- The \`Date\` field requires that a forward slash (\`/\`) separate days, months, and years.
- The \`Volunteer Type\` field should not be omitted.
- The \`Volunteer Type\` field should contain one of the following key words: text, voice, group, outreach, other.
- The \`Duration\` field requires \`Xh Ym\` format. (X and Y are whole numbers representing hours and minutes respectively)
- The \`Duration\` field can be omitted if the \`Volunteer Type\` field evaluates to "outreach".
- The \`Duration\` field should *not* be omitted if the \`Volunteer Type\` field does not evaluate to "outreach".
- The \`Comment\` field is optional for most volunteer types.
- The \`Comment\` field is mandatory if the \`Volunteer Type\` field evaluates to "other".
- The \`Comment\` field is *always* truncated to 140 characters.

You can get more details about log requests (with examples) by reading the documentation.
Documentation: <https://tinyurl.com/logdocs1>
`;

const NOT_A_REQUEST = `*Hmm... that doesn't look like a log request.* Send the message "?" (without quotations) and I'll privately message you some instructions on how to log your hours. If you start your message with two forward slashes, I'll ignore that message completely. Alternatively, you can move your convo to <#${chatChannelId}>.`;

const API_DOWN = `*Oops! The API is acting weird.* Would you mind trying again later? Also, informing the folks at <#${builderChannelId}> might speed things along.`

const DATABASE_DOWN = `*Oops! The database is acting weird.* Would you mind trying again later? Also, informing the folks at <#${builderChannelId}> might speed things along.`;

const UNKNOWN_ISSUE = `*Oops! Something went wrong.*  Would you mind trying again later? Also, informing the folks at <#${builderChannelId}> might speed things along.`;

const PERMISSION_DENIED = `*I'm not allowed to do that! Your credentials don't check out.* Your next step is to check with the folks at  <#${builderChannelId}>. They may not be able to change your credentials, but they can give you more info than I can.`;

const LOCKED = "*I'm not allowed to do that! I've been locked.* You'll have to ask one of the head honchos to unlock before I can take any requests. You can still use commands.";

const USER_NOT_FOUND = "*We didn't find you in our records.* We create a record for users when they make their first log request. You might try making a log request and running this command again."

const LOG_NOT_FOUND = `*We did not find that log in our record!* We create logs when a log request is posted. Are you sure that the log was submitted? Did you receive a confirmation receipt? Perhaps the log has already been deleted? You may need to check with the folks at <#${builderChannelId}>.`;

const buildReceipt = (post, response) => {
    let duration = post.duration ? post.duration + " hours" : "Exempt";
    return new Discord.MessageEmbed()
        .setColor('#c8102e')
        .setTitle('Confirmation Receipt')
        .setDescription('Your request has been successfully logged. Thank you for offering your time!')
        .setThumbnail('https://i.imgur.com/dGfZBJE.png')
        .addFields(
            { name: 'Confirmation Number', value: response.log_id  },
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

const serverLog = async (post, response) => `${post.metadata.timestamp.toString()} - POST - ${(await response.id)} ${post.metadata.discord_id} ${post["volunteer type"]} ${post.duration} hours.`;

const debugText = (title, source, lang="") => {
    const maxLength = 2000 - (title.length + 20);
    if (lang == 'json' && _.isObject(source)) source = JSON.stringify(source, null, 4); 
    return `*${title}*\n\`\`\`${lang}\n${_.truncate(source, { length: maxLength })}\n\`\`\``;;
}

module.exports = {
    WELCOME,
    PRO_TIPS,
    LR_TEMPLATE,
    HELP_MESSAGE,
    NOT_A_REQUEST,
    API_DOWN,
    DATABASE_DOWN,
    PERMISSION_DENIED,
    LOCKED,
    USER_NOT_FOUND,
    UNKNOWN_ISSUE,
    LOG_NOT_FOUND,
    buildReceipt,
    serverLog,
    debugText,
}