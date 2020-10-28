const package = require("../../package.json");
const { CONTRIBUTING } = require("../copy");

module.exports = {
	name: 'version',
    description: 'receive a dm with a list of all contributors.',
    args: false,
	usage: '',
	example: '',
	execute: async (message, args, config, client) => {
		await message.author.send(CONTRIBUTING);
	},
};