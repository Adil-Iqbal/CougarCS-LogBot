const { safeFetch } = require("../util");
const { s } = require('../httpStatusCodes');
const { UNKNOWN_ISSUE } = require("../copy");

module.exports = {
	name: 'maxoutreach',
    description: 'change the maximum outreach count per log request.',
    args: true,
    usage: '<int: count>',
    example: '6',
    useApi: true,
    superuserOnly: true,
	execute: async (message, args, config, client) => {
        const newOutreach = parseInt(args[0]);
        if (newOutreach < 1 || newOutreach > 99 || isNaN(newOutreach)) {
            await message.react('⚠️');
            await message.reply("*The argument should be a whole number between 1 and 99 (inclusive).*");
            return;
        }

        if (newOutreach == config.maxOutreach) {
            await message.react('⚠️');
            await message.reply(`*The maximum outreach count per post is already ${config.maxOutreach} time(s).*`);
            return;
        }
        
        const prevOutreach = newOutreach;
        config.maxOutreach = newOutreach;

        const payload = {
            method: "UPDATE",
            body: JSON.stringify(config),
            headers: { 'Content-Type': 'application/json' }
        }

        config.maxOutreach = prevOutreach;
        const [ respObj, response ] = await safeFetch(message, config, "/config", payload);
        if (!respObj && !response) return;


        if (respObj.status == s.HTTP_200_OK) {
            config.maxOutreach = newOutreach;
            await message.react("✅");
            let content = `The maximum outreach count that can be logged in one post is now ${config.maxOutreach}.`;
            await message.channel.send(content);
            return;
        }

        await message.react("⚠️");
        await message.reply(UNKNOWN_ISSUE);
        return;
	},
};