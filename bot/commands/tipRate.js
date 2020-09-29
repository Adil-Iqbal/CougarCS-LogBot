const { safeFetch } = require("../util");
const { s } = require('../httpStatusCodes');

module.exports = {
	name: 'tipRate',
    description: 'change the rate the bot provides random tips.',
    args: true,
    usage: '<float rate>',
	execute: async (message, args, config) => {
        const newRate = Number(Number(args[0]).toFixed(3));
        if (newRate < 0 || newRate > 1) {
            await message.react('⚠️');
            await message.reply("*The argument should be between 0 and 1 (inclusive).*");
            return;
        }
        const prevRate = newRate;
        config.tipRate = newRate;

        const payload = {
            method: "UPDATE",
            body: JSON.stringify(config),
            headers: { 'Content-Type': 'application/json' }
        }

        const [ respObj, response ] = await safeFetch(message, config, "/config", payload);
        if (!respObj && !response) {
            config.tipRate = prevRate;
            return;
        };

        if (respObj.status == s.HTTP_200_OK) {
            await message.react("✅");
            let content = `The new tip rate has been set to ${newRate * 100}.`;
            await message.channel.send(content);
        }
	},
};