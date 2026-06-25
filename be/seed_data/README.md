# seed_data/

Place your sample files here before deploying:

## Required files

| File | Description |
|---|---|
| `sample.mp4` | Your demo meeting video/audio recording |
| `transcript.txt` | The meeting transcript in 3-line format (see below) |

## transcript.txt format

Every transcript segment must be **exactly 3 consecutive lines** (blank lines between blocks are allowed):

```
00:00:03
Alice Johnson
Welcome everyone to the platform overview session.

00:00:12
Bob Smith
Thanks Alice. Let's start with the dashboard walkthrough.

00:00:25
Alice Johnson
Sure. Here you can see all your recent meetings and search across transcripts.
```

**Supported timestamp formats:** `MM:SS`, `HH:MM:SS`, `[MM:SS]`, `[HH:MM:SS]`

## Notes

- The seed only runs if the meetings table is **empty** — your data is never overwritten.
- `sample.mp4` is copied to `uploads/<meeting_id>.mp4` on each cold start where the DB is empty.
- The Gemini LLM pipeline runs automatically on the transcript to generate an AI summary.
- This file (`sample.mp4`) is committed to git and baked into the Docker image so it survives Render restarts.
