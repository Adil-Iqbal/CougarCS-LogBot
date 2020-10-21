module.exports = {
	name: 'ping',
    description: 'Ping!',
    args: false,
    usage: '',
	execute(message, args, config, client) {
		message.channel.send('Pong.');
	},
};