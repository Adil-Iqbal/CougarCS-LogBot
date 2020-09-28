const { StatusCodes } = require('http-status-codes');

const codes = {};
for (const [key, value] of Object.entries(StatusCodes))
    if (typeof value == 'number') codes[`HTTP_${value}_${key}`] = value;

exports.s = codes;