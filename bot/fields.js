const { extract, convertTime, getDate, truncateString } = require('./util');

const BEFORE_ALL = 0; // Not implemented.
const PRE_PROCESS = 1;
const POST_PROCESS = 2;
const AFTER_ALL = 3; // Not implemented.

const fields = [
    {
        labels: ["name", "n"],
        prepare(value, label) {
            return extract(label, value).trim();
        },
        validate: [
            {
                type: PRE_PROCESS,
                condition: (value) => value.length <= 100,
                error: "The \`Name\` field should not exceed 100 characters.",
            },
            {
                type: PRE_PROCESS,
                condition: (value) => !!value.match(/[\w ]+/gi),
                error: "The `Name` field only accepts letters, numbers, spaces, and underscores.",
            },
        ],
        process(value) {
            return value;
        },
        found: false,
        valid: false,
    },
    {
        labels: ["date", "dt"],
        prepare(value, label) {
            return extract(label, value).trim();
        },
        validate: [
            {
                type: PRE_PROCESS,
                condition: (value) => !!value.match(/^(0?[1-9]|1[0-2])\/(0?[1-9]|[1|2]\d|3[0|1])(\/(19|20)?\d\d)?$/g),
                error: "The \`Date\` field accepts the following formats: \`mm/dd/yyyy\`, \`mm/dd/yy\`, \`mm/dd\`",
            },
        ],
        process(value) {
            return getDate(value);
        },
        found: false,
        valid: false,
    },
    {
        labels: ["volunteer type", "v"],
        prepare(value, label) {
            return extract(label, value).trim();
        },
        validate: [
            {
                type: PRE_PROCESS,
                condition: (value) => !!value.match(/other|text|voice|group|outreach/gi),
                error: "The \`Volunteer Type\` field should contain one of the following key words: text, voice, group, outreach, other.",
            }
        ],
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
        valid: false,
    },
    {
        labels: ["duration", "dr"],
        prepare(value, label) {
            return extract(label, value).trim().toLowerCase();
        },
        validate: [
            {
                type: PRE_PROCESS,
                condition: (value) => !!value.match(/^(\d*[h|m] {1})?\d*[h|m]$/g),
                error: "The \`Duration\` field requires \`Xh Ym\` format. (X and Y are whole numbers representing hours and minutes respectively)",
            }
        ],
        process(value) {
            return convertTime(value);
        },
        found: false,
        valid: false,
    },
    {
        labels: ["comment", "c"],
        prepare(value, label) {
            return extract(label, value).trim();
        },
        validate: [],
        process(value) {
            return truncateString(value, 140);
        },
        found: false,
        valid: false,
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
    BEFORE_ALL,
    PRE_PROCESS,
    POST_PROCESS,
    AFTER_ALL,
}