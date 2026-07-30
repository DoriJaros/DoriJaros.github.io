// Typographic tidy-up: glue single-letter words to the next word so they
// never sit alone at the end of a line.
(function () {
  var scope = document.querySelectorAll('.prose, .project-desc, .hero-text, .spoiler, .panel-title');
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

// App bar inverts to cream-on-blue while it overlaps a blue panel.
(function () {
  var bar = document.querySelector('.bar');
  if (!bar) return;
  var panels = Array.prototype.slice.call(document.querySelectorAll('.panel'));
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
    ['complexity tamer,', 'friction killer,', 'accidental illustrator.'],
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
