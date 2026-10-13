// 与 DOM、Canvas、抖音 API 无关的游戏规则。所有状态均可 JSON 序列化。
const content = require('./content.js');
const SAVE_VERSION = 1;
const SAVE_KEY = 'reborn_douyin_save_v1';
const STAT_KEYS = ['health', 'intellect', 'charm', 'wealth', 'happiness'];
const RECOVERY_CHOICE = {
  text: '安心调养身体',
  desc: '你放慢生活节奏，认真休养了一年，身体逐渐恢复。',
  eff: { health: 12, happiness: 3 },
};
const clamp = n => Math.max(0, Math.min(100, Math.round(n)));
const random = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = items => items[Math.floor(Math.random() * items.length)];
function pickN(items, count) {
  const pool = items.slice();
  const out = [];
  while (pool.length && out.length < count) out.push(pool.splice(random(0, pool.length - 1), 1)[0]);
  return out;
}
function moneyStat(m) {
  if (m <= 0) return 5;
  if (m <= 10000) return 10 + Math.floor(m / 1000);
  if (m <= 100000) return 20 + Math.floor((m - 10000) / 10000);
  if (m <= 1000000) return 30 + Math.floor((m - 100000) / 100000);
  if (m <= 10000000) return 45 + Math.floor((m - 1000000) / 1000000);
  return Math.min(100, 65 + Math.floor((m - 10000000) / 5000000));
}
function eligible(list, age) {
  return list.filter(e => (e.minAge === undefined || age >= e.minAge) &&
    (e.maxAge === undefined || age <= e.maxAge));
}
function assetValue(item) { return Math.round(item.price * 0.9); }
function freshState() {
  return {
    version: SAVE_VERSION, phase: 'title', name: '小禾', gender: 'male', bgId: 'normal',
    generation: 1, age: 0, stageIdx: 0, round: 0,
    stats: { health: 50, intellect: 50, charm: 50, wealth: 50, happiness: 50 },
    money: 0, job: null, careerPlan: null, education: { kindergarten: null, score: 0, university: null, master: false, phd: false },
    assets: [], assetMeta: {}, assetReturns: {}, spouse: null, children: [], affection: {},
    lastBirthAge: null, lastActivityAge: null, lastCourtAge: null, lastRerollAge: null,
    prepared: false, choices: [], notice: '', log: [], finalAge: null,
  };
}

class LifeEngine {
  constructor(storage) {
    this.storage = storage;
    this.state = freshState();
    this.hasSave = false;
    try {
      const saved = storage.get(SAVE_KEY);
      if (saved && saved.version === SAVE_VERSION && saved.phase !== 'title') {
        this.savedState = saved;
        this.hasSave = true;
      }
    } catch (error) { this.saveError = String(error); }
  }
  save() {
    try {
      this.storage.set(SAVE_KEY, this.state);
      this.savedState = JSON.parse(JSON.stringify(this.state));
      this.hasSave = true;
    }
    catch (error) { this.saveError = String(error); }
  }
  resume() {
    if (!this.savedState) return false;
    this.state = JSON.parse(JSON.stringify(this.savedState));
    if (this.state.phase === 'play' && !this.state.prepared) this.prepareYear();
    return true;
  }
  newGame({ name = '小禾', gender = 'male', bgId = 'normal' } = {}) {
    const s = this.state = freshState();
    const bg = content.BACKGROUNDS.find(b => b.id === bgId) || content.BACKGROUNDS[3];
    s.name = String(name).trim().slice(0, 6) || '小禾';
    s.gender = gender === 'female' ? 'female' : 'male';
    s.bgId = bg.id;
    s.money = bg.money || 0;
    this.effects(bg.eff);
    s.phase = 'play';
    s.notice = `你出生在${bg.name}。${content.STAGES[0].intro}`;
    this.prepareYear();
  }
  stage() { return content.STAGES[this.state.stageIdx]; }
  wealth() {
    return this.state.money + this.state.assets.reduce((sum, id) => {
      const item = content.SHOP_ITEMS.find(x => x.id === id);
      return sum + (item ? assetValue(item) : 0);
    }, 0);
  }
  effects(eff = {}) {
    for (const key of STAT_KEYS) if (eff[key]) this.state.stats[key] = clamp(this.state.stats[key] + eff[key]);
    this.state.stats.wealth = clamp(moneyStat(this.state.money));
  }
  log(text) {
    this.state.log.push({ age: this.state.age, text });
    if (this.state.log.length > 150) this.state.log.shift();
  }
  annualAllowance() {
    const s = this.state;
    if (s.age >= 18) return 0;
    const base = { rich: 24000, scholar: 6000, sport: 7000, normal: 2400, orphan: 200 }[s.bgId] || 600;
    return Math.max(100, base + s.age * 100 + (this.wealth() >= 500000 ? 1000 : 0));
  }
  career() { return content.CAREERS.find(x => x.id === (this.state.job && this.state.job.type)); }
  salary() {
    const s = this.state;
    if (!s.job) return 0;
    const c = this.career();
    if (!c) return 0;
    const bonus = (s.stats.intellect * 80 + s.stats.charm * 40 + s.stats.health * 20) / 12;
    return Math.round((c.base * Math.pow(1 + c.grow, s.job.level - 1) + bonus) * 12);
  }
  annualAssets() {
    const s = this.state;
    return s.assets.reduce((sum, id) => {
      const item = content.SHOP_ITEMS.find(x => x.id === id);
      if (!item || !item.yearlyMoney) return sum;
      const key = `${s.generation}:${s.age}:${id}`;
      if (s.assetReturns[key] === undefined) {
        s.assetReturns[key] = item.volatile ? Math.round(item.yearlyMoney * (0.5 + Math.random())) : item.yearlyMoney;
      }
      return sum + s.assetReturns[key];
    }, 0);
  }
  prepareYear() {
    const s = this.state;
    if (s.phase !== 'play' || s.prepared) return;
    s.money += this.annualAllowance() + this.salary() + this.annualAssets() + (s.spouse ? s.spouse.income : 0);
    const events = eligible(content.EVENTS, s.age).filter(e => !e.name.includes('子女') || s.children.length);
    if (events.length && Math.random() < 0.25) {
      const event = pick(events);
      s.money += event.money || 0;
      this.effects(event.eff);
      s.notice = `【${event.name}】${event.desc} ${s.notice}`;
      this.log(`【${event.name}】${event.desc}`);
    }
    const daily = eligible(content.MONTHLY_CHOICES, s.age);
    s.choices = s.round % 3 === 0
      ? pickN(this.stage().pool, 2).concat(pickN(daily, 1))
      : pickN(daily, 3);
    if (s.stats.health < 30 && !s.choices.some(choice => choice.eff && choice.eff.health > 0)) {
      s.choices[s.choices.length - 1] = Object.assign({}, RECOVERY_CHOICE, { eff: Object.assign({}, RECOVERY_CHOICE.eff) });
    }
    s.stats.wealth = clamp(moneyStat(s.money));
    s.prepared = true;
    this.save();
  }
  choose(index) {
    const s = this.state;
    if (s.phase !== 'play' || !s.prepared) return false;
    const choice = s.choices[index];
    if (!choice) return false;
    if (choice.autoMarry && !s.spouse && !this.autoMarriageCandidate()) {
      s.notice = '先满足结婚条件并攒够婚礼费用吧。'; this.save(); return false;
    }
    if (choice.autoBaby && !this.canHaveChild()) {
      s.notice = '生育条件或费用暂未满足。'; this.save(); return false;
    }
    s.money += choice.money || 0;
    this.effects(choice.eff);
    if (choice.jobBoost && s.job) s.job.level = Math.min(10, s.job.level + choice.jobBoost);
    if (choice.autoMarry && !s.spouse) this.autoMarry();
    if (choice.autoBaby) this.birth();
    this.log(choice.desc);
    this.advance(choice.desc);
    return true;
  }
  rest() {
    if (this.state.phase !== 'play') return false;
    this.effects({ health: 8, happiness: 5 });
    this.log('你暂停追逐目标，认真休息和恢复。');
    this.advance('你给自己留了一年喘息的时间，健康与心情有所恢复。');
    return true;
  }
  rerollChoices() {
    const s = this.state;
    if (s.phase !== 'play' || !s.prepared || s.lastRerollAge === s.age) return false;
    const daily = eligible(content.MONTHLY_CHOICES, s.age);
    s.choices = s.round % 3 === 0
      ? pickN(this.stage().pool, 2).concat(pickN(daily, 1)) : pickN(daily, 3);
    s.lastRerollAge = s.age;
    s.notice = '这一年的机会重新出现了。';
    this.save(); return true;
  }
  settleYear() {
    const s = this.state;
    let cost = s.spouse ? s.spouse.costPerYear : 0;
    for (const child of s.children) if (s.age - child.bornAge < 18) cost += 12000 + (s.age - child.bornAge) * 2000;
    const kept = [];
    for (const id of s.assets) {
      const item = content.SHOP_ITEMS.find(x => x.id === id);
      if (!item) continue;
      cost += item.maint || 0;
      if (item.income) this.effects(item.income);
      if (item.lifespan) {
        const remaining = (s.assetMeta[id] === undefined ? item.lifespan : s.assetMeta[id]) - 1;
        if (remaining <= 0) { delete s.assetMeta[id]; this.log(`「${item.name}」已到使用年限。`); continue; }
        s.assetMeta[id] = remaining;
      }
      kept.push(id);
    }
    s.assets = kept;
    s.money -= cost;
    const decay = s.age >= 65 ? 3 : s.age >= 50 ? 2 : s.age >= 30 ? 1 : 0;
    for (const key of ['health', 'intellect', 'charm', 'happiness']) s.stats[key] = clamp(s.stats[key] - decay);
    if (s.money < -500000) { s.stats.health = clamp(s.stats.health - 5); s.stats.happiness = clamp(s.stats.happiness - 8); }
    s.stats.wealth = clamp(moneyStat(s.money));
    if (s.age >= 22 && s.job && s.job.level < 10) {
      const probability = Math.max(0.05, Math.min(0.7, 0.25 + (s.stats.intellect - 50) * 0.005 + (s.stats.charm - 50) * 0.003));
      if (Math.random() < probability) { s.job.level++; this.log('工作晋升了！'); }
    }
    return cost;
  }
  advance(previous) {
    const s = this.state;
    if (s.phase !== 'play') return;
    s.prepared = false; s.choices = [];
    if (s.stats.health <= 0) { this.endLife(false); return; }
    const cost = this.settleYear();
    s.age++; s.round++;
    s.notice = `${previous} 过去一年家庭支出 ${cost.toLocaleString()} 元。`;
    if (s.stats.health <= 0) { this.endLife(false); return; }
    const old = this.stage();
    if (s.age > old.ageEnd) {
      if (old.id === 'elder') {
        if (s.age > Math.min(100, 85 + Math.floor(s.stats.health / 10))) { this.endLife(true); return; }
      } else {
        s.stageIdx++;
        s.round = 0;
        s.notice += ` ${this.stage().intro}`;
        if (old.gaokao) {
          s.education.score = Math.min(750, clamp(s.stats.intellect) * 6 + random(0, 150));
          this.log(`高考得分 ${s.education.score}。`);
          s.phase = 'admission'; this.save(); return;
        }
        if (this.stage().eduGate) { s.phase = 'education'; this.save(); return; }
      }
    }
    if (this.stage().kgChoice && !s.education.kindergarten) { s.phase = 'kindergarten'; this.save(); return; }
    if (this.stage().id === 'youth' && !s.job) {
      if (s.careerPlan) this.startCareer(s.careerPlan);
      else { s.phase = 'career'; this.save(); return; }
    }
    this.prepareYear();
  }
  chooseKindergarten(international) {
    const s = this.state;
    if (s.phase !== 'kindergarten') return false;
    if (international && (this.wealth() < 30000 || s.money < 10000)) return false;
    s.education.kindergarten = international ? 'international' : 'normal';
    if (international) { s.money -= 10000; this.effects({ intellect: 6, charm: 4, happiness: 4 }); }
    else this.effects({ intellect: 3, happiness: 3 });
    s.phase = 'play'; this.prepareYear(); return true;
  }
  universities() { return content.UNIVERSITIES.filter(u => this.state.education.score >= u.minScore); }
  chooseUniversity(index, majorIndex = 0) {
    const s = this.state;
    if (s.phase !== 'admission') return false;
    const uni = this.universities()[index];
    if (!uni) return false;
    s.education.university = { name: uni.name, tier: uni.tier, major: uni.majors[majorIndex] || uni.majors[0] };
    this.effects(uni.eff);
    this.log(`考入${uni.name}，就读${s.education.university.major}。`);
    s.phase = 'careerPlan'; this.save(); return true;
  }
  careerAllowed(c) {
    const x = this.state.stats;
    const limits = { civil: x.intellect >= 55, it: x.intellect >= 60,
      finance: x.intellect >= 65 && x.charm >= 45, doctor: x.intellect >= 70,
      teacher: x.intellect >= 60, art: x.charm >= 60 };
    return limits[c.id] !== false;
  }
  careers() { return content.CAREERS.filter(c => this.careerAllowed(c)); }
  startCareer(id) {
    const s = this.state;
    const career = content.CAREERS.find(c => c.id === id);
    if (!career) return false;
    s.job = { type: id, level: 1 };
    this.log(`入职${career.name}。`);
    return true;
  }
  chooseCareer(id) {
    const s = this.state;
    const career = this.careers().find(c => c.id === id);
    if (!career || !['career', 'careerPlan'].includes(s.phase)) return false;
    if (s.phase === 'careerPlan') s.careerPlan = id;
    else this.startCareer(id);
    s.phase = 'play'; this.prepareYear(); return true;
  }
  postponeCareer() {
    if (this.state.phase !== 'careerPlan') return false;
    this.state.phase = 'play'; this.prepareYear(); return true;
  }
  chooseEducation(study) {
    const s = this.state;
    if (s.phase !== 'education') return false;
    const master = this.stage().id === 'master';
    const canStudy = s.stats.intellect >= (master ? 55 : 65) && (master || s.education.master);
    if (study && !canStudy) return false;
    if (study) s.education[master ? 'master' : 'phd'] = true;
    else {
      s.stageIdx = content.STAGES.findIndex(x => x.id === 'youth');
      s.round = 0;
      s.age = Math.max(23, s.age);
    }
    s.phase = 'play';
    if (this.stage().id === 'youth' && !s.job) {
      if (s.careerPlan) this.startCareer(s.careerPlan);
      else { s.phase = 'career'; this.save(); return true; }
    }
    this.prepareYear(); return true;
  }
  buy(id) {
    const s = this.state;
    const item = content.SHOP_ITEMS.find(x => x.id === id);
    if (!item || s.phase !== 'play' || s.age < 18 || s.money < item.price ||
      (item.asset && s.assets.includes(id)) || (item.require && !s.assets.includes(item.require))) return false;
    s.money -= item.price;
    if (item.asset) { s.assets.push(id); if (item.lifespan) s.assetMeta[id] = item.lifespan; }
    this.effects(item.eff);
    if (item.jobBoost && s.job) s.job.level = Math.min(10, s.job.level + item.jobBoost);
    this.log(`购买「${item.name}」，花费 ${item.price} 元。`);
    this.save(); return true;
  }
  activity(id) {
    const s = this.state;
    const item = content.ACTIVITIES.find(x => x.id === id);
    if (!item || s.phase !== 'play' || s.age < 18 || s.money < item.price || s.lastActivityAge === s.age) return false;
    let roll = Math.random() * item.outcomes.reduce((n, x) => n + x.weight, 0);
    const result = item.outcomes.find(x => (roll -= x.weight) <= 0) || item.outcomes[item.outcomes.length - 1];
    s.lastActivityAge = s.age;
    s.money += (result.money || 0) - item.price;
    this.effects(result.eff);
    s.notice = `【${item.name}】${result.text}`;
    this.log(s.notice); this.save(); return true;
  }
  candidates() { return this.state.gender === 'male' ? content.DATE_POOL_FEMALE : content.DATE_POOL_MALE; }
  candidateRequirements(p) {
    const s = this.state, r = p.reqs || {};
    return (!r.reqCharm || s.stats.charm >= r.reqCharm) &&
      (!r.reqIntellect || s.stats.intellect >= r.reqIntellect) &&
      (!r.reqHouse || s.assets.some(id => id.startsWith('house_'))) &&
      (!r.reqCar || s.assets.some(id => id.startsWith('car_'))) &&
      (!r.reqJob || s.job) && (!r.reqWealth || this.wealth() >= r.reqWealth);
  }
  weddingCost(p, auto = false) {
    const price = ((p.reqs && p.reqs.betrothal) || 100000) * (auto ? 0.5 : 1);
    return Math.round(price + price * (auto ? 0.5 : ((p.reqs && p.reqs.weddingRatio) || 1)));
  }
  court(id) {
    const s = this.state, p = this.candidates().find(x => x.id === id);
    if (!p || s.phase !== 'play' || s.age < 20 || s.spouse || s.money < 1000 || s.lastCourtAge === s.age) return false;
    s.money -= 1000; s.lastCourtAge = s.age;
    s.affection[id] = Math.min(100, (s.affection[id] || 0) + 12 + Math.max(0, Math.floor((s.stats.charm - 40) / 10)));
    this.effects({ happiness: 2 });
    s.notice = `与${p.name}相处得更熟悉了，好感 ${s.affection[id]}/100。`;
    this.save(); return true;
  }
  marry(id, auto = false) {
    const s = this.state, p = this.candidates().find(x => x.id === id);
    if (!p || s.phase !== 'play' || s.age < 20 || s.spouse || !this.candidateRequirements(p) ||
      (!auto && (s.affection[id] || 0) < ((p.reqs && p.reqs.minAffection) || 80)) || s.money < this.weddingCost(p, auto)) return false;
    const price = this.weddingCost(p, auto);
    s.money -= price;
    s.spouse = { id: p.id, name: p.name, age: p.age, marriedAtAge: s.age,
      income: p.income * 12, costPerYear: p.costPerYear, trait: p.trait };
    this.effects({ happiness: 18, charm: 5 });
    s.notice = `你和${p.name}结婚了，花费 ${price.toLocaleString()} 元。`;
    this.log(s.notice); this.save(); return true;
  }
  autoMarriageCandidate() {
    return this.candidates().find(p => this.candidateRequirements(p) && this.state.money >= this.weddingCost(p, true));
  }
  autoMarry() { const p = this.autoMarriageCandidate(); return p ? this.marry(p.id, true) : false; }
  birthCost() { return 40000 + this.state.children.length * 20000; }
  canHaveChild() {
    const s = this.state;
    if (!s.spouse || s.lastBirthAge === s.age || s.children.length >= 6 || s.money < this.birthCost()) return false;
    const partnerAge = s.spouse.age + s.age - s.spouse.marriedAtAge;
    return (s.gender === 'female' ? s.age : partnerAge) < 48 &&
      (s.gender === 'male' ? s.age : partnerAge) < 70;
  }
  birth() {
    const s = this.state;
    if (!this.canHaveChild()) return false;
    s.money -= this.birthCost(); s.lastBirthAge = s.age;
    const gender = Math.random() < 0.5 ? 'male' : 'female';
    const name = s.name.slice(0, 1) + pick(['明', '华', '丽', '杰', '晨', '雪', '博', '妍']);
    s.children.push({ id: `child_${s.generation}_${s.age}_${s.children.length}`, name, gender,
      bornAge: s.age, stats: { intellect: clamp(s.stats.intellect + random(-15, 5)), charm: clamp(s.stats.charm + random(-15, 5)) } });
    this.effects({ happiness: 8, health: -3 });
    s.notice = `${name}出生了。`;
    this.log(s.notice); this.save(); return true;
  }
  endLife(natural) {
    const s = this.state;
    s.finalAge = s.age;
    s.phase = s.children.length ? 'inherit' : 'summary';
    s.notice = natural ? `享年 ${s.age} 岁。` : `在 ${s.age} 岁结束了这一生。`;
    this.log(s.notice);
    this.save();
  }
  inherit(index) {
    const s = this.state;
    if (s.phase !== 'inherit') return false;
    const child = s.children[index];
    if (!child) return false;
    const age = Math.max(18, s.finalAge - child.bornAge);
    const money = Math.round(s.money * 0.7), assets = s.assets.slice(), assetMeta = Object.assign({}, s.assetMeta);
    const generation = s.generation + 1, bgId = s.bgId;
    this.state = freshState();
    const next = this.state;
    next.generation = generation; next.name = child.name; next.gender = child.gender;
    next.bgId = bgId; next.age = age; next.money = money;
    next.assets = assets; next.assetMeta = assetMeta;
    next.stats = { health: 60, intellect: child.stats.intellect, charm: child.stats.charm, wealth: moneyStat(money), happiness: 60 };
    next.stageIdx = content.STAGES.findIndex(x => ['youth', 'adult', 'elder'].includes(x.id) && age <= x.ageEnd);
    if (next.stageIdx < 0) next.stageIdx = content.STAGES.findIndex(x => x.id === 'elder');
    next.phase = 'career'; next.notice = `第${generation}代，${next.name}继承家族。`;
    this.save(); return true;
  }
}

module.exports = { LifeEngine, content, SAVE_KEY, freshState };
