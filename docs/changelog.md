# Change Log

## Version 1.1.0 - *Unreleased*
  - Added `Outreach Count` field.
  - Added external validation for `Outreach Count` field.
  - Added embed field for `Outreach Count` field.
  - Added `Outreach Count` field documentation.
  - The `Outreach Count` field now makes assumption about log type when used implicitly.
  - Added `$maxoutreach` command that limits the maximum outreach count.
  - Added `$maxoutreach` command to documentation.
  - The `$maxoutreach` setting is now persistent.
  - Added `$config` command that prints out current config settings in chat.
  - Added `$config` command to documentation.
  - Implemented new log request structure based on outreach count feature.
  - Hidden API route configured to update existing log requests to new structure.
  - Fixed `Outreach Count` field accepting zero as a valid value.
  - Fixed `Duration` field not printing errors when given unusable value.
  - Fixed `$ping` and `$config` commands not properly reacting to messages.
  - Fixed `$maxHours` and `$maxOutreach` commands accepting non-number values.

## Version 1.0.5 - 11/2/2020
  - Seeded databases with user's hours and outreach count in both user objects and log requests.
  - Added hidden route to seed database. (Not active in production)
  - The `$version` command now also reports the development environment.
  - Fixed production and development environment variables not being properly separated.
  - Fixed `$credits` command not properly reacting to user message.
  - Fixed `$stats` command not properly rounding floating point numbers.
  - Fixed `Name` field not looking up previous name when processed to undefined value.
  - Fixed log request API endpoint not properly rounding request duration when updating user data.
  - Completed last round of performance testing before launch.
  - Launched production bot!

## Version 1.0.4 Beta - 10/28/2020
  - Parsing algorithm updated to allow multiple internal validations.
  - Parsing algorithm updated to allow a post-processing validation step.
  - Field structure updated to allow multiple pre & post processing validations.
  - Parsing algorithm optimized when validating during different validation steps.
  - Added pro tips on *relevant* Discord fundamentals.
  - The `$setname` command has been removed due to redundancy.
  - Added the `$credits` command which sends user a dm of contributors.
  - The `Name` field now only accepts letters, numbers, and spaces.
  - Fixed standalone `Name` field allowing blank entries.
  - Fixed `Date` field taking dates outside of the 20th and 21st century.
  - Fixed `Duration` field allowing multiple minutes and hours per entry.
  - Fixed `Duration` field allowing user to log zero hours.
  - Fixed bot attempting to parse non-user messages.
  - Updated log docs with `Name`, `Date`, and `Duration` changes.
  - Removed `$setname` command from command docs, log docs, and best practices.
  - Added the `$credits` command to the command docs and pro tips!

## Version 1.0.3 Beta - 10/26/2020
  - Field names are now parsed in a case insensitive manner.
  - Field names now have designated abbreviations.
  - Form parsing algorithm has been optimized.
  - Form parsing algorithm now ignores duplicate fields.
  - Added pre-initialization check for duplicate field names.
  - Added new log request functionality to log docs.
  - Centralized versioning of the bot to its `package.json` file.
  - Added $version command to quickly determine bot's version.
  - Added $version command to the command docs.
  - Fixed missing keyword definitions in log docs.
  - Fixed missing keyword definitions in help dm.
  - Fixed issue preventing help dm from being sent.

## Version 1.0.2 Beta - 10/24/2020
  - The $help command will now print an example of the usage when called with an argument.
  - Added $setname command, that will allow users to modify how their name appears in log requests.
  - The $setname command will now add a user entry in database if called by a new user.
  - The $setname command will now do a security check for metadata before executing.
  - Added $setname command to the command docs.
  - When `Name` field is used on its own, the bot will use the $setname command's API endpoint.
  - Added new `Name` field functionality to log docs.
  - Fixed standalone `Name` field not appropriately handling errors.
  - Fixed overly complicated wording in `Name` field documentation.
  - Fixed missing keyword explanations in log docs.
  - Fixed $help command accidentally using embeds in replies.
  - Fixed inconsistent wording across errors, tips, docs, and help dm.

## Version 1.0.1 Beta - 10/22/2020
  - When a new user uses the $stats command, API now creates a user entry and reports zero contributions.
  - The `Name` field is now optional for all but the very first log request a user makes.
  - Fixed blank `Name` field being considered valid entry.
  - Fixed the `?` command being affected by $lock and $unlock.
  - Fixed the receipt disclaimer being unnecessarily harsh.
  - Fixed $cancel command not appropriately sending DMs when log request is cancelled by superuser.
  - Fixed catch all error message sent to DM instead of in chat reply.
  - Fixed method not allowed error when using $stats command as a new user.
  - Polish! Standardized user object in database.
  - Polish! Added $debug, $cooldown, and `?` commands to command docs.
  - Polish! Added new `Name` field functionality to log docs.
  - Polish! New `Name` field functionality is now consistently worded across docs, tips, errors, and help dm.

## Version 1.0.0 BETA - 10/19/2020
  - Beta version deployed.

## Version 0.9.4 - 10/2/2020
  - Ubuntu OS conversion complete.
  - Environment variables updated to reflect server settings.
  - Bot copy has been polished for consistency and grammar.
  - Added documentation links to pro tips.
  - Added command documentation.
  - $help command implemented.
  - Added command-specific cooldowns.
  - Added global cooldowns (for server performance).
  - $cooldown command added.

## Version 0.9.3 - 9/30/2020
  - Added user-facing $stats command that will return total hours and outreach count.
  - Added superuser component to $cancel command.
  - Added beta-specific welcome message.
  - Begin conversion for Ubuntu OS.

## Version 0.9.2 - 09/29/2020
  - New log docs give extra details on how to post log requests. https://tinyurl.com/logdocs1
  - Fixed confirmation number not printing in receipts.
  - Fixed help message accidentally printing NaN.
  - Fixed extra error messages printing when they shouldn't.
  - Fixed superuser commands being accessible to frozen users.
  - Fixed tips spawning before message reply.
  - Fixed inconsistent metadata structure across log bot app (now all commands and posts have same metadata structure).
  - Fixed backend not responding to improper metadata (now responds with http code 417 expectation failed)
  - Polish! Docs, errors, help, and tips now use consistent wording (if not exactly the same wording).
  - Polish! Command handling system will now handle no-argument errors.
  - Polish! Pushed all security considerations on the API-end. The bot end now only interfaces with client and relays http-status-codes in a user friendly way.

## Version 0.9.1 - 09/29/2020
  - Bot now officially has persistent configuration. Meaning we shutdown and restart the bot and it will remember how it is supposed to behave.
  - Bot now has 3 new superuser commands.
        - $tiprate command changes the random chance that a pro tip will spawn with each request.
        - $debug will toggle debug mode.
        - $maxhours changes the maximum # of hrs that can be logged in a single log request.
  - Started docs that will help people who need more clarification beyond what the bot can provide in discord.
  - Welcome Message is complete.
  - There has been lots of bug fixing and polish. Things are getting ready. More to do. Midterms.

## Version 0.9.0 - 09/28/2020
  - The bot now has a command handling system.
  - First 3 commands implemented are $ping, $lock, and $unlock.
  - The $ping command makes the bot say "Pong." Useful for troubleshooting and jollies.
  - The $lock command will prevent the bot from taking log requests. Useful for troubleshooting in production. (god forbid)
  - The $unlock command will undo the $lock command.
  - There's also a rudimentary superuser system now. So only designated users can use $lock and $unlock.
  - Everyone can use $ping.
  - The scaffolding is in place for a user-facing command that will be implemented later this week.
  - I've started on presistent configuration (so I can shut off and restart the bot, and it'll remember how it was configured before).

## Version 0.8.3 - 09/26/2020
  - Standardized the response body for all POST requests to the /logs endpoint. (Easy developing on the bot end).
  - In debug mode, the bot can now print API errors (including stack traces). 
  - In debug mode, the bot can now print response errors (response status and status text).

## Version 0.8.2 - 09/25/2020
  - The API will now accept POST requests from the bot containing a representation of the user's log request.
  - The API will now insert the log request into the database.
  - The API will now update an existing user's cumulative_hours and outreach_count.
  - The API will now recognize when it encounters a new user and enter that user into the database automatically.

## Version 0.8.1 - 09/22/2020
  - Every message in the channel is considered a log request.
  - If a message starts with "//" (without quotation marks) then its ignored completely.
  - If a message equals "?" (without quotation marks), the bot will send a DM with instructions on how to log hours.
  - There is a 15% chance that a bot will share a random tip when people send messages in the channel.
  - The bot will recognize any mistakes in a log request and let you know how to correct them.
  - The bot will send confirmation receipts whenever a log request is successfully logged.
  - Started change-log.

