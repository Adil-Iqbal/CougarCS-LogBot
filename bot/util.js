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
  
    if (isNaN(year) || (year < 1000 && year >= 100)) year = new Date().getFullYear();
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