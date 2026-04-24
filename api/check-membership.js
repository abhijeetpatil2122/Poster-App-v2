const crypto = require('crypto');

const MAX_AUTH_AGE_SECONDS = Number(process.env.MAX_AUTH_AGE_SECONDS || 86400);

function safeJsonParse(input, fallback = null) {
  try {
    return JSON.parse(input);
  } catch {
    return fallback;
  }
}

function getRequestBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }

  if (typeof req.body === 'string') {
    return safeJsonParse(req.body, {});
  }

  return {};
}

function parseInitData(initData) {
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  const authDate = Number(params.get('auth_date') || 0);
  const userRaw = params.get('user');
  const user = userRaw ? safeJsonParse(userRaw, null) : null;
  params.delete('hash');

  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  return { hash, authDate, user, dataCheckString };
}

function verifyInitData(initData, botToken) {
  const { hash, dataCheckString } = parseInitData(initData);
  if (!hash) return false;

  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();

  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  const received = Buffer.from(hash, 'hex');
  const calculated = Buffer.from(calculatedHash, 'hex');
  if (received.length !== calculated.length) return false;

  return crypto.timingSafeEqual(received, calculated);
}

function validateInitDataAge(initData) {
  const { authDate } = parseInitData(initData);
  if (!authDate) return false;
  const now = Math.floor(Date.now() / 1000);
  return now - authDate <= MAX_AUTH_AGE_SECONDS;
}

function getUserIdFromInitData(initData) {
  const { user } = parseInitData(initData);
  return user?.id || null;
}

function readChannelsConfig() {
  const raw = process.env.REQUIRED_CHANNELS_JSON;
  if (raw) {
    const parsed = safeJsonParse(raw, null);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error('REQUIRED_CHANNELS_JSON must be a non-empty JSON array');
    }
    return parsed;
  }

  if (process.env.REQUIRED_CHANNEL) {
    return [
      {
        chatId: process.env.REQUIRED_CHANNEL,
        title: process.env.REQUIRED_CHANNEL_TITLE || 'Required Channel',
        joinUrl: process.env.REQUIRED_CHANNEL_JOIN_URL || null
      }
    ];
  }

  throw new Error('No required channels configured. Set REQUIRED_CHANNELS_JSON or REQUIRED_CHANNEL.');
}

function normalizeChannel(channel, index) {
  const chatId = channel.chatId || channel.chat_id || channel.username;
  const title = channel.title || channel.name || `Channel ${index + 1}`;
  const joinUrl = channel.joinUrl || channel.join_url || null;

  if (!chatId) {
    throw new Error(`Channel ${index + 1} is missing chatId/chat_id/username`);
  }

  return {
    channelId: String(chatId),
    chatId: String(chatId),
    title: String(title),
    joinUrl: joinUrl ? String(joinUrl) : null
  };
}

function isJoined(member) {
  const status = member?.status;
  if (['creator', 'administrator', 'member'].includes(status)) return true;
  return status === 'restricted' && member?.is_member === true;
}

async function checkOneChannel(botToken, userId, channel) {
  const response = await fetch(`https://api.telegram.org/bot${botToken}/getChatMember`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: channel.chatId,
      user_id: userId
    })
  });

  const telegram = await response.json();

  if (!telegram.ok) {
    return {
      ...channel,
      joined: false,
      status: 'unknown',
      error: telegram.description || 'getChatMember failed'
    };
  }

  return {
    ...channel,
    joined: isJoined(telegram.result),
    status: telegram.result?.status || 'unknown',
    error: null
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const botToken = process.env.BOT_TOKEN;
    if (!botToken) {
      return res.status(500).json({ ok: false, error: 'BOT_TOKEN is not configured' });
    }

    const body = getRequestBody(req);
    const initData = body.initData;

    if (!initData) {
      return res.status(400).json({ ok: false, error: 'Missing initData' });
    }

    if (!verifyInitData(initData, botToken)) {
      return res.status(401).json({ ok: false, error: 'Invalid initData signature' });
    }

    if (!validateInitDataAge(initData)) {
      return res.status(401).json({ ok: false, error: 'Expired initData. Please reopen Mini App.' });
    }

    const userId = getUserIdFromInitData(initData);
    if (!userId) {
      return res.status(400).json({ ok: false, error: 'Unable to read user from initData' });
    }

    const channels = readChannelsConfig().map(normalizeChannel);

    const results = await Promise.all(channels.map((ch) => checkOneChannel(botToken, userId, ch)));
    const allJoined = results.every((item) => item.joined);

    return res.status(200).json({
      ok: true,
      allJoined,
      joined: allJoined,
      userId,
      channels: results
    });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message || 'Unexpected server error' });
  }
};
