# Telegram Mini App: Multi-Channel Verification (Demo)

This demo Mini App verifies whether a Telegram user has joined **all required channels**.

It supports:
- ✅ public channels (via `@username`)
- ✅ private channels (via numeric `chatId` + private invite `joinUrl`)

## How it works

1. Mini App opens inside Telegram.
2. Frontend sends `initData`, `userId`, and optional channel list to `/api/check-membership`.
3. Backend validates Telegram `initData` signature with `BOT_TOKEN`.
4. Backend calls `getChatMember` for each configured channel.
5. Frontend renders per-channel results:
   - if not joined, user gets Join button(s),
   - when all are joined, app confirms and auto-closes.

## Environment variables (Vercel)

Required:
- `BOT_TOKEN` = bot token from BotFather

Choose one channel config mode:

### Preferred: multiple channels via JSON

- `REQUIRED_CHANNELS_JSON` = JSON array, e.g.

```json
[
  {
    "chatId": "@my_public_channel",
    "title": "Public Announcements",
    "joinUrl": "https://t.me/my_public_channel"
  },
  {
    "chatId": "-1001234567890",
    "title": "Private VIP Channel",
    "joinUrl": "https://t.me/+AbCdEfGhIj"
  }
]
```

### Backward-compatible single channel

- `REQUIRED_CHANNEL` (chat id or `@username`)
- `REQUIRED_CHANNEL_TITLE` (optional)
- `REQUIRED_CHANNEL_JOIN_URL` (optional, useful for private)

## Bot/channel requirements

- The bot must be present in each target channel.
- The bot needs permissions that allow `getChatMember` checks.

## Frontend fallback

`PosterApp.html` includes `FALLBACK_CHANNELS` for quick testing. In production, prefer env-based configuration from backend.

## Local run

```bash
vercel dev
```

Open only from Telegram Mini App context for real user verification.
