# Commands

To call any particular command, you need to begin with the prefix. By default, the prefix is set to `$`. For example, you can call the `help` command like so:
```
$help
```

## The `help` command.

When calling the help command without arguments, it will print an up-to-date list of commands.

> $help

✅

When calling the help command with a command name will print the details of that command.

> $help cancel

✅

You can ask the `help` command to print its own details!

> $help help

✅

If you ask the help command to print the details of a command that doesn't exist, it will error.

> $help foobar

⚠️


