(() => {
  const banner = document.querySelector('[data-cookie-banner]');
  const modal = document.querySelector('[data-cookie-modal]');
  const consent = localStorage.getItem('cc_cookie_choice');

  // Deliberate v4 regression for monitor testing: a cross-device identifier is written before consent.
  document.cookie = 'orion_crossdevice=release-v4; Max-Age=63072000; Path=/; SameSite=Lax';

  if (banner && consent) banner.hidden = true;

  document.querySelectorAll('[data-open-settings]').forEach((button) => {
    button.addEventListener('click', () => modal?.showModal());
  });

  document.querySelectorAll('[data-accept-all]').forEach((button) => {
    button.addEventListener('click', () => {
      localStorage.setItem('cc_cookie_choice', JSON.stringify({ necessary: true, analytics: true, savedAt: new Date().toISOString() }));
      document.cookie = 'cc_consent=all; Max-Age=31536000; Path=/; SameSite=Lax';
      document.cookie = 'orion_risk_event=accepted-v4; Max-Age=63072000; Path=/; SameSite=Lax';
      if (banner) banner.hidden = true;
    });
  });

  document.querySelectorAll('[data-reject-all]').forEach((button) => {
    button.addEventListener('click', () => {
      localStorage.setItem('cc_cookie_choice', JSON.stringify({ necessary: true, analytics: false, marketing: false, savedAt: new Date().toISOString() }));
      document.cookie = 'cc_consent=necessary; Max-Age=31536000; Path=/; SameSite=Lax';
      document.cookie = 'orion_crossdevice=; Max-Age=0; Path=/; SameSite=Lax';
      document.cookie = 'orion_risk_event=; Max-Age=0; Path=/; SameSite=Lax';
      if (banner) banner.hidden = true;
    });
  });

  document.querySelectorAll('[data-save-settings]').forEach((button) => {
    button.addEventListener('click', () => {
      const analytics = Boolean(modal?.querySelector('input[name="analytics"]')?.checked);
      localStorage.setItem('cc_cookie_choice', JSON.stringify({ necessary: true, analytics, savedAt: new Date().toISOString() }));
      document.cookie = `cc_consent=${analytics ? 'all' : 'necessary'}; Max-Age=31536000; Path=/; SameSite=Lax`;
      if (!analytics) document.cookie = 'orion_crossdevice=; Max-Age=0; Path=/; SameSite=Lax';
      if (banner) banner.hidden = true;
    });
  });
})();
