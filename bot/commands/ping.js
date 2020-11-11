module.exports = {
	name: 'ping',
    description: 'Ping!',
    args: false,
	usage: '',
	example: '',
	execute: async (message, args, config, client) => {
		await message.react("✅");
		await message.channel.send('Pong.');
	},
};