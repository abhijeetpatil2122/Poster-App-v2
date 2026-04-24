const crypto = require('crypto');

function parseInitData(initData) {
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  params.delete('hash');

  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  return { hash, dataCheckString };
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

  return calculatedHash === hash;
}

function readChannelsConfig(reqBody) {
  const rawList = process.env.REQUIRED_CHANNELS_JSON;
  if (rawList) {
    try {
      const parsed = JSON.parse(rawList);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (error) {
      throw new Error('REQUIRED_CHANNELS_JSON is not valid JSON');
    }
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

  const { channels } = reqBody || {};
  if (Array.isArray(channels) && channels.length > 0) {
    return channels;
  }

  return [];
}

function normalizeChannel(channel, index) {
  const chatId = channel.chatId || channel.chat_id || channel.username;
  const title = channel.title || channel.name || `Channel ${index + 1}`;
  const joinUrl = channel.joinUrl || channel.join_url || null;

  if (!chatId) {
    throw new Error(`Channel ${index + 1} is missing chatId/chat_id/username`);
  }

  return {
    id: String(chatId),
    chatId,
    title,
    joinUrl
  };
}

function isJoined(chatMemberResult) {
  const status = chatMemberResult?.status;
  if (['creator', 'administrator', 'member'].includes(status)) {
    return true;
  }

  if (status === 'restricted' && chatMemberResult?.is_member === true) {
    return true;
  }

  return false;
}

async function checkChannelMembership(botToken, userId, channel) {
  const chatMemberUrl = `https://api.telegram.org/bot${botToken}/getChatMember`;

  const telegramResp = await fetch(chatMemberUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: channel.chatId,
      user_id: userId
    })
  });

  const telegramData = await telegramResp.json();

  if (!telegramData.ok) {
    return {
      channelId: channel.id,
      title: channel.title,
      joinUrl: channel.joinUrl,
      joined: false,
      status: 'unknown',
      error: telegramData.description || 'Telegram getChatMember failed'
    };
  }

  const result = telegramData.result || {};

  return {
    channelId: channel.id,
    title: channel.title,
    joinUrl: channel.joinUrl,
    joined: isJoined(result),
    status: result.status || 'unknown'
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const botToken = process.env.BOT_TOKEN;

    if (!botToken) {
      return res.status(500).json({ error: 'BOT_TOKEN is not configured' });
    }

    const { initData, userId } = req.body || {};

    if (!initData || !userId) {
      return res.status(400).json({ error: 'Missing initData or userId' });
    }

    if (!verifyInitData(initData, botToken)) {
      return res.status(401).json({ error: 'Invalid initData signature' });
    }

    const channels = readChannelsConfig(req.body).map(normalizeChannel);

    if (channels.length === 0) {
      return res.status(400).json({
        error: 'No required channels configured. Set REQUIRED_CHANNELS_JSON or REQUIRED_CHANNEL.'
      });
    }

    const checks = await Promise.all(
      channels.map((channel) => checkChannelMembership(botToken, userId, channel))
    );

    const allJoined = checks.every((item) => item.joined);

    return res.status(200).json({
      joined: allJoined,
      allJoined,
      channels: checks
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Unexpected server error' });
  }
};
