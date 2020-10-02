module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 5,
	execute: async (message, args, config) => {
		const data = [];
        const { commands } = message.client;

        if (!args.length) {
            data.push('\n*Here\'s a list of all my command names:*\n```');
            data.push(commands.map(command => command.name).join(', '));
            data.push(`\`\`\`\nYou can send \`${config.prefix}help <command name>\` to get info on a specific command!`);

            await message.react('✅');
            await message.reply(data, { split: true });
            return;
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            await message.react('⚠️');
            await message.reply("*I don't know that command!*");
            return;
        }

        data.push(`**Command Name:** ${command.name}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        data.push(`**Usage:** \`${config.prefix}${command.name} ${command.usage ? command.usage : ''}\``);
        data.push(`**Cooldown:** ${command.cooldown || config.cooldown} second(s)`);
        if (command.superuserOnly) data.push("*This command is for superusers only.*");

        await message.react('✅');
        await message.channel.send(data, { split: true });
        return;
	},
};