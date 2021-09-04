const { safeFetch } = require("../util");
const { UNKNOWN_ISSUE, USER_NOT_FOUND, debugText } = require("../copy");
const { s } = require('../httpStatusCodes');

module.exports = {
	name: 'report',
    description: 'report of logging behavior over last two weeks.',
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

        if (respObj.status == s.HTTP_404_NOT_FOUND) {
            await message.react("⚠️");
            await message.author.send(USER_NOT_FOUND);
            return;
        }
        
        if (respObj.status == s.HTTP_200_OK) {
            // response_obj['body'] = {
            //     'steady_users': steady_users,
            //     'improved_users': improved_users,
            //     'remaining_users': remaining_users,
            //     'max_users': max_users,
            //     'prev_data': prev_data,
            //     'curr_data': curr_data,
            //     'dates': {
            //         'start': start,
            //         'prev_start': prev_start,
            //         'next': next,
            //         'end': end
            //     }
            // }
            const { steady_users, improved_users, max_users } = response.body;
            // await message.author.send(debugText("Recognize Response", steady_users, "json"));
            // await message.author.send(debugText("Recognize Response", improved_users, "json"));
            // await message.author.send(debugText("Recognize Response", max_users, "json"));
            return;
        }

        await message.react("⚠️");
        await message.reply(UNKNOWN_ISSUE);
        return;
	},
};