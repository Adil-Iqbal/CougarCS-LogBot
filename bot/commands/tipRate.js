const { safeFetch } = require("../util");
const { s } = require('../httpStatusCodes');

module.exports = {
	name: 'tiprate',
    description: 'change the rate the bot provides random tips.',
    args: true,
    usage: '<float rate>',
    superuserOnly: true,
	execute: async (message, args, config) => {
        let newRate = Number(args[0]);
        if (isNaN(newRate) || newRate < 0 || newRate > 1) {
            await message.react('⚠️');
            await message.reply("*The argument should be a decimal between 0 and 1 (inclusive).*");
            return;
        }

        newRate = Number(newRate.toFixed(3));
        const prevRate = config.tipRate;
        config.tipRate = newRate;

        const payload = {
            method: "UPDATE",
            body: JSON.stringify(config),
            headers: { 'Content-Type': 'application/json' }
        }

        config.tipRate = prevRate;
        const [ respObj, response ] = await safeFetch(message, config, "/config", payload);
        if (!respObj && !response) return;

        if (respObj.status == s.HTTP_200_OK) {
            config.tipRate = newRate;
            await message.react("✅");
            let content = `Every post now has a ${newRate * 100}% chance to spawn a pro tip.`;
            await message.channel.send(content);
        }
	},
};