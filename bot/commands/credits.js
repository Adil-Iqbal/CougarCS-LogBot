const package = require("../../package.json");
const { CONTRIBUTORS } = require("../copy");

module.exports = {
	name: 'credits',
    description: 'receive a dm with a list of all contributors.',
    args: false,
	usage: '',
	example: '',
	execute: async (message, args, config, client) => {
        await message.react("✅");
        await message.author.send(CONTRIBUTORS);
        return;
	},
};