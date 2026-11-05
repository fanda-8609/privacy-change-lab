(() => {
  const banner = document.querySelector('[data-cookie-banner]');
  const modal = document.querySelector('[data-cookie-modal]');
  const consent = localStorage.getItem('cc_cookie_choice');

  // Deliberate v3 regression for monitor testing: a profiling cookie is written before consent.
  document.cookie = 'atlas_profile=release-v3; Max-Age=31536000; Path=/; SameSite=Lax';

  if (banner && consent) banner.hidden = true;

  document.querySelectorAll('[data-open-settings]').forEach((button) => {
    button.addEventListener('click', () => modal?.showModal());
  });

  document.querySelectorAll('[data-accept-all]').forEach((button) => {
    button.addEventListener('click', () => {
      localStorage.setItem('cc_cookie_choice', JSON.stringify({ necessary: true, analytics: true, savedAt: new Date().toISOString() }));
      document.cookie = 'cc_consent=all; Max-Age=31536000; Path=/; SameSite=Lax';
      document.cookie = 'atlas_conversion=accepted-v3; Max-Age=31536000; Path=/; SameSite=Lax';
      if (banner) banner.hidden = true;
    });
  });

  document.querySelectorAll('[data-reject-all]').forEach((button) => {
    button.addEventListener('click', () => {
      localStorage.setItem('cc_cookie_choice', JSON.stringify({ necessary: true, analytics: false, marketing: false, savedAt: new Date().toISOString() }));
      document.cookie = 'cc_consent=necessary; Max-Age=31536000; Path=/; SameSite=Lax';
      document.cookie = 'atlas_profile=; Max-Age=0; Path=/; SameSite=Lax';
      document.cookie = 'atlas_conversion=; Max-Age=0; Path=/; SameSite=Lax';
      if (banner) banner.hidden = true;
    });
  });

  document.querySelectorAll('[data-save-settings]').forEach((button) => {
    button.addEventListener('click', () => {
      const analytics = Boolean(modal?.querySelector('input[name="analytics"]')?.checked);
      localStorage.setItem('cc_cookie_choice', JSON.stringify({ necessary: true, analytics, savedAt: new Date().toISOString() }));
      document.cookie = `cc_consent=${analytics ? 'all' : 'necessary'}; Max-Age=31536000; Path=/; SameSite=Lax`;
      if (!analytics) document.cookie = 'atlas_profile=; Max-Age=0; Path=/; SameSite=Lax';
      if (banner) banner.hidden = true;
    });
  });
})();
