const COLORS = {
  bg: '#c9dfb0', paper: '#fff7df', light: '#fffdf2', line: '#6b4932',
  ink: '#392b27', green: '#4c8b55', gold: '#d9a543', red: '#b85350', blue: '#5483aa',
};
const NAMES = ['小禾', '小满', '小川', '小雨', '小山', '小葵'];
const STAT_LABELS = { health: '❤健康', intellect: '📚智力', charm: '✨魅力', wealth: '💰财富', happiness: '😊心情' };
function fmtMoney(n) {
  if (Math.abs(n) >= 100000000) return (n / 100000000).toFixed(1) + '亿';
  if (Math.abs(n) >= 10000) return (n / 10000).toFixed(1) + '万';
  return Math.round(n).toLocaleString();
}

class CanvasGame {
  constructor(canvas, engine, content, ads) {
    this.canvas = canvas; this.engine = engine; this.content = content; this.ads = ads;
    const system = tt.getSystemInfoSync();
    this.width = Number(system.windowWidth || system.screenWidth || 375);
    this.height = Number(system.windowHeight || system.screenHeight || 667);
    this.dpr = Number(system.pixelRatio || 1);
    canvas.width = Math.round(this.width * this.dpr);
    canvas.height = Math.round(this.height * this.dpr);
    this.ctx = canvas.getContext('2d');
    this.view = 'main'; this.scroll = 0; this.hits = [];
    this.create = { nameIndex: 0, gender: 'male', bgId: 'normal' };
    this.safeTop = Math.max(24, Number((system.safeArea && system.safeArea.top) || 24));
  }
  start() {
    tt.onTouchStart(event => {
      const touch = (event.touches && event.touches[0]) || (event.changedTouches && event.changedTouches[0]);
      if (touch) this.touchStart = { x: touch.clientX, y: touch.clientY };
    });
    tt.onTouchEnd(event => {
      const touch = event.changedTouches && event.changedTouches[0];
      if (!touch || !this.touchStart) return;
      const delta = touch.clientY - this.touchStart.y;
      if (Math.abs(delta) > 12) {
        this.scroll = Math.max(0, Math.min(this.maxScroll || 0, this.scroll - delta));
        this.draw();
      } else {
        const hit = this.hits.slice().reverse().find(h => touch.clientX >= h.x && touch.clientX <= h.x + h.w &&
          touch.clientY >= h.y && touch.clientY <= h.y + h.h);
        if (hit) { hit.action(); this.draw(); }
      }
      this.touchStart = null;
    });
    if (tt.onShow) tt.onShow(() => this.draw());
    this.draw();
  }
  switchView(view) { this.view = view; this.scroll = 0; this.draw(); }
  box(x, y, w, h, fill = COLORS.paper, border = COLORS.line) {
    const c = this.ctx;
    c.fillStyle = border; c.fillRect(x, y + 3, w, h);
    c.fillStyle = fill; c.fillRect(x + 2, y + 2, w - 4, h - 2);
    c.strokeStyle = border; c.lineWidth = 2; c.strokeRect(x + 1, y + 1, w - 2, h - 1);
  }
  text(value, x, y, size = 16, color = COLORS.ink, weight = '') {
    const c = this.ctx;
    c.fillStyle = color; c.font = `${weight ? weight + ' ' : ''}${size}px sans-serif`;
    c.textBaseline = 'top'; c.fillText(String(value), x, y);
  }
  lines(value, x, y, width, size = 15, lineHeight = 23, maxLines = 5) {
    const c = this.ctx; c.font = `${size}px sans-serif`;
    let line = '', count = 0;
    for (const ch of String(value)) {
      if (ch === '\n' || (line && c.measureText(line + ch).width > width)) {
        this.text(line, x, y + count * lineHeight, size);
        count++; line = ch === '\n' ? '' : ch;
        if (count >= maxLines) return count * lineHeight;
      } else line += ch;
    }
    if (line && count < maxLines) { this.text(line, x, y + count * lineHeight, size); count++; }
    return count * lineHeight;
  }
  addHit(x, y, w, h, action, scrollable = false) {
    if (scrollable && (y + h < this.contentTop || y > this.height - 72)) return;
    this.hits.push({ x, y: scrollable ? Math.max(y, this.contentTop) : y,
      w, h: scrollable ? Math.min(y + h, this.height - 72) - Math.max(y, this.contentTop) : h, action });
  }
  button(label, y, action, options = {}) {
    const x = options.x === undefined ? 18 : options.x;
    const w = options.w === undefined ? this.width - 36 : options.w;
    const h = options.h === undefined ? 57 : options.h;
    const fill = options.fill || COLORS.light;
    this.box(x, y, w, h, fill, options.disabled ? '#a29b8b' : COLORS.line);
    this.lines(label, x + 13, y + 13, w - 26, 16, 23, 2);
    if (!options.disabled) this.addHit(x, y, w, h, action, options.scrollable);
    return y + h + 9;
  }
  sprite(stage, gender, x, y, scale) {
    const body = stage === 'baby' ? this.content.SPRITE_BABY : this.content.SPRITE_BODY;
    const colors = { H: stage === 'elder' ? '#ccc' : '#704523', S: '#f2c79c', E: '#222', M: '#a74349',
      T: gender === 'female' ? '#b85677' : '#4d8a56', P: '#3e5891', B: '#583721' };
    const c = this.ctx;
    for (let row = 0; row < body.length; row++) for (let col = 0; col < body[row].length; col++) {
      const color = colors[body[row][col]];
      if (color) { c.fillStyle = color; c.fillRect(x + col * scale, y + row * scale, scale, scale); }
    }
  }
  beginScroll(top) {
    this.contentTop = top;
    const c = this.ctx; c.save(); c.beginPath(); c.rect(0, top, this.width, this.height - top - 70); c.clip();
    return top + 8 - this.scroll;
  }
  endScroll(y) {
    this.ctx.restore();
    this.maxScroll = Math.max(0, y + this.scroll - this.contentTop + 10 - (this.height - this.contentTop - 70));
    if (this.scroll > this.maxScroll) this.scroll = this.maxScroll;
    if (this.maxScroll > 0) this.text('上下滑动查看更多', 20, this.height - 90, 12, COLORS.line);
  }
  footer(items) {
    const count = items.length, gap = 5, x0 = 12, usable = this.width - 24;
    const width = (usable - gap * (count - 1)) / count;
    items.forEach((item, i) => {
      const x = x0 + i * (width + gap), y = this.height - 63;
      this.box(x, y, width, 48, i === 0 ? COLORS.gold : COLORS.paper);
      this.text(item.label, x + 8, y + 14, count > 3 ? 13 : 15, COLORS.ink, 'bold');
      this.addHit(x, y, width, 48, item.action);
    });
  }
  header(title, subtitle = '') {
    this.box(12, this.safeTop, this.width - 24, 72, COLORS.paper);
    this.text(title, 25, this.safeTop + 11, 21, COLORS.ink, 'bold');
    if (subtitle) this.lines(subtitle, 25, this.safeTop + 40, this.width - 50, 13, 18, 1);
  }
  draw() {
    const c = this.ctx;
    c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    c.fillStyle = COLORS.bg; c.fillRect(0, 0, this.width, this.height);
    this.hits = []; this.maxScroll = 0;
    const s = this.engine.state;
    if (s.phase === 'title') return this.drawTitle();
    if (s.phase === 'create') return this.drawCreate();
    if (s.phase !== 'play') return this.drawGate();
    if (this.view === 'shop') return this.drawShop();
    if (this.view === 'activity') return this.drawActivity();
    if (this.view === 'family') return this.drawFamily();
    return this.drawPlay();
  }
  drawTitle() {
    const y = this.safeTop + 45;
    this.box(22, y, this.width - 44, Math.min(470, this.height - y - 50));
    this.text('家族重启日记', 47, y + 31, 29, COLORS.line, 'bold');
    this.text('一代一代，写下自己的故事', 47, y + 80, 15);
    this.sprite('adult', 'male', this.width / 2 - 42, y + 115, 5);
    const startY = y + 245;
    this.button('开启新的人生', startY, () => {
      this.engine.state.phase = 'create'; this.switchView('main');
    }, { x: 40, w: this.width - 80, fill: COLORS.gold });
    if (this.engine.hasSave) this.button('继续上次的人生', startY + 76, () => {
      this.engine.resume(); this.switchView('main');
    }, { x: 40, w: this.width - 80 });
    this.text('自动保存 · 竖屏触摸操作', 49, y + 400, 13, COLORS.line);
  }
  drawCreate() {
    this.header('创建角色', '选好出身，就从出生开始。');
    let y = this.beginScroll(this.safeTop + 84);
    y = this.button(`姓名：${NAMES[this.create.nameIndex]}（点此换名）`, y, () => {
      this.create.nameIndex = (this.create.nameIndex + 1) % NAMES.length;
    }, { scrollable: true });
    y = this.button(`性别：${this.create.gender === 'male' ? '男' : '女'}（点此切换）`, y, () => {
      this.create.gender = this.create.gender === 'male' ? 'female' : 'male';
    }, { scrollable: true });
    this.text('选择出身', 22, y + 6, 18, COLORS.line, 'bold'); y += 38;
    for (const bg of this.content.BACKGROUNDS) {
      y = this.button(`${this.create.bgId === bg.id ? '✓ ' : ''}${bg.name} · 初始${fmtMoney(bg.money)}元`, y, () => {
        this.create.bgId = bg.id;
      }, { fill: this.create.bgId === bg.id ? '#e5f3d9' : COLORS.light, scrollable: true });
    }
    this.endScroll(y);
    this.footer([{ label: '开始人生', action: () => {
      this.engine.newGame({ name: NAMES[this.create.nameIndex], gender: this.create.gender, bgId: this.create.bgId });
      this.switchView('main');
    } }, { label: '返回', action: () => { this.engine.state.phase = 'title'; this.switchView('main'); } }]);
  }
  drawPlay() {
    const s = this.engine.state, stage = this.engine.stage();
    const top = this.safeTop;
    this.box(12, top, this.width - 24, 143, COLORS.paper);
    this.text(`第${s.generation}代  ${s.name} · ${s.age}岁`, 22, top + 9, 18, COLORS.line, 'bold');
    this.text(`${stage.name}    💰${fmtMoney(s.money)}`, 22, top + 36, 15);
    this.sprite(stage.sprite, s.gender, 24, top + 63, 3);
    const sx = 99, sw = this.width - sx - 28;
    ['health', 'intellect', 'charm', 'wealth', 'happiness'].forEach((key, i) => {
      const yy = top + 62 + i * 15;
      this.text(STAT_LABELS[key], sx, yy, 11);
      this.ctx.fillStyle = '#d9d4bd'; this.ctx.fillRect(sx + 66, yy + 4, sw - 94, 7);
      this.ctx.fillStyle = key === 'health' ? COLORS.red : COLORS.green;
      this.ctx.fillRect(sx + 66, yy + 4, (sw - 94) * s.stats[key] / 100, 7);
      this.text(s.stats[key], sx + sw - 24, yy - 1, 11);
    });
    let y = this.beginScroll(top + 153);
    this.box(18, y, this.width - 36, 92, COLORS.light);
    const healthWarning = s.stats.health < 15 ? '【健康告急】优先休息或调养身体。\n' :
      s.stats.health < 30 ? '【身体不适】继续透支可能结束本代人生。\n' : '';
    this.lines(healthWarning + (s.notice || `这一年，你想怎样度过？`), 30, y + 11, this.width - 60, 15, 22, 3);
    y += 103;
    this.text('选择这一年的方向', 22, y, 18, COLORS.line, 'bold'); y += 31;
    s.choices.forEach((choice, i) => {
      const effects = Object.entries(choice.eff || {}).filter(([, value]) => value)
        .map(([key, value]) => `${(STAT_LABELS[key] && STAT_LABELS[key].slice(0, 2)) || key}${value > 0 ? '+' : ''}${value}`).join(' ');
      const money = choice.money ? ` 💰${choice.money > 0 ? '+' : ''}${fmtMoney(choice.money)}` : '';
      y = this.button(`${choice.text}\n${effects}${money}`, y, () => {
        this.engine.choose(i); this.scroll = 0;
      }, { h: 69, scrollable: true });
    });
    if (this.ads.enabled() && s.lastRerollAge !== s.age) {
      y = this.button('看广告 · 重抽本年选项', y + 5, () => this.ads.showRewarded(
        () => { this.engine.rerollChoices(); this.draw(); },
        message => { s.notice = message; this.draw(); }), { scrollable: true, fill: '#dbeaff' });
    }
    this.endScroll(y);
    const nav = [{ label: '休息 +8健康', action: () => { this.engine.rest(); this.scroll = 0; } }];
    if (s.age >= 18) {
      nav.push({ label: '商城', action: () => this.switchView('shop') });
      nav.push({ label: '活动', action: () => this.switchView('activity') });
      nav.push({ label: '家人', action: () => this.switchView('family') });
    }
    this.footer(nav);
  }
  drawShop() {
    const s = this.engine.state;
    this.header('商城', `现金 ${fmtMoney(s.money)} · 购买后自动保存`);
    let y = this.beginScroll(this.safeTop + 84);
    for (const item of this.content.SHOP_ITEMS) {
      const owned = item.asset && s.assets.includes(item.id);
      const blocked = s.money < item.price || owned || (item.require && !s.assets.includes(item.require));
      y = this.button(`${item.icon} ${item.name} · ${fmtMoney(item.price)}\n${owned ? '已拥有' : item.desc}`, y, () => {
        this.engine.buy(item.id);
      }, { h: 75, scrollable: true, disabled: blocked });
    }
    this.endScroll(y);
    this.footer([{ label: '返回人生', action: () => this.switchView('main') }]);
  }
  drawActivity() {
    const s = this.engine.state;
    this.header('活动', s.lastActivityAge === s.age ? '今年已经参加过活动' : '每年最多参加一次');
    let y = this.beginScroll(this.safeTop + 84);
    this.box(18, y, this.width - 36, 78, COLORS.light);
    this.lines(s.notice, 29, y + 10, this.width - 58, 14, 20, 3); y += 89;
    for (const item of this.content.ACTIVITIES) {
      y = this.button(`${item.icon} ${item.name} · ${fmtMoney(item.price)}\n${item.desc}`, y,
        () => this.engine.activity(item.id),
        { h: 80, scrollable: true, disabled: s.money < item.price || s.lastActivityAge === s.age });
    }
    this.endScroll(y);
    this.footer([{ label: '返回人生', action: () => this.switchView('main') }]);
  }
  drawFamily() {
    const s = this.engine.state;
    this.header('家人与相亲', s.spouse ? `伴侣 ${s.spouse.name} · 子女 ${s.children.length}` : '每年可追求一次');
    let y = this.beginScroll(this.safeTop + 84);
    this.box(18, y, this.width - 36, 70, COLORS.light);
    this.lines(s.notice, 29, y + 9, this.width - 60, 14, 20, 2); y += 82;
    if (s.spouse) {
      y = this.button(`👫 ${s.spouse.name} · 年收入${fmtMoney(s.spouse.income)}`, y, () => {}, { disabled: true, scrollable: true });
      y = this.button(`👶 生育 · 花费${fmtMoney(this.engine.birthCost())}`, y, () => this.engine.birth(),
        { disabled: !this.engine.canHaveChild(), scrollable: true });
      for (const child of s.children) this.text(`${child.name} · ${s.age - child.bornAge}岁`, 29, y += 29, 15);
    } else if (s.age < 20) {
      this.text('20岁后开放相亲。', 28, y + 12, 17);
    } else {
      for (const person of this.engine.candidates()) {
        const affection = s.affection[person.id] || 0;
        const cost = this.engine.weddingCost(person);
        this.text(`${person.avatar} ${person.name} · 好感${affection}/100`, 25, y + 8, 17, COLORS.line, 'bold');
        y += 34;
        const w = (this.width - 49) / 2;
        this.button('追求 1000元', y, () => this.engine.court(person.id), {
          x: 18, w, h: 46, scrollable: true,
          disabled: s.lastCourtAge === s.age || s.money < 1000,
        });
        this.button(`结婚 ${fmtMoney(cost)}`, y, () => this.engine.marry(person.id), {
          x: 31 + w, w, h: 46, scrollable: true,
          disabled: !this.engine.candidateRequirements(person) || affection < (person.reqs.minAffection || 80) || s.money < cost,
        });
        y += 65;
      }
    }
    this.endScroll(y);
    this.footer([{ label: '返回人生', action: () => this.switchView('main') }]);
  }
  drawGate() {
    const s = this.engine.state;
    const titles = { kindergarten: '选择幼儿园', admission: '填报志愿', careerPlan: '职业规划',
      career: '选择职业', education: '继续深造？', inherit: '家族传承', summary: '人生终章' };
    this.header(titles[s.phase] || '人生转折', `${s.name} · ${s.age}岁 · 第${s.generation}代`);
    let y = this.beginScroll(this.safeTop + 84);
    this.box(18, y, this.width - 36, 88, COLORS.light);
    const intro = s.phase === 'admission' ? `高考得分 ${s.education.score}。选择学校与专业。` :
      s.phase === 'education' ? this.engine.stage().intro : s.notice;
    this.lines(intro, 29, y + 12, this.width - 58, 15, 22, 3); y += 103;
    if (s.phase === 'kindergarten') {
      y = this.button('普通公立幼儿园 · 免费', y, () => this.engine.chooseKindergarten(false), { scrollable: true });
      y = this.button('国际幼儿园 · 花费1万', y, () => this.engine.chooseKindergarten(true),
        { scrollable: true, disabled: this.engine.wealth() < 30000 || s.money < 10000 });
    } else if (s.phase === 'admission') {
      this.engine.universities().forEach((u, i) => {
        for (const [majorIndex, major] of u.majors.entries()) {
          y = this.button(`${u.name} · ${major}`, y,
            () => this.engine.chooseUniversity(i, majorIndex), { h: 61, scrollable: true });
        }
      });
    } else if (s.phase === 'career' || s.phase === 'careerPlan') {
      for (const career of this.engine.careers()) {
        y = this.button(`${career.ico} ${career.name}\n起薪 ${fmtMoney(career.base)}/月`, y,
          () => this.engine.chooseCareer(career.id), { h: 73, scrollable: true });
      }
      if (s.phase === 'careerPlan') y = this.button('暂不规划，毕业时再选', y,
        () => this.engine.postponeCareer(), { scrollable: true });
    } else if (s.phase === 'education') {
      const master = this.engine.stage().id === 'master';
      const can = s.stats.intellect >= (master ? 55 : 65) && (master || s.education.master);
      y = this.button(`攻读${master ? '硕士' : '博士'} · 智力需≥${master ? 55 : 65}`, y,
        () => this.engine.chooseEducation(true), { scrollable: true, disabled: !can });
      y = this.button('直接开始工作', y, () => this.engine.chooseEducation(false), { scrollable: true });
    } else if (s.phase === 'inherit') {
      this.text(`可继承 ${fmtMoney(s.money * 0.7)} 元与家族资产`, 25, y, 15); y += 38;
      s.children.forEach((child, i) => {
        y = this.button(`${child.name} · ${s.finalAge - child.bornAge}岁`, y,
          () => this.engine.inherit(i), { scrollable: true });
      });
    } else if (s.phase === 'summary') {
      this.text(`享年 ${s.finalAge} 岁 · 家族资产 ${fmtMoney(this.engine.wealth())}`, 25, y, 16); y += 39;
      this.text('人生片段', 25, y, 18, COLORS.line, 'bold'); y += 32;
      for (const event of s.log.slice(-12)) {
        this.lines(`${event.age}岁 ${event.text}`, 25, y, this.width - 48, 14, 20, 2); y += 50;
      }
      y = this.button('开启新的家族', y, () => { s.phase = 'create'; this.engine.savedState = null; }, { scrollable: true });
    }
    this.endScroll(y);
  }
}

module.exports = { CanvasGame };
