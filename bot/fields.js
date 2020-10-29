const { extract, convertTime, getDate, truncateString } = require('./util');
const { _ } = require('lodash');

const fields = [
    {
        labels: ["name", "n"],
        prepare(value, label) {
            return extract(label, value).trim();
        },
        validate: {
            input: [
                {
                    condition: (value) => value.length <= 100,
                    error: "The \`Name\` field should not exceed 100 characters.",
                },
                {
                    condition: (value) => !!value.match(/^[a-z0-9 ]{1,100}$/i),
                    error: "The `Name` field only accepts letters, numbers, and spaces.",
                },
            ],
            data: [],
            structure: [],

        },
        process(value) {
            return value;
        },
        found: false,
        valid: true,
    },
    {
        labels: ["date", "dt"],
        prepare(value, label) {
            return extract(label, value).trim();
        },
        validate: {
            input: [
                {
                    condition: (value) => !!value.match(/\d{4}$/) ? !!value.match(/(19\d\d|20\d\d)$/g) : true,
                    error: "The \`Date\` field should be in the 20th or 21st century. (1900's or 2000's)",
                },
                {
                    condition: (value) => !!value.match(/^(0?[1-9]|1[0-2])\/(0?[1-9]|[1|2]\d|3[0|1])(\/(19|20)?\d\d)?$/g),
                    error: "The \`Date\` field accepts the following formats: \`mm/dd/yyyy\`, \`mm/dd/yy\`, \`mm/dd\`",
                },
            ],
            data: [],
            structure: [],
        },
        process(value) {
            return getDate(value);
        },
        found: false,
        valid: true,
    },
    {
        labels: ["volunteer type", "v"],
        prepare(value, label) {
            return extract(label, value).trim();
        },
        validate: {
            input: [
                {
                    condition: (value) => !!value.match(/other|text|voice|group|outreach/gi),
                    error: "The \`Volunteer Type\` field should contain one of the following key words: text, voice, group, outreach, other.",
                },
            ],
            data: [],
            structure: [],
        },
        process(value) {
            const words = [
                { key: !!value.match(/other/gi), weight: 1 },
                { key: !!value.match(/text/gi), weight: 2 },
                { key: !!value.match(/voice/gi), weight: 3 },
                { key: !!value.match(/group/gi), weight: 4 },
                { key: !!value.match(/outreach/gi), weight: 5 },
            ];

            let heaviest = 0;
            for (let i = 0; i < words.length; i++) {
                let { key, weight } = words[i];
                if (key) heaviest = Math.max(heaviest, weight);
            }

            switch(heaviest) {
                case 0:
                case 1:
                    return "other";
                case 2:
                    return "private text";
                case 3:
                    return "private voice";
                case 4:
                    return "group";
                case 5:
                    return "outreach";
                default:
                    return "other";
            }
        },
        found: false,
        valid: true,
    },
    {
        labels: ["duration", "dr"],
        prepare(value, label) {
            return extract(label, value).trim().toLowerCase();
        },
        validate: {
            input: [
                {
                    condition: (value) => {
                        const counted = _.countBy(value);
                        if (!counted.hasOwnProperty('h')) counted['h'] = 0;
                        if (!counted.hasOwnProperty('m')) counted['m'] = 0;
                        return counted['h'] <= 1 && counted['m'] <= 1;
                    },
                    error: "The `Duration` field should have no more than one `h` value or `m` value."
                },
                {
                    condition: (value) => !!value.match(/^(\d*[h|m] )?\d*[h|m]$/g),
                    error: "The \`Duration\` field requires \`Xh Ym\` format. (X and Y are whole numbers representing hours and minutes respectively)",
                },
            ],
            data: [],
            structure: [],
        },
        process(value) {
            return convertTime(value);
        },
        found: false,
        valid: true,
    },
    {
        labels: ["comment", "c"],
        prepare(value, label) {
            return extract(label, value).trim();
        },
        validate: {
            input: [],
            data: [],
            structure: [],
        },
        process(value) {
            return truncateString(value, 140);
        },
        found: false,
        valid: true,
    },
];

let arr = [];
for (let field of fields) arr = arr.concat(field.labels);
let set = new Set(arr);
if (set.size < arr.length) {
    for (let s of set) arr.splice(arr.indexOf(s), 1);
    let duplicates = Array.from(new Set(arr)).join(", ");
    throw `Duplicate field labels have been detected: ${duplicates}`;
}


module.exports = {
    fields,
}