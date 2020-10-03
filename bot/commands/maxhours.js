const { safeFetch } = require("../util");
const { s } = require('../httpStatusCodes');

module.exports = {
	name: 'maxhours',
    description: 'change the maximum number of hours that can be logged at once.',
    args: true,
    usage: '<int: hours>',
    superuserOnly: true,
	execute: async (message, args, config) => {
        const newHours = parseInt(args[0]);
        if (newHours < 0 || newHours > 24) {
            await message.react('⚠️');
            await message.reply("*The argument should be a whole number between 0 and 24 (inclusive).*");
            return;
        }
        
        const prevHours = newHours;
        config.maxHours = newHours;

        const payload = {
            method: "UPDATE",
            body: JSON.stringify(config),
            headers: { 'Content-Type': 'application/json' }
        }

        config.maxHours = prevHours;
        const [ respObj, response ] = await safeFetch(message, config, "/config", payload);
        if (!respObj && !response) return;


        if (respObj.status == s.HTTP_200_OK) {
            config.maxHours = newHours;
            await message.react("✅");
            let content = `The maximum number of hours that can be logged in one post is now ${config.maxHours}.`;
            await message.channel.send(content);
        }
	},
};