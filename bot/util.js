const { PERMISSION_DENIED, API_DOWN, USER_NOT_FOUND, LOG_NOT_FOUND, debugText, DATABASE_DOWN } = require("./copy");
const fetch = require('node-fetch');
const { s } = require('./httpStatusCodes');

require('dotenv').config();
const host = process.env.HOST;

exports.extract = (label, line) => {
    return line.substring(label.length + 1);
}

exports.convertTime = time => {
    const tokens = time.split(" ");
    let output = 0;
   
    tokens.forEach( token => {
      if ( token.indexOf('h') !== -1 ) output += parseInt( token.substring( 0, token.indexOf('h') ) );
   
      else if ( token.indexOf('m') !== -1 ) {
        let minutes = parseInt( token.substring( 0, token.indexOf('m') ) );
   
        while ( minutes >= 60 ) { minutes -= 60; output++; }
   
        output += minutes/60;
      }
    } );
   
    return Number(output.toFixed(2));
  };

exports.getDate = (string) => {
    if (!string) return new Date();
  
    let [ month, day, year ] = string.split('/');
  
    year = Number(year);
    month = Number(month);
    day = Number(day);
  
    // TODO: Figure out date range.
    if (isNaN(year) || (year < 1951 && year >= 100)) year = new Date().getFullYear();
    if (year <= 50) year += 2000;
    if (year < 100 && year > 50) year += 1900;
  
    return new Date(year, month - 1, day);
  };

exports.roll = function(n) {
    return !!n && Math.random() <= n;
};

exports.truncateString = ( message, length ) => {
    if ( message.length <= length - 3 ) return message;
    else if ( length < 4 && length < message.length ) throw "truncateString was asked to perform a truncation to a length less than 4."; 
    else return message.substring( 0, length - 3 ) + "...";
}

exports.capitalStr = str => str.replace(/\b(\w)/gi, c => c.toUpperCase());


exports.safeFetch = async (message, config, url, payload, ...args) => {
    let respObj, response;
    try {
        // Resolve relative urls.
        if (url.indexOf(host) == -1 && (url.startsWith('/') || url.startsWith('\\'))) {
            if (url.startsWith('\\')) {
                url = '/' + url.substring(1);
            }
            if (url.endsWith('/') || url.endsWith('\\')) {
                url = url.substring(0, url.length - 1);
            }
            url = `${host}${url}`;
        }

        const exemptMethods = ['GET', 'DELETE'];
        
        if (!exemptMethods.includes(payload.method)) {
            if (typeof payload.body == "string") 
                payload.body = JSON.parse(payload.body);    
        
            if (!payload.body.hasOwnProperty('metadata'))
                payload.body = stampPost(message, payload.body);
            
            if (config.debug)
                await message.reply(debugText("Request Payload", payload, "json"));

            if (typeof payload.body != "string")
                payload.body = JSON.stringify(payload.body);
        }

        respObj = await fetch(url, payload, ...args);

        if (config.debug)
            await message.reply(debugText("Response Status", `${respObj.status}: ${respObj.statusText}`))

        response = await respObj.json();
        
        if (respObj.status === s.HTTP_401_UNAUTHORIZED) {
            await message.react('⚠️');
            await message.reply(PERMISSION_DENIED);
            return [null, null];
        }

        if (respObj.status == s.HTTP_404_NOT_FOUND) {
            await message.react("⚠️");
            if (response.message == "user not found") await message.reply(USER_NOT_FOUND);
            if (response.message == "log not found") await message.reply(LOG_NOT_FOUND);
            return [null, null];
        }

        if (respObj.status === s.HTTP_417_EXPECTATION_FAILED) {
            await message.react('⚠️');
            await message.reply(DATABASE_DOWN);
            return [null, null];
        }

        if (respObj.status === s.HTTP_500_INTERNAL_SERVER_ERROR) {
            await message.react('⚠️');
            if (config.debug) await message.reply(debugText("Internal Server Error", response.server_error));
            await message.reply(API_DOWN);
            return [null, null];
        }

        // (debug mode) If server error did not occur, print the server's response.
        if (config.debug && respObj.status !== s.HTTP_500_INTERNAL_SERVER_ERROR) {
            await message.reply(debugText("Response Body", response, "json"));
        } 

        return [respObj, response];

    } catch (e) {
        await message.react('⚠️');

        // (debug mode) If an unforeseen error occurred, print whatever we can.
        if (config.debug) {
            await message.reply(debugText("Javascript Error", e.stack));

            if (respObj && respObj.status)
                await message.reply(debugText("Response Status", `${respObj.status}: ${respObj.statusText}`));
            
            if (response) 
                await message.reply(debugText("Response Body", response, "json"));
        } else {
            await message.reply(API_DOWN);
        }
        return [null, null];
    }
};

function stampPost(message, post) {
    post.metadata = {
        "timestamp": new Date(),
        "discord_id": message.author.id,
        "username": message.author.username,
        "discriminator": message.author.discriminator,
    };
    return post;
}

exports.stampPost = stampPost;