const { UNKNOWN_ISSUE } = require('../copy');
const _ = require('lodash');

module.exports = {
	name: 'config',
    description: 'prints out bot\'s current configuration settings.',
    args: false,
	usage: '',
	example: '',
	execute: async (message, args, config, client) => {
        configMessage = 'These are the configuration settings I\'m using right now...\n\n';
        for (const [key, value] of Object.entries(config)) configMessage += `${_.startCase(key)}: **${value}**\n`;
        if (!configMessage.length) configMessage = UNKNOWN_ISSUE;
        await message.react("✅");
		await message.channel.send(configMessage);
	},
};