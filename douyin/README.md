# 家族重启日记 · 抖音小游戏版

这是与根目录 HTML 版并存的竖屏触摸版本。入口为 `game.js`，使用抖音小游戏 Canvas API；不依赖 DOM，也不需要网页容器。现有剧情、出身、职业、学校、商品等内容由根目录 `game.js` 导出到 `content.js`。小游戏版暂不包含彩票、赌场和随机炒股活动。

## 导入与试玩

1. 在抖音开放平台创建小游戏，取得小游戏 AppID，并将 `project.config.json` 中的 `appid` 替换为真实值。
2. 安装抖音开发者工具，导入 **本目录 `douyin`** 为小游戏项目，选择竖屏模拟器编译、预览。
3. 用真机检查触摸滚动、长文案、不同屏幕尺寸、存档和重新打开游戏后的续玩，再上传体验版。

真机预览打包需要 `project.config.json` 内的 `setting.es6`。若开发者工具保存项目配置时覆盖该字段并再次出现 `reading 'es6'`，请检查开发者工具的「详情 → 工程配置」，并确认项目目录仍是本目录。

目前广告位 ID 留空，试玩不会展示广告。开通广告能力并创建激励视频广告位后，把 `ads.js` 中的 `REWARDED_AD_UNIT_ID` 替换为真实 ID；只有广告回调确认完整观看时才重抽当年的三个选项。广告失败或中途关闭不消耗机会。发布前应在真机上验证广告回调及后台配置。

自动存档使用 `tt.setStorageSync`。本地缓存可能被系统清理，正式版如需跨设备或长期保存，需接入账号与服务端存档，并考虑旧存档迁移。没有 AppID、广告位及开发者工具环境时，本目录只能完成代码层验证，无法代替真机审核。

## 本地校验与更新内容

在项目根目录运行（Node.js 18+）：

```sh
node tools/export-douyin-content.cjs
node tests/douyin-engine.cjs
node verify.cjs
node tests/registration-readiness.cjs
```

修改根目录 HTML 版剧情表后，重新执行导出脚本，提交更新后的 `douyin/content.js`。引擎和界面仍需分别维护；导出脚本只同步内容表。

软件登记的版本说明和来源核对位于根目录 `registration`。这些文件是申请材料草稿；开发完成日期、实际著作权人、内容来源及正式交存页码需要申请人核实。

参考：[小游戏开发指南](https://partner.open-douyin.com/docs/resource/zh-CN/mini-game/guide/minigame/develop)、[小游戏新手教程](https://partner.open-douyin.com/docs/resource/zh-CN/mini-game/develop/guide/dev-guide/newbie-tutorial)、[激励视频 API](https://partner.open-douyin.com/docs/resource/zh-CN/mini-game/develop/api/javascript-api/ads/tt-create-rewarded-video-ad)、[本地存储 API](https://partner.open-douyin.com/docs/resource/zh-CN/mini-app/develop/api/data-caching/tt-set-storage-sync)。
