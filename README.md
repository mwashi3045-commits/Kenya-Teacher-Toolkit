# Kenya Teacher Toolkit

Offline-first KICD/CBE planning prototype for Kenyan teachers.

## Grade bands

- Lower Primary: Grade 1–3
- Upper Primary: Grade 4–6
- Junior School: Grade 7–9
- Senior School: **Grade 10–12**

## Features

- Separate grade and subject lists for each band
- Lesson plan, lesson notes, scheme of work and record of work generation
- Competency-based report cards using EE, ME, AE and BE levels
- Timetable generator for every grade band
- Band-specific timetable defaults: lesson duration, lessons per day, weekly lessons, break timing and subject rotation
- Print, local draft saving, JSON export and import

## Timetable defaults

The generator uses the following planning defaults sourced from the timetable guidance reviewed for this prototype:

| Band | Periods/day | Period length | Weekly periods |
| --- | ---: | ---: | ---: |
| Lower Primary (1–3) | 6 | 30 minutes | 31 |
| Upper Primary (4–6) | 7 | 35 minutes | 35 |
| Junior School (7–9) | 8 | 40 minutes | 41 |
| Senior School (10–12) | 8 | 40 minutes | 40 |

The timetable is a configurable starting point. Schools must verify subject allocations, pathway requirements, breaks, co-curricular activities and current official Ministry/KICD circulars before formal adoption.

## Run

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.

> Curriculum names and assessment labels should be checked against the latest official KICD/CBE documents before formal school adoption. This app is a planning prototype and is not an official KICD publication.
