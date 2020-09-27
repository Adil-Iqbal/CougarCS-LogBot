module.exports = {
	name: 'ping',
    description: 'Ping!',
    args: false,
    usage: '',
	execute(message) {
		message.channel.send('Pong.');
	},
};