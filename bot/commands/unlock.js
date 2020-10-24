const { safeFetch } = require("../util");
const { s } = require('../httpStatusCodes');
const { UNKNOWN_ISSUE } = require("../copy");

module.exports = {
	name: 'unlock',
    description: 'allow bot to interact with api.',
    args: false,
    usage: '',
    example: '',
    useApi: true,
    lockExempt: true,
    superuserOnly: true,
	execute: async (message, args, config, client) => {
        if (config.lock === false) {
            await message.react('⚠️');
            await message.reply("*I'm already unlocked.*");
            return;
        }

        config.lock = false;

        const payload = {
            method: "UPDATE",
            body: JSON.stringify(config),
            headers: { 'Content-Type': 'application/json' }
        }

        config.lock = true;
        const [ respObj, response ] = await safeFetch(message, config, "/config", payload);
        if (!respObj && !response) return;

        if (respObj.status == s.HTTP_200_OK) {
            config.lock = false;
            await message.react("✅");
            let content = "@here, Ladies and gentlemen, we're back in business. Request away!";
            await message.channel.send(content);
            return;
        }

        await message.react("⚠️");
        await message.reply(UNKNOWN_ISSUE);
        return;
	},
};