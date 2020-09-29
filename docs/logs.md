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