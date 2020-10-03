const { safeFetch } = require("../util");
const { UNKNOWN_ISSUE } = require("../copy");
const { s } = require('../httpStatusCodes');
const builderChannelId = process.env.BOT_BUILDER_CHANNEL_ID;

module.exports = {
	name: 'cancel',
    description: 'cancel an existing log request.',
    args: true,
    usage: '<string: confirmation number>',
	execute: async (message, args, config) => {
        let confirmationNumber = String(args[0]);
        if (!!!confirmationNumber.match(/^[0-9a-f]{24}$/i)) {
            await message.react('⚠️');
            await message.reply(`*The argument should be a valid confirmation number.* You can find the confirmation number in the receipt we sent you when the log request was posted. If you deleted that message, than you may need to consult the folks at <#${builderChannelId}>.`);
            return;
        }

        const discordId = message.author.id;
        
        const [ respObj, response ] = await safeFetch(message, config, `/logs/${discordId}/${confirmationNumber}`, { method: "DELETE" });
        if (!respObj && !response) return;
        
        if (respObj.status == s.HTTP_200_OK && response.updated_user && response.deleted_log) {
            const { log_id, user_id } = response;
            const content = `The log with the confirmation number \`${log_id}\` has been cancelled. If this was done in error, <@${user_id}> will have to post another log request.`;
            await message.channel.send(content);
            await message.react("✅");
            return;
        }

        await message.react("⚠️");
        await message.author.send(UNKNOWN_ISSUE);
        return;
	},
};