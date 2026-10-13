// 由 tools/export-douyin-content.cjs 生成；请修改源文件 game.js 后重新导出。
module.exports = {
  "SPRITE_BODY": [
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
    "................"
  ],
  "SPRITE_BABY": [
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
    "................"
  ],
  "BACKGROUNDS": [
    {
      "id": "rich",
      "name": "富家子弟",
      "desc": "含着金钥匙出生，家境优渥。",
      "eff": {
        "wealth": 25,
        "charm": 8,
        "health": -5
      },
      "money": 50000
    },
    {
      "id": "scholar",
      "name": "书香门第",
      "desc": "家学渊源，从小耳濡目染。",
      "eff": {
        "intellect": 20,
        "happiness": 8,
        "wealth": -8
      },
      "money": 8000
    },
    {
      "id": "sport",
      "name": "体育世家",
      "desc": "运动基因强大，体魄强健。",
      "eff": {
        "health": 22,
        "charm": 6,
        "intellect": -5
      },
      "money": 10000
    },
    {
      "id": "normal",
      "name": "普通家庭",
      "desc": "平平淡淡才是真。",
      "eff": {
        "health": 5,
        "intellect": 5,
        "charm": 5,
        "wealth": 5,
        "happiness": 5
      },
      "money": 5000
    },
    {
      "id": "orphan",
      "name": "寒门子弟",
      "desc": "出身贫寒，却胸怀大志。",
      "eff": {
        "health": -5,
        "wealth": -15,
        "intellect": 8,
        "happiness": -3
      },
      "money": 500
    }
  ],
  "STAGES": [
    {
      "id": "baby",
      "name": "婴幼儿",
      "sprite": "baby",
      "ageStart": 0,
      "ageEnd": 2,
      "rounds": 2,
      "unlockEco": false,
      "intro": "你呱呱坠地，来到了这个充满未知的世界。父母满怀期待地看着你……",
      "pool": [
        {
          "text": "努力学走路",
          "eff": {
            "health": -3,
            "intellect": 4
          },
          "desc": "你摔了无数跤，终于迈出了人生第一步！"
        },
        {
          "text": "安静地睡觉",
          "eff": {
            "health": 5,
            "happiness": 2
          },
          "desc": "你睡得很香，长得白白胖胖。"
        },
        {
          "text": "咿呀学语",
          "eff": {
            "intellect": 5,
            "charm": 2
          },
          "desc": "你学会了喊\"爸爸妈妈\"！"
        },
        {
          "text": "调皮捣蛋",
          "eff": {
            "happiness": 5,
            "charm": 3,
            "health": -2
          },
          "desc": "你把家里搅得天翻地覆。"
        }
      ]
    },
    {
      "id": "kindergarten",
      "name": "幼儿园",
      "sprite": "child",
      "ageStart": 3,
      "ageEnd": 5,
      "rounds": 2,
      "unlockEco": false,
      "kgChoice": true,
      "intro": "到了上幼儿园的年纪，父母开始为你挑选合适的幼儿园。",
      "pool": [
        {
          "text": "学画画做手工",
          "eff": {
            "intellect": 4,
            "happiness": 5
          },
          "desc": "你的画作被贴在了教室墙上！"
        },
        {
          "text": "和小朋友游戏",
          "eff": {
            "charm": 5,
            "happiness": 4,
            "health": 2
          },
          "desc": "你成了孩子王，大家都爱跟你玩。"
        },
        {
          "text": "学唱儿歌",
          "eff": {
            "charm": 4,
            "intellect": 3,
            "happiness": 3
          },
          "desc": "你在汇演上领唱，掌声雷动。"
        },
        {
          "text": "午睡偷吃零食",
          "eff": {
            "happiness": 5,
            "health": -2
          },
          "desc": "你偷偷吃了好多零食，开心但肚子疼。"
        }
      ]
    },
    {
      "id": "primary",
      "name": "小学",
      "sprite": "child",
      "ageStart": 6,
      "ageEnd": 12,
      "rounds": 3,
      "unlockEco": false,
      "intro": "转眼你背起小书包，迈进了小学的校门，校园里充满了欢声笑语。",
      "pool": [
        {
          "text": "认真学习",
          "eff": {
            "intellect": 8,
            "happiness": -2
          },
          "desc": "你门门功课优秀，是老师的好学生。"
        },
        {
          "text": "和小伙伴玩耍",
          "eff": {
            "charm": 6,
            "happiness": 5,
            "health": 2
          },
          "desc": "你交到了一群好朋友！"
        },
        {
          "text": "帮父母做家务",
          "eff": {
            "wealth": 0,
            "happiness": 3,
            "intellect": 2
          },
          "money": 800,
          "desc": "你是个懂事贴心的孩子，拿到了奖励。"
        },
        {
          "text": "看课外书",
          "eff": {
            "intellect": 6,
            "happiness": 4
          },
          "desc": "你在书里发现了新世界。"
        },
        {
          "text": "学一门乐器",
          "eff": {
            "charm": 6,
            "intellect": 3,
            "happiness": 2
          },
          "desc": "你开始学钢琴，弹出了第一支曲子。"
        },
        {
          "text": "反抗欺负你的人",
          "eff": {
            "health": 3,
            "charm": 4,
            "happiness": -3
          },
          "desc": "你勇敢地保护了自己。"
        }
      ]
    },
    {
      "id": "middle",
      "name": "初中",
      "sprite": "teen",
      "ageStart": 13,
      "ageEnd": 15,
      "rounds": 2,
      "unlockEco": false,
      "intro": "青春期来临，你升入初中，开始思考自己的人生方向。",
      "pool": [
        {
          "text": "拼命学习",
          "eff": {
            "intellect": 10,
            "health": -3,
            "happiness": -3
          },
          "money": 0,
          "jobBoost": 1,
          "desc": "你考上了重点高中！未来的道路变得清晰。"
        },
        {
          "text": "加入运动队",
          "eff": {
            "health": 8,
            "charm": 5
          },
          "desc": "你成了校队的主力球员。"
        },
        {
          "text": "打工赚钱",
          "eff": {
            "wealth": 0,
            "intellect": 3,
            "health": -2
          },
          "money": 3000,
          "desc": "你赚到了人生第一桶金。"
        },
        {
          "text": "谈场青涩恋爱",
          "eff": {
            "charm": 8,
            "happiness": 6,
            "intellect": -2
          },
          "desc": "你尝到了心动的滋味。"
        },
        {
          "text": "参加学科竞赛",
          "eff": {
            "intellect": 8,
            "charm": 3
          },
          "money": 2000,
          "desc": "你捧回了奥数奖杯，还拿到了奖学金！"
        },
        {
          "text": "沉迷游戏",
          "eff": {
            "happiness": 8,
            "intellect": -4,
            "health": -3,
            "wealth": 0
          },
          "money": -1000,
          "desc": "你打通了所有游戏，成绩却下滑了，还花了不少零花钱。"
        }
      ]
    },
    {
      "id": "high",
      "name": "高中",
      "sprite": "teen",
      "ageStart": 16,
      "ageEnd": 18,
      "rounds": 2,
      "unlockEco": false,
      "gaokao": true,
      "intro": "高中三年至关重要，高考是改变命运的关键一战。",
      "pool": [
        {
          "text": "备战高考",
          "eff": {
            "intellect": 12,
            "health": -4,
            "happiness": -4
          },
          "money": 0,
          "jobBoost": 2,
          "desc": "你拼尽全力备战高考，知识储备大增！"
        },
        {
          "text": "体育特招",
          "eff": {
            "health": 10,
            "charm": 5
          },
          "money": 0,
          "jobBoost": 1,
          "desc": "你凭体育特长被高校相中！"
        },
        {
          "text": "兼职打工",
          "eff": {
            "wealth": 0,
            "intellect": 2,
            "health": -2
          },
          "money": 5000,
          "desc": "你课余兼职，攒了笔小钱。"
        },
        {
          "text": "校园恋爱",
          "eff": {
            "charm": 8,
            "happiness": 7,
            "intellect": -3
          },
          "desc": "你和心仪的人谈了场甜甜的恋爱。"
        },
        {
          "text": "参加奥赛",
          "eff": {
            "intellect": 10,
            "charm": 3
          },
          "money": 5000,
          "jobBoost": 1,
          "desc": "你在全国奥赛获奖，名校向你招手！"
        },
        {
          "text": "沉迷网游",
          "eff": {
            "happiness": 8,
            "intellect": -5,
            "health": -3,
            "wealth": 0
          },
          "money": -2000,
          "desc": "你沉迷网游，成绩下滑，还充了不少钱。"
        }
      ]
    },
    {
      "id": "college",
      "name": "大学",
      "sprite": "adult",
      "ageStart": 19,
      "ageEnd": 22,
      "rounds": 2,
      "unlockEco": true,
      "admission": true,
      "intro": "高考结束，你即将填报志愿，迈入大学校园。💰 年满18，商城和活动系统已经解锁！",
      "pool": [
        {
          "text": "刻苦钻研专业",
          "eff": {
            "intellect": 12,
            "happiness": -2
          },
          "money": 0,
          "jobBoost": 2,
          "desc": "你专业成绩拔尖，获得保研资格！"
        },
        {
          "text": "加入学生会",
          "eff": {
            "charm": 8,
            "intellect": 3,
            "happiness": 4
          },
          "money": 0,
          "jobBoost": 1,
          "desc": "你锻炼了组织能力，人脉广了。"
        },
        {
          "text": "校园创业",
          "eff": {
            "wealth": 0,
            "happiness": 5,
            "health": -3,
            "intellect": 3
          },
          "money": 20000,
          "jobBoost": 2,
          "desc": "你和同学合伙创业，赚到了第一桶金！"
        },
        {
          "text": "谈场恋爱",
          "eff": {
            "charm": 8,
            "happiness": 8
          },
          "desc": "你遇到了那个对的人（也可去相亲面板追求）。"
        },
        {
          "text": "实习打工",
          "eff": {
            "wealth": 0,
            "intellect": 4,
            "health": -2
          },
          "money": 10000,
          "jobBoost": 1,
          "desc": "你到名企实习，积累了职场经验。"
        },
        {
          "text": "参加社团活动",
          "eff": {
            "charm": 6,
            "happiness": 6,
            "health": 2
          },
          "desc": "你在社团里找到了志同道合的朋友。"
        }
      ]
    },
    {
      "id": "master",
      "name": "研究生",
      "sprite": "adult",
      "ageStart": 23,
      "ageEnd": 25,
      "rounds": 2,
      "unlockEco": true,
      "eduGate": "master",
      "intro": "大学毕业，站在人生的十字路口：继续深造，还是踏入职场？",
      "pool": [
        {
          "text": "跟随导师做科研",
          "eff": {
            "intellect": 12,
            "happiness": -3
          },
          "money": 0,
          "jobBoost": 2,
          "desc": "你发表了核心期刊论文！"
        },
        {
          "text": "参加学术会议",
          "eff": {
            "charm": 4,
            "intellect": 6,
            "happiness": 3
          },
          "desc": "你结识了业界大牛，开阔了视野。"
        },
        {
          "text": "拿奖学金",
          "eff": {
            "wealth": 0,
            "intellect": 4
          },
          "money": 8000,
          "desc": "你凭优异成绩拿到了丰厚奖学金。"
        },
        {
          "text": "实验室熬夜",
          "eff": {
            "intellect": 6,
            "health": -5,
            "happiness": -2
          },
          "desc": "你为了课题通宵达旦，身体有点吃不消。"
        }
      ]
    },
    {
      "id": "phd",
      "name": "博士",
      "sprite": "adult",
      "ageStart": 26,
      "ageEnd": 29,
      "rounds": 2,
      "unlockEco": true,
      "eduGate": "phd",
      "intro": "硕士在读或已毕业，是否挑战学术巅峰，攻读博士？",
      "pool": [
        {
          "text": "攻坚博士课题",
          "eff": {
            "intellect": 14,
            "health": -5,
            "happiness": -4
          },
          "jobBoost": 3,
          "desc": "你的博士论文顺利通过答辩！"
        },
        {
          "text": "海外交流访学",
          "eff": {
            "intellect": 8,
            "charm": 6,
            "happiness": 5
          },
          "money": -10000,
          "desc": "你出国交流，增长了见识。"
        },
        {
          "text": "带本科生做项目",
          "eff": {
            "charm": 5,
            "intellect": 4,
            "happiness": 3
          },
          "money": 5000,
          "desc": "你当起了小导师，教学相长。"
        },
        {
          "text": "申请科研基金",
          "eff": {
            "wealth": 0,
            "intellect": 5
          },
          "money": 30000,
          "desc": "你成功申请到国家自然科学基金！"
        }
      ]
    },
    {
      "id": "youth",
      "name": "青年",
      "sprite": "adult",
      "ageStart": 23,
      "ageEnd": 35,
      "rounds": 3,
      "unlockEco": true,
      "intro": "你毕业踏入社会，广阔天地大有作为。",
      "pool": [
        {
          "text": "找份好工作",
          "eff": {
            "wealth": 0,
            "intellect": 5,
            "happiness": -2,
            "health": -2
          },
          "money": 15000,
          "jobBoost": 2,
          "desc": "你步入职场，开始打拼。"
        },
        {
          "text": "自主创业",
          "eff": {
            "wealth": 0,
            "happiness": 5,
            "health": -5,
            "intellect": 3
          },
          "money": 30000,
          "jobBoost": 3,
          "desc": "创业之路荆棘丛生，但你乐在其中。"
        },
        {
          "text": "环游世界",
          "eff": {
            "happiness": 12,
            "charm": 6,
            "wealth": -1
          },
          "money": -25000,
          "desc": "你看遍了山川湖海。"
        },
        {
          "text": "坚持健身",
          "eff": {
            "health": 10,
            "charm": 6
          },
          "desc": "你练出了令人羡慕的好身材。"
        },
        {
          "text": "遇到心上人",
          "eff": {
            "charm": 8,
            "happiness": 8
          },
          "desc": "你遇到了那个对的人（可以去相亲面板主动追求哦）。"
        },
        {
          "text": "投资理财",
          "eff": {
            "wealth": 0,
            "intellect": 4
          },
          "money": 20000,
          "desc": "你开始学习理财，小有收获。"
        }
      ]
    },
    {
      "id": "adult",
      "name": "中年",
      "sprite": "adult",
      "ageStart": 36,
      "ageEnd": 60,
      "rounds": 3,
      "unlockEco": true,
      "intro": "人到中年，事业与家庭兼顾，你更加成熟稳重。",
      "pool": [
        {
          "text": "拼搏升职",
          "eff": {
            "wealth": 0,
            "intellect": 5,
            "happiness": -3,
            "health": -3
          },
          "money": 80000,
          "jobBoost": 1,
          "desc": "你当上了部门主管，收入大涨！"
        },
        {
          "text": "投资理财",
          "eff": {
            "wealth": 0,
            "intellect": 6
          },
          "money": 60000,
          "desc": "你的投资翻了一番！"
        },
        {
          "text": "结婚成家",
          "eff": {
            "happiness": 12,
            "charm": 5
          },
          "autoMarry": true,
          "desc": "你步入婚姻的殿堂。（若还未结婚，会自动成家）"
        },
        {
          "text": "生儿育女",
          "eff": {
            "happiness": 10,
            "health": -2
          },
          "autoBaby": 1,
          "desc": "你有了可爱的孩子。（若已婚会自动生育）"
        },
        {
          "text": "扩大事业",
          "eff": {
            "wealth": 0,
            "health": -5,
            "happiness": 3
          },
          "money": 180000,
          "jobBoost": 2,
          "desc": "你的事业蒸蒸日上。"
        },
        {
          "text": "注重养生",
          "eff": {
            "health": 12,
            "happiness": 5
          },
          "money": -10000,
          "desc": "你开始早睡早起，注重健康。"
        }
      ]
    },
    {
      "id": "elder",
      "name": "老年",
      "sprite": "elder",
      "ageStart": 61,
      "ageEnd": 85,
      "rounds": 3,
      "unlockEco": true,
      "intro": "岁月不饶人，你已两鬓斑白，开始享受晚年时光。",
      "pool": [
        {
          "text": "钓鱼下棋",
          "eff": {
            "happiness": 10,
            "intellect": 4,
            "health": 3
          },
          "desc": "你在湖边悠闲地度过了一个下午。"
        },
        {
          "text": "含饴弄孙",
          "eff": {
            "happiness": 12,
            "charm": 5
          },
          "desc": "儿孙绕膝，其乐融融。"
        },
        {
          "text": "写回忆录",
          "eff": {
            "intellect": 8,
            "happiness": 5
          },
          "money": 20000,
          "desc": "你提笔记录下这精彩的一生，出书赚到了版税。"
        },
        {
          "text": "环游世界",
          "eff": {
            "happiness": 12,
            "wealth": -2,
            "health": -3
          },
          "money": -40000,
          "desc": "老骥伏枥，志在千里。"
        },
        {
          "text": "坚持锻炼",
          "eff": {
            "health": 10,
            "happiness": 5
          },
          "desc": "你每天晨练，老当益壮。"
        },
        {
          "text": "做公益慈善",
          "eff": {
            "happiness": 8,
            "charm": 8,
            "wealth": -2
          },
          "money": -30000,
          "desc": "你帮助了许多需要的人。"
        }
      ]
    }
  ],
  "EVENTS": [
    {
      "minAge": 0,
      "maxAge": 2,
      "name": "发烧生病",
      "desc": "你突然发高烧，爸妈急忙带你去了医院。",
      "money": -2000,
      "eff": {
        "health": -10
      }
    },
    {
      "minAge": 0,
      "maxAge": 2,
      "name": "摔倒擦伤",
      "desc": "你学走路时摔了一跤，磕破了膝盖。",
      "eff": {
        "health": -5
      }
    },
    {
      "minAge": 0,
      "maxAge": 2,
      "name": "长牙哭闹",
      "desc": "你正在长牙，难受得哭了一整晚。",
      "eff": {
        "health": -3,
        "happiness": -3
      }
    },
    {
      "minAge": 0,
      "maxAge": 2,
      "name": "被逗笑",
      "desc": "爸妈逗你玩，你咯咯笑个不停。",
      "eff": {
        "happiness": 8,
        "health": 2
      }
    },
    {
      "minAge": 0,
      "maxAge": 2,
      "name": "打疫苗",
      "desc": "爸妈带你去打疫苗，你哭得撕心裂肺。",
      "money": -500,
      "eff": {
        "health": 2,
        "happiness": -5
      }
    },
    {
      "minAge": 1,
      "maxAge": 2,
      "name": "学会走路",
      "desc": "你终于迈出了人生第一步！爸妈激动不已。",
      "eff": {
        "intellect": 4,
        "happiness": 6
      }
    },
    {
      "minAge": 0,
      "maxAge": 2,
      "name": "亲戚来串门",
      "desc": "亲戚们来看你，夸你长得真可爱。",
      "eff": {
        "happiness": 6,
        "charm": 2
      }
    },
    {
      "minAge": 0,
      "maxAge": 2,
      "name": "睡了个好觉",
      "desc": "你一觉睡到天亮，精神特别好。",
      "eff": {
        "health": 5,
        "happiness": 3
      }
    },
    {
      "minAge": 0,
      "maxAge": 2,
      "name": "换季感冒",
      "desc": "天气转凉，你有点小感冒。",
      "money": -800,
      "eff": {
        "health": -5
      }
    },
    {
      "minAge": 1,
      "maxAge": 2,
      "name": "第一次说话",
      "desc": "你喊出了\"妈妈\"！全家人激动坏了。",
      "eff": {
        "intellect": 5,
        "happiness": 8
      }
    },
    {
      "minAge": 3,
      "maxAge": 5,
      "name": "交叉感染",
      "desc": "你在幼儿园被传染了感冒。",
      "money": -800,
      "eff": {
        "health": -6
      }
    },
    {
      "minAge": 3,
      "maxAge": 5,
      "name": "得到小红花",
      "desc": "你表现优秀，老师奖励了你一朵小红花！",
      "eff": {
        "happiness": 6,
        "charm": 3
      }
    },
    {
      "minAge": 3,
      "maxAge": 5,
      "name": "闹别扭",
      "desc": "你和小伙伴吵架了，但很快又和好了。",
      "eff": {
        "happiness": -2,
        "charm": 2
      }
    },
    {
      "minAge": 3,
      "maxAge": 5,
      "name": "开心一天",
      "desc": "今天在幼儿园玩得特别开心。",
      "eff": {
        "happiness": 8,
        "health": 2
      }
    },
    {
      "minAge": 3,
      "maxAge": 5,
      "name": "在公园迷路",
      "desc": "你在公园里走丢了，幸好被好心人送回来。",
      "eff": {
        "happiness": -5,
        "health": -2
      }
    },
    {
      "minAge": 3,
      "maxAge": 5,
      "name": "学会骑童车",
      "desc": "你学会了骑四轮童车，开心得满院子转。",
      "eff": {
        "health": 3,
        "happiness": 6
      }
    },
    {
      "minAge": 3,
      "maxAge": 5,
      "name": "幼儿园表演",
      "desc": "你在幼儿园汇演上表演了节目，获得阵阵掌声。",
      "eff": {
        "charm": 4,
        "happiness": 6
      }
    },
    {
      "minAge": 3,
      "maxAge": 5,
      "name": "生日派对",
      "desc": "爸妈给你办了生日派对，你收到了好多礼物。",
      "eff": {
        "happiness": 8,
        "charm": 2
      }
    },
    {
      "minAge": 6,
      "maxAge": 12,
      "name": "天降横财",
      "desc": "你在路边捡到了一笔钱！",
      "money": 5000,
      "eff": {
        "happiness": 5
      }
    },
    {
      "minAge": 6,
      "maxAge": 12,
      "name": "获奖学金",
      "desc": "你学习成绩优异，获得了奖学金。",
      "money": 8000,
      "eff": {
        "happiness": 6,
        "intellect": 3
      }
    },
    {
      "minAge": 6,
      "maxAge": 12,
      "name": "结交知己",
      "desc": "你结识了一位志同道合的好友。",
      "eff": {
        "charm": 5,
        "happiness": 6
      }
    },
    {
      "minAge": 6,
      "maxAge": 12,
      "name": "大病一场",
      "desc": "你突然病倒，住进了医院。",
      "money": -5000,
      "eff": {
        "health": -12
      }
    },
    {
      "minAge": 6,
      "maxAge": 12,
      "name": "意外受伤",
      "desc": "你在体育课上不小心摔伤了。",
      "money": -1500,
      "eff": {
        "health": -8
      }
    },
    {
      "minAge": 6,
      "maxAge": 12,
      "name": "心情大好",
      "desc": "今天阳光明媚，心情格外舒畅。",
      "eff": {
        "happiness": 8,
        "health": 2
      }
    },
    {
      "minAge": 6,
      "maxAge": 12,
      "name": "被老师表扬",
      "desc": "老师当着全班同学表扬了你！",
      "eff": {
        "happiness": 6,
        "intellect": 2
      }
    },
    {
      "minAge": 6,
      "maxAge": 12,
      "name": "考试砸了",
      "desc": "你这次考试考砸了，有点沮丧。",
      "eff": {
        "happiness": -5,
        "intellect": 1
      }
    },
    {
      "minAge": 6,
      "maxAge": 12,
      "name": "和同学吵架",
      "desc": "你跟好朋友吵了一架，心情不好。",
      "eff": {
        "happiness": -4,
        "charm": -1
      }
    },
    {
      "minAge": 6,
      "maxAge": 12,
      "name": "运动会拿奖",
      "desc": "你在运动会上拿了名次，同学们为你欢呼！",
      "eff": {
        "health": 2,
        "charm": 4,
        "happiness": 6
      }
    },
    {
      "minAge": 13,
      "maxAge": 17,
      "name": "失恋打击",
      "desc": "你与暗恋对象分道扬镳，黯然神伤。",
      "eff": {
        "happiness": -10,
        "charm": -2
      }
    },
    {
      "minAge": 14,
      "maxAge": 17,
      "name": "打工受伤",
      "desc": "你打工时不小心受伤了。",
      "money": -2000,
      "eff": {
        "health": -8,
        "happiness": -2
      }
    },
    {
      "minAge": 13,
      "maxAge": 17,
      "name": "大病一场",
      "desc": "你突然病倒，住进了医院。",
      "money": -5000,
      "eff": {
        "health": -12
      }
    },
    {
      "minAge": 13,
      "maxAge": 17,
      "name": "意外受伤",
      "desc": "你不小心摔伤了。",
      "money": -1500,
      "eff": {
        "health": -8
      }
    },
    {
      "minAge": 13,
      "maxAge": 17,
      "name": "心情大好",
      "desc": "今天阳光明媚，心情格外舒畅。",
      "eff": {
        "happiness": 8,
        "health": 2
      }
    },
    {
      "minAge": 13,
      "maxAge": 17,
      "name": "结交知己",
      "desc": "你结识了一位志同道合的好友。",
      "eff": {
        "charm": 5,
        "happiness": 6
      }
    },
    {
      "minAge": 13,
      "maxAge": 17,
      "name": "考试进步",
      "desc": "你这次考试排名大幅提升，信心倍增！",
      "eff": {
        "intellect": 4,
        "happiness": 5
      }
    },
    {
      "minAge": 13,
      "maxAge": 17,
      "name": "早恋被发现",
      "desc": "老师发现了你的早恋，叫了家长。心情糟透了。",
      "eff": {
        "happiness": -8,
        "charm": -1
      }
    },
    {
      "minAge": 13,
      "maxAge": 17,
      "name": "迷上小说",
      "desc": "你迷上了一本小说，废寝忘食地看。",
      "eff": {
        "happiness": 5,
        "intellect": 2,
        "health": -2
      }
    },
    {
      "minAge": 13,
      "maxAge": 17,
      "name": "校园欺凌",
      "desc": "你被同学欺负了，心情很低落。",
      "eff": {
        "happiness": -8,
        "health": -3
      }
    },
    {
      "minAge": 18,
      "name": "偶遇贵人",
      "desc": "你遇到了一位赏识你的贵人。",
      "money": 20000,
      "eff": {
        "intellect": 6,
        "charm": 4
      }
    },
    {
      "minAge": 18,
      "name": "投资失败",
      "desc": "你的投资血本无归。",
      "money": -40000,
      "eff": {
        "happiness": -6
      }
    },
    {
      "minAge": 18,
      "name": "获得奖金",
      "desc": "你拿到了一笔丰厚的奖金！",
      "money": 30000,
      "eff": {
        "happiness": 5
      }
    },
    {
      "minAge": 18,
      "name": "过度劳累",
      "desc": "你最近操劳过度，身体发出警报。",
      "eff": {
        "health": -6
      }
    },
    {
      "minAge": 18,
      "name": "好友相助",
      "desc": "好友在你困难时伸出援手。",
      "money": 12000,
      "eff": {
        "happiness": 5
      }
    },
    {
      "minAge": 18,
      "name": "天降横财",
      "desc": "你捡到了一笔钱！",
      "money": 5000,
      "eff": {
        "happiness": 4
      }
    },
    {
      "minAge": 18,
      "name": "大病一场",
      "desc": "你突然病倒，住进了医院。",
      "money": -5000,
      "eff": {
        "health": -12
      }
    },
    {
      "minAge": 18,
      "name": "意外受伤",
      "desc": "你不小心摔伤了。",
      "money": -1500,
      "eff": {
        "health": -8
      }
    },
    {
      "minAge": 18,
      "name": "心情大好",
      "desc": "今天阳光明媚，心情格外舒畅。",
      "eff": {
        "happiness": 8,
        "health": 2
      }
    },
    {
      "minAge": 20,
      "name": "荣获殊荣",
      "desc": "你获得了一项重要荣誉！",
      "eff": {
        "charm": 8,
        "happiness": 6
      },
      "money": 50000
    },
    {
      "minAge": 25,
      "name": "房屋增值",
      "desc": "你名下的房产增值了！",
      "money": 100000,
      "eff": {
        "happiness": 5
      }
    },
    {
      "minAge": 30,
      "name": "子女孝敬",
      "desc": "你的孩子给了你一笔钱。",
      "money": 30000,
      "eff": {
        "happiness": 6
      }
    }
  ],
  "MONTHLY_CHOICES": [
    {
      "text": "乖乖喝奶",
      "eff": {
        "health": 2,
        "happiness": 1
      },
      "desc": "你大口大口喝奶，长得白白胖胖。",
      "minAge": 0,
      "maxAge": 2
    },
    {
      "text": "安静睡觉",
      "eff": {
        "health": 2,
        "happiness": 1
      },
      "desc": "你睡得很香，梦里笑出了声。",
      "minAge": 0,
      "maxAge": 2
    },
    {
      "text": "玩摇铃玩具",
      "eff": {
        "intellect": 2,
        "happiness": 2
      },
      "desc": "你被五颜六色的玩具吸引，玩得不亦乐乎。",
      "minAge": 0,
      "maxAge": 2
    },
    {
      "text": "哭闹要抱抱",
      "eff": {
        "happiness": 3,
        "health": -1
      },
      "desc": "你哇哇大哭，爸妈赶紧把你抱起来哄。",
      "minAge": 0,
      "maxAge": 2
    },
    {
      "text": "听儿歌音乐",
      "eff": {
        "intellect": 1,
        "happiness": 3
      },
      "desc": "优美的旋律让你手舞足蹈。",
      "minAge": 0,
      "maxAge": 2
    },
    {
      "text": "抓东西玩",
      "eff": {
        "intellect": 2,
        "charm": 1
      },
      "desc": "你努力抓住眼前的东西，手眼协调越来越好。",
      "minAge": 0,
      "maxAge": 2
    },
    {
      "text": "在地上爬",
      "eff": {
        "health": 1,
        "happiness": 2
      },
      "desc": "你满地爬来爬去，探索着每个角落。",
      "minAge": 1,
      "maxAge": 2
    },
    {
      "text": "被爸妈逗乐",
      "eff": {
        "happiness": 4,
        "charm": 2
      },
      "desc": "爸妈做鬼脸逗你，你笑得合不拢嘴。",
      "minAge": 0,
      "maxAge": 2
    },
    {
      "text": "在户外晒太阳",
      "eff": {
        "health": 3,
        "happiness": 2
      },
      "desc": "爸妈推着婴儿车带你出门晒太阳，暖洋洋的。",
      "minAge": 0,
      "maxAge": 2
    },
    {
      "text": "发呆看天花板",
      "eff": {
        "happiness": 1,
        "health": 1
      },
      "desc": "你盯着天花板上的光影发呆，自得其乐。",
      "minAge": 0,
      "maxAge": 2
    },
    {
      "text": "看动画片",
      "eff": {
        "happiness": 3,
        "intellect": 1
      },
      "desc": "你最爱看动画片，咯咯笑个不停。",
      "minAge": 3,
      "maxAge": 5
    },
    {
      "text": "玩积木拼图",
      "eff": {
        "intellect": 3,
        "happiness": 2
      },
      "desc": "你搭出了一座小城堡！",
      "minAge": 3,
      "maxAge": 5
    },
    {
      "text": "乖乖午睡",
      "eff": {
        "health": 2,
        "happiness": 1
      },
      "desc": "午睡醒来，下午精神满满。",
      "minAge": 3,
      "maxAge": 5
    },
    {
      "text": "吃零食点心",
      "eff": {
        "happiness": 3,
        "health": -1
      },
      "desc": "偷偷多吃了几块饼干，开心但肚子有点疼。",
      "minAge": 3,
      "maxAge": 5
    },
    {
      "text": "滑滑梯秋千",
      "eff": {
        "health": 2,
        "happiness": 3,
        "charm": 1
      },
      "desc": "在公园里玩得不亦乐乎，乐得咯咯笑。",
      "minAge": 3,
      "maxAge": 5
    },
    {
      "text": "和小动物玩",
      "eff": {
        "happiness": 3,
        "charm": 2,
        "health": 1
      },
      "desc": "你追着小猫小狗跑，开心得不得了。",
      "minAge": 3,
      "maxAge": 5
    },
    {
      "text": "画画涂鸦",
      "eff": {
        "intellect": 2,
        "charm": 1,
        "happiness": 2
      },
      "desc": "你在纸上画满了五颜六色的线条。",
      "minAge": 3,
      "maxAge": 5
    },
    {
      "text": "听爸妈讲故事",
      "eff": {
        "intellect": 3,
        "happiness": 2
      },
      "desc": "爸妈给你讲绘本故事，你听得入迷。",
      "minAge": 3,
      "maxAge": 5
    },
    {
      "text": "玩水玩沙子",
      "eff": {
        "happiness": 4,
        "health": 1
      },
      "desc": "你在沙坑里堆沙堡，玩得满身是沙。",
      "minAge": 3,
      "maxAge": 5
    },
    {
      "text": "跟爸妈出门",
      "eff": {
        "charm": 2,
        "happiness": 3,
        "intellect": 1
      },
      "desc": "跟爸妈去超市，看到了好多新鲜东西。",
      "minAge": 3,
      "maxAge": 5
    },
    {
      "text": "认真写作业",
      "eff": {
        "intellect": 3,
        "happiness": -1
      },
      "desc": "认真完成作业，知识更扎实了。",
      "minAge": 6,
      "maxAge": 12
    },
    {
      "text": "看课外书",
      "eff": {
        "intellect": 2,
        "happiness": 2
      },
      "desc": "你在书里发现了新世界。",
      "minAge": 6,
      "maxAge": 12
    },
    {
      "text": "和小伙伴玩耍",
      "eff": {
        "charm": 2,
        "happiness": 3,
        "health": 1
      },
      "desc": "和小伙伴一起追逐打闹，玩得满头大汗。",
      "minAge": 6,
      "maxAge": 12
    },
    {
      "text": "帮做家务",
      "eff": {
        "happiness": 2,
        "intellect": 1
      },
      "money": 200,
      "desc": "帮妈妈扫地，得到了夸奖和小奖励。",
      "minAge": 6,
      "maxAge": 12
    },
    {
      "text": "上兴趣班",
      "eff": {
        "charm": 2,
        "intellect": 2
      },
      "money": -300,
      "desc": "去兴趣班学习新技能。",
      "minAge": 6,
      "maxAge": 12
    },
    {
      "text": "踢球打篮球",
      "eff": {
        "health": 3,
        "charm": 2,
        "happiness": 2
      },
      "desc": "和小伙伴在操场上踢球，出了一身汗。",
      "minAge": 6,
      "maxAge": 12
    },
    {
      "text": "玩电子游戏",
      "eff": {
        "happiness": 3,
        "intellect": -1,
        "health": -1
      },
      "desc": "和朋友一起打游戏，开心但费眼睛。",
      "minAge": 6,
      "maxAge": 12
    },
    {
      "text": "骑自行车",
      "eff": {
        "health": 2,
        "charm": 1,
        "happiness": 2
      },
      "desc": "你骑着自行车在小区里兜风。",
      "minAge": 6,
      "maxAge": 12
    },
    {
      "text": "收集卡片贴纸",
      "eff": {
        "happiness": 3,
        "charm": 2
      },
      "desc": "你和小伙伴交换卡片，集齐了一套！",
      "minAge": 6,
      "maxAge": 12
    },
    {
      "text": "观察小动物",
      "eff": {
        "intellect": 2,
        "happiness": 2
      },
      "desc": "你蹲在地上看蚂蚁搬家，好奇极了。",
      "minAge": 6,
      "maxAge": 12
    },
    {
      "text": "帮老师做事",
      "eff": {
        "charm": 2,
        "intellect": 1,
        "happiness": 1
      },
      "desc": "你帮老师搬作业本，老师夸你懂事。",
      "minAge": 6,
      "maxAge": 12
    },
    {
      "text": "发呆休息",
      "eff": {
        "happiness": 2,
        "health": 1
      },
      "desc": "什么也不想干，就想躺着发呆。",
      "minAge": 6,
      "maxAge": 12
    },
    {
      "text": "早起锻炼",
      "eff": {
        "health": 2,
        "happiness": 1
      },
      "desc": "你慢跑半小时，心情舒畅。",
      "minAge": 13,
      "maxAge": 17
    },
    {
      "text": "看课外书",
      "eff": {
        "intellect": 3,
        "happiness": 1
      },
      "desc": "充实自我，精神富足。",
      "minAge": 13,
      "maxAge": 17
    },
    {
      "text": "跟朋友小聚",
      "eff": {
        "charm": 2,
        "happiness": 2
      },
      "money": -200,
      "desc": "和同学一起出去玩，增进感情。",
      "minAge": 13,
      "maxAge": 17
    },
    {
      "text": "早睡养生",
      "eff": {
        "health": 3,
        "happiness": 1
      },
      "desc": "睡眠充足，精神饱满。",
      "minAge": 13,
      "maxAge": 17
    },
    {
      "text": "沉迷游戏",
      "eff": {
        "happiness": 4,
        "intellect": -2,
        "health": -2
      },
      "money": -100,
      "desc": "打了一整天游戏，爽但虚度了光阴。",
      "minAge": 13,
      "maxAge": 17
    },
    {
      "text": "努力学习",
      "eff": {
        "intellect": 4,
        "happiness": -2,
        "health": -1
      },
      "desc": "利用碎片时间疯狂刷题。",
      "minAge": 13,
      "maxAge": 17
    },
    {
      "text": "打球运动",
      "eff": {
        "health": 3,
        "charm": 2,
        "happiness": 2
      },
      "desc": "约同学打篮球，出了身大汗，畅快！",
      "minAge": 13,
      "maxAge": 17
    },
    {
      "text": "听音乐放松",
      "eff": {
        "happiness": 3,
        "intellect": 1,
        "health": 1
      },
      "desc": "戴上耳机，沉浸在自己的小世界里。",
      "minAge": 13,
      "maxAge": 17
    },
    {
      "text": "逛街买东西",
      "eff": {
        "happiness": 3,
        "charm": 1
      },
      "money": -800,
      "desc": "和朋友逛街，买了点小东西。",
      "minAge": 13,
      "maxAge": 17
    },
    {
      "text": "看电影",
      "eff": {
        "happiness": 3,
        "intellect": 1
      },
      "money": -100,
      "desc": "看了一部好电影，回味无穷。",
      "minAge": 13,
      "maxAge": 17
    },
    {
      "text": "参加社团",
      "eff": {
        "charm": 2,
        "intellect": 2,
        "happiness": 2
      },
      "desc": "在社团里结交了志同道合的朋友。",
      "minAge": 13,
      "maxAge": 17
    },
    {
      "text": "课余休息",
      "eff": {
        "happiness": 3,
        "health": 2
      },
      "desc": "什么也不想干，好好放松一下。",
      "minAge": 13,
      "maxAge": 17
    },
    {
      "text": "早起锻炼",
      "eff": {
        "health": 2,
        "happiness": 1
      },
      "desc": "你慢跑半小时，心情舒畅。",
      "minAge": 18
    },
    {
      "text": "点外卖刷剧",
      "eff": {
        "happiness": 3,
        "health": -1
      },
      "money": -80,
      "desc": "爽了一整天，钱包-80。",
      "minAge": 18
    },
    {
      "text": "看一本书",
      "eff": {
        "intellect": 3
      },
      "desc": "充实自我，精神富足。",
      "minAge": 18
    },
    {
      "text": "跟朋友小聚",
      "eff": {
        "charm": 2,
        "happiness": 2
      },
      "money": -200,
      "desc": "吃喝玩乐增进感情。",
      "minAge": 18
    },
    {
      "text": "打工/兼职",
      "eff": {
        "health": -1
      },
      "money": 1500,
      "desc": "周末去打零工，赚到了零花钱。",
      "minAge": 18
    },
    {
      "text": "早睡养生",
      "eff": {
        "health": 3,
        "happiness": 1
      },
      "desc": "睡眠充足，皮肤都变好了。",
      "minAge": 18
    },
    {
      "text": "逛街购物",
      "eff": {
        "happiness": 3,
        "charm": 2
      },
      "money": -1500,
      "desc": "买了新衣服，心里美滋滋。",
      "minAge": 18
    },
    {
      "text": "学习新技能",
      "eff": {
        "intellect": 3,
        "happiness": -1
      },
      "desc": "利用碎片时间充电。",
      "minAge": 18
    },
    {
      "text": "躺平休息",
      "eff": {
        "happiness": 3,
        "health": 1
      },
      "desc": "什么都不想干，就想当咸鱼。",
      "minAge": 18
    },
    {
      "text": "投资理财",
      "eff": {
        "intellect": 1
      },
      "money": 500,
      "desc": "小赚了一笔基金收益。",
      "minAge": 18
    },
    {
      "text": "相亲/社交",
      "eff": {
        "charm": 2,
        "happiness": 1
      },
      "money": -500,
      "desc": "参加了一次联谊活动。",
      "minAge": 18
    },
    {
      "text": "沉迷手机",
      "eff": {
        "health": -1,
        "happiness": 2,
        "intellect": -2
      },
      "desc": "时间刷没了，但多巴胺给足了。",
      "minAge": 18
    },
    {
      "text": "户外徒步",
      "eff": {
        "health": 3,
        "happiness": 2,
        "charm": 1
      },
      "desc": "你去郊外徒步，呼吸新鲜空气，放松身心。",
      "minAge": 18
    },
    {
      "text": "自己做顿饭",
      "eff": {
        "health": 2,
        "happiness": 2,
        "intellect": 1
      },
      "desc": "亲手做了顿美食，省钱又健康。",
      "minAge": 18
    }
  ],
  "SHOP_ITEMS": [
    {
      "id": "house_small",
      "name": "小公寓",
      "icon": "🏠",
      "cls": "house",
      "price": 150000,
      "desc": "70平温馨小家，每年 +2 心情。",
      "asset": true,
      "income": {
        "happiness": 2
      },
      "lifespan": 50,
      "maint": 3000
    },
    {
      "id": "house_big",
      "name": "独栋别墅",
      "icon": "🏡",
      "cls": "house",
      "price": 600000,
      "desc": "带花园的大别墅，每年 +5 心情 +2 魅力。",
      "asset": true,
      "income": {
        "happiness": 5,
        "charm": 2
      },
      "require": "house_small",
      "lifespan": 60,
      "maint": 8000
    },
    {
      "id": "car_cheap",
      "name": "经济型轿车",
      "icon": "🚗",
      "cls": "car",
      "price": 80000,
      "desc": "代步车，每年节省通勤成本 +1 魅力。",
      "asset": true,
      "income": {
        "charm": 1
      },
      "yearlyMoney": 3000,
      "lifespan": 15,
      "maint": 5000
    },
    {
      "id": "car_lux",
      "name": "豪华轿车",
      "icon": "🏎️",
      "cls": "car",
      "price": 350000,
      "desc": "豪华座驾，每年 +4 魅力。",
      "asset": true,
      "income": {
        "charm": 4
      },
      "require": "car_cheap",
      "lifespan": 12,
      "maint": 12000
    },
    {
      "id": "biz_shop",
      "name": "社区小店",
      "icon": "🏪",
      "cls": "biz",
      "price": 200000,
      "desc": "年利润约 6 万元。",
      "asset": true,
      "yearlyMoney": 60000,
      "lifespan": 20,
      "maint": 10000
    },
    {
      "id": "biz_stock",
      "name": "股票组合",
      "icon": "📈",
      "cls": "biz",
      "price": 300000,
      "desc": "年收益约 12 万元（有波动）。",
      "asset": true,
      "yearlyMoney": 120000,
      "volatile": true
    },
    {
      "id": "biz_factory",
      "name": "小型工厂",
      "icon": "🏭",
      "cls": "biz",
      "price": 800000,
      "desc": "年利润约 30 万元！",
      "asset": true,
      "yearlyMoney": 300000,
      "require": "biz_shop",
      "lifespan": 30,
      "maint": 30000
    },
    {
      "id": "gym",
      "name": "年度健身卡",
      "icon": "🏋️",
      "cls": "other",
      "price": 10000,
      "desc": "健身一年，+5 健康 +3 魅力。",
      "asset": false,
      "eff": {
        "health": 5,
        "charm": 3
      }
    },
    {
      "id": "study",
      "name": "精英培训课",
      "icon": "🎓",
      "cls": "other",
      "price": 30000,
      "desc": "深造进修，+6 智力 +2 魅力。",
      "asset": false,
      "eff": {
        "intellect": 6,
        "charm": 2
      },
      "jobBoost": 1
    },
    {
      "id": "spa",
      "name": "奢华度假村",
      "icon": "🌴",
      "cls": "other",
      "price": 50000,
      "desc": "彻底放松，+8 心情 +3 健康。",
      "asset": false,
      "eff": {
        "happiness": 8,
        "health": 3
      }
    },
    {
      "id": "cosmetic",
      "name": "形象改造",
      "icon": "💅",
      "cls": "other",
      "price": 25000,
      "desc": "形象大变身，+8 魅力。",
      "asset": false,
      "eff": {
        "charm": 8
      }
    }
  ],
  "ACTIVITIES": [
    {
      "id": "act_party",
      "name": "高端派对",
      "icon": "🥂",
      "price": 30000,
      "desc": "参加高端社交，可能认识贵人。",
      "outcomes": [
        {
          "weight": 35,
          "text": "人太多没遇到什么人。",
          "money": 0,
          "eff": {
            "happiness": 2,
            "charm": 1
          }
        },
        {
          "weight": 54,
          "text": "认识了一些朋友。",
          "money": 0,
          "eff": {
            "charm": 5,
            "happiness": 4
          }
        },
        {
          "weight": 10,
          "text": "遇到一位投资人，给你 15 万项目款！",
          "money": 150000,
          "eff": {
            "charm": 6,
            "happiness": 8
          }
        },
        {
          "weight": 1,
          "text": "被一位大佬赏识，直接给你投资 50 万！",
          "money": 500000,
          "eff": {
            "charm": 10,
            "happiness": 15
          }
        }
      ]
    },
    {
      "id": "act_health",
      "name": "体检+治疗",
      "icon": "💊",
      "price": 15000,
      "desc": "做一次全面体检，可能改善健康。",
      "outcomes": [
        {
          "weight": 40,
          "text": "没什么问题，心情更放松了。",
          "money": 0,
          "eff": {
            "health": 3,
            "happiness": 4
          }
        },
        {
          "weight": 40,
          "text": "及时发现小问题，治愈了！",
          "money": 0,
          "eff": {
            "health": 10
          }
        },
        {
          "weight": 20,
          "text": "动了个小手术，彻底好了。",
          "money": -10000,
          "eff": {
            "health": 18,
            "happiness": 2
          }
        }
      ]
    },
    {
      "id": "act_birthday",
      "name": "奢华生日宴",
      "icon": "🎂",
      "price": 50000,
      "desc": "大摆宴席，维系家庭和人脉。",
      "outcomes": [
        {
          "weight": 50,
          "text": "家庭和睦，宾主尽欢。",
          "money": 0,
          "eff": {
            "happiness": 12,
            "charm": 5
          }
        },
        {
          "weight": 40,
          "text": "宾客回礼丰厚，收回了 3 万元礼金！",
          "money": 30000,
          "eff": {
            "happiness": 15,
            "charm": 8
          }
        },
        {
          "weight": 10,
          "text": "你成为了话题中心，+15 魅力！",
          "money": 0,
          "eff": {
            "charm": 15,
            "happiness": 10
          }
        }
      ]
    }
  ],
  "DATE_POOL_MALE": [
    {
      "id": "m1",
      "name": "王小帅",
      "avatar": "🧑",
      "age": 28,
      "trait": "程序员，聪明但有点宅",
      "income": 25000,
      "costPerYear": 20000,
      "reqs": {
        "reqCharm": 40,
        "reqWealth": 50000,
        "minAffection": 70,
        "betrothal": 188000,
        "weddingRatio": 1
      },
      "color": {
        "H": "#4a2f18",
        "T": "#3498db",
        "P": "#2c3e50"
      }
    },
    {
      "id": "m2",
      "name": "李大壮",
      "avatar": "🧔",
      "age": 32,
      "trait": "健身教练，身材壮硕",
      "income": 15000,
      "costPerYear": 15000,
      "reqs": {
        "reqCharm": 50,
        "reqHouse": true,
        "reqWealth": 200000,
        "minAffection": 75,
        "betrothal": 288000,
        "weddingRatio": 1.2
      },
      "color": {
        "H": "#8b4513",
        "T": "#2ecc71",
        "P": "#34495e"
      }
    },
    {
      "id": "m3",
      "name": "赵富豪",
      "avatar": "🤵",
      "age": 40,
      "trait": "实业家，多金成熟",
      "income": 80000,
      "costPerYear": 50000,
      "reqs": {
        "reqCharm": 72,
        "reqHouse": true,
        "reqCar": true,
        "reqWealth": 5000000,
        "reqJob": true,
        "minAffection": 90,
        "betrothal": 1888000,
        "weddingRatio": 2
      },
      "color": {
        "H": "#333333",
        "T": "#2c3e50",
        "P": "#1a1a2e"
      }
    },
    {
      "id": "m4",
      "name": "钱书生",
      "avatar": "🧑‍🎓",
      "age": 26,
      "trait": "大学讲师，文雅知性",
      "income": 16000,
      "costPerYear": 12000,
      "reqs": {
        "reqCharm": 45,
        "reqIntellect": 60,
        "reqWealth": 100000,
        "minAffection": 70,
        "betrothal": 168000,
        "weddingRatio": 0.8
      },
      "color": {
        "H": "#1a1a2e",
        "T": "#8e44ad",
        "P": "#2c3e50"
      }
    }
  ],
  "DATE_POOL_FEMALE": [
    {
      "id": "f1",
      "name": "林小美",
      "avatar": "👩",
      "age": 24,
      "trait": "温柔可爱，爱做家务",
      "income": 8000,
      "costPerYear": 18000,
      "reqs": {
        "reqCharm": 40,
        "reqWealth": 50000,
        "minAffection": 70,
        "betrothal": 188000,
        "weddingRatio": 1
      },
      "color": {
        "H": "#d68b3c",
        "T": "#e84393",
        "P": "#34495e"
      }
    },
    {
      "id": "f2",
      "name": "陈丽丽",
      "avatar": "👩‍💼",
      "age": 29,
      "trait": "职场丽人，收入稳定",
      "income": 20000,
      "costPerYear": 25000,
      "reqs": {
        "reqCharm": 50,
        "reqHouse": true,
        "reqJob": true,
        "reqWealth": 300000,
        "minAffection": 80,
        "betrothal": 388000,
        "weddingRatio": 1.3
      },
      "color": {
        "H": "#2b2b2b",
        "T": "#9b59b6",
        "P": "#2c3e50"
      }
    },
    {
      "id": "f3",
      "name": "苏冰冰",
      "avatar": "💃",
      "age": 27,
      "trait": "当红艺人，美艳动人",
      "income": 60000,
      "costPerYear": 80000,
      "reqs": {
        "reqCharm": 75,
        "reqHouse": true,
        "reqCar": true,
        "reqWealth": 8000000,
        "reqJob": true,
        "minAffection": 95,
        "betrothal": 2888000,
        "weddingRatio": 2.5
      },
      "color": {
        "H": "#c0392b",
        "T": "#e74c3c",
        "P": "#1a1a2e"
      }
    },
    {
      "id": "f4",
      "name": "周雅文",
      "avatar": "👩‍🎓",
      "age": 26,
      "trait": "书香门第，温柔贤惠",
      "income": 12000,
      "costPerYear": 15000,
      "reqs": {
        "reqCharm": 45,
        "reqIntellect": 60,
        "reqWealth": 100000,
        "minAffection": 70,
        "betrothal": 168000,
        "weddingRatio": 0.8
      },
      "color": {
        "H": "#6b3e1e",
        "T": "#27ae60",
        "P": "#2c3e50"
      }
    }
  ],
  "CAREERS": [
    {
      "id": "civil",
      "name": "公务员",
      "icon": "🏛️",
      "ico": "🏛️",
      "desc": "铁饭碗，收入稳定但涨幅慢，社会地位高。要求智力≥55",
      "base": 5000,
      "grow": 0.18,
      "eff": {
        "charm": 1,
        "happiness": 0,
        "intellect": 0
      },
      "steps": [
        "办事员",
        "科员",
        "副科级",
        "正科级",
        "副处长",
        "正处长",
        "副局长",
        "正局长",
        "副市长",
        "省长"
      ]
    },
    {
      "id": "it",
      "name": "互联网/程序员",
      "icon": "💻",
      "ico": "💻",
      "desc": "钱多话少死的早，涨薪快但中年危机重。要求智力≥60",
      "base": 10000,
      "grow": 0.28,
      "eff": {
        "intellect": 2,
        "health": -1
      },
      "steps": [
        "实习生",
        "初级开发",
        "高级开发",
        "技术专家",
        "技术主管",
        "架构师",
        "技术总监",
        "CTO",
        "技术合伙人",
        "科技大佬"
      ]
    },
    {
      "id": "finance",
      "name": "金融",
      "icon": "💰",
      "ico": "💰",
      "desc": "高薪高压，资源为王。要求智力≥65，魅力≥45",
      "base": 12000,
      "grow": 0.3,
      "eff": {
        "wealth": 1,
        "happiness": -1
      },
      "steps": [
        "管培生",
        "分析师",
        "投资经理",
        "高级经理",
        "部门总监",
        "执行董事",
        "董事总经理",
        "VP",
        "合伙人",
        "资本大鳄"
      ]
    },
    {
      "id": "doctor",
      "name": "医生",
      "icon": "⚕️",
      "ico": "⚕️",
      "desc": "越老越吃香，学习期长，社会地位高。要求智力≥70",
      "base": 7000,
      "grow": 0.25,
      "eff": {
        "intellect": 2,
        "health": -1,
        "charm": 1
      },
      "steps": [
        "规培生",
        "住院医师",
        "主治医师",
        "副主任医师",
        "主任医师",
        "科室主任",
        "副院长",
        "院长",
        "医学教授",
        "国医大师"
      ]
    },
    {
      "id": "teacher",
      "name": "教师/教授",
      "icon": "👨‍🏫",
      "ico": "👨‍🏫",
      "desc": "假期多，压力适中，桃李满天下。要求智力≥60",
      "base": 6000,
      "grow": 0.18,
      "eff": {
        "happiness": 1,
        "intellect": 1,
        "charm": 1
      },
      "steps": [
        "代课老师",
        "初中老师",
        "高中老师",
        "讲师",
        "副教授",
        "教授",
        "系主任",
        "院长",
        "副校长",
        "校长"
      ]
    },
    {
      "id": "art",
      "name": "艺术/网红",
      "icon": "🎭",
      "ico": "🎭",
      "desc": "大起大落，颜值和魅力决定一切。要求魅力≥60",
      "base": 4000,
      "grow": 0.4,
      "eff": {
        "charm": 2,
        "happiness": 1
      },
      "steps": [
        "签约新人",
        "小网红",
        "三线艺人",
        "二线艺人",
        "一线艺人",
        "当红明星",
        "顶流巨星",
        "国民偶像",
        "艺术家",
        "时代传奇"
      ]
    },
    {
      "id": "generic",
      "name": "普通打工",
      "icon": "🔨",
      "ico": "🔨",
      "desc": "没有特别门槛，努力即可。",
      "base": 4000,
      "grow": 0.15,
      "eff": {
        "health": -1
      },
      "steps": [
        "试用期",
        "正式员工",
        "老员工",
        "组长",
        "主管",
        "副经理",
        "经理",
        "高级经理",
        "总监",
        "大区总裁"
      ]
    }
  ],
  "UNIVERSITIES": [
    {
      "tier": 1,
      "minScore": 650,
      "name": "清华大学",
      "eff": {
        "intellect": 15,
        "charm": 5
      },
      "majors": [
        "计算机科学",
        "经济学",
        "电子工程"
      ]
    },
    {
      "tier": 1,
      "minScore": 640,
      "name": "北京大学",
      "eff": {
        "intellect": 14,
        "charm": 6
      },
      "majors": [
        "法学",
        "数学",
        "中国文学"
      ]
    },
    {
      "tier": 2,
      "minScore": 560,
      "name": "复旦大学",
      "eff": {
        "intellect": 10,
        "charm": 6
      },
      "majors": [
        "新闻学",
        "金融学",
        "临床医学"
      ]
    },
    {
      "tier": 2,
      "minScore": 550,
      "name": "浙江大学",
      "eff": {
        "intellect": 10,
        "charm": 5
      },
      "majors": [
        "人工智能",
        "农学",
        "管理学"
      ]
    },
    {
      "tier": 2,
      "minScore": 540,
      "name": "武汉大学",
      "eff": {
        "intellect": 9,
        "charm": 5
      },
      "majors": [
        "测绘工程",
        "法学",
        "生物科学"
      ]
    },
    {
      "tier": 3,
      "minScore": 450,
      "name": "省重点大学",
      "eff": {
        "intellect": 7,
        "charm": 3
      },
      "majors": [
        "机械工程",
        "会计学",
        "英语"
      ]
    },
    {
      "tier": 3,
      "minScore": 440,
      "name": "市属本科",
      "eff": {
        "intellect": 6,
        "charm": 3
      },
      "majors": [
        "市场营销",
        "软件工程",
        "汉语言文学"
      ]
    },
    {
      "tier": 4,
      "minScore": 0,
      "name": "职业技术学院",
      "eff": {
        "intellect": 4,
        "charm": 2
      },
      "majors": [
        "数控技术",
        "烹饪工艺",
        "汽车维修"
      ]
    }
  ],
  "GAOKAO_QUESTIONS": {
    "easy": [
      {
        "q": "1+1等于几？",
        "opts": [
          "1",
          "2",
          "3",
          "4"
        ],
        "ans": 1
      },
      {
        "q": "太阳从哪个方向升起？",
        "opts": [
          "西",
          "东",
          "南",
          "北"
        ],
        "ans": 1
      },
      {
        "q": "\"床前明月光\"的作者是？",
        "opts": [
          "杜甫",
          "李白",
          "白居易",
          "王维"
        ],
        "ans": 1
      },
      {
        "q": "一年有多少个月？",
        "opts": [
          "10",
          "11",
          "12",
          "13"
        ],
        "ans": 2
      },
      {
        "q": "中国的首都是？",
        "opts": [
          "上海",
          "广州",
          "北京",
          "深圳"
        ],
        "ans": 2
      },
      {
        "q": "水在几度结冰？",
        "opts": [
          "0℃",
          "10℃",
          "20℃",
          "100℃"
        ],
        "ans": 0
      },
      {
        "q": "彩虹有几种颜色？",
        "opts": [
          "5",
          "6",
          "7",
          "8"
        ],
        "ans": 2
      },
      {
        "q": "\"锄禾日当午\"下一句？",
        "opts": [
          "汗滴禾下土",
          "春种一粒粟",
          "谁知盘中餐",
          "粒粒皆辛苦"
        ],
        "ans": 0
      },
      {
        "q": "三角形内角和是？",
        "opts": [
          "90°",
          "180°",
          "270°",
          "360°"
        ],
        "ans": 1
      },
      {
        "q": "一周有几天？",
        "opts": [
          "5",
          "6",
          "7",
          "8"
        ],
        "ans": 2
      },
      {
        "q": "光速大约是？",
        "opts": [
          "30万km/s",
          "3万km/s",
          "300km/s",
          "3km/s"
        ],
        "ans": 0
      },
      {
        "q": "世界最高峰是？",
        "opts": [
          "乞力马扎罗",
          "珠穆朗玛",
          "乔戈里",
          "干城章嘉"
        ],
        "ans": 1
      }
    ],
    "hard": [
      {
        "q": "sin30° + cos60° = ?",
        "opts": [
          "0.5",
          "1",
          "1.5",
          "2"
        ],
        "ans": 1
      },
      {
        "q": "牛顿第二定律 F=?",
        "opts": [
          "mv",
          "ma",
          "m/v",
          "m+a"
        ],
        "ans": 1
      },
      {
        "q": "《红楼梦》的作者是？",
        "opts": [
          "罗贯中",
          "施耐庵",
          "曹雪芹",
          "吴承恩"
        ],
        "ans": 2
      },
      {
        "q": "DNA的双螺旋结构由谁发现？",
        "opts": [
          "孟德尔",
          "达尔文",
          "沃森和克里克",
          "巴斯德"
        ],
        "ans": 2
      },
      {
        "q": "勾股定理 a²+b²=?",
        "opts": [
          "c",
          "c²",
          "2c",
          "c³"
        ],
        "ans": 1
      },
      {
        "q": "经济学术语\"边际成本\"指？",
        "opts": [
          "总成本",
          "平均成本",
          "多生产一单位的成本",
          "固定成本"
        ],
        "ans": 2
      },
      {
        "q": "化学反应中\"氧化\"是失去什么？",
        "opts": [
          "中子",
          "电子",
          "质子",
          "原子核"
        ],
        "ans": 1
      },
      {
        "q": "唐朝开国皇帝是？",
        "opts": [
          "李世民",
          "李渊",
          "李治",
          "武则天"
        ],
        "ans": 1
      },
      {
        "q": "log₁₀(100) = ?",
        "opts": [
          "1",
          "2",
          "10",
          "100"
        ],
        "ans": 1
      },
      {
        "q": "光合作用产生什么气体？",
        "opts": [
          "二氧化碳",
          "氧气",
          "氮气",
          "氢气"
        ],
        "ans": 1
      },
      {
        "q": "《资本论》的作者是？",
        "opts": [
          "亚当·斯密",
          "马克思",
          "凯恩斯",
          "恩格斯"
        ],
        "ans": 1
      },
      {
        "q": "相对论由谁提出？",
        "opts": [
          "牛顿",
          "爱因斯坦",
          "霍金",
          "伽利略"
        ],
        "ans": 1
      }
    ]
  }
};
