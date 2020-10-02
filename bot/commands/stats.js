const { safeFetch } = require("../util");
const { UNKNOWN_ISSUE, USER_NOT_FOUND, debugText } = require("../copy");
const { s } = require('../httpStatusCodes');
const bigNumber = 1_000_000;

module.exports = {
	name: 'stats',
    description: 'lookup cumulative number of hours/outreach done.',
    args: false,
    usage: '',
	execute: async (message, args, config) => {
        const discordId = message.author.id;
        
        const [ respObj, response ] = await safeFetch(message, config, `/users/stats/${discordId}`, { method: "GET" });
        if (!respObj && !response) return;

        if (respObj.status == s.HTTP_404_NOT_FOUND) {
            await message.react("⚠️");
            await message.author.send(USER_NOT_FOUND);
            return;
        }
        
        if (respObj.status == s.HTTP_200_OK && response.data_retrieved) {
            const [ totalHours, outreachCount ] = response.body;
            const content = `To date, you have volunteered a total of **${totalHours} hours** and participated in outreach **${outreachCount} ${outreachCount === 1 ? "time" : "times"}**. ${outreachCount || totalHours ? "Thank you!" : ""}`;
            await message.reply(content);
            await message.react("✅");
            return;
        }

        await message.react("⚠️");
        await message.author.send(UNKNOWN_ISSUE);
        return;
	},
};