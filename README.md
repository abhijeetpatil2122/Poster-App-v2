# Telegram Mini App: Channel Join Verification (Demo)

This demo Mini App checks whether a Telegram user joined a required channel.

## How it works

1. Mini App opens inside Telegram.
2. Frontend sends `initData` + `userId` + `channel` to `/api/check-membership`.
3. Backend validates `initData` signature using your bot token.
4. Backend calls `getChatMember`.
5. If member: frontend confirms and auto-closes the Mini App.
6. If not a member: frontend shows a **Join channel** prompt and re-check button.

## Required setup

### 1) Set environment variables in Vercel

- `BOT_TOKEN` = your bot token from BotFather
- `REQUIRED_CHANNEL` = channel username or ID, e.g. `@my_channel`

### 2) Update frontend channel fallback (optional)

In `PosterApp.html`, set:

```js
const CHANNEL_USERNAME = '@your_channel_username';
```

### 3) Configure Telegram bot Mini App button

Use BotFather to set your Mini App URL to your Vercel deployment URL.

### 4) Channel requirements

- Your bot must be in the channel.
- Bot must have rights to read members (typically admin role).

## Local run

```bash
vercel dev
```

Then open via Telegram Mini App context (not plain browser) for full behavior.
