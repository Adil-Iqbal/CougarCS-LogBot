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

The `stats` command does not work if the `lock` command has been called.

> $lock

✅

> $stats

⚠️

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

The `cancel` command does not work if the `lock` command has been called.

> $lock

✅

> $cancel 5f78dd28bfc4ed66e5c321df

⚠️

## The `credits` command.

The `credits` command ignores all arguments.

> $credits foo 123

✅

The `credits` command will send a DM with a list of all contributors who assisted prior to the launch.

> $credits

✅

The `credits` command is *not* affected by `lock` and `unlock` commands.

> $lock

✅

> $credits

✅

## The `version` command.

The `version` command ignores all arguments.

> $version foo 123

✅

The `version` command will print the current version of the bot.

> $version

✅

The `version` command is *not* affected by `lock` and `unlock` commands.

> $lock

✅

> $version

✅

## The `config` command.

The `config` command ignores all arguments.

> $config foo 123

✅

The `config` command will print out a list of the bot's current configuration settings..

> $config

✅

The `config` command is *not* affected by `lock` and `unlock` commands.

> $lock

✅

> $config

✅

## The `?` command.


The `?` command is special, since it stands alone without prefix and without arguments.

> ?

✅

> $?

⚠️

> ? foo 123 

⚠️

NOTE: This command will send you a direct message with instructions on how to log your hours.

The `?` command is not effected by the `$lock` and `$unlock` commands.

> $lock

✅

> ?

✅

NOTE: The `?` command will not be listed by the `$help` command.

NOTE: The `?` command is exempt from any and all cooldowns.

## The `ping` command.

Whatever you do, don't call the `ping` command!

> $ping

✅

## The `tiprate` command.

**The `tiprate` command is for superusers.**

If you are *not* a superuser:

> $tiprate 0.15

⚠️

If you are a superuser:

> $tiprate 0.15

✅

The `tiprate` command requires an argument.

> $tiprate

⚠️

The `tiprate` command requires the argument be a decimal between 0 and 1 (inclusive).

> $tiprate foobar

⚠️

> $tiprate 3

⚠️

> $tiprate -0.15

⚠️

The argument is rounded to 3 decimal places. This example is rounded to 0.255:

> $tiprate 0.2549925

✅

The `tiprate` command changes the chance that a pro tip will spawn. This example changes the chances to 15%:

> $tiprate 0.15

✅

The `tiprate` command does not work if the `lock` command has been called.

> $lock

✅

> $tiprate 0.15

⚠️

## The `maxhours` command.

**The `maxhours` command is for superusers.**

If you are *not* a superuser:

> $maxhours 12

⚠️

If you are a superuser:

> $maxhours 12

✅

The `maxhours` command requires an argument.

> $maxhours

⚠️

The `maxhours` command requires the argument be a number between 0 and 24 (inclusive).

> $maxhours foobar

⚠️

> $maxhours -3

⚠️

> $maxhours 30

⚠️

If a decimal is passed as an argument, it will be converted to a whole number. In these examples, the argument converts to `1`:

> $maxhours 1.123

✅

> $maxhours 1.50

✅

> $maxhours 1.9999

✅

The `maxhours` command caps the number of hours that can be logged in a single post.

> $maxhours 1

✅

```
Name: John Doe
Date: 03/08/2020
Volunteer Type: text
Duration: 59m
Comment: Helped someone with linked lists.

✅
```

```
Name: John Doe
Date: 03/08/2020
Volunteer Type: text
Duration: 1h
Comment: Helped someone with linked lists.

✅
```

```
Name: John Doe
Date: 03/08/2020
Volunteer Type: text
Duration: 1h 1m
Comment: Helped someone with linked lists.

⚠️
```

The `maxhours` command does not work if the `lock` command has been called.

> $lock

✅

> $maxhours 12

⚠️

## The `maxoutreach` command.

**The `maxoutreach` command is for superusers.**

If you are *not* a superuser:

> $maxoutreach 6

⚠️

If you are a superuser:

> $maxoutreach 6

✅

The `maxoutreach` command requires an argument.

> $maxoutreach

⚠️

The `maxoutreach` command requires the argument be a number between 1 and 99 (inclusive).

> $maxoutreach foobar

⚠️

> $maxoutreach -3

⚠️

> $maxoutreach 300

⚠️

If a decimal is passed as an argument, it will be converted to a whole number. In these examples, the argument converts to `1`:

> $maxoutreach 1.123

✅

> $maxoutreach 1.50

✅

> $maxoutreach 1.9999

✅

The `maxoutreach` command caps the outreach count that can be logged in a single post.

> $maxoutreach 3

✅

```
Name: John Doe
Date: 03/08/2020
Volunteer Type: outreach
Outreach Count: 2
Comment: COSC-1306, COSC-1430.

✅
```

```
Name: John Doe
Date: 03/08/2020
Volunteer Type: outreach
Outreach Count: 3
Comment: COSC-1306, COSC-1430, COSC-2430.

✅
```

```
Name: John Doe
Date: 03/08/2020
Volunteer Type: outreach
Outreach Count: 4
Comment: COSC-1306, COSC-1430, COSC-2430, COSC-2440.

⚠️
```

The `maxoutreach` command does not work if the `lock` command has been called.

> $lock

✅

> $maxoutreach 6

⚠️

## The `cooldown` command.

**The `cooldown` command is for superusers.**

If you are *not* a superuser:

> $cooldown 3

⚠️

If you are a superuser:

> $cooldown 3

✅

The `cooldown` command requires an argument.

> $cooldown

⚠️

The `cooldown` command requires the argument be a number between 1 and 86400 (inclusive).

> $cooldown foobar

⚠️

> $maxhours -9

⚠️

> $cooldown 90000

⚠️

If a decimal is passed as an argument, it will be converted to a whole number. In these examples, the argument converts to `1`:

> $cooldown 1.123

✅

> $cooldown 1.50

✅

> $cooldown 1.9999

✅

The `cooldown` command will require the user wait for the specified number of seconds before repeating an action. For example, these commands are preformed in quick succession by User 1.

User 1:

> $stats

✅

User 1:

> $stats

⚠️

The cooldown applies to log requests. For example, all of these commands are executed in quick succession User 1:

User 1:

```
Name: John Doe
Date: 03/08/2020
Volunteer Type: text
Duration: 1h 30m
Comment: Helped someone with linked lists.

✅
```

User 1:

```
Name: John Doe
Date: 03/08/2020
Volunteer Type: text
Duration: 1h 30m
Comment: Helped someone with linked lists.

⚠️
```

The cooldowns are user specific. For example, all of these commands are executed in quick succession by User 1 and User 2:

User 1:

> $stats

✅

User 2:

> $stats

✅

User 1:

> $stats

⚠️

The cooldowns are also action specific. For example, all of these commands are executed in quick succession User 1:

User 1:

> $stats

✅

User 1:

> $cancel 5f7a257cbfc4ed66e5c321e9

✅

User 1:

> $stats

⚠️

The `cooldown` command does not work if the `lock` command has been called.

> $lock

✅

> $cooldown 3

⚠️

## The `debug` command.

**The `debug` command is for superusers.**

If you are *not* a superuser:

> $debug

⚠️

If you are a superuser:

> $debug

✅

The `debug` command ignores all arguments.

> $debug foo 123

✅

NOTE: When debug mode is active, the internal workings of the bot and API will be exposed to the chat.

NOTE: You can use debug mode to troubleshoot both bot *and* API issues.

**The `debug` command toggles the debug state between active and inactive.**

To activate debug mode:

> $debug

✅

To deactivate debug mode:

> $debug

✅

The `debug` command does not work if the `lock` command has been called.

> $lock

✅

> $debug

⚠️

## The `lock` and `unlock` commands.

**The `lock` and `unlock` commands are for superusers.**

If you are *not* a superuser:

> $lock

⚠️

> $unlock

⚠️

If you are a superuser:

> $lock

✅

> $unlock

✅

The `lock` and `unlock` commands ignore all arguments.

> $lock 123 foobar

✅

> $unlock 123 foobar

✅

The `lock` command prevents *most* bot interactions with the API.

> $lock

✅

> $stats

⚠️

```
Name: John Doe
Date: 03/08/2020
Volunteer Type: text
Duration: 1h 30m
Comment: Helped someone with linked lists.

⚠️
```

The `unlock` command will allow *all* bot interactions with the API.

> $unlock

✅

> $stats

✅

```
Name: John Doe
Date: 03/08/2020
Volunteer Type: text
Duration: 1h 30m
Comment: Helped someone with linked lists.

✅
```

Once locked, the bot cannot be locked again.

> $lock

✅

> $lock

⚠️

Once unlocked, the bot cannot be unlocked again.

> $unlock

✅

> $unlock

⚠️

NOTE: You can use the `lock` and `unlock` commands to troubleshoot API issues in production.

