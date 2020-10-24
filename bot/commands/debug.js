const { safeFetch } = require("../util");
const { UNKNOWN_ISSUE } = require("../copy");
const { s } = require('../httpStatusCodes');

module.exports = {
	name: 'debug',
    description: 'toggle debug mode.',
    args: false,
    usage: '',
    example: '',
    useApi: true,
    superuserOnly: true,
	execute: async (message, args, config, client) => {

        const prev = config.debug;
        const _new = !prev;
        config.debug = _new;

        const payload = {
            method: "UPDATE",
            body: JSON.stringify(config),
            headers: { 'Content-Type': 'application/json' }
        }

        config.debug = false;
        const [ respObj, response ] = await safeFetch(message, config, "/config", payload);
        if (!respObj && !response) {
            config.debug = prev;
            return;
        }

        if (respObj.status == s.HTTP_200_OK) {
            config.debug = _new;
            await message.react("✅");
            let mode = "activated";
            if (!config.debug) mode = "de" + mode;
            let content = `\`\`\`\nDebug mode ${mode}\n\`\`\``;
            await message.channel.send(content);
            return;
        }

        await message.react("⚠️");
        await message.reply(UNKNOWN_ISSUE);
        return;
	},
};