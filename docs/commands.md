# Commands

To call any particular command, you need to begin with the prefix. By default, the prefix is set to `$`. For example, you can call the `help` command like so:

> $help

✅


## The `help` command.

When calling the `help` command without arguments, it will print an up-to-date list of commands.

> $help

✅

When calling the `help` command with a command name, it will print the info for that command.

> $help cancel

✅

You can ask the `help` command to print its own info!

> $help help

✅

If you ask the `help` command to print the details of a command that doesn't exist, it will error.

> $help foobar

⚠️


## The `stats` command.

The `stats` command will print your hours and outreach count since the launch of the bot.

> $stats

✅

The `stats` command will ignore all arguments.

> $stats 123

✅

> $stats abc

✅


## The `cancel` command.