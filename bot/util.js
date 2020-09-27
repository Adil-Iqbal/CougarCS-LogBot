const { PERMISSION_DENIED, API_DOWN, debugText } = require("./copy");
const { DEBUG } = require("./index");
const fetch = require('node-fetch');


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


exports.safeFetch = async (msg, ...args) => {
    let respObj, response;
    try {
        respObj = await fetch(...args);

        // Permission denied.
        if (await respObj && respObj.status === 401) {
            await msg.react('⚠️');
            await msg.reply(PERMISSION_DENIED);
            return [null, null];
        }

        response = respObj.json();

        // Server responds with a server error.
        if (response.server_error) {
            await msg.react('⚠️');
            if (DEBUG)
                await msg.reply(debugText("Internal Server Error", response.server_error));
            else
                await msg.reply(API_DOWN);
            return [null, null];
        }

        return [respObj, await response];
    } catch (e) {
        await msg.react('⚠️');
        if (DEBUG) {
            await msg.reply(debugText("Javascript Error", e.toString()));
            if (await respObj && respObj.status)
                await msg.reply(debugText("Response Status", `${respObj.status}: ${respObj.statusText}`));
        } else {
            await msg.reply(API_DOWN);
        }
        return [null, null];
    }
};
/*
let respObj, response;
    try {

        // Send post request to API.
        respObj = await fetch('http://127.0.0.1:5000/logs', payload);

        if (respObj.status === 401) {
            await msg.react('⚠️');
            await msg.reply(PERMISSION_DENIED);
            return;
        }

        response = await respObj.json();

        // Server responds with a server error.
        if (response.server_error) {
            await msg.react('⚠️');
            if (DEBUG) await msg.reply("*Server Error*\n```\n" + response.server_error + "\n```");
            else await msg.reply(API_DOWN);
            return;
        }

    // Server does not respond.
    } catch (e) {
        await msg.react('⚠️');
        if (DEBUG) {
            await msg.reply("*Javascript Error*\n```\n" + e.toString() + "\n```");
            if (respObj && respObj.status) await msg.reply(`*Response Status*\n\`\`\`\n${respObj.status}: ${respObj.statusText}\n\`\`\``);
        } else
            await msg.reply(API_DOWN);
        return;
    }
 */