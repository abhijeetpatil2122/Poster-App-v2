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
  if (!hash) {
    return false;
  }

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

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const botToken = process.env.BOT_TOKEN;
    const defaultChannel = process.env.REQUIRED_CHANNEL;

    if (!botToken) {
      return res.status(500).json({ error: 'BOT_TOKEN is not configured' });
    }

    const { initData, userId, channel } = req.body || {};
    const targetChannel = channel || defaultChannel;

    if (!initData || !userId || !targetChannel) {
      return res.status(400).json({
        error: 'Missing initData, userId, or channel/REQUIRED_CHANNEL'
      });
    }

    const isValid = verifyInitData(initData, botToken);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid initData signature' });
    }

    const chatMemberUrl = `https://api.telegram.org/bot${botToken}/getChatMember`;
    const telegramResp = await fetch(chatMemberUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: targetChannel,
        user_id: userId
      })
    });

    const telegramData = await telegramResp.json();

    if (!telegramData.ok) {
      return res.status(400).json({
        error: telegramData.description || 'Telegram getChatMember failed'
      });
    }

    const status = telegramData.result?.status;
    const joined = ['creator', 'administrator', 'member'].includes(status);

    return res.status(200).json({ joined, status });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Unexpected server error' });
  }
};
