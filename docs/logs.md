# Log Requests

Here is an example of a log request:

```
Name: John Doe
Date: 03/08/2020
Volunteer Type: text
Duration: 1h 30m
Comment: Helped someone with linked lists.

✅
```


The order of the fields do not matter.

```
Duration: 1h 30m
Comment: Helped someone with linked lists.
Date: 03/08/2020
Volunteer Type: text
Name: John Doe


✅
```

You cannot have two fields on the same line.

```
Name: John Doe
Date: 03/08/2020
Volunteer Type: text   Duration: 1h 30m
Comment: Helped someone with linked lists.

⚠️
```

Duplicate fields are always ignored. In these examples, only the first `Date` field is used.

```
Name: John Doe
Date: 03/08/2020
Date: 12/31/1999
Volunteer Type: text
Duration: 1h 30m
Comment: Helped someone with linked lists.

✅
```

```
Name: John Doe
Date: INVALID ENTRY!
Date: 12/31/1999
Volunteer Type: text
Duration: 1h 30m
Comment: Helped someone with linked lists.

⚠️
```

Field names are case insensitive.

```
nAMe: John Doe
DaTe: 03/08/2020
VOluntEEr TyPE: text
dURaTIoN: 1h 30m
CoMMenT: Helped someone with linked lists.

✅
```

Field names can be abbreviated, like so: 

```
n: John Doe
dt: 03/08/2020
v: text
dr: 1h 30m
c: Helped someone with linked lists.

✅
```

## The `Name` field

The `Name` field should be submitted at least once.

```
Date: 03/08/2020
Volunteer Type: text
Duration: 1h 30m
Comment: Helped someone with linked lists.

⚠️
```

```
Name:
Date: 03/08/2020
Volunteer Type: text
Duration: 1h 30m
Comment: Helped someone with linked lists.

⚠️
```

The `Name` field may be omitted if it has been submitted before.

```
Name: John Doe
Date: 03/08/2020
Volunteer Type: text
Duration: 1h 30m
Comment: Helped someone with linked lists.

✅
```

```
Date: 03/08/2020
Volunteer Type: text
Duration: 1h 30m
Comment: Helped someone with linked lists.

✅
```

```
Date: 03/09/2020
Volunteer Type: text
Duration: 1h 30m
Comment: Helped someone with linked lists.

✅
```

The `Name` field can be submitted on its own.

```
Name: John Doe

✅
```

When submitted on its own, the `Name` field can be omitted thereafter.

```
Name: John Doe

✅
```

```
Date: 03/08/2020
Volunteer Type: text
Duration: 1h 30m
Comment: Helped someone with linked lists.

✅
```

```
Date: 03/09/2020
Volunteer Type: voice
Duration: 1h 30m
Comment: Helped someone with linked lists.

✅
```

The `Name` field should never exceed 100 characters.

```
Name: John Blaine Charles David Earl Frederick Gerald Hubert Irvim John Kenneth Loyd Martin Nero Oliver Jones Doe
Date: 03/08/2020
Volunteer Type: text
Duration: 1h 30m
Comment: Helped someone with linked lists.

⚠️
```

```
Name: John Blaine Charles David Earl Frederick Gerald Hubert Irvim John Kenneth Loyd Martin Nero Oliver Jones Doe

⚠️
```

The `Name` field only accepts letters, numbers, and spaces.

```
Name: John Doe! 👍 
Date: 03/08/2020
Volunteer Type: text
Duration: 1h 30m
Comment: Helped someone with linked lists.

⚠️
```

```
Name: John Doe! 👍

⚠️
```

The `Name` field can be abbreviated to the letter `n` (case insensitive).

```
n: John Doe
Date: 03/08/2020
Volunteer Type: text
Duration: 1h 30m
Comment: Helped someone with linked lists.

✅
```

```
n: John Doe

✅
```

## The `Date` field

The `Date` field accepts `mm/dd/yyyy` format.

```
Name: John Doe
Date: 03/08/2020
Volunteer Type: text
Duration: 1h 30m
Comment: Helped someone with linked lists.

✅
```

The `Date` field should be in the 20th or 21st century. (1900's or 2000's)

```
Name: John Doe
Date: 03/08/2799
Volunteer Type: text
Duration: 1h 30m
Comment: Helped someone with linked lists.

⚠️
```

The `Date` field does not need leading zeros for days or months.

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: text
Duration: 1h 30m
Comment: Helped someone with linked lists.

✅
```

The `Date` field can handle two digit years.

```
Name: John Doe
Date: 3/8/20
Volunteer Type: text
Duration: 1h 30m
Comment: Helped someone with linked lists.

✅
```

The `Date` field assumes *current year* when the year is omitted.

```
Name: John Doe
Date: 3/8
Volunteer Type: text
Duration: 1h 30m
Comment: Helped someone with linked lists.

✅
```

The `Date` field assumes *today* when its omitted entirely.

```
Name: John Doe
Volunteer Type: text
Duration: 1h 30m
Comment: Helped someone with linked lists.

✅
```

The `Date` field requires that a forward slash (`/`) separate days, months, and years.

```
Name: John Doe
Date: 3-8-20
Volunteer Type: text
Duration: 1h 30m
Comment: Helped someone with linked lists.

⚠️
```

The `Date` field can be abbreviated to the letters `dt` (case insensitive).

```
Name: John Doe
dt: 3/8/2020
Volunteer Type: text
Duration: 1h 30m
Comment: Helped someone with linked lists.

✅
```

## The `Volunteer Type` field

The `Volunteer Type` field should not be omitted.

```
Name: John Doe
Date: 3/8/2020
Duration: 1h 30m
Comment: Helped someone with linked lists.

⚠️
```

The `Volunteer Type` field should contain one of the following keywords: text, voice, group, outreach, other

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: I did a group chat
Duration: 1h 30m
Comment: Helped someone with linked lists.

✅
```

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: tutoring
Duration: 1h 30m
Comment: Helped someone with linked lists.

⚠️
```

The `Volunteer Type` field detects keywords in a case insensitive manner.

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: oUtREaCh
Duration: 1h 30m
Comment: Helped someone with linked lists.

✅
```

NOTE: Use the **text** keyword when assisting a user via written correspondence.

NOTE: Use the **voice** keyword when assisting a user via audio or video correspondence.

NOTE: Use the **group** keyword when assisting more than one user simultaneously.

NOTE: Use the **outreach** keyword when advertising CougarCS to other potential users. 

NOTE: Use the **other** keyword if no other keyword fits your use case. 

NOTE: When using the **other** keyword, the `Comment` field must be submitted.

NOTE: When using the **outreach** keyword, the `Duration` field may be omitted.

NOTE: When using the **outreach** keyword, the `Outreach Field` may be used to modify your log request.

#### The `Volunteer Type` field can handle multiple keywords. 

Evaluates to `other`.

```
Name: John Doe
Date: 3/8/2020
Volunteer Type:
Duration: 1h 30m
Comment: Helped someone with linked lists.

✅
```

Evaluates to `text`.

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: other text
Duration: 1h 30m
Comment: Helped someone with linked lists.

✅
```

Evaluates to `voice`.

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: text voice
Duration: 1h 30m
Comment: Helped someone with linked lists.

✅
```

Evaluates to `group`.

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: group voice
Duration: 1h 30m
Comment: Helped someone with linked lists.

✅
```

Evaluates to `outreach`.

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: group outreach
Duration: 1h 30m
Comment: Helped someone with linked lists.

✅
```

Evaluates to `outreach`.

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: other outreach voice group text
Duration: 1h 30m
Comment: Helped someone with linked lists.

✅
```

The `Volunteer Type` field can be abbreviated to the letter `v` (case insensitive).

```
Name: John Doe
Date: 3/8/2020
v: text
Duration: 1h 30m
Comment: Helped someone with linked lists.

✅
```

## The `Duration` field

The `Duration` field requires `Xh Ym` format. (X and Y are whole numbers representing hours and minutes respectively)

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: text
Duration: 1 hour and 30 minutes
Comment: Helped someone with linked lists.

⚠️
```

The `Duration` field should have no more than one `h` value or `m` value.

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: text
Duration: 1h 1h
Comment: Helped someone with linked lists.

⚠️
```

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: text
Duration: 30m 30m
Comment: Helped someone with linked lists.

⚠️
```

The `Duration` field converts to a decimal representing hours. The following is 1.5 hours.

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: text
Duration: 1h 30m
Comment: Helped someone with linked lists.

✅
```

The `Duration` field can handled flipped minutes and hours. The following is 1.5 hours.

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: text
Duration: 30m 1h
Comment: Helped someone with linked lists.

✅
```

The `Duration` field can handle over-clocked minutes. The following is 1.5 hours.

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: text
Duration: 90m
Comment: Helped someone with linked lists.

✅
```

The `Duration` field should evaluate to a non-zero number of hours.

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: text
Duration: 0h 0m
Comment: Helped someone with linked lists.

⚠️
```

The `Duration` field has a maximum hours cap set by moderators.

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: text
Duration: 69h 420m 
Comment: Helped someone with linked lists.

⚠️
```

The `Duration` field is required for *most* `Volunteer Type` keywords.

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: text
Comment: Helped someone with linked lists.

⚠️
```

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: I did a group chat
Comment: Helped someone with linked lists.

⚠️
```

The `Duration` field can be omitted if the `Volunteer Type` field evaluates to "outreach".

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: outreach
Comment: Helped someone with linked lists.

✅
```

The `Duration` field can be abbreviated to the letters `dr` (case insensitive).

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: text
dr: 1h 30m
Comment: Helped someone with linked lists.

✅
```

## The `Outreach Count` field

If the `Volunteer Type` field evaluates to "outreach," the *outreach count* is set to 1.

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: outreach
Comment: COSC-1306.

✅
```

The `Outreach Count` field will allow you to log more than 1 outreaches in a single log request.

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: outreach
Outreach Count: 3
Comment: COSC-1306, COSC-1460, COSC-2430

✅
```

The `Outreach Count` field must be a 1 or 2 digit non-zero whole number.

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: outreach
Outreach Count: 10000000
Comment: Superbowl commercial

⚠️
```

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: outreach
Outreach Count: 0
Comment: Huh?

⚠️
```

The `Outreach Count` field has a maximum count cap set by moderators.

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: outreach
Outreach Count: 69
Comment: Twirled a sign at an intersection.

⚠️
```

If the `Outreach Count` field is greater than 1, the `Comment` field is required.

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: outreach
Outreach Count: 3

⚠️
```

When the `Outreach Count` field is present while both the `Volunteer Type` and `Duration` fields are omitted, then it is assumed that the `Volunteer Type` evaluates to "outreach"

```
Name: John Doe
Date: 3/8/2020
Outreach Count: 3
Comment: COSC-1306, COSC-1460, COSC-2430

✅
```

The `Outreach Count` field can be abbreviated to the letter `o` (case insensitive).

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: outreach
o: 3
Comment: COSC-1306, COSC-1460, COSC-2430

✅
```

## The `Comment` field

The `Comment` field is optional for most volunteer types.

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: text
Duration: 1h 30m

✅
```

The `Comment` field is mandatory if the `Volunteer Type` field evaluates to "other".

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: other
Duration: 1h 30m

⚠️
```

The `Comment` field is mandatory if the `Outreach Count` field is greater than 1.

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: outreach
Outreach Count: 3

⚠️
```

The `Comment` field is *always* truncated to 140 characters. More than half of this comment is lost after processing.

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: other
Duration: 1h 30m
Comment: Man, I tutored a kid that has no business being a comp sci major. But I tried my best to be patient and really showed him the ropes on these linked lists. I'm logging like 90 minutes, but really, I deserve like 4 hours on this tutoring sesh. He was a wierdo too, kind of. I forget his name, I think it was Bill? Bill gates? Not quite sure.

✅
```

The `Comment` field can be abbreviated to the letter `c` (case insensitive).

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: text
Duration: 1h 30m
c: Helped someone with linked lists.

✅
```

## Best Practices

* Never put in a log request for someone else!
* If someone helped you, remind them to put in their own log request.
* Please keep conversation in the logging channel to a minimum.
* Always keep the `Name` field consistent across all of your log requests.
