# Log Requests

Here is an example of a log request:

```
Name: John Doe
Date: 03/08/2020
Volunteer Type: text
Duration: 1h 30m
Comment: Helped some1 with linked lists

✅
```

The order of the fields do not matter.

```
Duration: 1h 30m
Comment: Helped some1 with linked lists
Date: 03/08/2020
Volunteer Type: text
Name: John Doe


✅
```

## The `Name` field

The `Name` field should not be omitted.

```
Date: 03/08/2020
Volunteer Type: text
Duration: 1h 30m
Helped some1 with linked lists

⚠️
```

The `Name` field should not exceed 100 characters.

```
Name: John Blaine Charles David Earl Frederick Gerald Hubert Irvim John Kenneth Loyd Martin Nero Oliver Jones Doe
Date: 03/08/2020
Volunteer Type: text
Duration: 1h 30m
Helped some1 with linked lists

⚠️
```

## The `Date` field

The `Date` field accepts `mm/dd/yyyy` format.

```
Name: John Doe
Date: 03/08/2020
Volunteer Type: text
Duration: 1h 30m
Comment: Helped some1 with linked lists

✅
```

The `Date` field does not need leading zeros for days or months.

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: text
Duration: 1h 30m
Comment: Helped some1 with linked lists

✅
```

The `Date` field can handle two digit years.

```
Name: John Doe
Date: 3/8/20
Volunteer Type: text
Duration: 1h 30m
Comment: Helped some1 with linked lists

✅
```

The `Date` field assumes current year when the year is omitted.

```
Name: John Doe
Date: 3/8
Volunteer Type: text
Duration: 1h 30m
Comment: Helped some1 with linked lists

✅
```

The `Date` field assumes *today* when its omitted entirely.

```
Name: John Doe
Volunteer Type: text
Duration: 1h 30m
Comment: Helped some1 with linked lists

✅
```

The `Date` field requires that `/` separate days, months, and years.

```
Name: John Doe
Date: 3-8-20
Volunteer Type: text
Duration: 1h 30m
Comment: Helped some1 with linked lists

⚠️
```

## The `Volunteer Type` field

The `Volunteer Type` field should not be omitted.

```
Name: John Doe
Date: 3/8/2020
Duration: 1h 30m
Comment: Helped some1 with linked lists

⚠️
```

The `Volunteer Type` field should contain one of the following key words: text, voice, group, outreach, other

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: I did a group chat
Duration: 1h 30m
Comment: Helped some1 with linked lists

✅
```

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: tutoring
Duration: 1h 30m
Comment: Helped some1 with linked lists

⚠️
```

### The `Volunteer Type` field can handle multiple keywords. 

Evaluates to `text`.

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: other text
Duration: 1h 30m
Comment: Helped some1 with linked lists

✅
```

Evaluates to `voice`.

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: text voice
Duration: 1h 30m
Comment: Helped some1 with linked lists

✅
```

Evaluates to `group`.

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: voice group
Duration: 1h 30m
Comment: Helped some1 with linked lists

✅
```

Evaluates to `outreach`.

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: group outreach
Duration: 1h 30m
Comment: Helped some1 with linked lists

✅
```

Evaluates to `outreach`.

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: other text voice group outreach
Duration: 1h 30m
Comment: Helped some1 with linked lists

✅
```

Evaluates to `outreach`.

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: outreach group voice text other
Duration: 1h 30m
Comment: Helped some1 with linked lists

✅
```

## The `Duration` field

The `Duration` field requires `Xh Ym` format.

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: text
Duration: 1 hour and 30 minutes
Comment: Helped some1 with linked lists

⚠️
```

The `Duration` field converts to a decimal representing hours. The following is 1.5 hours.

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: text
Duration: 1h 30m
Comment: Helped some1 with linked lists

✅
```

The `Duration` field can handled flipped minutes and hours. The following is 1.5 hours.

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: text
Duration: 30m 1h
Comment: Helped some1 with linked lists

✅
```

The `Duration` field can handle over-clocked minutes. The following is 1.5 hours.

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: text
Duration: 90m
Comment: Helped some1 with linked lists

✅
```

The `Duration` field has a maximum hours cap set by moderators.

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: text
Duration: 69h 420m 
Comment: Helped some1 with linked lists

⚠️
```

The `Duration` field can be omitted if the `Volunteer Type` field is of type "outreach".

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: outreach
Comment: Helped some1 with linked lists

✅
```

The `Duration` field should *not* be omitted for the rest of the volunteer types.

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: text
Comment: Helped some1 with linked lists

⚠️
```

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: group
Comment: Helped some1 with linked lists

⚠️
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

The `Comment` field is mandatory if the `Volunteer Type` field is of type "other".

```
Name: John Doe
Date: 3/8/2020
Volunteer Type: other
Duration: 1h 30m

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