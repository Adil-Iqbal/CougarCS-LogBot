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

The `cancel` command requires an argument.

> $cancel

⚠️

The argument must be a confirmation number (check your confirmation receipt).

> $cancel abc123

⚠️

You can use the `cancel` command to cancel your log request. 

> $cancel 5f7a257cbfc4ed66e5c321e4

✅

The `cancel` command will *only* work on *your* log request. For example, the confirmation number used here belongs to someone else.

> $cancel 5f78de2cbfc4ed66e5c321e2

⚠️

If you're a superuser, you can cancel *anyone's* request. Here's the same example, except now you're a superuser.

> $cancel 5f78de2cbfc4ed66e5c321e2

✅

Once a log request is cancelled, it no longer exists. Attempting to cancel it again will not work.

> $cancel 5f78de2cbfc4ed66e5c321e2

⚠️

The `cancel` command uses the first argument and ignores the rest.

> $cancel 5f78de2cbfc4ed66e5c321e2 foobar abc123

✅

## The `ping` command.

Whatever you do, don't call the `ping` command!

> $ping

✅
