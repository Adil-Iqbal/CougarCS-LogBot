const { safeFetch } = require("../util");

module.exports = {
	name: 'lock',
    description: 'prevent bot from taking log requests.',
    args: false,
    usage: '',

	execute: async (message, _, config) => {
        config.lock = !config.lock;

        // TODO: Finish this request on bot end and api end.
        const payload = {
            method: "UPDATE",
            body: JSON.stringify({ "config": config, "discord_id": message.author.id }),
            headers: { 'Content-Type': 'application/json' }
        }
        const [ respObj, response ] = await safeFetch(message, config, `${config.host}/config`, payload);
        if (!respObj && !response) return;

        let reply = "I will no longer be taking requests. Though, you can still use commands!";
        if (!config.lock) reply = "Ladies and gentlemen, we're back in business! Request away.";
        await message.reply(reply);
	},
};