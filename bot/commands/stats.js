const { safeFetch } = require("../util");
const { s } = require('../httpStatusCodes');
const bigNumber = 1_000_000;

module.exports = {
	name: 'stats',
    description: 'lookup cumulative number of hours/outreach done.',
    args: false,
    usage: '<int days>',
	execute: async (message, args, config) => {
        // Resolve argument.
        if (!args && !args[0]) args = [bigNumber];
        const days = parseInt(args[0]);
        if (isNaN(days)) {
            await message.react('⚠️');
            await message.reply(`*I didn't understand.* The usage is as follows: ${config.prefix}stats <int days>`);
            return;
        }

        // Construct body.
        const body = {
            command: "stats",
            args: [days],
        }

        const payload = {
            method: "GET",
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        }

        const [ respObj, response ] = await safeFetch(message, config, "/users", payload);
        if (!respObj && !response) return;

        if (respObj.status == s.HTTP_404_NOT_FOUND) {
            await message.react("⚠️");
            await message.author.send("*We didn't find you in our records.*");
            return;
        }

        if (respObj.status == s.HTTP_200_OK) {
            response = JSON.parse(response);
            const { date, hours, outreach } = response;
            const content = `Since ${date}, you have volunteered **${hours}** hours and participated in outreach ${outreach} ${outreach === 1 ? "time" : "times"}. Thank you! It means a lot to us. :heart:`;
            await message.react("✅");
            await message.author.send(content);
        }
	},
};