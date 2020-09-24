const { extract, convertTime, getDate, truncateString } = require('./util');

exports.fields = [
    {
        label: "name",
        prepare(value) {
            return extract("name", value).trim();
        },
        validate(value) {
            return value.length <= 100;
        },
        process(value) {
            return value;
        },
        error: "The `Name` field should be (at most) 100 characters.",
    },
    {
        label: "date",
        prepare(value) {
            return extract("date", value).trim();
        },
        validate(value) {
            return !!value.match(/^(0?[1-9]|1[0-2])\/(0?[1-9]|[1|2]\d|3[0|1])(\/(19|20)?\d\d)?$/g);
        },
        process(value) {
            return getDate(value);
        },
        error: "The `Date` field should be in one of the following formats: mm/dd, mm/dd/yy, mm/dd/yyyy",
    },
    {
        label: "volunteer type",
        prepare(value) {
            return extract("volunteer type", value).trim();
        },
        validate(value) {
            return !!value.match(/other|text|voice|group|outreach/gi)
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
        error: "The `Volunteer Type` field should contain one of these words: text, voice, group, outreach, other",
    },
    {
        label: "duration",
        prepare(value) {
            return extract("duration", value).trim().toLowerCase();
        },
        validate(value) {
            return !!value.match(/^(\d*[h|m] {1})?\d*[h|m]$/g);
        },
        process(value) {
            return convertTime(value);
        },
        error: "The `Duration` field should be in the `Xh Ym` format (where X and Y are integers representing hours and minutes respectively).",
    },
    {
        label: "comment",
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
    },
];