# 家族重启日记 · Reborn

一个使用 JavaScript 开发的生活与家族模拟游戏。通过年度选择改变角色的健康、智力、魅力、财富和心情，经历升学、职业、家庭及资产变化，并通过子女继承继续家族故事。

## 网页版运行

在项目目录启动静态文件服务：

```sh
python -m http.server 8080
```

打开 `http://localhost:8080`。入口为 `index.html`，主要逻辑在 `game.js`，界面样式在 `style.css`。存档保存在浏览器本地；切换浏览器或清理站点数据会影响存档。

## 抖音小游戏版

`douyin/` 是独立的竖屏 Canvas 版本。用自己的小游戏 AppID 配置后导入抖音开发者工具。详细说明见 [douyin/README.md](douyin/README.md)，发布前需要开发者工具和真机验证。

## 代码验证

需要 Node.js 18 或更高版本，在根目录执行：

```sh
node verify.cjs
node tests/douyin-engine.cjs
node tests/registration-readiness.cjs
```

修改网页版内容表后，可通过 `node tools/export-douyin-content.cjs` 更新小游戏内容数据。

## 目录

- `index.html`、`game.js`、`style.css`：网页游戏。
- `douyin/`：抖音小游戏引擎、界面、内容及平台适配。
- `tests/`、`verify.cjs`：游戏规则与工程校验。
- `tools/`：内容导出及图标生成。
- `design/`：玩法设计稿。
- `registration/`：软件说明书与登记准备材料草稿。

不要在公共仓库中提交 API 密钥、平台密钥或个人私有配置。
