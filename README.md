# CougarCS-LogBot

CougarCS-LogBot is an Discord bot that helps CougarCS volunteers log their hours.

## Installation

You'll need to have NodeJS and Python 3.7+  to edit or run this project. You can get those here:

* https://www.python.org/downloads/
* https://nodejs.org/en/

Download this repo by navigating to your desired destination via your terminal, and running this command:

```
git clone https://github.com/Adil-Iqbal/CougarCS-LogBot.git
```

Navigate into the directory, create a virtual environment, and activate it.

```
cd CougarCS-LogBot
python -m venv venv
venv\\Scripts\\Activate
```

Install python and node dependencies:

```
pip install -r requirements.txt
npm install
```

At this point, you're almost ready to run this file. You'll need a `.env` file that follows the format of the `.env.sample` file in the root directory of the project. 

## Usage

Sign in to discord.

Invite the bot to your discord channel by clicking on the link below and following discord's instructions:

https://discord.com/oauth2/authorize?client_id=755311394844311593&scope=bot&permissions=261185

The bot and the API run in two seperate terminal sessions. You can run the bot via the following command:

```
node bot/index.js
```
You can run the API using the following command.

```
flask run
```

To verify that everything is running, check your discord server. You should see a user named "CougarCS-LogBot" under the online section.

![LogBot Online](https://i.imgur.com/Bki4QPI.png)

## Contributing

Discussion in #bot-builder channel!
https://discord.gg/CwkF3R7

The bot is being developed here!
https://discord.gg/JRpxan8

## License
[MIT](https://choosealicense.com/licenses/mit/)