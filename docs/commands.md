# Commands

**To call any particular command, you need to begin with the prefix. By default, the prefix is set to `$`. For example, you can call the `help` command like so:**
```
$help
```

## The `help` command.

**When calling the help command without arguments, it will print an up-to-date list of commands.**

> $help

*Here's a list of my command names:*
```
cancel, cooldown, debug, help, lock, maxhours, ping, stats, tiprate, unlock
```

You can send `$help <command name>` to get info on a specific command!

**When calling the help command with a command name will print the details of that command.**

> $help cancel
✅

**Command Name:** cancel
**Description:** cancel an existing log request.
**Usage:** `$cancel <string: confirmation number>`
**Cooldown:** 3 second(s)

**You can ask the `help` command to print its own details!**

> $help help
✅

**Command Name:** help
**Description:** List all of my commands or info about a specific command.
**Usage:** `$help <string: command name>`
**Cooldown:** 5 second(s)

**If you ask the help command to print the details of a command that doesn't exist, it will error.**

> $help foobar
⚠️

*I don't know that command!*