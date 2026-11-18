(() => {
  if (window.foldleafVariation) {
    window.foldleafVariation.init();
    return;
  }

  let active = false;
  let observer;
  let listeners;
  let native;
  let cards;
  let trust;

  function restore() {
    listeners?.abort();
    cards?.remove();
    trust?.remove();
    if (native) native.hidden = false;
    native = cards = trust = null;
  }

  // Read the price the app rendered for an option, so B never keeps its own price list.
  function priceOf(value) {
    const label = native.querySelector(`input[value="${value}"]`)?.closest('label');
    const price = label?.querySelector('[data-price]');
    return price ? { cents: Number(price.dataset.price), text: price.textContent } : null;
  }

  function attach() {
    const current = document.querySelector('#purchase-host [data-native]');
    if (!current || (native === current && cards?.isConnected)) return;
    restore();
    native = current;
    const once = priceOf('once');
    const plan = priceOf('subscription');
    cards = document.createElement('fieldset');
    cards.className = 'foldleaf-options';
    cards.innerHTML = `<legend>Choose your refill</legend>
      <label class="foldleaf-card"><input type="radio" name="foldleaf-mode" value="once">
        <span class="foldleaf-name">One-time purchase</span>
        <span class="foldleaf-price">${once ? once.text : ''}</span></label>
      <div class="foldleaf-sub">
        <label class="foldleaf-card"><input type="radio" name="foldleaf-mode" value="subscription">
          <span class="foldleaf-name">Subscription <b>Save 15%</b></span>
          <span class="foldleaf-price">${once ? `<s>${once.text}</s> ` : ''}${plan ? plan.text : ''}</span>
          <small class="foldleaf-badge">Most popular</small></label>
        <ul class="foldleaf-benefits">
          <li>15% off every refill</li>
          <li>Skip, pause or cancel anytime</li>
          <li>Change your interval between refills</li>
        </ul>
        <label class="foldleaf-frequency">Delivery frequency <select></select></label>
      </div>`;
    const frequency = native.querySelector('[data-frequency]');
    const picker = cards.querySelector('select');
    for (const option of frequency.options) picker.add(new Option(option.text, option.value));

    trust = document.createElement('ul');
    trust.className = 'foldleaf-trust';
    trust.innerHTML = '<li>Ships in 2 days</li><li>30-day returns</li><li>Secure checkout</li>';

    function reflect() {
      const mode = native.querySelector('input[type=radio]:checked').value;
      cards.querySelector(`[value="${mode}"]`).checked = true;
      cards.classList.toggle('is-subscription', mode === 'subscription');
      picker.value = frequency.value;
      picker.disabled = mode === 'once';
    }
    listeners = new AbortController();
    const options = { signal: listeners.signal };
    cards.addEventListener('change', ({ target }) => {
      if (target === picker) {
        frequency.value = picker.value;
        frequency.dispatchEvent(new Event('change', { bubbles: true }));
      } else if (target.matches('input[type=radio]')) {
        native.querySelector(`input[value="${target.value}"]`).click();
      }
      reflect();
    }, options);
    native.addEventListener('change', reflect, options);
    native.hidden = true;
    native.after(cards);
    native.closest('form')?.querySelector('.primary')?.after(trust);
    reflect();
  }

  function init() {
    if (active) return;
    active = true;
    observer = new MutationObserver(attach);
    observer.observe(document.querySelector('#product') || document.documentElement, { childList: true, subtree: true });
    attach();
  }
  function destroy() {
    active = false;
    observer?.disconnect();
    restore();
  }
  window.foldleafVariation = { init, destroy };
  init();
})();
