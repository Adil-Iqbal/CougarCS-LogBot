module.exports = {
	name: 'lock',
    description: 'prevent bot from taking log requests.',
    args: false,
    usage: '',
    superuserOnly: true,
    unfrozenOnly: true,
	execute: async (message, config) => {
        config.lock = !config.lock;

        // TODO: Finish this request on bot end and api end.
        await fetch(`${config.host}/config`, config);

        // Message
        let reply = "I will no longer be taking requests. Though, you can still use commands!";
        if (!config.lock) replay = "Ladies and gentlemen, we're back in business! Request away.";
        await message.reply(reply);
	},
};