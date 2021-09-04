const { safeFetch } = require("../../util");
const { UNKNOWN_ISSUE, USER_NOT_FOUND } = require("../../copy");
const { s } = require('../../httpStatusCodes');

module.exports = {
	name: 'analyzetutors',
    description: 'analyze tutor data.',
    args: false,
    usage: '',
    example: '',
    useApi: true,
	execute: async (message, args, config, client) => {
        const payload = {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        }
        
        const [ respObj, response ] = await safeFetch(message, config, `/recognize`, payload);
        if (!respObj && !response) return;
        
        if (respObj.status == s.HTTP_200_OK) {
            const { improved_users, max_users, steady_users, dates } = response.body;
            let { start, end } = dates;

            start = new Date(start).toLocaleDateString();
            end = new Date(end).toLocaleDateString();

            let content;
            if (max_users.length) {                
                content = `**Max Users** (from ${start} to ${end})`;

                for (let entry of max_users) {
                    content += "\n  - ";
                    content += entry[0]["user"]["_id"] + ", ";
                    content += entry[0]["user"]["username"] + ", ";
                    content += entry[0]["user"]["last_used_name"] + ", ";
                    content += entry[0]["prev_hours"] + ", ";
                    content += entry[0]["curr_hours"] + ", ";
                    content += entry[0]["delta"] + ", ";
                }

                await message.reply(content);
            }

            if (improved_users.length) {                
                content = `**Improved Users** (from ${start} to ${end})`;

                for (let entry of improved_users) {
                    content += "\n  - ";
                    content += entry[0]["user"]["_id"] + ", ";
                    content += entry[0]["user"]["username"] + ", ";
                    content += entry[0]["user"]["last_used_name"] + ", ";
                    content += entry[0]["prev_hours"] + ", ";
                    content += entry[0]["curr_hours"] + ", ";
                    content += entry[0]["delta"] + ", ";
                }

                await message.reply(content);
            }

            if (steady_users.length) {                
                content = `**Steady Users** (from ${start} to ${end})`;

                for (let entry of steady_users) {
                    content += "\n  - ";
                    content += entry[0]["user"]["_id"] + ", ";
                    content += entry[0]["user"]["username"] + ", ";
                    content += entry[0]["user"]["last_used_name"] + ", ";
                    content += entry[0]["prev_hours"] + ", ";
                    content += entry[0]["curr_hours"] + ", ";
                    content += entry[0]["delta"] + ", ";
                }

                await message.reply(content);
            }

            await message.react("✅");
            return;
        }

        await message.react("⚠️");
        await message.reply(UNKNOWN_ISSUE);
        return;
	},
};