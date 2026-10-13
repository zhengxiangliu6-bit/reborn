/* ============================================================
   家族重启日记 V1.0.0：年度选择与家族传承
   含：年收入系统、商城/活动、相亲/育儿、家族资产、子女继承
   ============================================================ */

/* ---------- 像素角色贴图 ---------- */
const SPRITE_BODY = [
  "................",
  "....HHHHHHHH....",
  "...HHHHHHHHHH...",
  "...HHSSSSSSHH...",
  "...HSSSSSSSSH...",
  "...SSSESSESSS...",
  "...SSSSMMSSSS...",
  "......SSSS......",
  "...TTTTTTTTTT...",
  "..TTTTTTTTTTTT..",
  "..TTTTTTTTTTTT..",
  "..STTTTTTTTTTS..",
  "..TTTTTTTTTTTT..",
  "...TTTTTTTTTT...",
  "...PPPPPPPPPP...",
  "...PPPP..PPPP...",
  "...PPPP..PPPP...",
  "...PPPP..PPPP...",
  "...BBBB..BBBB...",
  "................",
];
const SPRITE_BABY = [
  "................",
  ".....HHHHHH.....",
  "....HHHHHHHH....",
  "....HHSSSSHH....",
  "....SSSSSSSS....",
  "....SSESSESS....",
  "....SSSMMSSS....",
  "...TTTTTTTTTT...",
  "..TTTTTTTTTTTT..",
  "..TTTTTTTTTTTT..",
  "..TTTTTTTTTTTT..",
  "..STTTTTTTTTTS..",
  "...TTTTTTTTTT...",
  "...PPPPPPPPPP...",
  "....BBBBBBBB....",
  "................",
];
function makePalette(stage, gender, overrides = {}) {
  const male = gender === 'male';
  const elder = stage === 'elder';
  const hairColor = overrides.H || (elder ? '#c8c8c8' : '#6b3e1e');
  const skinColor = overrides.S || '#f2c79c';
  if (stage === 'baby') {
    return {
      H: overrides.H || '#b8843c',
      S: overrides.S || '#f6d2a8',
      E: '#2b2b2b', M: '#b9413a',
      T: overrides.T || (male ? '#7fb8e6' : '#f4a8c8'),
      P: overrides.P || '#efe6c4',
      B: overrides.B || '#caa86a',
    };
  }
  return {
    H: hairColor,
    S: skinColor,
    E: '#2b2b2b', M: '#b9413a',
    T: overrides.T || (elder ? (male ? '#6a7a5a' : '#9a6a7a') : (male ? '#3f7d20' : '#d6457f')),
    P: overrides.P || '#3a4a8a',
    B: overrides.B || '#4a2f18',
  };
}
function drawCharacter(canvas, stageKey, gender, overrides) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const sprite = stageKey === 'baby' ? SPRITE_BABY : SPRITE_BODY;
  const palette = makePalette(stageKey, gender, overrides);
  const scale = { baby: 5, child: 4, teen: 5, adult: 6, elder: 6 }[stageKey] || 6;
  const w = Math.max(...sprite.map(r => r.length));
  const h = sprite.length;
  const px = scale;
  const offX = Math.floor((canvas.width - w * px) / 2);
  const offY = Math.floor((canvas.height - h * px) / 2);
  for (let y = 0; y < h; y++) {
    const row = sprite[y];
    for (let x = 0; x < w; x++) {
      const ch = row[x] || '.';
      const col = palette[ch];
      if (col) {
        ctx.fillStyle = col;
        ctx.fillRect(offX + x * px, offY + y * px, px, px);
      }
    }
  }
}

/* ============================================================
   静态数据
   ============================================================ */

const STATS = {
  health:    { label: '健康', ico: '❤',  cls: 'hp' },
  intellect: { label: '智力', ico: '📚', cls: 'iq' },
  charm:     { label: '魅力', ico: '✨', cls: 'ch' },
  wealth:    { label: '财富', ico: '💰', cls: 'we' },
  happiness: { label: '心情', ico: '😊', cls: 'ha' },
};
const STAT_KEYS = ['health', 'intellect', 'charm', 'wealth', 'happiness'];

const BACKGROUNDS = [
  { id: 'rich',    name: '富家子弟', desc: '含着金钥匙出生，家境优渥。',       eff: { wealth: 25, charm: 8, health: -5 },  money: 50000 },
  { id: 'scholar', name: '书香门第', desc: '家学渊源，从小耳濡目染。',         eff: { intellect: 20, happiness: 8, wealth: -8 }, money: 8000 },
  { id: 'sport',   name: '体育世家', desc: '运动基因强大，体魄强健。',         eff: { health: 22, charm: 6, intellect: -5 },  money: 10000 },
  { id: 'normal',  name: '普通家庭', desc: '平平淡淡才是真。',                 eff: { health: 5, intellect: 5, charm: 5, wealth: 5, happiness: 5 }, money: 5000 },
  { id: 'orphan',  name: '寒门子弟', desc: '出身贫寒，却胸怀大志。',           eff: { health: -5, wealth: -15, intellect: 8, happiness: -3 }, money: 500 },
];

const ASPIRATIONS = [
  { id: 'wealth', icon: '💰', name: '家业兴旺', desc: '家族总资产达到300万', reward: 120, target: 3000000, value: () => getFamilyNetWorth() },
  { id: 'career', icon: '💼', name: '事业巅峰', desc: '职业达到8级', reward: 100, target: 8, value: () => state.job.level || 0 },
  { id: 'scholar', icon: '🎓', name: '书香传家', desc: '智力达到90并进入重点大学', reward: 110, target: 1, value: () => state.stats.intellect >= 90 && state.education.university && state.education.university.tier <= 2 ? 1 : 0 },
  { id: 'family', icon: '👨‍👩‍👧', name: '枝繁叶茂', desc: '结婚并养育3名子女', reward: 100, target: 3, value: () => state.spouse ? state.children.length : 0 },
  { id: 'longevity', icon: '🌲', name: '长寿家风', desc: '任一家主活到90岁', reward: 140, target: 90, value: () => Math.max(state.age, state.finalAge || 0) },
];

const ROUTE_TRAITS = {
  scholar: { icon: '📚', name: '求知者', desc: '工资提高8%' },
  athlete: { icon: '🏃', name: '健身达人', desc: '健康年龄衰减降低1点' },
  social: { icon: '🤝', name: '社交达人', desc: '同学聚会评分提高15点' },
  entrepreneur: { icon: '📈', name: '经营能手', desc: '经营资产收益提高10%' },
  family: { icon: '🏡', name: '家庭支柱', desc: '子女年度开支降低10%' },
};

function choiceRoute(choice) {
  const text = `${choice.text || ''}${choice.desc || ''}`;
  if (/学习|读书|科研|高考|竞赛|论文|学术/.test(text)) return 'scholar';
  if (/健身|运动|锻炼|养生|体育/.test(text)) return 'athlete';
  if (/社交|学生会|朋友|恋爱|派对|人脉/.test(text)) return 'social';
  if (/创业|投资|事业|工作|打工|升职|理财/.test(text)) return 'entrepreneur';
  if (/家庭|结婚|孩子|生儿|育女|公益|家务/.test(text)) return 'family';
  return null;
}

function recordChoiceRoute(choice) {
  const route = choiceRoute(choice);
  if (!route) return null;
  if (!state.routeProgress) state.routeProgress = {};
  if (!Array.isArray(state.traits)) state.traits = [];
  state.routeProgress[route] = (state.routeProgress[route] || 0) + 1;
  if (state.routeProgress[route] >= 3 && !state.traits.includes(route)) {
    state.traits.push(route);
    const trait = ROUTE_TRAITS[route];
    state.log.push({ age: state.age, text: `${trait.icon} 长期选择形成特质「${trait.name}」：${trait.desc}。` });
    return trait;
  }
  return null;
}

function updateRouteUI() {
  const box = $('route-info');
  if (!box) return;
  const traits = Array.isArray(state.traits) ? state.traits : [];
  box.innerHTML = traits.length ? traits.map(id => {
    const trait = ROUTE_TRAITS[id];
    return `<span class="route-tag" title="${trait.desc}">${trait.icon}${trait.name}</span>`;
  }).join('') : '<span class="route-tag">尚未形成长期特质</span>';
}

const STAGES = [
  { id: 'baby', name: '婴幼儿', sprite: 'baby', ageStart: 0, ageEnd: 2, rounds: 2, unlockEco: false,
    intro: '你呱呱坠地，来到了这个充满未知的世界。父母满怀期待地看着你……',
    pool: [
      { text: '努力学走路',     eff: { health: -3, intellect: 4 }, desc: '你摔了无数跤，终于迈出了人生第一步！' },
      { text: '安静地睡觉',     eff: { health: 5, happiness: 2 },  desc: '你睡得很香，长得白白胖胖。' },
      { text: '咿呀学语',       eff: { intellect: 5, charm: 2 },   desc: '你学会了喊"爸爸妈妈"！' },
      { text: '调皮捣蛋',       eff: { happiness: 5, charm: 3, health: -2 }, desc: '你把家里搅得天翻地覆。' },
    ],
  },
  { id: 'kindergarten', name: '幼儿园', sprite: 'child', ageStart: 3, ageEnd: 5, rounds: 2, unlockEco: false,
    kgChoice: true,
    intro: '到了上幼儿园的年纪，父母开始为你挑选合适的幼儿园。',
    pool: [
      { text: '学画画做手工', eff: { intellect: 4, happiness: 5 },            desc: '你的画作被贴在了教室墙上！' },
      { text: '和小朋友游戏', eff: { charm: 5, happiness: 4, health: 2 },     desc: '你成了孩子王，大家都爱跟你玩。' },
      { text: '学唱儿歌',     eff: { charm: 4, intellect: 3, happiness: 3 },  desc: '你在汇演上领唱，掌声雷动。' },
      { text: '午睡偷吃零食', eff: { happiness: 5, health: -2 },              desc: '你偷偷吃了好多零食，开心但肚子疼。' },
    ],
  },
  { id: 'primary', name: '小学', sprite: 'child', ageStart: 6, ageEnd: 12, rounds: 3, unlockEco: false,
    intro: '转眼你背起小书包，迈进了小学的校门，校园里充满了欢声笑语。',
    pool: [
      { text: '认真学习',       eff: { intellect: 8, happiness: -2 },           desc: '你门门功课优秀，是老师的好学生。' },
      { text: '和小伙伴玩耍',   eff: { charm: 6, happiness: 5, health: 2 },     desc: '你交到了一群好朋友！' },
      { text: '帮父母做家务',   eff: { wealth: 0, happiness: 3, intellect: 2 }, money: 800, desc: '你是个懂事贴心的孩子，拿到了奖励。' },
      { text: '看课外书',       eff: { intellect: 6, happiness: 4 },             desc: '你在书里发现了新世界。' },
      { text: '学一门乐器',     eff: { charm: 6, intellect: 3, happiness: 2 },   desc: '你开始学钢琴，弹出了第一支曲子。' },
      { text: '反抗欺负你的人', eff: { health: 3, charm: 4, happiness: -3 },    desc: '你勇敢地保护了自己。' },
    ],
  },
  { id: 'middle', name: '初中', sprite: 'teen', ageStart: 13, ageEnd: 15, rounds: 2, unlockEco: false,
    intro: '青春期来临，你升入初中，开始思考自己的人生方向。',
    pool: [
      { text: '拼命学习',       eff: { intellect: 10, health: -3, happiness: -3 }, money: 0, jobBoost: 1,
        desc: '你考上了重点高中！未来的道路变得清晰。' },
      { text: '加入运动队',     eff: { health: 8, charm: 5 },                      desc: '你成了校队的主力球员。' },
      { text: '打工赚钱',       eff: { wealth: 0, intellect: 3, health: -2 },      money: 3000, desc: '你赚到了人生第一桶金。' },
      { text: '谈场青涩恋爱',   eff: { charm: 8, happiness: 6, intellect: -2 },    desc: '你尝到了心动的滋味。' },
      { text: '参加学科竞赛',   eff: { intellect: 8, charm: 3 },                   money: 2000, desc: '你捧回了奥数奖杯，还拿到了奖学金！' },
      { text: '沉迷游戏',       eff: { happiness: 8, intellect: -4, health: -3, wealth: 0 }, money: -1000,
        desc: '你打通了所有游戏，成绩却下滑了，还花了不少零花钱。' },
    ],
  },
  { id: 'high', name: '高中', sprite: 'teen', ageStart: 16, ageEnd: 18, rounds: 2, unlockEco: false,
    gaokao: true,
    intro: '高中三年至关重要，高考是改变命运的关键一战。',
    pool: [
      { text: '备战高考',       eff: { intellect: 12, health: -4, happiness: -4 }, money: 0, jobBoost: 2,
        desc: '你拼尽全力备战高考，知识储备大增！' },
      { text: '体育特招',       eff: { health: 10, charm: 5 },                      money: 0, jobBoost: 1,
        desc: '你凭体育特长被高校相中！' },
      { text: '兼职打工',       eff: { wealth: 0, intellect: 2, health: -2 },      money: 5000, desc: '你课余兼职，攒了笔小钱。' },
      { text: '校园恋爱',       eff: { charm: 8, happiness: 7, intellect: -3 },    desc: '你和心仪的人谈了场甜甜的恋爱。' },
      { text: '参加奥赛',       eff: { intellect: 10, charm: 3 },                   money: 5000, jobBoost: 1,
        desc: '你在全国奥赛获奖，名校向你招手！' },
      { text: '沉迷网游',       eff: { happiness: 8, intellect: -5, health: -3, wealth: 0 }, money: -2000,
        desc: '你沉迷网游，成绩下滑，还充了不少钱。' },
    ],
  },
  { id: 'college', name: '大学', sprite: 'adult', ageStart: 19, ageEnd: 22, rounds: 2, unlockEco: true,
    admission: true,
    intro: '高考结束，你即将填报志愿，迈入大学校园。💰 年满18，商城和活动系统已经解锁！',
    pool: [
      { text: '刻苦钻研专业',   eff: { intellect: 12, happiness: -2 },             money: 0, jobBoost: 2,
        desc: '你专业成绩拔尖，获得保研资格！' },
      { text: '加入学生会',     eff: { charm: 8, intellect: 3, happiness: 4 },     money: 0, jobBoost: 1,
        desc: '你锻炼了组织能力，人脉广了。' },
      { text: '校园创业',       eff: { wealth: 0, happiness: 5, health: -3, intellect: 3 }, money: 20000, jobBoost: 2,
        desc: '你和同学合伙创业，赚到了第一桶金！' },
      { text: '谈场恋爱',       eff: { charm: 8, happiness: 8 },                    desc: '你遇到了那个对的人（也可去相亲面板追求）。' },
      { text: '实习打工',       eff: { wealth: 0, intellect: 4, health: -2 },      money: 10000, jobBoost: 1,
        desc: '你到名企实习，积累了职场经验。' },
      { text: '参加社团活动',   eff: { charm: 6, happiness: 6, health: 2 },        desc: '你在社团里找到了志同道合的朋友。' },
    ],
  },
  { id: 'master', name: '研究生', sprite: 'adult', ageStart: 23, ageEnd: 25, rounds: 2, unlockEco: true,
    eduGate: 'master',
    intro: '大学毕业，站在人生的十字路口：继续深造，还是踏入职场？',
    pool: [
      { text: '跟随导师做科研', eff: { intellect: 12, happiness: -3 },            money: 0, jobBoost: 2, desc: '你发表了核心期刊论文！' },
      { text: '参加学术会议',   eff: { charm: 4, intellect: 6, happiness: 3 },     desc: '你结识了业界大牛，开阔了视野。' },
      { text: '拿奖学金',       eff: { wealth: 0, intellect: 4 },                  money: 8000, desc: '你凭优异成绩拿到了丰厚奖学金。' },
      { text: '实验室熬夜',     eff: { intellect: 6, health: -5, happiness: -2 },  desc: '你为了课题通宵达旦，身体有点吃不消。' },
    ],
  },
  { id: 'phd', name: '博士', sprite: 'adult', ageStart: 26, ageEnd: 29, rounds: 2, unlockEco: true,
    eduGate: 'phd',
    intro: '硕士在读或已毕业，是否挑战学术巅峰，攻读博士？',
    pool: [
      { text: '攻坚博士课题',   eff: { intellect: 14, health: -5, happiness: -4 }, jobBoost: 3, desc: '你的博士论文顺利通过答辩！' },
      { text: '海外交流访学',   eff: { intellect: 8, charm: 6, happiness: 5 },      money: -10000, desc: '你出国交流，增长了见识。' },
      { text: '带本科生做项目', eff: { charm: 5, intellect: 4, happiness: 3 },      money: 5000, desc: '你当起了小导师，教学相长。' },
      { text: '申请科研基金',   eff: { wealth: 0, intellect: 5 },                   money: 30000, desc: '你成功申请到国家自然科学基金！' },
    ],
  },
  { id: 'youth', name: '青年', sprite: 'adult', ageStart: 23, ageEnd: 35, rounds: 3, unlockEco: true,
    intro: '你毕业踏入社会，广阔天地大有作为。',
    pool: [
      { text: '找份好工作',     eff: { wealth: 0, intellect: 5, happiness: -2, health: -2 }, money: 15000, jobBoost: 2,
        desc: '你步入职场，开始打拼。' },
      { text: '自主创业',       eff: { wealth: 0, happiness: 5, health: -5, intellect: 3 }, money: 30000, jobBoost: 3,
        desc: '创业之路荆棘丛生，但你乐在其中。' },
      { text: '环游世界',       eff: { happiness: 12, charm: 6, wealth: -1 }, money: -25000,
        desc: '你看遍了山川湖海。' },
      { text: '坚持健身',       eff: { health: 10, charm: 6 },                      desc: '你练出了令人羡慕的好身材。' },
      { text: '遇到心上人',     eff: { charm: 8, happiness: 8 },                    desc: '你遇到了那个对的人（可以去相亲面板主动追求哦）。' },
      { text: '投资理财',       eff: { wealth: 0, intellect: 4 },                   money: 20000, desc: '你开始学习理财，小有收获。' },
    ],
  },
  { id: 'adult', name: '中年', sprite: 'adult', ageStart: 36, ageEnd: 60, rounds: 3, unlockEco: true,
    intro: '人到中年，事业与家庭兼顾，你更加成熟稳重。',
    pool: [
      { text: '拼搏升职',       eff: { wealth: 0, intellect: 5, happiness: -3, health: -3 }, money: 80000, jobBoost: 1,
        desc: '你当上了部门主管，收入大涨！' },
      { text: '投资理财',       eff: { wealth: 0, intellect: 6 }, money: 60000,
        desc: '你的投资翻了一番！' },
      { text: '结婚成家',       eff: { happiness: 12, charm: 5 }, autoMarry: true,
        desc: '你步入婚姻的殿堂。（若还未结婚，会自动成家）' },
      { text: '生儿育女',       eff: { happiness: 10, health: -2 }, autoBaby: 1,
        desc: '你有了可爱的孩子。（若已婚会自动生育）' },
      { text: '扩大事业',       eff: { wealth: 0, health: -5, happiness: 3 }, money: 180000, jobBoost: 2,
        desc: '你的事业蒸蒸日上。' },
      { text: '注重养生',       eff: { health: 12, happiness: 5 }, money: -10000,
        desc: '你开始早睡早起，注重健康。' },
    ],
  },
  { id: 'elder', name: '老年', sprite: 'elder', ageStart: 61, ageEnd: 85, rounds: 3, unlockEco: true,
    intro: '岁月不饶人，你已两鬓斑白，开始享受晚年时光。',
    pool: [
      { text: '钓鱼下棋',       eff: { happiness: 10, intellect: 4, health: 3 },  desc: '你在湖边悠闲地度过了一个下午。' },
      { text: '含饴弄孙',       eff: { happiness: 12, charm: 5 },                 desc: '儿孙绕膝，其乐融融。' },
      { text: '写回忆录',       eff: { intellect: 8, happiness: 5 }, money: 20000,
        desc: '你提笔记录下这精彩的一生，出书赚到了版税。' },
      { text: '环游世界',       eff: { happiness: 12, wealth: -2, health: -3 }, money: -40000,
        desc: '老骥伏枥，志在千里。' },
      { text: '坚持锻炼',       eff: { health: 10, happiness: 5 },                desc: '你每天晨练，老当益壮。' },
      { text: '做公益慈善',     eff: { happiness: 8, charm: 8, wealth: -2 },     money: -30000,
        desc: '你帮助了许多需要的人。' },
    ],
  },
];

/* 随机事件（按年龄过滤，数据驱动；minAge/maxAge 控制适用范围） */
const EVENTS = [
  /* === 婴儿期（0-2岁）专属 10个 === */
  { minAge: 0, maxAge: 2, name: '发烧生病',   desc: '你突然发高烧，爸妈急忙带你去了医院。',     money: -2000, eff: { health: -10 } },
  { minAge: 0, maxAge: 2, name: '摔倒擦伤',   desc: '你学走路时摔了一跤，磕破了膝盖。',                       eff: { health: -5 } },
  { minAge: 0, maxAge: 2, name: '长牙哭闹',   desc: '你正在长牙，难受得哭了一整晚。',                         eff: { health: -3, happiness: -3 } },
  { minAge: 0, maxAge: 2, name: '被逗笑',     desc: '爸妈逗你玩，你咯咯笑个不停。',                           eff: { happiness: 8, health: 2 } },
  { minAge: 0, maxAge: 2, name: '打疫苗',     desc: '爸妈带你去打疫苗，你哭得撕心裂肺。',           money: -500,  eff: { health: 2, happiness: -5 } },
  { minAge: 1, maxAge: 2, name: '学会走路',   desc: '你终于迈出了人生第一步！爸妈激动不已。',                 eff: { intellect: 4, happiness: 6 } },
  { minAge: 0, maxAge: 2, name: '亲戚来串门', desc: '亲戚们来看你，夸你长得真可爱。',                         eff: { happiness: 6, charm: 2 } },
  { minAge: 0, maxAge: 2, name: '睡了个好觉', desc: '你一觉睡到天亮，精神特别好。',                           eff: { health: 5, happiness: 3 } },
  { minAge: 0, maxAge: 2, name: '换季感冒',   desc: '天气转凉，你有点小感冒。',                     money: -800,  eff: { health: -5 } },
  { minAge: 1, maxAge: 2, name: '第一次说话', desc: '你喊出了"妈妈"！全家人激动坏了。',                       eff: { intellect: 5, happiness: 8 } },

  /* === 幼儿园期（3-5岁）专属 8个 === */
  { minAge: 3, maxAge: 5, name: '交叉感染',   desc: '你在幼儿园被传染了感冒。',                    money: -800,  eff: { health: -6 } },
  { minAge: 3, maxAge: 5, name: '得到小红花', desc: '你表现优秀，老师奖励了你一朵小红花！',                   eff: { happiness: 6, charm: 3 } },
  { minAge: 3, maxAge: 5, name: '闹别扭',     desc: '你和小伙伴吵架了，但很快又和好了。',                     eff: { happiness: -2, charm: 2 } },
  { minAge: 3, maxAge: 5, name: '开心一天',   desc: '今天在幼儿园玩得特别开心。',                             eff: { happiness: 8, health: 2 } },
  { minAge: 3, maxAge: 5, name: '在公园迷路', desc: '你在公园里走丢了，幸好被好心人送回来。',                 eff: { happiness: -5, health: -2 } },
  { minAge: 3, maxAge: 5, name: '学会骑童车', desc: '你学会了骑四轮童车，开心得满院子转。',                   eff: { health: 3, happiness: 6 } },
  { minAge: 3, maxAge: 5, name: '幼儿园表演', desc: '你在幼儿园汇演上表演了节目，获得阵阵掌声。',             eff: { charm: 4, happiness: 6 } },
  { minAge: 3, maxAge: 5, name: '生日派对',   desc: '爸妈给你办了生日派对，你收到了好多礼物。',               eff: { happiness: 8, charm: 2 } },

  /* === 小学期（6-12岁）10个 === */
  { minAge: 6, maxAge: 12, name: '天降横财',  desc: '你在路边捡到了一笔钱！',                      money: 5000,  eff: { happiness: 5 } },
  { minAge: 6, maxAge: 12, name: '获奖学金',  desc: '你学习成绩优异，获得了奖学金。',              money: 8000,  eff: { happiness: 6, intellect: 3 } },
  { minAge: 6, maxAge: 12, name: '结交知己',  desc: '你结识了一位志同道合的好友。',                           eff: { charm: 5, happiness: 6 } },
  { minAge: 6, maxAge: 12, name: '大病一场',  desc: '你突然病倒，住进了医院。',                    money: -5000, eff: { health: -12 } },
  { minAge: 6, maxAge: 12, name: '意外受伤',  desc: '你在体育课上不小心摔伤了。',                  money: -1500, eff: { health: -8 } },
  { minAge: 6, maxAge: 12, name: '心情大好',  desc: '今天阳光明媚，心情格外舒畅。',                           eff: { happiness: 8, health: 2 } },
  { minAge: 6, maxAge: 12, name: '被老师表扬', desc: '老师当着全班同学表扬了你！',                             eff: { happiness: 6, intellect: 2 } },
  { minAge: 6, maxAge: 12, name: '考试砸了',  desc: '你这次考试考砸了，有点沮丧。',                           eff: { happiness: -5, intellect: 1 } },
  { minAge: 6, maxAge: 12, name: '和同学吵架', desc: '你跟好朋友吵了一架，心情不好。',                       eff: { happiness: -4, charm: -1 } },
  { minAge: 6, maxAge: 12, name: '运动会拿奖', desc: '你在运动会上拿了名次，同学们为你欢呼！',                 eff: { health: 2, charm: 4, happiness: 6 } },

  /* === 中学/高中期（13-17岁）10个 === */
  { minAge: 13, maxAge: 17, name: '失恋打击', desc: '你与暗恋对象分道扬镳，黯然神伤。',                       eff: { happiness: -10, charm: -2 } },
  { minAge: 14, maxAge: 17, name: '打工受伤', desc: '你打工时不小心受伤了。',                      money: -2000, eff: { health: -8, happiness: -2 } },
  { minAge: 13, maxAge: 17, name: '大病一场', desc: '你突然病倒，住进了医院。',                    money: -5000, eff: { health: -12 } },
  { minAge: 13, maxAge: 17, name: '意外受伤', desc: '你不小心摔伤了。',                            money: -1500, eff: { health: -8 } },
  { minAge: 13, maxAge: 17, name: '心情大好', desc: '今天阳光明媚，心情格外舒畅。',                           eff: { happiness: 8, health: 2 } },
  { minAge: 13, maxAge: 17, name: '结交知己', desc: '你结识了一位志同道合的好友。',                           eff: { charm: 5, happiness: 6 } },
  { minAge: 13, maxAge: 17, name: '考试进步', desc: '你这次考试排名大幅提升，信心倍增！',                     eff: { intellect: 4, happiness: 5 } },
  { minAge: 13, maxAge: 17, name: '早恋被发现', desc: '老师发现了你的早恋，叫了家长。心情糟透了。',           eff: { happiness: -8, charm: -1 } },
  { minAge: 13, maxAge: 17, name: '迷上小说',  desc: '你迷上了一本小说，废寝忘食地看。',                       eff: { happiness: 5, intellect: 2, health: -2 } },
  { minAge: 13, maxAge: 17, name: '校园欺凌',  desc: '你被同学欺负了，心情很低落。',                           eff: { happiness: -8, health: -3 } },

  /* === 成年期（18+）通用 === */
  { minAge: 18, name: '偶遇贵人', desc: '你遇到了一位赏识你的贵人。',                 money: 20000,  eff: { intellect: 6, charm: 4 } },
  { minAge: 18, name: '投资失败', desc: '你的投资血本无归。',                         money: -40000, eff: { happiness: -6 } },
  { minAge: 18, name: '获得奖金', desc: '你拿到了一笔丰厚的奖金！',                   money: 30000,  eff: { happiness: 5 } },
  { minAge: 18, name: '过度劳累', desc: '你最近操劳过度，身体发出警报。',                           eff: { health: -6 } },
  { minAge: 18, name: '好友相助', desc: '好友在你困难时伸出援手。',                   money: 12000,  eff: { happiness: 5 } },
  { minAge: 18, name: '天降横财', desc: '你捡到了一笔钱！',                           money: 5000,   eff: { happiness: 4 } },
  { minAge: 18, name: '大病一场', desc: '你突然病倒，住进了医院。',                   money: -5000,  eff: { health: -12 } },
  { minAge: 18, name: '意外受伤', desc: '你不小心摔伤了。',                           money: -1500,  eff: { health: -8 } },
  { minAge: 18, name: '心情大好', desc: '今天阳光明媚，心情格外舒畅。',                             eff: { happiness: 8, health: 2 } },
  { minAge: 20, name: '荣获殊荣', desc: '你获得了一项重要荣誉！',          eff: { charm: 8, happiness: 6 }, money: 50000 },
  { minAge: 25, name: '房屋增值', desc: '你名下的房产增值了！',             money: 100000, eff: { happiness: 5 } },
  { minAge: 30, name: '子女孝敬', desc: '你的孩子给了你一笔钱。',           money: 30000,  eff: { happiness: 6 } },
];
function filterEventsByAge(age) {
  return EVENTS.filter(e => {
    if (e.minAge !== undefined && age < e.minAge) return false;
    if (e.maxAge !== undefined && age > e.maxAge) return false;
    return true;
  });
}

/* ---------- 商城商品 ---------- */
const SHOP_ITEMS = [
  // 住房类（家族传承资产，有寿命+维护费）
  { id: 'house_small', name: '小公寓', icon: '🏠', cls: 'house', price: 150000, desc: '70平温馨小家，每年 +2 心情。', asset: true, income: { happiness: 2 }, lifespan: 50, maint: 3000 },
  { id: 'house_big',   name: '独栋别墅', icon: '🏡', cls: 'house', price: 600000, desc: '带花园的大别墅，每年 +5 心情 +2 魅力。', asset: true, income: { happiness: 5, charm: 2 }, require: 'house_small', lifespan: 60, maint: 8000 },
  { id: 'car_cheap',   name: '经济型轿车', icon: '🚗', cls: 'car', price: 80000,  desc: '代步车，每年节省通勤成本 +1 魅力。', asset: true, income: { charm: 1 }, yearlyMoney: 3000, lifespan: 15, maint: 5000 },
  { id: 'car_lux',     name: '豪华轿车', icon: '🏎️', cls: 'car', price: 350000, desc: '豪华座驾，每年 +4 魅力。', asset: true, income: { charm: 4 }, require: 'car_cheap', lifespan: 12, maint: 12000 },
  // 生意类（被动收入）
  { id: 'biz_shop',    name: '社区小店', icon: '🏪', cls: 'biz', price: 200000, desc: '年营业收益约 3.5 万元，另有维护成本。', asset: true, yearlyMoney: 35000, lifespan: 20, maint: 10000 },
  { id: 'biz_stock',   name: '股票组合', icon: '📈', cls: 'biz', price: 300000, desc: '年收益基准约 7 万元（有波动）。', asset: true, yearlyMoney: 70000, volatile: true },
  { id: 'biz_factory', name: '小型工厂', icon: '🏭', cls: 'biz', price: 800000, desc: '年营业收益约 15 万元，管理成本较高。', asset: true, yearlyMoney: 150000, require: 'biz_shop', lifespan: 30, maint: 30000 },
  // 服务类（一次性消耗）
  { id: 'gym',         name: '年度健身卡', icon: '🏋️', cls: 'other', price: 10000,  desc: '健身一年，+5 健康 +3 魅力。', asset: false, eff: { health: 5, charm: 3 } },
  { id: 'study',       name: '精英培训课', icon: '🎓', cls: 'other', price: 30000,  desc: '深造进修，+6 智力 +2 魅力。', asset: false, eff: { intellect: 6, charm: 2 }, jobBoost: 1 },
  { id: 'spa',         name: '奢华度假村', icon: '🌴', cls: 'other', price: 50000,  desc: '彻底放松，+8 心情 +3 健康。', asset: false, eff: { happiness: 8, health: 3 } },
  { id: 'cosmetic',    name: '形象改造',   icon: '💅', cls: 'other', price: 25000,  desc: '形象大变身，+8 魅力。', asset: false, eff: { charm: 8 } },
];

/* ---------- 活动（花费触发随机事件） ---------- */
const ACTIVITIES = [
  { id: 'act_lottery', name: '买彩票', icon: '🎟️', price: 500,
    desc: '花500元尝试暴富的梦想。',
    outcomes: [
      { weight: 95.5, text: '可惜没中……下次再来。', money: 0, eff: { happiness: -1 } },
      { weight: 4, text: '中了小奖 5,000 元！', money: 5000, eff: { happiness: 4 } },
      { weight: 0.49, text: '中了三等奖 50,000 元！', money: 50000, eff: { happiness: 10 } },
      { weight: 0.01,  text: '我的天！中了一等奖 2,000,000 元！！！', money: 2000000, eff: { happiness: 30, charm: 5 } },
    ],
  },
  { id: 'act_stock', name: '短期炒股', icon: '📊', price: 20000,
    desc: '投入 2 万元炒短线，风险较高。',
    outcomes: [
      { weight: 40, text: '被套牢了，亏 2 万。', money: 0, eff: { happiness: -8, health: -2 } },
      { weight: 25, text: '微亏 5,000。',        money: 15000, eff: { happiness: -3 } },
      { weight: 25, text: '小赚 10,000。',       money: 30000, eff: { happiness: 3, intellect: 1 } },
      { weight: 10, text: '运气不错，赚 60,000！', money: 80000, eff: { happiness: 8, intellect: 2 } },
    ],
  },
  { id: 'act_gamble', name: '收藏品竞拍', icon: '🏺', price: 10000,
    desc: '竞拍未知收藏品，可能亏损，也可能捡漏。',
    outcomes: [
      { weight: 75, text: '手气不佳，输光 1 万。',           money: 0, eff: { happiness: -6 } },
      { weight: 20, text: '保本，还倒赢了 5,000 元。',       money: 15000, eff: { happiness: 4 } },
      { weight: 4.9, text: '手气爆棚，赢了 80,000 元！',      money: 90000, eff: { happiness: 12, charm: 2 } },
      { weight: 0.1,  text: '同花顺！直接赢了 500,000 元！！', money: 510000, eff: { happiness: 25 } },
    ],
  },
  { id: 'act_party', name: '高端派对', icon: '🥂', price: 30000,
    desc: '参加高端社交，可能认识贵人。',
    outcomes: [
      { weight: 35, text: '人太多没遇到什么人。', money: 0, eff: { happiness: 2, charm: 1 } },
      { weight: 54, text: '认识了一些朋友。',     money: 0, eff: { charm: 5, happiness: 4 } },
      { weight: 10, text: '遇到一位投资人，给你 15 万项目款！', money: 150000, eff: { charm: 6, happiness: 8 } },
      { weight: 1, text: '被一位大佬赏识，直接给你投资 50 万！', money: 500000, eff: { charm: 10, happiness: 15 } },
    ],
  },
  { id: 'act_health', name: '体检+治疗', icon: '💊', price: 15000,
    desc: '做一次全面体检，可能改善健康。',
    outcomes: [
      { weight: 40, text: '没什么问题，心情更放松了。', money: 0, eff: { health: 3, happiness: 4 } },
      { weight: 40, text: '及时发现小问题，治愈了！',   money: 0, eff: { health: 10 } },
      { weight: 20, text: '动了个小手术，彻底好了。',   money: -10000, eff: { health: 18, happiness: 2 } },
    ],
  },
  { id: 'act_birthday', name: '奢华生日宴', icon: '🎂', price: 50000,
    desc: '大摆宴席，维系家庭和人脉。',
    outcomes: [
      { weight: 50, text: '家庭和睦，宾主尽欢。',     money: 0, eff: { happiness: 12, charm: 5 } },
      { weight: 40, text: '宾客回礼丰厚，收回了 3 万元礼金！', money: 30000, eff: { happiness: 15, charm: 8 } },
      { weight: 10, text: '你成为了话题中心，+15 魅力！',     money: 0, eff: { charm: 15, happiness: 10 } },
    ],
  },
];

/* ---------- 相亲对象 ---------- */
/* 相亲/结婚要求：
   reqs: {reqCharm,  // 魅力门槛
          reqHouse,  // 要求有房(任何house类资产)
          reqCar,    // 要求有车(任何car类资产)
          reqJob,    // 要求有正当职业（job.type!==undefined）
          reqWealth, // 要求家族净资产 ≥ 多少
          reqAge,    // 年龄最大容忍差
          minAffection, // 好感度到多少才接受求婚(默认80)
          betrothal, // 彩礼/嫁妆金额（直接给对方，不从你手里扣只是"形式"扣，实际进家族流水简化为结婚花费）
          weddingRatio, // 婚礼花费 = 彩礼×比例
         }
*/
const DATE_POOL_MALE = [   // 男方（对女性玩家）
  { id: 'm1', name: '王小帅', avatar: '🧑', age: 28, trait: '程序员，聪明但有点宅',
    income: 25000, costPerYear: 20000,
    reqs: { reqCharm: 40, reqWealth: 50000, minAffection: 70, betrothal: 188000, weddingRatio: 1.0 },
    color: { H: '#4a2f18', T: '#3498db', P: '#2c3e50' } },
  { id: 'm2', name: '李大壮', avatar: '🧔', age: 32, trait: '健身教练，身材壮硕',
    income: 15000, costPerYear: 15000,
    reqs: { reqCharm: 50, reqHouse: true, reqWealth: 200000, minAffection: 75, betrothal: 288000, weddingRatio: 1.2 },
    color: { H: '#8b4513', T: '#2ecc71', P: '#34495e' } },
  { id: 'm3', name: '赵富豪', avatar: '🤵', age: 40, trait: '实业家，多金成熟',
    income: 80000, costPerYear: 50000,
    reqs: { reqCharm: 72, reqHouse: true, reqCar: true, reqWealth: 5000000, reqJob: true, minAffection: 90, betrothal: 1888000, weddingRatio: 2.0 },
    color: { H: '#333333', T: '#2c3e50', P: '#1a1a2e' } },
  { id: 'm4', name: '钱书生', avatar: '🧑‍🎓', age: 26, trait: '大学讲师，文雅知性',
    income: 16000, costPerYear: 12000,
    reqs: { reqCharm: 45, reqIntellect: 60, reqWealth: 100000, minAffection: 70, betrothal: 168000, weddingRatio: 0.8 },
    color: { H: '#1a1a2e', T: '#8e44ad', P: '#2c3e50' } },
];
const DATE_POOL_FEMALE = [ // 女方（对男性玩家）
  { id: 'f1', name: '林小美', avatar: '👩', age: 24, trait: '温柔可爱，爱做家务',
    income: 8000, costPerYear: 18000,
    reqs: { reqCharm: 40, reqWealth: 50000, minAffection: 70, betrothal: 188000, weddingRatio: 1.0 },
    color: { H: '#d68b3c', T: '#e84393', P: '#34495e' } },
  { id: 'f2', name: '陈丽丽', avatar: '👩‍💼', age: 29, trait: '职场丽人，收入稳定',
    income: 20000, costPerYear: 25000,
    reqs: { reqCharm: 50, reqHouse: true, reqJob: true, reqWealth: 300000, minAffection: 80, betrothal: 388000, weddingRatio: 1.3 },
    color: { H: '#2b2b2b', T: '#9b59b6', P: '#2c3e50' } },
  { id: 'f3', name: '苏冰冰', avatar: '💃', age: 27, trait: '当红艺人，美艳动人',
    income: 60000, costPerYear: 80000,
    reqs: { reqCharm: 75, reqHouse: true, reqCar: true, reqWealth: 8000000, reqJob: true, minAffection: 95, betrothal: 2888000, weddingRatio: 2.5 },
    color: { H: '#c0392b', T: '#e74c3c', P: '#1a1a2e' } },
  { id: 'f4', name: '周雅文', avatar: '👩‍🎓', age: 26, trait: '书香门第，温柔贤惠',
    income: 12000, costPerYear: 15000,
    reqs: { reqCharm: 45, reqIntellect: 60, reqWealth: 100000, minAffection: 70, betrothal: 168000, weddingRatio: 0.8 },
    color: { H: '#6b3e1e', T: '#27ae60', P: '#2c3e50' } },
];

/* ---------- 跨家族成就与声望 ---------- */
const META_SAVE_KEY = 'family_restart_meta_v1';
const RUN_SAVE_KEY = 'family_restart_run_v1';
const HEIRLOOMS = [
  { id: 'album', icon: '📷', name: '旧相册', rep: 80, value: 20000, minGeneration: 2,
    desc: '每次继承时，新家主额外获得5点心情。' },
  { id: 'manual', icon: '📖', name: '家训手札', rep: 150, value: 100000, minAchievements: 5,
    desc: '每次继承时，新家主额外获得5点智力。' },
  { id: 'deed', icon: '📜', name: '老宅地契', rep: 300, value: 500000, minNetWorth: 3000000,
    desc: '所有房产的年度维护费降低10%。' },
  { id: 'genealogy', icon: '🏮', name: '百年族谱', rep: 800, value: 1000000, minGeneration: 5,
    desc: '每次继承时，新家主额外获得6点魅力和6点心情。' },
];
const ACHIEVEMENTS = [
  { id: 'adult', name: '独当一面', desc: '任一角色成长到18岁', reward: 20,
    check: ctx => ctx.age >= 18 },
  { id: 'health', name: '健康达人', desc: '健康达到90', reward: 25,
    check: ctx => ctx.stats.health >= 90 },
  { id: 'intellect', name: '学富五车', desc: '智力达到90', reward: 25,
    check: ctx => ctx.stats.intellect >= 90 },
  { id: 'scholar', name: '名校之路', desc: '进入一所重点或顶尖大学', reward: 35,
    check: ctx => Boolean(ctx.education.university && ctx.education.university.tier <= 2) },
  { id: 'house', name: '安家立业', desc: '购置第一套房产', reward: 40,
    check: ctx => ctx.assets.some(id => id.startsWith('house_')) },
  { id: 'marry', name: '人生伴侣', desc: '组建自己的家庭', reward: 30,
    check: ctx => Boolean(ctx.spouse) },
  { id: 'kids3', name: '枝繁叶茂', desc: '一代家庭拥有三名子女', reward: 50,
    check: ctx => ctx.children.length >= 3 },
  { id: 'career', name: '行业翘楚', desc: '职业达到第10级', reward: 70,
    check: ctx => ctx.job.level >= 10 },
  { id: 'million', name: '百万家业', desc: '家族总资产达到100万', reward: 50,
    check: ctx => ctx.netWorth >= 1000000 },
  { id: 'rich', name: '千万家业', desc: '家族总资产达到1000万', reward: 100,
    check: ctx => ctx.netWorth >= 10000000 },
  { id: 'legacy', name: '薪火相传', desc: '完成第一次家族继承', reward: 100,
    check: ctx => ctx.generation >= 2 },
  { id: 'five_generations', name: '五世家书', desc: '家族延续到第五代', reward: 250,
    check: ctx => ctx.generation >= 5 },
  { id: 'long', name: '长寿之星', desc: '任一家主活到90岁', reward: 100, hidden: true,
    hint: '让时间成为家族的朋友', check: ctx => ctx.finalAge >= 90 },
  { id: 'comeback', name: '东山再起', desc: '曾负债10万后将家族总资产提升到100万', reward: 150, hidden: true,
    hint: '从低谷重新站起来', check: ctx => ctx.records.everDeepDebt && ctx.netWorth >= 1000000 },
  { id: 'humble_rise', name: '寒门新章', desc: '以寒门出身建立百万家业', reward: 150, hidden: true,
    hint: '最普通的起点，也能写出传奇', check: ctx => ctx.bg.id === 'orphan' && ctx.netWorth >= 1000000 },
  { id: 'balanced', name: '圆满人生', desc: '四项主要状态同时达到80且拥有家庭', reward: 120, hidden: true,
    hint: '人生不只需要一种答案', check: ctx => ctx.stats.health >= 80 && ctx.stats.intellect >= 80 &&
      ctx.stats.charm >= 80 && ctx.stats.happiness >= 80 && Boolean(ctx.spouse) },
];

function freshMeta() {
  return {
    version: 1, reputation: 0, unlocked: [], heirlooms: [], equipped: [],
    records: { maxGeneration: 1, maxNetWorth: 0 },
  };
}
let meta = freshMeta();

function loadMeta() {
  try {
    const saved = JSON.parse(localStorage.getItem(META_SAVE_KEY) || 'null');
    if (saved && saved.version === 1 && Array.isArray(saved.unlocked)) {
      meta = {
        version: 1,
        reputation: Math.max(0, Number(saved.reputation) || 0),
        unlocked: saved.unlocked.slice(),
        heirlooms: Array.isArray(saved.heirlooms) ? saved.heirlooms.slice() : [],
        equipped: Array.isArray(saved.equipped) ? saved.equipped.filter(id => (saved.heirlooms || []).includes(id)).slice(0, 2) : [],
        records: {
          maxGeneration: Math.max(1, Number(saved.records && saved.records.maxGeneration) || 1),
          maxNetWorth: Math.max(0, Number(saved.records && saved.records.maxNetWorth) || 0),
        },
      };
    }
  } catch (error) { meta = freshMeta(); }
}

function saveMeta() {
  try { localStorage.setItem(META_SAVE_KEY, JSON.stringify(meta)); } catch (error) { /* 无存储权限时仍可本次游玩 */ }
}

function saveRun(phase) {
  if (!state.name) return;
  try {
    localStorage.setItem(RUN_SAVE_KEY, JSON.stringify({ version: 1, phase: phase || 'game', state }));
    updateContinueButton();
  } catch (error) { /* 无存储权限时不阻断游戏 */ }
}

function readRunSave() {
  try {
    const saved = JSON.parse(localStorage.getItem(RUN_SAVE_KEY) || 'null');
    return saved && saved.version === 1 && saved.state && saved.state.name ? saved : null;
  } catch (error) { return null; }
}

function clearRunSave() {
  try { localStorage.removeItem(RUN_SAVE_KEY); } catch (error) { /* ignore */ }
  updateContinueButton();
}

function updateContinueButton() {
  const button = $('btn-continue-game');
  if (!button) return;
  const saved = readRunSave();
  button.classList[saved ? 'remove' : 'add']('hidden');
  if (saved) button.textContent = `继续当前家族 · 第${saved.state.generation || 1}代 ${saved.state.age || 0}岁`; 
  const startButton = $('btn-start');
  if (startButton) startButton.textContent = saved ? '创建新家族' : '开启家族传奇';
}

function resumeRun() {
  const saved = readRunSave();
  if (!saved) return;
  Object.assign(state, saved.state);
  state.bg = BACKGROUNDS.find(item => item.id === (saved.state.bg && saved.state.bg.id)) || BACKGROUNDS[3];
  state.challenge = state.challenge || null;
  state.reunionsAttended = Array.isArray(state.reunionsAttended) ? state.reunionsAttended : [];
  state.records = state.records || { everDeepDebt: false, maxNetWorth: 0 };
  state.aspiration = state.aspiration || 'wealth';
  state.aspirationCompleted = Boolean(state.aspirationCompleted);
  state.routeProgress = state.routeProgress || {};
  state.traits = Array.isArray(state.traits) ? state.traits : [];
  state.lineage = Array.isArray(state.lineage) ? state.lineage : [];
  state.relatives = Array.isArray(state.relatives) ? state.relatives : [];
  state.lastFamilyEventAge = state.lastFamilyEventAge === undefined ? null : state.lastFamilyEventAge;
  buildStatsUI();
  if (saved.phase === 'inherit' && state.finalAge) {
    const inheritable = state.children.filter(child => state.finalAge - child.bornAge >= 0);
    if (inheritable.length) { showInheritScreen(inheritable); return; }
  }
  showScreen('game');
  enterStage();
}

/* ============================================================
   工具函数
   ============================================================ */
const $ = id => document.getElementById(id);
const clamp = v => Math.max(0, Math.min(100, Math.round(v)));
const clampMoney = v => Math.max(-99999999999, v);
const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
function pickN(arr, n) {
  const copy = [...arr]; const out = [];
  for (let i = 0; i < n && copy.length; i++) out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  return out;
}
function effHint(eff) {
  const parts = STAT_KEYS.filter(k => eff && eff[k]).map(k => `${STATS[k].ico}${eff[k] > 0 ? '+' : ''}${eff[k]}`);
  if (eff && eff.money) parts.push(`💰${eff.money > 0 ? '+' : ''}${fmtMoney(eff.money)}`);
  return parts.join('  ');
}
function fmtMoney(n) {
  if (Math.abs(n) >= 100000000) return (n/100000000).toFixed(2) + '亿';
  if (Math.abs(n) >= 10000)    return (n/10000).toFixed(1) + '万';
  return Math.round(n).toLocaleString();
}
function weightedPick(list) {
  const total = list.reduce((s, x) => s + x.weight, 0);
  let r = Math.random() * total;
  for (const x of list) { r -= x.weight; if (r <= 0) return x; }
  return list[list.length - 1];
}
let _gChildSeq = 1;
function genChildName(fatherName) {
  const family = fatherName[0] || '张';
  const given = ['明','华','强','丽','芳','杰','敏','俊','婷','超','娜','磊','欣','鑫','洋','雪','博','晨','妍','豪'];
  return family + pick(given);
}

/* ============================================================
   全局游戏状态（含家族）
   ============================================================ */
const state = {
  name: '', gender: 'male', bg: BACKGROUNDS[3],
  age: 0, stageIdx: 0, round: 0, month: 0,   // month: 0-11 当前月
  stats: { health: 50, intellect: 50, charm: 50, wealth: 50, happiness: 50 },
  money: 0,                    // 手头现金（个人，当前这一世赚到的，可花）
  job: { level: 0, salary: 0 },// 职业等级 & 基础年薪
  assets: [],                  // 家族资产ID列表（传承）
  assetMeta: {},               // 资产维护信息 {id:{boughtAge, yearsLeft}} yearsLeft=剩余寿命
  education: {                 // 教育经历
    kindergarten: null,        // 'normal'|'international'
    gaokaoScore: 0,            // 高考分数 0-750
    university: null,          // {name, tier} 1=顶尖 2=重点 3=普通 4=大专
    major: null,               // 专业名称
    master: null,              // 研究生院校 or null
    phd: null,                 // 博士院校 or null
  },
  allowance: 0,                // 年零花钱（未成年时根据家庭背景发放）
  affection: {},               // 追求对象好感度 {id:0-100}，每追一次加好感
  spouse: null,                // {id,name,avatar,age,trait,income,color,costPerYear}
  exSpouse: null,              // 前配偶（离婚后用于扣赡养费）{name,alimony,yearsLeft}
  children: [],                // [{id,name,avatar,gender,bornAge,ageAtDeath,color,order,initialStats}]
  generation: 1,               // 当前是第几代
  log: [],                     // [{age,text}]
  cause: '', finalAge: 0,
  yearReport: null,            // 上一年度结算摘要（用于故事显示）
  lastEconomyCreditAge: null,  // 防止同一年龄因弹窗/重绘重复发放收入
  _hasSpentInRound: false,     // 本轮是否已消费（保留兼容，已不再限制）
  pendingStory: '', careerPlan: null, lastBirthAge: null, lastActivityAge: null, assetReturns: {},
  challenge: null, challengeCooldownUntil: 18, reunionsAttended: [],
  aspiration: 'wealth', aspirationCompleted: false,
  routeProgress: {}, traits: [], lineage: [],
  relatives: [], lastFamilyEventAge: null,
  records: { everDeepDebt: false, maxNetWorth: 0 },
};

function achievementContext() {
  return {
    age: state.age, stats: state.stats, money: state.money, assets: state.assets,
    education: state.education, spouse: state.spouse, children: state.children,
    job: state.job, generation: state.generation, finalAge: state.finalAge,
    bg: state.bg, records: state.records, netWorth: getFamilyNetWorth(),
  };
}

function updateFamilyRecords() {
  if (!state.records) state.records = { everDeepDebt: false, maxNetWorth: 0 };
  if (state.money <= -100000) state.records.everDeepDebt = true;
  const currentNetWorth = getFamilyNetWorth();
  state.records.maxNetWorth = Math.max(state.records.maxNetWorth || 0, currentNetWorth);
  if (!meta.records) meta.records = { maxGeneration: 1, maxNetWorth: 0 };
  const previousGeneration = meta.records.maxGeneration;
  const previousNetWorth = meta.records.maxNetWorth;
  meta.records.maxGeneration = Math.max(meta.records.maxGeneration || 1, state.generation || 1);
  meta.records.maxNetWorth = Math.max(meta.records.maxNetWorth || 0, currentNetWorth);
  if (meta.records.maxGeneration !== previousGeneration || meta.records.maxNetWorth !== previousNetWorth) saveMeta();
}

function updateReputationUI() {
  const badge = $('btn-achievements');
  if (badge) badge.textContent = `🏅 ${meta.reputation}`;
  updateLegacyPreview();
}

function updateLegacyPreview() {
  const preview = $('title-legacy-summary');
  if (!preview) return;
  const records = meta.records || { maxGeneration: 1, maxNetWorth: 0 };
  preview.innerHTML = `<span>🏅 声望 ${meta.reputation}</span><span>🏆 成就 ${meta.unlocked.length}/${ACHIEVEMENTS.length}</span><span>🏺 传家宝 ${meta.heirlooms.length}/${HEIRLOOMS.length} · 装备${meta.equipped.length}/2</span><span>📜 最高第${records.maxGeneration}代</span>`;
}

function evaluateAchievements(announce) {
  updateFamilyRecords();
  const ctx = achievementContext();
  const unlockedNow = [];
  ACHIEVEMENTS.forEach(item => {
    if (meta.unlocked.includes(item.id) || !item.check(ctx)) return;
    meta.unlocked.push(item.id);
    meta.reputation += item.reward;
    unlockedNow.push(item);
  });
  if (unlockedNow.length) {
    saveMeta();
    updateReputationUI();
    if (announce) {
      const message = unlockedNow.map(item => `🏆 ${item.name}（声望 +${item.reward}）`).join('<br>');
      alertTip(`解锁成就！<br>${message}`);
    }
  }
  return unlockedNow;
}

function aspirationProgress() {
  const item = ASPIRATIONS.find(entry => entry.id === state.aspiration) || ASPIRATIONS[0];
  const value = Number(item.value()) || 0;
  return { item, value, done: value >= item.target };
}

function aspirationProgressText(progress) {
  if (progress.item.id === 'wealth') return `${fmtMoney(progress.value)} / ${fmtMoney(progress.item.target)}`;
  if (progress.item.id === 'scholar') return progress.done ? '目标达成' : '需要智力90及重点大学';
  return `${Math.min(progress.value, progress.item.target)} / ${progress.item.target}`;
}

function evaluateAspiration() {
  if (state.aspirationCompleted) return false;
  const progress = aspirationProgress();
  if (!progress.done) return false;
  state.aspirationCompleted = true;
  meta.reputation += progress.item.reward;
  saveMeta();
  updateReputationUI();
  state.log.push({ age: state.age, text: `${progress.item.icon} 完成家族愿望「${progress.item.name}」，获得${progress.item.reward}声望。` });
  state.pendingStory = `${progress.item.icon} 家族愿望「${progress.item.name}」达成，声望 +${progress.item.reward}！ ` + (state.pendingStory || '');
  return true;
}

function updateAspirationUI() {
  const box = $('aspiration-info');
  if (!box) return;
  const progress = aspirationProgress();
  box.textContent = state.aspirationCompleted
    ? `${progress.item.icon} ${progress.item.name} · 已完成`
    : `${progress.item.icon} ${progress.item.name} · ${aspirationProgressText(progress)}`;
}

/* ============================================================
   屏幕切换
   ============================================================ */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $('screen-' + id).classList.add('active');
  window.scrollTo(0, 0);
}

/* ============================================================
   初始化 / 绑定
   ============================================================ */
function init() {
  loadMeta();
  updateReputationUI();
  drawCharacter($('title-char'), 'adult', 'male');
  updateContinueButton();
  $('btn-continue-game').onclick = resumeRun;
  $('btn-start').onclick = () => { resetAll(); showScreen('create'); renderCreate(); };
  $('btn-legacy').onclick = () => openModal('legacy');
  $('btn-begin').onclick = beginLife;
  $('btn-restart').onclick = () => { clearRunSave(); resetAll(); showScreen('create'); renderCreate(); };
  $('btn-inherit-new').onclick = () => { clearRunSave(); resetAll(); showScreen('create'); renderCreate(); };

  document.querySelectorAll('.seg-btn').forEach(b => {
    b.onclick = () => {
      document.querySelectorAll('.seg-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      state.gender = b.dataset.gender;
    };
  });

  // 商城/活动/育儿按钮
  $('btn-shop').onclick     = () => openModal('shop');
  $('btn-activity').onclick = () => openModal('activity');
  $('btn-marriage').onclick = () => openModal('marriage');
  $('btn-family').onclick = () => openModal('family');
  $('btn-achievements').onclick = () => openModal('achievements');
  $('modal-close').onclick  = () => { if (!state.requiredModal) $('modal').classList.add('hidden'); };
  $('modal').querySelector('.modal-mask').onclick = () => { if (!state.requiredModal) $('modal').classList.add('hidden'); };

  // 继续按钮（按月推进）
  $('btn-continue').onclick = () => restYear();
}

function resetAll() {
  Object.assign(state, {
    name: '', gender: 'male', bg: BACKGROUNDS[3],
    age: 0, stageIdx: 0, round: 0, month: 0,
    stats: { health: 50, intellect: 50, charm: 50, wealth: 50, happiness: 50 },
    money: 0, job: { level: 0, salary: 0 }, assets: [], assetMeta: {},
    education: { kindergarten: null, gaokaoScore: 0, university: null, major: null, master: null, phd: null },
    allowance: 0, affection: {},
    spouse: null, exSpouse: null, children: [],
    generation: 1, log: [], cause: '', finalAge: 0, yearReport: null, lastEconomyCreditAge: null,
    _hasSpentInRound: false, pendingStory: '', careerPlan: null, lastBirthAge: null, lastActivityAge: null, assetReturns: {},
    challenge: null, challengeCooldownUntil: 18, reunionsAttended: [],
    aspiration: 'wealth', aspirationCompleted: false,
    routeProgress: {}, traits: [], lineage: [],
    relatives: [], lastFamilyEventAge: null,
    records: { everDeepDebt: false, maxNetWorth: 0 },
    requiredModal: false, _pendingGaokao: false,
  });
  _gChildSeq = 1;
}

/* ---------- 创建角色 ---------- */
function renderCreate() {
  $('input-name').value = '';
  state.bg = BACKGROUNDS[3];
  state.aspiration = 'wealth';
  state.aspirationCompleted = false;
  const wrap = $('bg-cards');
  wrap.innerHTML = '';
  BACKGROUNDS.forEach(bg => {
    const card = document.createElement('div');
    card.className = 'bg-card' + (bg.id === state.bg.id ? ' active' : '');
    card.innerHTML = `<div class="bg-name">${bg.name}</div>
      <div class="bg-desc">${bg.desc}<br>
        <span style="color:var(--we);font-weight:bold;">💰 初始 ${fmtMoney(bg.money||0)}</span>
      </div>`;
    card.onclick = () => {
      state.bg = bg;
      document.querySelectorAll('.bg-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    };
    wrap.appendChild(card);
  });
  const aspirationWrap = $('aspiration-cards');
  aspirationWrap.innerHTML = '';
  ASPIRATIONS.forEach(item => {
    const card = document.createElement('div');
    card.className = 'aspiration-card' + (state.aspiration === item.id ? ' active' : '');
    card.innerHTML = `${item.icon} <b>${item.name}</b><small>${item.desc}｜奖励 🏅${item.reward}</small>`;
    card.onclick = () => {
      state.aspiration = item.id;
      document.querySelectorAll('.aspiration-card').forEach(node => node.classList.remove('active'));
      card.classList.add('active');
    };
    aspirationWrap.appendChild(card);
  });
}

/* ---------- 开启人生（或继承） ---------- */
function beginLife() {
  clearRunSave();
  if (state.generation === 1) {
    state.name = $('input-name').value.trim() || '无名氏';
  }
  STAT_KEYS.forEach(k => state.stats[k] = 50);
  if (state.generation === 1) {
    applyBgEffect(state.bg);
    state.money = state.bg.money || 0;
  }
  state.age = 0; state.stageIdx = 0; state.round = 0; state.month = 0;
  state.log = []; state.cause = ''; state.yearReport = null; state._hasSpentInRound = false;
  const aspiration = ASPIRATIONS.find(item => item.id === state.aspiration);
  if (aspiration) state.log.push({ age: 0, text: `${aspiration.icon} 家族愿望：${aspiration.name}（${aspiration.desc}）。` });
  // 计算初始零花钱（基于家庭背景）
  state.allowance = computeAllowance();
  buildStatsUI();
  showScreen('game');
  enterStage();
}
function applyBgEffect(bg) {
  Object.entries(bg.eff).forEach(([k, v]) => state.stats[k] = clamp(state.stats[k] + v));
}

/* ============================================================
   阶段 / 回合
   ============================================================ */
function enterStage() {
  const stage = STAGES[state.stageIdx];
  state.round = 0;
  // 年龄由开局、继承与年度推进决定，阶段只负责展示。
  state.month = 0;
  drawCharacter($('avatar'), stage.sprite, state.gender);
  $('stage-name').textContent = stage.name;
  updateTopbar();
  updateEcoButtons();
  buildStatsUI();
  renderAssets();
  renderFamily();
  renderJob();

  // 阶段触发器：幼儿园选择 / 大学报考 / 深造门
  if (stage.kgChoice && !state.education.kindergarten) {
    showKindergartenChoice();
    return;
  }
  if (stage.admission && !state.education.university) {
    showUniversityAdmission();
    return;
  }
  if (stage.eduGate && state.education[stage.eduGate] === null) {
    showEduGate(stage.eduGate);
    return;
  }
  if (['youth', 'adult', 'elder'].includes(stage.id) && !state.job.type) {
    showJobPicker();
    return;
  }
  presentMonth();
}

function updateTopbar() {
  const stage = STAGES[state.stageIdx];
  $('g-gen').textContent = `第${state.generation}代`;
  $('g-name').textContent = state.name;
  $('g-stage').textContent = stage.name;
  $('g-age').textContent = state.age;
  $('g-money').textContent = `💵 ${fmtMoney(state.money)}`;
  $('age-band').textContent = stage.id === 'elder' ? '61 岁起' : stage.id === 'youth' && state.generation > 1 ? '18 - 35 岁' : `${stage.ageStart} - ${stage.ageEnd} 岁`;
  evaluateAchievements(true);
  evaluateAspiration();
  updateAspirationUI();
  updateRouteUI();
  if (state.name && !state.finalAge) saveRun('game');
}

function updateEcoButtons() {
  const row = $('economy-row');
  const familyButton = $('btn-family');
  if (state.age >= 18) {
    row.classList.remove('hidden');
    const hasReunion = reunionAvailable();
    const hasChallenge = Boolean(state.challenge);
    const hasHandoff = eligibleHandoffChildren().length > 0;
    const canStartChallenge = !hasChallenge && state.age >= state.challengeCooldownUntil;
    familyButton.textContent = hasReunion ? '🎓 同学聚会！' : hasHandoff ? '🤝 可交接家主' : hasChallenge ? '🎯 挑战剩' + Math.max(0, state.challenge.deadline - state.age) + '年' : canStartChallenge ? '🎯 可接新挑战' : '🎯 年度玩法';
    familyButton.classList[hasReunion || hasHandoff || hasChallenge || canStartChallenge ? 'add' : 'remove']('has-notice');
  } else {
    row.classList.add('hidden');
    familyButton.classList.remove('has-notice');
  }
}

function renderJob() {
  const el = $('job-info');
  if (!el) return;
  if (state.age < 18 || !state.job.type) { el.textContent = '💼 暂无职业'; return; }
  const jobType = state.job.type || '通用职场';
  const career = CAREERS.find(c => c.id === jobType) || CAREERS[0];
  const lvl = Math.min(state.job.level, career.steps.length - 1);
  const title = lvl >= 1 ? career.steps[lvl - 1] : '应届生';
  el.textContent = `💼 ${title}｜月薪 ${fmtMoney(Math.round(computeMonthlySalary()))}`;
}

/* 每个年龄只发放一次年度收入，供页面重绘安全调用。 */
function creditYearlyEconomy() {
  if (state.lastEconomyCreditAge !== state.age) {
    state.lastEconomyCreditAge = state.age;
    const yearlyAllow = state.age < 18 ? state.allowance : 0;
    if (yearlyAllow > 0) {
      state.money = clampMoney(state.money + yearlyAllow);
      showMoneyFloat(yearlyAllow);
    }
    if (state.age >= 18) {
      const inc = getYearlyIncome();
      const yearlyIncome = Math.round(inc.salary + inc.assetMoney);
      if (yearlyIncome !== 0) {
        state.money = clampMoney(state.money + yearlyIncome);
        if (yearlyIncome > 0) showMoneyFloat(yearlyIncome);
      }
      if (state.spouse && state.spouse.income > 0) {
        state.money = clampMoney(state.money + state.spouse.income);
      }
    }
  }
  state.stats.wealth = clamp(moneyToStat(state.money));
}

/* ---------- 呈现一年 ---------- */
function presentMonth() {
  const stage = STAGES[state.stageIdx];
  state._hasSpentInRound = false;
  updateEcoButtons();
  creditYearlyEconomy();

  // 年度随机小事件（概率 25%）
  let eventHTML = '';
  const stageEvs = stage.pool;   // 阶段选项池作为"年度级大选项"
  const monthEvs = filterEventsByAge(state.age);
  if (Math.random() < 0.25 && monthEvs.length > 0) {
    const ev = pick(monthEvs);
    if (ev.eff) applyEffects(ev.eff);
    if (ev.money) {
      state.money = clampMoney(state.money + ev.money);
      showMoneyFloat(ev.money);
    }
    state.stats.wealth = clamp(moneyToStat(state.money));
    state.log.push({ age: state.age, text: `【${ev.name}】${ev.desc}` });
    eventHTML = `<br><br><span class="event-tag">${ev.name}</span>${ev.desc}`;
    if (ev.money) eventHTML += `（💰${ev.money > 0 ? '+' : ''}${fmtMoney(ev.money)}）`;
  }

  const healthWarning = state.stats.health < 15
    ? '<br><span class="event-tag">健康告急</span>优先休息或调养身体。'
    : state.stats.health < 30
      ? '<br><span class="event-tag">身体不适</span>继续透支可能结束本代人生。'
      : '';
  const yearIntro = `<span class="year-settle">🌟 ${state.age} 岁 · ${stage.name}</span>${healthWarning}${state.round === 0 ? stage.intro + '<br>' : ''}`;
  const annualNotice = reunionAvailable()
    ? '<br><span class="event-tag">同学聚会</span>今年有节点聚会，前往“年度玩法”参加。'
    : eligibleHandoffChildren().length
      ? '<br><span class="event-tag">家主交接</span>已有成年子女可以接任家主。'
    : state.challenge
      ? `<br><span class="event-tag">挑战进行中</span>${state.challenge.name}还剩${Math.max(0, state.challenge.deadline - state.age)}年。`
      : '';

  // 每年提供阶段方向和一项日常活动。
  const monthChoices = filterChoicesByAge(state.age);
  const choices = state.round % 3 === 0
    ? [...pickN(stageEvs, 2), ...pickN(monthChoices, 1)]
    : pickN(monthChoices, 3);
  if (state.stats.health < 30 && !choices.some(choice => choice.eff && choice.eff.health > 0)) {
    choices[choices.length - 1] = Object.assign({}, RECOVERY_CHOICE, { eff: Object.assign({}, RECOVERY_CHOICE.eff) });
  }

  const cw = $('choices');
  cw.innerHTML = '';
  choices.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    const extra = [];
    if (c.money) extra.push(`💰${c.money > 0 ? '+' : ''}${fmtMoney(c.money)}`);
    extra.push(effHint(c.eff || {}));
    btn.innerHTML = `<span>${c.text}<div class="choice-ef">${extra.filter(Boolean).join('  ')}</div></span><span class="choice-arr">▶</span>`;
    btn.onclick = () => makeChoice(c);
    cw.appendChild(btn);
  });

  // 月份+标题
  const previous = state.pendingStory ? `<div class="previous-choice">上年选择：${state.pendingStory}</div>` : '';
  state.pendingStory = '';
  $('story-text').innerHTML = `${previous}${yearIntro}${annualNotice}📅 ${state.age} 岁${eventHTML}`;

  updateTopbar();
  updateStats();
  renderAssets();
  renderFamily();
  renderJob();
}

/* ---------- 年度结算：收入 + 家庭开支 ---------- */
function settleExtendedFamily() {
  if (!Array.isArray(state.relatives) || state.lastFamilyEventAge === state.age) return { cost: 0, note: '' };
  state.lastFamilyEventAge = state.age;
  let cost = 0;
  let note = '';
  const living = state.relatives.filter(person => person.alive !== false);
  living.forEach(person => {
    person.age = Math.max(0, Number(person.age) || 0) + 1;
    if (person.kind === 'elder') {
      cost += person.annualCost || 0;
      if (person.age >= 78 && Math.random() < Math.min(0.3, (person.age - 76) * 0.02)) {
        person.alive = false;
        state.stats.happiness = clamp(state.stats.happiness - 5);
        state.log.push({ age: state.age, text: `🕯️ 家中长辈${person.name}离世，享年${person.age}岁。` });
        note = `${person.name}在这一年离世。`;
      }
    }
  });
  const branches = living.filter(person => person.kind === 'branch');
  if (branches.length && Math.random() < 0.14) {
    const branch = pick(branches);
    if ((branch.fortune || 0) >= 0) {
      const gift = Math.min(20000, 5000 + Math.round((branch.income || 60000) * 0.08));
      state.money = clampMoney(state.money + gift);
      state.log.push({ age: state.age, text: `🤝 家族支系${branch.name}事业顺利，给家里送来${fmtMoney(gift)}。` });
      note = `${branch.name}支援家族 ${fmtMoney(gift)}。`;
    } else {
      const help = Math.min(Math.max(0, state.money), 8000);
      cost += help;
      state.log.push({ age: state.age, text: `🫶 家族支系${branch.name}遇到困难，家里援助${fmtMoney(help)}。` });
      note = `家族援助了${branch.name}。`;
    }
  }
  return { cost, note };
}

function doYearlySettlement() {
  const inc = getYearlyIncome();
  // 工资、资产收益、零花钱、配偶收入已在年度回合开始时发放。
  // 年度结算仅扣除：家庭开支、维护费、报废、属性加成、职业升级
  state.allowance = computeAllowance();
  updateChildrenGrowth();

  // 家庭开支：配偶 + 孩子 + 前配偶赡养费
  let familyCost = 0;
  if (state.spouse) familyCost += state.spouse.costPerYear || 0;
  const childCostPer = 12000;
  state.children.forEach(c => {
    const ageNow = Math.max(0, state.age - c.bornAge);
    if (ageNow < 18) familyCost += childCostPer + ageNow * 2000;
  });
  if (state.traits && state.traits.includes('family')) familyCost = Math.round(familyCost * 0.9);
  // 前配偶赡养费（离婚后持续 18 年）
  if (state.exSpouse && state.exSpouse.yearsLeft > 0) {
    familyCost += state.exSpouse.alimony;
    state.exSpouse.yearsLeft--;
    if (state.exSpouse.yearsLeft <= 0) {
      state.log.push({ age: state.age, text: `✅ 给 ${state.exSpouse.name} 的赡养费已支付完毕，终于解脱了！` });
      state.exSpouse = null;
    }
  }
  const extendedFamily = settleExtendedFamily();
  familyCost += extendedFamily.cost;

  // 资产维护费 + 报废判定
  let maintCost = 0;
  const scrapped = [];
  state.assets.forEach(aid => {
    const it = SHOP_ITEMS.find(x => x.id === aid);
    if (!it || !it.lifespan) return;
    const assetLife = state.assetMeta[aid] || { boughtAge: state.age, yearsLeft: it.lifespan };
    assetLife.yearsLeft--;
    state.assetMeta[aid] = assetLife;
    if (it.maint) {
      const heirloomDiscount = meta.equipped.includes('deed') && it.cls === 'house' ? 0.9 : 1;
      maintCost += Math.round(it.maint * heirloomDiscount);
    }
    if (assetLife.yearsLeft <= 0) scrapped.push(it);
  });
  scrapped.forEach(it => {
    state.assets = state.assets.filter(x => x !== it.id);
    delete state.assetMeta[it.id];
    state.log.push({ age: state.age, text: `🏚️「${it.name}」已到达使用年限，报废处理！` });
  });
  familyCost += maintCost;

  // 仅扣年度总开支（其他已经按月入账）
  const oldMoney = state.money;
  state.money = clampMoney(state.money - familyCost);

  // 资产被动属性加成（仅年度一次）
  let assetBonus = '';
  const attrParts = [];
  STAT_KEYS.forEach(k => {
    if (inc.assetStat[k]) {
      state.stats[k] = clamp(state.stats[k] + inc.assetStat[k]);
      attrParts.push(`${STATS[k].ico}+${inc.assetStat[k]}`);
    }
  });
  if (attrParts.length) assetBonus = '资产加成：' + attrParts.join(' ');

  // 职业等级随年龄自然衰减
  if (state.age > 60 && state.job.level > 5 && state.job.type) state.job.level--;

  // 年龄衰减：年轻阶段不固定扣属性，30 岁后逐步增加。
  // 不衰减 wealth（wealth 基于金钱，只有事件/收支影响）
  let decay = 0;
  if (state.age >= 30) decay = 1;
  if (state.age >= 50) decay = 2;
  if (state.age >= 65) decay = 3;
  ['health', 'intellect', 'charm', 'happiness'].forEach(k => {
    const actualDecay = k === 'health' && state.traits && state.traits.includes('athlete') ? Math.max(0, decay - 1) : decay;
    state.stats[k] = clamp(state.stats[k] - actualDecay);
  });

  // 负债风险
  let hint = '';
  if (state.money < -500000) {
    hint = '⚠️ 欠债太多！健康与心情暴跌。';
    state.stats.health = clamp(state.stats.health - 5);
    state.stats.happiness = clamp(state.stats.happiness - 8);
  }

  // 心情：财富加成
  if (state.money > 5000000)  state.stats.happiness = clamp(state.stats.happiness + 2);
  if (state.money > 10000000) state.stats.happiness = clamp(state.stats.happiness + 1);

  // 更新 wealth 条（基于当前 money 映射）
  state.stats.wealth = clamp(moneyToStat(state.money));
  evaluateFamilyChallenge();

  // 顶栏浮动
  if (state.money - oldMoney !== 0) showMoneyFloat(state.money - oldMoney);

  return {
    incomeDiff: 0,   // 不再叠加年收入（已按月发）
    familyCost,
    maintCost,
    allowance: state.allowance,
    scrapped: scrapped.length,
    assetBonus,
    hint,
    familyNote: extendedFamily.note,
  };
}

/* 将实际金钱映射到 0-100 的 wealth 条 */
function moneyToStat(m) {
  if (m <= 0) return 5;
  if (m <= 10000)      return 10 + Math.floor(m/1000);
  if (m <= 100000)     return 20 + Math.floor((m-10000)/10000);
  if (m <= 1000000)    return 30 + Math.floor((m-100000)/100000);
  if (m <= 10000000)   return 45 + Math.floor((m-1000000)/1000000);
  if (m <= 100000000)  return 65 + Math.floor((m-10000000)/5000000);
  return Math.min(100, 85 + Math.floor((m-100000000)/50000000));
}

/* 计算年度收入 */
function getYearlyIncome() {
  // 年度汇总：月工资×12，但工资已经按月入账到 state.money
  // 这里仅用于资产面板展示 / 资产收益 / 年度结算的统计值
  // 实际"家庭开支/维护费"在结算时从手头现金扣除（不重复扣工资，已经月付过）
  const salary = (() => {
    if (state.age < 18) return 0;
    if (!state.job.type || state.job.level <= 0) {
      if (['high', 'college', 'master', 'phd'].includes(STAGES[state.stageIdx].id)) return 0;
      return 24000 + state.stats.charm * 200 + state.stats.intellect * 300;
    }
    return computeMonthlySalary() * 12;
  })();

  let assetMoney = 0;
  const assetStat = { health: 0, intellect: 0, charm: 0, wealth: 0, happiness: 0 };
  state.assets.forEach(aid => {
    const it = SHOP_ITEMS.find(x => x.id === aid);
    if (!it) return;
    if (it.yearlyMoney) {
      let v = it.yearlyMoney;
      if (it.volatile) {
        const key = `${state.age}:${aid}`;
        if (state.assetReturns[key] === undefined) state.assetReturns[key] = Math.round(v * (0.5 + Math.random()));
        v = state.assetReturns[key];
      }
      if (state.traits && state.traits.includes('entrepreneur') && it.cls === 'biz') v = Math.round(v * 1.1);
      assetMoney += v;
    }
    if (it.income) Object.entries(it.income).forEach(([k, v]) => assetStat[k] += v);
  });

  // 未成年/有孩子：配偶的孩子抚养补贴
  return { salary, assetMoney, assetStat };
}

/* ---------- 做出选择 ---------- */
function makeChoice(choice) {
  const stage = STAGES[state.stageIdx];

  if (choice.autoMarry && !state.spouse && !getAutoMarriageCandidate()) {
    alertTip('暂时没有满足条件且付得起婚礼的对象。');
    return;
  }
  if (choice.autoBaby && !canHaveChild()) {
    alertTip('目前不满足生育条件，或生育费用不足。');
    return;
  }

  if (choice.eff) applyEffects(choice.eff);
  if (choice.money) {
    state.money = clampMoney(state.money + choice.money);
    showMoneyFloat(choice.money);
    state.stats.wealth = clamp(moneyToStat(state.money));
  }
  if (choice.jobBoost) state.job.level = Math.min(10, state.job.level + choice.jobBoost);

  // 自动结婚 / 生子
  if (choice.autoMarry && !state.spouse && state.age >= 20) {
    autoMarry();
  }
  if (choice.autoBaby && state.spouse) {
    for (let i = 0; i < (choice.autoBaby||1); i++) tryGiveBirth();
  }

  state.log.push({ age: state.age, text: choice.desc });

  let extra = '';
  const eventChance = stage.id === 'baby' ? 0.1 : 0.3;
  if (Math.random() < eventChance) {
    const ev = pick(filterEventsByAge(state.age));
    if (ev.eff) applyEffects(ev.eff);
    if (ev.money) {
      state.money = clampMoney(state.money + ev.money);
      showMoneyFloat(ev.money);
    }
    state.stats.wealth = clamp(moneyToStat(state.money));
    state.log.push({ age: state.age, text: `【${ev.name}】${ev.desc}` });
    extra = `<br><br><span class="event-tag">${ev.name}</span>${ev.desc}`;
    if (ev.money) extra += `（💰${ev.money > 0 ? '+' : ''}${fmtMoney(ev.money)}）`;
  }

  const unlockedTrait = recordChoiceRoute(choice);
  if (unlockedTrait) extra += `<br><br><span class="event-tag">形成特质</span>${unlockedTrait.icon}${unlockedTrait.name}：${unlockedTrait.desc}`;
  state.pendingStory = choice.desc + extra;
  onContinue();
}

function onContinue() {
  if (state.requiredModal) return;
  if (state.stats.health <= 0) return endLife(false);
  state.month = 0;
  state.age++;
  state.round++;
  let settleHTML = '';
  {
    // 做年度结算
    const curStage = STAGES[state.stageIdx];
    if (curStage.id !== 'baby') {
      const rep = doYearlySettlement();
      settleHTML = `<br><br><span class="year-settle">📅 ${state.age - 1} → ${state.age} 岁 年度结算</span>`;
      const parts = [];
      if (rep.familyCost !== 0) parts.push(`各项开支<span class="money-loss">-${fmtMoney(rep.familyCost)}</span>`);
      if (rep.scrapped > 0) parts.push(`报废资产${rep.scrapped}项`);
      if (rep.assetBonus) parts.push(rep.assetBonus);
      if (rep.familyNote) parts.push(rep.familyNote);
      settleHTML += parts.length ? '：' + parts.join('，') + '。' : '：本年无额外开支。';
      if (rep.hint) settleHTML += ` ${rep.hint}`;
    }
    // 年度职业晋升概率
    if (state.age >= 22 && state.job.type && state.job.level > 0) {
      tryJobPromotion();
    }
    // 检查是否该切阶段
    const stage = STAGES[state.stageIdx];
    if (state.age > stage.ageEnd) {
      if (stage.id === 'elder' && state.age <= Math.min(100, 85 + Math.floor(state.stats.health / 10))) {
        presentMonth();
        return;
      }
      // 高中毕业触发高考
      if (stage.gaokao && state.education.gaokaoScore === 0) {
        // 先显示结算，再在"继续"时走高考
        state._pendingGaokao = true;
      }
      state.stageIdx++;
      if (state.stageIdx >= STAGES.length) return endLife(true);
      // enterStage() 会在 presentMonth 后由 stage.month===0 自动触发介绍
      const newStage = STAGES[state.stageIdx];
      state.age = Math.max(state.age, newStage.ageStart);
      state.round = 0;
      drawCharacter($('avatar'), newStage.sprite, state.gender);
      $('stage-name').textContent = newStage.name;
    }
  }
  state.allowance = computeAllowance();
  // 如果 _pendingGaokao 为真，触发高考
  if (state._pendingGaokao) {
    state._pendingGaokao = false;
    startGaokaoExam();
    return;
  }
  // 如果新阶段有触发器（幼儿园选择 / 大学报考 / 深造门）
  const newStage = STAGES[state.stageIdx];
  if (state.month === 0) {
    if (newStage.kgChoice && !state.education.kindergarten) { showKindergartenChoice(); return; }
    if (newStage.admission && !state.education.university) { showUniversityAdmission(); return; }
    if (newStage.eduGate && state.education[newStage.eduGate] === null) { showEduGate(newStage.eduGate); return; }
  }
  if (newStage.id === 'youth' && !state.job.type) {
    if (state.careerPlan) {
      startCareer(state.careerPlan);
    } else {
      showJobPicker();
      return;
    }
  }
  presentMonth();
  // 在故事文本后插入年度结算HTML
  if (settleHTML) {
    const st = $('story-text');
    st.innerHTML = settleHTML + '<br>' + st.innerHTML;
  }
}

function restYear() {
  if (state.requiredModal) return;
  applyEffects({ health: 8, happiness: 5 });
  state.log.push({ age: state.age, text: '你暂停追逐目标，认真休息和恢复。' });
  state.pendingStory = '你给自己留了一年喘息的时间，健康与心情有所恢复。';
  onContinue();
}

/* 高考完成后进入大学报考 */
function afterGaokao() {
  // onContinue 已把阶段推进至大学，这里只完成志愿流程。
  const ns = STAGES[state.stageIdx];
  state.round = 0;
  state.month = 0;
  drawCharacter($('avatar'), ns.sprite, state.gender);
  $('stage-name').textContent = ns.name;
  showUniversityAdmission();
}

/* 跳过深造直接工作：跳转到青年阶段 */
function skipToWork() {
  const youthIdx = STAGES.findIndex(s => s.id === 'youth');
  const ns = STAGES[youthIdx];
  state.stageIdx = youthIdx;
  state.age = Math.max(23, state.age);
  state.round = 0;
  state.month = 0;
  drawCharacter($('avatar'), ns.sprite, state.gender);
  $('stage-name').textContent = ns.name;
  // 到了工作阶段，首次弹职业选择
  if (!state.job.type && state.careerPlan) startCareer(state.careerPlan);
  if (!state.job.type) {
    showJobPicker();
    return;
  }
  presentMonth();
}

function startCareer(jobId) {
  const career = CAREERS.find(x => x.id === jobId);
  if (!career) return;
  state.job.type = jobId;
  state.job.level = 1;
  state.log.push({ age: state.age, text: `💼 入职「${career.name}」，成为${career.steps[0]}。` });
  renderJob();
}

/* ============================================================
   月度选项池：给每月选择的日常小事（按年龄段分组）
   每个选项用 minAge / maxAge 控制适用范围
   ============================================================ */
const MONTHLY_CHOICES = [
  /* === 婴儿期（0-2岁）10个 === */
  { text: '乖乖喝奶',     eff: { health: 2, happiness: 1 },              desc: '你大口大口喝奶，长得白白胖胖。',           minAge: 0, maxAge: 2 },
  { text: '安静睡觉',     eff: { health: 2, happiness: 1 },              desc: '你睡得很香，梦里笑出了声。',                minAge: 0, maxAge: 2 },
  { text: '玩摇铃玩具',   eff: { intellect: 2, happiness: 2 },           desc: '你被五颜六色的玩具吸引，玩得不亦乐乎。',    minAge: 0, maxAge: 2 },
  { text: '哭闹要抱抱',   eff: { happiness: 3, health: -1 },             desc: '你哇哇大哭，爸妈赶紧把你抱起来哄。',        minAge: 0, maxAge: 2 },
  { text: '听儿歌音乐',   eff: { intellect: 1, happiness: 3 },           desc: '优美的旋律让你手舞足蹈。',                  minAge: 0, maxAge: 2 },
  { text: '抓东西玩',     eff: { intellect: 2, charm: 1 },               desc: '你努力抓住眼前的东西，手眼协调越来越好。',  minAge: 0, maxAge: 2 },
  { text: '在地上爬',     eff: { health: 1, happiness: 2 },              desc: '你满地爬来爬去，探索着每个角落。',          minAge: 1, maxAge: 2 },
  { text: '被爸妈逗乐',   eff: { happiness: 4, charm: 2 },               desc: '爸妈做鬼脸逗你，你笑得合不拢嘴。',          minAge: 0, maxAge: 2 },
  { text: '在户外晒太阳', eff: { health: 3, happiness: 2 },               desc: '爸妈推着婴儿车带你出门晒太阳，暖洋洋的。',  minAge: 0, maxAge: 2 },
  { text: '发呆看天花板', eff: { happiness: 1, health: 1 },               desc: '你盯着天花板上的光影发呆，自得其乐。',      minAge: 0, maxAge: 2 },

  /* === 幼儿园期（3-5岁）10个 === */
  { text: '看动画片',     eff: { happiness: 3, intellect: 1 },           desc: '你最爱看动画片，咯咯笑个不停。',            minAge: 3, maxAge: 5 },
  { text: '玩积木拼图',   eff: { intellect: 3, happiness: 2 },           desc: '你搭出了一座小城堡！',                      minAge: 3, maxAge: 5 },
  { text: '乖乖午睡',     eff: { health: 2, happiness: 1 },              desc: '午睡醒来，下午精神满满。',                  minAge: 3, maxAge: 5 },
  { text: '吃零食点心',   eff: { happiness: 3, health: -1 },             desc: '偷偷多吃了几块饼干，开心但肚子有点疼。',    minAge: 3, maxAge: 5 },
  { text: '滑滑梯秋千',   eff: { health: 2, happiness: 3, charm: 1 },    desc: '在公园里玩得不亦乐乎，乐得咯咯笑。',        minAge: 3, maxAge: 5 },
  { text: '和小动物玩',   eff: { happiness: 3, charm: 2, health: 1 },    desc: '你追着小猫小狗跑，开心得不得了。',          minAge: 3, maxAge: 5 },
  { text: '画画涂鸦',     eff: { intellect: 2, charm: 1, happiness: 2 },  desc: '你在纸上画满了五颜六色的线条。',            minAge: 3, maxAge: 5 },
  { text: '听爸妈讲故事', eff: { intellect: 3, happiness: 2 },           desc: '爸妈给你讲绘本故事，你听得入迷。',          minAge: 3, maxAge: 5 },
  { text: '玩水玩沙子',   eff: { happiness: 4, health: 1 },               desc: '你在沙坑里堆沙堡，玩得满身是沙。',          minAge: 3, maxAge: 5 },
  { text: '跟爸妈出门',   eff: { charm: 2, happiness: 3, intellect: 1 },  desc: '跟爸妈去超市，看到了好多新鲜东西。',        minAge: 3, maxAge: 5 },

  /* === 小学期（6-12岁）12个 === */
  { text: '认真写作业',   eff: { intellect: 3, happiness: -1 },          desc: '认真完成作业，知识更扎实了。',              minAge: 6, maxAge: 12 },
  { text: '看课外书',     eff: { intellect: 2, happiness: 2 },           desc: '你在书里发现了新世界。',                    minAge: 6, maxAge: 12 },
  { text: '和小伙伴玩耍', eff: { charm: 2, happiness: 3, health: 1 },    desc: '和小伙伴一起追逐打闹，玩得满头大汗。',      minAge: 6, maxAge: 12 },
  { text: '帮做家务',     eff: { happiness: 2, intellect: 1 }, money: 200,  desc: '帮妈妈扫地，得到了夸奖和小奖励。',        minAge: 6, maxAge: 12 },
  { text: '上兴趣班',     eff: { charm: 2, intellect: 2 }, money: -300,   desc: '去兴趣班学习新技能。',                    minAge: 6, maxAge: 12 },
  { text: '踢球打篮球',   eff: { health: 3, charm: 2, happiness: 2 },    desc: '和小伙伴在操场上踢球，出了一身汗。',        minAge: 6, maxAge: 12 },
  { text: '玩电子游戏',   eff: { happiness: 3, intellect: -1, health: -1 }, desc: '和朋友一起打游戏，开心但费眼睛。',       minAge: 6, maxAge: 12 },
  { text: '骑自行车',     eff: { health: 2, charm: 1, happiness: 2 },      desc: '你骑着自行车在小区里兜风。',                minAge: 6, maxAge: 12 },
  { text: '收集卡片贴纸', eff: { happiness: 3, charm: 2 },                desc: '你和小伙伴交换卡片，集齐了一套！',          minAge: 6, maxAge: 12 },
  { text: '观察小动物',   eff: { intellect: 2, happiness: 2 },            desc: '你蹲在地上看蚂蚁搬家，好奇极了。',          minAge: 6, maxAge: 12 },
  { text: '帮老师做事',   eff: { charm: 2, intellect: 1, happiness: 1 },  desc: '你帮老师搬作业本，老师夸你懂事。',          minAge: 6, maxAge: 12 },
  { text: '发呆休息',     eff: { happiness: 2, health: 1 },               desc: '什么也不想干，就想躺着发呆。',              minAge: 6, maxAge: 12 },

  /* === 中学/高中期（13-17岁）12个 === */
  { text: '早起锻炼',     eff: { health: 2, happiness: 1 },               desc: '你慢跑半小时，心情舒畅。',                  minAge: 13, maxAge: 17 },
  { text: '看课外书',     eff: { intellect: 3, happiness: 1 },            desc: '充实自我，精神富足。',                      minAge: 13, maxAge: 17 },
  { text: '跟朋友小聚',   eff: { charm: 2, happiness: 2 }, money: -200,   desc: '和同学一起出去玩，增进感情。',              minAge: 13, maxAge: 17 },
  { text: '早睡养生',     eff: { health: 3, happiness: 1 },               desc: '睡眠充足，精神饱满。',                      minAge: 13, maxAge: 17 },
  { text: '沉迷游戏',     eff: { happiness: 4, intellect: -2, health: -2 }, money: -100, desc: '打了一整天游戏，爽但虚度了光阴。',   minAge: 13, maxAge: 17 },
  { text: '努力学习',     eff: { intellect: 4, happiness: -2, health: -1 }, desc: '利用碎片时间疯狂刷题。',                  minAge: 13, maxAge: 17 },
  { text: '打球运动',     eff: { health: 3, charm: 2, happiness: 2 },      desc: '约同学打篮球，出了身大汗，畅快！',          minAge: 13, maxAge: 17 },
  { text: '听音乐放松',   eff: { happiness: 3, intellect: 1, health: 1 },  desc: '戴上耳机，沉浸在自己的小世界里。',          minAge: 13, maxAge: 17 },
  { text: '逛街买东西',   eff: { happiness: 3, charm: 1 }, money: -800,    desc: '和朋友逛街，买了点小东西。',                minAge: 13, maxAge: 17 },
  { text: '看电影',       eff: { happiness: 3, intellect: 1 }, money: -100, desc: '看了一部好电影，回味无穷。',               minAge: 13, maxAge: 17 },
  { text: '参加社团',     eff: { charm: 2, intellect: 2, happiness: 2 },  desc: '在社团里结交了志同道合的朋友。',            minAge: 13, maxAge: 17 },
  { text: '课余休息',     eff: { happiness: 3, health: 2 },               desc: '什么也不想干，好好放松一下。',              minAge: 13, maxAge: 17 },

  /* === 成年期（18+）通用 14个 === */
  { text: '早起锻炼',     eff: { health: 2, happiness: 1 },               desc: '你慢跑半小时，心情舒畅。',                  minAge: 18 },
  { text: '点外卖刷剧',   eff: { happiness: 3, health: -1 }, money: -80,  desc: '爽了一整天，钱包-80。',                     minAge: 18 },
  { text: '看一本书',     eff: { intellect: 3 },                          desc: '充实自我，精神富足。',                      minAge: 18 },
  { text: '跟朋友小聚',   eff: { charm: 2, happiness: 2 }, money: -200,   desc: '吃喝玩乐增进感情。',                        minAge: 18 },
  { text: '打工/兼职',    eff: { health: -1 }, money: 1500,               desc: '周末去打零工，赚到了零花钱。',              minAge: 18 },
  { text: '早睡养生',     eff: { health: 3, happiness: 1 },               desc: '睡眠充足，皮肤都变好了。',                  minAge: 18 },
  { text: '逛街购物',     eff: { happiness: 3, charm: 2 }, money: -1500,  desc: '买了新衣服，心里美滋滋。',                  minAge: 18 },
  { text: '学习新技能',   eff: { intellect: 3, happiness: -1 },           desc: '利用碎片时间充电。',                        minAge: 18 },
  { text: '躺平休息',     eff: { happiness: 3, health: 1 },               desc: '什么都不想干，就想当咸鱼。',                minAge: 18 },
  { text: '投资理财',     eff: { intellect: 1 }, money: 500,              desc: '小赚了一笔基金收益。',                      minAge: 18 },
  { text: '相亲/社交',    eff: { charm: 2, happiness: 1 }, money: -500,   desc: '参加了一次联谊活动。',                      minAge: 18 },
  { text: '沉迷手机',     eff: { health: -1, happiness: 2, intellect: -2 }, desc: '时间刷没了，但多巴胺给足了。',            minAge: 18 },
  { text: '户外徒步',     eff: { health: 3, happiness: 2, charm: 1 },      desc: '你去郊外徒步，呼吸新鲜空气，放松身心。',    minAge: 18 },
  { text: '自己做顿饭',   eff: { health: 2, happiness: 2, intellect: 1 },  desc: '亲手做了顿美食，省钱又健康。',              minAge: 18 },
];

/* 按年龄过滤月度选项 */
function filterChoicesByAge(age) {
  return MONTHLY_CHOICES.filter(c => {
    if (c.minAge !== undefined && age < c.minAge) return false;
    if (c.maxAge !== undefined && age > c.maxAge) return false;
    return true;
  });
}

const RECOVERY_CHOICE = {
  text: '安心调养身体',
  desc: '你放慢生活节奏，认真休养了一年，身体逐渐恢复。',
  eff: { health: 12, happiness: 3 },
};

/* ============================================================
   职业系统：多条职业路径 + 晋升 + 行业属性
   ============================================================ */
const CAREERS = [
  { id: 'civil',    name: '公务员',   icon: '🏛️', ico:'🏛️',
    desc: '铁饭碗，收入稳定但涨幅慢，社会地位高。要求智力≥55',
    req: s => s.intellect >= 55,
    base: 5000, grow: 0.18,   // 月薪基数、每级增幅
    eff: { charm: 1, happiness: 0, intellect: 0 },
    steps: ['办事员', '科员', '副科级', '正科级', '副处长', '正处长', '副局长', '正局长', '副市长', '省长']
  },
  { id: 'it',       name: '互联网/程序员', icon: '💻', ico:'💻',
    desc: '钱多话少死的早，涨薪快但中年危机重。要求智力≥60',
    req: s => s.intellect >= 60,
    base: 10000, grow: 0.28,
    eff: { intellect: 2, health: -1 },
    steps: ['实习生', '初级开发', '高级开发', '技术专家', '技术主管', '架构师', '技术总监', 'CTO', '技术合伙人', '科技大佬']
  },
  { id: 'finance',  name: '金融', icon: '💰', ico:'💰',
    desc: '高薪高压，资源为王。要求智力≥65，魅力≥45',
    req: s => s.intellect >= 65 && s.charm >= 45,
    base: 12000, grow: 0.3,
    eff: { wealth: 1, happiness: -1 },
    steps: ['管培生', '分析师', '投资经理', '高级经理', '部门总监', '执行董事', '董事总经理', 'VP', '合伙人', '资本大鳄']
  },
  { id: 'doctor',   name: '医生', icon: '⚕️', ico:'⚕️',
    desc: '越老越吃香，学习期长，社会地位高。要求智力≥70',
    req: s => s.intellect >= 70,
    base: 7000, grow: 0.25,
    eff: { intellect: 2, health: -1, charm: 1 },
    steps: ['规培生', '住院医师', '主治医师', '副主任医师', '主任医师', '科室主任', '副院长', '院长', '医学教授', '国医大师']
  },
  { id: 'teacher',  name: '教师/教授', icon: '👨‍🏫', ico:'👨‍🏫',
    desc: '假期多，压力适中，桃李满天下。要求智力≥60',
    req: s => s.intellect >= 60,
    base: 6000, grow: 0.18,
    eff: { happiness: 1, intellect: 1, charm: 1 },
    steps: ['代课老师', '初中老师', '高中老师', '讲师', '副教授', '教授', '系主任', '院长', '副校长', '校长']
  },
  { id: 'art',      name: '艺术/网红', icon: '🎭', ico:'🎭',
    desc: '大起大落，颜值和魅力决定一切。要求魅力≥60',
    req: s => s.charm >= 60,
    base: 4000, grow: 0.4,
    eff: { charm: 2, happiness: 1 },
    steps: ['签约新人', '小网红', '三线艺人', '二线艺人', '一线艺人', '当红明星', '顶流巨星', '国民偶像', '艺术家', '时代传奇']
  },
  { id: 'generic',  name: '普通打工', icon: '🔨', ico:'🔨',
    desc: '没有特别门槛，努力即可。',
    req: s => true,
    base: 4000, grow: 0.15,
    eff: { health: -1 },
    steps: ['试用期', '正式员工', '老员工', '组长', '主管', '副经理', '经理', '高级经理', '总监', '大区总裁']
  },
];

/* 根据职业算月薪 */
function computeMonthlySalary() {
  if (state.age < 18 || !state.job.type || state.job.level <= 0) {
    if (state.age >= 18) {
      return 2000 + Math.round((state.stats.charm * 20 + state.stats.intellect * 30) / 12);
    }
    return 0;
  }
  const c = CAREERS.find(x => x.id === state.job.type) || CAREERS[CAREERS.length - 1];
  const level = Math.min(state.job.level, 10);
  const base = c.base * Math.pow(1 + c.grow, level - 1);
  const bonus = (state.stats.intellect * 80 + state.stats.charm * 40 + state.stats.health * 20) / 12;
  const traitMultiplier = state.traits && state.traits.includes('scholar') ? 1.08 : 1;
  return Math.round((base + bonus) * traitMultiplier);
}

/* 年度职业晋升尝试 */
function tryJobPromotion() {
  if (!state.job.type || state.job.level >= 10) return;
  const c = CAREERS.find(x => x.id === state.job.type) || CAREERS[CAREERS.length - 1];
  const level = state.job.level;
  let prob = 0.25 + (state.stats.intellect - 50) * 0.005 + (state.stats.charm - 50) * 0.003;
  if (level <= 3) prob += 0.1;
  if (level >= 8) prob -= 0.15;
  prob = Math.max(0.05, Math.min(0.7, prob));
  if (Math.random() < prob) {
    state.job.level++;
    applyEffects(c.eff || {});
    state.log.push({ age: state.age, text: `💼 晋升！${c.name} → 「${c.steps[state.job.level - 1]}」` });
  }
}

/* ---------- 职业选择弹窗 ---------- */
function showJobPicker(previewOnly = false) {
  state.requiredModal = true;
  $('modal').classList.remove('hidden');
  $('modal-title').textContent = previewOnly ? '🎯 大 学 · 职 业 规 划' : '💼 选 择 你 的 职 业 生 涯';
  const body = $('modal-body');
  const s = state.stats;
  let html = `<div style="font-size:14px;color:var(--wood-dark);margin-bottom:12px;">
    当前属性：🧠${s.intellect}  💖${s.charm}  💪${s.health}
    ${previewOnly ? '｜先选择职业方向，正式入职时间会在毕业后。' : '｜请选择职业方向。'}
    </div>`;
  CAREERS.forEach(c => {
    const ok = c.req(s);
    // 名校优先录取（tier<=2）可提升金融/IT适配
    let extra = '';
    if (state.education.university && state.education.university.tier <= 2 && (c.id === 'finance' || c.id === 'it')) {
      extra = '<span style="color:var(--grass-2);">（名校优先）</span>';
    }
    html += `<div class="edu-choice-card ${ok ? '' : 'disabled'}" data-job="${c.id}" style="margin-top:8px;">
      <div class="ecc-top"><span class="ecc-ico">${c.ico}</span>
        <span class="ecc-name">${c.name}</span>
        <span class="ecc-tag">起薪${fmtMoney(c.base)}/月</span>
      </div>
      <div class="ecc-desc">${c.desc}${extra}</div>
    </div>`;
  });
  html += `<div style="margin-top:10px;text-align:center;">
    <button class="pixel-btn" id="btn-job-later" ${previewOnly?'':'disabled'} style="opacity:${previewOnly?'1':'.3'};">${previewOnly ? '暂不选择，大四再说' : ''}</button></div>`;
  body.innerHTML = html;

  body.querySelectorAll('.edu-choice-card[data-job]').forEach(card => {
    if (card.classList.contains('disabled')) return;
    card.onclick = () => {
      const jobId = card.dataset.job;
      const career = CAREERS.find(x => x.id === jobId);
      if (previewOnly) {
        state.careerPlan = jobId;
        state.log.push({ age: state.age, text: `🎯 计划毕业后从事「${career.name}」。` });
      } else {
        startCareer(jobId);
      }
      state.requiredModal = false;
      $('modal').classList.add('hidden');
      updateTopbar(); updateStats(); renderJob();
      presentMonth();
    };
  });
  const laterBtn = $('btn-job-later');
  if (laterBtn && previewOnly) laterBtn.onclick = () => { $('modal').classList.add('hidden'); state.requiredModal = false; presentMonth(); };
}

/* ============================================================
   教育系统：零花钱 / 幼儿园 / 高考 / 大学报考 / 深造门
   ============================================================ */

/* 零花钱：6 岁起按年龄与家庭背景发放，金额是个人可支配现金 */
function computeAllowance() {
  if (state.age < 6 || state.age >= 18) return 0;
  const bg = state.bg.id;
  const ageBase = state.age <= 12 ? 300 : state.age <= 15 ? 800 : 1800;
  const bgMultiplier = { rich: 10, scholar: 2, sport: 2, normal: 1, orphan: 0.3 }[bg] || 1;
  let base = ageBase * bgMultiplier;
  // 只给青少年少量家境加成，避免把家族资产直接变成孩子现金。
  if (state.age >= 13) {
    const familyNetWorth = getFamilyNetWorth();
    if (familyNetWorth >= 10000000) base += 3000;
    else if (familyNetWorth >= 3000000) base += 1500;
    else if (familyNetWorth >= 500000) base += 500;
  }
  // 如果有兄弟姐妹，被平分一点
  const siblings = Math.max(0, state.children.length - 1);
  const div = 1 + siblings * 0.15;
  return Math.max(0, Math.round(base / div));
}

/* ---------- 幼儿园选择 ---------- */
function showKindergartenChoice() {
  state.requiredModal = true;
  const familyWealth = getFamilyNetWorth();
  const canIntl = familyWealth >= 30000;
  $('modal').classList.remove('hidden');
  $('modal-title').textContent = '🏫 选 择 幼 儿 园';
  $('modal-body').innerHTML = `
    <div style="font-size:15px;line-height:1.7;margin-bottom:14px;">
      到了上幼儿园的年纪！父母为你挑选合适的幼儿园。<br>
      当前家族资产：<b style="color:var(--we);">${fmtMoney(familyWealth)}</b>
    </div>
    <div class="edu-choice-card" data-kg="normal" style="background:var(--parchment-light);border:3px solid var(--grass-2);">
      <div class="ecc-top"><span class="ecc-ico">🏫</span><span class="ecc-name">普通公立幼儿园</span></div>
      <div class="ecc-desc">免费入学，温馨平凡。智力+3，心情+3。</div>
    </div>
    <div class="edu-choice-card ${canIntl ? '' : 'disabled'}" data-kg="international" style="background:#fff4c4;border:3px solid var(--gold);margin-top:10px;">
      <div class="ecc-top"><span class="ecc-ico">🌟</span><span class="ecc-name">国际双语幼儿园</span></div>
      <div class="ecc-desc">${canIntl ? '需家族资产 ≥ 3万。智力+6，魅力+4，心情+4，但花费1万。' : '🔒 需家族资产 ≥ 3万（当前不足）'}</div>
    </div>`;
  $('modal-body').querySelectorAll('.edu-choice-card').forEach(card => {
    if (card.classList.contains('disabled')) return;
    card.onclick = () => {
      const kg = card.dataset.kg;
      state.education.kindergarten = kg;
      if (kg === 'international') {
        state.money = clampMoney(state.money - 10000);
        showMoneyFloat(-10000);
        applyEffects({ intellect: 6, charm: 4, happiness: 4 });
        state.log.push({ age: state.age, text: '🏫 入读国际双语幼儿园，花费1万，赢在起跑线！' });
      } else {
        applyEffects({ intellect: 3, happiness: 3 });
        state.log.push({ age: state.age, text: '🏫 入读普通公立幼儿园，快乐童年。' });
      }
      $('modal').classList.add('hidden');
      state.requiredModal = false;
      updateTopbar(); updateStats(); renderAssets();
      presentMonth();
    };
  });
}

/* ---------- 高考题库 ---------- */
// 难度：easy(智力高) / hard(智力低)。10题，每题75分。
const GAOKAO_QUESTIONS = {
  easy: [
    { q: '1+1等于几？', opts: ['1', '2', '3', '4'], ans: 1 },
    { q: '太阳从哪个方向升起？', opts: ['西', '东', '南', '北'], ans: 1 },
    { q: '"床前明月光"的作者是？', opts: ['杜甫', '李白', '白居易', '王维'], ans: 1 },
    { q: '一年有多少个月？', opts: ['10', '11', '12', '13'], ans: 2 },
    { q: '中国的首都是？', opts: ['上海', '广州', '北京', '深圳'], ans: 2 },
    { q: '水在几度结冰？', opts: ['0℃', '10℃', '20℃', '100℃'], ans: 0 },
    { q: '彩虹有几种颜色？', opts: ['5', '6', '7', '8'], ans: 2 },
    { q: '"锄禾日当午"下一句？', opts: ['汗滴禾下土', '春种一粒粟', '谁知盘中餐', '粒粒皆辛苦'], ans: 0 },
    { q: '三角形内角和是？', opts: ['90°', '180°', '270°', '360°'], ans: 1 },
    { q: '一周有几天？', opts: ['5', '6', '7', '8'], ans: 2 },
    { q: '光速大约是？', opts: ['30万km/s', '3万km/s', '300km/s', '3km/s'], ans: 0 },
    { q: '世界最高峰是？', opts: ['乞力马扎罗', '珠穆朗玛', '乔戈里', '干城章嘉'], ans: 1 },
  ],
  hard: [
    { q: 'sin30° + cos60° = ?', opts: ['0.5', '1', '1.5', '2'], ans: 1 },
    { q: '牛顿第二定律 F=?', opts: ['mv', 'ma', 'm/v', 'm+a'], ans: 1 },
    { q: '《红楼梦》的作者是？', opts: ['罗贯中', '施耐庵', '曹雪芹', '吴承恩'], ans: 2 },
    { q: 'DNA的双螺旋结构由谁发现？', opts: ['孟德尔', '达尔文', '沃森和克里克', '巴斯德'], ans: 2 },
    { q: '勾股定理 a²+b²=?', opts: ['c', 'c²', '2c', 'c³'], ans: 1 },
    { q: '经济学术语"边际成本"指？', opts: ['总成本', '平均成本', '多生产一单位的成本', '固定成本'], ans: 2 },
    { q: '化学反应中"氧化"是失去什么？', opts: ['中子', '电子', '质子', '原子核'], ans: 1 },
    { q: '唐朝开国皇帝是？', opts: ['李世民', '李渊', '李治', '武则天'], ans: 1 },
    { q: 'log₁₀(100) = ?', opts: ['1', '2', '10', '100'], ans: 1 },
    { q: '光合作用产生什么气体？', opts: ['二氧化碳', '氧气', '氮气', '氢气'], ans: 1 },
    { q: '《资本论》的作者是？', opts: ['亚当·斯密', '马克思', '凯恩斯', '恩格斯'], ans: 1 },
    { q: '相对论由谁提出？', opts: ['牛顿', '爱因斯坦', '霍金', '伽利略'], ans: 1 },
  ],
};

let _gaokaoState = null;  // {questions:[], idx:0, correct:0}

function startGaokaoExam() {
  state.requiredModal = true;
  // 根据智力分发难度：智力越高，简单题越多
  const iq = state.stats.intellect;
  const easyCount = Math.round((iq / 100) * 8);   // 0-8 简单题
  const hardCount = 10 - easyCount;                // 剩余难题
  const easyQs = shuffle(GAOKAO_QUESTIONS.easy.slice()).slice(0, easyCount);
  const hardQs = shuffle(GAOKAO_QUESTIONS.hard.slice()).slice(0, hardCount);
  const questions = shuffle([...easyQs, ...hardQs]);
  _gaokaoState = { questions, idx: 0, correct: 0 };

  $('modal').classList.remove('hidden');
  $('modal-title').textContent = '📝 高 考 考 试';
  renderGaokaoQuestion();
}

function renderGaokaoQuestion() {
  const st = _gaokaoState;
  if (!st) return;
  const q = st.questions[st.idx];
  const body = $('modal-body');
  body.innerHTML = `
    <div style="text-align:center;font-size:14px;color:var(--wood-light);margin-bottom:10px;">
      第 ${st.idx + 1} / ${st.questions.length} 题 ｜ 已答对 ${st.correct} 题
    </div>
    <div style="background:var(--parchment-light);border:3px solid var(--wood);border-radius:4px;padding:16px;margin-bottom:14px;font-size:18px;text-align:center;">
      ${q.q}
    </div>
    <div class="gaokao-opts">
      ${q.opts.map((o, i) => `<button class="gaokao-opt" data-i="${i}">${String.fromCharCode(65 + i)}. ${o}</button>`).join('')}
    </div>`;
  body.querySelectorAll('.gaokao-opt').forEach(btn => {
    btn.onclick = () => {
      const chosen = parseInt(btn.dataset.i);
      if (chosen === q.ans) {
        st.correct++;
        btn.style.background = 'var(--grass-1)';
      } else {
        btn.style.background = 'var(--hp)';
        body.querySelectorAll('.gaokao-opt')[q.ans].style.background = 'var(--grass-1)';
      }
      body.querySelectorAll('.gaokao-opt').forEach(b => b.disabled = true);
      setTimeout(() => {
        st.idx++;
        if (st.idx >= st.questions.length) {
          finishGaokao();
        } else {
          renderGaokaoQuestion();
        }
      }, 700);
    };
  });
}

function finishGaokao() {
  const st = _gaokaoState;
  const correct = st.correct;
  // 分数 = 答对题数 × 75，智力额外加成
  const iqBonus = Math.round(state.stats.intellect * 1.5);
  const score = Math.min(750, correct * 75 + iqBonus);
  state.education.gaokaoScore = score;
  state.log.push({ age: state.age, text: `📝【高考】10题答对${correct}题，高考总分 ${score} 分！` });
  applyEffects({ intellect: 5 });

  $('modal-title').textContent = '🎉 高 考 成 绩';
  let level = '';
  if (score >= 650) level = '🎯 清北水平！前途无量！';
  else if (score >= 550) level = '🎯 重点本科水平，不错！';
  else if (score >= 450) level = '📝 普通本科水平。';
  else if (score >= 350) level = '📚 专科水平，继续努力。';
  else level = '😅 成绩不太理想……';
  $('modal-body').innerHTML = `
    <div style="text-align:center;padding:20px 10px;">
      <div style="font-size:16px;color:var(--wood-light);margin-bottom:8px;">你的高考分数</div>
      <div style="font-size:56px;font-weight:bold;color:var(--gold);text-shadow:2px 2px 0 var(--wood-dark);">${score}</div>
      <div style="font-size:15px;margin-top:10px;color:var(--wood-dark);">答对 ${correct} / 10 题｜智力加成 ${iqBonus}</div>
      <div style="font-size:16px;margin-top:14px;font-weight:bold;color:var(--ruby);">${level}</div>
      <button class="pixel-btn" id="btn-gaokao-done" style="margin-top:18px;">填报志愿 ▶</button>
    </div>`;
  $('btn-gaokao-done').onclick = () => {
    $('modal').classList.add('hidden');
    state.requiredModal = false;
    afterGaokao();  // 进入大学阶段（会触发报考弹窗）
  };
}

/* ---------- 大学报考 + 专业选择 ---------- */
const UNIVERSITIES = [
  { tier: 1, minScore: 650, name: '清华大学', eff: { intellect: 15, charm: 5 }, majors: ['计算机科学', '经济学', '电子工程'] },
  { tier: 1, minScore: 640, name: '北京大学', eff: { intellect: 14, charm: 6 }, majors: ['法学', '数学', '中国文学'] },
  { tier: 2, minScore: 560, name: '复旦大学', eff: { intellect: 10, charm: 6 }, majors: ['新闻学', '金融学', '临床医学'] },
  { tier: 2, minScore: 550, name: '浙江大学', eff: { intellect: 10, charm: 5 }, majors: ['人工智能', '农学', '管理学'] },
  { tier: 2, minScore: 540, name: '武汉大学', eff: { intellect: 9, charm: 5 }, majors: ['测绘工程', '法学', '生物科学'] },
  { tier: 3, minScore: 450, name: '省重点大学', eff: { intellect: 7, charm: 3 }, majors: ['机械工程', '会计学', '英语'] },
  { tier: 3, minScore: 440, name: '市属本科', eff: { intellect: 6, charm: 3 }, majors: ['市场营销', '软件工程', '汉语言文学'] },
  { tier: 4, minScore: 0, name: '职业技术学院', eff: { intellect: 4, charm: 2 }, majors: ['数控技术', '烹饪工艺', '汽车维修'] },
];

function showUniversityAdmission() {
  state.requiredModal = true;
  const score = state.education.gaokaoScore;
  const avail = UNIVERSITIES.filter(u => score >= u.minScore);
  // 找不到合适学校则用最后一个（职业学院）
  const list = avail.length ? avail : [UNIVERSITIES[UNIVERSITIES.length - 1]];

  $('modal').classList.remove('hidden');
  $('modal-title').textContent = '🎓 填 报 志 愿';
  let cards = '';
  list.forEach(u => {
    cards += `<div class="edu-choice-card" data-uni="${u.name}" style="margin-top:8px;">
      <div class="ecc-top"><span class="ecc-ico">${u.tier<=2?'🏛️':'🏫'}</span><span class="ecc-name">${u.name}</span>
        <span class="ecc-tag">${u.tier===1?'顶尖':u.tier===2?'重点':u.tier===3?'普通':'专科'}</span></div>
      <div class="ecc-desc">可选专业：${u.majors.join('、')}</div>
    </div>`;
  });
  $('modal-body').innerHTML = `
    <div style="font-size:15px;line-height:1.7;margin-bottom:14px;">
      你的高考分数：<b style="color:var(--gold);">${score}</b><br>
      请选择报考的大学：
    </div>
    ${cards}
    <div id="major-pick" style="margin-top:14px;"></div>`;

  let selectedUni = null;
  $('modal-body').querySelectorAll('.edu-choice-card').forEach(card => {
    card.onclick = () => {
      $('modal-body').querySelectorAll('.edu-choice-card').forEach(c => c.style.borderColor = '');
      card.style.borderColor = 'var(--gold)';
      const uname = card.dataset.uni;
      selectedUni = UNIVERSITIES.find(u => u.name === uname);
      const mp = $('major-pick');
      mp.innerHTML = `<div style="font-size:14px;margin-bottom:8px;">选择专业：</div>` +
        selectedUni.majors.map(m => `<button class="major-btn" data-m="${m}">${m}</button>`).join('');
      mp.querySelectorAll('.major-btn').forEach(b => {
        b.onclick = () => {
          state.education.university = { name: selectedUni.name, tier: selectedUni.tier };
          state.education.major = b.dataset.m;
          if (selectedUni.eff) applyEffects(selectedUni.eff);
          state.log.push({ age: state.age, text: `🎓 考入${selectedUni.name}，就读${b.dataset.m}专业！` });
          $('modal').classList.add('hidden');
          state.requiredModal = false;
          updateTopbar(); updateStats(); renderJob();
          // 大学选专业后弹出职业规划（仍在大学阶段）
          if (!state.job.type) showJobPicker(true);
          else presentMonth();
        };
      });
    };
  });
}

/* ---------- 深造门：读研 / 读博 or 直接工作 ---------- */
function showEduGate(level) {
  state.requiredModal = true;
  const isMaster = level === 'master';
  const iqReq = isMaster ? 55 : 65;
  const iq = state.stats.intellect;
  const canStudy = iq >= iqReq && (isMaster || state.education.master);
  const title = isMaster ? '🎓 读 研 深 造？' : '🧑‍🔬 攻 读 博 士？';

  $('modal').classList.remove('hidden');
  $('modal-title').textContent = title;
  $('modal-body').innerHTML = `
    <div style="font-size:15px;line-height:1.7;margin-bottom:14px;">
      ${isMaster ? '大学毕业了，是继续攻读硕士，还是直接踏入职场？' : '硕士阶段结束，是否挑战学术巅峰攻读博士？'}<br>
      当前智力：<b>${iq}</b> ${canStudy ? '✅' : '❌'}（需 ≥ ${iqReq}）${!isMaster ? '<br>前置条件：已完成硕士' + (state.education.master ? ' ✅' : ' ❌') : ''}
    </div>
    <div class="edu-choice-card ${canStudy ? '' : 'disabled'}" data-act="study" style="background:#fff4c4;border:3px solid var(--gold);">
      <div class="ecc-top"><span class="ecc-ico">${isMaster ? '🎓' : '🧑‍🔬'}</span><span class="ecc-name">${isMaster ? '攻读硕士研究生' : '攻读博士学位'}</span></div>
      <div class="ecc-desc">${canStudy ? `智力+智力，职业等级+，未来更有竞争力。` : '🔒 智力不足或前置条件未满足'}</div>
    </div>
    <div class="edu-choice-card" data-act="work" style="background:var(--parchment-light);border:3px solid var(--grass-2);margin-top:10px;">
      <div class="ecc-top"><span class="ecc-ico">💼</span><span class="ecc-name">直接开始工作</span></div>
      <div class="ecc-desc">早日踏入社会，开始赚钱打拼。</div>
    </div>`;

  $('modal-body').querySelectorAll('.edu-choice-card').forEach(card => {
    if (card.classList.contains('disabled')) return;
    card.onclick = () => {
      const act = card.dataset.act;
      if (act === 'study') {
        state.education[level] = '在读';
        state.log.push({ age: state.age, text: `${isMaster ? '🎓 开始攻读硕士研究生' : '🧑‍🔬 开始攻读博士学位'}！` });
        $('modal').classList.add('hidden');
        state.requiredModal = false;
        presentMonth();
      } else {
        state.education[level] = ' skipped';
        state.log.push({ age: state.age, text: `💼 选择直接工作，踏入社会。` });
        $('modal').classList.add('hidden');
        state.requiredModal = false;
        skipToWork();
      }
    };
  });
}

/* 洗牌工具 */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}


function applyEffects(eff) {
  const changes = [];
  STAT_KEYS.forEach(k => {
    if (eff[k]) {
      const old = state.stats[k];
      let delta = eff[k];
      if (delta > 0) {
        const multiplier = old >= 90 ? 0.2 : old >= 75 ? 0.4 : old >= 50 ? 0.7 : 1;
        delta = Math.max(1, Math.round(delta * multiplier));
      }
      state.stats[k] = clamp(state.stats[k] + delta);
      changes.push({ key: k, delta: state.stats[k] - old });
    }
  });
  updateStats();
  changes.forEach(c => showDelta(c.key, c.delta));
}
function showDelta(key, delta) {
  if (!delta) return;
  const row = document.querySelector(`.stat-row[data-key="${key}"]`);
  if (!row) return;
  const el = document.createElement('div');
  el.className = 'float-delta';
  el.textContent = (delta > 0 ? '+' : '') + delta;
  el.style.color = delta > 0 ? '#2ecc71' : '#e74c3c';
  el.style.right = '8px';
  el.style.top = '2px';
  row.style.position = 'relative';
  row.appendChild(el);
  setTimeout(() => el.remove(), 1200);
}
function showMoneyFloat(delta) {
  if (!delta) return;
  const el = document.createElement('div');
  el.className = 'topbar-float';
  el.textContent = (delta > 0 ? '💰+' : '💰') + fmtMoney(delta);
  el.style.color = delta > 0 ? '#2ecc71' : '#e74c3c';
  const mb = $('g-money').getBoundingClientRect();
  el.style.left = (mb.left + 10) + 'px';
  el.style.top = (mb.top - 10) + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1500);
}

function buildStatsUI() {
  const list = $('stats-list');
  list.innerHTML = '';
  STAT_KEYS.forEach(k => {
    const s = STATS[k];
    const row = document.createElement('div');
    row.className = 'stat-row';
    row.dataset.key = k;
    row.innerHTML = `
      <div class="stat-head">
        <span><span class="stat-ico">${s.ico}</span> ${s.label}</span>
        <span class="stat-val" data-val="${k}">50</span>
      </div>
      <div class="stat-bar"><div class="stat-fill ${s.cls}" data-fill="${k}"></div></div>`;
    list.appendChild(row);
  });
  updateStats();
}
function updateStats() {
  STAT_KEYS.forEach(k => {
    const v = state.stats[k];
    const fill = document.querySelector(`[data-fill="${k}"]`);
    const val = document.querySelector(`[data-val="${k}"]`);
    if (fill) fill.style.width = v + '%';
    if (val) val.textContent = v;
  });
  $('g-money').textContent = `💰 ${fmtMoney(state.money)}`;
}

/* ============================================================
   家族资产渲染
   ============================================================ */
function renderAssets() {
  const box = $('assets-panel');
  if (!box) return;
  const list = $('assets-list');
  const rows = [];

  // === 个人手头现金（当前这一世赚到的，可花） ===
  rows.push(`<div class="asset-row wealth" style="background:#fff4c4;">
    <span class="ar-ico">💵</span><span class="ar-name">手头现金<span style="font-size:11px;color:var(--wood-light);">（个人可花）</span></span><span class="ar-val">${fmtMoney(state.money)}</span></div>`);

  // === 家族资产（传承，需维护） ===
  rows.push(`<div class="asset-section-title">🏰 家族资产（传承）</div>`);

  let ownedCount = 0;
  let assetTotal = 0;
  let totalMaint = 0;
  const categories = { house: { ico: '🏠', name: '房产', value: 0, items: [] },
                       car:   { ico: '🚗', name: '车辆', value: 0, items: [] },
                       biz:   { ico: '💼', name: '生意', value: 0, items: [] },
                       other: { ico: '🎁', name: '其他', value: 0, items: [] } };
  state.assets.forEach(aid => {
    const it = SHOP_ITEMS.find(x => x.id === aid);
    if (!it) return;
    ownedCount++;
    const c = categories[it.cls] || categories.other;
    const val = Math.round(it.price * 0.9);
    c.value += val;
    assetTotal += val;
    const meta = state.assetMeta[aid];
    const yearsLeft = meta ? meta.yearsLeft : (it.lifespan || '∞');
    if (it.maint) totalMaint += it.maint;
    c.items.push({ name: it.name, icon: it.icon, val, yearsLeft, maint: it.maint || 0, lifespan: it.lifespan });
  });

  if (ownedCount === 0) {
    rows.push(`<div class="asset-row empty"><span class="ar-name" style="color:var(--wood-light);">暂无家族资产，18岁后可在商城购买</span></div>`);
  } else {
    Object.entries(categories).forEach(([k, v]) => {
      if (v.items.length === 0) return;
      rows.push(`<div class="asset-row ${k}">
        <span class="ar-ico">${v.ico}</span>
        <span class="ar-name">${v.name}</span>
        <span class="ar-val">${fmtMoney(v.value)}</span></div>`);
      // 列出具体资产 + 维护信息
      v.items.forEach(it => {
        const maintStr = it.maint > 0 ? `维护${fmtMoney(it.maint)}/年` : '免维护';
        const lifeStr = it.lifespan ? `剩${it.yearsLeft}年` : '永久';
        rows.push(`<div class="asset-detail">
          <span class="ad-ico">${it.icon}</span>
          <span class="ad-name">${it.name}</span>
          <span class="ad-meta">${maintStr} · ${lifeStr}</span></div>`);
      });
    });
    // 年维护费合计
    if (totalMaint > 0) {
      rows.push(`<div class="asset-row maint">
        <span class="ar-ico">🔧</span><span class="ar-name">年维护费</span><span class="ar-val" style="color:var(--hp);">-${fmtMoney(totalMaint)}</span></div>`);
    }
  }

  // 资产合计（家族资产估值，不含个人现金）
  rows.push(`<div class="asset-row wealth" style="font-weight:bold;border-top:2px dashed var(--parchment-dark);margin-top:6px;padding-top:8px;">
    <span class="ar-ico">🏆</span><span class="ar-name">家族总资产</span><span class="ar-val">${fmtMoney(assetTotal + state.money)}</span></div>`);
  list.innerHTML = rows.join('');
}
function getFamilyNetWorth() {
  let v = state.money;
  state.assets.forEach(aid => {
    const it = SHOP_ITEMS.find(x => x.id === aid);
    if (it) v += Math.round(it.price * 0.9);
  });
  meta.heirlooms.forEach(id => {
    const item = HEIRLOOMS.find(x => x.id === id);
    if (item) v += item.value;
  });
  return v;
}

/* ============================================================
   妻儿渲染
   ============================================================ */
const CHILD_EDUCATION_PLANS = {
  early: [
    { id: '陪伴', name: '亲子陪伴', cost: 0, bonus: { charm: 4, health: 3 }, desc: '增加安全感与亲和力' },
    { id: '启蒙', name: '启蒙课程', cost: 5000, bonus: { intellect: 7 }, desc: '更早建立学习兴趣' },
  ],
  primary: [
    { id: '学业', name: '学科辅导', cost: 8000, bonus: { intellect: 9 }, desc: '强化学习基础' },
    { id: '艺术', name: '艺术培养', cost: 6000, bonus: { charm: 9 }, desc: '培养表达与审美' },
    { id: '运动', name: '体育训练', cost: 5000, bonus: { health: 10 }, desc: '提升体魄与意志' },
  ],
  teen: [
    { id: '升学', name: '升学冲刺', cost: 15000, bonus: { intellect: 12 }, desc: '提高升学与专业职业机会' },
    { id: '社交', name: '社会实践', cost: 8000, bonus: { charm: 11 }, desc: '提升沟通和人脉能力' },
    { id: '技能', name: '职业技能', cost: 6000, bonus: { intellect: 5, health: 4 }, desc: '更早获得稳定工作能力' },
  ],
};

function childAge(child) {
  return Math.max(0, state.age - child.bornAge);
}

function childEducationStage(age) {
  if (age <= 5) return 'early';
  if (age <= 12) return 'primary';
  if (age <= 17) return 'teen';
  return null;
}

function normalizeChild(child) {
  child.initialStats = child.initialStats || { intellect: 50, charm: 50 };
  if (child.initialStats.health === undefined) child.initialStats.health = 55;
  child.educationChoices = child.educationChoices || {};
  return child;
}

function createAdultChildProfile(child) {
  normalizeChild(child);
  if (child.adultProfile) return child.adultProfile;
  const stats = child.initialStats;
  const teenChoice = child.educationChoices.teen || '';
  let education = '高中';
  let career = '普通职员';
  let income = 60000;
  if (stats.intellect >= 82) { education = '重点大学'; career = '科研与专业人才'; income = 140000; }
  else if (stats.intellect >= 70) { education = '大学'; career = '专业技术人员'; income = 100000; }
  else if (teenChoice === '技能') { education = '职业教育'; career = '技术骨干'; income = 90000; }
  else if (stats.charm >= 72) { education = '大学'; career = '市场与传媒从业者'; income = 95000; }
  else if (stats.health >= 72) { education = '体育院校'; career = '体育与健康从业者'; income = 85000; }
  const personality = stats.intellect >= stats.charm && stats.intellect >= stats.health
    ? '理性自律' : stats.charm >= stats.health ? '外向圆融' : '坚韧务实';
  child.adultProfile = { education, career, income, personality, married: false };
  return child.adultProfile;
}

function updateChildrenGrowth() {
  state.children.forEach(child => {
    normalizeChild(child);
    const age = childAge(child);
    if (age >= 18 && !child.adultProfile) {
      const profile = createAdultChildProfile(child);
      state.log.push({ age: state.age, text: `🎓 ${child.name}成年了，完成${profile.education}教育，成为${profile.career}。` });
    }
    if (age >= 27 && child.adultProfile && !child.adultProfile.relationshipChecked) {
      child.adultProfile.relationshipChecked = true;
      child.adultProfile.married = ((child.name.charCodeAt(child.name.length - 1) + age) % 3) !== 0;
      state.log.push({ age: state.age, text: `${child.adultProfile.married ? '💐' : '🌱'} ${child.name}${child.adultProfile.married ? '组建了自己的家庭' : '选择继续独立生活'}。` });
    }
  });
}

function educateChild(childId, planId) {
  const child = state.children.find(item => item.id === childId);
  if (!child) return false;
  normalizeChild(child);
  const stage = childEducationStage(childAge(child));
  if (!stage || child.educationChoices[stage]) return false;
  const plan = CHILD_EDUCATION_PLANS[stage].find(item => item.id === planId);
  if (!plan || state.money < plan.cost) return false;
  state.money = clampMoney(state.money - plan.cost);
  child.educationChoices[stage] = plan.id;
  Object.entries(plan.bonus).forEach(([key, value]) => {
    child.initialStats[key] = clamp((child.initialStats[key] || 50) + value);
  });
  state.log.push({ age: state.age, text: `🧒 为${child.name}选择「${plan.name}」，${plan.desc}。` });
  updateTopbar(); renderFamily();
  return true;
}

function renderFamily() {
  const sec = $('family-section');
  if (!sec) return;
  const items = [];
  if (state.spouse) {
    const cpm = Math.round(state.spouse.costPerYear || 0);
    items.push(`<div class="family-item wife">
      <div class="fi-main">
        <span class="fi-av">${state.spouse.avatar}</span>
        <div class="fi-info">
          <div class="fi-name">${state.spouse.name}（配偶）</div>
          <div class="fi-meta">收入 ${fmtMoney(state.spouse.income||0)}/年</div>
        </div>
      </div>
      <div class="fi-cost">支 ${fmtMoney(cpm)}</div>
    </div>`);
  }
  state.children.forEach((c, idx) => {
    normalizeChild(c);
    const ageNow = Math.max(0, state.age - c.bornAge);
    const needs = ageNow < 18;
    const educationStage = childEducationStage(ageNow);
    const chosenPlan = educationStage && c.educationChoices[educationStage];
    const profile = ageNow >= 18 ? createAdultChildProfile(c) : null;
    const detail = profile
      ? `${profile.education} · ${profile.career} · ${profile.personality}${profile.married ? ' · 已成家' : ''}`
      : `${needs ? '需抚养' : '已独立'}${chosenPlan ? ' · 已培养：' + chosenPlan : ' · 本阶段待培养'}`;
    items.push(`<div class="family-item child">
      <div class="fi-main">
        <span class="fi-av">${ageNow < 4 ? '👶' : ageNow < 14 ? '🧒' : ageNow < 19 ? '🧑' : c.gender === 'male' ? '👨' : '👩'}</span>
        <div class="fi-info">
          <div class="fi-name">${c.name}（${c.order === undefined ? idx+1 : c.order}胎）</div>
          <div class="fi-meta">${ageNow}岁 · ${detail}</div>
        </div>
      </div>
      <div class="fi-cost">${needs ? '支 '+fmtMoney(12000+ageNow*2000) : '✓'}</div>
    </div>`);
  });
  if (state.exSpouse) {
    items.push(`<div class="family-item" style="background:#fde5e5;border-color:var(--ruby);">
      <div class="fi-main">
        <span class="fi-av">💔</span>
        <div class="fi-info">
          <div class="fi-name">${state.exSpouse.name}（前配偶）</div>
          <div class="fi-meta">剩 ${state.exSpouse.yearsLeft} 年赡养费</div>
        </div>
      </div>
      <div class="fi-cost">支 ${fmtMoney(state.exSpouse.alimony)}</div>
    </div>`);
  }
  (state.relatives || []).forEach(person => {
    const alive = person.alive !== false;
    const icon = person.kind === 'elder' ? (alive ? '👴' : '🕯️') : '🌿';
    const branchDetail = person.kind === 'branch'
      ? `${person.career || '生活发展中'} · ${person.personality || '性格未定'}${person.married ? ' · 已成家' : ''}`
      : '退休长辈';
    items.push(`<div class="family-item ${person.kind === 'branch' ? 'child' : ''}">
      <div class="fi-main"><span class="fi-av">${icon}</span><div class="fi-info">
        <div class="fi-name">${person.name}（${person.relation}）</div>
        <div class="fi-meta">${alive ? person.age + '岁' : '已故'} · ${person.kind === 'branch' ? '家族支系 · ' + branchDetail : branchDetail}</div>
      </div></div><div class="fi-cost">${alive && person.annualCost ? '支 ' + fmtMoney(person.annualCost) : alive ? '✓' : '纪念'}</div></div>`);
  });
  if (!items.length) {
    sec.innerHTML = `<div class="family-empty">（单身无娃，18岁后可去💕相亲/育儿）</div>`;
  } else {
    sec.innerHTML = items.join('');
  }
}

/* ============================================================
   弹窗：商城 / 活动 / 相亲育儿
   ============================================================ */
function openModal(type) {
  $('modal').classList.remove('hidden');
  if (type === 'shop')     renderShop();
  if (type === 'activity') renderActivity();
  if (type === 'marriage') renderMarriage();
  if (type === 'family') renderFamilyPlay();
  if (type === 'legacy') renderLegacyHall();
  if (type === 'achievements') renderAchievementBook();
}

function renderAchievementBook() {
  evaluateAchievements(false);
  const unlockedCount = ACHIEVEMENTS.filter(item => meta.unlocked.includes(item.id)).length;
  $('modal-title').textContent = `🏆 家族成就 · 声望 ${meta.reputation}`;
  const body = $('modal-body');
  body.innerHTML = `
    <div class="achievement-summary">
      <b>已解锁 ${unlockedCount} / ${ACHIEVEMENTS.length}</b>
      <span>声望会跨家族保留，之后可用于解锁传家宝。</span>
    </div>
    <div class="achievement-grid"></div>`;
  const grid = body.querySelector('.achievement-grid');
  ACHIEVEMENTS.forEach(item => {
    const unlocked = meta.unlocked.includes(item.id);
    const hiddenLocked = item.hidden && !unlocked;
    const card = document.createElement('div');
    card.className = `achievement-card${unlocked ? ' unlocked' : ' locked'}${item.hidden ? ' hidden-achievement' : ''}`;
    card.innerHTML = `
      <div class="achievement-icon">${unlocked ? '🏆' : hiddenLocked ? '❔' : '🔒'}</div>
      <div class="achievement-copy">
        <div class="achievement-name">${hiddenLocked ? '隐藏成就' : item.name}</div>
        <div class="achievement-desc">${hiddenLocked ? item.hint : item.desc}</div>
      </div>
      <div class="achievement-reward">${unlocked ? '已获得' : '+' + item.reward} 🏅</div>`;
    grid.appendChild(card);
  });
}

/* ---------- 家族长期玩法：挑战 / 同学聚会 / 传家宝 ---------- */
function challengeProgress(challenge) {
  if (!challenge) return { value: 0, done: false };
  let value = 0;
  if (challenge.type === 'wealth') value = getFamilyNetWorth();
  if (challenge.type === 'health') value = state.stats.health;
  if (challenge.type === 'charm') value = state.stats.charm;
  if (challenge.type === 'career') value = state.job.level || 0;
  return { value, done: value >= challenge.target };
}

function buildFamilyChallenge(type) {
  const config = {
    wealth: { name: '家业进阶', target: Math.max(100000, Math.round(getFamilyNetWorth() * 1.4)), unit: '元', reward: 60 },
    health: { name: '健康守护', target: Math.min(100, Math.max(70, state.stats.health + 12)), unit: '点', reward: 45 },
    charm: { name: '社交新星', target: Math.min(100, Math.max(65, state.stats.charm + 15)), unit: '点', reward: 45 },
    career: { name: '职场跃升', target: Math.min(10, Math.max(2, (state.job.level || 0) + 2)), unit: '级', reward: 55 },
  }[type];
  return Object.assign({ type, startedAge: state.age, deadline: state.age + 3 }, config);
}

function startFamilyChallenge(chosenType) {
  if (state.age < 18 || state.challenge || state.age < state.challengeCooldownUntil) return false;
  const types = ['wealth', 'health', 'charm', 'career'];
  const type = types.includes(chosenType) ? chosenType : types[(state.age + state.generation) % types.length];
  state.challenge = buildFamilyChallenge(type);
  state.log.push({ age: state.age, text: `🎯 接受三年挑战「${state.challenge.name}」，目标达到${fmtChallengeValue(state.challenge, state.challenge.target)}。` });
  return true;
}

function fmtChallengeValue(challenge, value) {
  return challenge.type === 'wealth' ? fmtMoney(value) : `${value}${challenge.unit}`;
}

function evaluateFamilyChallenge() {
  const challenge = state.challenge;
  if (!challenge) return null;
  const progress = challengeProgress(challenge);
  if (progress.done) {
    meta.reputation += challenge.reward;
    saveMeta();
    state.log.push({ age: state.age, text: `🏅 完成挑战「${challenge.name}」，获得${challenge.reward}声望。` });
    state.pendingStory = `🏅 完成三年挑战「${challenge.name}」，声望 +${challenge.reward}。 ` + (state.pendingStory || '');
    state.challenge = null;
    state.challengeCooldownUntil = state.age + 3;
    updateReputationUI();
    return 'completed';
  }
  if (state.age >= challenge.deadline) {
    state.log.push({ age: state.age, text: `⌛ 挑战「${challenge.name}」到期，未能完成。` });
    state.pendingStory = `⌛ 三年挑战「${challenge.name}」到期。 ` + (state.pendingStory || '');
    state.challenge = null;
    state.challengeCooldownUntil = state.age + 2;
    return 'failed';
  }
  return 'active';
}

function heirloomRequirement(item) {
  const records = meta.records || { maxGeneration: 1, maxNetWorth: 0 };
  const bestGeneration = Math.max(state.generation || 1, records.maxGeneration || 1);
  const bestNetWorth = Math.max(getFamilyNetWorth(), records.maxNetWorth || 0);
  if (item.minGeneration && bestGeneration < item.minGeneration) return `家族达到第${item.minGeneration}代`;
  if (item.minAchievements && meta.unlocked.length < item.minAchievements) return `解锁${item.minAchievements}项成就`;
  if (item.minNetWorth && bestNetWorth < item.minNetWorth) return `历史家族总资产达到${fmtMoney(item.minNetWorth)}`;
  return '';
}

function buyHeirloom(id) {
  const item = HEIRLOOMS.find(x => x.id === id);
  if (!item || meta.heirlooms.includes(id)) return false;
  const requirement = heirloomRequirement(item);
  if (requirement || meta.reputation < item.rep) return false;
  meta.reputation -= item.rep;
  meta.heirlooms.push(id);
  if (meta.equipped.length < 2) meta.equipped.push(id);
  saveMeta();
  updateReputationUI();
  if (state.name) state.log.push({ age: state.age, text: `${item.icon} 家族收藏了传家宝「${item.name}」。` });
  if (state.name) renderAssets();
  return true;
}

function toggleHeirloom(id) {
  if (!meta.heirlooms.includes(id)) return false;
  const index = meta.equipped.indexOf(id);
  if (index >= 0) meta.equipped.splice(index, 1);
  else {
    if (meta.equipped.length >= 2) return false;
    meta.equipped.push(id);
  }
  saveMeta();
  updateReputationUI();
  return true;
}

function renderLegacyHall(message) {
  $('modal-title').textContent = '🏛 家族传承馆';
  const body = $('modal-body');
  const records = meta.records || { maxGeneration: 1, maxNetWorth: 0 };
  body.innerHTML = `
    ${message ? `<div class="family-play-card">${message}</div>` : ''}
    <div class="family-play-summary">
      <div class="family-play-stat">可用声望<b>🏅 ${meta.reputation}</b></div>
      <div class="family-play-stat">历史最高资产<b>${fmtMoney(records.maxNetWorth)}</b></div>
      <div class="family-play-stat">最高传承<b>第 ${records.maxGeneration} 代</b></div>
    </div>
    <div class="family-play-section">
      <div class="family-play-title">🏺 出发前配置传家宝</div>
      <div class="sc-desc">永久收藏不会丢失；每局最多装备两件。开始人生前搭配，效果会在本局及后续继承中生效。</div>
      <div class="heirloom-grid"></div>
    </div>
    <div class="family-play-section">
      <div class="family-play-title">🏆 家族成就 ${meta.unlocked.length}/${ACHIEVEMENTS.length}</div>
      <div class="legacy-achievement-list"></div>
    </div>`;
  const grid = body.querySelector('.heirloom-grid');
  HEIRLOOMS.forEach(item => {
    const owned = meta.heirlooms.includes(item.id);
    const equipped = meta.equipped.includes(item.id);
    const requirement = heirloomRequirement(item);
    const canBuy = !owned && !requirement && meta.reputation >= item.rep;
    const card = document.createElement('div');
    card.className = `family-play-card${requirement ? ' locked' : ''}`;
    card.innerHTML = `<div class="sc-top"><span class="sc-ico">${item.icon}</span><span class="sc-name">${item.name}</span></div>
      <div class="sc-desc">${item.desc}<br>${requirement ? `🔒 ${requirement}` : `家族估值 +${fmtMoney(item.value)}`}</div>
      <div class="sc-bottom"><span class="sc-price">${owned ? (equipped ? '✅ 已装备' : '📦 已收藏') : `🏅 ${item.rep}`}</span><button class="sc-buy" ${owned ? (!equipped && meta.equipped.length >= 2 ? 'disabled' : '') : (canBuy ? '' : 'disabled')}>${owned ? (equipped ? '卸下' : '装备') : meta.reputation < item.rep ? '声望不足' : '购入'}</button></div>`;
    card.querySelector('.sc-buy').onclick = () => {
      if (owned && toggleHeirloom(item.id)) renderLegacyHall(`${equipped ? '已卸下' : '已装备'}传家宝「${item.name}」。`);
      else if (!owned && buyHeirloom(item.id)) renderLegacyHall(`🏺 已收藏并装备传家宝「${item.name}」。`);
    };
    grid.appendChild(card);
  });
  const achievementList = body.querySelector('.legacy-achievement-list');
  ACHIEVEMENTS.forEach(item => {
    const unlocked = meta.unlocked.includes(item.id);
    const row = document.createElement('div');
    row.className = `asset-row ${unlocked ? 'wealth' : 'other'}`;
    row.innerHTML = `<span>${unlocked ? '✅' : '🔒'} ${item.hidden && !unlocked ? '隐藏成就' : item.name}</span><span class="ar-val">${unlocked ? '已完成' : `+${item.reward}声望`}</span>`;
    achievementList.appendChild(row);
  });
}

const REUNION_AGES = [25, 30, 35, 40, 50];
function reunionAvailable() {
  return REUNION_AGES.includes(state.age) && !state.reunionsAttended.includes(state.age);
}

function attendReunion(style) {
  if (!reunionAvailable()) return null;
  const options = {
    quiet: { cost: 0, bonus: 0, name: '低调参加', happiness: 5 },
    social: { cost: 3000, bonus: 18, name: '热情交流', happiness: 8 },
    showoff: { cost: 15000, bonus: 42, name: '高调展示', happiness: 4 },
  };
  const option = options[style];
  if (!option || state.money < option.cost) return null;
  state.money = clampMoney(state.money - option.cost);
  const netWorth = Math.max(0, getFamilyNetWorth());
  const score = Math.round(
    Math.min(80, Math.log10(netWorth + 1) * 12) +
    (state.job.level || 0) * 7 + state.stats.charm * 0.45 +
    (state.spouse ? 12 : 0) + Math.min(18, state.children.length * 5) + option.bonus +
    (state.traits && state.traits.includes('social') ? 15 : 0)
  );
  const rank = score >= 165 ? 1 : score >= 120 ? 2 : 3;
  const reward = rank === 1 ? 60 : rank === 2 ? 30 : 12;
  meta.reputation += reward;
  state.reunionsAttended.push(state.age);
  applyEffects({ happiness: option.happiness, charm: rank === 1 ? 4 : rank === 2 ? 2 : 1 });
  saveMeta();
  updateReputationUI();
  state.log.push({ age: state.age, text: `🎓 ${option.name}同学聚会，综合排名第${rank}，获得${reward}声望。` });
  updateTopbar(); updateStats(); renderAssets();
  return { rank, reward, score };
}

function eligibleHandoffChildren() {
  if (state.age < 50) return [];
  return state.children.filter(child => state.age - child.bornAge >= 18);
}

function handoffToChild(child) {
  if (!child || !eligibleHandoffChildren().some(item => item.id === child.id)) return false;
  const inheritAge = state.age - child.bornAge;
  const intellect = clamp((child.initialStats && child.initialStats.intellect) || 55);
  const charm = clamp((child.initialStats && child.initialStats.charm) || 55);
  const health = clamp(72 - Math.max(0, inheritAge - 35));
  const happiness = 65;
  state.finalAge = state.age;
  state.cause = `${state.name}在${state.age}岁主动退休，将家主位置交给${child.name}。`;
  state.log.push({ age: state.age, text: `🤝 主动交接：${state.name}退休，${child.name}成为下一任家主。` });
  doInherit(child, inheritAge, health, intellect, charm, happiness, { handoff: true });
  return true;
}

function renderFamilyPlay(message) {
  evaluateFamilyChallenge();
  $('modal-title').textContent = '🎯 年度玩法';
  const body = $('modal-body');
  const netWorth = getFamilyNetWorth();
  const challenge = state.challenge;
  const progress = challengeProgress(challenge);
  const canStart = state.age >= 18 && !challenge && state.age >= state.challengeCooldownUntil;
  const handoffChildren = eligibleHandoffChildren();
  body.innerHTML = `
    ${message ? `<div class="family-play-card">${message}</div>` : ''}
    <div class="family-play-summary">
      <div class="family-play-stat">家族总资产<b>${fmtMoney(netWorth)}</b></div>
      <div class="family-play-stat">可用声望<b>🏅 ${meta.reputation}</b></div>
      <div class="family-play-stat">传承进度<b>第 ${state.generation} 代</b></div>
    </div>
    <div class="family-play-section">
      <div class="family-play-title">📜 家族族谱</div>
      <div class="lineage-list"></div>
    </div>
    <div class="family-play-section">
      <div class="family-play-title">🤝 家主交接</div>
      <div class="family-play-card handoff-slot"></div>
    </div>
    <div class="family-play-section">
      <div class="family-play-title">🧒 子女培养</div>
      <div class="child-education-list"></div>
    </div>
    <div class="family-play-section">
      <div class="family-play-title">🎯 三年挑战</div>
      <div class="family-play-card challenge-slot"></div>
    </div>
    <div class="family-play-section">
      <div class="family-play-title">🎓 同学聚会</div>
      <div class="family-play-card reunion-slot"></div>
    </div>`;

  const lineageList = body.querySelector('.lineage-list');
  const lineage = (state.lineage || []).concat([{ generation: state.generation, name: state.name, age: state.age, netWorth, traits: state.traits || [], current: true }]);
  lineage.forEach(person => {
    const card = document.createElement('div');
    card.className = 'lineage-person';
    const traitNames = person.traits.length ? person.traits.map(id => ROUTE_TRAITS[id] ? ROUTE_TRAITS[id].icon + ROUTE_TRAITS[id].name : id).join('、') : '暂无特质';
    const ageLabel = person.current ? person.age + '岁' : person.status === 'retired' ? person.age + '岁退休' : '享年' + person.age + '岁';
    card.innerHTML = `<b>${person.current ? '▶ ' : ''}第${person.generation}代 · ${person.name}</b><br>${ageLabel}<br>${traitNames}<br>资产 ${fmtMoney(person.netWorth)}`;
    lineageList.appendChild(card);
  });

  const handoffSlot = body.querySelector('.handoff-slot');
  if (state.age < 50) {
    handoffSlot.innerHTML = '<b>50岁后开放</b><div class="sc-desc">届时可以把家主位置主动交给成年子女，退休家主仍会留在家庭中。</div>';
  } else if (!handoffChildren.length) {
    handoffSlot.innerHTML = '<b>暂无成年继承人</b><div class="sc-desc">至少需要一名年满18岁的子女。</div>';
  } else {
    handoffSlot.innerHTML = '<b>选择下一任家主</b><div class="sc-desc">主动交接保留全部共同现金，上一任家主转为退休长辈。</div><div class="handoff-options"></div>';
    const options = handoffSlot.querySelector('.handoff-options');
    handoffChildren.forEach(child => {
      const profile = createAdultChildProfile(child);
      const button = document.createElement('button');
      button.className = 'sc-buy';
      button.textContent = `${child.name} · ${state.age - child.bornAge}岁 · ${profile.career} · ${profile.personality}`;
      button.onclick = () => {
        if (button.dataset.confirm === 'yes') handoffToChild(child);
        else { button.dataset.confirm = 'yes'; button.textContent = `再次点击确认交给 ${child.name}`; }
      };
      options.appendChild(button);
    });
  }

  const educationList = body.querySelector('.child-education-list');
  const growingChildren = state.children.filter(child => childAge(child) < 18);
  if (!growingChildren.length) {
    educationList.innerHTML = '<div class="family-play-card"><b>暂无需要培养的未成年子女</b><div class="sc-desc">孩子出生后，可以在每个成长阶段选择一次培养方向。</div></div>';
  } else {
    growingChildren.forEach(child => {
      normalizeChild(child);
      const age = childAge(child);
      const stage = childEducationStage(age);
      const chosen = child.educationChoices[stage];
      const card = document.createElement('div');
      card.className = 'family-play-card child-education-card';
      const stats = child.initialStats;
      card.innerHTML = `<b>${child.name} · ${age}岁</b><div class="sc-desc">智力 ${stats.intellect} · 魅力 ${stats.charm} · 健康 ${stats.health}</div><div class="child-plan-options"></div>`;
      const options = card.querySelector('.child-plan-options');
      if (chosen) {
        const plan = CHILD_EDUCATION_PLANS[stage].find(item => item.id === chosen);
        options.innerHTML = `<span class="education-chosen">本阶段已选择：${plan ? plan.name : chosen}</span>`;
      } else {
        CHILD_EDUCATION_PLANS[stage].forEach(plan => {
          const button = document.createElement('button');
          button.className = 'sc-buy';
          const bonus = Object.entries(plan.bonus).map(([key, value]) => `${STATS[key] ? STATS[key].label : key}+${value}`).join('、');
          button.innerHTML = `${plan.name}<br><small>${plan.cost ? fmtMoney(plan.cost) : '免费'} · ${bonus}</small>`;
          button.disabled = state.money < plan.cost;
          button.onclick = () => {
            if (educateChild(child.id, plan.id)) renderFamilyPlay(`🧒 已为${child.name}选择「${plan.name}」。`);
          };
          options.appendChild(button);
        });
      }
      educationList.appendChild(card);
    });
  }

  const challengeSlot = body.querySelector('.challenge-slot');
  if (challenge) {
    challengeSlot.innerHTML = `<b>${challenge.name}</b><div class="sc-desc">${state.age}岁进度：${fmtChallengeValue(challenge, progress.value)} / ${fmtChallengeValue(challenge, challenge.target)}｜${challenge.deadline}岁截止｜奖励 🏅${challenge.reward}</div>`;
  } else {
    if (canStart) {
      const types = ['wealth', 'health', 'charm', 'career'];
      const startIndex = (state.age + state.generation) % types.length;
      const offered = [0, 1, 2].map(offset => buildFamilyChallenge(types[(startIndex + offset) % types.length]));
      challengeSlot.innerHTML = `<b>选择一个三年目标</b><div class="sc-desc">难度不同、奖励不同；失败不会扣除资产。</div><div class="challenge-options"></div>`;
      const options = challengeSlot.querySelector('.challenge-options');
      offered.forEach(option => {
        const button = document.createElement('button');
        button.className = 'sc-buy';
        button.innerHTML = `${option.name}<br><small>${fmtChallengeValue(option, option.target)} · 🏅${option.reward}</small>`;
        button.onclick = () => { if (startFamilyChallenge(option.type)) renderFamilyPlay(`🎯 已接受「${option.name}」。`); };
        options.appendChild(button);
      });
    } else {
      challengeSlot.innerHTML = `<b>下一次挑战将在${state.challengeCooldownUntil}岁开放</b><div class="sc-desc">完成或到期后需要稍作准备。</div>`;
    }
  }

  const reunionSlot = body.querySelector('.reunion-slot');
  if (reunionAvailable()) {
    reunionSlot.innerHTML = `<b>${state.age}岁同学聚会正在举行</b><div class="sc-desc">职业、住房、车辆、资产、魅力和家庭都会计入综合排名。</div>
      <div class="sc-bottom reunion-actions"><button class="sc-buy" data-style="quiet">低调参加·免费</button><button class="sc-buy" data-style="social" ${state.money < 3000 ? 'disabled' : ''}>热情交流·3000</button><button class="sc-buy" data-style="showoff" ${state.money < 15000 ? 'disabled' : ''}>高调展示·1.5万</button></div>`;
    reunionSlot.querySelectorAll('[data-style]').forEach(btn => btn.onclick = () => {
      const result = attendReunion(btn.dataset.style);
      if (result) renderFamilyPlay(`🎓 本届聚会综合排名第${result.rank}，获得 🏅${result.reward}。`);
    });
  } else {
    const nextAge = REUNION_AGES.find(age => age > state.age);
    reunionSlot.innerHTML = `<b>${state.reunionsAttended.includes(state.age) ? '今年的聚会已经参加过了' : '当前没有聚会'}</b><div class="sc-desc">${nextAge ? `下一次聚会在${nextAge}岁开放。` : '本代的节点聚会已经结束。'}</div>`;
  }
}

function renderShop() {
  $('modal-title').textContent = '🛒 商 城  （当前现金：' + fmtMoney(state.money) + '）';
  const body = $('modal-body');
  const grid = document.createElement('div');
  grid.className = 'shop-grid';
  SHOP_ITEMS.forEach(it => {
    const owned = state.assets.includes(it.id);
    const req = it.require ? SHOP_ITEMS.find(x => x.id === it.require) : null;
    const reqOk = !req || state.assets.includes(req.id);
    const canAfford = state.money >= it.price;
    const card = document.createElement('div');
    card.className = 'shop-card' + (owned ? ' owned' : '');
    const tag = owned ? '<span class="sc-tag">已拥有</span>' : '';
    const btnLabel = owned ? '已购买' : '购 买';
    const reqTxt = req && !reqOk ? `<div style="color:var(--ruby);font-size:12px;">需先购买：${req.name}</div>` : '';
    card.innerHTML = `
      ${tag}
      <div class="sc-top"><span class="sc-ico">${it.icon}</span><span class="sc-name">${it.name}</span></div>
      <div class="sc-desc">${it.desc}${reqTxt}</div>
      <div class="sc-bottom">
        <span class="sc-price">💰 ${fmtMoney(it.price)}</span>
        <button class="sc-buy" ${owned || !reqOk || !canAfford ? 'disabled' : ''}>${btnLabel}</button>
      </div>`;
    grid.appendChild(card);
    card.querySelector('.sc-buy').onclick = () => {
      if (owned || !reqOk || !canAfford) return;
      buyShopItem(it.id);
      renderShop();
    };
  });
  body.innerHTML = '';
  body.appendChild(grid);
}

function buyShopItem(id) {
  const it = SHOP_ITEMS.find(x => x.id === id);
  if (!it) return;
  if (state.money < it.price) { alertTip('钱不够啦！'); return; }
  state.money = clampMoney(state.money - it.price);
  showMoneyFloat(-it.price);
  if (it.asset) {
    state.assets.push(it.id);
    // 记录资产维护信息（寿命）
    if (it.lifespan) state.assetMeta[it.id] = { boughtAge: state.age, yearsLeft: it.lifespan };
  }
  if (it.eff) applyEffects(it.eff);
  if (it.jobBoost) state.job.level = Math.min(10, state.job.level + it.jobBoost);
  state.stats.wealth = clamp(moneyToStat(state.money));
  state.log.push({ age: state.age, text: `【购物】购买了「${it.name}」，花费 ${fmtMoney(it.price)}。` });
  updateTopbar(); updateStats(); renderAssets();
}

/* ---------- 活动 ---------- */
function renderActivity() {
  $('modal-title').textContent = '🎉 活 动  （试试手气！）';
  const body = $('modal-body');
  body.innerHTML = '';
  ACTIVITIES.forEach(ac => {
    const card = document.createElement('div');
    card.className = 'act-card';
    const canAfford = state.money >= ac.price && state.lastActivityAge !== state.age;
    card.innerHTML = `
      <div class="sc-top"><span class="sc-ico">${ac.icon}</span><span class="sc-name">${ac.name}</span></div>
      <div class="sc-desc">${ac.desc} 概率结果：${ac.outcomes.slice(0,3).map(o => o.text).join('／')}…</div>
      <div class="sc-bottom">
        <span class="sc-price">💰 ${fmtMoney(ac.price)}</span>
        <button class="sc-buy" ${canAfford ? '' : 'disabled'}>${state.lastActivityAge === state.age ? '今年已参加' : '参加'}</button>
      </div>`;
    card.querySelector('.sc-buy').onclick = () => {
      if (state.lastActivityAge === state.age) { alertTip('今年已经参加过活动啦！'); return; }
      if (state.money < ac.price) { alertTip('钱不够啦！'); return; }
      const result = doActivity(ac);
      renderActivity(); // 先重建按钮列表（按最新金钱刷新可用性）
      // 再插入结果横幅（这样不会被清空）
      const banner = document.createElement('div');
      banner.style.cssText = 'background:#fff4c4;border:3px solid var(--gold);border-radius:3px;padding:10px;margin-bottom:10px;font-size:16px;';
      const net = (result.out.money || 0) - ac.price;
      banner.innerHTML = `🎊 <b>${ac.name}</b> 结果：<b>${result.out.text}</b><br>
        <span style="font-size:13px;color:var(--wood-light);">净${net>=0?'赚':'亏'} ${fmtMoney(Math.abs(net))}｜当前现金 ${fmtMoney(state.money)}</span>`;
      $('modal-body').insertBefore(banner, $('modal-body').firstChild);
    };
    body.appendChild(card);
  });
}

function doActivity(ac) {
  if (state.lastActivityAge === state.age || state.money < ac.price) return null;
  state.lastActivityAge = state.age;
  state.money = clampMoney(state.money - ac.price);
  showMoneyFloat(-ac.price);
  const out = weightedPick(ac.outcomes);
  if (out.money) {
    state.money = clampMoney(state.money + out.money);
    showMoneyFloat(out.money);
  }
  if (out.eff) applyEffects(out.eff);
  state.stats.wealth = clamp(moneyToStat(state.money));
  state.log.push({ age: state.age, text: `【${ac.name}】${out.text}（净${(out.money||0)-ac.price>=0?'赚':'亏'} ${fmtMoney(Math.abs((out.money||0)-ac.price))}）` });
  updateTopbar(); updateStats(); renderAssets();
  return { out };
}

/* ---------- 相亲育儿 ---------- */
/* ---------- 硬性条件检查 ---------- */
function checkHardReqs(p) {
  const r = p.reqs || {};
  const fail = [];
  if (r.reqCharm && state.stats.charm < r.reqCharm) fail.push(`魅力不足(${state.stats.charm}<${r.reqCharm})`);
  if (r.reqIntellect && state.stats.intellect < r.reqIntellect) fail.push(`智力不足(${state.stats.intellect}<${r.reqIntellect})`);
  if (r.reqHouse && !state.assets.some(a => a.startsWith('house_'))) fail.push('需要有房产');
  if (r.reqCar && !state.assets.some(a => a.startsWith('car_'))) fail.push('需要有车');
  if (r.reqJob && !state.job.type) fail.push('需要有正当职业');
  const nw = getFamilyNetWorth();
  if (r.reqWealth && nw < r.reqWealth) fail.push(`家族资产(${fmtMoney(nw)})<${fmtMoney(r.reqWealth)}`);
  return fail;
}

/* ---------- 相亲面板：追求 / 求婚 ---------- */
function renderMarriage() {
  const body = $('modal-body');
  if (state.age < 20) {
    $('modal-title').textContent = '💕 相亲 / 育儿';
    body.innerHTML = `<div style="text-align:center;font-size:17px;padding:30px 10px;color:var(--wood-dark);">
      你还太年轻啦～<br>20 岁之后再来吧！</div>`;
    return;
  }

  if (!state.spouse) {
    $('modal-title').textContent = '💕 相亲（单身 · 追求 → 求婚 → 结婚）';
    body.innerHTML = '';
    const pool = state.gender === 'male' ? DATE_POOL_FEMALE : DATE_POOL_MALE;
    pool.forEach(p => {
      const r = p.reqs || {};
      const failReqs = checkHardReqs(p);
      const reqsOk = failReqs.length === 0;
      const aff = state.affection[p.id] || 0;
      const minAff = r.minAffection || 80;
      const affOk = aff >= minAff;
      const betrothal = r.betrothal || 100000;
      const weddingCost = Math.round(betrothal * (r.weddingRatio || 1));
      const totalCost = betrothal + weddingCost;
      const canPropose = reqsOk && affOk && state.money >= totalCost;

      const item = document.createElement('div');
      item.className = 'date-item';
      // 硬性条件显示
      const reqList = [];
      if (r.reqCharm) reqList.push(`魅力≥${r.reqCharm}${state.stats.charm>=r.reqCharm?'✅':'❌'}`);
      if (r.reqIntellect) reqList.push(`智力≥${r.reqIntellect}${state.stats.intellect>=r.reqIntellect?'✅':'❌'}`);
      if (r.reqHouse) reqList.push(`有房${state.assets.some(a=>a.startsWith('house_'))?'✅':'❌'}`);
      if (r.reqCar) reqList.push(`有车${state.assets.some(a=>a.startsWith('car_'))?'✅':'❌'}`);
      if (r.reqJob) reqList.push(`有职业${state.job.type?'✅':'❌'}`);
      if (r.reqWealth) reqList.push(`资产≥${fmtMoney(r.reqWealth)}`);
      reqList.push(`好感≥${minAff}${affOk?'✅':'❌'}`);

      // 好感度进度条
      const affBarW = Math.min(100, aff);
      const affColor = affOk ? 'var(--grass-1)' : 'var(--gold)';

      item.innerHTML = `
        <div class="di-av">${p.avatar}</div>
        <div class="di-info">
          <div class="di-name">${p.name}（${p.age}岁）｜月入 ${fmtMoney(p.income)}
            <span style="float:right;color:var(--wood-light);font-size:13px;">好感度 ${aff}/100</span>
          </div>
          <div style="height:8px;background:var(--parchment-dark);border-radius:4px;margin:4px 0 6px;overflow:hidden;">
            <div style="width:${affBarW}%;height:100%;background:${affColor};transition:width .3s;"></div>
          </div>
          <div class="di-meta">${p.trait}<br>
            <span style="color:${reqsOk?'var(--grass-2)':'var(--ruby)'};">条件：${reqsOk?'已全部满足✅':failReqs.join('，')}</span><br>
            彩礼：${fmtMoney(betrothal)}｜婚礼：${fmtMoney(weddingCost)}｜合计：<b>${fmtMoney(totalCost)}</b>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;">
          <button class="di-btn court-btn" data-act="court">💘 追求<br><span style="font-size:11px;">(1000元/次)</span></button>
          <button class="di-btn propose-btn" data-act="propose" style="background:${canPropose?'var(--gold)':'#c8c8c8'};box-shadow:0 3px 0 ${canPropose?'var(--gold-dark)':'#999'};"
            ${canPropose ? '' : 'disabled'}>💍 求婚</button>
        </div>`;

      item.querySelector('.court-btn').onclick = () => court(p);
      item.querySelector('.propose-btn').onclick = () => propose(p);
      body.appendChild(item);
    });
    return;
  }

  // 已婚：显示家庭 + 育儿选项
  $('modal-title').textContent = `💕 你与 ${state.spouse.name} 的幸福家庭`;
  body.innerHTML = '';

  const info = document.createElement('div');
  info.className = 'married-info';
  info.innerHTML = `<div class="di-name">👫 ${state.spouse.name}｜年收入 +${fmtMoney(state.spouse.income||0)}｜年消费 -${fmtMoney(state.spouse.costPerYear||0)}</div>
    <div style="margin-top:6px;color:var(--wood-light);font-size:13px;">${state.spouse.trait}</div>`;
  body.appendChild(info);

  // 💋 暧昧出轨（已婚玩家专属，有风险）
  const affairSection = document.createElement('div');
  affairSection.className = 'baby-plan';
  affairSection.style.background = '#fde5e5';
  affairSection.style.borderColor = 'var(--ruby)';
  const affairCost = 30000;
  const canAffair = state.money >= affairCost;
  affairSection.innerHTML = `
    <div class="bp-title" style="color:var(--ruby);">💋 暧昧出轨</div>
    <div class="bp-desc">花 <b>${fmtMoney(affairCost)}</b> 偷偷约会情人寻求刺激。
      <span style="color:var(--ruby);">⚠️ 风险：可能被配偶捉奸，进入离婚诉讼！</span></div>
    <button class="bp-btn" ${canAffair ? '' : 'disabled'}
      style="background:var(--ruby);">💋 偷 偷 约 会</button>`;
  affairSection.querySelector('.bp-btn').onclick = () => {
    if (!canAffair) { alertTip('钱不够出轨啦！'); return; }
    doAffair();
  };
  body.appendChild(affairSection);

  // 生育选项
  const babySection = document.createElement('div');
  babySection.className = 'baby-plan';
  const babyCost = childBirthCost();
  const canHaveBaby = canHaveChild();
  babySection.innerHTML = `
    <div class="bp-title">👶 计划生育</div>
    <div class="bp-desc">你已育有 <b>${state.children.length}</b> 个孩子。每次生育花费 <b>${fmtMoney(babyCost)}</b>，
      包括产检/奶粉/尿布等。孩子18岁前每年需要抚养费。最多 6 个孩子。</div>
    <button class="bp-btn" ${canHaveBaby ? '' : 'disabled'}>🤱 生 一 胎</button>`;
  babySection.querySelector('.bp-btn').onclick = () => {
    if (!tryGiveBirth()) { alertTip('当前不满足生育条件、间隔或费用。'); return; }
    renderMarriage();
    updateTopbar(); renderFamily();
  };
  body.appendChild(babySection);

  // 已有孩子列表
  if (state.children.length) {
    const kids = document.createElement('div');
    kids.style.cssText = 'background:var(--parchment-light);border:2px solid var(--parchment-dark);border-radius:3px;padding:10px;';
    let html = '<div style="font-family:Consolas,monospace;font-size:11px;color:var(--wood-dark);margin-bottom:6px;">🧒 我的孩子们</div>';
    state.children.forEach((c, idx) => {
      const ageNow = state.age - c.bornAge;
      html += `<div style="padding:3px 0;border-bottom:1px dashed var(--parchment-dark);font-size:14px;">
        ${c.order === undefined ? idx+1 : c.order}. ${c.name}（${ageNow}岁·${c.gender==='male'?'男':'女'}）
        ${ageNow >= 18 ? '<span style="color:var(--grass-2);">✓已独立</span>' : '<span style="color:var(--ruby);">抚养中</span>'}
      </div>`;
    });
    kids.innerHTML = html;
    body.appendChild(kids);
  }
}

/* ---------- 追求一次：加好感度 ---------- */
function court(p) {
  const cost = 1000;
  if (state.money < cost) { alertTip('钱不够约会啦(1000元)！'); return; }
  state.money = clampMoney(state.money - cost);
  showMoneyFloat(-cost);
  const r = p.reqs || {};
  // 基础 +魅力/智力 影响成功率/效果
  const charmDiff = state.stats.charm - (r.reqCharm || 0);
  let gain = 8 + Math.floor(Math.random() * 8);
  if (charmDiff > 0) gain += Math.round(charmDiff * 0.3);
  if (charmDiff < -20) gain = Math.max(1, gain - 8);
  state.affection[p.id] = Math.min(100, (state.affection[p.id] || 0) + gain);
  applyEffects({ happiness: 2 });
  state.log.push({ age: state.age, text: `💘 约「${p.name}」出门吃饭/看电影，好感度 +${gain}（当前 ${state.affection[p.id]}）。` });
  updateTopbar(); updateStats(); renderAssets();
  renderMarriage();
}

/* ---------- 求婚：可能失败！---------- */
function propose(p) {
  const failReqs = checkHardReqs(p);
  if (failReqs.length) { alertTip('硬性条件未满足：' + failReqs.join('；')); return; }
  const r = p.reqs || {};
  const minAff = r.minAffection || 80;
  const aff = state.affection[p.id] || 0;
  if (aff < minAff) { alertTip(`对方好感度不够(当前${aff}<${minAff})，再多追求几次吧！`); return; }
  const betrothal = r.betrothal || 100000;
  const weddingCost = Math.round(betrothal * (r.weddingRatio || 1));
  const total = betrothal + weddingCost;
  if (state.money < total) { alertTip(`钱不够！彩礼${fmtMoney(betrothal)}+婚礼${fmtMoney(weddingCost)}=共计${fmtMoney(total)}。`); return; }

  // 求婚成功率：好感度越高越稳
  const okProb = 0.5 + (aff - minAff) * 0.02;
  const success = Math.random() < Math.max(0.55, Math.min(0.98, okProb));

  // 先把彩礼+婚礼花掉（不成功只退一部分）
  state.money = clampMoney(state.money - total);
  showMoneyFloat(-total);

  if (success) {
    // 求婚成功 → 结婚
    doMarry(p, betrothal, weddingCost);
  } else {
    // 失败：退30%，心情暴跌，好感度下降
    const refund = Math.round(total * 0.3);
    state.money = clampMoney(state.money + refund);
    showMoneyFloat(refund);
    state.affection[p.id] = Math.max(0, aff - 20);
    applyEffects({ happiness: -15 });
    alertTip(`💔 求婚失败！${p.name}觉得你还不够好，退还了${fmtMoney(refund)}礼物。心情暴跌！`);
    state.log.push({ age: state.age, text: `💔 向「${p.name}」求婚失败！退还部分彩礼${fmtMoney(refund)}，心情暴跌。` });
  }
  updateTopbar(); updateStats(); renderAssets();
  renderMarriage();
}

/* ---------- 真正执行结婚：彩礼+婚礼已花 ---------- */
function doMarry(p, betrothal, weddingCost) {
  state.spouse = {
    id: p.id,
    name: p.name,
    avatar: p.avatar,
    age: p.age,
    marriedAtAge: state.age,
    trait: p.trait,
    income: Math.round(p.income * 12),   // 转换为年收入
    color: p.color || {},
    costPerYear: p.costPerYear || 15000,
  };
  applyEffects({ happiness: 18, charm: 5 });
  state.log.push({ age: state.age, text: `💐 向「${p.name}」求婚成功！彩礼 ${fmtMoney(betrothal)} + 婚礼 ${fmtMoney(weddingCost)}，二人喜结良缘！` });
  alertTip(`🎉 恭喜你与${p.name}结婚！祝你们白头偕老~`);
  updateTopbar(); updateStats(); renderAssets(); renderFamily();
}

/* ---------- 自动结婚(故事面板选择"结婚成家"触发)：简化版 ---------- */
function autoMarry() {
  const p = getAutoMarriageCandidate();
  if (!p) return false;
  const r = p.reqs || {};
  const betrothal = Math.round((r.betrothal || 100000) * 0.5);
  const weddingCost = Math.round(betrothal * 0.5);
  const total = betrothal + weddingCost;
  state.money = clampMoney(state.money - total);
  showMoneyFloat(-total);
  state.affection[p.id] = 100;
  doMarry(p, betrothal, weddingCost);
  return true;
}

function getAutoMarriageCandidate() {
  const pool = state.gender === 'male' ? DATE_POOL_FEMALE : DATE_POOL_MALE;
  return pool.find(p => {
    const betrothal = Math.round((p.reqs.betrothal || 100000) * 0.5);
    const total = betrothal + Math.round(betrothal * 0.5);
    return checkHardReqs(p).length === 0 && state.money >= total;
  });
}

/* 兼容旧 marry() 调用 */
function marry(person, auto = false) {
  // 兼容：旧的 marry 直接用参数 person (旧结构), 但新 DATE_POOL 已是新结构
  const r = person.reqs || { betrothal: person.money || 100000, weddingRatio: 1.2 };
  const betrothal = r.betrothal || 100000;
  const weddingCost = Math.round(betrothal * (r.weddingRatio || 1));
  if (!auto) {
    state.money = clampMoney(state.money - (betrothal + weddingCost));
    showMoneyFloat(-(betrothal + weddingCost));
  }
  state.spouse = {
    id: person.id, name: person.name, avatar: person.avatar, age: person.age, marriedAtAge: state.age, trait: person.trait,
    income: Math.round((person.income||0) * 12),
    color: person.color || {},
    costPerYear: person.costPerYear || 15000,
  };
  applyEffects({ happiness: 12, charm: 3 });
  state.log.push({ age: state.age, text: `💐 与「${person.name}」结为夫妻！` });
  updateTopbar(); updateStats();
}

function childBirthCost() {
  return 40000 + state.children.length * 20000;
}

function canHaveChild() {
  if (!state.spouse || state.children.length >= 6 || state.lastBirthAge === state.age) return false;
  const spouseAge = state.spouse.age + state.age - (state.spouse.marriedAtAge ?? state.age);
  const motherAge = state.gender === 'female' ? state.age : spouseAge;
  const fatherAge = state.gender === 'male' ? state.age : spouseAge;
  return motherAge < 48 && fatherAge < 70 && state.money >= childBirthCost();
}

function tryGiveBirth() {
  if (!canHaveChild()) return false;
  const cost = childBirthCost();
  state.money = clampMoney(state.money - cost);
  showMoneyFloat(-cost);
  state.lastBirthAge = state.age;
  const gender = Math.random() < 0.5 ? 'male' : 'female';
  const newSeq = _gChildSeq++;
  const name = genChildName(state.name);
  // 继承父母属性
  const baseIntellect = Math.round((state.stats.intellect + (state.spouse ? 60 : 50)) / 2 + rand(-8, 8));
  const baseCharm = Math.round((state.stats.charm + (state.spouse ? 60 : 50)) / 2 + rand(-8, 8));
  // 肤色 / 发色 取父母平均（简化：70%父，30%母）
  const palette = {};
  if (state.spouse && state.spouse.color && state.spouse.color.H) {
    palette.H = state.gender === 'male' ? '#6b3e1e' : state.spouse.color.H;
  }
  state.children.push({
    id: 'c_' + Date.now() + '_' + Math.random().toString(36).slice(2,6),
    name, gender,
    bornAge: state.age,
    order: newSeq,
    initialStats: { intellect: clamp(baseIntellect), charm: clamp(baseCharm), health: clamp(55 + rand(-6, 8)) },
    educationChoices: {},
    color: palette,
    inheritAssetsIdx: null,
  });
  applyEffects({ happiness: 8, health: -3 });
  state.log.push({ age: state.age, text: `👶 「${name}」出生了！是个${gender==='male'?'男':'女'}娃娃。` });
  state.stats.wealth = clamp(moneyToStat(state.money));
  updateTopbar(); updateStats();
  return true;
}

/* ============================================================
   💋 出轨 → 捉奸 → 离婚诉讼流程
   ============================================================ */
const AFFAIR_OUTCOMES = [
  // 未被发现
  { weight: 55, caught: false, text: '约会很刺激，没被发现，心跳又浪漫。', eff: { happiness: 10, charm: 4 } },
  { weight: 10, caught: false, text: '情人送了你一笔钱作为心意。', money: 20000, eff: { happiness: 8 } },
  // 被捉奸
  { weight: 20, caught: true, text: '糟了！配偶带着私家侦探冲进酒店，把你和情人抓了个正着！', eff: { happiness: -15 } },
  { weight: 10, caught: true, text: '暧昧短信被配偶翻到，证据确凿，闹翻天了！', eff: { happiness: -12 } },
  { weight: 5,  caught: true, text: '情人上门逼宫，配偶震怒，婚姻岌岌可危！', eff: { happiness: -20, charm: -3 } },
];

function doAffair() {
  state.money = clampMoney(state.money - 30000);
  showMoneyFloat(-30000);
  const out = weightedPick(AFFAIR_OUTCOMES);
  if (out.eff) applyEffects(out.eff);
  if (out.money) {
    state.money = clampMoney(state.money + out.money);
    showMoneyFloat(out.money);
  }
  state.stats.wealth = clamp(moneyToStat(state.money));
  state.log.push({ age: state.age, text: `💋【出轨】${out.text}` });
  updateTopbar(); updateStats();

  if (out.caught) {
    // 进入离婚诉讼界面
    setTimeout(() => showDivorceScreen(out.text), 400);
  } else {
    // 未被发现：刷新面板 + 顶部横幅
    renderMarriage();
    const banner = document.createElement('div');
    banner.style.cssText = 'background:#e8f8d8;border:3px solid var(--grass-2);border-radius:3px;padding:10px;margin-bottom:10px;font-size:16px;';
    banner.innerHTML = `💋 出轨结果：<b>${out.text}</b>`;
    $('modal-body').insertBefore(banner, $('modal-body').firstChild);
  }
}

/* ---------- 离婚诉讼界面 ---------- */
function showDivorceScreen(affairText) {
  state.requiredModal = true;
  const spouseName = state.spouse.name;
  const hasKids = state.children.length > 0;
  const totalAssets = getFamilyNetWorth();
  // 配偶分走的资产（默认 50%）
  const halfAssets = Math.max(0, Math.round(totalAssets * 0.5));

  $('modal').classList.remove('hidden');
  $('modal-title').textContent = '💔 离 婚 诉 讼';
  const body = $('modal-body');
  body.innerHTML = `
    <div style="background:#fde5e5;border:3px solid var(--ruby);border-radius:3px;padding:12px;margin-bottom:12px;">
      <div style="font-size:18px;color:var(--ruby);margin-bottom:6px;">😱 婚姻危机！</div>
      <div style="font-size:15px;line-height:1.6;">${affairText}<br><br>
        <b>${spouseName}</b> 无法忍受你的背叛，坚决提出离婚！</div>
    </div>
    <div style="background:var(--parchment-light);border:2px solid var(--parchment-dark);border-radius:3px;padding:10px;margin-bottom:12px;font-size:14px;">
      📊 <b>当前家庭状况</b><br>
      · 家族总资产：<b style="color:var(--ruby);">${fmtMoney(totalAssets)}</b><br>
      · 子女数量：<b>${state.children.length}</b> ${hasKids ? '（涉及抚养权）' : '（无子女，无抚养权之争）'}<br>
      · 若败诉：配偶分走 <b style="color:var(--ruby);">${fmtMoney(halfAssets)}</b> 资产
      ${hasKids ? '<br>· 若败诉且失去抚养权：每年需支付赡养费' : ''}
    </div>
    <div style="font-size:15px;margin-bottom:10px;">请你做出选择：</div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;">
      <button class="pixel-btn blue" id="btn-fight" style="flex:1;min-width:160px;">⚔️ 上法庭打官司</button>
      <button class="pixel-btn gold" id="btn-settle" style="flex:1;min-width:160px;">🤝 和解离婚（直接分一半）</button>
    </div>
    <div id="divorce-result" style="margin-top:12px;"></div>
  `;

  $('btn-fight').onclick = () => doDivorceLawsuit(true);
  $('btn-settle').onclick = () => doDivorceLawsuit(false);
}

/* ---------- 打官司 / 和解 ---------- */
function doDivorceLawsuit(fight) {
  const resultBox = $('divorce-result');
  if (!resultBox) return;
  const spouseName = state.spouse.name;
  const hasKids = state.children.length > 0;
  const totalAssets = getFamilyNetWorth();
  const halfAssets = Math.max(0, Math.round(totalAssets * 0.5));

  if (!fight) {
    // 和解：直接分一半，无官司
    divideFamilyAssets(0.5);
    // 若有未成年孩子，配偶带走一半孩子
    const takenKids = takeSomeKids(Math.ceil(state.children.length / 2));
    finalizeDivorce({
      result: '和解',
      text: `你选择和解，${spouseName} 分走 ${fmtMoney(halfAssets)} 资产。${takenKids>0?`${spouseName} 带走了 ${takenKids} 个孩子。`:''}`,
      gotCustody: state.children.length,
      lostCustody: takenKids,
      alimony: 0,
    });
    return;
  }

  // 打官司：胜率 = (财富+智力+魅力)/3 映射到 30-85%
  const power = (state.stats.wealth + state.stats.intellect + state.stats.charm) / 3;
  const winRate = Math.max(30, Math.min(85, Math.round(power)));
  const won = Math.random() * 100 < winRate;

  resultBox.innerHTML = `
    <div style="background:#fef5e7;border:3px solid var(--gold);border-radius:3px;padding:12px;margin-bottom:10px;">
      <div style="font-size:16px;color:var(--wood-dark);margin-bottom:8px;">⚖️ 法庭审理中…</div>
      <div style="font-size:14px;">你的胜诉概率：<b>${winRate}%</b>
        （基于 财富${state.stats.wealth}+智力${state.stats.intellect}+魅力${state.stats.charm}）</div>
      <div style="margin-top:8px;font-size:18px;font-weight:bold;color:${won?'var(--grass-2)':'var(--ruby)'};">
        ${won ? '✅ 官司胜诉！' : '❌ 官司败诉！'}
      </div>
    </div>`;

  if (won) {
    // 胜诉：保留全部资产 + 全部抚养权，配偶净身出户（仅拿走少量补偿）
    const comp = Math.round(totalAssets * 0.1);
    divideFamilyAssets(0.1);
    finalizeDivorce({
      result: '胜诉',
      text: `你赢得官司！${spouseName} 仅获得 ${fmtMoney(comp)} 补偿，孩子和大部分资产归你。`,
      gotCustody: state.children.length,
      lostCustody: 0,
      alimony: 0,
    });
  } else {
    // 败诉：分走一半资产 + 若有孩子失去抚养权 + 每年赡养费
    divideFamilyAssets(0.5);
    let lostKids = 0;
    let alimony = 0;
    if (hasKids) {
      lostKids = state.children.length; // 全部失去
      takeSomeKids(lostKids);
      // 赡养费：按孩子数 × 1.5万/年
      alimony = lostKids * 15000;
      state.spouse = { ...state.spouse, _alimonyToPay: alimony, _alimonyYears: 18 };
    }
    finalizeDivorce({
      result: '败诉',
      text: `你败诉了！${spouseName} 分走 ${fmtMoney(halfAssets)} 资产${hasKids?`，并带走全部 ${lostKids} 个孩子`:''}。${alimony>0?`你每年需支付赡养费 ${fmtMoney(alimony)}，持续 18 年。`:''}`,
      gotCustody: 0,
      lostCustody: lostKids,
      alimony: alimony,
    });
  }
}

// 先用现金支付，不足部分按估值分割固定资产；多出的价值返还为现金。
function divideFamilyAssets(ratio) {
  let due = Math.max(0, Math.round(getFamilyNetWorth() * ratio));
  const cash = Math.min(Math.max(0, state.money), due);
  state.money -= cash;
  due -= cash;
  const ordered = [...state.assets].sort((a, b) => {
    const av = SHOP_ITEMS.find(x => x.id === a)?.price || 0;
    const bv = SHOP_ITEMS.find(x => x.id === b)?.price || 0;
    return bv - av;
  });
  for (const aid of ordered) {
    if (due <= 0) break;
    const item = SHOP_ITEMS.find(x => x.id === aid);
    if (!item) continue;
    const value = Math.round(item.price * 0.9);
    state.assets.splice(state.assets.indexOf(aid), 1);
    delete state.assetMeta[aid];
    due -= value;
  }
  if (due < 0) state.money += -due;
  if (due > 0) state.money = clampMoney(state.money - due);
  renderAssets();
}

// 配偶带走 n 个孩子（按年龄小的优先带走）
function takeSomeKids(n) {
  if (n <= 0) return 0;
  // 按年龄从小到大排序，带走前 n 个
  const sorted = [...state.children].sort((a,b) => (state.age-a.bornAge) - (state.age-b.bornAge));
  const taken = sorted.slice(0, n).map(c => c.id);
  state.children = state.children.filter(c => !taken.includes(c.id));
  return taken.length;
}

// 最终化离婚：移除配偶，记录日志，显示结果+继续按钮
function finalizeDivorce(detail) {
  const spouseName = state.spouse.name;
  // 若有赡养费，将配偶信息转为"前配偶"对象保留用于年度扣款
  if (detail.alimony > 0) {
    state.exSpouse = {
      name: spouseName,
      alimony: detail.alimony,
      yearsLeft: 18,
    };
  }
  state.spouse = null;
  state.stats.wealth = clamp(moneyToStat(state.money));
  applyEffects({ happiness: -10, charm: -2 });
  state.log.push({ age: state.age, text: `💔【离婚·${detail.result}】${detail.text}` });
  updateTopbar(); updateStats(); renderFamily();

  const resultBox = $('divorce-result');
  if (!resultBox) return;
  resultBox.innerHTML += `
    <div style="background:var(--parchment-light);border:3px solid var(--wood);border-radius:3px;padding:12px;margin-top:10px;">
      <div style="font-size:15px;line-height:1.7;">${detail.text}</div>
      <div style="margin-top:8px;font-size:13px;color:var(--wood-light);">
        ${detail.gotCustody>0?`✓ 你保留了 ${detail.gotCustody} 个孩子<br>`:''}
        ${detail.lostCustody>0?`✗ ${spouseName} 带走了 ${detail.lostCustody} 个孩子<br>`:''}
        ${detail.alimony>0?`💸 每年赡养费：${fmtMoney(detail.alimony)}（剩 18 年）<br>`:''}
      </div>
    </div>
    <button class="pixel-btn" id="btn-divorce-done" style="margin-top:10px;display:block;width:100%;">继 续 ▶</button>`;
  $('btn-divorce-done').onclick = () => {
    $('modal').classList.add('hidden');
    state.requiredModal = false;
    $('story-text').innerHTML = `<span class="event-tag">💔 离婚</span>${detail.text}<br>` + $('story-text').innerHTML;
  };
}

/* ============================================================
   小提示（故事区顶部浮现）
   ============================================================ */
function alertTip(msg) {
  const t = $('story-text');
  const old = t.innerHTML;
  t.innerHTML = `<span class="event-tag">提示</span>${msg}<br><br>` + old;
}

/* ============================================================
   人生终结 + 继承
   ============================================================ */
function endLife(natural) {
  // 计算最终年龄
  if (natural) {
    state.finalAge = state.age;
    state.cause = `安详地走完了这一生，享年 ${state.finalAge} 岁。`;
  } else {
    state.finalAge = state.age;
    if (state.age < 40) state.cause = '因意外不幸离世，令人扼腕。';
    else if (state.age < 60) state.cause = '因积劳成疾，匆匆离开了人世。';
    else state.cause = '因病离开了人世。';
  }
  state.log.push({ age: state.finalAge, text: state.cause });
  evaluateAspiration();
  evaluateAchievements(true);

  // 如果有可继承的孩子，先显示继承界面，再看是否要进入第二代
  const inheritable = state.children.filter(c => {
    const ageNow = state.finalAge - c.bornAge;
    return ageNow >= 0;  // 18岁以下也行（玩家继承即抚养长大）
  });
  if (inheritable.length > 0) {
    saveRun('inherit');
    showInheritScreen(inheritable);
  } else {
    clearRunSave();
    renderSummary();
    showScreen('summary');
  }
}

function showInheritScreen(children) {
  $('end-banner-text').textContent = `第${state.generation}代 · ${state.name} · ${state.finalAge}岁`;
  showScreen('inherit');

  const name = state.name;
  $('inherit-tip').innerHTML = `
    <b>${name}</b> 走完了这一生。<br>
    家族总资产：<span style="color:var(--ruby);font-weight:bold;">💰 ${fmtMoney(getFamilyNetWorth())}</span>。<br>
    家族尚有 ${children.length} 位子嗣，请选择下一代家族掌门人：
  `;

  const list = $('inherit-children');
  list.innerHTML = '';
  children.forEach((c, idx) => {
    const ageNow = state.finalAge - c.bornAge;
    // 继承：现金 70%，资产完整继承，孩子属性基于成长预测
    const inheritAge = Math.max(0, ageNow);
    // 预测成年属性（0-17岁：按成长速度线性外推）
    const predictHp = 60 + rand(-10, 15);
    const predictIq = clamp((c.initialStats.intellect || 50) + rand(-5, 10));
    const predictCh = clamp((c.initialStats.charm || 50) + rand(-5, 10));
    const predictHa = 55 + rand(-5, 15);

    const it = document.createElement('div');
    it.className = 'inherit-item';
    it.innerHTML = `
      <div class="ii-av">${c.gender==='male'?'👨':'👩'}</div>
      <div class="ii-info">
        <div class="ii-name">${c.name}（${inheritAge}岁，${c.gender==='male'?'儿':'女'}）</div>
        <div class="ii-desc">
          预计属性：❤${predictHp} 📚${predictIq} ✨${predictCh} 😊${predictHa}<br>
          可继承：💰 ${fmtMoney(Math.round(state.money * 0.7))} + 家族资产完整继承 + ${state.assets.length} 项资产
        </div>
      </div>
      <div class="ii-arrow">▶</div>`;
    it.onclick = () => {
      // 二次确认：显示一个确认按钮在底部
      document.querySelectorAll('.inherit-item').forEach(x => x.classList.remove('selected'));
      it.classList.add('selected');
      // 追加确认按钮
      const oldBtn = list.querySelector('.confirm-inherit');
      if (oldBtn) oldBtn.remove();
      const confirm = document.createElement('button');
      confirm.className = 'pixel-btn gold confirm-inherit';
      confirm.textContent = `确认以「${c.name}」身份继承家族`;
      confirm.style.cssText = 'margin: 8px auto 0; display:block;';
      confirm.onclick = () => doInherit(c, inheritAge, predictHp, predictIq, predictCh, predictHa);
      list.appendChild(confirm);
    };
    list.appendChild(it);
  });
}

function doInherit(child, inheritAge, pHp, pIq, pCh, pHa, options) {
  const handoff = Boolean(options && options.handoff);
  const previousName = state.name;
  const previousGender = state.gender;
  const previousAge = state.finalAge;
  const previousSpouse = state.spouse ? Object.assign({}, state.spouse) : null;
  const previousChildren = state.children.slice();
  // 1. 保存上一代总结
  state.finalAge = state.finalAge;
  if (!Array.isArray(state.lineage)) state.lineage = [];
  state.lineage.push({
    generation: state.generation, name: state.name, age: state.finalAge,
    netWorth: getFamilyNetWorth(), traits: (state.traits || []).slice(), status: handoff ? 'retired' : 'deceased',
  });
  // 主动交接保留共同现金；身后继承扣除30%的赡养、支系分配及手续成本。
  const inheritedMoney = handoff ? state.money : Math.round(state.money * 0.7);
  const inheritedAssets = state.assets.slice();
  const relatives = Array.isArray(state.relatives) ? state.relatives.slice() : [];
  if (handoff) {
    relatives.push({
      kind: 'elder', relation: previousGender === 'male' ? '父亲' : '母亲',
      name: previousName, age: previousAge, annualCost: 12000, alive: true,
    });
  }
  if (previousSpouse) {
    const spouseAge = previousSpouse.age + previousAge - (previousSpouse.marriedAtAge || previousAge);
    relatives.push({
      kind: 'elder', relation: previousGender === 'male' ? '母亲' : '父亲',
      name: previousSpouse.name, age: spouseAge, annualCost: 8000, alive: true,
    });
  }
  previousChildren.filter(item => item.id !== child.id).forEach(sibling => {
    const siblingAge = Math.max(0, previousAge - sibling.bornAge);
    const profile = siblingAge >= 18 ? createAdultChildProfile(sibling) : null;
    const ability = ((sibling.initialStats && sibling.initialStats.intellect) || 50) +
      ((sibling.initialStats && sibling.initialStats.charm) || 50);
    relatives.push({
      kind: 'branch', relation: sibling.gender === 'male' ? '兄弟' : '姐妹',
      name: sibling.name, age: siblingAge,
      career: profile ? profile.career : '在读',
      income: profile ? profile.income : 0,
      personality: profile ? profile.personality : '成长中',
      married: profile ? profile.married : false,
      fortune: Math.max(-1, Math.min(2, Math.round((ability - 100) / 25))), alive: true,
    });
  });

  // 3. 设定新玩家
  state.generation += 1;
  state.name = child.name;
  state.gender = child.gender;
  // 若孩子继承时未成年（<18），我们直接把他抬到 18 岁，跳过成长期（简单起见），
  // 并给予成长 buff，让他立刻可以使用商城/相亲。
  if (inheritAge < 18) inheritAge = 18;
  state.age = inheritAge;
  // 成年继承人按真实年龄进入对应阶段。
  state.stageIdx = STAGES.findIndex(s => ['youth', 'adult', 'elder'].includes(s.id) && inheritAge <= s.ageEnd);
  if (state.stageIdx < 0) state.stageIdx = STAGES.findIndex(s => s.id === 'elder');
  state.round = 0;
  state.month = 0;

  // 属性
  state.stats = {
    health: clamp(pHp),
    intellect: clamp(pIq),
    charm: clamp(pCh),
    wealth: 0,
    happiness: clamp(pHa),
  };
  if (meta.equipped.includes('album')) state.stats.happiness = clamp(state.stats.happiness + 5);
  if (meta.equipped.includes('manual')) state.stats.intellect = clamp(state.stats.intellect + 5);
  if (meta.equipped.includes('genealogy')) {
    state.stats.charm = clamp(state.stats.charm + 6);
    state.stats.happiness = clamp(state.stats.happiness + 6);
  }

  state.money = inheritedMoney;
  state.assets = inheritedAssets;
  state.assetMeta = Object.assign({}, state.assetMeta);  // 资产维护信息一并继承
  state.education = { kindergarten: null, gaokaoScore: 0, university: null, major: null, master: null, phd: null };
  state.allowance = 0;  // 成年继承者无零花钱
  state.affection = {};
  state.routeProgress = {};
  state.traits = [];
  state.job = { level: Math.max(0, Math.round((state.stats.intellect-40)/15)), salary: 0 };
  state.spouse = null;      // 下一代重新成家
  state.exSpouse = null;    // 前配偶债务不传给下一代
  state.relatives = relatives;
  state.lastFamilyEventAge = null;
  // 过滤掉下一代的弟弟妹妹之外的孩子：实际上下一代玩家的 children = 自己未来的娃
  // 但兄弟姐妹保留为家族成员（作为资产/社交），我们不显示为自己的孩子，直接清空
  // 但保留兄弟姐妹作为家族日志记录
  const siblings = previousChildren.filter(x => x.id !== child.id)
    .map(x => ({ age: state.age, text: `🌿 家族支系：${x.name}（${Math.max(0, previousAge - x.bornAge)}岁）` }));
  state.children = [];

  // 日志：保留上代总结的最后一条 + 新继承开始
  state.log = [
    { age: state.age, text: `🏰 第${state.generation}代：${state.name}${handoff ? '接任家主' : '继承家族'}，接手 💰 ${fmtMoney(inheritedMoney)} + ${state.assets.length} 项资产` },
    ...siblings,
  ];

  state.cause = ''; state.finalAge = 0;
  state.pendingStory = ''; state.careerPlan = null; state.lastBirthAge = null; state.lastActivityAge = null;
  state.challenge = null; state.challengeCooldownUntil = state.age; state.reunionsAttended = [];
  state.assetReturns = {}; state.requiredModal = false;
  state.yearReport = null; state._hasSpentInRound = false; state.lastEconomyCreditAge = null;
  state.stats.wealth = clamp(moneyToStat(state.money));

  buildStatsUI();
  showScreen('game');
  enterStage();
}

/* ============================================================
   总结界面
   ============================================================ */
function lifeTitle(score) {
  if (score >= 700) return '传 奇 人 生';
  if (score >= 550) return '辉 煌 人 生';
  if (score >= 400) return '精 彩 人 生';
  if (score >= 260) return '平 凡 人 生';
  return '艰 难 人 生';
}

function renderSummary() {
  const s = state.stats;
  const netWorth = getFamilyNetWorth();
  const score = STAT_KEYS.reduce((a, k) => a + s[k], 0) + state.finalAge + Math.min(100, netWorth / 100000);

  $('life-title').textContent = lifeTitle(score);
  drawCharacter($('summary-char'), 'elder', state.gender);

  // 最终属性
  const fs = $('final-stats');
  fs.innerHTML = '';
  STAT_KEYS.forEach(k => {
    const st = STATS[k];
    fs.innerHTML += `<div class="fs-item">
      <div class="fs-ico">${st.ico}</div>
      <div class="fs-num">${s[k]}</div>
      <div class="fs-lbl">${st.label}</div></div>`;
  });

  // 家族资产区块
  const fwb = $('family-wealth');
  const assetVal = netWorth - state.money;
  fwb.innerHTML = `
    <div class="fwb-head">🏛️ 第 ${state.generation} 代 家族资产结算</div>
    <div class="fwb-row"><span class="fwb-label">💴 现金资产</span><span class="fwb-value">${fmtMoney(state.money)}</span></div>
    <div class="fwb-row"><span class="fwb-label">📦 固定资产（房产/车/生意）</span><span class="fwb-value">${fmtMoney(assetVal)}</span></div>
    <div class="fwb-row"><span class="fwb-label">👫 家人（配偶+${state.children.length}子）</span>
      <span class="fwb-value">${state.spouse?state.spouse.name:'无'} · ${state.children.length}娃</span></div>
    <div class="fwb-row"><span class="fwb-label">📜 家族传承代数</span><span class="fwb-value">第 ${state.generation} 代</span></div>
    <div class="fwb-total"><span>🏆 家族总净值</span><span class="fwb-value">${fmtMoney(netWorth)}</span></div>
  `;

  // 成就
  const ach = $('achievements');
  ach.innerHTML = '';
  ACHIEVEMENTS.forEach(a => {
    const got = meta.unlocked.includes(a.id);
    const label = a.hidden && !got ? '隐藏成就' : a.name;
    ach.innerHTML += `<div class="achv${got ? '' : ' locked'}">${got ? '★ ' : '✗ '}${label}</div>`;
  });

  // 人生轨迹
  const log = $('life-log');
  log.innerHTML = '';
  state.log.forEach(l => {
    log.innerHTML += `<div class="log-item"><span class="log-age">${l.age}岁</span>${l.text}</div>`;
  });
}

/* 启动 */
init();
