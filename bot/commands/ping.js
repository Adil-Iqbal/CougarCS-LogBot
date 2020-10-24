module.exports = {
	name: 'ping',
    description: 'Ping!',
    args: false,
	usage: '',
	example: '',
	execute(message, args, config, client) {
		message.channel.send('Pong.');
	},
};