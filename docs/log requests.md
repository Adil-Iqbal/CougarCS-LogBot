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