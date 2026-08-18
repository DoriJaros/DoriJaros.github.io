// Typographic tidy-up: glue single-letter words to the next word so they
// never sit alone at the end of a line.
(function () {
  var scope = document.querySelectorAll('.prose, .project-desc, .hero-text, .spoiler, .panel-title, .case-intro, .case-block, .case-quote, .case-qa, .case-list, .case-tldr, .case-h, .case-nav');
  var re = /(^|[\s"'(\u2014\u2013\u201c\u201a])([a-zA-Z0-9])[ \t]+/g;

  scope.forEach(function (root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var node;
    while ((node = walker.nextNode())) {
      var fixed = node.nodeValue.replace(re, '$1$2\u00A0');
      if (fixed !== node.nodeValue) node.nodeValue = fixed;
    }
  });
})();

// Size the prototype iframe to its content so it never scrolls internally.
(function () {
  var frames = document.querySelectorAll('.proto-frame iframe, .cs-proto iframe');
  if (!frames.length) return;
  frames.forEach(function (f) {
    function fit() {
      try {
        var d = f.contentDocument;
        if (!d || !d.body) return;
        var h = Math.max(d.body.scrollHeight, d.documentElement.scrollHeight);
        var cap = Math.min(window.innerHeight * 0.82, 900);
        if (h > 0) f.style.height = Math.min(h, cap) + 'px';
      } catch (e) {}
    }
    f.addEventListener('load', function () { fit(); setTimeout(fit, 400); });
    if (f.contentDocument && f.contentDocument.readyState === 'complete') fit();
  });
})();

// Lightbox for case-study images.
(function () {
  var box = document.getElementById('lightbox');
  if (!box) return;
  var img = document.getElementById('lightbox-img');
  var cap = document.getElementById('lightbox-cap');
  var prev = box.querySelector('[data-lb="prev"]');
  var next = box.querySelector('[data-lb="next"]');
  var btns = Array.prototype.slice.call(document.querySelectorAll('.figure-btn, .cs-fig button'));
  if (!btns.length) return;

  var items = btns.map(function (b) {
    var el = b.querySelector('img');
    var fc = b.parentNode.querySelector('.figure-cap, .cs-cap');
    var text = '';
    if (fc) {
      var c = fc.cloneNode(true);
      var hint = c.querySelector('.figure-hint, b');
      if (hint) hint.remove();
      text = c.textContent.trim();
    }
    return { src: el.getAttribute('src'), alt: el.getAttribute('alt') || '', cap: text };
  });
  var i = 0;

  function show(n) {
    i = (n + items.length) % items.length;
    img.src = items[i].src;
    img.alt = items[i].alt;
    cap.textContent = items[i].cap;
    prev.hidden = next.hidden = items.length < 2;
  }

  function open(n) {
    show(n);
    box.hidden = false;
    document.body.style.overflow = 'hidden';
    box.querySelector('[data-lb="close"]').focus();
  }

  function close() {
    box.hidden = true;
    document.body.style.overflow = '';
  }

  btns.forEach(function (b, n) {
    b.addEventListener('click', function () { open(n); });
  });

  box.addEventListener('click', function (e) {
    var act = e.target.getAttribute && e.target.getAttribute('data-lb');
    if (act === 'close') close();
    else if (act === 'prev') show(i - 1);
    else if (act === 'next') show(i + 1);
    else if (e.target === box) close();
  });

  addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(i - 1);
    if (e.key === 'ArrowRight') show(i + 1);
  });
})();

// App bar inverts to cream-on-blue while it overlaps a blue panel.
(function () {
  var bar = document.querySelector('.bar');
  if (!bar) return;
  var panels = Array.prototype.slice.call(document.querySelectorAll('.panel, .cs'));
  var raf = null;

  function update() {
    raf = null;
    var edge = bar.getBoundingClientRect().bottom - 1;
    var dark = panels.some(function (p) {
      var r = p.getBoundingClientRect();
      return r.top <= edge && r.bottom > edge - bar.offsetHeight;
    });
    bar.classList.toggle('over-dark', dark);
  }

  function schedule() { if (raf === null) raf = requestAnimationFrame(update); }

  update();
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
})();

// Home hero: cross-fade three role words every few seconds.
(function () {
  var el = document.getElementById('rotating');
  if (!el) return;

  var groups = [
    ['system builder,', 'fast failer,', 'user ombudsman.'],
    ['complexity tamer,', 'friction killer,', 'illustrator.'],
    ['problem framer,', 'edge case hunter,', 'words up-maker.'],
    ['flow finder,', 'cross-platform thinker,', 'whitespace guardian.'],
    ['pattern seeker,', 'pen-and-paper thinker,', 'horror shift survivor.']
  ];

  var i = Math.floor(Math.random() * groups.length);

  function paint() {
    el.innerHTML = groups[i].map(function (w) {
      return '<span>' + w + '</span>';
    }).join('');
  }

  paint();

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  setInterval(function () {
    el.dataset.fade = 'true';
    setTimeout(function () {
      i = (i + 1) % groups.length;
      paint();
      el.dataset.fade = 'false';
    }, 900);
  }, 4400);
})();
