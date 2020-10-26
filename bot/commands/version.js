const package = require("../../package.json");

module.exports = {
	name: 'version',
    description: 'reply with the current version of the bot',
    args: false,
	usage: '',
	example: '',
	execute: async (message, args, config, client) => {
		await message.reply(`I'm currently running under version **${package.version}**!\nCheck out the changelog for more info: <https://tinyurl.com/changelog2>`);
	},
};