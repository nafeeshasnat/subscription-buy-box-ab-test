(() => {
  const variation = window.foldleafVariation;
  const select = (active, updateUrl = true) => {
    if (active) variation.init();
    else variation.destroy();
    document.querySelector('#control').setAttribute('aria-pressed', String(!active));
    document.querySelector('#variant').setAttribute('aria-pressed', String(active));
    if (updateUrl) {
      const url = new URL(location.href);
      url.searchParams.set('v', active ? 'b' : 'control');
      history.replaceState(null, '', url);
    }
  };
  document.querySelector('#control').onclick = () => select(false);
  document.querySelector('#variant').onclick = () => select(true);
  document.querySelector('#disable').onclick = () => select(false);
  document.querySelector('#twice').onclick = () => { select(true); variation.init(); };
  document.querySelector('#rerender').onclick = () => window.purchaseApp.render();
  select(new URLSearchParams(location.search).get('v') === 'b', false);
})();
