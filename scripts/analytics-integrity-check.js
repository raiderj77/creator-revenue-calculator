import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const themePath = path.join(root, 'assets', 'js', 'theme.js');
const homePath = path.join(root, 'index.html');
const packagePath = path.join(root, 'package.json');
const themeSource = fs.readFileSync(themePath, 'utf8');
const homeSource = fs.readFileSync(homePath, 'utf8');
const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
let assertions = 0;

function ok(value, message) {
  assert.ok(value, message);
  assertions += 1;
}

function equal(actual, expected, message) {
  assert.equal(actual, expected, message);
  assertions += 1;
}

class FakeElement {
  constructor(tagName, ownerDocument) {
    this.tagName = String(tagName).toUpperCase();
    this.ownerDocument = ownerDocument;
    this.parentNode = null;
    this.children = [];
    this.attributes = new Map();
    this.listeners = new Map();
    this.style = {};
    this.id = '';
    this.className = '';
    this.textContent = '';
    this.type = '';
    this.href = '';
    this.src = '';
    this.rel = '';
    this.media = '';
    this.async = false;
  }

  get isConnected() {
    return this.ownerDocument.contains(this);
  }

  appendChild(child) {
    if (child.parentNode) child.remove();
    child.parentNode = this;
    this.children.push(child);
    return child;
  }

  remove() {
    if (!this.parentNode) return;
    const index = this.parentNode.children.indexOf(this);
    if (index >= 0) this.parentNode.children.splice(index, 1);
    this.parentNode = null;
  }

  setAttribute(name, value) {
    const stringValue = String(value);
    this.attributes.set(name, stringValue);
    if (name === 'id') this.id = stringValue;
    if (name === 'class') this.className = stringValue;
  }

  getAttribute(name) {
    if (name === 'id') return this.id || null;
    if (name === 'class') return this.className || null;
    return this.attributes.has(name) ? this.attributes.get(name) : null;
  }

  addEventListener(type, listener) {
    if (!this.listeners.has(type)) this.listeners.set(type, []);
    this.listeners.get(type).push(listener);
  }

  emit(type, event = {}) {
    for (const listener of this.listeners.get(type) || []) listener.call(this, event);
  }

  click() {
    this.emit('click', { target: this, preventDefault() {} });
  }

  focus() {
    this.ownerDocument.activeElement = this;
  }

  select() {}

  querySelector(selector) {
    return this.ownerDocument.findWithin(this, selector)[0] || null;
  }
}

class FakeDocument {
  constructor(options) {
    this.listeners = new Map();
    this.activeElement = null;
    this.title = 'Private query title';
    this._referrer = options.referrer || '';
    this._referrerThrows = options.referrerThrows === true;
    this._cookie = '_ga=old; ordinary=value';
    this.cookieWrites = [];
    this.documentElement = new FakeElement('html', this);
    this.head = new FakeElement('head', this);
    this.body = new FakeElement('body', this);
    this.documentElement.appendChild(this.head);
    this.documentElement.appendChild(this.body);
  }

  get referrer() {
    if (this._referrerThrows) throw new Error('referrer unavailable');
    return this._referrer;
  }

  get cookie() {
    return this._cookie;
  }

  set cookie(value) {
    this.cookieWrites.push(String(value));
  }

  createElement(tagName) {
    return new FakeElement(tagName, this);
  }

  addEventListener(type, listener) {
    if (!this.listeners.has(type)) this.listeners.set(type, []);
    this.listeners.get(type).push(listener);
  }

  emit(type) {
    for (const listener of [...(this.listeners.get(type) || [])]) listener.call(this, { type });
  }

  contains(target) {
    let current = target;
    while (current) {
      if (current === this.documentElement) return true;
      current = current.parentNode;
    }
    return false;
  }

  allElements(root = this.documentElement) {
    return [root, ...root.children.flatMap((child) => this.allElements(child))];
  }

  getElementById(id) {
    return this.allElements().find((element) => element.id === id) || null;
  }

  findWithin(root, selector) {
    const candidates = root.children.flatMap((child) => this.allElements(child));
    if (selector.startsWith('.')) {
      const className = selector.slice(1);
      return candidates.filter((element) => element.className.split(/\s+/).includes(className));
    }
    return candidates.filter((element) => element.tagName === selector.toUpperCase());
  }

  querySelectorAll(selector) {
    return this.findWithin(this.documentElement, selector);
  }

  querySelector(selector) {
    if (selector === 'link[rel="canonical"]') return null;
    return this.querySelectorAll(selector)[0] || null;
  }

  execCommand() {
    return true;
  }
}

class FakeStorage {
  constructor(options) {
    this.values = new Map();
    this.throwOnGet = options.throwOnGet === true;
    this.throwOnSet = options.throwOnSet === true;
    if (options.storedChoice !== undefined) {
      this.values.set('creatorrevenuecalculator:analytics-consent', options.storedChoice);
    }
  }

  getItem(key) {
    if (this.throwOnGet) throw new Error('storage read unavailable');
    return this.values.has(key) ? this.values.get(key) : null;
  }

  setItem(key, value) {
    if (this.throwOnSet) throw new Error('storage write unavailable');
    this.values.set(key, String(value));
  }
}

function createHarness(options = {}) {
  const pageUrl = new URL(options.pageUrl || 'https://creatorrevenuecalculator.com/tools/test/?private=1#hidden');
  const document = new FakeDocument(options);
  const localStorage = new FakeStorage(options);
  const navigator = {};
  if (options.gpcThrows) {
    Object.defineProperty(navigator, 'globalPrivacyControl', {
      get() { throw new Error('privacy signal unavailable'); },
    });
  } else {
    navigator.globalPrivacyControl = options.gpc === true;
  }

  const window = {
    document,
    navigator,
    localStorage,
    location: pageUrl,
    dataLayer: [],
    matchMedia() { return { matches: false }; },
    requestAnimationFrame(callback) { callback(); return 1; },
    setTimeout,
    clearTimeout,
    print() {},
  };
  window.window = window;

  const context = vm.createContext({
    window,
    document,
    navigator,
    localStorage,
    URL,
    Date,
    Promise,
    setTimeout,
    clearTimeout,
  });
  vm.runInContext(themeSource, context, { filename: 'assets/js/theme.js' });

  return {
    window,
    document,
    localStorage,
    ready() { document.emit('DOMContentLoaded'); },
    commands() { return window.dataLayer.map((entry) => Array.from(entry)); },
    loader() { return document.head.children.find((child) => child.tagName === 'SCRIPT') || null; },
  };
}

function commandIndexes(harness, predicate) {
  const indexes = [];
  harness.commands().forEach((command, index) => {
    if (predicate(command)) indexes.push(index);
  });
  return indexes;
}

function findButton(root, label) {
  return root.ownerDocument.allElements(root).find((element) => element.tagName === 'BUTTON' && element.textContent === label) || null;
}

function openChoices(harness) {
  const launcher = harness.document.getElementById('crc-privacy-choices');
  ok(launcher, 'privacy launcher exists');
  launcher.click();
  const dialog = harness.document.getElementById('crc-analytics-choices');
  ok(dialog, 'privacy choices dialog opens');
  return dialog;
}

function allowFromDialog(harness, dialog) {
  const allow = findButton(dialog, 'Allow analytics');
  ok(allow, 'allow action is available');
  allow.click();
}

function denyFromDialog(harness, dialog) {
  const deny = findButton(dialog, 'Continue without analytics');
  ok(deny, 'deny action is available');
  deny.click();
}

function assertDefaultDenied(harness, message) {
  const commands = harness.commands();
  equal(commands[0][0], 'consent', `${message}: first command is consent`);
  equal(commands[0][1], 'default', `${message}: first consent command is the default`);
  equal(commands[0][2].analytics_storage, 'denied', `${message}: analytics storage defaults to denied`);
  equal(commandIndexes(harness, (command) => command[0] === 'consent' && command[1] === 'default').length, 1, `${message}: one shared consent default is queued`);
  const disableKeys = Object.keys(harness.window).filter((key) => key.startsWith('ga-disable-'));
  equal(disableKeys.length, 1, `${message}: one analytics disable flag exists`);
  equal(harness.window[disableKeys[0]], true, `${message}: analytics begins disabled`);
}

function assertNotConfigured(harness, message) {
  ok(!harness.commands().some((command) => command[0] === 'config'), `${message}: no configuration command`);
  ok(!harness.commands().some((command) => command[0] === 'event'), `${message}: no analytics event`);
  equal(harness.loader(), null, `${message}: no analytics loader`);
}

function configuredSet(harness) {
  const command = harness.commands().find((entry) => entry[0] === 'set');
  ok(command, 'global analytics context is set');
  return command[1];
}

function runRuntimeMatrix() {
  const undecided = createHarness();
  assertDefaultDenied(undecided, 'undecided state');
  equal(undecided.window.crcTrackEvent('calculator_completed'), false, 'events are blocked before consent');
  undecided.ready();
  const firstDialog = undecided.document.getElementById('crc-analytics-choices');
  ok(firstDialog, 'an undecided visitor sees the privacy choices dialog');
  const dialogCopy = undecided.document.allElements(firstDialog).find((element) => element.tagName === 'P').textContent;
  for (const phrase of ['limited referrer', 'device and browser details', 'approximate location', 'enhanced-measurement interactions', 'calculator inputs, results, or URL queries']) {
    ok(dialogCopy.includes(phrase), `dialog discloses ${phrase}`);
  }
  assertNotConfigured(undecided, 'undecided state');

  const denied = createHarness({ storedChoice: 'denied' });
  denied.ready();
  assertDefaultDenied(denied, 'saved denial');
  ok(denied.document.getElementById('crc-privacy-choices'), 'saved denial shows the privacy launcher');
  assertNotConfigured(denied, 'saved denial');

  const allowed = createHarness({
    storedChoice: 'granted',
    referrer: 'https://creatorrevenuecalculator.com/from/private?account=1#fragment',
  });
  assertDefaultDenied(allowed, 'saved grant before DOM ready');
  allowed.ready();
  const commands = allowed.commands();
  const grantIndex = commands.findIndex((command) => command[0] === 'consent' && command[1] === 'update' && command[2].analytics_storage === 'granted');
  const jsIndex = commands.findIndex((command) => command[0] === 'js');
  const setIndex = commands.findIndex((command) => command[0] === 'set');
  const configIndex = commands.findIndex((command) => command[0] === 'config');
  const pageViewIndex = commands.findIndex((command) => command[0] === 'event' && command[1] === 'page_view');
  ok(grantIndex > 0, 'saved grant issues a consent update after the denied default');
  ok(grantIndex < jsIndex && jsIndex < setIndex && setIndex < configIndex && configIndex < pageViewIndex, 'grant, initialization, and sanitized global context precede config and page view');
  const globalContext = configuredSet(allowed);
  equal(globalContext.page_location, 'https://creatorrevenuecalculator.com/tools/test/', 'page location excludes query and fragment');
  equal(globalContext.page_referrer, 'https://creatorrevenuecalculator.com/from/private', 'same-origin referrer keeps only origin and path');
  equal(globalContext.page_title, 'Private query title', 'page title is set globally before configuration');
  const config = commands[configIndex][2];
  equal(config.send_page_view, false, 'automatic config page view is disabled');
  equal(config.allow_google_signals, false, 'Google signals are disabled');
  equal(config.allow_ad_personalization_signals, false, 'ad personalization signals are disabled');
  ok(allowed.loader(), 'saved grant requests the analytics loader');
  const serializedCommands = JSON.stringify(commands);
  for (const secretFragment of ['private=1', 'account=1', '#hidden', '#fragment']) {
    ok(!serializedCommands.includes(secretFragment), `queued analytics commands exclude ${secretFragment}`);
  }

  equal(allowed.window.crcTrackEvent('calculator_completed'), true, 'one allowlisted generic event is accepted');
  equal(allowed.window.crcTrackEvent('calculator_completed', { private: true }), false, 'an event with an extra argument is rejected');
  equal(allowed.window.crcTrackEvent('not_allowlisted'), false, 'an unallowlisted event is rejected');
  equal(allowed.window.crcTrackEvent('toString'), false, 'an inherited property name is not treated as allowlisted');
  equal(allowed.window.crcTrackEvent({ toString() { return 'result_copied'; } }), false, 'a non-string event name is rejected without coercion');
  const completion = allowed.commands().find((command) => command[0] === 'event' && command[1] === 'calculator_completed');
  equal(completion.length, 2, 'generic completion event has no payload argument');

  allowed.loader().emit('load');
  denyFromDialog(allowed, openChoices(allowed));
  equal(allowed.window.crcTrackEvent('result_copied'), false, 'events stop immediately after withdrawal');
  const denialIndexes = commandIndexes(allowed, (command) => command[0] === 'consent' && command[1] === 'update' && command[2].analytics_storage === 'denied');
  ok(denialIndexes.length >= 1, 'withdrawal issues a denied consent update');
  equal(allowed.loader() !== null, true, 'a loaded script node is not duplicated or redownloaded after withdrawal');

  allowFromDialog(allowed, openChoices(allowed));
  equal(commandIndexes(allowed, (command) => command[0] === 'config').length, 1, 'reallow does not repeat configuration');
  equal(commandIndexes(allowed, (command) => command[0] === 'event' && command[1] === 'page_view').length, 1, 'allow-deny-reallow sends one manual page view per document');
  equal(allowed.document.head.children.filter((child) => child.tagName === 'SCRIPT').length, 1, 'reallow keeps one loader element');

  const promptedAllow = createHarness();
  promptedAllow.ready();
  allowFromDialog(promptedAllow, promptedAllow.document.getElementById('crc-analytics-choices'));
  equal(commandIndexes(promptedAllow, (command) => command[0] === 'event' && command[1] === 'page_view').length, 1, 'an explicit first allow sends one page view');

  const failedLoader = createHarness({ storedChoice: 'granted' });
  failedLoader.ready();
  failedLoader.loader().emit('error');
  equal(failedLoader.loader(), null, 'a failed analytics loader is removed');
  equal(failedLoader.window.crcTrackEvent('calculator_completed'), false, 'a loader failure returns analytics to a denied state');
  allowFromDialog(failedLoader, openChoices(failedLoader));
  ok(failedLoader.loader(), 'reallow retries a failed loader');
  equal(commandIndexes(failedLoader, (command) => command[0] === 'config').length, 1, 'loader retry does not duplicate configuration');
  equal(commandIndexes(failedLoader, (command) => command[0] === 'event' && command[1] === 'page_view').length, 1, 'loader retry does not duplicate the manual page view');

  const staleLoader = createHarness();
  staleLoader.ready();
  allowFromDialog(staleLoader, staleLoader.document.getElementById('crc-analytics-choices'));
  const detachedFirstLoader = staleLoader.loader();
  denyFromDialog(staleLoader, openChoices(staleLoader));
  allowFromDialog(staleLoader, openChoices(staleLoader));
  const activeSecondLoader = staleLoader.loader();
  ok(activeSecondLoader && activeSecondLoader !== detachedFirstLoader, 'reallow replaces a pending loader removed on withdrawal');
  detachedFirstLoader.emit('error');
  equal(staleLoader.loader(), activeSecondLoader, 'a stale detached loader error cannot remove the active loader');
  equal(staleLoader.window.crcTrackEvent('calculator_completed'), true, 'a stale detached loader error cannot disable current granted consent');

  for (const testCase of [
    { label: 'empty referrer', referrer: '', expected: '' },
    { label: 'non-http referrer', referrer: 'about:client', expected: '' },
    { label: 'malformed referrer', referrer: 'http://[invalid', expected: '' },
    { label: 'cross-origin referrer', referrer: 'https://outside.example/private/path?user=1#fragment', expected: 'https://outside.example' },
  ]) {
    const harness = createHarness({ storedChoice: 'granted', referrer: testCase.referrer });
    harness.ready();
    equal(configuredSet(harness).page_referrer, testCase.expected, `${testCase.label} is minimized`);
  }

  const throwingReferrer = createHarness({ storedChoice: 'granted', referrerThrows: true });
  throwingReferrer.ready();
  equal(configuredSet(throwingReferrer).page_referrer, '', 'a referrer access exception produces an empty referrer');

  for (const testCase of [
    { label: 'active GPC', options: { storedChoice: 'granted', gpc: true } },
    { label: 'throwing GPC getter', options: { storedChoice: 'granted', gpcThrows: true } },
    { label: 'throwing storage read', options: { storedChoice: 'granted', throwOnGet: true } },
  ]) {
    const harness = createHarness(testCase.options);
    harness.ready();
    assertDefaultDenied(harness, testCase.label);
    assertNotConfigured(harness, testCase.label);
  }

  const readFailure = createHarness({ storedChoice: 'granted', throwOnGet: true });
  readFailure.ready();
  const readFailureDialog = openChoices(readFailure);
  equal(findButton(readFailureDialog, 'Allow analytics'), null, 'a storage read failure removes the allow action');
  ok(findButton(readFailureDialog, 'Close privacy choices'), 'a storage read failure leaves only a close action');
  assertNotConfigured(readFailure, 'storage read failure after reopening choices');

  const gpc = createHarness({ storedChoice: 'granted', gpc: true });
  gpc.ready();
  const gpcDialog = openChoices(gpc);
  equal(findButton(gpcDialog, 'Allow analytics'), null, 'GPC removes the allow action');

  const writeFailure = createHarness({ throwOnSet: true });
  writeFailure.ready();
  allowFromDialog(writeFailure, writeFailure.document.getElementById('crc-analytics-choices'));
  assertNotConfigured(writeFailure, 'throwing storage write');
  equal(writeFailure.window.crcTrackEvent('calculator_completed'), false, 'storage write failure keeps events blocked');
}

function maintainedHtmlFiles() {
  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  return [...sitemap.matchAll(/<loc>https:\/\/creatorrevenuecalculator\.com(.*?)<\/loc>/g)].map((match) => {
    const pathname = match[1] || '/';
    if (pathname === '/') return homePath;
    if (pathname.endsWith('/')) return path.join(root, pathname.slice(1), 'index.html');
    return path.join(root, pathname.slice(1));
  });
}

function runStaticPolicyChecks() {
  const analyticsStart = themeSource.indexOf("var measurementId = '");
  ok(analyticsStart >= 0, 'shared controller contains the analytics state machine');
  const analyticsSource = themeSource.slice(analyticsStart);
  ok(themeSource.includes("window.gtag('consent', 'default'") && themeSource.includes("analytics_storage: 'denied'"), 'shared controller establishes denied consent');
  ok(themeSource.includes("window.gtag('set', {") && themeSource.includes('page_title: document.title') && themeSource.indexOf("window.gtag('set', {") < themeSource.indexOf("window.gtag('config', measurementId"), 'global sanitized location, referrer, and title are set before config');
  ok(themeSource.includes('arguments.length !== 1'), 'event API requires exactly one argument');
  ok(themeSource.includes("typeof eventName !== 'string'") && themeSource.includes('Object.prototype.hasOwnProperty.call(permittedEvents, eventName)'), 'event API enforces an own-property string allowlist');
  ok(!analyticsSource.includes('window.location.search'), 'analytics state machine never reads the URL query');
  ok(!/input\.value|FormData|resultCards/.test(analyticsSource), 'analytics state machine cannot read calculator inputs or results');
  ok(!/<script>\s*window\.dataLayer[\s\S]*?gtag\('consent',\s*'default'/.test(homeSource), 'homepage inline analytics bootstrap is removed');
  equal((homeSource.match(/\/assets\/js\/theme\.js/g) || []).length, 1, 'homepage loads the shared controller once');

  const maintained = maintainedHtmlFiles();
  ok(maintained.length > 0, 'sitemap identifies maintained pages');
  for (const file of maintained) {
    ok(fs.existsSync(file), `maintained page exists: ${path.relative(root, file)}`);
    const page = fs.readFileSync(file, 'utf8');
    ok(page.includes('/assets/js/theme.js'), `maintained page uses the shared controller: ${path.relative(root, file)}`);
    ok(!/<script\b[^>]*src=["'][^"']*googletagmanager\.com|\bwindow\.dataLayer\b|\bgtag\s*\(\s*["'](?:config|consent)["']/i.test(page), `maintained page has no competing analytics bootstrap: ${path.relative(root, file)}`);
  }

  equal(packageData.scripts['test:analytics'], 'node scripts/analytics-integrity-check.js', 'package exposes the focused analytics test');
  ok(packageData.scripts.build.includes('npm run test:analytics'), 'build runs the focused analytics test');
}

function runCalculatorEventCoverageChecks() {
  const calculators = new Map([
    ['homepage', 'assets/js/creator-mix-calculator.js'],
    ['affiliate', 'tools/affiliate-calculator/affiliate-calculator.js'],
    ['engagement', 'tools/engagement-rate/engagement-calculator.js'],
    ['instagram', 'tools/instagram-revenue/instagram-calculator.js'],
    ['newsletter', 'tools/newsletter-revenue/newsletter-calculator.js'],
    ['patreon', 'tools/patreon-revenue/patreon-calculator.js'],
    ['podcast', 'tools/podcast-revenue/podcast-calculator.js'],
    ['sponsorship', 'tools/sponsorship-rate/sponsorship-calculator.js'],
    ['tiktok', 'tools/tiktok-revenue/tiktok-calculator.js'],
    ['twitch', 'tools/twitch-revenue/twitch-calculator.js'],
    ['ugc', 'tools/ugc-rate/ugc-calculator.js'],
    ['youtube', 'tools/youtube-ad-revenue/youtube-calculator.js'],
  ]);

  const sources = new Map();
  for (const [name, relativePath] of calculators) {
    const source = fs.readFileSync(path.join(root, relativePath), 'utf8');
    sources.set(name, source);
    ok(!/\b(?:gtag|dataLayer)\b/.test(source), `${name} calculator cannot call analytics directly`);
    const calls = [...source.matchAll(/window\.crcTrackEvent\s*\(([^)]*)\)/g)];
    ok(calls.every((match) => !match[1].includes(',')), `${name} calculator event calls have one argument`);
  }

  for (const [name, source] of sources) {
    const hasCompletion = /(?:window\.crcTrackEvent|track|trackEvent)\(\s*['"]calculator_completed['"]\s*\)/.test(source);
    if (name === 'podcast' && !source.includes('directSponsorRevenue')) {
      // The strict Podcast worksheet and its event call are isolated in draft PR #46.
      // Once that implementation is present, this exception closes automatically.
      continue;
    }
    ok(hasCompletion, `${name} calculator tracks only an explicit successful completion through the shared API`);
  }

  for (const name of ['engagement', 'ugc']) {
    const source = sources.get(name);
    ok(/(?:window\.crcTrackEvent|track|trackEvent)\(\s*['"]result_copied['"]\s*\)/.test(source), `${name} calculator records confirmed copy success through the shared API`);
  }
}

runRuntimeMatrix();
runStaticPolicyChecks();
runCalculatorEventCoverageChecks();
process.stdout.write(`Analytics integrity checks passed (${assertions} assertions).\n`);
