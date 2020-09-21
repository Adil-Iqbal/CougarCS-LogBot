

export const FIELDS = [
    {
        label: "name",
        prepare(value) {
            return value;
        },
        validate(value) {
            return value.length <= 100;
        },
        process(value) {
            return value;
        },
        error: "The `Name` field can be (at most) 100 characters.",
    },
    {
        label: "date",
        prepare(value) {
            return value;
        },
        validate(value) {
            return !!value.match(/^(0?[1-9]|1[0-2])\/(0?[1-9]|[1|2]\d|3[0|1])(\/(19|20)?\d\d)?$/g);
        },
        process(value) {
            return value;
        },
        error: "The `Date` field should be in one of the following formats: mm/dd, mm/dd/yy, mm/dd/yyyy",
    },
    {
        label: "volunteer type",
        prepare(value) {
            return value;
        },
        validate(value) {
            return !!value.match(/text|voice|group|outreach|other/gi);
        },
        process(value) {
            return value;
        },
        error: "The `Volunteer Type` field should contain one of these words: text, voice, group, outreach, other",
    },
    {
        label: "duration",
        prepare(value) {
            return value.toLowerCase();
        },
        validate(value) {
            return !!value.match(/^(\d*[h|m] {1})?\d*[h|m]$/g);
        },
        process(value) {
            return value;
        },
        error: "The `Duration` field should be in the `Xh Ym` format (where X and Y are integers representing hours and minutes respectively).",
    },
    {
        label: "comment",
        prepare(value) {
            return truncateString(value, 140);
        },
        validate(value) {
            return true;
        },
        process(value) {
            return value;
        },
        error: "",
    },
];