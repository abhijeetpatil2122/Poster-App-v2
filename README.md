# Telegram Mini App — Production Membership Verification

This app verifies that a user has joined all required Telegram channels before continuing.

## Production behavior

- Frontend sends only `initData` to backend.
- Backend verifies Telegram signature (`initData` HMAC with bot token).
- Backend extracts `user.id` from verified `initData`.
- Backend checks membership in all configured channels via `getChatMember`.
- Frontend shows per-channel status and join buttons for missing channels.
- When all checks pass, Mini App auto-closes.

---

## 1) Required env vars

Set these in Vercel Project → Settings → Environment Variables:

### Required
- `BOT_TOKEN` = your bot token from BotFather

### Channel config (preferred)
- `REQUIRED_CHANNELS_JSON` = **single-line valid JSON array**

Use this exact format (replace with your real values):

```json
[{"chatId":"@ParadoxBackup","title":"Paradox Backup","joinUrl":"https://t.me/ParadoxBackup"},{"chatId":"-1002475920740","title":"Watchlist","joinUrl":"https://t.me/+DmZhi9KqjN81MGJl"}]
```

> Important: in Vercel, use one-line JSON for env vars to avoid formatting mistakes.

### Optional
- `MAX_AUTH_AGE_SECONDS` (default `86400`)

---

## 2) Public + private channel rules

### Public channel
- `chatId`: `@channel_username`
- `joinUrl`: `https://t.me/channel_username`

### Private channel
- `chatId`: numeric chat ID (usually like `-100...`)
- `joinUrl`: private invite link (`https://t.me/+...`)

---

## 3) Critical Telegram permissions checklist

For each required channel:

1. Add your bot to channel.
2. Promote bot to admin (recommended).
3. Ensure bot can inspect members (`getChatMember` must work).

If this is not configured, backend will return per-channel errors and users will never pass verification.

---

## 4) BotFather Mini App setup

- Set your Mini App URL to your Vercel deployment URL.
- Open app from bot chat button/menu (not direct browser tab), so Telegram provides valid `initData`.

---

## 5) API response shape

`POST /api/check-membership` with body:

```json
{"initData":"..."}
```

Response:

```json
{
  "ok": true,
  "allJoined": false,
  "joined": false,
  "userId": 123456789,
  "channels": [
    {
      "channelId": "@ParadoxBackup",
      "chatId": "@ParadoxBackup",
      "title": "Paradox Backup",
      "joinUrl": "https://t.me/ParadoxBackup",
      "joined": true,
      "status": "member",
      "error": null
    }
  ]
}
```
