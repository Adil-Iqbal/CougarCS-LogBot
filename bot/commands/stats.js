const { safeFetch } = require("../util");
const { UNKNOWN_ISSUE, USER_NOT_FOUND } = require("../copy");
const { s } = require('../httpStatusCodes');

module.exports = {
	name: 'stats',
    description: 'lookup cumulative number of hours/outreach done.',
    args: false,
    usage: '',
    example: '',
    useApi: true,
	execute: async (message, args, config, client) => {
        const discordId = message.author.id;

        const payload = {
            method: "POST",
            body: "{}",
            headers: { 'Content-Type': 'application/json' }
        }
        
        const [ respObj, response ] = await safeFetch(message, config, `/users/stats/${discordId}`, payload);
        if (!respObj && !response) return;

        if (respObj.status == s.HTTP_404_NOT_FOUND) {
            await message.react("⚠️");
            await message.author.send(USER_NOT_FOUND);
            return;
        }
        
        if (respObj.status == s.HTTP_200_OK) {
            let [ totalHours, outreachCount ] = response.body;
            totalHours = Number(Number(totalHours).toFixed(2));
            const content = `To date, you have volunteered a total of **${totalHours} hours** and participated in outreach **${outreachCount} ${outreachCount === 1 ? "time" : "times"}**. ${outreachCount || totalHours ? "Thank you!" : ""}`;
            await message.reply(content);
            await message.react("✅");
            return;
        }

        await message.react("⚠️");
        await message.reply(UNKNOWN_ISSUE);
        return;
	},
};