/*
 * Breadcrumb root.
 * Renames the first breadcrumb entry ("Home") to the publication title, then adds a root
 * entry ("Rubrik Documentation") in front of it. The "Home" link target stays the same.
 * The root entry is the documentation home, /en-us/index.html. On docs.rubrik.com and stage-docs.rubrik.com
 * it stays on the same host. On any other host, such as a local build, it goes to docs.rubrik.com. Edit
 * ROOT_URL here to change it (gated site).
 */
(function () {
  var ROOT_LABEL = 'Rubrik Documentation';
  var host = window.location.hostname;
  var ROOT_URL = (host === 'docs.rubrik.com' || host === 'stage-docs.rubrik.com')
    ? window.location.origin + '/en-us/index.html'
    : 'https://docs.rubrik.com/en-us/index.html';

  function update() {
    var homeLabel = document.querySelector('.wh_breadcrumb .home a span');
    if (!homeLabel) {
      return false;
    }
    var homeItem = homeLabel.closest('li');
    if (!homeItem || homeItem.getAttribute('data-rk-root')) {
      return true;
    }
    var title = document.querySelector('.wh_publication_title .title');
    if (title && title.textContent.trim()) {
      homeLabel.textContent = title.textContent.trim();
    }
    var rootItem = homeItem.cloneNode(true);
    var rootLink = rootItem.querySelector('a');
    var rootText = rootItem.querySelector('a span');
    var rootSpan = rootItem.querySelector('.home');
    if (rootLink && rootText) {
      rootLink.setAttribute('href', ROOT_URL);
      rootText.textContent = ROOT_LABEL;
      if (rootSpan) {
        rootSpan.classList.remove('home');
        rootSpan.classList.add('rk-root');
      }
      homeItem.parentNode.insertBefore(rootItem, homeItem);
    }
    homeItem.setAttribute('data-rk-root', 'true');
    return true;
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (update()) {
      return;
    }
    var target = document.querySelector('.wh_breadcrumb') || document.body;
    var observer = new MutationObserver(function () {
      if (update()) {
        observer.disconnect();
      }
    });
    observer.observe(target, { childList: true, subtree: true });
  });
})();
