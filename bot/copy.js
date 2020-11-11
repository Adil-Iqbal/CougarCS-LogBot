require('dotenv').config();
const _ = require('lodash');
const Discord = require('discord.js');
const package = require("../package.json");

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
    "If you decide not to submit a \`Name\` field with your log request, I'll try to use the last name you submitted.", 
    "Never submit a log request for someone else! If they've helped you, remind them to submit their own request to receive credit.",
    "Did you know that I attach your Discord ID to every log request you submit? It helps us detect any shenanigans and keeps the process fair for everyone.",
    `You can help make me better by contributing on the <#${builderChannelId}> channel! Any time spent contributing can be logged for credit.`,
    "When I react to a log request with a check mark emoji, it means that the request was successfully logged. That user should have a confirmation receipt in their direct messages.",
    "When I react to a log request with a warning emoji, it means that there was a problem with the log request. If your log request has a problem, I'll reply with helpful details!",
    `This channel is not the easiest place to have a conversation. Consider moving the discussion to <#${chatChannelId}>? :heart:`,
    "Did you know that the `Duration` field is converted to a decimal representing the logged hours? The following examples all evaluate to 1.5 hours:\n```\nDuration: 1h 30m\nDuration: 30m 1h\nDuration: 90m\n```",
    "You can get more detailed information about log requests by reading the documentation. Link: <https://tinyurl.com/logdocs1>",
    "You can get more detailed information about command requests by reading the documentation. Link: <https://tinyurl.com/cmddocs1>",
    "You can check the progress of my development in my changelog. It may even reveal upcoming features! Link: <https://tinyurl.com/changelog2>",
    "Whenever you post a successful log request, you are given a receipt that has a confirmation number. Did you know that you can cancel that request by using the `cancel` command? For example, if your confirmation number is `5f78dfc4bfc4ed66e5c321e3`, than you can cancel that log request using the following command:\n```\n$cancel 5f78dfc4bfc4ed66e5c321e3\n```",
    "Type `$help` and I'll reply with a list of commands that can be used in this channel.",
    "You can check how many volunteer hours you've accrued and how many times you've reached out by using the `$stats` command in the chat.",
    "You'll never win if you're too busy counting the ways you'll lose.",
    "All progress takes place outside the comfort zone.",
    "If you hold `SHIFT` while pressing `ENTER`, you'll add a newline character to your chat message.",
    "It's probably a good idea to mute this channel.",
    "If you use the `$credits` command, I'll send you a direct message with a list of my parents!",
    "Whenever you submit a request with a \`Name\` field, I'll remember the name and use it! Even if you leave the \`Name\` field out for all other log requests.",
    "You can submit the \`Name\` field on its own.",
    "Whatever you do, don't use the `$ping` command!",
    "If you reached out more than once, instead of posting several log requests, use the \`Outreach Count\` field.",
    "Did you know that if you use the `Outreach Count` field without stating the volunteer type, the log request will *assume* it's an outreach log?",
    "A relationship should complement you, not complete you. You can’t expect someone to love you until you love yourself.",
]

const LR_TEMPLATE = `Name: John Doe
Date: 03/08/2020
Volunteer Type: text
Duration: 1h 30m
Comment: Helped someone with linked lists.`

const WELCOME = `Version ${package.version}
Copyright © 2020 All Rights Reserved.

**Type "?" (without quotations) for instructions on how to log your hours.**`;

const HELP_MESSAGE = `**DO NOT REPLY**

**How To Log Your Hours**

Copy the template below and paste it into <#${channelId}>. 
*IMPORTANT: Remember to update the info for your situation!*

\`\`\`
${LR_TEMPLATE}
\`\`\`

**Best Practices**
- Never submit a log request for someone other than yourself.
- If anyone helped you in your task, remind them that they should submit their own log request.
- Please keep conversation in the <#${channelId}> channel to a minimum.
- Keep the value of the \`Name\` field consistent across all your requests.

**Cliff Notes on Log Requests:**
- The \`Name\` field should not exceed 100 characters.
- The \`Date\` field accepts the following formats: \`mm/dd/yyyy\`, \`mm/dd/yy\`, \`mm/dd\`
- The \`Date\` field requires that a forward slash (\`/\`) separate days, months, and years.
- The \`Volunteer Type\` field should not be omitted.
- The \`Volunteer Type\` field should contain one of the following keywords: text, voice, group, outreach, other.
- The \`Duration\` field requires \`Xh Ym\` format. (X and Y are whole numbers representing hours and minutes respectively)
- The \`Comment\` field is mandatory if the \`Volunteer Type\` field evaluates to "other".

**Volunteer Type Keywords**
- Use the **text** keyword when assisting a user via written correspondence.
- Use the **voice** keyword when assisting a user via audio or video correspondence.
- Use the **group** keyword when assisting more than one user simultaneously.
- Use the **outreach** keyword when advertising CougarCS to other potential users.
- Use the **other** keyword if no other keyword fits your use case.

Documentation: <https://tinyurl.com/logdocs1>
`;

const CONTRIBUTORS = `**DO NOT REPLY**

:sunflower: :rosette: :rose: ***Meet my Parents!*** :tulip: :rose: :sunflower: 

<@593491742255218718> (Adil I)
<@403106061076267019> (Nykolas F)
<@559058273370898434> (Braian P)
<@529779221573271554> (Aryan N)
<@358703489020461066> (Ibrahim K)
<@670065013368815617> (Loveleen T)
<@131626920738684928> (Bryan N)
<@288918080590053386> (Seth L)
<@181268691432898560> (Shaheer K)
<@66009594610069504> (Jacob H)
<@416849441857994753> (Samir S)
<@569887884669353984> (Nhat B)

`;

const NOT_A_REQUEST = `*Hmm... that doesn't look like a log request.* Send the message "?" (without quotations) and I'll privately message you some instructions on how to log your hours. If you start your message with two forward slashes, I'll ignore that message completely. Alternatively, you can move your convo to <#${chatChannelId}>.`;

const API_DOWN = `*Oops! The API is acting weird.* Would you mind trying again later? Also, informing the folks at <#${builderChannelId}> might speed things along.`

const DATABASE_DOWN = `*Oops! The database is acting weird.* Would you mind trying again later? Also, informing the folks at <#${builderChannelId}> might speed things along.`;

const UNKNOWN_ISSUE = `*Oops! Something went wrong.*  Would you mind trying again later? Also, informing the folks at <#${builderChannelId}> might speed things along.`;

const PERMISSION_DENIED = `*I'm not allowed to do that! Your credentials don't check out.* Your next step is to check with the folks at  <#${builderChannelId}>. They may not be able to change your credentials, but they can give you more info than I can.`;

const LOCKED = "*I'm not allowed to do that! I've been locked.* You'll have to ask one of the head honchos to unlock before I can take any requests. You can still use commands.";

const USER_NOT_FOUND = "*We didn't find you in our records.* We create a record for users when they make their first log request. You might try making a log request and running this command again."

const LOG_NOT_FOUND = `*We did not find that log in our record!* Perhaps the log has already been deleted? You may need to check with the folks at <#${builderChannelId}>.`;

const buildReceipt = (post, response) => {
    // let duration = post.duration ? post.duration + " hours" : "Exempt";
    const orCount = post["outreach count"];
    const durationField = { name: 'Duration', value: `${post.duration} hour${post.duration == 1 ? '' : 's'}`, inline: true };
    const outreachField = { name: 'Outreach Count', value: `${orCount} time${orCount == 1 ? '' : 's'}`, inline: true };
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
            post.duration ? durationField : outreachField,
            { name: 'Volunteer Type', value: post["volunteer type"], inline: true },
            { name: '\u200B', value: '\u200B', inline: true },
            { name: 'Comment', value: post.comment  },
        )
        .setTimestamp()
        .setFooter(`CougarCS reserves the right to handle shenanigans as necessary.`);
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
    CONTRIBUTORS,
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