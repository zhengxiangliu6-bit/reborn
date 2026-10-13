// 从 HTML 版的内容表生成小游戏包体数据，避免手工维护两套剧情。
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'game.js'), 'utf8')
  .replace(/\/\* 启动 \*\/\s*init\(\);\s*$/, '');
const context = vm.createContext({ document: {}, window: {}, setTimeout() {} });
const names = ['SPRITE_BODY', 'SPRITE_BABY', 'BACKGROUNDS', 'STAGES', 'EVENTS',
  'MONTHLY_CHOICES', 'SHOP_ITEMS', 'ACTIVITIES', 'DATE_POOL_MALE',
  'DATE_POOL_FEMALE', 'CAREERS', 'UNIVERSITIES', 'GAOKAO_QUESTIONS'];
vm.runInContext(source + `\nglobalThis.exported = {${names.join(',')}};`, context);
const data = JSON.parse(JSON.stringify(context.exported));
// 抖音版不包含博彩及付费随机投资活动。
data.ACTIVITIES = data.ACTIVITIES.filter(item => !['act_lottery', 'act_gamble', 'act_stock'].includes(item.id));
fs.writeFileSync(path.join(root, 'douyin', 'content.js'),
  `// 由 tools/export-douyin-content.cjs 生成；请修改源文件 game.js 后重新导出。\nmodule.exports = ${JSON.stringify(data, null, 2)};\n`, 'utf8');
console.log(`导出 ${names.length} 组内容到 douyin/content.js`);
