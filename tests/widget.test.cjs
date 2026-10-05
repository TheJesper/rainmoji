const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const test = require('node:test');
const { JSDOM } = require('jsdom');

const widgetSource = readFileSync(path.join(__dirname, '..', 'src', 'widget.js'), 'utf8');

function createRainPage(markup = '<body></body>') {
  const dom = new JSDOM(markup, { runScripts: 'outside-only', pretendToBeVisual: true });
  dom.window.setTimeout = () => 0;
  dom.window.clearTimeout = () => {};
  dom.window.eval(widgetSource);
  return dom;
}

test('starts a layered rain burst with varied fall, spin, blur, and delay', (t) => {
  const dom = createRainPage();
  t.after(() => dom.window.close());
  const { document } = dom.window;
  let randomIndex = 0;
  dom.window.Math.random = () => ((randomIndex++ % 89) + 1) / 90;

  const rain = dom.window.EmojiRain.init({ mobileOptimization: false });
  rain.start();

  const particles = [...document.querySelectorAll('.emoji-particle')];
  assert.equal(particles.length, 47);
  assert.deepEqual(new Set(particles.map((particle) => particle.style.zIndex)), new Set(['1', '2', '3']));
  assert.ok(new Set(particles.map((particle) => particle.style.animationDuration)).size > 1);
  assert.ok(new Set(particles.map((particle) => particle.style.animationDelay)).size > 1);
  assert.ok(particles.every((particle) => Number.parseFloat(particle.firstElementChild.style.animationDuration) > 0));
  assert.ok(particles.some((particle) => particle.style.filter.startsWith('blur(')));

  rain.clear();
  assert.equal(document.querySelectorAll('.emoji-particle').length, 0);
});

test('mounts into an HTMLElement without replacing it, then restores its position on destroy', (t) => {
  const dom = createRainPage('<body><div id="mount"></div></body>');
  t.after(() => dom.window.close());
  const host = dom.window.document.getElementById('mount');
  const rain = dom.window.EmojiRain.init({ targetElement: host, mobileOptimization: false });

  assert.equal(host.children.length, 1);
  assert.equal(rain.container.style.position, 'absolute');
  assert.equal(host.style.position, 'relative');

  rain.start();
  assert.equal(host.querySelectorAll('.emoji-particle').length, 47);
  rain.destroy();
  assert.equal(host.children.length, 0);
  assert.equal(host.style.position, '');
  assert.equal(dom.window.document.getElementById('mount'), host);
});

test('reduces particle count on mobile when mobile optimization is enabled', (t) => {
  const dom = createRainPage();
  t.after(() => dom.window.close());
  Object.defineProperty(dom.window, 'innerWidth', { configurable: true, value: 500 });
  dom.window.Math.random = () => 0.5;

  const rain = dom.window.EmojiRain.init();
  rain.start();

  assert.equal(dom.window.document.querySelectorAll('.emoji-particle').length, 28);
});

test('resolves selector targets and rejects missing targets with a useful error', (t) => {
  const dom = createRainPage('<body><div id="mount"></div></body>');
  t.after(() => dom.window.close());

  const rain = dom.window.EmojiRain.init({ targetElement: '#mount' });
  assert.equal(dom.window.document.querySelectorAll('#mount > .emoji-rain-container').length, 1);
  rain.destroy();

  assert.throws(
    () => dom.window.EmojiRain.init({ targetElement: '#missing' }),
    /targetElement must be an existing CSS selector or DOM element/
  );
});

test('starts rain when a configured trigger is clicked', (t) => {
  const dom = createRainPage('<body><button id="trigger">Rain</button></body>');
  t.after(() => dom.window.close());
  dom.window.Math.random = () => 0.5;

  dom.window.EmojiRain.init({ triggerElement: '#trigger', mobileOptimization: false });
  dom.window.document.getElementById('trigger').click();
  assert.equal(dom.window.document.querySelectorAll('.emoji-particle').length, 47);
});

test('publishes a named EmojiRain export through CommonJS and ESM entries', async (t) => {
  const commonJsPath = path.join(__dirname, '..', 'dist', 'emojiRain.js');
  const esmPath = path.join(__dirname, '..', 'dist', 'emojiRain.esm.mjs');
  t.after(() => {
    delete require.cache[require.resolve(commonJsPath)];
  });

  const commonJs = require(commonJsPath);
  const esm = await import(pathToFileURL(esmPath).href);
  assert.equal(typeof commonJs.EmojiRain, 'function');
  assert.equal(typeof esm.EmojiRain, 'function');
});
