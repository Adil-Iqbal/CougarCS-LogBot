const { safeFetch } = require("../util");
const { UNKNOWN_ISSUE } = require("../copy");
const { s } = require('../httpStatusCodes');
const builderChannelId = process.env.BOT_BUILDER_CHANNEL_ID;

module.exports = {
	name: 'cancel',
    description: 'cancel an existing log request.',
    args: true,
    useApi: true,
    usage: '<string: confirmation number>',
    example: '5f9130e8f03101e7e3bcc984',
	execute: async (message, args, config, client) => {
        let confirmationNumber = String(args[0]);
        if (!!!confirmationNumber.match(/^[0-9a-f]{24}$/i)) {
            await message.react('⚠️');
            await message.reply(`*The argument should be a valid confirmation number.* You can find the confirmation number in the receipt we sent you when the log request was posted. If you deleted the receipt, than you may need to consult the folks at <#${builderChannelId}>.`);
            return;
        }

        const discordId = message.author.id;
        
        const [ respObj, response ] = await safeFetch(message, config, `/logs/${discordId}/${confirmationNumber}`, { method: "DELETE" });
        if (!respObj && !response) return;
        
        if (respObj.status == s.HTTP_200_OK && response.updated_user && response.deleted_log) {
            const { log_id, user_id } = response;
            let content = `**DO NOT REPLY**\nThe log belonging to <@${user_id}> with the confirmation number \`${log_id}\` has been cancelled`;
            if (user_id != message.author.id) {
                content += ` by <@${message.author.id}>.`;
                const user = await client.users.fetch(user_id);
                await user.send(content);
            } else content += ".";
            await message.author.send(content);
            await message.react("✅");
            return;
        }

        await message.react("⚠️");
        await message.reply(UNKNOWN_ISSUE);
        return;
	},
};