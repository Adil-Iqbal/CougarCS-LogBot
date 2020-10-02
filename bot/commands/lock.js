const { safeFetch } = require("../util");
const { s } = require('../httpStatusCodes');

module.exports = {
	name: 'lock',
    description: 'prevent bot from taking log requests.',
    args: false,
    usage: '',
    superuserOnly: true,
	execute: async (message, args, config) => {
        if (config.lock === true) {
            await message.react('⚠️');
            await message.reply("*I'm already locked.* Did you mean to use `$unlock`?");
            return;
        }

        config.lock = true;

        const payload = {
            method: "UPDATE",
            body: JSON.stringify(config),
            headers: { 'Content-Type': 'application/json' }
        }

        config.lock = false;
        const [ respObj, response ] = await safeFetch(message, config, "/config", payload);
        if (!respObj && !response) return;

        if (respObj.status == s.HTTP_200_OK) {
            config.lock = true;
            await message.react("✅");
            let content = "@here, Until further notice, I will no longer be taking requests. Though, you can still use commands.";
            await message.channel.send(content);
        }
	},
};