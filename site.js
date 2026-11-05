(() => {
  const banner = document.querySelector('[data-cookie-banner]');
  let modal = document.querySelector('[data-cookie-modal]');
  const consent = localStorage.getItem('cc_cookie_choice');

  if (!modal) {
    document.body.insertAdjacentHTML('beforeend', `<dialog class="cookie-modal" data-cookie-modal><div class="modal-head"><div><p class="eyebrow">COOKIE SETTINGS</p><h2>Cookie 偏好设置</h2></div><button class="icon-button" type="button" data-close-settings aria-label="关闭">×</button></div><p>必要Cookie始终启用。您可以选择是否允许非必要Cookie。</p><label class="toggle-row"><span><strong>必要Cookie</strong><small>保存同意状态</small></span><input type="checkbox" checked disabled></label><label class="toggle-row"><span><strong>分析与识别Cookie</strong><small>用于跨设备识别和风险事件分析</small></span><input type="checkbox" name="analytics"></label><div class="modal-actions"><button class="button primary" type="button" data-save-settings>保存设置</button></div></dialog>`);
    modal = document.querySelector('[data-cookie-modal]');
  }

  // Deliberate regression retained for monitor testing: a cross-device identifier is written before consent.
  document.cookie = 'orion_crossdevice=release-v5; Max-Age=63072000; Path=/; SameSite=Lax';

  if (banner && consent) banner.hidden = true;

  document.querySelectorAll('[data-open-settings]').forEach((button) => {
    button.addEventListener('click', () => modal?.showModal());
  });

  document.querySelectorAll('[data-close-settings]').forEach((button) => {
    button.addEventListener('click', () => modal?.close());
  });

  document.querySelectorAll('[data-accept-all]').forEach((button) => {
    button.addEventListener('click', () => {
      localStorage.setItem('cc_cookie_choice', JSON.stringify({ necessary: true, analytics: true, savedAt: new Date().toISOString() }));
      document.cookie = 'cc_consent=all; Max-Age=31536000; Path=/; SameSite=Lax';
      document.cookie = 'orion_risk_event=accepted-v5; Max-Age=63072000; Path=/; SameSite=Lax';
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

  document.querySelector('[data-demo-form]')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = document.querySelector('[data-form-status]');
    if (status) status.hidden = false;
  });
})();
