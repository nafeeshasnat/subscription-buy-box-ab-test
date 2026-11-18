(() => {
  const form = document.querySelector('#product');
  let count = 0;
  // Local transport boundary. Inspect the serialized POST body here, after submission.
  function mockTransport(request) {
    const received = JSON.parse(request.body);
    document.querySelector('#payload').textContent = JSON.stringify(received, null, 2);
    document.querySelector('#status').textContent = `POST /cart/add.js · Request ${++count}`;
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    const fields = new FormData(form);
    const item = { id: Number(fields.get('id')), quantity: Number(fields.get('quantity')) };
    if (fields.has('selling_plan')) item.selling_plan = Number(fields.get('selling_plan'));
    mockTransport({ method: 'POST', path: '/cart/add.js', body: JSON.stringify({ items: [item] }) });
  });
  form.elements.id.addEventListener('change', () => window.purchaseApp.render());
})();
