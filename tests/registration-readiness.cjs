// Check objective packaging and naming details before preparing registration materials.
// This does not determine ownership, originality, or whether registration will be granted.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const title = '家族重启日记';
const html = read('index.html');
const css = read('style.css');
const webGame = read('game.js');
const miniUi = read('douyin/ui.js');
const miniEngine = read('douyin/engine.js');
const miniEntry = read('douyin/game.js');
const miniAds = read('douyin/ads.js');
const config = JSON.parse(read('douyin/project.config.json'));
const content = require('../douyin/content.js');

assert.match(html, new RegExp(`<title>${title}</title>`));
assert.match(html, new RegExp(`class="game-title">${title}</h1>`));
assert.match(miniUi, new RegExp(title));
assert.equal(config.projectname, title);
assert.equal(typeof config.setting?.es6, 'boolean', '真机编译需要 project.config.json 的 setting.es6');
for (const [file, text] of Object.entries({ miniUi, miniEngine, miniEntry, miniAds })) {
  assert.doesNotMatch(text, /\?\.|\?\?/, `${file} 使用了真机打包器不能解析的语法`);
}
for (const [file, text] of Object.entries({ html, css, webGame, miniUi })) {
  assert.doesNotMatch(text, /模拟人生|星露谷物语|fonts\.googleapis\.com|Press Start 2P|ZCOOL KuaiLe/, file);
}
assert.deepEqual(content.ACTIVITIES.map(item => item.id).filter(id =>
  ['act_lottery', 'act_gamble', 'act_stock'].includes(id)), []);
for (const file of ['game.js', 'game.json', 'project.config.json', 'engine.js', 'ui.js', 'ads.js', 'content.js']) {
  assert.ok(fs.existsSync(path.join(root, 'douyin', file)), `缺少小游戏文件：${file}`);
}
const icon = fs.readFileSync(path.join(root, 'douyin/icon.png'));
assert.equal(icon.toString('ascii', 1, 4), 'PNG');
assert.equal(icon.readUInt32BE(16), 600);
assert.equal(icon.readUInt32BE(20), 600);
console.log('名称、独立资源、小游戏包结构与图标尺寸校验通过');
