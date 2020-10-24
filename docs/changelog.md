# Change Log

## Version 1.0.2 BETA - *Unreleased*
  - Added $setname command, that will allow users to modify how their name appears in log requests.
  - The $setname command will now add a user entry in database if called by a new user.
  - The $setname command will now do a security check for metadata before executing.
  - The $help command will now print an example of the usage when called with an argument.
  - Implemented standalone `Name` field. When a log request is submitted with only a `Name` field, it will utilize the $setname endpoint.
  - Fixed standalone `Name` field not appropriately checking value length.
  - Fixed $help command accidentally using placing embeds in replies.
  - Polish! Added $setname command to the command docs.
  - Polish! Added new `Name` field functionality to log docs.

## Version 1.0.1 BETA - 10/22/2020
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

