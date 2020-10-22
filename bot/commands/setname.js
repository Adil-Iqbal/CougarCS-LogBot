const { safeFetch, capitalStr } = require("../util");
const { s } = require('../httpStatusCodes');
const { UNKNOWN_ISSUE } = require("../copy");
const { _ } = require("lodash");

module.exports = {
	name: 'setname',
    description: 'change the name that auto-populates when the name field is omitted.',
    args: true,
    usage: '<string: name> <string: name> <string: name> ...',
    useApi: true,
	execute: async (message, args, config, client) => {
        let newName = args
            .map(arg => capitalStr(String(arg).toLowerCase()))
            .filter(arg => !!arg.match(/^[a-z]{1}[a-z0-9]*$/i))
            .join(" ");
        
        newName = _.truncate(newName, { 
            length: 100,
            separator: ' ',
            omission: '',
         });

        if (!newName.length) {
            await message.react('⚠️');
            await message.reply("Names must start with a letter and then have only letter or number characters thereafter.");
            return;
        }

        const payload = {
            method: "UPDATE",
            body: JSON.stringify({ "new_name": newName }),
            headers: { 'Content-Type': 'application/json' }
        }

        const [ respObj, response ] = await safeFetch(message, config, `/users/name/${message.author.id}`, payload);
        if (!respObj && !response) return;


        if (respObj.status == s.HTTP_200_OK) {
            await message.react("✅");
            const [ updatedName ] = response.body;
            let content = `Now, when you omit the \`Name\` field, the name in your log requests will auto-populate with **${updatedName}**.\nIf this was not your intention, you might want to read up on how the \`$setname\` command works: <https://tinyurl.com/cmddocs1>`;
            await message.reply(content);
            return;
        }

        await message.react("⚠️");
        await message.reply(UNKNOWN_ISSUE);
        return;
	},
};