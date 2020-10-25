const { extract, convertTime, getDate, truncateString } = require('./util');

const fields = [
    {
        labels: ["name", "n"],
        prepare(value) {
            return extract("name", value).trim();
        },
        validate(value) {
            return value.length <= 100;
        },
        process(value) {
            return value;
        },
        error: "The \`Name\` field should not exceed 100 characters.",
        found: false,
    },
    {
        labels: ["date", "dt"],
        prepare(value) {
            return extract("date", value).trim();
        },
        validate(value) {
            return !!value.match(/^(0?[1-9]|1[0-2])\/(0?[1-9]|[1|2]\d|3[0|1])(\/(19|20)?\d\d)?$/g);
        },
        process(value) {
            return getDate(value);
        },
        error: "The \`Date\` field accepts the following formats: \`mm/dd/yyyy\`, \`mm/dd/yy\`, \`mm/dd\`",
        found: false,
    },
    {
        labels: ["volunteer type", "v"],
        prepare(value) {
            return extract("volunteer type", value).trim();
        },
        validate(value) {
            return !!value.match(/other|text|voice|group|outreach/gi);
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
        error: "The \`Volunteer Type\` field should contain one of the following key words: text, voice, group, outreach, other.",
        found: false,
    },
    {
        labels: ["duration", "dr"],
        prepare(value) {
            return extract("duration", value).trim().toLowerCase();
        },
        validate(value) {
            return !!value.match(/^(\d*[h|m] {1})?\d*[h|m]$/g);
        },
        process(value) {
            return convertTime(value);
        },
        error: "The \`Duration\` field requires \`Xh Ym\` format. (X and Y are whole numbers representing hours and minutes respectively)",
        found: false,
    },
    {
        labels: ["comment", "c"],
        prepare(value) {
            return extract("comment", value).trim();
        },
        validate(value) {
            return true;
        },
        process(value) {
            return truncateString(value, 140);
        },
        error: "You should never see this error.",
        found: false,
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