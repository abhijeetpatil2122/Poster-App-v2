export const initTelegram = () => {
  const tg = window?.Telegram?.WebApp;
  if (!tg) return;
  tg.ready();
  tg.expand();
  tg.enableClosingConfirmation?.();
  document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#0f172a');
  document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#f8fafc');
  document.documentElement.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color || '#94a3b8');
  document.documentElement.style.setProperty('--tg-theme-link-color', tg.themeParams.link_color || '#60a5fa');
  document.documentElement.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color || '#2563eb');
};

export const haptic = (type = 'impact') => {
  const tg = window?.Telegram?.WebApp;
  if (!tg?.HapticFeedback) return;
  if (type === 'selection') tg.HapticFeedback.selectionChanged();
  else tg.HapticFeedback.impactOccurred('light');
};
