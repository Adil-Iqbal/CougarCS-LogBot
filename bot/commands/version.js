require('dotenv').config();
const package = require("../../package.json");
const botEnv = process.env.BOT_ENV;

module.exports = {
	name: 'version',
    description: 'reply with the current version of the bot',
    args: false,
	usage: '',
	example: '',
	execute: async (message, args, config, client) => {
		await message.reply(`I'm currently running under version **${package.version}** in a **${botEnv === 'prod' ? "production" : "development"}** environment!`);
	},
};