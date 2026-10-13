const assert = require('node:assert/strict');
const { LifeEngine, content, SAVE_KEY } = require('../douyin/engine');
const { CanvasGame } = require('../douyin/ui');

const cache = new Map();
const storage = {
  get(key) { return cache.get(key); },
  set(key, value) { cache.set(key, JSON.parse(JSON.stringify(value))); },
};
const engine = new LifeEngine(storage);
engine.newGame({ name: '小禾', bgId: 'normal' });
assert.equal(engine.state.age, 0);
assert.equal(engine.state.choices.length, 3);
assert.equal(cache.get(SAVE_KEY).prepared, true);

function advanceTo(age) {
  while (engine.state.age < age && engine.state.phase === 'play') {
    engine.state.stats.health = 100;
    engine.rest();
  }
}
advanceTo(3);
assert.equal(engine.state.phase, 'kindergarten');
engine.chooseKindergarten(false);
advanceTo(19);
assert.equal(engine.state.phase, 'admission');
engine.chooseUniversity(0);
assert.equal(engine.state.phase, 'careerPlan');
engine.chooseCareer('generic');
assert.equal(engine.state.phase, 'play');
advanceTo(23);
assert.equal(engine.state.phase, 'education');
engine.state.stats.intellect = 90;
assert.equal(engine.chooseEducation(true), true);
advanceTo(26);
assert.equal(engine.state.phase, 'education');
engine.state.stats.intellect = 90;
assert.equal(engine.chooseEducation(true), true);
advanceTo(30);
assert.equal(engine.state.age, 30);
assert.equal(engine.stage().id, 'youth');
assert.equal(engine.state.job.type, 'generic');

const reopened = new LifeEngine(storage);
assert.equal(reopened.resume(), true);
assert.equal(reopened.state.age, 30);
assert.equal(reopened.state.choices.length, 3);
reopened.state.money = 1000000;
reopened.state.stats.charm = 80;
reopened.state.affection.f1 = 90;
assert.equal(reopened.marry('f1'), true);
assert.equal(reopened.birth(), true);
assert.equal(reopened.birth(), false, '同年只能生育一次');
const firstChild = reopened.state.children[0];
assert.equal(reopened.buy('house_small'), true);
assert.equal(reopened.buy('house_small'), false, '资产不可重复购买');
reopened.state.age = 60;
reopened.endLife(true);
assert.equal(reopened.state.phase, 'inherit');
reopened.inherit(0);
assert.equal(reopened.state.name, firstChild.name);
assert.equal(reopened.state.age, 30);
assert.equal(reopened.stage().id, 'youth');
assert.equal(reopened.state.phase, 'career');

const admission = new LifeEngine(storage);
admission.state.phase = 'admission';
admission.state.education.score = 750;
assert.equal(admission.chooseUniversity(0, 2), true);
assert.equal(admission.state.education.university.major, content.UNIVERSITIES[0].majors[2]);

const exhausted = new LifeEngine(storage);
exhausted.newGame();
exhausted.state.stats.health = 1;
const originalRandom = Math.random;
Math.random = () => 0.99;
try { exhausted.rest(); } finally { Math.random = originalRandom; }
assert.equal(exhausted.state.phase, 'play', '低健康时休息应能避免立即结束人生');
assert.equal(exhausted.state.stats.health, 9, '休息应恢复8点健康，青年以前没有固定衰减');

for (const [age, expectedDecay] of [[20, 0], [30, 1], [50, 2], [65, 3], [80, 3]]) {
  const aging = new LifeEngine(storage);
  aging.newGame();
  aging.state.age = age;
  aging.state.stats.health = 50;
  aging.settleYear();
  assert.equal(aging.state.stats.health, 50 - expectedDecay, `${age}岁年度健康衰减不符合设计`);
}

const vulnerable = new LifeEngine(storage);
vulnerable.newGame();
vulnerable.state.stats.health = 20;
vulnerable.state.prepared = false;
vulnerable.prepareYear();
assert.ok(vulnerable.state.choices.some(choice => choice.eff && choice.eff.health > 0),
  '低于30健康时必须至少出现一个恢复选项');

const ctx = {
  setTransform() {}, fillRect() {}, strokeRect() {}, beginPath() {}, rect() {}, clip() {},
  save() {}, restore() {}, fillText() {}, measureText(text) { return { width: String(text).length * 15 }; },
};
global.tt = {
  getSystemInfoSync() { return { windowWidth: 375, windowHeight: 700, pixelRatio: 2, safeArea: { top: 24 } }; },
  onTouchStart() {}, onTouchEnd() {}, onShow() {},
};
const canvas = { getContext() { return ctx; } };
const ui = new CanvasGame(canvas, reopened, content, { enabled: () => false });
for (const phase of ['title', 'create', 'play', 'kindergarten', 'admission', 'careerPlan',
  'career', 'education', 'inherit', 'summary']) {
  reopened.state.phase = phase;
  ui.draw();
}
reopened.state.phase = 'play';
for (const view of ['main', 'shop', 'activity', 'family']) { ui.view = view; ui.draw(); }
const touchEngine = new LifeEngine(storage);
touchEngine.state.phase = 'title';
let onStart, onEnd;
global.tt.onTouchStart = fn => { onStart = fn; };
global.tt.onTouchEnd = fn => { onEnd = fn; };
const touchUi = new CanvasGame(canvas, touchEngine, content, { enabled: () => false });
touchUi.start();
function tap(x, y) {
  onStart({ touches: [{ clientX: x, clientY: y }] });
  onEnd({ changedTouches: [{ clientX: x, clientY: y }] });
}
tap(80, touchUi.safeTop + 45 + 245 + 20);
assert.equal(touchEngine.state.phase, 'create');
tap(80, 700 - 63 + 20);
assert.equal(touchEngine.state.phase, 'play');
console.log('抖音版：完整成长、存档恢复、婚育继承、画布页面校验通过');
