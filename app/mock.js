(() => {
  const host = document.querySelector('#purchase-host');
  const form = document.querySelector('#product');
  // Prices in cents per product variant. Subscriptions save 15%.
  const prices = { 4101: 1800, 4102: 2000 };
  const discount = 0.15;
  const money = cents => (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  const state = { type: 'once', frequency: '8104' };

  function sync() {
    const subscribed = state.type === 'subscription';
    const plan = host.querySelector('[name=selling_plan]');
    plan.disabled = !subscribed;
    plan.value = subscribed ? state.frequency : '';
    host.querySelector('[data-frequency]').disabled = !subscribed;
  }

  function render() {
    const base = prices[form.elements.id.value] || prices[4101];
    const planPrice = Math.round(base * (1 - discount));
    host.innerHTML = `<fieldset data-native><legend>Purchase option</legend>
      <label><input type="radio" name="purchase" value="once"> One-time purchase <span data-price="${base}">${money(base)}</span></label>
      <label><input type="radio" name="purchase" value="subscription"> Subscription, save 15% <span data-price="${planPrice}">${money(planPrice)}</span></label>
      <label>Delivery frequency <select data-frequency><option value="8104">Every 4 weeks</option><option value="8108">Every 8 weeks</option></select></label>
      <input type="hidden" name="selling_plan"></fieldset>`;
    host.querySelector(`[value="${state.type}"]`).checked = true;
    host.querySelector('[data-frequency]').value = state.frequency;
    sync();
  }
  host.addEventListener('change', ({ target }) => {
    if (target.name === 'purchase') state.type = target.value;
    else if (target.matches('[data-frequency]')) state.frequency = target.value;
    else return;
    sync();
  });
  window.purchaseApp = { render, money };
  render();
})();
