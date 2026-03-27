(function (Drupal, once) {
  Drupal.behaviors.textsizeControl = {
    attach: function (context) {
      once('textsize-control', context.querySelector('body')).forEach(function () {

        const root = document.documentElement;
        const STORAGE_KEY = 'textScale';
        const MODE_KEY = 'textScaleMode';

        const STEP = 0.025;
        const MIN = 0.7;
        const MAX = 2;

        let scale = parseFloat(localStorage.getItem(STORAGE_KEY)) || 1;
        let mode = localStorage.getItem(MODE_KEY) || 'root';

        applyScale(scale, mode);

        // --- UI ---
        const container = document.createElement('div');
        container.className = 'textsize-controls';

        const smaller = document.createElement('button');
        smaller.textContent = 'A-';

        const reset = document.createElement('button');
        reset.textContent = 'A';

        const larger = document.createElement('button');
        larger.textContent = 'A+';

        container.append(smaller, reset, larger);
        document.body.appendChild(container);

        // --- Event handlers ---
        smaller.addEventListener('click', () => update(scale - STEP));
        larger.addEventListener('click', () => update(scale + STEP));
        reset.addEventListener('click', () => update(1));

        // --- Core update ---
        function update(newScale) {
          scale = clamp(newScale, MIN, MAX);

          // round to 2 decimals to avoid float garbage
          scale = Math.round(scale * 100) / 100;

          // try root scaling first
          applyScale(scale, 'root');

          if (!didScaleAffectPage()) {
            applyScale(scale, 'class');
            mode = 'class';
          } else {
            mode = 'root';
          }

          localStorage.setItem(STORAGE_KEY, scale);
          localStorage.setItem(MODE_KEY, mode);
        }

        // --- Apply scale ---
        function applyScale(scale, mode) {
          root.style.setProperty('--text-scale', scale);

          document.body.classList.remove(
            'textsize-mode-root',
            'textsize-mode-class',
            'textsize-mode-transform'
          );

          if (mode === 'root') {
            root.style.fontSize = (16 * scale) + 'px';
            document.body.classList.add('textsize-mode-root');
          }

          else if (mode === 'class') {
            root.style.fontSize = '';
            document.body.classList.add('textsize-mode-class');
          }

          else if (mode === 'transform') {
            root.style.fontSize = '';
            document.body.classList.add('textsize-mode-transform');
          }
        }

        // --- Detection ---
        function didScaleAffectPage() {
          const testEl = document.querySelector('p, span, div');
          if (!testEl) return true;

          const before = testEl.getBoundingClientRect().height;

          // force reflow
          void testEl.offsetHeight;

          const after = testEl.getBoundingClientRect().height;

          return Math.abs(after - before) > 0.5;
        }

        // --- Utility ---
        function clamp(value, min, max) {
          return Math.min(max, Math.max(min, value));
        }

      });
    }
  };
})(Drupal, once);
