// 用 Node 运行：node verify.cjs。仅检查游戏状态规则，不需要浏览器。
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync(__dirname + '/game.js', 'utf8').replace(/\/\* 启动 \*\/\s*init\(\);\s*$/, '');
const element = () => ({ textContent: '', innerHTML: '', classList: { add() {}, remove() {} } });
const metaCache = new Map();
const context = vm.createContext({
  document: { getElementById: element, querySelectorAll: () => [], querySelector: () => null },
  window: { scrollTo() {} },
  localStorage: {
    getItem: key => metaCache.get(key) || null,
    setItem: (key, value) => metaCache.set(key, value),
    removeItem: key => metaCache.delete(key),
  },
  setTimeout() {},
  console,
});
vm.runInContext(source + '\nglobalThis.testState = state; globalThis.testStages = STAGES; globalThis.testActivities = ACTIVITIES; globalThis.testItems = SHOP_ITEMS; globalThis.testMeta = meta; globalThis.testAchievements = ACHIEVEMENTS; globalThis.testHeirlooms = HEIRLOOMS; globalThis.testApplyEffects = applyEffects; globalThis.testDoYearlySettlement = doYearlySettlement;', context);
vm.runInContext(`
  drawCharacter = () => {};
  updateTopbar = updateStats = renderAssets = renderFamily = renderJob = buildStatsUI = () => {};
  showMoneyFloat = applyEffects = showScreen = () => {};
  doYearlySettlement = () => ({ incomeDiff: 0, familyCost: 0, allowance: 0, scrapped: 0, assetBonus: '', hint: '' });
  presentMonth = () => {};
  startGaokaoExam = () => { globalThis.examCount = (globalThis.examCount || 0) + 1; };
  showUniversityAdmission = () => { globalThis.admissionCount = (globalThis.admissionCount || 0) + 1; };
  showEduGate = () => {};
  showJobPicker = () => {};
`, context);

const s = context.testState;
s.age = 18;
context.evaluateAchievements(false);
assert.ok(context.testMeta.unlocked.includes('adult'));
assert.equal(context.testMeta.reputation, 20);
context.evaluateAchievements(false);
assert.equal(context.testMeta.reputation, 20, '同一成就不可重复领取声望');
s.age = 0;
s.bg = context.testState.bg;
assert.equal(context.computeAllowance(), 0, '6岁前不应发放零花钱');
s.age = 6; s.bg = { id: 'normal' };
assert.equal(context.computeAllowance(), 300, '普通家庭小学生零花钱应保持低额');
s.age = 16; s.bg = { id: 'rich' };
assert.ok(context.computeAllowance() <= 18000, '富裕家庭高中零花钱也应有限额');
s.allowance = context.computeAllowance(); s.money = 0; s.lastEconomyCreditAge = null;
context.creditYearlyEconomy();
const creditedOnce = s.money;
context.creditYearlyEconomy();
assert.equal(s.money, creditedOnce, '同一年龄重复渲染不能重复发放零花钱');
s.age = 0;
s.stats.health = 80;
s.stageIdx = 4; // 高中
s.age = 18;
context.onContinue();
assert.equal(s.age, 19);
assert.equal(context.testStages[s.stageIdx].id, 'college');
assert.equal(context.examCount, 1);
context.afterGaokao();
assert.equal(context.testStages[s.stageIdx].id, 'college');
assert.equal(context.admissionCount, 1);

s.stageIdx = 5; s.age = 22; s.education.university = { name: '测试大学', tier: 4 };
context.onContinue();
assert.equal(s.age, 23);
assert.equal(context.testStages[s.stageIdx].id, 'master');
s.age = 25; s.education.master = '在读';
context.onContinue();
assert.equal(s.age, 26);
assert.equal(context.testStages[s.stageIdx].id, 'phd');
s.age = 29; s.education.phd = '在读'; s.careerPlan = 'generic';
context.onContinue();
assert.equal(s.age, 30);
assert.equal(context.testStages[s.stageIdx].id, 'youth');
assert.equal(s.job.type, 'generic');

s.age = 50; s.stageIdx = 9; s.job.type = 'generic';
context.enterStage();
assert.equal(s.age, 50, '进入阶段不能让继承人年龄倒退');

s.requiredModal = true;
context.onContinue();
assert.equal(s.age, 50, '必选弹窗阻止推进');
s.requiredModal = false;

s.gender = 'male'; s.age = 45; s.money = 200000; s.children = [];
s.spouse = { age: 24, marriedAtAge: 40, income: 0 };
s.lastBirthAge = null;
assert.equal(context.canHaveChild(), true);
assert.equal(context.tryGiveBirth(), true);
assert.equal(context.canHaveChild(), false, '同一年不能再次生育');
s.age = 46;
assert.equal(context.canHaveChild(), true);

s.money = 10000; s.assets = ['house_small']; s.assetMeta = { house_small: { yearsLeft: 10 } };
const before = context.getFamilyNetWorth();
context.divideFamilyAssets(0.5);
assert.equal(before - context.getFamilyNetWorth(), Math.round(before * 0.5));
assert.equal(s.assets.length, 0);

for (const id of ['act_stock', 'act_gamble']) {
  const activity = context.testActivities.find(x => x.id === id);
  const expected = id === 'act_stock' ? [-20000, -5000, 10000, 60000] : [-10000, 5000, 80000, 500000];
  assert.deepEqual(Array.from(activity.outcomes, x => x.money - activity.price), expected);
}

s.age = 46; s.money = 100000; s.lastActivityAge = null;
const lottery = context.testActivities.find(x => x.id === 'act_lottery');
assert.equal(context.doActivity(lottery) !== null, true);
const moneyAfterActivity = s.money;
assert.equal(context.doActivity(lottery), null, '同一年只可参加一次活动');
assert.equal(s.money, moneyAfterActivity);
for (const activity of context.testActivities) {
  const totalWeight = activity.outcomes.reduce((sum, x) => sum + x.weight, 0);
  assert.ok(Math.abs(totalWeight - 100) < 0.001, `${activity.id} 概率权重应合计 100`);
}
s.assets = ['biz_stock']; s.assetReturns = {};
const firstReturn = context.getYearlyIncome().assetMoney;
assert.equal(context.getYearlyIncome().assetMoney, firstReturn, '同年的股票收益应固定');

// 家族长期玩法：挑战、同学聚会、传家宝都必须有真实结算。
s.age = 20; s.generation = 1; s.challenge = null; s.challengeCooldownUntil = 18;
const repBeforeChallenge = context.testMeta.reputation;
assert.equal(context.startFamilyChallenge(), true);
const challenge = s.challenge;
if (challenge.type === 'wealth') s.money = challenge.target;
if (challenge.type === 'health') s.stats.health = challenge.target;
if (challenge.type === 'charm') s.stats.charm = challenge.target;
if (challenge.type === 'career') s.job.level = challenge.target;
assert.equal(context.evaluateFamilyChallenge(), 'completed');
assert.equal(context.testMeta.reputation, repBeforeChallenge + challenge.reward);
assert.equal(s.challenge, null, '完成挑战后应关闭本次挑战');

s.age = 25; s.money = 100000; s.reunionsAttended = [];
const reunion = context.attendReunion('quiet');
assert.ok(reunion && reunion.reward > 0, '节点年龄应可参加同学聚会并获得声望');
assert.equal(context.attendReunion('quiet'), null, '同一节点聚会不能重复参加');

context.testMeta.reputation = 1000;
context.testMeta.heirlooms = [];
context.testMeta.records = { maxGeneration: 2, maxNetWorth: 0 };
s.generation = 1;
assert.equal(context.buyHeirloom('album'), true, '封面应按家族历史代数解锁传家宝');
assert.ok(context.testMeta.heirlooms.includes('album'));
assert.equal(context.buyHeirloom('album'), false, '传家宝不能重复购买');

s.name = '存档测试'; s.age = 33; s.finalAge = 0;
context.saveRun('game');
assert.equal(context.readRunSave().state.age, 33, '当前人生应可保存并继续');
context.clearRunSave();
assert.equal(context.readRunSave(), null, '结束家族后应清除当前存档');

s.stats.health = 80;
context.testApplyEffects({ health: 10 });
assert.equal(s.stats.health, 84, '高属性区间的正向成长应递减');
s.routeProgress = {}; s.traits = []; s.log = [];
for (let i = 0; i < 3; i++) context.recordChoiceRoute({ text: '坚持健身', desc: '运动锻炼' });
assert.ok(s.traits.includes('athlete'), '连续同类选择应形成长期路线特质');

context.testMeta.heirlooms = ['album', 'manual', 'deed'];
context.testMeta.equipped = ['album', 'manual'];
assert.equal(context.toggleHeirloom('deed'), false, '传家宝装备数量不能超过两件');
context.testMeta.equipped = ['deed'];
s.age = 40; s.money = 100000; s.assets = ['house_small']; s.assetMeta = { house_small: { yearsLeft: 10 } };
s.spouse = null; s.children = []; s.exSpouse = null; s.challenge = null; s.traits = [];
const settlement = context.testDoYearlySettlement();
assert.equal(settlement.maintCost, 2700, '装备老宅地契后房产维护费应降低10%');

// 子女培养：每个阶段只能选择一次，成年后形成稳定的教育、职业和性格画像。
s.age = 10; s.money = 50000; s.log = [];
s.children = [{ id: 'student', name: '小禾', gender: 'female', bornAge: 2, initialStats: { intellect: 60, charm: 55, health: 55 }, educationChoices: {} }];
assert.equal(context.educateChild('student', '学业'), true);
assert.equal(s.money, 42000, '学科辅导应扣除8000');
assert.equal(s.children[0].initialStats.intellect, 69);
assert.equal(context.educateChild('student', '艺术'), false, '同一成长阶段不可重复培养');
s.age = 20;
const adultProfile = context.createAdultChildProfile(s.children[0]);
assert.ok(adultProfile.education && adultProfile.career && adultProfile.personality);
const logBeforeGrowth = s.log.length;
context.updateChildrenGrowth();
context.updateChildrenGrowth();
assert.equal(s.log.length, logBeforeGrowth, '已有成年画像后不应重复记录毕业事件');

// 主动家主交接：保留共同现金，并把父母和未当选子女转为扩展家庭。
s.name = '上一任家主'; s.gender = 'male'; s.age = 55; s.finalAge = 0; s.generation = 1;
s.money = 200000; s.assets = []; s.assetMeta = {}; s.lineage = []; s.relatives = []; s.traits = ['scholar'];
s.spouse = { name: '配偶', age: 50, marriedAtAge: 30, costPerYear: 10000, income: 0 };
s.children = [
  { id: 'heir', name: '继承人', gender: 'female', bornAge: 30, initialStats: { intellect: 70, charm: 60 } },
  { id: 'branch', name: '支系成员', gender: 'male', bornAge: 32, initialStats: { intellect: 55, charm: 55 } },
];
assert.equal(context.handoffToChild(s.children[0]), true);
assert.equal(s.generation, 2);
assert.equal(s.name, '继承人');
assert.equal(s.money, 200000, '主动交接应保留全部共同现金');
assert.ok(s.relatives.some(person => person.name === '上一任家主' && person.kind === 'elder'));
assert.ok(s.relatives.some(person => person.name === '支系成员' && person.kind === 'branch'));
const branchRelative = s.relatives.find(person => person.name === '支系成员');
assert.ok(branchRelative.career && Number.isFinite(branchRelative.income), '成年旁支应保留职业与收入画像');
assert.equal(s.lineage[0].status, 'retired');

s.relatives = [{ kind: 'elder', name: '退休长辈', relation: '父亲', age: 60, annualCost: 12000, alive: true }];
s.lastFamilyEventAge = null; s.age = 26;
const familySettlement = context.settleExtendedFamily();
assert.equal(familySettlement.cost, 12000);
assert.equal(s.relatives[0].age, 61, '扩展家庭成员年龄应随年份推进');

console.log('关键人生路线、婚育、财产、活动与家族长期玩法校验通过');
