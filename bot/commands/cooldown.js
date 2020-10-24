const { safeFetch } = require("../util");
const { s } = require('../httpStatusCodes');
const { UNKNOWN_ISSUE } = require("../copy");

module.exports = {
	name: 'cooldown',
    description: 'change the default cooldown rate of commands.',
    args: true,
    usage: '<int: seconds>',
    example: '3',
    useApi: true,
    superuserOnly: true,
	execute: async (message, args, config, client) => {
        const newValue = parseInt(args[0]);
        if (isNaN(newValue) || newValue < 0 || newValue >= 86400) {
            await message.react('⚠️');
            await message.reply("*The argument should be a whole number between 0 and 86400 (inclusive).*");
            return;
        }

        if (newValue == config.cooldown) {
            await message.react('⚠️');
            await message.reply(`*The default cooldown is already set to ${config.cooldown} second(s).*`);
            return;
        }

        const prev = config.cooldown;
        config.cooldown = newValue;

        const payload = {
            method: "UPDATE",
            body: JSON.stringify(config),
            headers: { 'Content-Type': 'application/json' }
        }

        config.cooldown = prev;
        const [ respObj, response ] = await safeFetch(message, config, "/config", payload);
        if (!respObj && !response) return;

        if (respObj.status == s.HTTP_200_OK) {
            config.cooldown = newValue;
            await message.react("✅");
            let content = `The default cooldown for commands has been changed to ${newValue} second(s).`;
            await message.channel.send(content);
            return;
        }

        await message.react("⚠️");
        await message.reply(UNKNOWN_ISSUE);
        return;
	},
};