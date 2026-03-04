/**
 * Template-based random poem generator.
 * Produces a new short poem (2 stanzas, 4 lines each) on each call.
 */
(function () {
  'use strict';

  var starters = [
    'The light',
    'A breath',
    'The wind',
    'Somewhere',
    'The world',
    'A moment',
    'The night',
    'Your hand',
    'The rain',
    'A thought',
    'The room',
    'Softly',
    'The hour',
    'Something',
    'The sky'
  ];

  var middles = [
    'finds its way',
    'holds the day',
    'stays and waits',
    'bends the light',
    'turns to gold',
    'learns to hold',
    'comes to rest',
    'knows the tune',
    'fills the space',
    'leaves a trace',
    'breaks the still',
    'climbs the hill',
    'meets the dawn',
    'almost gone',
    'begins again'
  ];

  var endings = [
    'through the glass.',
    'and will not pass.',
    'before the night.',
    'in the quiet light.',
    'like a secret kept.',
    'while the world has slept.',
    'where the shadows fall.',
    'and that is all.',
    'without a name.',
    'inside the frame.',
    'beneath the tree.',
    'for you and me.',
    'across the floor.',
    'and nothing more.',
    'against the door.'
  ];

  var titles = [
    'Random Verse',
    'A Moment',
    'Untitled',
    'Fragment',
    'Today',
    'Here',
    'Now',
    'Still',
    'Then',
    'After'
  ];

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function generateLine() {
    return pick(starters) + ' ' + pick(middles) + ' ' + pick(endings);
  }

  function generatePoem() {
    var lines = [];
    for (var i = 0; i < 8; i++) {
      lines.push(generateLine());
    }
    return {
      title: pick(titles),
      lines: lines
    };
  }

  function renderPoem(container, poem) {
    if (!container) return;
    var titleEl = container.querySelector('.poem-title');
    var stanzasEl = container.querySelector('.poem-stanzas');
    if (titleEl) titleEl.textContent = poem.title;
    if (!stanzasEl) return;
    stanzasEl.innerHTML = '';
    var stanza1 = document.createElement('div');
    stanza1.className = 'stanza';
    for (var i = 0; i < 4; i++) {
      var p = document.createElement('p');
      p.textContent = poem.lines[i];
      stanza1.appendChild(p);
    }
    var stanza2 = document.createElement('div');
    stanza2.className = 'stanza';
    for (var j = 4; j < 8; j++) {
      var q = document.createElement('p');
      q.textContent = poem.lines[j];
      stanza2.appendChild(q);
    }
    stanzasEl.appendChild(stanza1);
    stanzasEl.appendChild(stanza2);
  }

  function init() {
    var container = document.getElementById('random-poem');
    var btn = document.getElementById('another-poem-btn');
    if (!container) return;

    function showNew() {
      var poem = generatePoem();
      renderPoem(container, poem);
    }

    showNew();
    if (btn) {
      btn.addEventListener('click', showNew);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
