import { lib, game, ui, get, ai, _status } from '../../noname.js';
import { config } from './config.js';
import { content } from './content.js';
import { audioText } from './audioText.js';

game.import("extension", function (lib, game, ui, get, ai, _status) {
	return {
		name: "原梗Enhanced", //扩展名
		editable: false,
		content: content,
		precontent: function () {
			lib.init.css(lib.assetURL + 'extension/原梗Enhanced', 'extension');
			game.getBolPhone = function () {
				//获取浏览器navigator对象的userAgent属性（浏览器用于HTTP请求的用户代理头的值）
				var info = navigator.userAgent;
				//通过正则表达式的test方法判断是否包含“Mobile”字符串
				var isPhone = /mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|OperaMini/i.test(info);
				//如果包含“Mobile”（是手机设备）则返回true
				return isPhone;
			};
			//   yge表示原梗扩展
			get.ygeSkillTips = function (tipname, id) {
				const ygeOverlay = ui.create.div('.yge-overlay', document.body);

				// 提示框（添加类名）
				const ygeSkillTip = ui.create.div('.yge-skill-tip', ygeOverlay);

				// 遮罩层（添加类名）
				const overlayMask = ui.create.div('.yge-overlay-mask', ygeSkillTip);

				// 文字容器（添加类名）
				const textContainer = ui.create.div('.yge-text-container', ygeSkillTip);
				textContainer.innerHTML = tipname;
				// 定位逻辑保持不变
				const updatePosition = () => {
					const target = document.getElementById(id);
					if (!target) return;

					const targetRect = target.getBoundingClientRect();
					const tipRect = ygeSkillTip.getBoundingClientRect();

					let centerX = targetRect.left + targetRect.width / 2 - tipRect.width / 2;
					let centerY = targetRect.top + targetRect.height / 2 - tipRect.height / 2;

					const safeMargin = 8;
					const viewport = {
						w: document.documentElement.clientWidth,
						h: document.documentElement.clientHeight
					};

					// 水平边界
					centerX = Math.max(safeMargin,
						Math.min(viewport.w - tipRect.width - safeMargin, centerX));

					// 垂直边界
					centerY = Math.max(safeMargin,
						Math.min(viewport.h - tipRect.height - safeMargin, centerY));

					// 移动端动态字体
					if (game.getBolPhone()) {
						const viewportW = viewport.w;
						ygeSkillTip.style.fontSize = `${Math.min(18, Math.max(14, viewportW / 25))}px`;
					}

					Object.assign(ygeSkillTip.style, {
						left: `${centerX}px`,
						top: `${centerY}px`,
						opacity: 1
					});
				};

				// 延迟定位
				setTimeout(() => {
					updatePosition();
					// 添加二次定位确保移动端准确
					requestAnimationFrame(updatePosition);
				}, 50);

				// 响应式处理（添加图片适配）
				const resizeHandler = () => {
					updatePosition();
					// 移动端图片适配
					if (game.getBolPhone()) {
						const viewportW = document.documentElement.clientWidth;
						ygeSkillTip.style.backgroundSize = '100% auto'; // 移动端适配模式
						ygeSkillTip.style.fontSize = `${Math.min(18, Math.max(14, viewportW / 25))}px`;
					} else {
						ygeSkillTip.style.backgroundSize = 'cover'; // 桌面端保持覆盖
					}
				};
				window.addEventListener('resize', resizeHandler);

				// 平滑关闭
				ygeOverlay.addEventListener('click', () => {
					ygeSkillTip.style.opacity = 0;
					setTimeout(() => {
						window.removeEventListener('resize', resizeHandler);
						ygeOverlay.remove();
					}, 150);
				});
			};

			get.ygeBolInformX = function (str1, str2) {
				const id = Math.random().toString(36).slice(-8);
				return `<a id="${id}" style="color:unset" href="javascript:void(0);" data-tip="${encodeURIComponent(str2)}" onclick="get.ygeSkillTips(decodeURIComponent(this.getAttribute('data-tip')), '${id}');">${str1}</a>`;
			};

			//武将势力
			game.addGroup("lvzhe", '旅', '旅者', { color: "#fff176" });
			game.addGroup("mengde", '蒙', '蒙德', { color: "#43a047" });
			game.addGroup("liyue", '璃', '璃月', { color: "#b71c1c" });
			game.addGroup("daoqi", '稻', '稻妻', { color: "#ab47bc" });
			game.addGroup("xumi", '须', '须弥', { color: "#66bb6a" });
			game.addGroup("zhidong", '至', '至冬', { color: "#546e7a" });	

			
			game.import('character', function (lib, game, ui, get, ai, _status) {
				var genshinImact = {
					name: 'GenshinImpactEnhanced',//武将包命名
					connect: false,//该武将包是否可以联机:否
					character: {//这里写武将
						paimengA: ["female", "lvzhe", 3, ["huobanA", "bushiA", "xiangdaoA", "danxiaoA"], []],
						putongyingA: ["female", "lvzhe", 4, ["fengrenA", "jileiA", "tongxingA"], []],
						hutaoA: ["female", "liyue", 4, ["ranhuaA", "xuehuoA", "dieyinA", "wangshengA"], []],
						zhongliA: ["male", "liyue", 4, ["yuzhangA", "fengshenA"], []],
						ganyuA: ["female", "liyue", 4, ["huolinA", "shuanghuaA", "qiyueA"], []],
						qiqiA: ["female", "liyue", "1/3", ["dueA", "yanmingA", "huihaiA"], []],
						keqingA: ["female", "liyue", 4, ["xingdouA", "leifaA", "lianzhenA"], []],
						ningguangA: ["female", "liyue", 4, ["xuanjiA", "yugeA", "caiyuanA"], []],
						shenheA: ["female", "liyue", 4, ["hongshengA", "fuhunA"], []],
						yaoyaoA: ["female", "liyue", 3, ["wuxieA", "yueguiA", "baiyuA"], []],
						yelanA: ["female", "liyue", 4, ["pojuA", "changkaoA"], []],
						yunjinA: ["female", "liyue", 4, ["qizhenA", "tinglingA", "yirongA"], []],
						xianglingA: ["female", "liyue", 4, ["baiweiA", "zaoshenA", "huoxuanA"], []],
						xingqiuA: ["male", "liyue", 4, ["huayuA", "caiyuA", "xiaguA"], []],
						xiaoA: ["male", "liyue", 4, ["jingyaoA", "yezhangA", "nizongA"], []],
						youlaA: ["female", "mengde", 4, ["jichouA", "zhuomengA", "jiawuA"], []],
						nuoaierA: ["female", "mengde", 4, ["huxinA", "saochuA"], []],
						kaiyaA: ["male", "mengde", 4, ["exiA", "menghunA", "gongyinA"], []],
						anboA: ["female", "mengde", 4, ["zhenchaA", "huoshiA", "yanhuA"], []],
						feixieerA: ["female", "mengde", 3, ["yeyaA", "zhongerA", "huangnvA", "aimiA"], []],
						diaonaA: ["female", "mengde", 3, ["jiuguanA", "tiaojiuA", "tetiaoA"], []],
						shatangA: ["female", "mengde", 4, ["lianjinA", "fenglingA", "nizaoA"], []],
						monaA: ["female", "mengde", 3, ["zhanxingA", "mingyunA", "xushiA"], []],
						wendiA: ["male", "mengde", 3, ["fengqinA", "chengfengA", "jiushiA"], []],
						keliA: ["female", "mengde", 3, ["qiangqiangA", "baozangA", "pengpengA", "daohangA"], []],
						dilukeA: ["male", "mengde", 4, ["jiuzhuangA", "yeyingA", "yujinA"], []],
						qinA: ["female", "mengde", 4, ["jinzuA", "shouhuA", "fengyinA", "tuanzhangA"], []],
						babalaA: ["female", "mengde", 3, ["yanchangA", "shengmuA", "ouxiangA"], []],
						banniteA: ["male", "mengde", 5, ["chiyongA", "yanhunA", "eyunA"], []],
						xiaogongA: ["female", "daoqi", 4, ["yanxiaoA", "xiangzhuA"], []],
						shenlilingrenA: ["male", "daoqi", 3, ["quanmouA", "jinghuaA"], []],
						fengyuanwanyeA: ["male", "daoqi", 4, ["luanlanA", "chirenA", "kongjingA"], ["doublegroup:liyue:daoqi"]],
						qiliangliangA: ["female", "daoqi", 3, ["kuaidiA", "maobuA"], []],
						zaoyouA: ["female", "daoqi", 3, ["toulanA", "bailanA", "jijinA"], []],
						jiutiaoshaluoA: ["female", "daoqi", 4, ["daibuA", "yayuA"], []],
						bachongshenziA: ["female", "daoqi", 4, ["yizhouA", "xianzhenA"], []],
						shanhugongxinhaiA: ["female", "daoqi", "1/5/3", ["miaosuanA", "hairanA", "yuehuaA"], []],
						wulangA: ["male", "daoqi", 4, ["cixiongA", "fujiA", "zhixinA"], []],
						huanglongyidouA: ["male", "daoqi", 4, ["haokuaiA", "guailiA"], []],
						jiuqirenA: ["female", "daoqi", 4, ["leilunA", "yushenA", "fushouA"], []],
						leidianjiangjunA: ["female", "daoqi", 4, ["wuxiangA", "yanshouA", "yujueA"], []],
						shenlilinghuaA: ["female", "daoqi", 4, ["bingwuA", "shuangmieA", "xianbuA"], []],
						naxidaA: ["female", "xumi", 3, ["yunzhongA", "miaodiA", "fumengA"], []],
						niluA: ["female", "xumi", 3, ["huawuA", "lunpoA"], []],
						kandisiA: ["female", "xumi", 4, ["dunchiA", "cunshouA", "juexiaoA"], []],
						duoliA: ["female", "xumi", 3, ["touziA", "zuokongA", "modengA"], []],
						kelaiA: ["female", "xumi", 3, ["molinA", "heisheA"], []],
						tinaliA: ["male", "xumi", 4, ["xunlinA", "liaoyangA"], []],
						sainuoA: ["male", "xumi", 4, ["zhuichaA", "shenpanA"], []],
						laiyilaA: ["female", "xumi", 3, ["buxunA", "anmianA", "mengyouA"], []],
						liulangzheA: ["male", "xumi", 4, ["dengshenA", "weishenA"], []],
						aierhaisenA: ["male", "xumi", 4, ["zhiyanA", "lianzhenB"], []],
						kaweiA: ["male", "xumi", 4, ["jiedaiA", "lingganA"], []],
						falushanA: ["female", "xumi", 3, ["qijingA", "tanxunA", "mituA", "jianguA"], []],
						dixiyaA: ["female", "xumi", 4, ["shiyaoA", "youzhuA"], []],
						dadaliyaA: ["male", "zhidong", 4, ["zanbieA", "kuanglanA", "duanliuA"], []],
						puniA: ["male", "shen", 7, ["HunYinA"], ["bossallowed"]],
					},
					characterSort: {//武将分包
						GenshinImpactEnhanced: {
							ziyouzhishi: ['youlaA', 'nuoaierA', 'kaiyaA', 'anboA', 'feixieerA', 'diaonaA', 'shatangA', 'monaA', 'wendiA', 'keliA', 'dilukeA', 'qinA', 'babalaA', 'banniteA'],
							qiyuezhiyan: ['hutaoA', 'zhongliA', 'ganyuA', 'qiqiA', 'keqingA', 'ningguangA', 'shenheA', 'yaoyaoA', 'yelanA', 'yunjinA', 'xianglingA', 'xingqiuA', 'xiaoA'],
							leimingyongheng: ['xiaogongA', 'shenlilingrenA', 'fengyuanwanyeA', 'qiliangliangA', 'zaoyouA', 'jiutiaoshaluoA', 'bachongshenziA', 'shanhugongxinhaiA', 'wulangA', 'huanglongyidouA', 'jiuqirenA', 'leidianjiangjunA', 'shenlilinghuaA'],
							lianaizhibing: ["dadaliyaA"],
							zhihuizhicao: ['naxidaA', 'niluA', 'kandisiA', 'duoliA', 'kelaiA', 'tinaliA', 'sainuoA', 'laiyilaA', 'liulangzheA', 'aierhaisenA', 'kaweiA', 'falushanA', 'dixiyaA'],
							mingdingzhitu: ['paimengA', 'putongyingA'],
							yiciyuan: ["puniA"],
						}
					},
					characterIntro: {//武将的介绍
						paimengA: ':旅行者在旅途中捡到的奇妙生物，同时也是旅行者前往第一座城市的引路人。白色及肩发，眼睛与背后的小披风一样，是有星空纹理的黑蓝色，不过更加地深邃神秘。远处看是蓝瞳，当有些剧情拉近了视角的话，可以看见眼中神秘的星辰。是个话痨、急性子、贪吃、小财迷，因为旅行者很多台词都被派蒙抢了，所以显得派蒙话很多。',
						putongyingA: '从世界之外漂流而来的旅行者，曾经跨越诸多世界。荧与哥哥空来到提瓦特后，遭遇了坎瑞亚覆灭导致的天变地异。先一步醒来的荧唤醒了空，要和他一起离开提瓦特。但他们很快就遇到了一位拦住去路的陌生神灵，未能逃离。',
						hutaoA: '璃月“往生堂”第七十七代堂主，掌控着璃月葬仪事务的重要人物。尽心尽力地为人们完成送别之仪，维护着世间阴阳平衡之道。除此以外还是个神奇打油诗人，诸多“杰作”被璃月人口口相传。',
						zhongliA: '本名来源于为所罗门七十二柱魔神第二十一柱魔神摩拉克斯；契约之城璃月港的建立者，“尘世七执政”中的岩神，尊号“岩王帝君”。其在人间的身份是应“往生堂”邀请而来的神秘客卿钟离。',
						ganyuA: '璃月七星的秘书，体内流淌着人类与仙兽的血脉。天性优雅娴静，但仙兽“麒麟”温柔的性情与坚定毅重的工作态度毫无冲突。毕竟，甘雨坚信自己所做的一切工作都是为了践行与帝君的契约，谋求璃月众生的最大福祉。',
						qiqiA: '药庐“不卜庐”的采药姑娘兼学徒。因“仙缘”而拥有不死之身，行动时需要自己给自己下敕令。七七的记忆力非常差，为了保证日常生活的顺利，她随身携带着一本笔记，写有各种各样的注意事项。',
						keqingA: '璃月七星中的玉衡星，负责管理土地与建设的工作。她对“帝君一言而决的璃月”颇有微词——但实际上，神挺欣赏她这样的人。她坚信与人类命运相关的事，应当由人类去做，而且人类一定可以做得更好。',
						ningguangA: '坐拥空中宫殿，有着大量传言的璃月权贵，脸上总是挂着优雅神秘的笑容。作为“璃月七星”中的天权星，她不仅象征着权力与律法，也代表着财富与才智。其名下财富之多，全大陆鲜有人能望其项背。',
						shenheA: '虽为人类之身，却是仙家弟子。过去曾生活在远离璃月港的山野之间，以红绳缚魂，修身养性。气质淡雅如仙人，身上似乎藏有某些秘密。',
						yaoyaoA: '年纪幼小的仙家弟子，个性真诚慷慨，习惯于照顾身边所有人。如今跟随居住在璃月港的师父修行，时常往返于山岭与城市之间。虽然不曾明说，但比起山中洞天，她还是更爱人间的喧嚣市集。',
						yelanA: '自称就职于总务司的神秘人士，却又是总务司名录里的“不存在之人”。神出鬼没，行踪飘忽，变幻无常，这些都是她的标志。',
						yunjinA: '“云翰社”现任当家，集剧作与演唱能力于一身的璃月戏曲名角。风格自成一派，雅致柔美，恰如其人。',
						xianglingA: '万民堂的新任大厨兼跑堂，对料理之道极具热情，最拿手的是麻辣菜肴。年纪尚轻，但厨艺精湛，在吃虎岩的老饕之中颇有名气。',
						xingqiuA: '璃月港飞云商会的二少爷，自幼便以勤奋好学、待人礼貌闻名。不过，即使是如此文雅的少年人，也有着动若脱兔的一面。',
						xiaoA: '守护璃月港的“三眼五显仙人”之一，妙称“护法夜叉大将”。虽然外表看起来是一个少年人，但一些有关他的传说，已在古卷中流传千年。',
						youlaA: '生于旧日宗室，身负罪恶血脉之人，的确需要独特的处世技巧，才能在偏见的高墙下安然行走。当然，这并不妨碍她与家族决裂，作为卓越的“浪花骑士”，在外游猎蒙德的敌人，完成她那意义独特的“复仇”。',
						nuoaierA: '和蒙德城大多数普通年轻人一样，诺艾尔梦想着成为一名光荣的西风骑士。尽管还没有获得骑士资格，她仍以女仆的身份在骑士团里工作，努力学习着骑士的言行礼仪。她始终相信，只要坚持努力，总有一天能穿上那副象征荣耀的甲胄。',
						kaiyaA: '蒙德城西风骑士团的骑兵队长。在西风骑士团里，凯亚是代理团长最信任的副手。凡是交托于他的任务，总能得到解决。在蒙德城中，风趣幽默的他同样深受人们的喜爱，然而这位谈吐不凡的骑士隐约有着什么不为人知的秘密。',
						anboA: '活泼率直的少女，是蒙德城中唯一的侦察骑士。擅长使用风之翼的安柏，连续三年蝉联蒙德城的“飞行冠军”。作为西风骑士团的新星，今天的安柏依然活跃在第一线。',
						feixieerA: '“断罪之皇女”，与名为奥兹的漆黑夜鸦同行的神秘少女。正以调查员身份供职于冒险家协会。通过自己的特殊能力加上奇妙的个性，还有本人不愿意承认的努力，菲谢尔成为了冒险家协会调查员中的新星，且成功赢得了大家的认可。',
						diaonaA: '遗传了稀薄的“非人”血统的少女，猫尾酒馆的超人气调酒师，蒙德酒业的超新星，传统势力的最大挑战者。只要经过迪奥娜之手调制的酒类，都会变成难以想象的美味佳酿。但迪奥娜本身极度厌恶酒类，所以她自诩“酒业杀手”，每天都在为了摧毁整个蒙德的酒业而努力。',
						shatangA: '对世间万物抱有强烈好奇心的炼金术士，隶属于西风骑士团，是阿贝多的助手。研究方向为“生物炼金”。她希望用炼金术改造既有的生命形态，让这个世界更加丰富多彩。',
						monaA: '蒙德的神秘少女占星术士，声称自己是“伟大的占星术士莫娜”，拥有与名号相符的不俗实力，博学而高傲。尽管过着拮据、清贫的生活，但她坚决不用占卜来牟利……正是这种坚持，导致莫娜总是在为生计发愁。',
						wendiA: '自由城邦蒙德的建立者，“尘世七执政”中的风神，为了让蒙德人民得到自由而放弃治理。千年后重返蒙德，辅助奴隶少女温妮莎推翻贵族的残暴统治，设立四风守护。',
						keliA: '西风骑士团火花骑士，永远伴随闪光与爆炸出现！然后在琴团长严厉的目光注视下默默消失。西风骑士团禁闭室的常客，蒙德的爆破大师，人称“逃跑的太阳”。',
						dilukeA: '蒙德城最大酒庄“晨曦酒庄”的庄主，蒙德商会首席，原西风骑士团骑兵队长。迪卢克掌握了蒙德的酒业之半，同时也掌握了蒙德金钱的流动脉络与酒馆的闲言碎语。某种意义而言，称得上是无冕的蒙德之王。',
						qinA: '蒙德城西风骑士团代理团长，四风守护中的南风之狮。身为西风骑士团的代理团长，琴一直忠于职守，为人们带来安宁。虽然并非天赋异禀，但通过刻苦训练，如今的她已然能够独当一面。',
						babalaA: '西风骑士团的祈礼牧师，蒙德城的闪耀偶像。对于习惯了传统吟游诗人的蒙德来说，“偶像”是还不习惯的新生事物。但在蒙德，人人都爱芭芭拉。',
						banniteA: '蒙德的冒险家少年，拥有与他的善良毫不相称的霉运。「只要和班尼特反着来,一切冒险都会顺利无比。」——此为蒙德城前任冒险家赫尔曼的「冒险经验」之一。',
						xiaogongA: '花见坂才华横溢的烟花工匠。“长野原烟花店”现任店主，被誉为“夏祭的女王”，在稻妻城内可谓是家喻户晓。热情似火的少女，未泯的童心与匠人的执着在她身上交织出了奇妙的焰色反应。',
						shenlilingrenA: '社奉行神里家现任家主。总有办法以周全的手段实现自身目的。不过，鲜少有人知道他如今最在意的“目标”是什么。',
						fengyuanwanyeA: '稻妻出身的浪人武士，如今栖身于璃月船队“南十字”中。为人谦和，个性温顺。年轻潇洒的外表下埋藏着许多往事。看似随性，心中却有独属于自己的行事准则。',
						qiliangliangA: '稻妻快递公司“狛荷屋”的送货员，长有两条好动的尾巴，是一只热爱自己工作，向往人类社会的“猫又”。狛荷屋“金牌级快递员”绮良良并非浪得虚名。不论是派送速度，还是货物安全，绮良良的水平都是一流的。',
						zaoyouA: '隶属于秘密组织“终末番”的特别忍者，对睡眠和长高有着异乎常人的追求。 掌握一切可用于逃跑、隐蔽的忍术，以此为自己创造偷懒睡觉的机会。如此神奇的手段，或许会有意想不到的用途。',
						jiutiaoshaluoA: '行如风，言如誓，是位魄力过人的女性。她有着“神的笃信者”之名，将全部忠心都奉献给了雷电将军。将军所追求的“永恒”，也是她愿意为之而战的信念。',
						bachongshenziA: '掌管鸣神大社的大巫女、狐之血脉的延续者、“永恒”的眷属与友人，以及，轻小说出版社“八重堂”的恐怖总编。有着多重身份的神秘宫司，凡人或许永远无法了解她的真面目与真心。',
						shanhugongxinhaiA: '稻妻海祇岛珊瑚宫的“现人神巫女”，也是现任海祇岛最高领袖。她通读兵法、擅长谋略，在军事上有着独特见解，也能将内政、外交等工作处理得井井有条。不过这位人们眼中深不可测的领导者，似乎也有不为人知的一面。',
						wulangA: '海祇岛珊瑚宫反抗军的大将，身具领兵者威严的同时，又无高位者的倨傲。乐于助人，喜欢在八重堂通过信件解答有困难之人的问题，但信件在送出前被八重神子将寄件人偷偷改名为希娜，还为希娜做了人设图给粉丝传播。',
						huanglongyidouA: '鬼族的后裔，性情豪爽热血的快意男儿。如风一般迅猛，也如雷一般夺目。',
						jiuqirenA: '“荒泷派”二把手。脸上戴着一只造型别致的面铠，不苟言笑。很少有人知道，为什么这种级别的人才会跑去混街头帮派。更没有人知道，她面铠下藏着怎样的真容。',
						leidianjiangjunA: '“尘世七执政”中的雷神，尊号“雷电将军”，是初代雷神巴尔的妹妹兼影武者。此世最殊胜威怖的雷霆化身，稻妻幕府的最高主宰。挟威权之鸣雷，逐永恒之孤道的寂灭者。',
						shenlilinghuaA: '稻妻“社奉行”神里家的大小姐。容姿端丽，品行高洁。绫华贵为“公主”，平日主理家族内外事宜。绫华常出现在社交场合，与民间交集也较多。因此，更被人们熟悉的她反而获得了高于兄长的名望，被雅称为“白鹭公主”。',
						naxidaA: '“尘世七执政”中的草神，被须弥人给予“小吉祥草王”的爱称。现今七神中最年轻的一位，自诞生起已五百年 。纳西妲深居于净善宫内，向来不受重视，也很少被人提及。她身负重任，哪怕目睹漆黑，经历孤独，也不曾停下脚步 。',
						niluA: '“祖拜尔剧场”的明星演员，舞姿娉婷，如睡莲初绽，一尘不染。但她绝非高傲清冷之人，即便只是匆匆的旅者，也会对她纯洁质朴的笑容过目不忘。',
						kandisiA: '有着琥珀色左眼的赤王后裔，阿如村的守护者，为人温柔和善。在她的守护下，几乎没人能够危害阿如村 。',
						duoliA: '活跃在须弥的百货商人，最喜欢亮闪闪的摩拉。能靠着精湛话术将手里那些许多奇特又神秘的道具卖出高价。',
						kelaiA: '活跃于道成林的见习巡林员，积极乐观，热情善良。很少有人知晓她来化城郭前的经历，而她自己也绝口不提任何往事，不过，夜深时分，她偶尔还会想起被她深深藏起的往事。尽管现状安好，她也依然希望自己能再努力一些，快快进步，这样才能尽早战胜过去那个软弱的自己。',
						tinaliA: '道成林的巡林官，毕业于须弥教令院阿弥利多学院的生论派植物学学者。',
						sainuoA: '教令院的大风纪官，所有风纪官们的首领。拥有的独特幽默感令人印象深刻。',
						laiyilaA: '梨多梵谛学院的学生，为学业愁黑了眼眶，总是一副睡眠不足的样子。但无论课业多重，她总能拿出最精彩的推演，叫人不得不怀疑，她是否连做梦都在写论文？',
						liulangzheA: '若有心者方为人，他不可称之为人。若无心者亦有悲喜苦乐，他便是最像人的人偶。',
						aierhaisenA: '须弥教令院六大学派之一“知论派”的学者，现任教令院书记官，曾任代理贤者一职，有过人的智慧与才能，生活得自由自在，一般人基本找不到他。',
						kaweiA: '须弥著名建筑设计师，对太多事物抱有过度关怀心。出身教令院妙论派的他一度被追捧为近几十年最优秀的建筑设计师，享有妙论派之光的美名，代表作为卡萨扎莱宫。',
						falushanA: '须弥教令院知论派名宿。来自“一百年前”的教令院杰出学者，古典机关术学科奠基人之一。虽然身在知论派，却以机关造诣闻名须弥…尽管这些荣誉，都已先于她本人被岁月遗忘。',
						dixiyaA: '横行须弥沙漠的佣兵组织“炽光猎兽”的成员，勇敢而又强大的战士，号称“炽鬃之狮”，登上了“镀金旅团”的传说实力榜前列，在“镀金旅团”内部声名赫赫，即使处于危机中也能给人带来万分的安全感。',
						dadaliyaA: '至冬国外交使团愚人众十一执行官末席，代号“公子”，负责与璃月的外交。一个忠情战斗、忠实于身体感受的追逐者，其战绩威名远扬。',
						puniA: "不知它来自哪里、诞生于何时，因为它的力量可以扭曲时空；它的强大让我们无法探测、无法控制，也许它只是个传说。",
					},
					characterTitle: {
						puniA: "赛尔信仰·神灵",
						leidianjiangjunA: "梦想一心",
						shenlilinghuaA: "白鹭公主",
						shenlilingrenA: "万水一露",
						qiqiA: "肚饿真君",
						zhongliA: "岩王帝君",
						keqingA: "牛杂师傅",
						xiaoA: "护法夜叉",
						xingqiuA: "侠骨少年",
						xianglingA: "万民百味",
						ganyuA: "循循守月",
						hutaoA: "雪霁梅香",
						ningguangA: "掩月天权",
						bachongshenziA: "玲珑油豆腐",
						wendiA: "风色诗人",
						anboA: "飞行冠军",
						youlaA: "浪沫的旋舞",
						banniteA: "命运试金石",
						shatangA: "无害甜度",
						shanhugongxinhaiA: "眠龙·真珠之智",
						fengyuanwanyeA: "叶天帝",
						naxidaA: "白草净华"
					},
					/**@type { importCharacterConfig['skill'] } */
					skill: {
						HunYinA: {
							audio: 2,
							forced: true,
							charlotte: true,
							derivation: ["HunYinB", "HunYinA_2", "HunYinA_3", "HunYinA_4", "HunYinA_5", "HunYinA_6", "HunYinA_7"],
							trigger: {
								global: "roundStart",
							},
							filter: function (event, player) {
								return player.isIn() && game.roundNumber <= 7;
							},
							content: function () {
								var skill;
								switch (game.roundNumber) {
									case 1:
										skill = "HunYinB";
										break;
									case 2:
										skill = "HunYinA_2";
										break;
									case 3:
										skill = "HunYinA_3";
										break;
									case 4:
										skill = "HunYinA_4";
										break;
									case 5:
										skill = "HunYinA_5";
										break;
									case 6:
										skill = "HunYinA_6";
										break;
									case 7:
										skill = "HunYinA_7";
										break;
								};
								player.addAdditionalSkills("HunYinA", skill);
							},
							group: ['HunYinA_1'],
							subSkill: {
								"1": {
									frequent: true,
									popup: false,
									trigger: {
										player: ["phaseJudgeBefore", "phaseDiscardBefore"],
									},
									filter: function (event, player, name) {
										return player.isIn();
									},
									content: function () {
										trigger.cancel();
									},
									mod: {
										/*使用牌无距离限制*/
										targetInRange: function (card, player, target, now) {
											return true;
										},
										/*使用牌无次数限制*/
										cardUsable: function (card, player) {
											return Infinity;
										},
									},
									sub: true,
									"_priority": 0,
								},
								"2": {
									forced: true,
									trigger: {
										player: "damageBegin4",
										global: "damageEnd",
									},
									filter: function (event, player, name) {
										if (name == "damageBegin4") return !event.nature;
										else return event.nature && event.source && event.source != player && event.source.countCards("he") > 0;
									},
									content: function () {
										if (event.triggername == 'damageBegin4') {
											trigger.cancel();
										} else {
											player.gain(trigger.source.getCards("he"), trigger.source, "gain2");
										}
									},
									sub: true,
									ai: {
										nodamage: true,
										effect: {
											target: function (card, player, target) {
												if (!get.tag(card, 'natureDamage')) {
													return [0, 0];
												}
											},
										},
									},
									"_priority": 9,
								},
								"3": {
									forced: true,
									trigger: {
										player: "damageEnd",
									},
									filter: function (event, player) {
										if (event._notrigger.contains(event.player)) return false;
										return event.source && event.source != player && game.countPlayer() >= 2;
									},
									content: function () {
										"step 0"
										event.damageNumber = trigger.num;
										player.chooseTarget([1, game.countPlayer() - 1], '令任意名其他角色受到等量神圣伤害并翻面', function (card, player, target) {
											return player != target
										}, true).set('ai', function (target) {
											return -get.attitude(player, target);
										});
										"step 1"
										result.targets.sortBySeat();//按位置结算
										for (var i = 0; i < result.targets.length; i++) {
											result.targets[i].damage(event.damageNumber)._triggered = null;
											result.targets[i].turnOver();
										}
									},
									ai: {
										maixie: true,
										maixie_defend: true,
										effect: {
											target: function (card, player, target) {
												if (get.tag(card, "damage")) return [1, 0, -1, 0];
											},
										},
									},
									sub: true,
									"_priority": 9,
								},
								"4": {
									forced: true,
									trigger: {
										global: "phaseEnd",
									},
									filter: function (event, player, name) {
										return player.isDamaged() && player.isIn();
									},
									content: function () {
										'step 0'
										var num = player.maxHp - player.hp;
										player.recover(num);
										player.draw(num);
										'step 1'
										player.chooseTarget('令一名其他角色回复体力至上限并摸等量的牌', function (card, player, target) {
											return player != target
										}).set('ai', function (target) {
											return get.attitude(player, target);
										});
										'step 2'
										if (result.bool) {
											for (var i = 0; i < result.targets.length; i++) {
												var num = result.targets[i].maxHp - result.targets[i].hp;
												result.targets[i].recover(num);
												result.targets[i].draw(num);
											}
										}
										else event.finish();
									},
									ai:
									{
										order: function () {
											return get.order({ name: 'tao' }) - 6;
										},
									},
									sub: true,
									"_priority": 9,
								},
								"5": {
									usable: 7,
									forced: true,
									trigger: {
										player: "useCardEnd",
									},
									filter: function (event, player) {
										return player.isIn() && event.cards.filterInD().length > 0;
									},
									content: function () {
										player.gain(trigger.cards.filterInD(), "gain2", "log");
									},
									sub: true,
									"_priority": 9,
								},
								"6": {
									forced: true,
									trigger: {
										global: "phaseEnd",
									},
									filter: function (event, player) {
										return player.isIn() && event.player != player;
									},
									content: function () {
										player.insertPhase();
									},
									sub: true,
								},
								"7": {
									forced: true,
									trigger: {
										player: "loseAfter",
										global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
									},
									filter: function (event, player) {
										var evt = event.getl(player);/*event.getl(player)是获取角色失去的牌*/
										if (!evt || !evt.cards2 || !evt.cards2.length) return false;
										/*cards2是排除判定区的牌，cards包含hej*/
										return true;
									},
									content: function () {
										player.draw(trigger.getl(player).cards2.length);
									},
									ai: {
										noh: true,
									},
									sub: true,
									"_priority": 10,
								},
							},
							ai: {
								threaten: 2.6,
							},
							"_priority": 10,
						},
						HunYinB: {
							enable: ["chooseToUse", "chooseToRespond"],
							mark: true,
							markText: "虚",
							intro: {//标记介绍
								name: "虚无",
								content: "神灵救世光",
							},
							init: function (player) {//初始化(好习惯)，获得这个技能时执行的内容
								player.storage.HunYinB = 3;//初始为3个虚无标记
								player.syncStorage("HunYinB");//同步标记(每当标记变动都要写这句)
								//注:标记名必须和技能名相同
							},
							onremove: true,
							hiddenCard: function (player, name) {
								if (!lib.inpile.includes(name) || !player.countMark('HunYinB')) return false;
								var type = get.type(name);
								return (type == 'basic' || type == 'trick');
							},
							filter: function (event, player) {
								if (player.storage.HunYinB == 0) return false;
								for (var name of lib.inpile) {
									var type = get.type(name);
									if (type == 'basic' || type == 'trick') {
										if (event.filterCard(get.autoViewAs({ name: name }, 'unsure'), player, event)) return true;
										if (name == 'sha') {
											for (var j of lib.inpile_nature) {
												if (event.filterCard(get.autoViewAs({ name: name, nature: j }, 'unsure'), player, event)) return true;
											}
										}
									}
								}
								return false;
							},
							chooseButton: {
								dialog: function (event, player) {
									var list = [];
									for (var name of lib.inpile) {
										var type = get.type(name);
										if (!(type == 'basic' || type == 'trick')) continue;
										if (event.filterCard(get.autoViewAs({ name: name }, 'unsure'), player, event)) list.push([get.translation(get.type(name)), '', name]);
										if (name == 'sha') {
											for (var j of lib.inpile_nature) {
												if (event.filterCard(get.autoViewAs({ name: name, nature: j }, 'unsure'), player, event)) list.push(['基本', '', 'sha', j]);
											}
										}
									}
									return ui.create.dialog('虚无', [list, 'vcard']);
								},
								filter: function (button, player) {
									return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
								},
								check: function (button) {
									if (_status.event.getParent().type != 'phase') return 1;
									var player = _status.event.player;
									if (['wugu', 'zhulu_card', 'yiyi', 'lulitongxin', 'lianjunshengyan', 'diaohulishan'].includes(button.link[2])) return 0;
									return player.getUseValue({ name: button.link[2], nature: button.link[3] });
								},
								backup: function (links, player) {
									return {
										filterCard: false,//不用弃牌
										selectCard: 0, //弃牌数为零
										viewAs: { name: links[0][2], nature: links[0][3] },
										precontent: function () {
											player.removeMark('HunYinB', 1);
											player.syncStorage("HunYinB");
										},
									}
								},
								prompt: function (links, player) {//输出的提示性语句
									return '视为使用了' + (get.translation(links[0][3]) || '') + get.translation(links[0][2]) + '卡牌';
								},
							},
							mod: {
								targetEnabled: function (card, player, target) {
									if (player != target) return false;
								},
							},
							group: ["HunYinB_1"],
							subSkill: {
								"1": {
									charlotte: true,
									silent: true,/**相当于forced:true+popup:false 技能静默发动 */
									trigger: {
										global: "phaseBegin",
									},
									filter: function (event, player) {
										return player.hasSkill("HunYinB");
									},
									content: function () {
										let num = player.countMark("HunYinB");
										if (num != 3)
											player.addMark("HunYinB", 3 - num);
									},
									sub: true,
								},
								backup: {},
							},
							ai: {
								fireAttack: true,
								respondSha: true,
								respondShan: true,
								skillTagFilter: function (player, tag, arg) {
									if (!player.hasMark('HunYinB')) return false;
								},
								order: function (item, player) {
									if (player && _status.event.type == 'phase') {
										var max = 0, add = false;
										var types = ['basic', 'trick'];
										var list = lib.inpile.filter(name => types.includes(get.type(name)));
										if (list.includes('sha')) add = true;
										list = list.map(namex => { return { name: namex } });
										if (add) lib.inpile_nature.forEach(naturex => list.push({ name: 'sha', nature: naturex }));
										for (var card of list) {
											if (player.getUseValue(card) > 0) {
												var temp = get.order(card);
												if (temp > max) max = temp;
											}
										}
										if (max > 0) max += 0.3;
										return max;
									}
									return 1;
								},
								result: {
									player: function (player) {
										if (_status.event.dying) return get.attitude(player, _status.event.dying);
										return 1;
									},
								},
							},
						},
						ranhuaA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							forced: true,
							trigger: {
								player: "phaseBegin",
							},
							filter: (event, player) => event.player.hp > 1,
							async content(event, trigger, player) {
								await player.loseHp();
							},
							group: ["ranhuaA_draw"],
							subSkill: {
								draw: {
									popup: false,//不进行log
									forced: true,
									trigger: {
										player: "loseHpAfter",
									},
									filter: function (event, player) {
										return event.player.isIn();
									},
									async content(event, trigger, player) {
										const number = player.getDamagedHp();
										await player.chooseToGuanxing(number * 2);//卜算2倍的已损失体力值
										await player.draw(number);
									},
									sub: true,
								},
							},
							ai: {
								threaten: 1.3,
							},
							"_priority": 8,
						},
						xuehuoA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							charlotte: true,
							forced: true,
							trigger: {
								source: "damageBefore",
							},
							filter: function (event, player) {
								if (event.hasNature("fire") && event.player != player) return player.isIn();
							},
							content: function () {
								trigger.num += player.getDamagedHp();
							},
							group: ["xuehuoA_directHit"],
							subSkill: {
								directHit: {
									silent: true,
									trigger: {
										player: "useCard",
									},
									filter: function (event, player) {
										if (player.hp <= Math.ceil(player.maxHp / 2) && event.card && event.card.name == 'sha') {
											return game.hasPlayer((current) => current != player && event.targets.includes(current));
										};
										return false;
									},
									content: function () {
										let targets = game.filterPlayer((current) => current != player && trigger.targets.includes(current));
										for (const target of targets) target.popup('无法响应');
										trigger.directHit.addArray(targets);
									},
									ai: {
										threaten: 2.2,
										"directHit_ai": true,
									},
									sub: true,
								},
							},
							mod: {
								globalFrom: function (from, to, distance) {
									return distance - from.getDamagedHp();
								},
								aiValue: function (player, card, num) {
									/*更改AI对牌回合内使用价值的判断(player为你，card为要改变value的卡，num为上次判断后的value值)
									参考技能【立牧】【新服缮甲】*/
									if (get.tag(card, 'fireDamage') || card.name == "sha") return num * Math.max(player.getDamagedHp(), 2);

								},
								aiOrder: function (player, card, num) {
									/*更改AI使用卡的顺序(player为你，card为要判断的牌，num为上次判断后的order值)
									参考技能【渐营】【奋音】【联翩】*/
									if (get.tag(card, 'recover')) return Math.floor(num / player.hp) - 1;
								},
							},
							ai: {
								unequip: true,
								skillTagFilter: function (player, tag, arg) {
									if (tag == "unequip" && player.hp <= Math.ceil(player.maxHp)) return true;
								},
							},
							"_priority": 0,
						},
						wangshengA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							frequent: true,//不写check时，check默认值为true
							popup: false,
							trigger: {
								global: "die",
							},
							filter: function (event, player) {
								return event.player != player && player.isIn();
							},
							async content(event, trigger, player) {
								player.logSkill(event.name, trigger.player);
								event.cards = trigger.player.getCards('he');
								if (event.cards.length) await player.gain(event.cards, trigger.player);
								const target = trigger.player;
								const list = [];
								if (lib.character[target.name]) list.addArray(lib.character[target.name][3]);
								if (lib.character[target.name1]) list.addArray(lib.character[target.name1][3]);
								if (lib.character[target.name2]) list.addArray(lib.character[target.name2][3]);
								let gainlist = list.map(skill => [
									skill,
									'<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><span class="skill fire-text">【' +
									get.translation(skill) +
									'】： </span><span class="fire-text">' +
									lib.translate[skill + '_info'] +
									'</span></div>'
								]);
								let result = await player.chooseButton(["请选择任意个技能获得", [gainlist, "textbutton"]])//这里传入gainlist是二维数组，实际渲染时只会使用翻译的部分，技能id用于后面addSkill。
									.set("selectButton", [1, gainlist.length])
									.set("ai", button => ["in", "out"].reduce((sum, dir) => sum + get.skillRank(button.link, dir, true), 0) > 2)//统计技能在回合内外的价值，总价值大于2则选择
									.forResult();
								if (result.bool) {
									player.addSkills(result.links);
								}
							},
							"_priority": 10,
						},
						dieyinA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							direct: true,
							locked: true,
							trigger: {
								player: "useCardToPlayered",
							},
							filter: function (event, player) {
								return event.card && event.card.name == 'sha';
							},
							content: function () {
								'step 0'
								let target = trigger.target;
								player.chooseBool()
									.set('prompt', "是否令" + get.translation(trigger.card) + "追加火属性？")
									.set('ai', () => !target.hasSkillTag('nofire'))
								'step 1'
								if (result.bool) {
									player.logSkill('dieyinA');
									if (player.hp > 1) player.loseHp();
									game.setNature(trigger.card, "fire", true);//给卡牌添加火属性,true参数为属性追加，为false则是修改属性
								}
							},
							mod: {
								cardUsable: function (card, player, num) {
									if (card.name == 'sha') return num + player.getDamagedHp();
								},
								aiOrder: function (player, card, num) {
									/*更改AI使用卡的顺序(player为你，card为要判断的牌，num为上次判断后的order值)
									参考技能【渐营】【奋音】【联翩】*/
									if (card.name == "sha") return num * Math.max(player.getDamagedHp(), 2);
								},
							},
							ai: {
								effect: {//牌的影响
									player: function (card, player, target) {//你使用牌时对你的影响
										if (card.name == "sha") {
											return [1, 3, 3, 0];
										}
									},
								},
							},
							"_priority": 0,
						},
						yuzhangA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							trigger: {
								player: "phaseBegin",
							},
							charlotte: true,
							forced: true,
							unique: true,
							marktext: "磐石",
							intro: {
								name: "壁立千仞",
								"name2": "磐石",
								content: "当前有#个“磐石”",
							},
							init: (player, skill) => player.addMark("yuzhangA", player.maxHp),//标记类技能都需要初始化，注意
							filter: function (event, player, name) {
								return player.isIn() && player.countMark("yuzhangA") < player.maxHp;
							},
							content: function () {
								let num = player.countMark("yuzhangA");
								player.addMark("yuzhangA", player.maxHp - num);
							},
							mod: {
								maxHandcard: function (player, num) {
									return num + player.countMark("yuzhangA");
								},
								canBeGained: function (card, player, target, name, now) {
									return player.hasMark("yuzhangA") && ['h', 'e'].includes(get.position(card)) && player != target;
								},
								canBeDiscarded: function (card, player, target, name, now) {
									return player.hasMark("yuzhangA") && ['h', 'e'].includes(get.position(card)) && player != target;
								},
							},
							group: ["yuzhangA_defend"],
							subSkill: {
								defend: {
									audio: "yuzhangA",
									forced: true,
									trigger: {
										player: "damageBefore",
									},
									filter: function (event, player) {
										return player.countMark("yuzhangA") > 0;
									},
									async content(event, trigger, player) {
										trigger.cancel();
										player.removeMark('yuzhangA', 1);
										const num = game.countPlayer(current => current.isDamaged());
										await player.draw(num + 2);
									},
									ai: {
										nodamage: true,
										maxie: true,
										maixie_hp: true,
										skillTagFilter: function (player, tag, arg) {//技能标签限制条件
											if (player.countMark("yuzhangA") == 0) return false;
										},
										effect: {
											target: function (card, player, target) {
												if (player.hasSkillTag("jueqing", false, target)) return;//如果使用者有“绝情”标签，无视该技能。特殊标签，不是常规标签，不加也没问题
												if (get.tag(card, "damage") && target.hasMark("yuzhangA")) return [0, 5];
												if (get.tag(card, "loseCard" && target.hasMark("yuzhangA") && player != target)) return "zerotarget";
											},
										},
									},
									sub: true,
								},
							},
							"_priority": 0,
						},
						fengshenA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							enable: "phaseUse",
							usable: 1,
							locked:true,
							skillAnimation: true,
							animationStr: "天动万象",
							animationColor: "metal",
							selectCard: () => _status.event.player.countMark("yuzhangA"),
							position: "h",
							filterCard: card => get.type(card) === "basic",
							complexCard: true,
							selectTarget: [1, Infinity],
							filterTarget: (card, player, target) => player != target,
							multiline: true,
							multitarget: true,
							async content(event, trigger, player) {
								const discardNumber = player.countMark("yuzhangA");
								game.log(player, "弃置了" + discardNumber + "张手牌");
								player.removeMark("yuzhangA", discardNumber);
								for (const target of event.targets) {
									await target.damage(Math.max(discardNumber, 3), "notrigger");//对damageBegin1、damageBegin2之类的时机无效
								}
							},
							check: function (card) {
								if (get.type(card) == 'basic') return 10 - get.value(card);
							},
							ai: {
								order: 10,
								expose: 0.8,
								threaten: 3,
								result: {
									target: (player, target) => -2 * player.countMark("yuzhangA"),
								},
							},
							"_priority": 0,
						},
						wuxiangA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							forced: true,
							zhuanhuanji: true,
							mark: true,
							marktext: "☯",
							intro: {
								content: function (storage, player, skill) {
									if (player.storage.wuxiangA == true)
										return '你使用【杀】无视防具且不可响应。';
									return '当其他角色使用带有「伤害」标签的牌指定你为目标时，你取消此目标并获得一点护甲。';
								},
							},
							mod: {
								cardnature: function (card, player) {
									if (card.name == "sha") return 'thunder';
								},
								targetInRange: function (card, player, target, now) {
									if (card.name == "sha") return true;
								},
							},
							group: ["wuxiangA_1", "wuxiangA_2", "wuxiangB"],
							subSkill: {
								"1": {
									audio: 2,
									forced: true,
									trigger: {
										player: "useCard",
									},
									"prompt2": "你使用【杀】无视防具且不可响应。",
									filter: function (event, player, name) {
										if (name == "useCard")
											return event.card && event.card.name == 'sha' && player.storage.wuxiangA;
									},
									logTarget: "target",
									content: function () {
										'step 0'
										trigger.directHit.addArray(trigger.targets);
										player.addTempSkill('unequip');
									},
									ai: {
										threaten: 1.3,
										damage: true,
										unequip: true,
										skillTagFilter: function (player, tag, arg) {//技能标签限制条
											if (tag == "unequip" && player.storage.wuxiangA) return true;
											if (tag == "damage" && player.storage.wuxiangA) return true;
										},
									},
									sub: true,
								},
								"2": {
									audio: 2,
									forced: true,
									trigger: {
										global: "useCard",
									},
									"prompt2": "当其他角色使用带有「伤害」标签的牌指定你为目标时，你取消此目标并获得一点护甲。",
									filter: function (event, player) {
										if (!event.targets.contains(player)) return false;
										if (event.player == player) return false;
										if (!get.tag(event.card, 'damage')) return false;
										return !player.storage.wuxiangA;
									},
									logTarget: "player",
									content: function () {
										'step 0'
										player.logSkill('wuxiangA');
										trigger.excluded.add(player);
										player.popup("枷锁当断");
										player.changeHujia();
									},
									ai: {
										nodamage: true,
										effect: {//牌的影响
											target: function (card, player, target) {//你成为牌的目标时对你的影响
												if (get.tag(card, "damage")) {
													return [0, 2];
												}
											},
										},
										skillTagFilter: function (player, tag, arg) {//技能标签限制条件
											if (tag == "nodamage" && !player.storage.wuxiangA) return true;
										},
									},
									sub: true,
								},
							},
							"_priority": 0,
						},
						wuxiangB: {
							direct: true,
							locked: true,
							trigger: {
								player: 'phaseBegin',
							},
							filter: function (event, player) {
								return player.isIn();
							},
							content: function () {
								player.changeZhuanhuanji('wuxiangA');
								game.delayx();
							},
						},
						zhenshuoA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							direct: true,
							trigger: {
								source: "damageSource",
							},
							filter: function (event, player) {
								return event.getParent().name == 'sha' && event.nature == 'thunder' && event.notLink();
							},
							content: function () {
								"step 0"
								player.chooseTarget([1, 3], '你可以令至多三名其他角色受到1点雷属性伤害且若其未翻面，使之翻面', function (card, player, target) {
									return player != target
								}).set('ai', function (target) {
									return -get.attitude(player, target);   //这一行是AI
									//（上一行）若要选择队友则返回正值 return get.attitude(player,target);            
								});
								"step 1"
								if (result.bool) {
									player.logSkill('zhenshuoA');
									for (var i = 0; i < result.targets.length; i++) {
										result.targets[i].damage('thunder');
										if (!result.targets[i].isTurnedOver())
											result.targets[i].turnOver();
									}

								}
								else event.finish();
							},
							"_priority": 0,
						},
						yujueA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							enable: "phaseUse",
							limited: true,
							selectCard: 0,
							discard: false,
							lose: false,
							delay: false,
							selectTarget: 2,
							targetprompt: ["先出杀", "后出杀"],
							multitarget: true,
							skillAnimation: true,
							animationStr: "寂灭之时",
							animationColor: "thunder",
							group: ["yujueB"],
							init: function (player) {//初始化
								player.storage.yujueA = false;//技能未发动(xx为技能名)
							},
							filter: function (event, player) {
								return game.countPlayer(function (current) {
									return current != player;
								}) > 1 && player.storage.yujueA == false && player.hp <= Math.floor(player.maxHp / 2);
							},
							filterTarget: function (card, player, target) {
								return player != target;
							},
							content: function () {
								'step 0'
								targets[1].useCard({
									name: 'juedou',
									isCard: true
								}, 'nowuxie', targets[0], 'noai').animate = false;
								game.delay(0.5);
								'step 1'
								player.storage.yujueA = true;//技能发动过
								player.awakenSkill("yujueA");//技能文本变灰(失去技能，标记消失
							},
							ai: {
								order: 8,
								result: {
									target: function (player, target) {
										return get.effect(target, { name: 'juedou' }, ui.selected.targets[0], target) - 20;
									},
								},
								expose: 0.4,
								threaten: 3,
							},
							group: ["yujueA_kill"],
							subSkill: {
								kill: {
									trigger: {
										global: "damageAfter",
									},
									forced: true,
									popup: false,
									filter: function (event, player) {
										return event.getParent(3).name == 'yujueA' && event.player.hp > 0;
									},
									content: function () {
										trigger.player.die();
									},
									sub: true,
								},
							},
						},
						yanshouA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							charlotte: true,
							enable: "phaseUse",
							usable: 1,
							filter: function (event, player) {
								return game.hasPlayer(current => current != player && !current.hasMark('yanshouB'));
							},
							selectTarget: 1,
							filterTarget: (card, player, target) => (target != player && !target.hasMark('yanshouB')),
							content: function () {
								target.addMark('yanshouB');
								target.addTempSkill('yanshouB', { player: "die" });
								target.addTempSkill('baiban', { player: "die" });
							},
							mod: {
								cardUsableTarget: function (card, player, target) {
									if (target.hasMark("yanshouB")) return true;
								},
							},
							ai: {
								threaten: 1.2,
								order: 10,
								effect: {//牌的影响
									player: function (card, player, target) {//你使用牌时对你的影响
										if (card.name == "sha" && target.hasMark("yanshouB")) {
											return [0, 2, -1, -10];
										}
									},
								},
								result: {//主动技的收益，返回值只能是1个数字
									target: function (player, target) {//发动这个技能对目标的收益
										return -20;
									},
								},
							},
							"_priority": 10,
						},
						yanshouB: {
							popup: false,
							charlotte: true,
							unique: true,
							onremove: true,
							frequent: true,
							marktext: "狩",
							intro: {
								name: "眼狩",
								content: "受到的雷属性伤害加倍",
							},
							trigger: {
								player: "damageBegin",
							},
							filter: function (event, player) {
								return player.hasMark('yanshouB') && event.nature == "thunder" && event.source;
							},
							content: function () {
								trigger.num *= 2;
							},
							ai: {
								threaten: 2.5,
								effect: {//牌的影响
									target: function (card, player, target) {
										if (get.tag(card, "damage") && card.nature == "thunder") {
											return 2;
										}
									},
								},
							},
							sub: true,
							"_priority": 0,
						},
						jichouA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							group: ["jichouB", "jichouC"],
							forced: true,
							onremove: true,
							trigger: {
								player: "damageEnd",
							},
							filter: function (event, player) {
								if (event._notrigger.contains(event.player)) return false;
								return event.source != player && event.source;
							},
							content: function () {
								"step 0"
								event.count = trigger.num * 3;
								event.target = trigger.source;
								"step 1"
								if (event.target.countCards('he') >= event.count) {
									player.choosePlayerCard(event.target, event.count, 'he', true, "选择" + get.translation(event.target) + "的" + event.count + "张牌", "visible").set('ai', function (button) {
										var val = get.buttonValue(button);
										return val;
									});
									event.goto(2);
								}
								else event.goto(3);
								"step 2"
								player.addToExpansion(result.cards, event.target, 'give').gaintag.add('jichouB');
								game.log(player, '将', event.target, "的", result.cards, '置于武将牌上作为“仇”');
								event.finish();
								"step 3"
								if (!event.target.isTurnedOver()) event.target.turnOver();
								event.finish();
							},
							ai: {
								expose: 0.9,
								threaten: 0.8,
								maxie: true,
								maixie_defend: true,
								pretao: true,
								effect: {
									target: function (card, player, target) {
										if (player.hasSkillTag('jueqing', false, target)) return [1, -1.5];
										if (!target.hasFriend()) return;
										if (get.tag(card, 'damage')) return [2, 3, -2, -3];
									},
								},
							},
							"_priority": 10,
						},
						jichouB: {
							popup: false,
							unique: true,
							onremove: function (player, skill) {
								var cards = player.getExpansions("jichouB");
								if (cards.length) player.loseToDiscardpile(cards);
							},
							mark: true,
							marktext: "仇",
							forced: true,
							intro: {
								name: "记仇",
								mark: function (dialog, content, player) {
									var content = player.getExpansions('jichouB');
									if (content && content.length) {
										if (player == game.me || player.isUnderControl()) {
											dialog.addAuto(content);
										}
										else {
											return '共有' + get.cnNumber(content.length) + '张仇';
										}
									}
								},
							},
							"_priority": 0,
						},
						jichouC: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							unique: true,
							forced: true,
							trigger: {
								player: "phaseBegin",
							},
							filter: function (event, player) {
								return player.getExpansions("jichouB").length > 0;
							},
							content: function () {
								var cards = player.getExpansions("jichouB");
								player.gain(cards, "gain2", "fromStorage");
							},
							"_priority": 0,
						},
						zhuomengA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							frequent: true,
							group: ['zhuomengB'],
							init: function (player) {
								//技能初始化，在游戏开始时或获得技能时调用一次
								player.storage.zhuoMengCards = ["chaojuanbingxueA",
									"guangchaohuanxiangA",
									"ninglangguangjianA"];
							},
							trigger: {
								player: "useCardAfter",
							},
							filter: function (event, player) {
								return event.card.name == "jiu";
							},
							content: function () {
								var cards = [];
								for (var i = 0; i < 3; i++) {
									var card = game.createCard(player.storage.zhuoMengCards.randomGet());
									if (card) cards.push(card);
								}
								player.gain(cards, 'draw2');
							},
							"_priority": 0,
						},
						zhuomengB: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							frequent: true,
							trigger: {
								global: "phaseEnd",
							},
							filter: function (event, player) {
								return event.player != player && event.player.getHistory("sourceDamage", function (evt) {
									return evt.player == player;
								}).length;
							},
							content: function () {
								player.useCard({ name: 'jiu', isCard: false }, player);
							},
							"_priority": 8,
						},
						jiawuA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							group: ["jiawuB", "jiawuC", "jiawuD"],
							popup: false,
							forced: true,
							unique: true,
							dutySkill: true,
							juexingji: true,
							trigger: {
								source: "damageSource",
							},
							filter: function (event, player) {
								return player.storage.jiawuB != 0 && event.player != player && event.player.isIn;
							},
							content: function () {
								player.removeMark('jiawuB', 1);
								game.log(player, "移除了一层枷锁");
								player.syncStorage("jiawuB");
							},
							ai: {
								player: function (card, player, target) {
									if (card.name == "jiu") return [1, 3];
									if (card.name == "nanman" || card.name == "wanjian") return [1, 5];
								},
							},
							"_priority": 0,
						},
						jiawuB: {
							silent: true,
							unique: true,
							locked: true,
							mark: false,
							marktext: "枷",
							onremove: true,
							intro: {
								name: "劳伦斯的血脉",
								"name2": "枷锁",
								content: "最后#层“枷锁”",
							},
							trigger: {
								global: "gameDrawAfter",
								player: "enterGame",
							},
							content: function () {
								player.addMark("jiawuB", 3);
							},
							mod: {
								cardEnabled2: function (card, player) {
									if (player.storage.zhuoMengCards.includes(card.name)) return true;
									if (player.getHistory('useCard', evt => {
										return get.type(evt.card) != "basic";
									}).length >= 3 && get.type(card) != "basic")
										return false;
								},
							},
							ai: {
								threaten: 0.6,
								neg: true,
							},
							"_priority": 0,
						},
						jiawuC: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							derivation: ["langwuA"],
							unique: true,
							forced: true,
							skillAnimation: true,
							animationStr: "使命达成",
							animationColor: "water",
							trigger: {
								player: "useCardAfter",
							},
							filter: function (event, player) {
								return !player.hasSkill('langwuA') && !player.countMark("jiawuB");
							},
							content: function () {
								"step 0"
								player.node.avatar.setBackgroundImage('extension/原梗Enhanced/other/优菈使命达成.png');
								player.popup('使命达成');
								"step 1"
								player.addSkill('langwuA');
								player.awakenSkill('jiawuA');
							},
							mod: {
								aiOrder: function (player, card, num) {
									/*更改AI使用卡的顺序(player为你，card为要判断的牌，num为上次判断后的order值)*/
									if (get.tag(card, "damage")) {
										if (card.selectTarget == -1) return num * 10;
										else return num * 2;
									}
									else return num / 3;
								},
								aiValue: function (player, card, num) {
									/*更改AI对牌回合内使用价值的判断(player为你，card为要改变value的卡，num为上次判断后的value值)*/
									if (get.tag(card, "damage")) {
										if (card.selectTarget == -1) return num * 10;
										else return num * 2;
									}
									else return num / 3;
								},

							},
							"_priority": 0,
						},
						jiawuD: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							unique: true,
							forced: true,
							trigger: {
								player: "dying",
							},
							content: function () {
								"step 0"
								player.popup('使命失败');
								if (trigger.source) trigger.source.recover(1);
								"step 1"
								player.recover(1 - player.hp);
								"step 2"
								player.awakenSkill('jiawuA');
							},
							"_priority": 0,
						},
						langwuA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							frequent: true,
							unique: true,
							trigger: {
								player: ["useCard", "respond"],
							},
							filter: function (event, player) {
								if (player.isIn()) return true;
							},
							content: function () {
								player.draw();
							},
							group: "langwuA_Damage",
							subSkill: {
								Damage: {
									direct: true,
									locked: true,
									trigger: {
										player: "phaseJieshuBegin",
									},
									filter: function (event, player) {
										if (game.countPlayer() >= 2 && player.isIn())
											return player.getHistory("useCard").length;
									},
									content: function () {
										'step 0'
										event.num = player.getHistory("useCard").length;
										player.chooseTarget(get.prompt('langwuA'), '你可以对一名其他角色造成' + player.getHistory('useCard').length + '点伤害', function (card, player, target) {
											return player != target
										}).set("ai", function (target) {
											var player = _status.event.player;
											return get.damageEffect(target, player, player);
										});
										'step 1'
										if (result.bool) {
											player.logSkill('langwu', result.targets[0]);
											result.targets[0].damage(num, 'ice');
										}
									},
									sub: true,
								},
							},
							"_priority": 0,
						},
						huolinA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							trigger: {
								global: "phaseBefore",
								player: "enterGame",
							},
							charlotte: true,
							forced: true,
							filter: function (event, player) {
								return (event.name != "phase" || game.phaseNumber == 0) && player.hasEquipableSlot(1) && !player.getEquips("amosizhigongA").length;
							},
							async content(event, trigger, player) {
								const card = game.createCard2("amosizhigongA", "diamond", 13);
								player.$gain2(card, false);
								await game.delayx();
								await player.equip(card);
							},
							group: "huolinA_blocker",
							subSkill: {
								blocker: {
									trigger: {
										player: ["loseBefore", "disableEquipBefore"],
									},
									forced: true,
									filter: function (event, player) {
										if (event.name == "disableEquip") return event.slots.includes("equip1");
										let cards = player.getEquips("amosizhigongA");
										return event.cards.some(card => cards.includes(card));
									},
									async content(event, trigger, player) {
										if (trigger.name == "lose") {
											trigger.cards.removeArray(player.getEquips("amosizhigongA"));
										} else {
											while (trigger.slots.includes("equip1")) trigger.slots.remove("equip1");
										}
									},
									sub: true,
								},
							},
							mod: {
								canBeGained(card, source, player) {
									if (player.getEquips("amosizhigongA").includes(card)) return false;
								},
								canBeDiscarded(card, source, player) {
									if (player.getEquips("amosizhigongA").includes(card)) return false;
								},
								canBeReplaced(card, player) {
									if (player.getVEquips("amosizhigongA").includes(card)) return false;
								},
								cardname(card) {
									if (get.subtype(card, false) == "equip1") return "sha";
								},
								cardnature(card) {
									if (get.subtypes(card, false).includes("equip1")) return "ice";
								},
								cardDiscardable(card, player) {
									if (player.getEquips("amosizhigongA").includes(card)) return false;
								},
								cardEnabled2(card, player) {
									if (player.getEquips("amosizhigongA").includes(card)) return false;
								},
							},
							"_priority": 0,
						},
						qiyueA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							forced: true,
							trigger: {
								global: "phaseDrawBegin",/* phaseDrawBegin1为取消摸牌，phaseDrawBegin2为改变摸牌数 */
							},
							filter: function (event, player) {
								return event.player.isIn() && event.player != player;
							},
							async content(event, trigger, player) {
								trigger.cancel();
								const cardNumber = Math.max(2, game.countPlayer(current => current != player && current.hp != player.hp))
								await player.draw(cardNumber);
								if (player.countCards("h") >= 2) {
									await player.chooseToGive(trigger.player, `契约：交给${get.translation(trigger.player)}两张牌`, true, 2, "h")
								}
								if (!player.hasMark("qiyueA_defend")) player.addMark("qiyueA_defend", 1);
							},
							group: "qiyueA_defend",
							subSkill: {
								defend: {
									charlotte: true,
									mark: false,
									marktext: "守",
									intro: {
										name: "守护",
										content: "防止你下一次受到的伤害。"
									},
									forced: true,
									trigger: {
										player: "damageBegin4",
									},
									filter: function (event, player) {
										return event.player.countMark("qiyueA_defend") > 0;
									},
									async content(event, trigger, player) {
										trigger.cancel();
										player.removeMark('qiyueA_defend', 1);
									},
									ai: {
										nodamage: true,
										skillTagFilter: function (player, tag, arg) {//技能标签限制条件
											if (!player.hasMark("qiyueA_defend")) return false;
										},
										effect: {
											target: function (card, player, target) {
												if (get.tag(card, "damage") && target.hasMark("qiyueA_defend")) {
													return "zerotarget";
												}
											},
										},
									},
									onremove: true,
									sub: true,
								},
							},
							"_priority": 0,
						},
						shuanghuaA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							derivation: ["ygzq_dongjie"],
							forced: true,
							trigger: {
								source: "damageBegin1",
							},
							filter: function (event, player) {
								return event.player != player && event.hasNature("ice");
							},
							async content(event, trigger, player) {
								const result = await player.judge().forResult();
								if (result.color == "red") {
									await player.gainPlayerCard(trigger.player, 2, true, "visible", "he")
										.set("ai", (button) => get.value(button.link, _status.event.player))
								}
								else {
									if (!trigger.player.hasSkill("ygzq_dongjie")) {
										trigger.player.addTempSkill('ygzq_dongjie', { player: "phaseBegin" });
									}
									else
										await trigger.player.loseMaxHp();
								}
							},
							mod: {
								selectTarget: function (card, player, range) {
									if (card.name == 'sha' && range[1] != -1) range[1] = game.countPlayer();
								},
								cardnature: function (card, player) {
									if (card.name == "sha") return 'ice';
								},
							},
							"_priority": 10,
						},
						ygzq_dongjie: {
							charlotte: true,
							unique: true,
							onremove: true,
							mark: true,
							marktext: "冻",
							locked: true,
							intro: {
								name: "冻结",
								content: "防具失效且不处于濒死状态时无法使用或打出手牌。",
							},
							mod: {
								cardEnabled2: function (card, player) {
									if (!player.isDying() && get.position(card) == 'h')
										return false;
								},
							},
							ai: {
								"unequip2": true,
							},
							"_priority": 0,
						},
						bingwuA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							usable: 5,
							init: function (skill, player) {
								game.broadcastAll(player => {
									if (lib.skill.icesha_skill && typeof lib.skill.icesha_skill.check === "function") {
										const origin_check = lib.skill.icesha_skill.check;
										const new_check = function (event, player) {
											if (player.hasSkill("bingwuA") && event.player.countCards("he") > 0) {
												return true;
											}
											return origin_check.apply(this, arguments);
										};
										lib.skill.icesha_skill.check = new_check;
									}
								}, player);
							},
							forced: true,
							unique: true,
							charlotte:true,
							trigger: {
								player: "useCardAfter",
							},
							filter: function (event, player) {
								return event.card.name == 'sha' && !player.hasHistory('sourceDamage', evt => evt.card === event.card);
							},
							async content(event, trigger, player) {
								trigger.addCount = false;
								if (player.stat[player.stat.length - 1].card.sha > 0) {
									player.stat[player.stat.length - 1].card.sha--;
								}
								await player.gain(game.createCard("sha"), "gain2");
								for (const target of trigger.targets) target.addMark("shuangmieA_jihan", 1);
							},
							mod: {
								cardnature: function (card, player) {
									if (card.name == "sha") return 'ice';
								},
								targetInRange: function (card, player, target, now) {
									if (card.name == 'sha') return true;
								},
							},
							group: ["bingwuA_damage"],
							subSkill: {
								damage: {
									audio: "bingwuA",
									forced: true,
									trigger: {
										source: "damageSource",
									},
									filter: function (event, player) {
										return event.card && event.card.name == 'sha';
									},
									async content(event, trigger, player) {
										trigger.player.addMark("shuangmieA_jihan", 3 * trigger.num);
									},
									sub: true,
								},
							},
							ai: {
								effect: {//牌的影响
									player: function (card, player, target) {
										if (card.name == "sha") {
											if (target.hasMark("shuangmieA_jihan")) return [1, 0, 2, -5];
											return [1, 0, 1.5, -3];
											/* player函数里a、b、c、d,a、b是对你的收益，c、d是对你使用牌的目标的收益、
											target函数里a、b、c、d，a、b仍是对你的收益（此时你是其他人用牌的目标），c、d是对牌的使用者的收益（对你用牌的那个角色）
											 */
										}
									},
								},
							},
						},
						shuangmieA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							enable: "phaseUse",
							charlotte: true,
							unique: true,
							usable: 1,
							selectTarget: [1, Infinity],
							filterTarget: (card, player, target) => (target != player),
							multitarget: true,
							multiline: true,
							async content(event, trigger, player) {
								let number = Math.max(game.countPlayer(current => current.hasSkill("ygzq_dongjie")), 3);
								for (const target of event.targets) {
									target.addMark("shuangmieA_jihan", number);
								};
							},
							group: "shuangmieA_jihan",
							subSkill: {
								jihan: {
									charlotte: true,
									unique: true,
									silent: true,
									onremove: true,
									lastDo: true,
									mark: true,
									marktext: "极寒",
									intro: {
										name: "极寒",
										content: "神里流·霜灭！"
									},
									trigger: {
										global: "phaseBegin",
									},
									filter: function (event, player) {
										return event.player != player && event.player.hasMark("shuangmieA_jihan");
									},
									async content(event, trigger, player) {
										const markCount = trigger.player.countMark("shuangmieA_jihan");
										const result = await trigger.player.judge().forResult();//这边不能设置"judge",否则会有点问题
										if (result.number <= markCount) {
											await trigger.player.die({ source: player });
										}
										else {
											await player.gain(trigger.player.getCards("he"), "gain2");
											await trigger.player.loseMaxHp();
										}
									},
									sub: true,
								},
							},
							ai: {
								order: 11,
								threaten: 2,
								expose: 0.9,
								result: {//主动技的收益，返回值只能是1个数字 target返回值*态度+player返回值 然后依次在最终值>0的所有目标里选最大的
									player: function (player, target) {
										if (get.mode() == "identity" && player.identity == "nei" && target.identity == "zhu") {
											if (game.countPlayer() <= 2) return -10;
											else return 0;
										}
										else return 1;
									},
									target: function (player, target) {
										if (get.mode() == "identity" && player.identity == "nei" && target.identity == "zhu") {
											if (game.countPlayer() <= 2) return -10;
											else return 0;
										}
										return -10;
									},
								},
							},
							"_priority": 0,
						},
						xianbuA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							unique: true,
							locked: true,
							frequent: 'check',
							derivation: "ygzq_dongjie",
							check: function (event, player) {
								if (get.mode() == "identity" && player.identity == "nei" && _status.currentPhase.identity == "zhu") {
									if (game.countPlayer() <= 2) return true;
									else return false;
								}
								return get.attitude(player, _status.currentPhase) <= 0;
							},
							trigger: {
								player: "loseAfter",
								global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
							},
							filter: function (event, player) {
								if (player == _status.currentPhase) return false;
								const evt = event.getl(player);
								return evt && evt.cards2 && evt.cards2.length > 0 && _status.currentPhase;
							},
							async content(event, trigger, player) {
								await player.draw(trigger.getl(player).cards2.length);
								const target = _status.currentPhase;
								target.addMark("shuangmieA_jihan", 2);
								if (!target.hasSkill('ygzq_dongjie')) target.addTempSkill('ygzq_dongjie', { player: 'phaseBegin' });
							},
							group: "xianbuA_defend",
							subSkill: {
								defend: {
									audio: "bingwuA",
									usable: 3,
									locked: true,
									trigger: {
										player: "damageBegin4",
									},
									filter: function (event, player) {
										return event.source && event.source != player && event.player.countCards("he");
									},
									async cost(event, trigger, player) {
										//将选择目标的部分写在cost里面，这样让玩家在选择目标的时候，实际上并没有进入content之中，即使你没有选择目标，也不占用每回合限两次的技能使用次数	
										const result = await player.chooseToDiscard("弃置一张牌并防止此伤害", "he", true)
											.set("ai", (card) => 10 - get.value(card))
											.forResult();
										if (result.bool) { event.result = result; }
									},
									async content(event, trigger, player) {
										trigger.cancel();
									},
									ai: {
										filterDamage: true,
										skillTagFilter: function (player, tag, arg) {//技能标签限制条件
											if (player.countCards("he") == 0) return false;
										},
										effect: {
											target: function (card, player, target, current) {
												if (get.tag(card, "damage") && target.countCards("he") && player != target) return "zerotarget";
											},
										},
									},
								},
							},
							ai: {
								threaten: 0.4,
								effect: {//牌的影响                            
									target: function (card, player, target) {//你成为牌的目标时对你的影响
										if (get.tag(card, "loseCard") && player != target) return [1, 2, 1, -4];
									},
								},
							},
							"_priority": 0,
						},
						jiushiA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							charlotte: true,
							enable: "chooseToUse",
							usable: 3,
							filterCard: true,
							selectCard: 1,
							position: "hs",//可以选择的牌的区域：手牌区，装备区，辎区（木牛流马里面的牌），判定区
							viewAsFilter: function (player) {
								if (!player.countCards("hs")) return false;
							},
							prompt: "将一张手牌当酒使用",//这里是技能发动时候的提示性语句
							viewAs: {
								name: "jiu",
								isCard: true,
							},
							mod: {
								cardUsable: function (card, player) {
									if (card.name == 'jiu') return Infinity;
								},
							},
							check: function (cardx, player) {
								if (player && player == cardx.player) return true;
								if (_status.event.type == 'dying') return 1;
								var player = _status.event.player;
								var shas = player.getCards('hs', function (card) {
									return card != cardx && get.name(card, player) == 'sha';
								});
								if (!shas.length) return -1;
								if (shas.length > 1 && (player.getCardUsable('sha') > 1 || player.countCards('hs', 'zhuge'))) {
									return 0;
								}
								shas.sort(function (a, b) {
									return get.order(b) - get.order(a);
								});
								var card = false;
								if (shas.length) {
									for (var i = 0; i < shas.length; i++) {
										if (shas[i] != cardx && lib.filter.filterCard(shas[i], player)) {
											card = shas[i]; break;
										}
									}
								}
								if (card) {
									if (game.hasPlayer(function (current) {
										return (get.attitude(player, current) < 0 &&
											!current.hasShan()
											&& current.hp + current.countCards('h', { name: ['tao', 'jiu'] }) > 1 + (player.storage.jiu || 0)
											&& player.canUse(card, current, true, true) &&
											!current.hasSkillTag('filterDamage', null, {
												player: player,
												card: card,
												jiu: true,
											}) &&
											get.effect(current, card, player) > 0);
									})) {
										return 4 - get.value(cardx);
									}
								}
								return -1;
							},
							ai: {
								threaten: 1.5,
								basic: {
									useful: function (card, i) {
										if (_status.event.player.hp > 1) {
											if (i == 0) return 4;
											return 1;
										}
										if (i == 0) return 7.3;
										return 3;
									},
									value: function (card, player, i) {
										if (player.hp > 1) {
											if (i == 0) return 5;
											return 1;
										}
										if (i == 0) return 7.3;
										return 3;
									},
								},
								order: function () {
									return get.order({ name: 'jiu' }) + 4;
								},
								result: {
									target: function (player, target) {
										if (target && target.isDying()) return 2;
										if (target && !target.isPhaseUsing()) return 0;
										if (lib.config.mode == 'stone' && !player.isMin()) {
											if (player.getActCount() + 1 >= player.actcount) return 0;
										}
										var shas = player.getCards('h', 'sha');
										if (shas.length > 1 && (player.getCardUsable('sha') > 1 || player.countCards('h', 'zhuge'))) {
											return 0;
										}
										shas.sort(function (a, b) {
											return get.order(b) - get.order(a);
										})
										var card;
										if (shas.length) {
											for (var i = 0; i < shas.length; i++) {
												if (lib.filter.filterCard(shas[i], target)) {
													card = shas[i]; break;
												}
											}
										}
										else if (player.hasSha() && player.needsToDiscard()) {
											if (player.countCards('h', 'hufu') != 1) {
												card = { name: 'sha' };
											}
										}
										if (card) {
											if (game.hasPlayer(function (current) {
												return (get.attitude(target, current) < 0 &&
													target.canUse(card, current, null, true) &&
													!current.hasSkillTag('filterDamage', null, {
														player: player,
														card: card,
														jiu: true,
													}) &&
													get.effect(current, card, target) > 0);
											})) {
												return 1;
											}
										}
										return 0;
									},
								},
								tag: {
									save: 1,
									recover: 0.1,
								},
							},
							"_priority": 0,
						},
						feixingA: {
							trigger: {
								player: "phaseDiscardBefore",
							},
							unique: true,
							onremove: true,
							mark: true,
							marktext: "飞",
							locked: true,
							intro: {
								name: "飞行",
								content: "你使用牌无距离限制，跳过弃牌阶段，其他角色计算与你的距离+1。",
							},
							forced: true,
							content: function () {
								trigger.cancel();
							},
							mod: {
								globalTo: function (from, to, distance) {
									return distance + 1;
								},
								targetInRange: function (card, player, target, now) {
									return true;
								},
							},
							"_priority": 0,
						},
						fengqinA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							popup: false,
							usable: 3,
							charlotte: true,
							frequent: true,
							onremove: true,
							group: ['fengqinB', 'fengqinC'],
							mark: true,
							marktext: "琴",
							intro: {
								name: "风琴",
								content: function (storage, player, skill) {
									if (storage)
										return "上次使用的牌的点数为" + storage;
									else
										return "本回合尚未使用过牌";
								},
							},
							trigger: {
								player: "useCardAfter",
							},
							filter: function (event, player, name) {
								if (player != _status.currentPhase) return false;
								var evt = player.getLastUsed(1);
								player.storage.fengqinA = event.card.number;
								player.syncStorage('fengqinA');
								player.markSkill('fengqinA');/*确保记录点数的操作不消耗技能次数*/
								if (!evt || !evt.cards || evt.card.number == event.card.number) {
									return false;
								};
								if (evt.card.number > event.card.number && player.storage.fengqinC == 0) return false;
								if (evt.card.number <= event.card.number && player.storage.fengqinC == 1) return false;
								return true;
							},
							content: function () {
								var evt = player.getLastUsed(1);
								if (evt.card.number && (evt.card.number != trigger.card.number)) {
									player.draw(Math.abs(evt.card.number - trigger.card.number));
									player.logSkill('fengqinA');
								}
							},
							"_priority": 0,
						},
						fengqinB: {
							direct: true,
							locked: true,
							trigger: {
								player: "phaseEnd",
							},
							content: function () {
								delete player.storage.fengqinA;
								player.syncStorage('fengqinA');
								player.unmarkSkill('fengqinA');
							},
							"_priority": 0,
						},
						fengqinC: {
							direct: true,
							locked: true,
							trigger: {
								player: "phaseDrawAfter",
							},
							content: function () {
								'step 0'
								var smallpointcards = 0;
								var bigpointcards = 0;
								for (var i = 1; i < 7; i++) {
									smallpointcards += player.countCards('h', { number: i.toString() });
								}
								for (var j = 7; j <= 13; j++) {
									bigpointcards += player.countCards('h', { number: j.toString() });
								}
								player.chooseControl("递增", "递减").set("ai", function () {
									if (bigpointcards > smallpointcards) return 1;
									else return 0;
								});
								'step 1'
								player.storage.fengqinC = result.index;
								game.log(result.index == 0 ? (player, "选择了递增") : (player, "选择了递减"));
							},
							"_priority": 0,
						},
						chengfengA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							derivation: ["feixingA"],
							enable: "phaseUse",
							usable: 1,
							filter: function (event, player) {
								return player.countCards('he');
							},
							filterCard: function (card, player, event) {
								event = event || _status.event;
								if (typeof event != 'string') event = event.getParent().name;
								var mod = game.checkMod(card, player, event, 'unchanged', 'cardDiscardable', player);
								if (mod != 'unchanged') return mod;
								var num = player.getHistory('useCard').length;
								if (card.number > num) return false;
								return true;
							},
							position: "he",
							selectCard: [1, Infinity],
							content: function () {
								'step 0'
								player.discard(cards);
								var cardUsedNumber = cards.length;
								if (cardUsedNumber >= 7)
									player.addTempSkill('feixingA', { player: "phaseBegin" });
								'step 1'
								player.draw(cards.length + 1);
							},
							ai: {
								order: function (item, player) {
									if (!player.getStat('skill').chengfengA) return get.order({ name: 'tao' }) - 1;
									return 1;
								},
								result: {
									player: 1,
								},
								threaten: 1.55,
							},
							check: function (card) {
								var player = _status.event.player;
								if (get.position(card) == 'h' && !player.countCards('h', 'du') && (player.hp > 2 || !player.countCards('h', function (card) {
									return get.value(card) >= 8;
								}))) {
									return 1;
								}
								return 6 - get.value(card)
							},
							"_priority": 0,
						},
						dueA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							trigger: {
								global: "judge",
							},
							direct: true,
							locked: true,
							filter: function (event, player) {
								return player.countCards('hes') > 0;
							},
							content: function () {
								"step 0"
								if (["trick", "delay", "basic"].includes(get.type(trigger.player.judging[0]))) {
									player.logSkill("dueA");
									if (game.hasPlayer(function (current) {
										return current != player && current.isDamaged();
									})) {
										player.chooseTarget('渡厄：令一名其他角色回复一点体力', function (card, player, target) {
											return target != player && target.hp < target.maxHp && target.hp > 0;
										}).ai = function (target) {
											return get.recoverEffect(target, player, player);
										};
									};
								}
								'step 1'
								if (result.bool) {
									player.logSkill('lingyu', result.targets[0]);
									result.targets[0].recover();
								}
								"step 2"
								player.chooseCard(get.translation(trigger.player) + "的" + (trigger.judgestr || "") + "判定为" +
									get.translation(trigger.player.judging[0]) + "，" + get.prompt("dueA"), "hes", function (card) {
										var player = _status.event.player;
										var mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
										if (mod2 != "unchanged") return mod2;
										var mod = game.checkMod(card, player, "unchanged", "cardRespondable", player);
										if (mod != "unchanged") return mod;
										return true;
									}).set('ai', function (card) {
										var trigger = _status.event.getTrigger();
										var player = _status.event.player;
										var judging = _status.event.judging;
										var result = trigger.judge(card) - trigger.judge(judging);
										var attitude = get.attitude(player, trigger.player);
										if (attitude == 0 || result == 0) return 0;
										if (attitude > 0) {
											return result - get.value(card) / 2;
										}
										else {
											return -result - get.value(card) / 2;
										}
									}).set("judging", trigger.player.judging[0]);
								"step 3"
								if (result.bool) {
									player.respond(result.cards, "dueA", "highlight", "noOrdering");
								}
								else {
									event.finish();
								}
								"step 4"
								if (result.bool) {
									if (trigger.player.judging[0].clone) {
										trigger.player.judging[0].clone.classList.remove("thrownhighlight");
										game.broadcast(function (card) {
											if (card.clone) {
												card.clone.classList.remove("thrownhighlight");
											}
										}, trigger.player.judging[0]);
										game.addVideo("deletenode", player, get.cardsInfo([trigger.player.judging[0].clone]));
									}
									player.gain(trigger.player.judging[0], "gain2");
									trigger.player.judging[0] = result.cards[0];
									trigger.orderingCards.addArray(result.cards);
									game.log(trigger.player, "的判定牌改为", result.cards[0]);
									game.delay(2);
								}
							},
							ai: {
								rejudge: true,
								tag: {
									rejudge: 1,
								},
							},
							"_priority": 10,
						},
						yanmingA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							trigger: {
								global: "dying",
							},
							usable: 3,
							unique: true,
							locked: true,
							filter: function (event, player) {
								return event.player.hp <= 0;
							},
							content: function () {
								'step 0'
								trigger.player.judge(function (card) {
									return (get.suit(card) == 'spade' && get.number(card) > 1 && get.number(card) < 10) ? -1 : 1;
								});
								'step 1'
								if (result.bool) {
									trigger.player.recover(1 - trigger.player.hp);
									trigger.player.draw(trigger.player.maxHp);
								}
							},
							check: function (event, player) {
								return get.attitude(player, event.player) > 0;
							},
							ai: {
								threaten: 0.8,
							},
							"_priority": 12,
						},
						huihaiA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							unique: true,
							charlotte: true,
							enable: "phaseUse",
							usable: 1,
							skillAnimation: true,
							animationStr: "起死回骸",
							animationColor: "water",
							notarget: true,
							discard: false,
							log: false,
							filter: function (event, player) {
								return game.dead.length > 0 && player.maxHp > 1;
							},
							content: function () {
								"step 0"
								event.current = player.next;
								var list = [];
								for (var i = 0; i < game.dead.length; i++) {
									list.push(game.dead[i].name);
								}
								player.chooseButton(ui.create.dialog('选择一名已阵亡的角色令其复活', [list, 'character']), function (button) {
									for (var i = 0; i < game.dead.length && game.dead[i].name != button.link; i++);
									return ai.get.attitude(_status.event.player, game.dead[i]);
								});
								"step 1"
								if (result.bool) {
									for (var i = 0; i < game.dead.length && game.dead[i].name != result.buttons[0].link; i++);
									var dead = game.dead[i];
									player.logSkill('huihaiA', dead);
									player.loseMaxHp();
									dead.revive(dead.maxHp);
									dead.draw(dead.maxHp);
								}
							},
							ai: {
								order: 7,
								threaten: 2,
								expose: 1,
								result: {
									player: 1,
								}
							},
							"_priority": 8,
						},
						qiangqiangA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							trigger: {
								global: "gameDrawAfter",
								player: "enterGame",
							},
							forced: true,
							direct: true,
							content: function () {
								'step 0'
								player.chooseControlList('锵锵——可莉登场', '【砰砰】修改为每回合均可使用一次，【导航】修改为使用时弃牌改为摸牌', '【导航】修改为每回合均可使用一次，【砰砰】修改为使用时弃牌改为摸牌', true);
								'step 1'
								if (result.index == 0) {
									player.logSkill('qiangqiangA');
									player.removeSkill('pengpengA');
									player.removeSkill('daohangA');
									player.addSkill('pengpengB');
									player.addSkill('daohangC');
								}
								else if (result.index == 1) {
									player.logSkill('qiangqiangA');
									player.removeSkill('pengpengA');
									player.removeSkill('daohangA');
									player.addSkill('daohangB');
									player.addSkill('pengpengC');
								}
							},
							"_priority": 0,
						},
						huomianA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							group: ["huomianC", "qiangqiangA"],
							popup: false,
							trigger: {
								target: "useCardToBegin",
							},
							forced: true,
							filter: function (event, player) {
								if (event.targets && event.targets.length > 1) return false;
								if (event.card && get.type(event.card) == 'trick' && event.player != player) return true;
							},
							content: function () {
								player.addSkill('huomianB');
							},
							ai: {
								notrick: true,
								notricksource: true,
								effect: {
									target: function (card, player, target, current) {
										if (get.type(card) == 'trick' && get.tag(card, 'damage')) {
											return 'zeroplayertarget';
										}
									},
								},
							},
							"_priority": 0,
						},
						huomianB: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							trigger: {
								player: "damageBegin4",
							},
							forced: true,
							filter: function (event, player) {
								return get.type(event.card, 'trick') == 'trick';
							},
							content: function () {
								'step 0'
								trigger.cancel();
								'step 1'
								player.removeSkill('huomianB');
							},
							"_priority": 0,
						},
						huomianC: {
							popup: false,
							trigger: {
								target: "useCardToBegin",
							},
							forced: true,
							filter: function (event, player) {
								if (event.targets && event.targets.length > 1 && event.card && get.type(event.card) == 'trick' && event.player != player) return true;
							},
							content: function () {
								player.removeSkill('huomianB');
							},
							"_priority": 0,
						},
						baozangA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							trigger: {
								player: "phaseDrawBegin",
							},
							content: function () {
								'step 0'
								event.card = [];
								event.suits = [];
								'step 1'
								var card = get.cards()[0];
								event.card = card;
								player.showCards(card);
								player.addToExpansion(card, 'draw').gaintag.add('baozangA');
								'step 2'
								if (event.suits && !event.suits.contains(get.suit(card))) {
									event.suits.push(get.suit(card));
									event.goto(1);
								}
								'step 3'
								player.chooseTarget('选择一名角色获得全部的宝藏', true).set('ai', function (target) {
									var player = _status.event.player;
									var att = get.attitude(player, target) / Math.sqrt(1 + target.countCards('h'));
									if (target.hasSkillTag('nogain')) att /= 10;
									return att;
								});
								'step 4'
								var cards = player.getExpansions('baozangA');
								var target = result.targets[0];
								target.gain(cards, 'draw');
								game.log(target, '获得了' + get.cnNumber(cards.length) + '张宝藏');
								'step 5'
								trigger.num = 0;
							},
							"_priority": 0,
						},
						pengpengA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							unique: true,
							onremove: true,
							mark: true,
							limited: true,
							skillAnimation: true,
							animationStr: "蹦蹦炸弹",
							animationColor: "fire",
							init: function (player) {
								player.storage.pengpengA = false;
							},
							enable: "phaseUse",
							usable: 1,
							selectCard: 2,
							position: "h",
							filter: function (event, player) {
								if (player.storage.pengpengA) return false;
								return player.countCards('h', { color: 'red' });
							},
							filterCard: function (card) {
								return get.color(card) == "red";
							},
							filterTarget: function (card, player, target) {
								return target != player && target.hp > 0 && player.inRange(target);
							},
							content: function () {
								'step 0'
								player.awakenSkill('pengpengA');
								player.storage.pengpengA = true;
								'step 1'
								target.damage('fire');
							},
							intro: {
								content: "limited",
								mark: function (dialog, content, player) {
									return '蹦蹦炸弹';
								},
							},
							ai: {
								threaten: 1,
								result: {
									target: function (player, target) {
										if (target.countCards('h') <= 1) return -3.5; //如果对敌方使用技能则返回负值(return -3.5)
										return -2;
									},
								},
								order: 4,
								expose: 0.4,
							},
							"_priority": 0,
						},
						daohangA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							unique: true,
							onremove: true,
							mark: true,
							limited: true,
							skillAnimation: true,
							animationStr: "可莉导航",
							animationColor: "fire",
							init: function (player) {
								player.storage.daohangA = false;
							},
							enable: "phaseUse",
							usable: 1,
							selectCard: 2,
							position: "h",
							filter: function (event, player) {
								if (player.storage.daohangA) return false;
								return player.countCards('h', { color: 'black' }) && game.countPlayer(function (current) {
									return current != player;
								}) > 1;
							},
							filterCard: function (card) {
								return get.color(card) == "black";
							},
							filterTarget: function (card, player, target) {
								if (player == target) return false;
								if (ui.selected.targets.length == 1) {
									return target.canUse({ name: 'juedou' }, ui.selected.targets[0]);
								}
								return true;
							},
							targetprompt: ["先出杀", "后出杀"],
							selectTarget: 2,
							multitarget: true,
							content: function () {
								'step 0'
								player.awakenSkill('daohangA');
								player.storage.daohangA = true;
								'step 1'
								targets[0].addSkill('daohangC');
								targets[1].addSkill('daohangC');
								'step 2'
								targets[1].useCard({ name: 'juedou', isCard: true }, 'nowuxie', targets[0], 'noai').animate = false;
								game.delay(0.5);
							},
							intro: {
								content: "limited",
								mark: function (dialog, content, player) {
									return '可莉导航';
								},
							},
							ai: {
								threaten: 1,
								result: {
									target: function (player, target) {
										if (target.countCards('h') <= 1) return -3.5; //如果对敌方使用技能则返回负值(return -3.5)
										return -2;
									},
								},
								order: 4,
								expose: 0.4,
							},
							"_priority": 0,
						},
						pengpengB: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							enable: "phaseUse",
							usable: 1,
							selectCard: 2,
							position: "h",
							filter: function (event, player) {
								return player.countCards('h', { color: 'red' });
							},
							filterCard: function (card) {
								return get.color(card) == "red";
							},
							filterTarget: function (card, player, target) {
								return target != player && target.hp > 0 && player.inRange(target);
							},
							content: function () {
								target.damage('fire');
							},
							ai: {
								threaten: 1,
								result: {
									target: function (player, target) {
										if (target.countCards('h') <= 1) return -3.5; //如果对敌方使用技能则返回负值(return -3.5)
										return -2;
									},
								},
								order: 4,
								expose: 0.4,
							},
							"_priority": 0,
						},
						daohangB: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							enable: "phaseUse",
							usable: 1,
							selectCard: 2,
							position: "h",
							filter: function (event, player) {
								return player.countCards('h', { color: 'black' }) && game.countPlayer(function (current) {
									return current != player;
								}) > 1;
							},
							filterCard: function (card) {
								return get.color(card) == "black";
							},
							filterTarget: function (card, player, target) {
								if (player == target) return false;
								if (ui.selected.targets.length == 1) {
									return target.canUse({ name: 'juedou' }, ui.selected.targets[0]);
								}
								return true;
							},
							targetprompt: ["先出杀", "后出杀"],
							selectTarget: 2,
							multitarget: true,
							content: function () {
								'step 0'
								targets[0].addTempSkill('daohangD', _status.currentPhase.phaseUseAfter);
								targets[1].addTempSkill('daohangD', _status.currentPhase.phaseUseAfter);
								'step 1'
								targets[1].useCard({ name: 'juedou', isCard: true }, 'nowuxie', targets[0], 'noai').animate = false;
								game.delay(0.5);
							},
							ai: {
								threaten: 1,
								result: {
									target: function (player, target) {
										if (target.countCards('h') <= 1) return -3.5; //如果对敌方使用技能则返回负值(return -3.5)
										return -2;
									},
								},
								order: 4,
								expose: 0.4,
							},
							"_priority": 0,
						},
						pengpengC: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							unique: true,
							onremove: true,
							mark: true,
							limited: true,
							skillAnimation: true,
							animationStr: "蹦蹦炸弹",
							animationColor: "fire",
							init: function (player) {
								player.storage.pengpengC = false;
							},
							enable: "phaseUse",
							usable: 1,
							filter: function (event, player) {
								if (player.storage.pengpengC) return false;
								return true;
							},
							filterTarget: function (card, player, target) {
								return target != player && target.hp > 0 && player.inRange(target);
							},
							content: function () {
								'step 0'
								player.awakenSkill('pengpengC');
								player.storage.pengpengC = true;
								'step 1'
								player.draw(2);
								target.damage('fire');
							},
							intro: {
								content: "limited",
								mark: function (dialog, content, player) {
									return '蹦蹦炸弹';
								},
							},
							ai: {
								threaten: 1,
								result: {
									target: function (player, target) {
										if (target.countCards('h') <= 1) return -3.5; //如果对敌方使用技能则返回负值(return -3.5)
										return -2;
									},
								},
								order: 4,
								expose: 0.4,
							},
							"_priority": 0,
						},
						daohangC: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							unique: true,
							onremove: true,
							mark: true,
							limited: true,
							skillAnimation: true,
							animationStr: "可莉导航",
							animationColor: "fire",
							init: function (player) {
								player.storage.daohangC = false;
							},
							enable: "phaseUse",
							usable: 1,
							filter: function (event, player) {
								if (player.storage.daohangC) return false;
								return game.countPlayer(function (current) {
									return current != player;
								}) > 1;
							},
							filterTarget: function (card, player, target) {
								if (player == target) return false;
								if (ui.selected.targets.length == 1) {
									return target.canUse({ name: 'juedou' }, ui.selected.targets[0]);
								}
								return true;
							},
							targetprompt: ["先出杀", "后出杀"],
							selectTarget: 2,
							multitarget: true,
							content: function () {
								'step 0'
								player.awakenSkill('daohangC');
								player.storage.daohangC = true;
								'step 1'
								player.draw(2);
								targets[0].addSkill('daohangD');
								targets[1].addSkill('daohangD');
								'step 2'
								targets[1].useCard({ name: 'juedou', isCard: true }, 'nowuxie', targets[0], 'noai').animate = false;
								game.delay(0.5);
							},
							intro: {
								content: "limited",
								mark: function (dialog, content, player) {
									return '可莉导航';
								},
							},
							ai: {
								threaten: 1,
								result: {
									target: function (player, target) {
										if (target.countCards('h') <= 1) return -3.5; //如果对敌方使用技能则返回负值(return -3.5)
										return -2;
									},
								},
								order: 4,
								expose: 0.4,
							},
							"_priority": 0,
						},
						daohangD: {
							mod: {
								cardname: function (card, player, name) {
									if (get.color(card) == 'red' || get.color(card) == 'black') return 'sha';
								},
							},
							popup: false,
							trigger: {
								player: "damageBefore",
								source: "damageBefore",
							},
							forced: true,
							filter: function (event, player) {
								return event.card && event.card.name == 'juedou' && event.notLink();
							},
							content: function () {
								player.removeSkill('daohangD');
							},
							"_priority": 0,
						},
						yanxiaoA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							enable: "phaseUse",
							usable: 1,
							selectCard: 1,
							position: "h",
							filter: function (event, player) {
								return player.countCards('h', { color: 'red' });
							},
							filterCard: function (card) {
								return get.color(card) == "red";
							},
							content: function () {
								player.addTempSkill('yanxiaoB', player.phaseUseAfter);
							},
							ai: {
								threaten: 1,
								result: {
									player: function (player, target) {
										if (player.countCards('h', 'sha') > 0) return 1;
										return false;
									},
								},
								order: 2,
								expose: 0.4,
							},
							check: function (card) {
								return 6 - ai.get.value(card);
								//选取价值小于8的牌。数字越大，会选用的牌范围越广，8以上甚至会选用桃发动技能，一般为6-ai.get.value(card); 
							},
							"_priority": 0,
						},
						yanxiaoB: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							onremove: true,
							mark: true,
							marktext: "焰",
							locked: true,
							forced: true,
							unique: true,
							intro: {
								name: "焰硝",
								content: "本阶段你的攻击范围+1，且使用【杀】无次数限制，并令你使用的【杀】改为火【杀】。",
							},
							trigger: {
								player: "useCard1",
							},
							filter: function (event, player) {
								if (event.card.name == 'sha') return true;
								return false;
							},
							content: function () {
								trigger.card.nature = 'fire';
							},
							mod: {
								cardUsable: function (card, player, num) {
									if (card.name == 'sha') return Infinity;
								},
								attackFrom: function (from, to, distance) {
									if (true) return distance - 1
								},
							},
							ai: {
								unequip: true,
								skillTagFilter: function (player, tag, arg) {
									if (!get.zhu(player, 'shouyue')) return false;
									if (arg && arg.name == 'sha') return true;
									return false;
								},
							},
							"_priority": 0,
						},
						xiangzhuA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							group: "xiangzhuB",
							trigger: {
								player: "loseAfter",
							},
							filter: function (event, player) {
								if (_status.currentPhase != player) return false;
								if (event.type != 'discard') return false;
								for (var i = 0; i < event.cards2.length; i++) {
									if (get.position(event.cards2[i]) == 'd') {
										return true;
									}
								}
								return false;
							},
							direct: true,
							popup: false,
							preHidden: true,
							content: function () {
								"step 0"
								if (trigger.delay == false) game.delay();
								event.cards = [];
								event.logged = false;
								for (var i = 0; i < trigger.cards2.length; i++) {
									if (get.position(trigger.cards2[i], true) == 'd') {
										event.cards.push(trigger.cards2[i]);
										//ui.special.appendChild(trigger.cards[i]);
									}
								}
								"step 1"
								if (event.cards.length) {
									var goon = false;
									for (var i = 0; i < event.cards.length; i++) {
										if (event.cards[i].name == 'du') {
											goon = true; break;
										}
									}
									if (!goon) {
										goon = game.hasPlayer(function (current) {
											return player != current && get.attitude(player, current) > 1;
										});
									}
									player.chooseCardButton(get.prompt('xiangzhuA'), event.cards, [1, event.cards.length]).set('ai', function (button) {
										if (!_status.event.goon || ui.selected.buttons.length) return 0;
										if (button.link.name == 'du') return 2;
										return 1;
									}).set('goon', goon).setHiddenSkill(event.name);
								}
								else {
									event.finish();
								}
								"step 2"
								if (result.bool) {
									event.togive = result.links.slice(0);
									player.chooseTarget('将' + get.translation(result.links) + '交给一名角色', true, function (card, player, target) {
										return target != player;
									}).set('ai', function (target) {
										var att = get.attitude(_status.event.player, target);
										if (_status.event.enemy) {
											return -att;
										}
										else {
											if (att > 2) return att / Math.sqrt(1 + target.countCards('h'));
											return att / Math.sqrt(1 + target.countCards('h')) / 5;
										}
									}).set('enemy', get.value(event.togive[0], player, 'raw') < 0);
								}
								else {
									//game.cardsDiscard(event.cards);
									event.finish();
								}
								"step 3"
								if (result.bool) {
									if (!event.logged) {
										player.logSkill('xiangzhuA', result.targets);
										event.logged = true;
									}
									else player.line(result.targets, 'green');
									for (var i = 0; i < event.togive.length; i++) {
										event.cards.remove(event.togive[i]);
									}
									result.targets[0].gain(event.togive);
									result.targets[0].$gain2(event.togive);
									event.goto(1);
								}
								else {
									//game.cardsDiscard(event.cards);
									event.finish();
								}
							},
							ai: {
								expose: 0.1,
								effect: {
									target: function (card, player, target, current) {
										if (target.hasFriend() && get.tag(card, 'discard')) {
											if (current < 0) return 0;
											return [1, 1];
										}
									},
								},
							},
							"_priority": 0,
						},
						xiangzhuB: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							trigger: {
								global: "phaseDiscardBegin",
							},
							direct: true,
							filter: function (event, player) {
								return event.player.countCards("h") && event.player.countCards("h") > event.player.getHandcardLimit() && event.player != player;
							},
							content: function () {
								'step 0'
								trigger.player.chooseBool('是否将一张手牌交给' + get.translation(player) + '？').set('ai', function () {
									if (get.attitude(player, trigger.player) > 0) return true;
									return false;
								});
								'step 1'
								if (result.bool) { trigger.player.chooseCard('h', '请选择一张手牌'); } else event.finish();
								'step 2'
								if (result.cards) { player.gain(result.cards, trigger.player, "giveAuto"); trigger.player.logSkill('xiangzhuB', player); } else event.finish();
							},
							check: function (card) {
								return 10 - ai.get.value(card);
								//选取价值小于8的牌。数字越大，会选用的牌范围越广，8以上甚至会选用桃发动技能，一般为6-ai.get.value(card); 
							},
							"_priority": 0,
						},
						lianzhenA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							frequent: true,
							trigger: {
								player: "damageBegin4",
							},
							content: function () {
								'step 0'
								var num = trigger.num;//num为伤害值
								if (player.countCards('he') >= num) {
									player.chooseToDiscard('he', num, "请弃置" + get.cnNumber(num) + "张牌").set("ai", card => {
										// 计算卡牌的弃牌价值，考虑手牌数量和玩家体力
										const discardValue = 24 - 5 * player.countCards('h') - 2 * Math.min(4, player.hp) - get.value(card);
										// 如果玩家手牌较少或体力较低，优先保留高价值牌
										if (player.countCards('h') < 4 || player.hp < 3) {
											return discardValue + 10; // 增加保留高价值牌的倾向
										}
										// 默认情况下，根据计算的弃牌价值来决定
										return discardValue;
									});
								}
								else event.goto(2);
								'step 1'
								if (result.bool) trigger.cancel();
								event.finish();
								'step 2'
								trigger.cancel();
								player.loseHp();
								player.link(false);
								player.turnOver(false);
							},
							check: function (event, player) {
								var enemyNum = game.countPlayer(function (current) {
									return current.isLinked() && get.attitude(player, current) < 0;
								});
								var friendNum = game.countPlayer(function (current) {
									return current.isLinked() && get.attitude(player, current) > 0;
								});
								if (player.countCards("he") > 0) return true;
								else {
									if (event.num && enemyNum < friendNum && event.player.isLinked()) return false;
									else return true;
								};
							},
							ai: {
								nodamage: true,
								threaten: 0.7,
								skillTagFilter: function (player, tag, arg) {//技能标签限制条件
									if (player.countCards("he") <= 0) return false;
								},
							},
							"_priority": 0,
						},
						leifaA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							trigger: {
								global: "useCardToTargeted",
							},
							locked: true,
							logTarget: "target",
							filter: function (event, player) {
								return event.target != player && event.card.name == 'sha' && get.distance(player, event.target) <= 1 && event.target.isIn() && event.target.countDiscardableCards(player, "he") > 0;;
							},
							content: function () {
								"step 0"
								player
									.discardPlayerCard(trigger.target, get.prompt("leifaA", trigger.target), 'he', true)
									.set("ai", function (button) {
										if (!_status.event.att) return 0;
										if (get.position(button.link) == "e") {
											if (get.subtype(button.link) == "equip2") return 2 * get.value(button.link);
											return get.value(button.link);
										}
										return 1;
									})
									.set("logSkill", ["leifaA", trigger.target])
									.set("att", get.attitude(player, trigger.target) <= 0);
								"step 1"
								if (result.links && result.links.length) {
									/*get.type参数解释：result.links[0]为选择的牌，null表示区分普通锦囊和延时锦囊，original表示牌的起始位置*/
									if (get.type(result.links[0], null, result.links[0].original == 'h' ? player : false) == 'basic') {
										trigger.getParent().directHit.add(trigger.target);
										trigger.card.nature = 'thunder';
										var id = trigger.target.playerid;
										var map = trigger.getParent().customArgs;
										if (!map[id]) map[id] = {};
										if (typeof map[id].extraDamage != 'number') {
											map[id].extraDamage = 0;
										}
										map[id].extraDamage++;
									}
									else if (get.type(result.links[0], null, result.links[0].original == 'h' ? player : false) == 'trick') {
										trigger.addCount = false;
										if (trigger.player.stat[player.stat.length - 1].card.sha > 0) {
											trigger.player.stat[player.stat.length - 1].card.sha--;
										}
										player.gain(result.links, 'gain2', 'log');
									}
									else {
										var num = game.countPlayer(current => current != player && get.distance(player, current) <= 1)
										if (player.isDamaged()) player.recover();
										player.draw(num);
									}
								}
							},
							check: function (event, player) {
								return get.attitude(player, event.target) < 0;
							},
							ai: {
								damage: true,
								expose: 0.7,
								threaten: 2.7,
								effect: {//牌的影响
									player: function (card, player, target) {//你使用牌时对你的影响
										if (card.name == "sha") {//如果使用的牌是杀
											return [3, 1];
										}
									},
								},
								order: function (card) {
									if (card.name == "sha" && card.number >= 6)
										return get.order(card) + 5;
									else if (card.name == "sha")
										return get.order(card) + 3;
								},
							},
							"_priority": 0,
						},
						xingdouA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							forced: true,
							trigger: {
								player: "useCardToPlayer",
							},
							filter: function (event, player) {
								return event.targets && event.card.name == 'sha';
							},
							content: function () {
								if (!trigger.target.hasSkill("xingdouB"))
									trigger.target.addTempSkill('xingdouB', { player: "phaseBegin" });
							},
							mod: {
								targetInRange: function (card, player, target) {
									if (card.name == "sha" && typeof get.number(card, player) == "number") {
										if (get.distance(player, target) <= get.number(card)) return true;
									}
								},
								selectTarget: function (card, player, range) {
									if (card.name == 'sha' && range[1] != -1) range[1] = get.number(card, player);
								},
							},
							"_priority": 0,
						},
						xingdouB: {
							unique: true,
							onremove: true,
							mark: true,
							marktext: "归",
							locked: true,
							intro: {
								name: "归位",
								content: "拥有“星斗”的角色本回合计算与其他角色的距离视为1。",
							},
							forced: true,
							content: function () {
								player.markSkill('xingdouB');
							},
							mod: {
								globalTo: function (from, to, distance) {
									return -Infinity;
								},
							},
							"_priority": 0,
						},
						jiuzhuangA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							enable: "phaseUse",
							usable: 1,
							position: "hs",
							selectCard: 1,
							discard: false,
							lose: false,
							delay: 0,
							filter: function (event, player) {
								return player.countCards('hs', 'jiu');
							},
							filterCard: function (card) {
								return get.name(card) == "jiu";
							},
							filterTarget: function (card, player, target) {
								return true;
							},
							content: function () {
								"step 0"
								player.showCards(cards);
								if (target == player) player.discard(cards);
								else target.gain(cards, 'gain2');
								"step 1"
								player.draw(2);
							},
							mod: {
								cardEnabled: function (card, player) {
									if (card.name == 'jiu' && player.hp > 0) return false;
								},
								cardSavable: function (card, player) {
									if (card.name == 'jiu' && player.hp > 0) return false;
								},
							},
							ai: {
								result: {
									target: function (player, target) {
										if (target != player) return 3.5; //如果对敌方使用技能则返回负值(return -3.5)
										if (target == player) return 1;
									},
								},
								order: 8,
								expose: 0.4,
							},
							"_priority": 0,
						},
						yeyingA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							group: "yeyingB",
							trigger: {
								player: "phaseZhunbeiAfter",
							},
							direct: true,
							content: function () {
								"step 0"
								player.chooseTarget(get.prompt("yeyingA"), "跳过判定阶段并视为你对一名其他角色使用一张【决斗】", function (card, player, target) { if (player == target) return false; return player.canUse({ name: 'juedou' }, target, false); }).set('ai', function (target) {
									if (player.hp < 2 && player.countCards('h', 'sha') == 0) return false;
									return -get.attitude(player, target)
								});
								"step 1"
								if (result.bool) {
									player.logSkill('yeyingA', result.targets);
									player.useCard({ name: 'juedou', isCard: true }, result.targets[0], false);
									trigger.cancel();
									player.skip('phaseJudge');
									player.addTempSkill('yeyingC', player.phaseUseAfter);
								}
							},
							"_priority": 0,
						},
						yeyingB: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							direct: true,
							trigger: {
								source: "damageBegin1",
							},
							filter: function (event, player) {
								return event.card && event.card.name == 'juedou' && event.notLink();
							},
							content: function () {
								"step 0"
								player.chooseBool('是否令【决斗】的伤害改为火属性伤害？');
								"step 1"
								if (result.bool) {
									player.logSkill('yeyingB');
									trigger.nature = 'fire';
								}
								else event.finish();
							},
							check: function (event, player) {
								return get.attitude(player, event.player) < 0;
								//大于0为选择队友发动，若<=0是对敌方发动
							},
							"_priority": 0,
						},
						yeyingC: {
							popup: false,
							forced: true,
							trigger: {
								player: "phaseDrawEnd",
							},
							content: function () {
								player.chooseToDiscard(2, true, 'h');
								player.removeSkill('yeyingC');
							},
							"_priority": 0,
						},
						yujinA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							shaRelated: true,
							preHidden: true,
							trigger: {
								player: "useCardToPlayered",
								target: "useCardToTargeted",
							},
							filter: function (event, player) {
								if (!(event.card.name == 'juedou' || (event.card.name == 'sha' && get.color(event.card) == 'red'))) return false;
								return player == event.target || event.getParent().triggeredTargets3.length == 1;
							},
							frequent: true,
							content: function () {
								player.draw();
							},
							ai: {
								effect: {
									target: function (card, player, target) {
										if (card.name == 'sha' && get.color(card) == 'red') return [1, 0.6];
									},
									player: function (card, player, target) {
										if (card.name == 'sha' && get.color(card) == 'red') return [1, 1];
									},
								},
							},
							"_priority": 0,
						},
						jinzuA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							enable: "phaseUse",
							selectCard: 1,
							position: "h",
							filter: function (event, player) {
								return player.countCards('h', { color: 'black' });
							},
							filterCard: function (card) {
								return get.color(card) == "black";
							},
							filterTarget: function (card, player, target) {
								return player != target && !target.hasSkill("jinzuB") && player.inRange(target);
							},
							content: function () {
								target.addSkill('jinzuB');
							},
							ai: {
								threaten: 1,
								result: {
									target: function (player, target) {
										if (target.countCards('h') <= 1) return -3.5; //如果对敌方使用技能则返回负值(return -3.5)
										return -2;
									},
								},
								order: 2,
								expose: 0.4,
							},
							"_priority": 0,
						},
						jinzuB: {
							trigger: {
								player: "phaseJudgeEnd",
							},
							unique: true,
							onremove: true,
							mark: true,
							marktext: "禁",
							locked: true,
							forced: true,
							intro: {
								name: "禁闭",
								content: "判定阶段结束时移去此标记，跳过摸牌阶段并摸一张牌。",
							},
							content: function () {
								player.draw();
								player.skip('phaseDraw');
								player.removeSkill('jinzuB');
							},
							"_priority": 0,
						},
						shouhuA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							direct: true,
							trigger: {
								global: "damageBegin4",
							},
							filter: function (event, player) {
								if (player.countCards('h') == 0) return false;
								return event.num > 1;
							},
							content: function () {
								'step 0'
								player.chooseCard(get.prompt('shouhuA'), 'h', '弃置一张红色手牌令' + get.translation(trigger.player) + '受到的伤害-1').ai = function (card) {
									if (get.attitude(player, trigger.player) > 0) return (get.color(card) == 'red');
									else return 0;
								}
								'step 1'
								if (result.bool && result.cards.length && get.color(result.cards[0]) == 'red') {
									player.discard(result.cards);
									player.logSkill('shouhuA', trigger.player);
									player.line(trigger.player, 'green');
									trigger.num--;
								}
								else {
									event.finish();
								}
							},
							"_priority": 0,
						},
						fengyinA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							direct: true,
							unique: true,
							onremove: true,
							mark: true,
							limited: true,
							skillAnimation: true,
							animationStr: "听凭风引",
							animationColor: "wood",
							trigger: {
								source: "damageBegin2",
							},
							filter: function (event, player) {
								if (player.storage.fengyinA) return false;
								return player != event.player;
							},
							content: function () {
								'step 0'
								player.chooseBool(get.prompt('fengyinA'), '对' + get.translation(trigger.player) + '造成的伤害-1并摸两张牌，然后你失去此技能并令' + get.translation(trigger.player) + '获得此技能').set('ai', function () {
									if (get.attitude(player, trigger.player) > 0)
										return 1;
									else return 0;
								});
								'step 1'
								if (result.bool) {
									player.awakenSkill('fengyinA');
									player.storage.fengyinA = true;
									player.removeSkill('fengyinA');
								} else event.finish();
								'step 2'
								player.logSkill('fengyinA', trigger.player);
								trigger.num--;
								player.draw(2);
								trigger.player.addTempSkill('fengyinA', { player: "dieAfter" });
								trigger.player.restoreSkill('fengyinA');
							},
							intro: {
								content: "limited",
								mark: function (dialog, content, player) {
									return '听凭风引';
								},
							},
							init: function (player, skill) {
								player.storage[skill] = false;
							},
							"_priority": 0,
						},
						tuanzhangA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							unique: true,
							global: "tuanzhangB",
							zhuSkill: true,
							"_priority": 0,
						},
						tuanzhangB: {
							enable: "phaseUse",
							usable: 1,
							discard: false,
							lose: false,
							delay: false,
							line: true,
							direct: true,
							clearTime: true,
							selectCard: 1,
							filterCard: true,
							position: "h",
							prepare: function (cards, player, targets) {
								targets[0].logSkill('tuanzhangA');
							},
							prompt: function () {
								var player = _status.event.player;
								var list = game.filterPlayer(function (target) {
									return target != player && target.hasZhuSkill('tuanzhangA', player);
								});
								var str = '将一张手牌交给' + get.translation(list);
								if (list.length > 1) str += '中的一人';
								return str;
							},
							filter: function (event, player) {
								if (player.group != 'mengde') return false;
								if (player.countCards('h') == 0) return false;
								if (player.hasSkill("tuanzhangC")) return false;
								return game.hasPlayer(function (target) {
									return target != player && target.hasZhuSkill('tuanzhangA', player);
								});
							},
							log: false,
							visible: true,
							filterTarget: function (card, player, target) {
								return target != player && target.hasZhuSkill('tuanzhangA', player);
							},
							content: function () {
								'step 0'
								target.gain(cards, player, 'giveAuto');
								'step 1'
								target.chooseBool('是否令当前回合角色摸两张牌，且此阶段可多使用一张【杀】？');
								'step 2'
								if (result.bool) {
									target.line(player, 'green');
									player.addTempSkill('tuanzhangC', player.phaseUseEnd);
									player.draw(2);
								} else event.finish();
							},
							ai: {
								threaten: 1,
								result: {
									target: function (player, target) {
										return 3.5;
									},
								},
								order: 10,
								expose: 0.4,
							},
							"_priority": 0,
						},
						tuanzhangC: {
							unique: true,
							onremove: true,
							mark: true,
							marktext: "团",
							locked: true,
							intro: {
								name: "团长",
								content: "此阶段可多使用一张【杀】。",
							},
							mod: {
								cardUsable: function (card, player, num) {
									if (card.name == 'sha') return num + 1;
								},
							},
							"_priority": 0,
						},
						yanchangA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							enable: "phaseUse",
							usable: 1,
							selectTarget: 1,
							filter: function (event, player) {
								return (game.countPlayer(function (current) {
									return current.countCards('hej') > 0;
								}));
							},
							filterTarget: function (card, player, target) {
								return target.countCards('hej') > 0;
							},
							content: function () {
								"step 0"
								player.discardPlayerCard(target, 'hej', true);
								"step 1"
								target.recover(player);
							},
							ai: {
								threaten: 3,
								result: {
									target: function (player, target) {
										if (target.countCards('he') >= 1 && target.hp == target.maxHp) return -1;
										if (target.countCards('hej') >= 1 && target.hp < target.maxHp) return 3.5; //如果对敌方使用技能则返回负值(return -3.5)
										return 2;
									},
								},
								order: 4,
								expose: 0.4,
							},
							"_priority": 0,
						},
						shengmuA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							trigger: {
								player: "damageEnd",
							},
							filter: function (event, player) {
								return event.source && event.source != player && event.source.isAlive();
							},
							content: function () {
								"step 0"
								event.count = trigger.num;
								"step 1"
								player.draw(2);
								"step 2"
								if (player.countCards('h') > 0) {
									player.chooseCard('h', '选择一张手牌交给' + get.translation(trigger.source), true);
								}
								"step 3"
								if (result.bool && result.cards.length) {
									player.line(trigger.source, 'green');
									trigger.source.gain(result.cards, player, 'giveAuto')
								}
								event.count--;
								"step 4"
								game.delay();
								"step 5"
								if (event.count) {
									event.goto(1);
								}
								else event.finish();
							},
							ai: {
								maixie: true,
								"maixie_hp": true,
							},
							"_priority": 0,
						},
						ouxiangA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							group: ["ouxiangD", "ouxiangE"],
							popup: false,
							forced: true,
							trigger: {
								player: "phaseJieshuBegin",
							},
							filter: function (event, player) {
								return player.getHistory('sourceDamage').length == 0;
							},
							content: function () {
								'step 0'
								player.chooseTarget(get.prompt('ouxiangA'), '对一名没有“信徒”标记的其他角色进行传教', function (card, player, target) {
									return player != target && !target.hasSkill("ouxiangC");
								}, true)
								'step 1'
								event.target = result.targets[0];
								if (event.target.hasSkill("ouxiangB")) { event.target.removeSkill('ouxiangB'); event.target.addSkill('ouxiangC'); }
								else event.target.addSkill('ouxiangB');
								'step 2'
								if ((game.countPlayer() - 1) == game.countPlayer(function (current) {
									return current.hasSkill('ouxiangC');
								})) player.logSkill('ouxiangE', result.targets);
								else player.logSkill('ouxiangA', result.targets);
							},
							ai: {
								threaten: 10,
							},
							"_priority": 0,
						},
						ouxiangB: {
							forceDie: true,
							popup: false,
							forced: true,
							unique: true,
							onremove: true,
							mark: true,
							marktext: "传",
							locked: true,
							intro: {
								name: "传教",
								content: "正在被芭芭拉传教。",
							},
							trigger: {
								global: "die",
							},
							filter: function (event, player) {
								return event.player != player && event.player.hasSkill("ouxiangA");
							},
							content: function () {
								player.removeSkill('ouxiangB');
							},
							"_priority": 0,
						},
						ouxiangC: {
							forceDie: true,
							popup: false,
							forced: true,
							unique: true,
							onremove: true,
							mark: true,
							marktext: "信",
							locked: true,
							intro: {
								name: "信徒",
								content: "芭芭拉的信徒。",
							},
							trigger: {
								global: "die",
							},
							filter: function (event, player) {
								return event.player != player && event.player.hasSkill("ouxiangA");
							},
							content: function () {
								player.removeSkill('ouxiangC');
							},
							"_priority": 0,
						},
						ouxiangD: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							skillAnimation: true,
							animationStr: "闪耀偶像",
							animationColor: "water",
							forced: true,
							trigger: {
								player: "phaseZhunbeiBegin",
							},
							filter: function (event, player) {
								return (game.countPlayer() - 1) == game.countPlayer(function (current) {
									return current.hasSkill('ouxiangC');
								});
							},
							content: function () {
								var bool = false;
								if (player == game.me) bool = true;
								game.over(bool);
							},
							"_priority": 0,
						},
						ouxiangE: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							popup: false,
							forced: true,
							trigger: {
								global: "gameDrawAfter",
								player: "enterGame",
							},
							filter: function (event, player) {
								return game.countPlayer() < 5;
							},
							content: function () {
								player.awakenSkill('ouxiangA');
							},
							"_priority": 0,
						},
						huobanA: {
							group: "huobanC",
							audio: "ext:原梗Enhanced/audio/skill:2",
							unique: true,
							mark: true,
							skillAnimation: true,
							animationStr: "最好伙伴",
							animationColor: "gray",
							limited: true,
							enable: "phaseUse",
							init: function (player) {
								player.storage.huobanA = false;
							},
							filter: function (event, player) {
								return !game.hasPlayer(function (current) {
									return current.hasSkill('huobanB');
								});
							},
							filterTarget: function (card, player, target) {
								if (target == player) return false;
								return true;
							},
							content: function () {
								'step 0'
								player.awakenSkill('huobanA');
								player.storage.huobanA = true;
								'step 1'
								if (!player.storage.huobanB) player.storage.huobanB = [];
								player.storage.huobanB.push(target);
								target.addSkill('huobanB');
								target.recover(player);
								player.changeGroup(target.group);
								player.addSkill('huobanD');
								player.awakenSkill('bushiA');
							},
							intro: {
								content: "limited",
								mark: function (dialog, content, player) {
									return '最好伙伴';
								},
							},
							ai: {
								result: {
									target: function (player, target) {
										return 4;
									},
								},
								order: 6,
								expose: 0.4,
							},
							"_priority": 0,
						},
						huobanB: {
							unique: true,
							onremove: true,
							mark: true,
							limited: true,
							marktext: "派",
							locked: true,
							intro: {
								name: "派蒙",
								content: "最好的伙伴！",
							},
							skillAnimation: true,
							init: function (player, skill) {
								player.storage[skill] = false;
							},
							"_priority": 0,
						},
						huobanC: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							forced: true,
							trigger: {
								global: "damageSource",
							},
							filter: function (event, player) {
								if (event.player == player || !event.source) return false;
								if (!event.source.isAlive()) return false;
								if (!event.source.hasSkill("huobanB") || event.player.hasSkill("huobanB")) return false;
								return player.hasSkill('huobanA', event.source);
							},
							content: function () {
								if (player.hp < player.maxHp) player.recover();
								else player.draw();
							},
							mod: {
								targetEnabled: function (card, player, target, now) {
									if (game.countPlayer(function (current) {
										return current.hasSkill('huobanB');
									}) > 0) {
										if (card.name == 'juedou') return false;
									}
								},
								"cardEnabled2": function (card, player) {
									if (game.countPlayer(function (current) {
										return current.hasSkill('huobanB');
									}) > 0) {
										if (card.name == 'juedou') return false;
									}
								},
							},
							"_priority": 0,
						},
						huobanD: {
							forced: true,
							trigger: {
								global: "die",
							},
							filter: function (current) {
								return !game.countPlayer(function (current) {
									return current.hasSkill('huobanB') && current.isAlive();
								});
							},
							content: function () {
								player.awakenSkill('huobanC');
								player.awakenSkill('huobanD');
								player.awakenSkill('danxiaoA');
								player.awakenSkill('xiangdaoA');
								player.addSkill('huobanE');
							},
							"_priority": 0,
						},
						huobanE: {
							forceDie: true,
							forced: true,
							mark: true,
							marktext: "无",
							intro: {
								name: "无助",
								content: "杀死你的角色摸三张牌。",
							},
							trigger: {
								player: "die",
							},
							filter: function (current) {
								if (!event.source) return false;
								if (!event.source.isAlive()) return false;
								if (event.source == player) return false;
								return true;
							},
							content: function () {
								trigger.source.draw(3);
							},
							ai: {
								threaten: 5,
							},
							"_priority": 0,
						},
						bushiA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							frequent: true,
							trigger: {
								player: "phaseJieshuBegin",
							},
							content: function () {
								player.draw();
							},
							"_priority": 0,
						},
						xiangdaoA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							enable: "phaseUse",
							usable: 1,
							filterCard: true,
							selectCard: -1,
							discard: false,
							lose: false,
							delay: false,
							filter: function (event, player) {
								return player.countCards('h') > 1 && player.storage.huobanB && game.countPlayer(function (current) {
									return current.hasSkill('huobanB') && current.isAlive();
								}) > 0;
							},
							content: function () {
								var target = player.storage.huobanB[0];
								player.line(target, 'green');
								target.recover(player);
								target.gain(cards, player, 'giveAuto');
							},
							ai: {
								order: 8,
								result: {
									player: function (player) {//ai是否发动此技能，返回正，发动，否则不发动
										if (get.attitude(player, player.storage.huobanB[0]) > 0) return 1;
										return 0;
									},
								},
							},
							"_priority": 0,
						},
						danxiaoA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							forced: true,
							trigger: {
								player: "damageBegin4",
							},
							filter: function (event, player) {
								if (!event.source) return false;
								if (!event.source.isAlive()) return false;
								return event.card && event.card.name == 'sha' && !player.inRange(event.source) && event.source != player && event.notLink();
							},
							content: function () {
								trigger.cancel();
							},
							ai: {
								effect: {
									target: function (card, player, target) {
										if (get.type(card) == 'basic' && get.tag(card, 'damage') && !player.inRangeOf(target)) return 'zerotarget';
									},
								},
							},
							"_priority": 0,
						},
						yizhouA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							charlotte: true,
							unique: true,
							forced: true,
							trigger: {
								global: "gameDrawAfter",
								source: "damageSource",
								player: "damageEnd",
							},
							filter: function (event, player, name) {
								if (name == "damageSorce" || name == "damageEnd") {
									if (event._notrigger.includes(event.player)) return false;
									return (event.source != player && event.source) || (event.player != player && event.player.isIn());
								}
								else return true;
							},
							content: function () {
								'step 0'
								if (event.triggername == "gameDrawAfter") {
									player.addToExpansion(get.cards(player.maxHp), 'draw').gaintag.add('yizhouB');
									event.finish();
								}
								else event.goto(1);
								'step 1'
								event.count = trigger.num;
								event.target = trigger.source == player ? trigger.player : trigger.source;
								if (event.target.countCards('hej') >= trigger.num) {
									player.choosePlayerCard(event.target, trigger.num, 'hej', false, "选择" + get.translation(event.target) + "的" + event.count + "张牌", "visible")
										.set('ai', (button) => player.getDamagedHp() > Math.floor(player.maxHp * 0.5) ? 0 : get.buttonValue(button));
									event.goto(3);
								}
								else event.goto(2);
								'step 2'
								player.addToExpansion(get.cards(event.count), 'draw').gaintag.add('yizhouB');
								event.finish();
								'step 3'
								if (result.bool)
									player.addToExpansion(result.links, event.target, 'give').gaintag.add('yizhouB');
								else {
									player.recover();
									event.finish();
								}
							},
							group: ["yizhouB"],
							ai: {
								threaten: 0.6,
								maixie: true,
								maixie_defend: true,
							},
							"_priority": 0,
						},
						yizhouB: {
							charlotte: true,
							silent: true,
							unique: true,
							onremove: true,
							mark: true,
							marktext: "樱",
							intro: {
								name: "樱",
								mark: function (dialog, content, player) {
									var content = player.getExpansions('yizhouB');
									if (content && content.length) {
										if (player == game.me || player.isUnderControl()) {
											dialog.addAuto(content);
										}
										else {
											return '共有' + get.cnNumber(content.length) + '张樱';
										}
									}
								},
							},
							"_priority": 0,
						},
						xianzhenA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							popup: false,
							usable: 3,
							unique: true,
							enable: ["chooseToUse", "chooseToRespond"],
							filter(event, player) {
								if (!player.getExpansions('yizhouB').length > 0) return false;
								for (var i = 0; i < lib.inpile.length; i++) {
									var name = lib.inpile[i];
									if (name != 'du' && get.type(name) == 'basic' && event.filterCard({ name: name, storage: { xianzhenA: true } }, player, event))
										return true;
								}
								return false;
							},
							chooseButton: {
								dialog(event, player) {
									var list = [];
									for (var i of lib.inpile) {
										if (i != 'du' && get.type(i, false) == 'basic') {
											if (event.filterCard({ name: i, storage: { xianzhenA: true } }, player, event)) list.push(['基本', '', i]);
											if (i == 'sha') {
												for (var j of lib.inpile_nature) {
													if (event.filterCard({ name: i, nature: j, storage: { xianzhenA: true } }, player, event)) list.push(['基本', '', i, j]);
												}
											}
										}
									}
									const dialog = ui.create.dialog('请选择一张基本牌', [list, 'vcard'], '请选择一张‘樱’', player.getExpansions('yizhouB'));
									return dialog;
								},
								/**
								 * 这个filter是控制按钮是否能选择，当没有选择按钮的时候，只能选满足印牌事件的父事件下可以使用的且不为实体牌的牌，选了一个按钮以后只能选择实体牌、
								 * 所以形成了先选一张要印的牌（虚拟牌），再选武将牌上的一张牌
								 */
								filter: function (button, player) {
									if (ui.selected.buttons.length) {
										return get.itemtype(button.link) == 'card';
									}
									return get.itemtype(button.link) != 'card' && _status.event.getParent().filterCard({ name: button.link[2], storage: { xianzhenA: true } }, player, _status.event.getParent());
								},
								select: 2,
								/**
								 * check函数执行时会遍历每一个可以选择的button,选择返回值中最大的且>0的按钮。
								 */
								check(button) {
									const player = get.player();
									if (ui.selected.buttons.length) {
										if (ui.selected.buttons.length > 1) return 0;/* 选择了俩个按钮后不再选择 */
										return Math.random();
									}
									if (_status.event.getParent().type != "phase") return 1;
									let card = { name: button.link[2], nature: button.link[3], storage: { xianzhenA: true } };
									return player.getUseValue(card);
								},
								backup: function (links, player) {
									var next = {
										audio: "xianzhenA",
										popname: true,
										selectCard: -1,
										filterCard: function (card) {
											return links.includes(card);
										},
										position: 'x',
										viewAs: { name: links[0][2], nature: links[0][3], storage: { xianzhenA: true } },
										precontent() {
											event.getParent().addCount = false;
										},
									};
									return next;
								},
								prompt(links) {
									return '将一张“樱”当做' + (get.translation(links[0][3]) || '') + get.translation(links[0][2]) + '使用';
								},
							},
							hiddenCard: function (player, name) {
								if (!lib.inpile.includes(name)) return false;
								return name != "du" && get.type(name) == "basic" && player.hasExpansions("yizhouB");
							},
							mod: {
								targetInRange: function (card, player, target, now) {
									if (get.type(card) == 'basic' && card.storage && card.storage.xianzhenA) return true;
								},
								cardUsable: function (card, player, num) {
									if (get.type(card) == 'basic' && card.storage && card.storage.xianzhenA) return Infinity;
								},
							},
							ai: {
								expose: 0.6,
								threaten: 1.5,
								order: function (item, player) {
									if (player && _status.event.type == "phase") {
										var max = 0, add = false;
										var list = lib.inpile.filter(name => get.type(name) == 'basic');
										if (list.includes('sha')) add = true;
										list = list.map(namex => { return { name: namex, storage: { xianzhenA: true } } });
										if (add) lib.inpile_nature.forEach(naturex => list.push({ name: 'sha', nature: naturex, storage: { xianzhenA: true } }));
										for (var card of list) {
											if (player.getUseValue(card) > 0) {
												var temp = get.order(card);
												if (temp > max) max = temp;
											}
										}
										if (max > 0) max += 0.3;
										return max;
									}
									return 1;
								},
								save: true,
								respondSha: true,
								respondShan: true,
								fireAttack: true,
								skillTagFilter: function (player, tag, arg) {
									return player.hasExpansions('yizhouB');
								},
								result: {
									/**控制技能的收益 AI必定会在该印牌时印牌
									 * 但是救援只会救关系好的对象，也就是救队友
									 */
									player: function (player) {
										if (_status.event.dying) return get.attitude(player, _status.event.dying);
										return 1;
									},
								},
							},
							onremove(player, skill) {
								var cards = player.getExpansions("yizhouB");
								if (cards.length) player.loseToDiscardpile(cards);
							},
						},
						wangyueA: {
							popup: false,
							"_priority": 0,
						},
						xuanjiA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							forced: true,
							trigger:
							{
								global: "phaseBegin",
							},
							filter: function (event, player) {
								return player.isIn() && player.hasEquipableSlot(2) && player.hasEquipableSlot(5);
							},
							content: function () {
								const list1 = ["zhuangshu_basic", "zhuangshu_trick", "zhuangshu_equip", "sanlve"];
								const list2 = ["qimenbagua", "guofengyupao", "hongmianbaihuapao", "rewrite_baiyin",];
								let card1 = game.createCard(list1.randomGet());
								let card2 = game.createCard(list2.randomGet());
								player.equip(card1);
								player.equip(card2);
							},
							"_priority": 7,
						},
						yugeA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							enable: "phaseUse",
							usable: 3,
							locked:true,
							selectCard: 2,
							filterCard: true,
							position: "hs",
							multitarget: true,
							multiline: true,
							selectTarget: [1, Infinity],
							filterTarget: function (card, player, target) {
								return player != target;
							},
							viewAsFilter: function (player) {
								return player.countCards("hes") > 1;
							},
							viewAs: {
								name: "tianquanbengyuA",
							},
							prompt: "将两张牌当【天权崩玉】使用",
							group: ['yugeA_1', 'yugeA_2'],
							subSkill: {
								"1": {
									trigger: {
										source: "damageSource",
									},
									forced: true,
									filter: function (event, player) {
										return event.card && event.card.name == 'tianquanbengyuA' && event.player.isIn() && event.player.countCards('hes');
									},
									"prompt2": (event, player) => '弃置' + get.translation(event.player) + '的一张牌',
									content: function () {
										player.logSkill('yugeA', trigger.player);
										player.discardPlayerCard('he', trigger.player, true, "visible").set("ai", function (button) {
											if (!_status.event.att) return 0;
											if (get.position(button.link) == "e") {
												if (get.subtype(button.link) == "equip3" || get.subtype(button.link) == "equip2")
													return 2 * get.value(button.link);
												return get.value(button.link);
											}
											return 1;
										});
									},
									sub: true,
								},
								"2": {
									direct: true,
									locked: true,
									trigger: {
										global: "respond",
									},
									filter: function (event, player) {
										return event.getParent(2).name == 'tianquanbengyuA' && event.getParent(3).player == player;
									},
									content: function () {
										player.logSkill('yugeA', trigger.player);
										if (trigger.player.countCards('he')) {
											player.gainPlayerCard(trigger.player, 1, 'he', true, "visible");
										}
									},
									sub: true,
								},
							},
							ai: {
								threaten: 2.1,
								order: 7,
							},
							"_priority": 0,
						},
						caiyuanA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							forced: true,
							trigger: {
								global: ["gainAfter", "loseAsyncAfter"],
							},
							filter: function (event, player) {
								return !player.isMaxHandcard(true);
							},
							async content(event, trigger, player) {
								const target = game.findPlayer(current => current.isMaxHandcard());
								let drawNumber = target.countCards("h") + 1;
								await player.drawTo(drawNumber);
							},
							"_priority": 0,
						},
						miaosuanA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							forced: true,
							trigger: {
								player: "phaseDrawBegin",
							},
							filter: function (event, player) {
								return player.isIn();
							},
							content: function () {
								'step 0'
								trigger.cancel();
								event.cards = [];
								event.num = 1;
								event.getResultString = function (number) {
									switch (number) {
										case 0:
											return 'basic';
										case 1:
											return 'trick';
										case 2:
											return 'equip';
									}
									return number;
								};
								'step 1'
								player
									.chooseControl('基本牌', '锦囊牌', '装备牌')
									.set('prompt', '请选择想要获得的第' + get.cnNumber(event.num, true) + '张牌的类型')
									.set("ai", function () {
										var randomResult = Math.random();
										if (player.countCards("h", { type: ["trick", "delay"] }) == 0) return 1;
										else if (player.countCards("h", { type: "basic" }) == 0) return 0;
										else if (randomResult < 0.6) return 1;
										else if (randomResult < 0.9) return 0;
										else return 2;
									});
								'step 2'
								let maxNumber = Math.max(game.countPlayer(), player.getDamagedHp());
								event.control = event.getResultString(result.index);
								var card = get.cardPile2(function (card) {
									return get.type(card, 'trick') == event.control && !event.cards.includes(card);
								});
								if (card) {
									event.cards.push(card);
								} else {
									player.chat('无牌可得了吗');
									game.log(`但是牌堆里面已经没有${result.control}了!`);
								}
								if (event.num < maxNumber) {
									event.num++;
									event.goto(1);
								} else {
									if (event.cards.length) {
										player.gain(event.cards, 'gain2');
									}
								}
							},
							group: ["miaosuanA_1", "miaosuanA_2"],
							subSkill: {
								1: {
									mark: true,
									marktext: "策",
									intro: {
										name: "庙算无遗",
										content: function (storage, player) {
											let num = player.getHistory('useSkill', evt => evt.skill == 'miaosuanA_1').length;
											return `发现锦囊牌概率为：${Math.round((1 - 0.15 * Math.min(num, 6)) * 100)}%`;
										}
									},
									init: player => player.markSkill("miaosuanA_1"),//开始游戏即显示技能标记
									trigger: {
										player: "useCardAfter",
									},
									forced: true,
									filter: function (event, player) {
										let num = player.getHistory('useSkill', evt => evt.skill == 'miaosuanA_1').length;
										// event.miaosuanA_OK = (event.miaosuanA_OK != null) ? event.miaosuanA_OK : (Math.random() <= 1 - 0.15 * Math.min(num, 6));
										return event.card && get.type2(event.card) == 'trick' && event.getRand("miaosuanA_1") <= 1 - 0.15 * Math.min(num, 6);
									},
									async content(event, trigger, player) {
										let discoverCardList = [];
										for (var i in lib.inpile) {
											if (get.type2(lib.inpile[i]) == "trick") {
												discoverCardList.push(["锦囊", "", lib.inpile[i]]);
											}
										}
										if (discoverCardList.length < 4) {
											await player.draw(4);
											return;
										}
										let result = await player.chooseButton()
											.set("createDialog", ["庙算：请选择一至两张锦囊牌", [discoverCardList.randomGets(4), "vcard"]])
											.set("forced", true)//强制选择
											.set("selectButton", [1, 2])
											.set("ai", function (button) {
												const cardName = button.link[2]; // 依赖按钮的link[2]数据
												const baseValue = get.value({ name: cardName }); // 调用外部值获取
												let priority = Math.random() * baseValue * 10;
												if (lib.card[cardName].selectTarget == -1) {
													if (!get.tag(cardName, 'damage')) {
														priority *= 0.4; // 特定卡牌降权60%
													}
													else
														priority *= 2;
												}
												return priority; // 最终优先级数值
											}).forResult();
										if (result.buttons) {
											let gainCardList = [];
											for (let i = 0; i < result.buttons.length; i++) {
												gainCardList.push(game.createCard(result.buttons[i].link[2]));
											}
											await player.gain(gainCardList, "gain2");
										}
									},
									ai: {
										effect: {//牌的影响
											player: function (card, player, target) {//你使用牌时对你的影响
												if (get.type2(card) == "trick") {//如果使用的牌是锦囊牌
													return [2, 1.4];
												}
											},
										},
									},
									sub: true,
								},
								2: {
									trigger: {
										player: "useCard",
									},
									forced: true,
									silent: true,
									filter: function (event, player) {
										return get.type(event.card) == 'trick' && event.card;
									},
									content: function () {
										trigger.directHit.addArray(game.players);
									},
									sub: true,
								},
							},
							"_priority": 0,
						},
						hairanA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							charlotte: true,
							forced: true,
							popup: false,
							locked: false,
							trigger: {
								player: "recoverEnd",
							},
							filter: function (event, player) {
								return _status.currentPhase == player && !player.isDying() && event.source == player;
							},
							content: function () {
								"step 0"
								player.chooseTarget('请选择一名其他角色，令其失去所有体力。', function (card, player, target) {
									return player != target
								}).set('ai', function (target) {
									return -get.attitude(player, target);   //选择敌人
								});
								"step 1"
								if (result.bool) {
									player.logSkill('hairanA');
									var target = result.targets[0];
									target.loseHp(target.hp);
									player.line(target, 'green');
								}
								else event.finish();
							},
							group: ["hairanB", "hairanA_1"],
							subSkill: {
								"1": {
									charlotte: true,
									silent: true,
									mark: true,
									marktext: "羽衣",
									intro: {
										name: "仪来羽衣",
										content: function (storage, player) {
											if (storage) return "萦绕在周身的清光化为羽衣，辉映着珊瑚宫大人的堂堂之姿。";
											else return "已失去深海的加护";
										},//标记介绍内容
									},
									init: function (player) {//初始化(好习惯)，获得这个技能时执行的内容
										player.storage.hairanA_1 = 3;//初始为3个标记
										player.syncStorage("hairanA_1");//同步标记(每当标记变动都要写这句)
										player.markSkill("hairanA_1");
									},
									trigger: {
										global: "phaseBegin",
									},
									filter: function (event, player) {
										return player.isIn();
									},
									content: function () {
										var num = player.countMark("hairanA_1");
										if (num != 3)
											player.addMark("hairanA_1", 3 - num);
									},
									onremove: true,
									sub: true,
								},
							},
							mod: {
								aiOrder: function (player, card, num) {
									/*更改AI使用卡的顺序(player为你，card为要判断的牌，num为上次判断后的order值)
									参考技能【渐营】【奋音】【联翩】*/
									if (get.tag(card, 'recover') && player.isDamaged()) return num + 8;
								},
							},
							ai: {
								expose: 0.9,
								threaten: 1.5,
							},
							"_priority": 0,
						},
						hairanB: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							usable: 3,
							charlotte: true,
							superCharlotte: true,
							forced: true,
							trigger: {
								target: "useCardToTargeted",
							},
							filter: function (event, player) {
								if (event.player.countCards("h") < player.countCards("h") &&
									event.player.countCards("e") < player.countCards("e") &&
									event.player.hp < player.hp
								) { return false; }
								return event.player != player && event.card && get.tag(event.card, "damage") && (['trick', 'basic'].includes(get.type(event.card)));
							},
							content: function () {
								trigger.getParent().excluded.add(player);
								player.removeMark("hairanA_1", 1);
							},
							ai: {
								threaten: 0.4,
								effect: {//牌的影响
									target: function (card, player, target) {//你成为牌的目标时对你的影响 player是来源 target是你
										if (get.tag(card, "damage") && ['trick', 'basic'].includes(get.type(card)) && target.hasMark("hairanA_1")) {
											return 0;
										}
									},
								},
							},
						},
						yuehuaA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							usable: 1,
							locked: true,
							enable: "chooseToUse",
							viewAs: {
								name: "tao",
							},
							viewAsFilter: function (player) {
								return player.countCards('hes') > 0;
							},
							filterCard: true,
							position: "hes",
							prompt: "将一张牌当作【桃】使用，然后你可以令任意名非濒死状态下的角色各增加1点体力上限并回复1点体力。",
							check: function (card) {
								return 8 - get.value(card);
							},
							onuse: function (result, player) {
								player.addTempSkill('yuehuaA_recover');
							},
							subSkill: {
								recover: {
									charlotte: true,
									direct: true,
									locked: true,
									trigger: {
										player: "useCardAfter",
									},
									filter: function (event, player) {
										return event.skill == 'yuehuaA' && game.hasPlayer(current => !current.isDying());;
									},
									content: function () {
										"step 0"
										player.chooseTarget(get.prompt("yuehuaA"), [1, Infinity], function (card, player, target) {//选1个目标
											return !target.isDying();//限制条件:濒死状态下的其他角色和你都不是目标
										}).set("ai", function (target) {//设置ai:
											return get.attitude(player, target);//选友军
										});
										"step 1"
										if (result.bool) {
											for (var i = 0; i < result.targets.length; i++) {
												result.targets[i].gainMaxHp();
												result.targets[i].recover();
											}
										}
										else event.finish();
									},
									sub: true,
								},
							},
							ai: {
								threaten: 1.6,
								order: 10,
								expose: 0.4,
							},
						},
						// miaojiA: {
						// 	audio: "ext:原梗Enhanced/audio/skill:2",
						// 	group: ["miaojiB", "miaojiC"],
						// 	enable: "phaseUse",
						// 	usable: 1,
						// 	filterCard: true,
						// 	selectCard: 1,
						// 	position: "h",
						// 	discard: false,
						// 	filter: function (event, player) {
						// 		var cards = player.getExpansions('miaojiB');
						// 		if (cards.length >= 3) return false;
						// 		return player.countCards('h');
						// 	},
						// 	content: function () {
						// 		player.addToExpansion(cards[0], 'giveAuto').gaintag.add('miaojiB');
						// 	},
						// 	check: function (card) {
						// 		return 8 - ai.get.value(card);
						// 		//选取价值小于8的牌。数字越大，会选用的牌范围越广，8以上甚至会选用桃发动技能，一般为6-ai.get.value(card); 
						// 	},
						// 	ai: {
						// 		order: 2,
						// 		result: {
						// 			player: 1,
						// 		},
						// 	},
						// 	"_priority": 0,
						// },
						// miaojiB: {
						// 	popup: false,
						// 	unique: true,
						// 	onremove: true,
						// 	mark: true,
						// 	marktext: "计",
						// 	locked: true,
						// 	forced: true,
						// 	intro: {
						// 		name: "妙计",
						// 		mark: function (dialog, content, player) {
						// 			var content = player.getExpansions('miaojiB');
						// 			if (content && content.length) {
						// 				if (player == game.me || player.isUnderControl()) {
						// 					dialog.addAuto(content);
						// 				}
						// 				else {
						// 					return '共有' + get.cnNumber(content.length) + '张妙计';
						// 				}
						// 			}
						// 		},
						// 	},
						// 	"_priority": 0,
						// },
						// miaojiC: {
						// 	audio: "ext:原梗Enhanced/audio/skill:2",
						// 	popup: false,
						// 	trigger: {
						// 		global: "useCard",
						// 	},
						// 	filter: function (event, player) {
						// 		if (player.getExpansions('miaojiB').length == 0) return false;
						// 		if (event.all_excluded || event.player == player || event.player != _status.currentPhase) return false;
						// 		return event.player.getHistory('useCard').indexOf(event) == 0 && ['basic', 'trick', 'equip', 'delay'].contains(get.type(event.card));
						// 	},
						// 	content: function () {
						// 		'step 0'
						// 		player.chooseCardButton('选择一张与此牌类别相同的妙计', 1, player.getExpansions('miaojiB'));
						// 		'step 1'
						// 		if (result.bool && result.links.length && (get.type(result.links[0]) == get.type(trigger.card) || (get.type(result.links[0]) == 'trick' && get.type(trigger.card) == 'delay') || (get.type(result.links[0]) == 'delay' && get.type(trigger.card) == 'trick'))) {
						// 			player.loseToDiscardpile(result.links);
						// 			trigger.targets.length = 0;
						// 			trigger.all_excluded = true;
						// 			player.line(_status.currentPhase, 'green');
						// 			player.logSkill('miaojiC');
						// 			if (_status.currentPhase.countCards('he') > 0)
						// 				player.discardPlayerCard(true, _status.currentPhase, 'he');
						// 		} else event.finish();
						// 		'step 2'
						// 		if (player.getExpansions('miaojiB').length == 0)
						// 			player.unmarkSkill('miaojiB');
						// 	},
						// 	check: function (event, player) {
						// 		return get.attitude(player, event.player) < 0;
						// 		//大于0为选择队友发动，若<=0是对敌方发动
						// 	},
						// 	"_priority": 0,
						// },
						jingyaoA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							charlotte: true,
							forced: true,
							trigger: {
								player: "useCard2",
							},
							filter: function (event, player) {
								if (event.targets && event.targets.length > 1) return false;
								if (game.countPlayer() <= 2) return false;
								if (["equip", "delay"].contains(get.type(event.card)) || ["shan", "wuxie"].contains(event.card.name)) return false;
								return true;
							},
							content: function () {
								'step 0'
								player.chooseTarget([1, Infinity], '你可以令' + get.translation(trigger.card) + '增加任意名目标', function (card, player, target) {
									var player = _status.event.player;
									if (_status.event.targets.contains(target)) return false;
									return lib.filter.targetEnabled2(_status.event.card, player, target);
								}).set('targets', trigger.targets).set('card', trigger.card).set('ai', function (target) {
									var trigger = _status.event.getTrigger();
									var player = _status.event.player;
									return get.effect(target, trigger.card, player, player);
								});
								'step 1'
								if (result.bool) {
									if (!event.isMine() && !event.isOnline()) game.delayx();
									for (var i = 0; i < result.targets.length; i++) {
										trigger.targets.push(result.targets[i]);
									}
									player.logSkill('jingyaoA', trigger.targets);
									player.line(trigger.targets, 'green');
								}
							},
							"_priority": 0,
						},
						yezhangA: {
							group: ["yezhangB", "yezhangC"],
							forced: true,
							popup: false,
							trigger: {
								player: "useCard",
							},
							filter: function (event, player) {
								return event.card && event.card.name == "sha";
							},
							content: function () {
								trigger.directHit.addArray(game.filterPlayer(function (current) {
									return current != player && current.hp >= player.hp && trigger.targets.contains(current);
								}));
								player.addTempSkill('unequip', 'useCardAfter');
							},
							"_priority": 0,
						},
						yezhangB: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							forced: true,
							trigger: {
								player: "phaseAfter",
							},
							filter: function (event, player) {
								return player.isIn();
							},
							content: function () {
								if (player.getStat('kill') > 1) {
									player.goMad({ player: 'phaseBegin' });
								}
							},
							"_priority": 0,
						},
						yezhangC: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							forced: true,
							trigger: {
								source: "damageBegin",
							},
							filter: function (event, player, name) {
								return player.isIn() && event.player != player && event.card.name == "sha";
							},
							content: function () {
								trigger.num++;
							},
							"_priority": 0,
						},
						nizongA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							trigger: {
								player: "phaseEnd",
							},
							forced: true,
							filter: function (event, player) {
								return !player.getStat('damage');
							},
							content: function () {
								player.tempHide();
							},
							ai: {
								expose: 0.2,
								threaten: 1.5,
							},
							"_priority": 0,
						},
						cixiongA: {
							group: ["cixiongD", "cixiongE"],
							popup: false,
							forced: true,
							trigger: {
								global: "gameDrawAfter",
								player: "enterGame",
							},
							content: function () {
								player.addTempSkill('cixiongB', { player: "dieAfter" });
								player.restoreSkill('cixiongB');
								player.sex = 'male';
							},
							"_priority": 0,
						},
						cixiongB: {
							unique: true,
							onremove: true,
							mark: true,
							limited: true,
							marktext: "戎",
							locked: true,
							intro: {
								name: "戎装",
								content: "当前性别为男性。",
							},
							skillAnimation: true,
							init: function (player, skill) {
								player.storage[skill] = false;
							},
							"_priority": 0,
						},
						cixiongC: {
							unique: true,
							onremove: true,
							mark: true,
							limited: true,
							marktext: "女",
							locked: true,
							intro: {
								name: "女装",
								content: "当前性别为女性。",
							},
							skillAnimation: true,
							init: function (player, skill) {
								player.storage[skill] = false;
							},
							"_priority": 0,
						},
						cixiongD: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							forced: true,
							trigger: {
								player: "phaseZhunbeiBegin",
							},
							filter: function (event, player) {
								return player.hasSex('male');
							},
							content: function () {
								'step 0'
								player.awakenSkill('cixiongB');
								player.storage.cixiongB = true;
								player.removeSkill('cixiongB');
								'step 1'
								player.addTempSkill('cixiongC', { player: "dieAfter" });
								player.storage.cixiongC = false;
								player.restoreSkill('cixiongC');
								player.sex = 'female';
							},
							"_priority": 0,
						},
						cixiongE: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							forced: true,
							trigger: {
								player: "phaseJieshuBegin",
							},
							filter: function (event, player) {
								return player.hasSex('female');
							},
							content: function () {
								'step 0'
								player.awakenSkill('cixiongC');
								player.storage.cixiongC = true;
								player.removeSkill('cixiongC');
								'step 1'
								player.addTempSkill('cixiongB', { player: "dieAfter" });
								player.storage.cixiongB = false;
								player.restoreSkill('cixiongB');
								player.sex = 'male';
							},
							"_priority": 0,
						},
						fujiA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							popup: false,
							trigger: {
								global: "useCard",
							},
							filter: function (event, player) {
								if (!player.hasSkill("cixiongB")) return false;
								if (player.countCards('hs') == 0) return false;
								if (event.all_excluded || event.player == player || event.player != _status.currentPhase) return false;
								return event.player.getHistory('useCard').indexOf(event) == 1 && ['basic', 'trick', 'equip', 'delay'].contains(get.type(event.card));
							},
							content: function () {
								'step 0'
								player.chooseCard('hs', '选择一张【杀】').ai = function (card) {
									return (get.name(card) == 'sha');
								};
								'step 1'
								if (result.bool && result.cards.length && get.name(result.cards[0]) == 'sha') {
									player.discard(result.cards);
									trigger.targets.length = 0;
									trigger.all_excluded = true;
									player.line(_status.currentPhase, 'green');
									player.draw();
									player.logSkill('fujiA');
								}
								else {
									event.finish();
								}
								'step 2'
								player.awakenSkill('cixiongB');
								player.storage.cixiongB = true;
								player.removeSkill('cixiongB');
								'step 3'
								player.addTempSkill('cixiongC', { player: "dieAfter" });
								player.storage.cixiongC = false;
								player.restoreSkill('cixiongC');
								player.sex = 'female';
							},
							check: function (event, player) {
								return get.attitude(player, event.player) < 0;
								//大于0为选择队友发动，若<=0是对敌方发动
							},
							"_priority": 0,
						},
						zhixinA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							enable: "phaseUse",
							filter: function (event, player) {
								return player.hasSkill("cixiongC");
							},
							filterTarget: function (card, player, target) {
								return target != player && target.countCards('h');
							},
							content: function () {
								"step 0"
								event.videoId = lib.status.videoId++;
								var cards = target.getCards('h');
								if (player.isOnline2()) {
									player.send(function (cards, id) {
										ui.create.dialog('知心', cards).videoId = id;
									}, cards, event.videoId);
								}
								event.dialog = ui.create.dialog('知心', cards);
								event.dialog.videoId = event.videoId;
								if (!event.isMine()) {
									event.dialog.style.display = 'none';
								}
								player.chooseButton().set('filterButton', function (button) {
									return get.suit(button.link) == 'heart';
								}).set('dialog', event.videoId);
								"step 1"
								if (result.bool) {
									event.card = result.links[0];
									var func = function (card, id) {
										var dialog = get.idDialog(id);
										if (dialog) {
											for (var i = 0; i < dialog.buttons.length; i++) {
												if (dialog.buttons[i].link == card) {
													dialog.buttons[i].classList.add('selectedx');
												}
												else {
													dialog.buttons[i].classList.add('unselectable');
												}
											}
										}
									}
									if (player.isOnline2()) {
										player.send(func, event.card, event.videoId);
									}
									else if (event.isMine()) {
										func(event.card, event.videoId);
									}
								}
								else {
									if (player.isOnline2()) {
										player.send('closeDialog', event.videoId);
									}
									event.dialog.close();
									event.goto(3);
								}
								"step 2"
								if (player.isOnline2()) {
									player.send('closeDialog', event.videoId);
								}
								event.dialog.close();
								var card = event.card;
								player.showCards(card);
								player.gain(card, target, 'giveAuto');
								target.draw();
								"step 3"
								player.awakenSkill('cixiongC');
								player.storage.cixiongC = true;
								player.removeSkill('cixiongC');
								"step 4"
								player.addTempSkill('cixiongB', { player: "dieAfter" });
								player.storage.cixiongB = false;
								player.restoreSkill('cixiongB');
								player.sex = 'male';
							},
							ai: {
								threaten: 1.5,
								result: {
									target: function (player, target) {
										return -target.countCards('h');
									},
								},
								order: 10,
								expose: 0.4,
							},
							"_priority": 0,
						},
						zhanxingA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							frequent: true,
							trigger: {
								player: "phaseZhunbeiBegin",
							},
							content: function () {
								'step 0'
								var cards = get.cards(4);
								event.cards = cards;
								game.log(player, '观看了牌堆顶的' + get.cnNumber(cards.length) + '张牌');
								player.chooseControl('ok').set('dialog', ['占星', cards]);
								'step 1'
								while (cards.length) {
									ui.cardPile.insertBefore(cards.pop(), ui.cardPile.firstChild);
								}
								game.updateRoundNumber();
							},
							"_priority": 0,
						},
						mingyunA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							enable: "phaseUse",
							usable: 1,
							filter: function (event, player) {
								return player.countCards('h') > player.hp;
							},
							content: function () {
								player.draw(2);
								player.addTempSkill('mingyunB');
							},
							ai: {
								order: 10,
								result: {
									player: function (player) {
										var nh = player.countCards('h') - player.countCards('h', { type: 'equip' });
										if (nh <= 1) return 1;
										if (player.countCards('h', 'tao')) return 0;
										if (nh <= 2) return (Math.random() - 0.3);
										if (nh <= 3) return (Math.random() - 0.6);
										return 0;
									},
								},
							},
							"_priority": 0,
						},
						mingyunB: {
							mod: {
								maxHandcardBase: function (player, num) {
									return 1;
								},
							},
							"_priority": 0,
						},
						xushiA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							trigger: {
								player: ["useCard1", "respond"],
							},
							filter: function (event, player) {
								return _status.currentPhase != player && _status.currentPhase.countCards('he') > 0 && event.card.name == 'shan';
							},
							content: function () {
								if (player.countCards('h') == 0)
									player.gainPlayerCard(true, _status.currentPhase, 'he');
								else player.discardPlayerCard(true, _status.currentPhase, 'he');
							},
							check: function (event, player) {
								return get.attitude(player, _status.currentPhase) <= 0;
								//大于0为选择队友发动，若<=0是对敌方发动
							},
							"_priority": 0,
						},
						guailiA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							enable: "phaseUse",
							usable: 1,
							selectCard: 1,
							position: "hs",
							discard: false,
							lose: false,
							filter: function (event, player) {
								return !player.isTurnedOver() && (!player.hasSkill("ygzq_dongjie") && player.countCards('h', 'sha') > 0 || player.countCards('s', 'sha') > 0) && game.countPlayer() == game.countPlayer(function (current) {
									return get.distance(player, current) <= 1;
								});
							},
							filterCard: {
								name: "sha",
							},
							content: function () {
								"step 0"
								var targets = game.filterPlayer();
								targets.remove(player);
								targets.sort(lib.sort.seat);
								event.targets = targets;
								"step 1"
								player.useCard(cards, false, targets);
								player.line(targets, 'green');
								player.addTempSkill('luanshenA', player.phaseUseAfter);
								"step 2"
								game.delay(0.5);
							},
							ai: {
								order: 1,
								result: {
									player: function (player) {
										if (game.countPlayer(function (current) {
											return !current.isTurnedOver() && get.attitude(player, current) < 0;
										}) > (game.countPlayer(function (current) {
											return !current.isTurnedOver() && get.attitude(player, current) > 0;
										}) - 1)) return 1;
										else return 0;
									},
								},
							},
							"_priority": 0,
						},
						haokuaiA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							popup: false,
							forced: true,
							onremove: true,
							mark: true,
							marktext: "快",
							intro: {
								name: "豪快",
							},
							trigger: {
								global: "gameDrawAfter",
								player: ["enterGame", "phaseBegin", "phaseAfter", "useCard"],
							},
							filter: function (event, player) {
								if (!event.card) return true;
								if (player == _status.currentPhase && !player.isTurnedOver()) return true;
							},
							content: function () {
								if (!trigger.card) {
									player.storage.haokuaiA = 0;
									player.syncStorage('haokuaiA');
									player.unmarkSkill('haokuaiA');
									return;
								}
								else {
									player.logSkill('haokuaiA');
									player.storage.haokuaiA++;
									player.syncStorage('haokuaiA');
									player.markSkill('haokuaiA');
									return;
								}
							},
							mod: {
								globalFrom: function (from, to, distance) {
									if (_status.currentPhase == from) {
										return distance - from.storage.haokuaiA;
									}
								},
							},
							"_priority": 0,
						},
						luanshenA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							direct: true,
							trigger: {
								source: "damageSource",
							},
							filter: function (event, player) {
								return event.num && event.card && event.card.name == 'sha' && event.notLink();
							},
							content: function () {
								'step 0'
								trigger.player.draw(2);
								player.turnOver();
								trigger.player.turnOver();
								'step 1'
								if (player.isTurnedOver()) player.logSkill('luanshenB');
								else player.logSkill('luanshenA');
							},
							"_priority": 0,
						},
						luanshenB: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							popup: false,
							unique: true,
							"_priority": 0,
						},
						leilunA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							enable: "phaseUse",
							usable: 1,
							selectTarget: [0, 2],
							multitarget: true,
							filter: function (event, player) {
								return player.hp > 1;
							},
							filterTarget: function (card, player, target) {
								if (target.hp >= target.maxHp) return false;
								if (target == player) return false;
								return true;
							},
							content: function () {
								'step 0'
								if (targets.length > 0) targets[0].recover(player);
								if (targets.length > 1) targets[1].recover(player);
								player.loseHp();
								'step 1'
								if (targets.length == 0) player.draw(2);
								if (targets.length == 1) player.draw();
							},
							ai: {
								threaten: 1,
								result: {
									target: function (player, target) {
										if (target.hp < player.hp) return 3.5;
										if (target.hp < 2) return 2;
										return 1;
									},
								},
								order: 2,
								expose: 0.4,
							},
							"_priority": 0,
						},
						yushenA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							direct: true,
							trigger: {
								player: "damageBegin4",
							},
							filter: function (event, player) {
								if (!event.source) return false;
								if (!event.source.isAlive()) return false;
								if (event.source == player) return false;
								return player.countCards('h');
							},
							content: function () {
								'step 0'
								player.chooseBool(get.prompt('yushenA'), '弃置一张黑色手牌对' + get.translation(trigger.source) + '造成1点雷属性伤害').set('ai', function () {
									if (get.attitude(player, trigger.source) <= 0) return 1;
									else return 0;
								});
								'step 1'
								if (result.bool) {
									player.chooseCard('h', '选择一张黑色手牌').ai = function (card) {
										return (get.color(card) == 'black');
									};
								} else event.finish();
								'step 2'
								if (result.bool && result.cards.length && get.color(result.cards[0]) == 'black') {
									var target = trigger.source;
									//player.showCards(result.cards);
									//target.gain(result.cards,player,'giveAuto');
									//trigger.cancel();
									player.discard(result.cards);
									target.damage('thunder');
									player.logSkill('yushenA', target);
									player.draw(2);
								}
								else {
									event.finish();
								}
							},
							ai: {
								"maixie_defend": true,
							},
							"_priority": 0,
						},
						fushouA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							group: "fushouB",
							enable: "phaseUse",
							filter: function (event, player) {
								return (game.countPlayer(function (current) {
									return current.isZhu && current.group == 'daoqi' && !current.hasZhuSkill('xiangjiuA') && !current.hasZhuSkill('yuqianA') && !current.hasZhuSkill('nafengA');
								})) && !player.isZhu;
							},
							filterTarget: function (card, player, target) {
								return target.isZhu;
							},
							content: function () {
								if (!player.storage.fushouA) player.storage.fushouA = [];
								player.storage.fushouA.push(target);
								target.addTempSkill('xiangjiuA', { player: "dieAfter" });
							},
							ai: {
								threaten: 1,
								result: {
									target: function (player, target) {
										if (get.attitude(player, target) > 0) return 3.5;
									},
								},
								order: 10,
								expose: 0.8,
							},
							"_priority": 0,
						},
						fushouB: {
							forceDie: true,
							forced: true,
							popup: false,
							trigger: {
								player: "die",
							},
							filter: function (current) {
								return game.countPlayer(function (current) {
									return current.hasSkill('xiangjiuA');
								}) > 0;
							},
							content: function () {
								var target = player.storage.fushouA[0];
								target.removeSkill('xiangjiuA');
								player.line(target, 'green');
							},
							"_priority": 0,
						},
						xiangjiuA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							unique: true,
							zhuSkill: true,
							forced: true,
							popup: false,
							trigger: {
								player: "damageEnd",
							},
							filter: function (event, player) {
								if (!event.source) return false;
								if (!event.source.isAlive()) return false;
								if (!event.source == player) return false;
								if (!player.isTurnedOver()) return false;
								if (!event.source.group == player.group) return false;
								return player.isZhu;
							},
							content: function () {
								'step 0'
								trigger.source.chooseBool('是否摸一张牌并令主公翻面？').set('ai', function () {
									if (get.attitude(player, trigger.player) > 0)
										return 1;
									else return 0;
								});
								'step 1'
								if (result.bool) {
									trigger.source.draw();
									player.turnOver();
									trigger.source.line(player, 'green');
									trigger.source.logSkill('xiangjiuA', player);
								}
							},
							"_priority": 0,
						},
						huayuA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							mark: false,
							marktext: "剑",
							intro: {//标记介绍
								name: "雨帘",
								content: "古华剑·裁雨留虹",
							},
							init: function (player) {//初始化(好习惯)，获得这个技能时执行的内容
								player.addMark("huayuA", 3);
							},
							onremove: true,
							forced: true,
							trigger: {
								player: "phaseEnd",
							},
							filter: function (event, player) {
								return player.isIn() && player.countMark("huayuA") != 3;
							},
							content: function () {
								var num = player.countMark("huayuA");
								player.addMark("huayuA", 3 - num);
							},
							group: ["huayuA_1", "huayuA_2"],
							subSkill: {
								1: {
									forced: true,
									popup: false,
									unique: true,
									trigger: {
										player: "damageBegin4",
									},
									filter: function (event, player) {
										return player.isIn() && player.hasMark("huayuA") && event.source != player;
									},
									content: function () {
										'step 0'
										player.logSkill("huayuA");
										event.source = trigger.source;
										player
											.chooseControl("重帘留香", "万文集此")
											.set("displayIndex", false)
											.set("prompt", get.translation(player) + "发动了【画剑】，请选择一项")
											.set('choiceList', ["重帘留香：移除一个“雨帘”并防止此伤害", "万文集此：获得" + get.translation(event.source) + "三张牌"])
											.set("ai", function () {
												if (trigger.num >= 2 || player.hp <= 2) return 0;
												if (player.countCards("h") <= 2 && event.source.countCards("he") >= 3) return 1;
												return [0, 1].randomGet();
											});
										'step 1'
										if (result.index == 0) {
											trigger.cancel();
											player.removeMark("huayuA");
										}
										else {
											player.gainPlayerCard(event.source, "he", 3, "visible", true);
										}
									},
									sub: true,
									"_priority": 0,
								},
								2: {
									forced: true,
									unique: true,
									trigger: {
										source: "damageBegin1",
									},
									filter: function (event, player) {
										return player.isIn() && player.hasMark("huayuA") && event.player != player;
									},
									content: function () {
										'step 0'
										player.logSkill("huayuA");
										event.target = trigger.player;
										player
											.chooseControl("孤舟斩蛟", "织诗成锦")
											.set("displayIndex", false)
											.set("prompt", get.translation(player) + "发动了【画剑】，请选择一项")
											.set('choiceList', ["孤舟斩蛟：移除一个“雨帘”并令本次伤害值翻倍", "织诗成锦：卜算6并摸三张牌"])
											.set("ai", function () {
												if (event.target.hp <= 2 || _status.event.getParent("damage").hasNature()) return 0;
												if (player.countCards("h") <= 3) return 1;
												if (get.attitude(player, event.target) > 0) return 1;
												return [0, 1].randomGet();
											});
										'step 1'
										if (result.index == 0) {
											trigger.num *= 2;
											player.removeMark("huayuA");
										}
										else {
											player.chooseToGuanxing(6);
											player.draw(3);
										}
									},
									sub: true,
									"_priority": 0,
								},
							},
							"_priority": 0,
						},
						caiyuA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							enable: "phaseUse",
							usable: 1,
							selectCard: -1,
							filterCard: false,
							selectTarget: [1, 3],
							filterTarget: function (card, player, target) {
								return player != target && !target.hasMark("huayuA");
							},
							content: function () {
								target.addMark("huayuA");
								target.addTempSkills(["huayuA_1", "huayuA_2"], { player: "die" });
							},
							mod: {
								maxHandcard: function (player, num) {
									return num += player.countMark("huayuA");
								},
							},
							ai: {
								threaten: 1.3,
								result: {
									target: function (player, target) {
										if (target.hp <= 2) return 4.5;
										if (target.hp <= 3) return 3.5;
										return 2;
									},
								},
								order: 6,
								expose: 0.7,
							},
							"_priority": 0,
						},
						xiaguA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							trigger: {
								global: "phaseBefore",
								player: "enterGame",
							},
							charlotte: true,
							forced: true,
							filter: function (event, player) {
								return (event.name != 'phase' || game.phaseNumber == 0) && player.hasEquipableSlot(1) && !player.getEquips('jilijianA').length;
							},
							content: function () {
								var card = game.createCard2('jilijianA', 'diamond', 13);
								player.$gain2(card, false);
								game.delayx();
								player.equip(card);
							},
							group: "xiaguA_blocker",
							subSkill: {
								blocker: {
									trigger: {
										player: ["loseBefore", "disableEquipBefore"],
									},
									forced: true,
									filter: function (event, player) {
										if (event.name == "disableEquip") return event.slots.includes("equip1");
										var cards = player.getEquips("jilijianA");
										return event.cards.some(card => cards.includes(card));
										//event.cards数组中至少有一张卡片被包含在玩家的装备列表中，some方法返回true，否则返回false。
									},
									content: function () {
										if (trigger.name == "lose") {
											trigger.cards.removeArray(player.getEquips("jilijianA"));
										} else {
											while (trigger.slots.includes("equip1")) trigger.slots.remove("equip1");
										}
									},
									sub: true,
								},
							},
							mod: {
								canBeGained: function (card, source, player) {
									if (player.getEquips("jilijianA").includes(card)) return false;
								},
								canBeDiscarded: function (card, source, player) {
									if (player.getEquips("jilijianA").includes(card)) return false;
								},
								canBeReplaced: function (card, player) {
									if (player.getEquips("jilijianA").includes(card)) return false;
								},
								cardDiscardable: function (card, player) {
									if (player.getEquips("jilijianA").includes(card)) return false;
								},
								cardEnabled2: function (card, player) {
									if (player.getEquips("jilijianA").includes(card)) return false;
								},
							},
							ai: {
								aiValue: function (player, card, num) {
									/*更改AI对牌回合内使用价值的判断(player为你，card为要改变value的卡，num为上次判断后的value值)
									参考技能【立牧】【新服缮甲】*/
									if (get.subtype(card) == "equip1" && !get.cardtag(card, "gifts")) {
										return 0;
									}
								},
							},
							"_priority": 0,
						},
						huifengA: {
							mod: {
								maxHandcard: function (player, num) {
									return num + 2;
								},
							},
							"_priority": 0,
						},
						lianjinA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							trigger: {
								player: "phaseBegin",
							},
							forced: true,
							filter: function (event, player) {
								return player.isIn();
							},
							content: function () {
								"step 0"
								if (get.isLuckyStar(player)) {
									event.num = 6;
									player.throwDice(6);
								} else player.throwDice();
								if (event.num == 1) event.goto(1);
								else event.goto(2);
								"step 1"
								player.gain(game.createCard("du"), "gain2", "log");
								event.finish();
								"step 2"
								var list = [
									"lieyanyaoshuiA",
									"fengbaoyaoshuiA",
									"jihanyaoshuiA",
									"shengmingyaoshuiA",
									"fusuyaoshuiA",
								];
								var cards = [];
								for (var i = 0; i < event.num; i++) {
									var card = game.createCard(list.randomGet());
									if (card) cards.push(card);
								}
								player.gain(cards, 'gain2', "log");
							},
							ai: {
								expose: 0.5,
								threaten: 1.5,
							},
							"_priority": 6,
						},
						fenglingA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							enable: "phaseUse",
							round: 2,
							selectCard: function (card) {
								var player = get.owner(card);
								return [1, player.countCards("he")];
							},
							position: "he",
							filterCard: true,
							selectTarget: function () {
								return ui.selected.cards.length;
							},
							filterTarget: function (card, player, target) {
								return player != target;
							},
							filter: function (event, player) {
								return player.countCards('he');
							},
							multiline: true,
							multitarget: true,
							check: function (card) {
								if (ui.selected.cards.length == 0) {
									return 8 - get.value(card);
								}
								return 5 - get.value(card);
							},
							content: function () {
								for (const target of targets)
									target.damage(1, 'fengshaA');
								game.log(target, "受到了1点风属性伤害");
							},
							ai: {
								threaten: 1.4,
								result: {
									target: function (player, target) {
										if (!target.isLinked()) return -3.5; //如果对敌方使用技能则返回负值(return -3.5)
										return -2;
									},
								},
								order: 12,
								expose: 0.8,
							},
							"_priority": 0,
						},
						nizaoA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							enable: ["chooseToUse", "chooseToRespond"],
							filter: function (event, player) {
								if (player.storage.nizaoA_1 == 0) return false;
								for (var name of ["shan", "wuxie"]) {
									if (event.filterCard({ name: name, isCard: true }, player, event)) return true;
								}
								return false;
							},
							chooseButton: {
								dialog: function (event, player) {
									var list = [];
									for (var name of ["shan", "wuxie"]) {
										var card = { name: name, isCard: true };
										if (name == "shan" && event.filterCard(card, player, event)) list.push(["基本", "", name]);
										if (name == "wuxie" && event.filterCard(card, player, event)) list.push(["锦囊", "", name]);
									}
									var dialog = ui.create.dialog("拟造", [list, "vcard"]);
									dialog.direct = true;
									return dialog;
								},
								filter: function (button, player) {//能够使用的牌的条件：必须满足当前父事件的需求
									return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
								},
								backup: function (links, player) {//该函数相当于重跑了一次新的效果函数
									return {
										filterCard: () => false,//不需要选择任何卡牌
										selectCard: -1,//不需要选择任何卡牌
										viewAs: { name: links[0][2], nature: links[0][3], isCard: true, },
										precontent: function () {
											player.removeMark('nizaoA_1', 1);
										},
									};
								},
								prompt: function (links, player) {
									return '视为使用了' + (get.translation(links[0][3]) || '') + get.translation(links[0][2]) + '卡牌';
								},
							},
							hiddenCard: function (player, name) {//这个函数用来隐藏技能的操作按钮，体现为如果不返回true，则技能的按钮不会显示
								if (!lib.inpile.includes(name) || !player.countMark('nizaoA_1')) return false;
								return name == 'shan' || name == 'wuxie';
							},
							onremove: function (player, skill) {
								player.removeSkill("nizaoA_1");
							},
							group: ['nizaoA_1'],
							subSkill: {
								1: {
									mark: true,
									markText: "拟",
									intro: {
										name: "拟造",
										content: "陆叁零捌式风单元",
									},
									init: function (player) {//初始化(好习惯)，获得这个技能时执行的内容
										player.storage.nizaoA_1 = 3;//初始为3个标记
										player.syncStorage("nizaoA_1");//同步标记(每当标记变动都要写这句)
										player.markSkill("nizaoA_1");
									},
									frequent: true,
									popup: false,
									trigger: {
										global: "phaseBegin",
									},
									filter: function (event, player) {
										return player.hasSkill("nizaoA") && player.isIn();
									},
									content: function () {
										var num = player.countMark("nizaoA_1");
										if (num != 3)
											player.addMark("nizaoA_1", 3 - num);
									},
									onremove: true,
									sub: true,
									"_priority": 7,
								},
							},
							ai: {
								order: 6,
								respondShan: true,
								threaten: 0.6,
								skillTagFilter: function (player) {
									if (!player.countMark("nizaoA_1")) return false;
								},
								basic: {
									useful: (card, i) => {
										let player = _status.event.player,
											basic = [7, 5.1, 2],
											num = basic[Math.min(2, i)];
										if (player.hp > 2 && player.hasSkillTag("maixie")) num *= 0.57;
										if (
											player.hasSkillTag("freeShan", false, null, true) ||
											player.getEquip("rewrite_renwang")
										)
											num *= 0.8;
										return num;
									},
									value: [7, 5.1, 2],
								},
								result: {
									player: 1,
								},
							},
							"_priority": 0,
						},
						fengrenA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							forced: true,
							trigger: {
								player: "useCard1",
							},
							filter: function (event, player) {
								return event.card.name == 'sha';
							},
							content: function () {
								if (!trigger.card.nature == '')
									trigger.card.nature = '';
							},
							"_priority": 0,
						},
						jileiA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							frequent: true,
							trigger: {
								player: ["damageEnd", "phaseUseBegin"],
							},
							init: function (player) {
								if (!player.storage.jileiB) player.storage.jileiB = [];
								if (!player.storage.jileiC) player.storage.jileiC = [];
							},
							content: function () {
								'step 0'
								var card = get.cards()[0];
								event.card = card;
								player.showCards(card);
								game.log(player, '展示了牌堆顶的', card);
								'step 1'
								game.delay(2);
								if (get.suit(event.card) == 'diamond') {
									player.storage.jileiC = player.storage.jileiC.concat(event.card);
									player.syncStorage('jileiC');
									player.markSkill('jileiC');
									if (player.hasSkill('zaoshenA')) {
										if (player.hasSkill('huobanB') && game.countPlayer(function (current) {
											return current.hasSkill('huobanA');
										})) {
											var list = game.filterPlayer(function (current) {
												return current.hasSkill('huobanA');
											});
											player.draw();
											game.asyncDraw(list);
										}
										player.$throw(event.card);
										game.cardsDiscard(event.card);
										player.storage.jileiC.remove(event.card);
										player.syncStorage('jileiC');
										player.unmarkSkill('jileiC');
									}
								} else {
									player.storage.jileiB = player.storage.jileiB.concat(event.card);
									player.syncStorage('jileiB');
									player.markSkill('jileiB');
									if (player.hasSkill('zaoshenA')) {
										player.gain(event.card, 'draw');
										player.storage.jileiB.remove(event.card);
										player.syncStorage('jileiB');
										player.unmarkSkill('jileiB');
									}
								}
							},
							ai: {
								maixie: true,
								"maixie_hp": true,
								threaten: 0.8,
							},
							"_priority": 0,
						},
						jileiB: {
							unique: true,
							onremove: true,
							mark: true,
							marktext: "经",
							locked: true,
							intro: {
								name: "经验",
								content: "cards",
								onunmark: function (storage, player) {
									if (storage && storage.length && !player.isAlive()) {
										player.$throw(storage, 1000);
										game.cardsDiscard(storage);
										game.log(storage, '被置入了弃牌堆');
										storage.length = 0;
									}
								},
							},
							"_priority": 0,
						},
						jileiC: {
							unique: true,
							onremove: true,
							mark: true,
							marktext: "原",
							locked: true,
							intro: {
								name: "原石",
								content: "cards",
								onunmark: function (storage, player) {
									if (storage && storage.length && !player.isAlive()) {
										player.$throw(storage, 1000);
										game.cardsDiscard(storage);
										game.log(storage, '被置入了弃牌堆');
										storage.length = 0;
									}
								},
							},
							"_priority": 0,
						},
						tongxingA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							forced: true,
							unique: true,
							juexingji: true,
							skillAnimation: true,
							animationStr: "万民同行",
							animationColor: "gray",
							trigger: {
								player: "phaseZhunbeiBegin",
							},
							filter: function (event, player) {
								return !player.hasSkill('zaoshenA') && player.storage.jileiB.length && player.storage.jileiB.length >= 3;
							},
							content: function () {
								"step 0"
								var cards = player.storage.jileiB;
								player.gain(cards, 'draw');
								player.storage.jileiB.remove(cards);
								player.unmarkSkill('jileiB');
								player.syncStorage('jileiB');
								"step 1"
								var cards = player.storage.jileiC;
								if (player.hasSkill('huobanB') && game.countPlayer(function (current) {
									return current.hasSkill('huobanA');
								})) {
									var list = game.filterPlayer(function (current) {
										return current.hasSkill('huobanA');
									});
									for (i = player.storage.jileiC.length; i > 0; i--) {
										player.draw();
										game.asyncDraw(list);
									}
								}
								player.$throw(cards);
								game.cardsDiscard(cards);
								player.storage.jileiC.remove(cards);
								player.unmarkSkill('jileiC');
								player.syncStorage('jileiC');
								"step 2"
								player.recover();
								player.loseMaxHp();
								player.addSkill('zaoshenA');
								player.awakenSkill('tongxingA');
							},
							"_priority": 0,
						},
						zaoshenA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							locked: true,
							trigger: {
								player: ["phaseBegin", "phaseEnd"],
							},
							filter: function (event, player) {
								return player.isIn() && game.hasPlayer(function (current) {
									return current != player && player.inRange(current);
								});
							},
							content: function () {
								'step 0'
								player.chooseTarget(get.prompt('zaoshenA'), true, function (card, player, target) {
									return target != player && target.hp > 0 && player.inRange(target);;
								}).set('ai', function (target) {
									return -get.attitude(player, target);
								})
								'step 1'
								var target = result.targets[0];
								player.logSkill('zaoshenA', target);
								player.line(target, 'red');
								target.damage('fire');
							},
							"_priority": 0,
						},
						huoxuanA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							enable: "phaseUse",
							limited: true,//限定技标签
							unique: true,
							line: "fire",
							skillAnimation: true,
							animationStr: "万民百味",
							animationColor: "fire",
							selectTarget: -1,
							init: function (player) {//初始化
								player.storage.huoxuanA = false;
							},
							filter: function (event, player) {
								return player.isIn() && player.countMark("baiweiA") >= 12;
							},
							filterTarget: function (card, player, target) {
								return target != player;
							},
							multitarget: false,
							content: function () {
								"step 0";
								player.storage.huoxuanA = true;//技能发动过
								player.awakenSkill("huoxuanA");
								player.clearMark("baiweiA");
								"step 1"
								var num = target.maxHp;
								target.chooseToDiscard(
									num,
									"he",
									"弃置" + get.cnNumber(num) + "张牌，或受到2点火焰伤害"
								).ai = function (card) {
									if (target.hasSkillTag("nofire")) return 0;
									if (get.type(card) != "basic") return 11 - get.value(card);
									if (target.hp > 4) return 7 - get.value(card);
									if (target.hp == 4 && num >= 3) return 7 - get.value(card);
									if (target.hp == 3 && num >= 4) return 7 - get.value(card);
									if (num > 1) return 8 - get.value(card);
									return 10 - get.value(card);
								};
								"step 2";
								if (!result.bool) {
									target.damage(2, "fire");
								}
							},
							ai: {
								order: 6,
								result: {
									player: function (player) {
										var num = 0;
										var players = game.filterPlayer();
										for (var i = 0; i < players.length; i++) {
											if (players[i] == player || players[i].hasSkillTag("nofire")) continue;
											var nh = players[i].countCards("he");
											var att = get.attitude(player, players[i]);
											if (nh <= players[i].maxHp) {
												if (att < 0) {
													if (players[i].hp <= 2) {
														num += 4;
													} else {
														num += 3;
													}
												} else if (att > 0) {
													if (players[i].hp <= 2) {
														num -= 5;
													} else {
														num -= 2.5;
													}
												}
											}
											else if (nh > players[i].maxHp) {
												if (att < 0) {
													num += 0.5;
												} else if (att > 0) {
													num -= 0.5;
												}
											}
										}
										if (num >= 3) return 1;
										return 0;
									},
								},
							},
							"_priority": 0,
						},
						baiweiA: {
							forced: true,
							mark: false,
							marktext: "焰",
							intro: {
								name: "	万民百味",
								"name2": "焰火",
								content: "当前有#个“焰火”",
							},
							onremove: true,
							trigger: {
								source: "damageBegin1",
							},
							filter: function (event, player) {
								return event.hasNature("fire");
							},
							content: function () {
								player.addMark("baiweiA", 2 * trigger.num);
							},
							mod: {
								ignoredHandcard: function (card, player) {
									if (get.type(card) == "delicacies") return true;
								},
								cardDiscardable: function (card, player, name) {
									if (name == 'phaseDiscard' && get.type(card) == 'delicacies') return false;
								},
							},
							group: ["baiweiB"],
							"_priority": 0,
						},
						baiweiB: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							enable: "phaseUse",
							usable: 1,
							filter: function (event, player) {
								return player.hasMark("baiweiA");
							},
							content: function () {
								var markNumber = player.countMark("baiweiA");
								player.removeMark("baiweiA", markNumber);
								var cardNameList = [];
								for (var i of lib.cardPack.原梗衍生) {
									if (get.type(i) == 'delicacies') {
										cardNameList.push(i);
									}
								}
								var list2 = [];
								for (var i = 0; i < markNumber; i++) {
									list2.push(game.createCard(cardNameList.randomGet()));
								}
								player.gain(list2, "gain2");
							},
							ai: {
								threaten: 0.8,
								result: {
									player: 1,
								},
								order: 6,
							},
						},
						jiuguanA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							frequent: true,
							trigger: {
								global: "useCardToPlayered",
							},
							filter: function (event, player) {
								return event.card.name == 'jiu';
							},
							content: function () {
								player.draw();
							},
							"_priority": 0,
						},
						jiuguanB: {
							subfrequent: ["judge"],
							subSkill: {
								discard: {
									audio: "ext:原梗Enhanced/audio/skill:2",
									trigger: {
										global: "loseAfter",
									},
									filter: function (event, player) {
										if (event.type != 'discard') return false;
										if (_status.currentPhase != player) return false;
										for (var i = 0; i < event.cards2.length; i++) {
											if (get.suit(event.cards2[i], event.player) == 'spade' && get.position(event.cards2[i], true) == 'd') {
												return true;
											}
										}
										return false;
									},
									direct: true,
									content: function () {
										"step 0"
										if (trigger.delay == false) game.delay();
										"step 1"
										var cards = [];
										for (var i = 0; i < trigger.cards2.length; i++) {
											if (get.suit(trigger.cards2[i], trigger.player) == 'spade' && get.position(trigger.cards2[i], true) == 'd') {
												cards.push(trigger.cards2[i]);
											}
										}
										if (cards.length) {
											player.chooseButton(['酒馆：选择要获得的牌', cards], [1, cards.length]).set('ai', function (button) {
												return get.value(button.link, _status.event.player, 'raw');
											});
										}
										"step 2"
										if (result.bool) {
											player.logSkill(event.name);
											player.gain(result.links, 'gain2', 'log');
										}
									},
									sub: true,
									"_priority": 0,
								},
								judge: {
									audio: "ext:原梗Enhanced/audio/skill:2",
									trigger: {
										global: "cardsDiscardAfter",
									},
									direct: true,
									filter: function (event, player) {
										var evt = event.getParent().relatedEvent;
										if (!evt || evt.name != 'judge') return;
										if (_status.currentPhase != player) return false;
										if (get.position(event.cards[0], true) != 'd') return false;
										return (get.suit(event.cards[0]) == 'spade');
									},
									content: function () {
										"step 0"
										player.chooseButton(['酒馆：选择要获得的牌', trigger.cards], [1, trigger.cards.length]).set('ai', function (button) {
											return get.value(button.link, _status.event.player, 'raw');
										});
										"step 1"
										if (result.bool) {
											player.logSkill(event.name);
											player.gain(result.links, 'gain2', 'log');
										}
									},
									sub: true,
									"_priority": 0,
								},
							},
							"_priority": 0,
						},
						tiaojiuA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							trigger: {
								global: "dying",
							},
							content: function () {
								'step 0'
								trigger.player.addTempSkill('tiaojiuB');
								if (trigger.player == player) event.finish();
								'step 1'
								player.chooseCard('h', '是否将一张手牌交给' + get.translation(trigger.player) + '？').set('ai', function (card) {
									if (get.suit(card) == 'spade') return 10;
									if (get.name(card) == 'jiu') return 6;
									return false;
								});
								game.delay(2);
								'step 2'
								if (result.bool && result.cards.length) {
									player.logSkill('tiaojiuB');
									trigger.player.gain(result.cards, player, "giveAuto");
								}
							},
							check: function (event, player) {
								return get.attitude(player, event.player) > 0;
								//大于0为选择队友发动，若<=0是对敌方发动
							},
							ai: {
								threaten: 1.5,
							},
							"_priority": 0,
						},
						tiaojiuB: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							popup: false,
							unique: true,
							onremove: true,
							mark: true,
							marktext: "酒",
							locked: true,
							forceDie: true,
							forced: true,
							intro: {
								name: "酒馆",
								content: "黑桃手牌均视为【酒】。",
							},
							trigger: {
								player: "dyingEnd",
							},
							content: function () {
								player.removeSkill('tiaojiuB');
							},
							mod: {
								cardname: function (card, player) {
									if (card.suit == 'spade') return 'jiu';
								},
							},
							"_priority": 0,
						},
						dongdongA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							direct: true,
							trigger: {
								player: "damageEnd",
							},
							filter: function (event, player) {
								if (!event.source) return false;
								if (!event.source.isAlive()) return false;
								if (event.source == player) return false;
								return true;
							},
							content: function () {
								'step 0'
								player.chooseControl('令其视为使用【酒】', '令其“冻结”', '取消').set("ai", function () {
									if (trigger.source != _status.currentPhase) return 0;
									if (get.attitude(player, trigger.source) > 0) return 0;
									if (trigger.source.hasSkill("ygzq_dongjie")) return 0;
									if (trigger.source.countCards('h') == 0) return 0;
									return 1;
								});
								'step 1'
								if (result.index == 0) {
									trigger.source.chooseUseTarget({ name: 'jiu' }, true, 'noTargetDelay', 'nodelayx').set('addCount', false);
								}
								else if (result.index == 1) {
									if (!trigger.source.hasSkill("ygzq_dongjie"))
										trigger.source.addTempSkill('ygzq_dongjie');
									player.logSkill('dongdongA');
								}
								else if (result.index == 2) {
									event.finish();
								}
							},
							ai: {
								"maixie_defend": true,
							},
							"_priority": 0,
						},
						tetiaoA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							unique: true,
							mark: true,
							skillAnimation: true,
							animationStr: "猫尾特调",
							animationColor: "water",
							limited: true,
							enable: "phaseUse",
							init: function (player) {
								player.storage.tetiaoA = false;
							},
							filter: function (event, player) {
								return game.countPlayer(function (current) {
									return current.hp < current.maxHp/*&&current!=player*/;
								});
							},
							filterTarget: function (card, player, target) {
								if (target.hp >= target.maxHp) return false;
								//if(target==player) return false;
								return true;
							},
							content: function () {
								'step 0'
								player.awakenSkill('tetiaoA');
								player.storage.tetiaoA = true;
								'step 1'
								target.recover(player);
								target.chooseUseTarget({ name: 'jiu' }, true, 'noTargetDelay', 'nodelayx');
								if (target != player) player.draw(2);
								'step 2'
								var targets = game.filterPlayer();
								targets.remove(player);
								targets.remove(target);
								targets.sort(lib.sort.seat);
								event.targets = targets;
								player.line(targets, 'green');
								'step 3'
								if (event.targets.length) {
									for (var i = 0; i < event.targets.length; i++)
										if (!event.targets[i].hasSkill("ygzq_dongjie"))
											event.targets[i].addTempSkill('ygzq_dongjie');
								}
							},
							intro: {
								content: "limited",
								mark: function (dialog, content, player) {
									return '猫尾特调';
								},
							},
							ai: {
								threaten: 1,
								result: {
									target: function (player, target) {
										if (target.hp < 2 && target.hp < target.maxHp) return 2; //如果对敌方使用技能则返回负值(return -3.5)
										return 1;
									},
								},
								order: 6,
								expose: 0.4,
							},
							"_priority": 0,
						},
						tianlingA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							forced: true,
							trigger: {
								player: "changeHp",
							},
							filter: function (event, player) {
								return event.num < 0 && player.isTurnedOver();
							},
							content: function () {
								player.turnOver();
							},
							mod: {
								targetEnabled: function (card, player, target) {
									if ((get.type(card) == 'trick' || get.type(card) == 'delay') &&
										get.color(card) == 'black' && target.isTurnedOver()) return false;
								},
								attackFrom: function (from, to, distance) {
									if (from.isTurnedOver()) return distance - 1;
								},
							},
							"_priority": 0,
						},
						daibuA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							popup: false,
							trigger: {
								global: "damageEnd",
							},
							filter: function (event, player) {
								if (!event.player.isAlive()) return false;
								return event.player != player && event.nature == 'thunder' && player.inRange(event.player) && !player.isTurnedOver();
							},
							content: function () {
								player.logSkill('daibuA');
								trigger.player.draw(2);
								trigger.player.turnOver();
								player.turnOver();
								player.draw(2);
							},
							check: function (event, player) {
								if (!event.player.isTurnedOver() && get.attitude(player, event.player) < 0)
									return true;
								if (event.player.isTurnedOver() && get.attitude(player, event.player) > 0)
									return true;
								return false;
								//大于0为选择队友发动，若<=0是对敌方发动
							},
							"_priority": 0,
						},
						yayuA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							popup: false,
							trigger: {
								global: "useCard",
							},
							filter: function (event, player) {
								return event.player != player && event.card.name == 'shan' && player.inRange(event.player) && (player.countCards('h') > 1 || player.hp > 1);
							},
							content: function () {
								'step 0'
								if (player.countCards('h') > 1 && player.hp > 1) {
									player.chooseControl('弃置两张手牌', '失去1点体力').set("ai", function () {
										if (player.countCards('h', 'tao') || player.isTurnedOver()) return 1;
										return 0;
									});
									event.goto(1);
								}
								else if (player.countCards('h') > 1 && player.hp <= 1) {
									player.chooseCard(2, 'h', '选择两张手牌', true);
									event.goto(2);
								}
								else if (player.countCards('h') <= 1 && player.hp > 1) {
									player.loseHp();
									event.goto(3);
								}
								'step 1'
								if (result.index == 0) {
									player.chooseCard(2, 'h', '选择两张手牌', true);
									event.goto(2);
								}
								else if (result.index == 1) {
									player.loseHp();
									event.goto(3);
								}
								'step 2'
								if (result.bool && result.cards.length) {
									player.discard(result.cards);
								}
								'step 3'
								if (player.isTurnedOver()) player.turnOver();
								player.logSkill('yayuA');
								trigger.player.chooseControl('此【闪】无效', '受到1点雷属性伤害').set("ai", function () {
									if (Math.random() > 0.5) return 1;
									return 0;
								});
								'step 4'
								if (result.index == 0) {
									game.log(trigger.player, '选择了“此【闪】无效”');
									trigger.cancel();
								}
								else if (result.index == 1) {
									game.log(trigger.player, '选择了“受到1点雷属性伤害”');
									trigger.player.damage('thunder');
								}
							},
							check: function (event, player) {
								return get.attitude(player, event.player) < 0;
								//大于0为选择队友发动，若<=0是对敌方发动
							},
							"_priority": 0,
						},
						zanbieA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							popup: false,
							forced: true,
							trigger: {
								global: "gameDrawAfter",
								player: "enterGame",
							},
							content: function () {
								'step 0'
								player.chooseBool(get.prompt('zanbieA'), '将势力改为璃月，然后减少1点体力上限并获得技能“明择”。').set("ai", function () {
									if (player.isZhu) return false;
									if (Math.random() > 0.4) return false;
									return true;
								});
								'step 1'
								if (result.bool) {
									player.logSkill('zanbieA');
									player.loseMaxHp();
									player.changeGroup('liyue');
									player.addSkill('mingzeA');
								}
							},
							"_priority": 0,
						},
						kuanglanA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							group: "kuanglanB",
							forced: true,
							trigger: {
								target: "useCardToTargeted",
							},
							filter: function (event, player) {
								return event.card.name == 'nanman';
							},
							content: function () {
								trigger.getParent().excluded.add(player);
							},
							"_priority": 0,
						},
						kuanglanB: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							forced: true,
							trigger: {
								player: "phaseUseEnd",
							},
							filter: function (event, player) {
								return !player.isEmpty(2);
							},
							content: function () {
								"step 0"
								var targets = game.filterPlayer();
								targets.remove(player);
								targets.sort(lib.sort.seat);
								event.targets = targets;
								"step 1"
								player.discard(player.getEquip(2));
								player.useCard({ name: 'nanman', isCard: true }, targets, 'noai').animate = false;
								"step 2"
								game.delay(0.5);
							},
							"_priority": 0,
						},
						duanliuA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							group: "duanliuB",
							forced: true,
							trigger: {
								source: "damageSource",
							},
							filter: function (event, player) {
								return event.num && event.player != player && event.player.hasSkill("duanliuC");
							},
							content: function () {
								if (trigger.player.countCards('he'))
									trigger.player.chooseToDiscard(1, true, 'he').set('ai', function (card) {
										return 6 - ai.get.value(card);
									});
								else {
									trigger.player.removeSkill('duanliuC');
									trigger.player.damage('nocard');
								}
							},
							"_priority": 0,
						},
						duanliuB: {
							popup: false,
							forced: true,
							trigger: {
								player: "useCardToPlayered",
							},
							filter: function (trigger, player) {
								if (!trigger.targets) return false;
								if (trigger.targets.length == 1 && trigger.targets[0] == player) return false;
								return true;
							},
							content: function () {
								for (var i = 0; i < trigger.targets.length; i++)
									if (!trigger.targets[i].hasSkill("duanliuC") && trigger.targets[i] != player)
										trigger.targets[i].addTempSkill('duanliuC');
							},
							"_priority": 0,
						},
						duanliuC: {
							popup: false,
							unique: true,
							onremove: true,
							mark: true,
							marktext: "断",
							locked: true,
							forced: true,
							intro: {
								name: "断流",
							},
							trigger: {
								global: "phaseEnd",
							},
							content: function () {
								player.removeSkill('duanliuC');
							},
							"_priority": 0,
						},
						mingzeA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							group: ["mingzeC", "mingzeE"],
							forced: true,
							trigger: {
								global: "dying",
							},
							filter: function (event, player) {
								return event.player != player && _status.currentPhase == player;
							},
							content: function () {
								'step 0'
								trigger.player.chooseControlList('投降不失为一种选择', '抗争：达达利亚摸两张牌，且本回合手牌上限+2', '投降：本次你处于濒死状态时，所有角色无法使用【桃】或【酒】', true).set("ai", function () {
									if (trigger.player.isZhu) return 0;
									if (get.attitude(player, trigger.player) > 0) return 0;
									if (trigger.player.countCards('he') <= 1) return 1;
									if (trigger.player.countCards('h', 'jiu') || trigger.player.countCards('h', 'tao')) return 0;
									if (Math.random() > 0.7) return 0;
									return 1;
								});
								'step 1'
								if (result.index == 0) {
									game.log(trigger.player, '选择了“抗争”');
									player.draw(2);
									player.addMark('mingzeB', 2, false);
								}
								else if (result.index == 1) {
									game.log(trigger.player, '选择了“投降”');
									trigger.player.addTempSkill('mingzeD');
								}
							},
							"_priority": 0,
						},
						mingzeB: {
							popup: false,
							unique: true,
							onremove: true,
							mark: true,
							marktext: "抗",
							locked: true,
							forced: true,
							intro: {
								name: "抗争",
								content: "每拥有一个此标记本回合你的手牌上限+1。",
							},
							"_priority": 0,
						},
						mingzeC: {
							popup: false,
							forced: true,
							trigger: {
								player: "phaseJieshuEnd",
							},
							filter: function (event, player) {
								return player.countMark('mingzeB');
							},
							content: function () {
								player.removeMark('mingzeB', player.countMark('mingzeB'));
							},
							mod: {
								maxHandcard: function (player, num) {
									return num + player.countMark('mingzeB');
								},
							},
							"_priority": 0,
						},
						mingzeD: {
							popup: false,
							unique: true,
							onremove: true,
							mark: true,
							marktext: "投",
							locked: true,
							forceDie: true,
							forced: true,
							intro: {
								name: "投降",
								content: "无法成为【桃】或【酒】的目标。",
							},
							trigger: {
								global: "dyingEnd",
							},
							content: function () {
								player.removeSkill('mingzeD');
							},
							"_priority": 0,
						},
						mingzeE: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							global: "mingzeE",
							mod: {
								cardSavable: function (card, player) {
									if ((card.name == 'tao' || card.name == 'jiu') && game.countPlayer(function (current) {
										return current.hasSkill('mingzeD');
									})) return false;
								},
								cardEnabled: function (card, player) {
									if ((card.name == 'tao' || card.name == 'jiu') && game.countPlayer(function (current) {
										return current.hasSkill('mingzeD');
									})) return false;
								},
							},
							"_priority": 0,
						},
						toulanA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							trigger: {
								player: "phaseUseBegin",
							},
							content: function () {
								var num = player.countCards('h');
								var num2 = player.getHandcardLimit();
								if (num > num2) {
									player.chooseToDiscard(num - num2, true, 'h');
								}
								player.addTempSkill('toulanB');
							},
							check: function (event, player) {
								return (player.countCards('h') - player.getHandcardLimit()) < 3;
							},
							"_priority": 0,
						},
						toulanB: {
							popup: false,
							unique: true,
							onremove: true,
							mark: true,
							marktext: "懒",
							locked: true,
							forced: true,
							intro: {
								name: "偷懒",
								content: "弃牌阶段结束时，你摸两张牌。",
							},
							trigger: {
								player: "phaseDiscardEnd",
							},
							content: function () {
								player.draw(2);
								player.removeSkill('toulanB');
							},
							"_priority": 0,
						},
						bailanA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							enable: "phaseUse",
							usable: 1,
							selectCard: 1,
							position: "h",
							filterCard: true,
							filterTarget: function (card, player, target) {
								return player != target && target.countCards('h') >= player.countCards('h');
							},
							filter: function (event, player) {
								if (player.countCards('h') == 0) return false;
								return game.countPlayer(function (current) {
									return current.countCards('h') >= player.countCards('h') && current != player;
								});
							},
							content: function () {
								var num = target.countCards('h');
								var num2 = player.countCards('h');
								if (num > num2) {
									target.chooseToDiscard(num - num2, true, 'h');
								}
							},
							ai: {
								threaten: 1,
								result: {
									target: function (player, target) {
										if (player.countCards('h') >= 3) return false;
										if (target.isMaxHandcard()) return -3.5; //如果对敌方使用技能则返回负值(return -3.5)
										return -1;
									},
								},
								order: 1,
								expose: 0.4,
							},
							"_priority": 0,
						},
						jijinA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							unique: true,
							mark: true,
							skillAnimation: true,
							animationStr: "风隐急进",
							animationColor: "wood",
							limited: true,
							enable: "phaseUse",
							init: function (player) {
								player.storage.jijinA = false;
							},
							filterTarget: function (card, player, target) {
								if (target == player) return false;
								return true;
							},
							content: function () {
								'step 0'
								player.awakenSkill('jijinA');
								player.storage.jijinA = true;
								'step 1'
								game.swapSeat(player, player.nextSeat);
								'step 2'
								if (player.previousSeat == target) target.damage('nocard');
								else event.goto(1);
							},
							intro: {
								content: "limited",
								mark: function (dialog, content, player) {
									return '风隐急进';
								},
							},
							ai: {
								threaten: 1,
								result: {
									target: function (player, target) {
										return -2;
									},
								},
								order: 4,
								expose: 0.4,
							},
							"_priority": 0,
						},
						qizhenA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							charlotte: true,
							usable: 3,
							unique: true,
							enable: ["chooseToUse", "chooseToRespond"],
							filter: function (event, player) {
								for (var i = 0; i < lib.inpile.length; i++) {
									var name = lib.inpile[i];
									if (name != 'du' && get.type(name) == 'basic' && event.filterCard({ name: name, storage: { qizhenA: true } }, player, event))
										return true;
								}
								return player.countCards("hes") > 0;
							},
							chooseButton: {
								dialog: function (event, player) {
									var list = [];
									for (var i of lib.inpile) {
										if (i != 'du' && get.type(i, false) == 'basic') {
											if (event.filterCard({ name: i, storage: { qizhenA: true } }, player, event)) list.push(['基本', '', i]);
											if (i == 'sha') {
												for (var j of lib.inpile_nature) {
													if (event.filterCard({ name: i, nature: j, storage: { qizhenA: true } }, player, event)) list.push(['基本', '', i, j]);
												}
											}
										}
									}
									const dialog = ui.create.dialog('旗阵：请选择一张基本牌', [list, 'vcard']);
									return dialog;
								},
								filter: function (button, player) {
									return get.itemtype(button.link) != 'card' && _status.event.getParent().filterCard({ name: button.link[2], storage: { qizhenA: true } }, player, _status.event.getParent());
								},
								select: 1,
								check: function (button) {
									return get.event("player").getUseValue({
										name: button.link[2],
										nature: button.link[3],
										storage: { qizhenA: true }
									});
								},
								backup: function (links, player) {
									var next = {
										audio: "qizhenA",
										popname: true,
										check(card) {
											return 7 - get.value(card);
										},
										selectCard: 1,
										filterCard: true,
										position: 'hes',
										viewAs: { name: links[0][2], nature: links[0][3], storage: { qizhenA: true } },
										precontent() {
											event.getParent().addCount = false;
											player.addTempSkill('qizhenA_hujia');
										},
									};
									return next;
								},
								prompt: function (links) {
									return '旗阵：将一张牌当做' + (get.translation(links[0][3]) || '') + get.translation(links[0][2]) + '使用或打出。';
								},
							},
							hiddenCard: function (player, name) {
								return name != "du" && get.type(name) == "basic" && player.countCards("hes") > 0;
							},
							mod: {
								targetInRange: function (card, player, target, now) {
									if (get.type(card) == 'basic' && card.storage && card.storage.qizhenA) return true;
								},
								cardUsable: function (card, player, num) {
									if (get.type(card) == 'basic' && card.storage && card.storage.qizhenA) return Infinity;
								},
							},
							group: "qizhenB",
							subSkill: {
								hujia: {
									charlotte: true,
									silent: true,
									trigger: {
										player: ["useCardAfter", "respondAfter"],
									},
									filter: function (event, player) {
										return event.skill == 'qizhenA_backup' && event.player.hujia < event.player.maxHp;
									},
									content: function () {
										player.changeHujia();
									},
									sub: true,
								},
							},
							ai: {
								expose: 0.6,
								threaten: 1.5,
								order: function (item, player) {
									if (player && _status.event.type == "phase") {
										var max = 0, add = false;
										var list = lib.inpile.filter(name => get.type(name) == 'basic');
										if (list.includes('sha')) add = true;
										list = list.map(namex => { return { name: namex, storage: { qizhenA: true } } });
										if (add) lib.inpile_nature.forEach(naturex => list.push({ name: 'sha', nature: naturex, storage: { qizhenA: true } }));
										for (var card of list) {
											if (player.getUseValue(card) > 0) {
												var temp = get.order(card);
												if (temp > max) max = temp;
											}
										}
										if (max > 0) max += 3;
										return max;
									}
									return 2;
								},
								save: true,
								respondSha: true,
								respondShan: true,
								fireAttack: true,
								skillTagFilter: function (player, tag, arg) {
									return player.countCards('hes') > 0;
								},
								result: {
									player: function (player) {
										if (_status.event.dying) return get.attitude(player, _status.event.dying);
										return 1;
									},
								},
							},
							"_priority": 0,
						},
						qizhenB: {
							init(player, skill) {
								game.broadcastAll(player => {
									if (player._qizhenB_hujia === undefined) {
										player._qizhenB_hujia = player.hujia;
										Object.defineProperties(player, {
											hujia: {
												configurable: true,
												get() {
													return this._qizhenB_hujia;
												},
												set(num) {
													this._qizhenB_hujia = num;
													const skill = 'qizhenB';
													for (const player of game.filterPlayer()) {
														if (player.hasSkill(skill, null, null, false)) get.info(skill).getCards(player, skill);
													}
												},
											},
										});
									}
									if (!_status._updateRoundNumber) {
										_status._updateRoundNumber = game.updateRoundNumber;
										game.updateRoundNumber = function () {
											_status._updateRoundNumber.apply(this, arguments);
											const skill = 'qizhenB';
											for (const player of game.filterPlayer()) {
												if (player.hasSkill(skill, null, null, false)) get.info(skill).getCards(player, skill);
											}
										};
									}
								}, player);
								get.info(skill).getCards(player, skill);
							},
							onremove(player, skill) {
								const cards2 = player.getCards('s', card => card.hasGaintag(skill));
								if (player.isOnline2()) {
									player.send((cards, player) => {
										cards.forEach(i => i.delete());
										if (player == game.me) ui.updatehl();
									}, cards2, player);
								}
								cards2.forEach(i => i.delete());
								if (player === game.me) ui.updatehl();
							},
							getCards(player, skill) {
								const cards = Array.from(ui.cardPile.childNodes).slice(0, Math.max(0, player.hujia));//获取牌堆前X张牌，X为护甲
								const cards2 = player.getCards('s', card => card.hasGaintag(skill));//统计辎区带技能tag的牌
								const [gains, removes] = [
									cards.filter(card => !cards2.map(i => i._cardid).includes(card.cardid)),
									cards2.filter(card => !cards.map(i => i.cardid).includes(card._cardid)),
								];//JavaScript解构赋值，简单来说，护甲增加时添加还没添加的卡牌，护甲减少时减去多余的卡牌。仿照超舟的监听没处理后面这种情况。
								if (removes.length) {
									if (player.isOnline2()) {//联机部分的代码，不用管
										player.send((cards, player) => {
											cards.forEach(i => i.delete());
											if (player == game.me) ui.updatehl();
										}, removes, player);
									}
									removes.forEach(i => i.delete());//销毁对应的卡牌并更新UI显示
									if (player === game.me) ui.updatehl();
								}
								if (gains.length) {
									player.directgains(gains.map(card => {
										const cardx = ui.create.card();
										cardx.init(get.cardInfo(card));
										cardx._cardid = card.cardid;//同步一下id，确保是同一张牌
										return cardx;
									}), null, skill);
								}
							},
							mod: {
								cardEnabled2(card, player) {
									if (get.itemtype(card) === 'card' && card.hasGaintag('qizhenB') && !player.hasSkill('qizhenB')) return false;
								},//让手牌可用
							},
							trigger: { player: ['useCardBefore', 'respondBefore'] },
							filter(event, player) {
								const cards = event.cards;
								return Array.isArray(cards) && player.getCards('s', card => card.hasGaintag('qizhenB')).containsSome(...cards);//这里containsSome就是some的作用，无名杀专属函数（很早就有了）。
							},
							forced: true,
							content() {
								let cards = [];
								for (const i of trigger.cards) {
									cards.push(get.cardPile2(card => card.cardid === i._cardid) || i);
								}
								trigger.cards = cards;//trigger.card表示事件牌（Vcard类型）trigger.cards表示事件中的实体牌。trigger.card.cards表示事件牌对应的实体牌。在视为逻辑中两个都要改。
								trigger.card.cards = cards;
							},
						},
						tinglingA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							frequent: "check",
							check: function (event, player) {
								return get.attitude(player, event.player) <= 0;
							},
							trigger: {
								global: "phaseUseBefore",
							},
							filter: function (event, player) {
								return event.player != player;
							},
							content: function () {
								"step 0";
								player.chooseControl("heart", "diamond", "club", "spade")
									.set("prompt", get.translation(player) + "发动了【听令】，请选择一个花色")
									.set("ai", () => [0, 1, 2, 3].randomGet());
								"step 1";
								game.log(player, "选择了" + get.translation(result.control));
								event.choice = result.control.slice();
								let list = [[0, "将所有花色不为" + get.translation(event.choice) + "的牌交给" + get.translation(player)], [1, "跳过此阶段且非锁定技失效直到下你回合开始。"]];
								trigger.player.chooseButton(["听令：请选择一项：", [list, "textbutton"]])
									.set("forced", true)
									.set("selectButton", 1)
									.set("filterButton", function (button) {
										if (button.link == 0) {
											return trigger.player.countCards("he", (card) => get.suit(card) != event.choice) > 0;
										}
										return true;
									})
									.set("ai", function (button) {
										if (button.link == 0 && trigger.player.countCards("he", (card) => get.suit(card) != event.choice) > 0) return 1;
										else return Math.random();
									})
								"step 2"
								if (result.bool) {
									if (result.links[0] == 0) {
										trigger.player.give(trigger.player.getCards("he", (card) => get.suit(card) != event.choice), player, "giveAuto");
										event.finish();
									}
									else {
										trigger.cancel();
										trigger.player.addTempSkill("fengyin", { player: "phaseBegin" });
										event.finish();
									}
								}
							},
							ai: {
								expose: 1,
								threaten: 1.4,
							},
							"_priority": 0,
						},
						yirongA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							charlotte: true,
							limited: true,
							frequent: 'check',
							unique: true,
							skillAnimation: true,
							animationStr: "惟妙惟肖",
							logTarget: "player",
							trigger: {
								player: "dying",
							},
							/**
							 * 这段check用来统计角色濒死时可以用来救人的牌，如桃、酒等。如果这些牌的数量足够救人，则AI不发动技能。
							 */
							check: function (event, player) {
								if (player.countCards('h', function (card) {
									var savable = get.info(card).savable;
									if (typeof savable == 'function') savable = savable(card, player, event.player);
									return savable;
								}) >= 1 - event.player.hp) return false;
								return event.player == player;
							},
							filter: function (event, player) {
								return player.hp <= 0;
							},
							content: function () {
								'step 0'
								player.awakenSkill("yirongA");
								'step 1'
								player.recover(player.maxHp - player.hp);
								'step 2'
								let list = lib.characterSort.GenshinImpactEnhanced.qiyuezhiyan.filter(name => ['epic', 'legend'].includes(game.getRarity(name)))
								let players = game.players.concat(game.dead);
								for (var i = 0; i < players.length; i++) {
									list.remove(players[i].name);
									list.remove(players[i].name1);
									list.remove(players[i].name2);
								}
								if (!list.length) {
									event.finish();
									return;
								}
								player.chooseButton()
									.set("forced", true)
									.set('createDialog', ['将武将牌替换为一名未出场的璃月角色', [list, 'character']])
									.set('ai', function (button) {
										return Math.random();/*随机选一个*/
									});
								'step 3'
								if (result.bool) {
									player.reinit(player.name, result.links[0]);
								}
							},
						},
						yeyaA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							forced: true,
							trigger: {
								source: "damageBegin1",
							},
							filter: function (event, player) {
								return get.type(event.card) == 'trick';
							},
							content: function () {
								trigger.nature = 'thunder';
							},
							"_priority": 0,
						},
						zhongerA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							group: "zhongerB",
							popup: false,
							forced: true,
							trigger: {
								player: "phaseBegin",
							},
							content: function () {
								'step 0'
								if (!player.hasSkill("zhongerC")) {
									player.addSkill('zhongerC');
									player.logSkill('zhongerA');
									player.node.avatar.setBackgroundImage('extension/原梗Enhanced/other/菲谢尔幽夜.png');
									event.finish();
								}
								'step 1'
								if (player.hasSkill("zhongerC")) {
									player.removeSkill('zhongerC');
									player.logSkill('zhongerC');
									player.node.avatar.setBackgroundImage('extension/原梗Enhanced/other/菲谢尔头像.png');
									event.finish();
								}
							},
							"_priority": 0,
						},
						zhongerB: {
							popup: false,
							forceDie: true,
							forced: true,
							trigger: {
								player: "die",
							},
							filter: function (event, player) {
								return player.hasSkill("zhongerC");
							},
							content: function () {
								player.removeSkill('zhongerC');
								player.node.avatar.setBackgroundImage('extension/原梗Enhanced/other/菲谢尔头像.png');
							},
							"_priority": 0,
						},
						zhongerC: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							"_priority": 0,
						},
						huangnvA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							group: "huangnvB",
							forced: true,
							trigger: {
								player: "phaseJieshuBegin",
							},
							filter: function (event, player) {
								return player.hasSkill('zhongerC');
							},
							content: function () {
								'step 0'
								var list = [];
								for (var i = 0; i < lib.inpile.length; i++) {
									if (get.type(lib.inpile[i]) == 'trick') list.push(['锦囊', '', lib.inpile[i]]);
								}
								player.chooseButton(['选择使用一张锦囊牌', [list, 'vcard']]).set('ai', function (button) {
									var player = _status.event.player;
									var recover = 0, lose = 1, players = game.filterPlayer();
									for (var i = 0; i < players.length; i++) {
										if (players[i].hp == 1 && get.damageEffect(players[i], player, player) > 0 && !players[i].hasSha()) {
											return (button.link[2] == 'juedou') ? 2 : -1;
										}
										if (!players[i].isOut()) {
											if (players[i].hp < players[i].maxHp) {
												if (get.attitude(player, players[i]) > 0) {
													if (players[i].hp < 2) {
														lose--;
														recover += 0.5;
													}
													lose--;
													recover++;
												}
												else if (get.attitude(player, players[i]) < 0) {
													if (players[i].hp < 2) {
														lose++;
														recover -= 0.5;
													}
													lose++;
													recover--;
												}
											}
											else {
												if (get.attitude(player, players[i]) > 0) {
													lose--;
												}
												else if (get.attitude(player, players[i]) < 0) {
													lose++;
												}
											}
										}
									}
									if (lose > recover && lose > 0) return (button.link[2] == 'nanman') ? 1 : -1;
									else if (lose < recover && recover > 0) return (button.link[2] == 'taoyuan') ? 1 : -1;
									else return (button.link[2] == 'wuzhong') ? 1 : -1;
								});
								'step 1'
								if (result && result.bool && result.links[0]) {
									var card = { name: result.links[0][2], nature: result.links[0][3] };
									player.chooseUseTarget(card, true);
								}
							},
							"_priority": 0,
						},
						huangnvB: {
							popup: false,
							forced: true,
							trigger: {
								player: "useCard",
							},
							filter: function (event, player) {
								return get.type(event.card) == 'trick';
							},
							content: function () {
								trigger.nowuxie = true;
							},
							"_priority": 0,
						},
						aimiA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							forced: true,
							trigger: {
								player: "phaseJieshuBegin",
							},
							filter: function (event, player) {
								return !player.hasSkill('zhongerC');
							},
							content: function () {
								player.draw();
							},
							mod: {
								targetEnabled: function (card, player, target) {
									if (get.type(card) == 'delay') {
										return game.countPlayer(function (current) {
											return current.hasSkill('zhongerC');
										});
									}
								},
							},
							"_priority": 0,
						},
						yunzhongA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							init: function (player, skill) {
								game.broadcastAll(player => {
									const originalAddMark = lib.element.player.addMark;
									const originalRemoveMark = lib.element.player.removeMark;
									const skillList = ["yunzhongA_1", "yunzhongA_2", "yunzhongA_3"];
									if (typeof lib.element.player.addMark === "function") {
										const addMark = function (i, num, log) {
											originalAddMark.apply(this, arguments);
											if (i === "yunzhongA_mark") {
												const level = this.storage[i] || 0;//保证代码健壮性
												for (let j = 0; j < level && j < skillList.length; j++) {
													const skill = skillList[j];
													if (!this.hasSkill(skill)) {
														this.addSkill(skill);
													}
												}
											}
										};
										lib.element.player.addMark = addMark;
										[...game.players, ...game.dead].forEach(i => (i.addMark = addMark));
									}
									if (typeof lib.element.player.removeMark === "function") {
										const removeMark = function (i, num, log) {
											originalRemoveMark.apply(this, arguments);
											if (i === "yunzhongA_mark") {
												const level = this.storage[i] || 0;//保证代码健壮性
												if (level < skillList.length) {
													// 从当前标记等级 + 1 开始移除技能
													for (let j = level; j < skillList.length; j++) {
														const skill = skillList[j];
														if (this.hasSkill(skill)) {
															this.removeSkill(skill);
														}
													}
												}
											}
										};
										lib.element.player.removeMark = removeMark;
										[...game.players, ...game.dead].forEach(i => (i.removeMark = removeMark));
									}
								}, player);
							},
							enable: "phaseUse",
							usable: 1,
							charlotte: true,
							selectCard: -1,
							filterCard: false,
							selectTarget: [1, Infinity],
							filterTarget: (card, player, target) => player !== target,
							multiline: true,
							multitarget: true,
							content: function () {
								for (const target of targets) {
									target.addMark("yunzhongA_mark", 1);
								}
							},
							subSkill:
							{
								mark: {
									charlotte: true,
									onremove: true,
									mark: false,
									marktext: "种",
									intro: {
										name: "蕴种印",
										content: function (storage, player, skill) {
											const effects = [
												`①你计算与其他角色的 <span style="color:#FFAA00;font-weight:bold;">距离+1</span> 且你的 <span style="color:#FFFF66;font-weight:bold;">手牌上限固定为0</span>`,
												`②不能使用 <span style="color:#33EEFF;font-weight:bold;">锦囊牌</span> 且<span style="color:#FF33CC;font-weight:bold;">非锁定技失效</span>`,
												`③<span style="color:#FF4444;font-weight:bold;">无法回复体力</span> 且受到的伤害 <span style="color:#66FF66;font-weight:bold;">随机翻2~3倍</span>`
											];
											if (storage >= 1 && storage <= 3) {
												return effects.slice(0, storage).join("<br>");
											}
											return "";
										},
									},
									sub: true,
								},
								1: {
									mod: {
										globalFrom: function (from, to, distance) {
											if (from.countMark("yunzhongA_mark") >= 1) return distance + 1;
										},
										maxHandcardFinal: function (player, num) {
											if (player.countMark("yunzhongA_mark") >= 1) return 0;
										},
									},
									ai: {
										nokeep: true,
										skillTagFilter: player => player.countMark("yunzhongA_mark") >= 1,
									},
									sub: true,
								},
								2: {
									charlotte: true,
									init: (player, skill) => player.addSkillBlocker(skill),
									onremove: (player, skill) => player.removeSkillBlocker(skill),
									skillBlocker: function (skill, player) {
										// !['persevereSkill', 'charlotte', 'limited', 'juexingji'].some(key => lib.skill[skill][key])这样可以照顾一些不正确写技能的武将
										return !lib.skill[skill].persevereSkill && !lib.skill[skill].charlotte && !get.is.locked(skill, player);
									},
									mark: true,
									marktext: "锁",
									intro: {
										content: function (storage, player, skill) {
											var list = player.getSkills(null, false, false).filter(function (i) {
												return lib.skill.yunzhongA_2.skillBlocker(i, player);
											});
											if (list.length) return "失效技能：" + get.translation(list);
											return "无失效技能";
										},
									},
									sub: true,
								},
								3: {
									charlotte: true,
									forced: true,
									trigger: {
										player: "phaseBegin",
									},
									filter: function (event, player) {
										return event.player.isIn() && event.player.countMark("yunzhongA_mark") >= 3;
									},
									content: function () {
										let markNumber = trigger.player.countMark("yunzhongA_mark");
										trigger.player.clearMark("yunzhongA_mark");
										trigger.player.damage(markNumber, 'notrigger');
									},
									sub: true,
								},
							},
							ai: {
								order: 10,
								expose: 0.8,
								threaten: 1.4,
								result: {
									target: (player, target) => [-3, -7, -10][Math.min(player.phaseNumber - 1, 2)]
								},
							},
							"_priority": 0,
						},
						miaodiA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							forced: true,
							trigger: {
								global: "phaseEnd",
							},
							filter: function (event, player) {
								return player != event.player && event.player.getHistory("useCard", card => get.type2(card.card) == "trick").length >= event.player.hp;
							},
							async content(event, trigger, player) {
								player.insertPhase();
							},
							mod: {
								targetEnabled: function (card, player, target) {
									if (get.type2(card) == 'trick' && player != target) return false;
								},
							},
							"_priority": 10,
						},
						fumengA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							enable: ["chooseToUse", "chooseToRespond"],
							filter: function (event, player) {
								if (!player.countCards('hes') || player.countMark("fumengA") == 0) return false;
								for (var name of lib.inpile) {
									var type = get.type(name);
									if (type == 'basic' || type == 'trick') {
										if (event.filterCard(get.autoViewAs({ name: name }, 'unsure'), player, event)) return true;
										if (name == 'sha') {
											for (var j of lib.inpile_nature) {
												if (event.filterCard(get.autoViewAs({ name: name, nature: j }, 'unsure'), player, event)) return true;
											}
										}
									}
								}
								return false;
							},
							chooseButton: {
								dialog(event, player) {
									var list = [];
									for (var name of lib.inpile) {
										var type = get.type(name);
										if (!(type == 'basic' || type == 'trick')) continue;
										if (event.filterCard(get.autoViewAs({ name: name }, 'unsure'), player, event)) list.push([get.translation(get.type(name)), '', name]);
										if (name == 'sha') {
											for (var j of lib.inpile_nature) {
												if (event.filterCard(get.autoViewAs({ name: name, nature: j }, 'unsure'), player, event)) list.push(['基本', '', 'sha', j]);
											}
										}
									}
									return ui.create.dialog('浮梦', [list, 'vcard']);
								},
								filter(button, player) {
									return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
								},
								check: function (button) {
									if (_status.event.getParent().type != 'phase') return 1;
									var player = _status.event.player;
									if (['wugu', 'zhulu_card', 'yiyi', 'lulitongxin', 'lianjunshengyan', 'diaohulishan', 'diaobingqianjiang'].includes(button.link[2])) return 0;
									return player.getUseValue({ name: button.link[2], nature: button.link[3] });
								},
								backup(links, player) {
									return {
										filterCard: true,
										check(card) {
											return 8 - get.value(card);
										},
										precontent: function () {
											player.removeMark('fumengA', 1, false);
										},
										position: 'hes',
										viewAs: { name: links[0][2], nature: links[0][3] },
									}
								},
								prompt(links, player) {
									return '将一张牌当做' + (get.translation(links[0][3]) || '') + get.translation(links[0][2]) + '使用';
								},
							},
							hiddenCard: function (player, name) {
								if (!lib.inpile.includes(name) || !player.countMark('fumengA')) return false;
								var type = get.type(name);
								return (type == 'basic' || type == 'trick') && player.countCards('she') > 0;
							},
							group: ["fumengA_1", "fumengB"],
							subSkill: {
								"1": {
									init: player => player.addMark("fumengA", 2, false),
									charlotte: true,
									silent: true,
									trigger: {
										global: "phaseBegin",
									},
									filter: function (event, player) {
										return player.hasSkill("fumengA") && player.isIn();
									},
									content: function () {
										let num = player.countMark("fumengA");
										if (num != 2) player.addMark("fumengA", 2 - num, false);
									},
									onremove: true,
									sub: true,
								},
							},
							ai: {
								expose: 0.6,
								threaten: 1.5,
								fireAttack: true,
								respondSha: true,
								respondShan: true,
								order: function (item, player) {
									if (player && _status.event.type == 'phase') {
										var max = 0, add = false;
										var types = ['basic', 'trick'];
										var list = lib.inpile.filter(name => types.includes(get.type(name)));
										if (list.includes('sha')) add = true;
										list = list.map(namex => { return { name: namex } });
										if (add) lib.inpile_nature.forEach(naturex => list.push({ name: 'sha', nature: naturex }));
										for (var card of list) {
											if (player.getUseValue(card) > 0) {
												var temp = get.order(card);
												if (temp > max) max = temp;
											}
										}
										if (max > 0) max += 3;
										return max;
									}
									return 2;
								},
								result: {
									player: function (player) {
										if (_status.event.dying) return get.attitude(player, _status.event.dying);
										return 1;
									},
								},
							},
						},
						fumengB: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							round: 1,//每一轮限一次的简单写法，会自动加上$skillname_roundcount,用于显示技能是否已发动。每轮限X次可以用mark或者storage。
							forced: true,
							trigger: {
								player: "dying",
							},
							filter: function (event, player) {
								return event.player.hp <= 0;
							},
							logTarget: (event, player) => game.filterPlayer(current => player != current).sortBySeat(),
							//在异步写法里，这里其实就定义了event.targets,step的话则要在content里定义一遍，可以参考神太史慈（触发技选择所有其他角色）。异步不想logtarget也可以参考长安神曹操，step也可以直接用game.countPlayer(),直接在该函数里写取巧。
							async content(event, trigger, player) {
								for (const target of event.targets) {
									if (!target.isIn()) continue;
									const next = target.chooseControl();
									next.set('choiceList', [`令${get.translation(player)}回复1点体力并从牌堆中随机获得两张普通锦囊牌`, `废除所有装备栏，已废除则改为失去2点体力。`])
										.set("prompt", get.translation(player) + "发动了〖浮梦〗，请选择一项")
										.set('displayIndex', false)
										.set('ai', () => {
											const player = get.player();
											const target = get.event().getParent().player;
											if (get.attitude(player, target) < 0 && !player.hasDisabledSlot()) return 1;
											return 0;
										});
									const result = await next.forResult();
									if (result.index === 0) {
										await trigger.player.recover();
										let gains = [];
										while (gains.length < 2) {
											const card = get.cardPile2(i => get.type(i) == "trick" && !gains.includes(i));
											if (card) gains.push(card);
											else break;
										}
										if (gains.length) await player.gain(gains, "gain2");
										else {
											player.chat("无牌可得？！");
											game.log("但是牌堆没有普通锦囊牌了！");
										}
									}
									else {
										let disables = [];
										for (let i = 1; i <= 5; i++) {
											for (let j = 0; j < target.countEnabledSlot(i); j++) {
												disables.push(i);
											}
										}
										if (disables.length) await target.disableEquip(disables);
										else await target.loseHp(2);
									}
								}
							},
						},
						huawuA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							trigger: {
								player: "loseAfter",
								global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
							},
							frequent: true,
							filter: function (event, player) {
								var evt = event.getl(player);
								return evt && evt.player == player && evt.es && evt.es.length > 0;
							},
							content: function () {
								player.draw(2);
							},
							ai: {
								noe: true,
								reverseEquip: true,
								effect: {
									target: function (card, player, target, current) {
										if (get.type(card) == 'equip' && !get.cardtag(card, 'gifts')) return [1, 3];
									},
								},
							},
							"_priority": 0,
						},
						lunpoA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							enable: "phaseUse",
							selectTarget: 1,
							filterTarget: function (card, player, target) {
								return player != target && target.countCards('he') > 0;
							},
							filter: function (event, player) {
								return !player.hasSkill('lunpoB');
							},
							content: function () {
								"step 0"
								player.chooseControl(lib.suit).set('prompt', '请选择一个花色').ai = function () { return lib.suit.randomGet() };
								"step 1"
								event.suit = result.control;
								if (target.countCards('e') > 0)
									target.gain(target.getCards('e'), 'gain2');
								"step 2"
								player.discardPlayerCard(target, 'h', true);
								"step 3"
								if (result.bool) {
									var suit2 = get.suit(result.cards[0]);
									if (get.type(result.cards[0]) == 'equip') {
										player.logSkill('lunpoC');
										player.gain(result.cards[0], 'gain2', 'log');
									}
									if (suit2 != event.suit) {
										player.addTempSkill('lunpoB', 'phaseUseEnd');
										if (get.type(result.cards[0]) != 'equip')
											player.logSkill('lunpoB');
									}
								}
							},
							ai: {
								order: 1,
								result: {
									target: -1,
								},
							},
							"_priority": 0,
						},
						lunpoB: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							"_priority": 0,
						},
						lunpoC: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							"_priority": 0,
						},
						dunchiA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							forced: true,
							trigger: {
								player: "phaseDiscardEnd",
							},
							filter: function (event, player) {
								return !player.isEmpty(1);
							},
							content: function () {
								player.gain(player.getEquip(1), 'gain2');
							},
							mod: {
								globalFrom: function (from, to, distance) {
									if (from.isEmpty(1)) return distance - 1;
								},
							},
							"_priority": 0,
						},
						cunshouA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							direct: true,
							logTarget: "target",
							trigger: {
								global: "useCardToTarget",
							},
							filter: function (event, player) {
								if (!event.player.isAlive()) return false;
								if (event.player.countCards('he') == 0) return false;
								if (event.player == player) return false;
								if (event.target == player) return false;
								return event.card.name == 'sha' && get.distance(player, event.target) <= 1 && event.target.isIn();
							},
							content: function () {
								"step 0"
								player.chooseBool(get.prompt('cunshouA'), '弃置' + get.translation(trigger.player) + '的一张牌(手牌优先)').set('ai', function () {
									if (get.attitude(player, trigger.player) < 0)
										return 1;
									else return 0;
								});
								"step 1"
								if (result.bool) {
									player.logSkill('cunshouA', trigger.target);
									trigger.target.line(trigger.player, 'green');
									if (trigger.player.countCards('h')) player.discardPlayerCard(trigger.player, 'h', true);
									else if (trigger.player.countCards('e')) player.discardPlayerCard(trigger.player, 'e', true);
								}
							},
							ai: {
								threaten: 2,
							},
							"_priority": 0,
						},
						juexiaoA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							group: ["juexiaoC", "juexiaoD", "juexiaoE"],
							forced: true,
							trigger: {
								player: "useCardAfter",
							},
							filter: function (event, player) {
								if (_status.currentPhase != player) return false;
								return (event.card.name == 'shunshou' && event.card.isCard);
							},
							content: function () {
								"step 0"
								player.addToExpansion(trigger.cards[0], 'giveAuto').gaintag.add('juexiaoB');
								"step 1"
								if (player.getExpansions('juexiaoB').length == 5)
									ui.backgroundMusic.src = lib.assetURL + 'extension/原梗Enhanced/other/坎蒂丝热烈的决斗者.mp3';
							},
							"_priority": 0,
						},
						juexiaoB: {
							popup: false,
							unique: true,
							onremove: true,
							mark: true,
							marktext: "封",
							locked: true,
							forced: true,
							intro: {
								name: "封印",
								mark: function (dialog, content, player) {
									var content = player.getExpansions('juexiaoB');
									if (content && content.length) {
										//                if(player==game.me||player.isUnderControl()){
										dialog.addAuto(content);
										//                }
										//                else{
										//                   return '共有'+get.cnNumber(content.length)+'张封印';
										//                }
									}
								},
							},
							"_priority": 0,
						},
						juexiaoC: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							skillAnimation: true,
							animationStr: "封印解除",
							animationColor: "water",
							forced: true,
							trigger: {
								player: "phaseZhunbeiBegin",
							},
							filter: function (event, player) {
								return player.getExpansions('juexiaoB').length == 5;
							},
							content: function () {
								var bool = false;
								if (player == game.me) bool = true;
								game.over(bool);
							},
							"_priority": 0,
						},
						juexiaoD: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							forced: true,
							trigger: {
								player: "loseAfter",
							},
							filter: function (event, player) {
								if (_status.currentPhase != player) return false;
								if (event.type != 'discard') return false;
								for (var i = 0; i < event.cards2.length; i++) {
									if (get.position(event.cards2[i]) == 'd' && event.cards2[i].name == 'shunshou') {
										return true;
									}
								}
								return false;
							},
							content: function () {
								"step 0"
								for (var i = 0; i < trigger.cards2.length; i++) {
									if (get.position(trigger.cards2[i], true) == 'd' && trigger.cards2[i].name == 'shunshou') {
										player.addToExpansion(trigger.cards2[i], 'giveAuto').gaintag.add('juexiaoB');
									}
								}
								"step 1"
								if (player.getExpansions('juexiaoB').length == 5)
									ui.backgroundMusic.src = lib.assetURL + 'extension/原梗Enhanced/other/坎蒂丝热烈的决斗者.mp3';
							},
							"_priority": 0,
						},
						juexiaoE: {
							popup: false,
							forced: true,
							trigger: {
								global: "gameDrawAfter",
								player: "enterGame",
							},
							filter: function (event, player) {
								return game.countPlayer() < 5;
							},
							content: function () {
								player.awakenSkill('juexiaoA');
							},
							"_priority": 0,
						},
						touziA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							group: ["touziC", "touziD"],
							enable: "phaseUse",
							position: "he",
							selectCard: [1, 3],
							discard: false,
							lose: false,
							delay: 0,
							filterCard: true,
							filterTarget: function (card, player, target) {
								if (target.storage.zuokongB > 0) return false;
								return player != target;
							},
							filter: function (event, player) {
								if (game.countPlayer(function (current) {
									return current.storage.touziB > 0;
								})) return false;
								return player.countCards('he') > 0;
							},
							content: function () {
								target.storage.touziB = cards.length;
								target.syncStorage('touziB');
								target.markSkill('touziB');
								target.gain(cards, 'draw');
							},
							ai: {
								order: 1,
								result: {
									target: 1,
								},
							},
							"_priority": 0,
						},
						touziB: {
							mark: true,
							marktext: "资",
							intro: {
								name: "投资",
							},
							"_priority": 0,
						},
						touziC: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							forced: true,
							trigger: {
								global: "damageEnd",
							},
							filter: function (event, player) {
								if (!event.source) return false;
								if (!event.source.isAlive()) return false;
								if (event.source.storage.touziB > 0) return true;
								return false;
							},
							content: function () {
								'step 0'
								trigger.source.storage.touziB--;
								'step 1'
								trigger.source.syncStorage('touziB');
								if (trigger.source.storage.touziB != 0)
									trigger.source.markSkill('touziB');
								else trigger.source.unmarkSkill('touziB');
								player.draw();
							},
							"_priority": 0,
						},
						touziD: {
							popup: false,
							forced: true,
							trigger: {
								global: "die",
							},
							filter: function (event, player) {
								if (event.player.storage.touziB > 0) return true;
								if (event.player.storage.zuokongB > 0) return true;
								return false;
							},
							content: function () {
								if (trigger.player.storage.touziB > 0) {
									trigger.player.storage.touziB = 0;
									trigger.player.syncStorage('touziB');
									trigger.player.unmarkSkill('touziB');
								}
								if (trigger.player.storage.zuokongB > 0) {
									trigger.player.storage.zuokongB = 0;
									trigger.player.syncStorage('zuokongB');
									trigger.player.unmarkSkill('zuokongB');
								}
							},
							"_priority": 0,
						},
						zuokongA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							group: ["zuokongC", "zuokongD"],
							enable: "phaseUse",
							filterTarget: function (card, player, target) {
								if (target.storage.touziB > 0) return false;
								return player != target && target.countCards('h') > 0;
							},
							filter: function (event, player) {
								if (game.countPlayer(function (current) {
									return current.storage.zuokongB > 0;
								})) return false;
								return game.countPlayer(function (current) {
									return current.countCards('h') > 0 && current != player;
								});
							},
							content: function () {
								'step 0'
								target.chooseCard('h', true, '做空：将一张手牌交给' + get.translation(player)).ai = function (card) {
									return 6 - ai.get.value(card);
								};
								'step 1'
								if (result.bool) {
									target.storage.zuokongB = 1;
									target.syncStorage('zuokongB');
									target.markSkill('zuokongB');
									//target.give(result.cards,player,true);
									player.gain(result.cards, target, 'giveAuto');
								}
							},
							ai: {
								order: 8,
								result: {
									target: -1,
								},
							},
							"_priority": 0,
						},
						zuokongB: {
							mark: true,
							marktext: "空",
							intro: {
								name: "做空",
							},
							"_priority": 0,
						},
						zuokongC: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							forced: true,
							trigger: {
								global: "damageEnd",
							},
							filter: function (event, player) {
								if (!event.source) return false;
								if (!event.source.isAlive()) return false;
								if (event.source.storage.zuokongB > 0) return true;
								return false;
							},
							content: function () {
								'step 0'
								trigger.source.storage.zuokongB--;
								'step 1'
								trigger.source.syncStorage('zuokongB');
								if (trigger.source.storage.zuokongB != 0)
									trigger.source.markSkill('zuokongB');
								else trigger.source.unmarkSkill('zuokongB');
								if (player.countCards('h') > 0)
									player.chooseCard(true, '交给' + get.translation(trigger.source) + '一张手牌');
								'step 2'
								if (result.bool) {
									trigger.source.gain(result.cards, player, 'giveAuto')
								}
							},
							"_priority": 0,
						},
						zuokongD: {
							forceDie: true,
							popup: false,
							forced: true,
							trigger: {
								player: ["die", "phaseBegin"],
							},
							filter: function (event, player) {
								if (game.countPlayer(function (current) {
									return current.storage.touziB > 0;
								})) return true;
								if (game.countPlayer(function (current) {
									return current.storage.zuokongB > 0;
								})) return true;
								return false;
							},
							content: function () {
								if (game.countPlayer(function (current) {
									return current.storage.touziB > 0;
								})) {
									var list1 = game.filterPlayer(function (current) {
										return current.storage.touziB > 0;
									});
									list1[0].storage.touziB = 0;
									list1[0].syncStorage('touziB');
									list1[0].unmarkSkill('touziB');
								}
								if (game.countPlayer(function (current) {
									return current.storage.zuokongB > 0;
								})) {
									var list2 = game.filterPlayer(function (current) {
										return current.storage.zuokongB > 0;
									});
									list2[0].storage.zuokongB = 0;
									list2[0].syncStorage('zuokongB');
									list2[0].unmarkSkill('zuokongB');
								}
							},
							"_priority": 0,
						},
						modengA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							unique: true,
							mark: true,
							skillAnimation: true,
							animationStr: "魔灯显灵",
							animationColor: "thunder",
							limited: true,
							enable: "phaseUse",
							init: function (player) {
								player.storage.modengA = false;
							},
							filterTarget: function (card, player, target) {
								if (target == player) return false;
								return true;
							},
							content: function () {
								'step 0'
								player.awakenSkill('modengA');
								player.storage.modengA = true;
								'step 1'
								game.asyncDraw([targets[0], player]);
								'step 2'
								var choices = [];
								var target = targets[0];
								var left = [], right = [], left2 = player, right2 = player;
								while (left2 != target && right2 != target) {
									left2 = left2.getPrevious();
									right2 = right2.getNext();
									if (left2 != target) left.push(left2);
									if (right2 != target) right.push(right2);
								}
								if (target == left2) {
									choices.push('↖顺时针');
								}
								if (target == right2) {
									choices.push('逆时针↗');
								}
								if (player.getNext() != targets[0] && player.getPrevious() != targets[0])
									player.chooseControl(choices).set('prompt', get.prompt('modengA')).set('prompt2', '对自己和' + get.translation(targets[0]) + '某个方向之间的所有角色各造成1点雷属性伤害', true);
								'step 3'
								if (result.control == '↖顺时针') {
									var current = targets[0].getNext();
									while (current != player) {
										current.damage('thunder');
										current = current.getNext();
									}
								}
								if (result.control == '逆时针↗') {
									var current = player.getNext();
									while (current != targets[0]) {
										current.damage('thunder');
										current = current.getNext();
									}
								}
								if (!event.isMine() && !event.isOnline()) game.delayx();
							},
							intro: {
								content: "limited",
								mark: function (dialog, content, player) {
									return '魔灯显灵';
								},
							},
							ai: {
								order: 1,
								result: {
									target: 1,
								},
							},
							"_priority": 0,
						},
						tutuA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							group: "tutuB",
							enable: "phaseUse",
							filter: function (event, player) {
								if (player.storage.tutuA.length > 0) return false;
								return true;
							},
							content: function () {
								"step 0"
								player.draw();
								"step 1"
								if (player.countCards('h')) {
									player.chooseCard('将一张手牌置于武将牌上作为“兔兔”', true).ai = function (card) {
										return 6 - ai.get.value(card);
									};
								}
								"step 2"
								if (result.cards && result.cards.length) {
									player.lose(result.cards, ui.special, 'toStorage');
									player.storage.tutuA = player.storage.tutuA.concat(result.cards);
									player.syncStorage('tutuA');
									player.markSkill('tutuA');
									game.log(player, '将', result.cards, '置于武将牌上作为“兔兔”');
								}
							},
							init: function (player) {
								if (!player.storage.tutuA) player.storage.tutuA = [];
							},
							intro: {
								content: "cards",
								onunmark: function (storage, player) {
									if (storage && storage.length) {
										player.$throw(storage, 1000);
										game.cardsDiscard(storage);
										game.log(storage, '被置入了弃牌堆');
										storage.length = 0;
									}
								},
							},
							ai: {
								order: 10,
								result: {
									player: 1,
								},
							},
							"_priority": 0,
						},
						tutuB: {
							direct: true,
							trigger: {
								global: "gameDrawAfter",
								player: "enterGame",
							},
							filter: function (event, player) {
								if (player.storage.tutuA.length > 0) return false;
								return true;
							},
							content: function () {
								"step 0"
								player.chooseBool(get.prompt('tutuA'), '游戏开始时，你可以摸一张牌并将一张手牌置于武将牌上称为“兔兔”。').set('ai', function (event, player) { return 1; });
								"step 1"
								if (result.bool) {
									player.logSkill('tutuA');
									player.draw();
								} else event.finish();
								"step 2"
								if (player.countCards('h')) {
									player.chooseCard('将一张手牌置于武将牌上作为“兔兔”', true).ai = function (card) {
										return 6 - ai.get.value(card);
									};
								}
								"step 3"
								if (result.cards && result.cards.length) {
									player.lose(result.cards, ui.special, 'toStorage');
									player.storage.tutuA = player.storage.tutuA.concat(result.cards);
									player.syncStorage('tutuA');
									player.markSkill('tutuA');
									game.log(player, '将', result.cards, '置于武将牌上作为“兔兔”');
								}
							},
							init: function (player) {
								if (!player.storage.tutuA) player.storage.tutuA = [];
							},
							intro: {
								content: "cards",
								onunmark: function (storage, player) {
									if (storage && storage.length) {
										player.$throw(storage, 1000);
										game.cardsDiscard(storage);
										game.log(storage, '被置入了弃牌堆');
										storage.length = 0;
									}
								},
							},
							"_priority": 0,
						},
						zhenchaA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							frequent: true,
							trigger: {
								player: "phaseUseBegin",
							},
							filter: function (event, player) {
								return game.hasPlayer((current) => !current.hasSkill("zhenchaA_2") && current != player && !player.inRange(current));
							},
							content: function () {
								"step 0"
								player.chooseTarget(get.prompt('zhenchaA'), 1, true, (card, player, target) => player != target && !target.hasSkill("zhenchaA_2")).set("ai", function (target) {//设置ai:
									return -get.attitude(player, target);
								});
								"step 1"
								var target = result.targets[0];
								target.addSkill("zhenchaA_2");
							},
							mod: {
								targetEnabled: function (card, player, target) {
									if (player != target && get.type2(card) == 'trick' && get.tag(card, 'damage')) return false;
								},
							},
							group: "zhenchaA_1",
							subSkill: {
								"1": {
									locked: true,
									ai: {
										viewHandcard: true,
										skillTagFilter: function (player, tag, arg) {
											var targets = game.filterPlayer(function (current) {
												return current != player;
											})
											for (var target of targets) {
												if (!player.inRange(target)) {
													if (target == arg) return false;
												}
											}
											if (player == arg) return false;
										},//player是技能拥有者,tag是ai里的技能标签,arg是技能标签的生效目标
									},
									sub: true,
								},
								"2": {
									charlotte: true,
									unique: true,
									onremove: true,
									mark: true,
									marktext: "显",
									locked: true,
									intro: {
										name: "可疑",
										content: "任何被她盯上的「可疑人士」，绝对逃不过骑士认真的质询。",
									},
									mod: {
										inRangeOf: function (from, to) {
											if (from.hasSkill("zhenchaA")) return true;
										},
									},
									"_priority": 0,
								},
							},
							"_priority": 0,
						},
						huoshiA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							enable: "phaseUse",//出牌阶段发动
							usable: 1,//每回合一次(因为回合外没有你的出牌阶段，实际为出牌阶段限一次)
							selectCard: -1,
							filterCard: false,
							selectTarget: [1, Infinity],//选择一名
							filterTarget: (card, player, target) => target != player,
							multiline: true,
							multitarget: true,
							filter: function (event, player) {//发动限制条件
								return player.isIn();
							},
							content: function () {
								var number = game.countPlayer(function (current) {
									return player.inRange(current);
								});
								player.useCard({ name: 'sha', isCard: true, nature: 'fire' }, targets, false).set("oncard", () => get.event().effectCount += number);
							},
							ai: {
								threaten: 1.5,
								order: 8,
								result: {//主动技的收益，返回值只能是1个数字
									target: function (player, target) {//发动这个技能对目标的收益
										if (get.damageEffect(target, player, player, 'fire') <= 0) return 0;
										if (target.isLinked() && player.isLinked()) return [-4, 1];
										return -2 * player.getAttackRange();
									},
								},
							},
							"_priority": 0,
						},
						yanhuA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							usable: 3,
							prompt2: "锁定技，每回合限三次，当你受到伤害时，若伤害来源不为你且在你的攻击范围内，则防止此伤害。",
							trigger: {
								player: "damageBegin2",
							},
							filter: function (event, player) {
								return event.source != player && event.source && player.inRange(event.source);
							},
							content: function () {
								trigger.cancel();
								trigger.player.removeMark("yanhuA_2", 1, false);
							},
							group: ["yanhuA_1", "yanhuA_2"],
							subSkill: {
								1: {
									audio: "yanhuA",
									charlotte: true,
									locked: true,
									check: function (event, player) {//触发技ai
										return get.attitude(player, event.player) > 0 && player.hp > 1;
									},
									trigger: {
										global: "damageBegin3",
									},
									filter: function (event, player) {
										return event.player != player && event.source != player && event.player.isDamaged();
									},
									content: function () {
										"step 0"
										let gainCardNameList = lib.inpile.filter(c => get.type(c) != "basic");
										let gainCardList = [];
										for (var i = 0; i < 3; i++) {
											gainCardList.push(game.createCard(gainCardNameList.randomGet()));
										}
										player.gain(gainCardList, "gain2");
										"step 1"
										trigger.cancel();
										player.damage(trigger.source ? trigger.source : 'nosource', trigger.nature, 1);
									},
									ai: {
										expose: 1,
									},
									"_priority": 0,
								},
								2: {
									charlotte: true,
									silent: true,
									mark: true,
									marktext: "兔",
									intro: {
										name: "『兔兔伯爵』",
										content: "兔兔伯爵，出击！",
									},
									init: function (player) {//初始化(好习惯)，获得这个技能时执行的内容
										player.storage.yanhuA_2 = 3;//初始为3个标记
										player.syncStorage("yanhuA_2");//同步标记(每当标记变动都要写这句)
										player.markSkill("yanhuA_2");
									},
									trigger: {
										global: "phaseBegin",
									},
									filter: function (event, player) {
										return player.hasSkill("yanhuA") && player.isIn();
									},
									content: function () {
										var num = player.countMark("yanhuA_2");
										if (num != 3)
											player.addMark("yanhuA_2", 3 - num);
									},
									onremove: true,
									sub: true,
									"_priority": 7,
								},
							},
							ai: {
								threaten: 0.7,
								nodamage: true,
								effect: {
									target: function (card, player, target) {//player:来源 target:你
										if (player.hasSkillTag("jueqing", false, target)) return [1, -2];
										if (get.tag(card, 'damage') && target.hasMark("yanhuA_2") && target.inRange(player)) return 0;
									},
								},
							},
						},
						molinA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							group: "molinB",
							forced: true,
							trigger: {
								player: "phaseZhunbeiBegin",
							},
							content: function () {
								player.addTempSkill('molinC');
								player.draw(2);
							},
							"_priority": 0,
						},
						molinB: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							forced: true,
							trigger: {
								player: "phaseJieshuEnd",
							},
							filter: function (event, player) {
								return player.getHistory('sourceDamage').length < 1 && player.hasSkill("molinC");
							},
							content: function () {
								player.damage('nosource', 'nocard');
							},
							"_priority": 0,
						},
						molinC: {
							mod: {
								maxHandcard: function (player, num) {
									return num + 2;
								},
							},
							"_priority": 0,
						},
						heisheA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							enable: "phaseUse",
							usable: 1,
							filter: function (event, player) {
								return player.hp == 1;
							},
							content: function () {
								player.draw(2);
								player.addTempSkill('heisheB', player.phaseUseAfter);
								player.addTempSkill('heisheC');
							},
							ai: {
								order: 1,
								result: {
									player: function (player, target) {
										if (player.countCards('hs', 'tao') == 0 && player.countCards('hs', 'jiu') == 0 && player.getHistory('sourceDamage').length < 1) return 3;
										if (player.countCards('h', 'sha') > 2 || (_status._aozhan == true && (player.countCards('h', 'sha') + player.countCards('h', 'tao')) > 2)) return 1;
										return false;
									},
								},
							},
							"_priority": 0,
						},
						heisheB: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							mark: true,
							marktext: "蛇",
							locked: true,
							forced: true,
							unique: true,
							juexingji: true,
							skillAnimation: true,
							animationStr: "魔鳞痊愈",
							animationColor: "wood",
							intro: {
								name: "黑蛇",
								content: "本阶段使用【杀】无次数限制。",
							},
							trigger: {
								player: "phaseUseAfter",
							},
							filter: function (event, player) {
								return player.hasSkill('heisheC');
							},
							content: function () {
								player.recover();
								player.awakenSkill('molinA');
								player.awakenSkill('molinB');
								player.awakenSkill('molinC');
								player.awakenSkill('heisheA');
								player.awakenSkill('heisheB');
								player.awakenSkill('heisheC');
								player.addSkill('jianxiA');
							},
							mod: {
								cardUsable: function (card, player) {
									if (card.name == 'sha') return Infinity;
								},
							},
							"_priority": 0,
						},
						heisheC: {
							forced: true,
							trigger: {
								source: "dieAfter",
							},
							content: function () {
								player.removeSkill('heisheC');
							},
							"_priority": 0,
						},
						jianxiA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							logTarget: "target",
							trigger: {
								player: "useCardToPlayered",
							},
							filter: function (event, player) {
								if (event.targets.length > 1) return false;
								if (event.card.name != 'sha') return false;
								var length = event.target.countCards('h');
								return length > player.hp;
							},
							content: function () {
								trigger.target.link(true);
								trigger.getParent().directHit.push(trigger.target);
							},
							check: function (event, player) {
								return get.attitude(player, event.target) <= 0;
							},
							"_priority": 0,
						},
						xunlinA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							logTarget: "target",
							trigger: {
								player: "useCardToPlayered",
							},
							filter: function (event, player) {
								if (event.targets.length > 1) return false;
								if (event.card.name != 'sha') return false;
								var length = event.target.countCards('h');
								return length <= player.hp;
							},
							content: function () {
								trigger.target.link(true);
								trigger.getParent().directHit.push(trigger.target);
							},
							check: function (event, player) {
								return get.attitude(player, event.target) <= 0;
							},
							"_priority": 0,
						},
						liaoyangA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							popup: false,
							trigger: {
								global: "phaseUseEnd",
							},
							filter: function (event, player) {
								if (player.countCards('h') == 0) return false;
								if (event.player.hp >= event.player.maxHp) return false;
								return event.player.hp == 1;
							},
							content: function () {
								'step 0'
								player.chooseCard('h', '选择一张红色手牌').ai = function (card) {
									return (get.color(card) == 'red');
								};
								'step 1'
								if (result.bool && result.cards.length && get.color(result.cards[0]) == 'red') {
									player.discard(result.cards);
									player.logSkill('liaoyangA', trigger.player);
									player.line(trigger.player, 'green');
									trigger.player.recover(player);
								}
							},
							check: function (event, player) {
								return get.attitude(player, event.player) > 0;
							},
							"_priority": 0,
						},
						zhuichaA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							forced: true,
							trigger: {
								player: "phaseUseBegin",
							},
							filter: function (event, player) {
								return !player.isEmpty(2);
							},
							content: function () {
								player.gain(player.getEquip(2), 'gain2');
							},
							mod: {
								globalFrom: function (from, to, distance) {
									if (from.isEmpty(2)) return distance - 1;
								},
							},
							"_priority": 0,
						},
						shenpanA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							popup: false,
							logTarget: "target",
							trigger: {
								player: "useCardToPlayered",
							},
							filter: function (event, player) {
								if (event.targets.length > 1) return false;
								if (event.card.name != 'sha') return false;
								if (get.distance(player, event.target) > 1) return false;
								return player.countCards('h') > 0;
							},
							content: function () {
								"step 0"
								player.chooseCard('h', '选择一张黑色手牌').ai = function (card) {
									return (get.color(card) == 'black');
								};
								"step 1"
								if (result.bool && result.cards.length && get.color(result.cards[0]) == 'black') {
									player.logSkill('shenpanA', trigger.target);
									player.discard(result.cards);
									trigger.target.damage('thunder');
								}
							},
							check: function (event, player) {
								return get.attitude(player, event.target) <= 0;
							},
							"_priority": 0,
						},
						shenpanB: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							"_priority": 0,
						},
						buxunA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							enable: "phaseUse",
							usable: 1,
							filterTarget: function (card, player, target) {
								return target != player;
							},
							content: function () {
								"step 0"
								var cards = get.cards(4);
								player.showCards(cards);
								game.cardsGotoOrdering(cards);
								var next = target.chooseToMove('捕蕈', true);
								next.set('list', [
									['选择其中两张花色相同的牌', cards],
									['给对方'],
									['给自己'],
								]);
								next.set('filterMove', function (from, to, moved) {
									if (to == 1 && moved[1].length >= 1) return false;
									if (to == 2 && moved[2].length >= 1) return false;
									return true;
								});
								next.set('filterOk', function (moved) {
									return moved[1].length == moved[2].length;
								});
								next.set('processAI', function (list) {
									var cards = list[0][1].slice(0);
									if (get.suit(cards[0]) == get.suit(cards[1])) {
										return [cards, cards[0], cards[1]];
									} else if (get.suit(cards[0]) == get.suit(cards[2])) {
										return [cards, cards[0], cards[2]];
									} else if (get.suit(cards[0]) == get.suit(cards[3])) {
										return [cards, cards[0], cards[3]];
									} else if (get.suit(cards[1]) == get.suit(cards[2])) {
										return [cards, cards[1], cards[2]];
									} else if (get.suit(cards[1]) == get.suit(cards[3])) {
										return [cards, cards[1], cards[3]];
									}
									return [cards, cards[2], cards[3]];
								})
								'step 1'
								if (result.moved[1] && result.moved[2] && (get.suit(result.moved[1]) == get.suit(result.moved[2]))) {
									player.logSkill('buxunB');
									player.gain(result.moved[1], 'gain2');
									target.gain(result.moved[2], 'gain2');
									game.updateRoundNumber();
									game.delayx();
								} else {
									player.logSkill('buxunC');
									player.addTempSkill('ygzq_dongjie');
									target.addTempSkill('ygzq_dongjie');
									game.updateRoundNumber();
									game.delayx();
								}
							},
							ai: {
								order: 10,
								result: {
									target: 1.1,
								},
							},
							"_priority": 0,
						},
						buxunB: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							"_priority": 0,
						},
						buxunC: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							"_priority": 0,
						},
						anmianA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							trigger: {
								player: "phaseDiscardBefore",
							},
							filter: function (event, player) {
								return player.hasSkill("ygzq_dongjie");
							},
							content: function () {
								trigger.cancel();
							},
							"_priority": 0,
						},
						mengyouA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							group: ["mengyouB"],
							direct: true,
							trigger: {
								player: "phaseJieshuBegin",
							},
							filter: function (event, player) {
								return player.countCards('h') > 0;
							},
							content: function () {
								'step 0'
								player.chooseCard(get.prompt('mengyouA'), '将任意张手牌扣置于武将牌上称为“梦”', 'h', [1, player.countCards('h')]).set('ai', function (card) {
									return card.name != 'shan' && card.name != 'tao' && card.name != 'wuxie' && card.name != 'jiu';
								});
								'step 1'
								if (result.bool) {
									if (!player.hasSkill("ygzq_dongjie")) player.logSkill('mengyouA');
									player.addToExpansion(result.cards, 'log', 'draw', player).gaintag.add('mengyouA');
									player.draw(result.cards.length);
								}
							},
							intro: {
								name: "梦",
								mark: function (dialog, content, player) {
									var content = player.getExpansions('mengyouA');
									if (content && content.length) {
										if (player == game.me || player.isUnderControl()) {
											dialog.addAuto(content);
										}
										else {
											return '共有' + get.cnNumber(content.length) + '张梦';
										}
									}
								},
							},
							"_priority": 0,
						},
						mengyouB: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							forced: true,
							trigger: {
								player: "phaseZhunbeiBegin",
							},
							filter: function (event, player) {
								return player.getExpansions('mengyouA').length > 0;
							},
							content: function () {
								'step 0'
								player.chooseToDiscard(player.getExpansions('mengyouA').length, true, 'h');
								'step 1'
								var cards = player.getExpansions('mengyouA');
								if (cards.length) player.gain(cards, 'draw');
							},
							"_priority": 0,
						},
						dengshenA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							forced: true,
							unique: true,
							juexingji: true,
							skillAnimation: true,
							animationStr: "我已登神",
							animationColor: "thunder",
							trigger: {
								player: "phaseZhunbeiBegin",
							},
							filter: function (event, player) {
								return !player.hasSkill('shenxinA') && player.countCards('e') > 1;
							},
							content: function () {
								player.gainMaxHp();
								player.recover();
								player.addSkill('shenxinA');
								player.addSkill('shenxinB');
								player.awakenSkill('dengshenA');
							},
							"_priority": 0,
						},
						shenxinA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							forced: true,
							unique: true,
							dutySkill: true,
							juexingji: true,
							trigger: {
								player: "damageEnd",
							},
							filter: function (event, player) {
								return event.nature == 'thunder' && event.num > 1;
							},
							content: function () {
								player.popup('使命失败');
								player.loseMaxHp();
								player.awakenSkill('shenxinA');
								player.awakenSkill('shenxinB');
							},
							"_priority": 0,
						},
						shenxinB: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							popup: false,
							forced: true,
							trigger: {
								player: "phaseDrawBegin",
							},
							content: function () {
								if (player.countCards('e') > 2) player.logSkill('shenxinB');
								else player.logSkill('shenxinC');
								trigger.num = trigger.num + player.countCards('e');
							},
							mod: {
								maxHandcardBase: function (player, num) {
									return num - player.countCards('e');
								},
							},
							"_priority": 0,
						},
						shenxinC: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							popup: false,
							unique: true,
							"_priority": 0,
						},
						weishenA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							unique: true,
							global: "weishenB",
							zhuSkill: true,
							"_priority": 0,
						},
						weishenB: {
							enable: "phaseUse",
							position: "h",
							discard: false,
							lose: false,
							delay: false,
							line: true,
							direct: true,
							clearTime: true,
							prepare: function (cards, player, targets) {
								targets[0].logSkill('weishenA');
							},
							prompt: function () {
								var player = _status.event.player;
								var list = game.filterPlayer(function (target) {
									return target != player && target.hasZhuSkill('weishenA', player);
								});
								var str = '将一张装备牌置入' + get.translation(list);
								if (list.length > 1) str += '中的一人的装备区';
								else str += '的装备区';
								return str;
							},
							filter: function (event, player) {
								if (player.group != 'xumi') return false;
								if (!player.countCards('h', { type: 'equip' })) return 0;
								return game.hasPlayer(function (target) {
									return target != player && target.hasZhuSkill('weishenA', player) && !target.hasSkill('weishenC');
								});
							},
							filterCard: function (card) {
								return get.type(card) == "equip";
							},
							log: false,
							visible: true,
							filterTarget: function (card, player, target) {
								if (target.isMin()) return false;
								var type = get.subtype(card);
								return target != player && target.isEmpty(type) && target.hasZhuSkill('weishenA', player) && !target.hasSkill('weishenC');
							},
							content: function () {
								target.equip(cards[0]);
								target.addTempSkill('weishenC', 'phaseUseEnd');
							},
							check: function (card) {
								var player = _status.currentPhase;
								if (player.countCards('he', { subtype: get.subtype(card) }) > 1) {
									return 11 - get.equipValue(card);
								}
								return 6 - get.value(card);
							},
							ai: {
								basic: {
									order: 10,
								},
								result: {
									target: function (player, target) {
										var card = ui.selected.cards[0];
										if (card) return get.effect(target, card, target, target);
										return 0;
									},
								},
							},
							"_priority": 0,
						},
						weishenC: {
							"_priority": 0,
						},
						kuaidiA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							enable: "phaseUse",
							usable: 1,
							filterTarget: function (card, player, target) {
								if (target == player) return false;
								return true;
							},
							content: function () {
								'step 0'
								if (!player.storage.kuaidiA) player.storage.kuaidiA = [];
								player.storage.kuaidiA.push(player.previousSeat);
								player.addTempSkill('kuaidiB');
								player.addTempSkill('qianshouA', player.phaseUseAfter);
								'step 1'
								game.swapSeat(player, player.nextSeat);
								'step 2'
								if (player.nextSeat != target) event.goto(1);
								else event.finish();
							},
							ai: {
								threaten: 1,
								result: {
									target: function (player, target) {
										if (target.countCards('h') <= 1) return 3.5;
										return 2;
									},
								},
								order: 10,
								expose: 0.4,
							},
							"_priority": 0,
						},
						kuaidiB: {
							popup: false,
							unique: true,
							onremove: true,
							mark: true,
							marktext: "递",
							locked: true,
							forced: true,
							forceDie: true,
							intro: {
								name: "快递",
								content: "出牌阶段结束时，你返回本阶段使用此技能前的座次。",
							},
							trigger: {
								player: ["phaseUseEnd", "die"],
							},
							content: function () {
								'step 0'
								game.swapSeat(player, player.previousSeat);
								'step 1'
								if (player.previousSeat != player.storage.kuaidiA[0]) event.goto(0);
								'step 2'
								if (player.storage.kuaidiA) player.storage.kuaidiA = [];
							},
							"_priority": 0,
						},
						maobuA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							popup: false,
							trigger: {
								player: "damageEnd",
							},
							filter: function (event, player) {
								if (!event.source) return false;
								if (!event.source.isAlive()) return false;
								if (!event.source == player) return false;
								return _status.currentPhase != player;
							},
							content: function () {
								'step 0'
								trigger.source.link(true);
								if (trigger.source.countCards('e') > 0)
									player.gainPlayerCard(trigger.source, 'e');
								'step 1'
								if (!player.storage.maobuA) player.storage.maobuA = [];
								player.storage.maobuA.push(player.previousSeat);
								player.addTempSkill('maobuB');
								trigger.source.addTempSkill('maobuC');
								player.logSkill('maobuA');
								'step 2'
								var target = trigger.source;
								var left = 0, right = 0, left2 = player, right2 = player;
								while (left2 != target) {
									left2 = left2.getPrevious();
									left++;
								}
								while (right2 != target) {
									right2 = right2.getNext();
									right++;
								}
								if (left == right) event.finish();
								if (left < right && (right - left == 1)) event.finish();
								'step 3'
								game.swapSeat(player, player.nextSeat);
								event.goto(2);
							},
							check: function (event, player) {
								return get.attitude(player, event.player) <= 0;
								//大于0为选择队友发动，若<=0是对敌方发动
							},
							ai: {
								"maixie_defend": true,
								effect: {
									target: function (card, player, target) {
										if (player.countCards('e') > 1 && get.tag(card, 'damage')) {
											if (player.hasSkillTag('jueqing', false, target)) return [1, -1.5];
											if (get.attitude(target, player) < 0) return [1, 1];
										}
									},
								},
							},
							"_priority": 0,
						},
						maobuB: {
							popup: false,
							unique: true,
							onremove: true,
							mark: true,
							marktext: "步",
							locked: true,
							forced: true,
							forceDie: true,
							intro: {
								name: "猫步",
								content: "结束阶段，你返回本回合使用此技能前的座次。",
							},
							trigger: {
								global: ["phaseJieshuEnd", "die"],
							},
							content: function () {
								'step 0'
								if (trigger.player != player && !trigger.player.hasSkill("maobuC")) event.finish();
								'step 1'
								game.swapSeat(player, player.previousSeat);
								'step 2'
								if (player.previousSeat != player.storage.maobuA[0]) event.goto(1);
								'step 3'
								if (player.storage.maobuA) player.storage.maobuA = [];
							},
							"_priority": 0,
						},
						maobuC: {
							"_priority": 0,
						},
						qianshouA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							enable: "phaseUse",
							filterCard: true,
							selectCard: [1, Infinity],
							discard: false,
							lose: false,
							delay: 0,
							filter: function (event, player) {
								if (player.countCards('h') == 0) return false;
								return true;
							},
							filterTarget: function (card, player, target) {
								return player != target && (target == player.next || target == player.previous);
							},
							check: function (card) {
								if (ui.selected.cards.length > 1) return 0;
								if (ui.selected.cards.length && ui.selected.cards[0].name == 'du') return 0;
								if (!ui.selected.cards.length && card.name == 'du') return 20;
								var player = get.owner(card);
								var num = 0;
								var evt2 = _status.event.getParent();
								var num = 0;
								player.getHistory('lose', function (evt) {
									if (evt.getParent().skill == 'qianshouA' && evt.getParent(3) == evt2) num += evt.cards.length;
								});
								if (player.hp == player.maxHp || num > 1 || player.countCards('h') <= 1) {
									if (ui.selected.cards.length) {
										return -1;
									}
									var players = game.filterPlayer();
									for (var i = 0; i < players.length; i++) {
										if (players[i].hasSkill('haoshi') &&
											!players[i].isTurnedOver() &&
											!players[i].hasJudge('lebu') &&
											get.attitude(player, players[i]) >= 3 &&
											get.attitude(players[i], player) >= 3) {
											return 11 - get.value(card);
										}
									}
									if (player.countCards('h') > player.hp) return 10 - get.value(card);
									if (player.countCards('h') > 2) return 6 - get.value(card);
									return -1;
								}
								return 10 - get.value(card);
							},
							content: function () {
								target.gain(cards, player, 'giveAuto');
								if (!target.hasSkill("qianshouB")) {
									target.addTempSkill('qianshouB', player.phaseUseAfter);
									player.draw();
								}
							},
							ai: {
								order: function (skill, player) {
									if (player.storage.qianshouA < 2 && player.countCards('h') > 1) {
										return 10;
									}
									return 1;
								},
								result: {
									target: function (player, target) {
										if (target.hasSkillTag('nogain')) return 0;
										if (ui.selected.cards.length && ui.selected.cards[0].name == 'du') {
											if (target.hasSkillTag('nodu')) return 0;
											return -10;
										}
										if (target.hasJudge('lebu')) return 0;
										var nh = target.countCards('h');
										var np = player.countCards('h');
										if (player.storage.qianshouA < 0 || player.countCards('h') <= 1) {
											if (nh >= np - 1 && np <= player.hp && !target.hasSkill('haoshi')) return 0;
										}
										return Math.max(1, 5 - nh);
									},
								},
								effect: {
									target: function (card, player, target) {
										if (player == target && get.type(card) == 'equip') {
											if (player.countCards('e', { subtype: get.subtype(card) })) {
												var players = game.filterPlayer();
												for (var i = 0; i < players.length; i++) {
													if (players[i] != player && get.attitude(player, players[i]) > 0) {
														return 0;
													}
												}
											}
										}
									},
								},
								threaten: 0.8,
							},
							"_priority": 0,
						},
						qianshouB: {
							forceDie: true,
							popup: false,
							forced: true,
							unique: true,
							onremove: true,
							mark: true,
							marktext: "收",
							locked: true,
							intro: {
								name: "签收",
								content: "该角色本阶段已签收。",
							},
							trigger: {
								global: "die",
							},
							filter: function (event, player) {
								return event.player == player || event.player.hasSkill("qianshouA");
							},
							content: function () {
								player.removeSkill('qianshouB');
							},
							"_priority": 0,
						},
						wuxieA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							group: "wuxieB",
							enable: "phaseUse",
							usable: 1,
							position: "h",
							selectCard: 1,
							discard: false,
							lose: false,
							delay: 0,
							filterCard: true,
							filterTarget: function (card, player, target) {
								return player != target;
							},
							filter: function (event, player) {
								return player.countCards('h') > 0;
							},
							content: function () {
								player.showCards(cards);
								target.gain(cards, 'gain2');
								if (cards[0].name == 'tao') player.draw(2);
								else player.draw();
							},
							ai: {
								threaten: 1,
								result: {
									target: function (player, target) {
										if (ui.selected.cards.length && ui.selected.cards[0].name == 'tao') {
											return 5;
										}
										if (target.countCards('h') <= 1) return 3.5; //如果对敌方使用技能则返回负值(return -3.5)
										return 2;
									},
								},
								order: 8,
								expose: 0.4,
							},
							"_priority": 0,
						},
						wuxieB: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							frequent: true,
							trigger: {
								player: "useCard",
							},
							filter: function (event, player) {
								if (event.card.name == 'tao') return true;
							},
							content: function () {
								player.draw();
							},
							"_priority": 0,
						},
						yueguiA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							direct: true,
							trigger: {
								player: "phaseDiscardBegin",
							},
							filter: function (event, player) {
								return player.countCards("h") > player.hp && (game.countPlayer(function (current) {
									return current.hp < current.maxHp;
								}));
							},
							content: function () {
								'step 0'
								player.chooseCardTarget({
									prompt: '请选择【月桂】的牌和目标',
									prompt2: '弃置两张手牌，令一名已受伤的角色恢复1点体力并解除横置',
									position: "h",
									filterCard: true,
									selectCard: 2,
									filterTarget: function (card, player, target) {
										return target.hp < target.maxHp;
									},
									ai1: function (card) {
										return 6 - ai.get.value(card);
									},
									ai2: function (target) {
										return get.attitude(player, target);
									},
								});
								'step 1'
								if (result.bool && result.cards.length == 2) {
									var target = result.targets[0];
									player.logSkill('yueguiA', target);
									player.line(target, 'green');
									player.discard(result.cards);
									target.recover(player);
									target.link(false);
								}
								else event.finish();
							},
							"_priority": 0,
						},
						baiyuA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							unique: true,
							mark: true,
							skillAnimation: true,
							animationStr: "白玉萝卜",
							animationColor: "wood",
							limited: true,
							enable: "phaseUse",
							init: function (player) {
								player.storage.baiyuA = false;
							},
							filter: function (event, player) {
								return (game.countPlayer(function (current) {
									return current.hp == 1;
								}));
							},
							content: function () {
								'step 0'
								player.awakenSkill('baiyuA');
								player.storage.baiyuA = true;
								'step 1'
								player.draw(3);
								'step 2'
								player.choosePlayerCard(player, 'h', [0, 3], '将至多三张手牌置于武将牌上称为“萝”').set('ai', function () {
									return 1;
								});
								'step 3'
								if (result.bool && result.links.length) {
									player.addToExpansion(result.cards, 'gain2').gaintag.add('luoboA');
									player.addSkill('luoboA');
								}
								'step 4'
								player.storage.luoboA = player.getExpansions('luoboA').length;
								player.syncStorage('luoboA');
								if (player.getExpansions('luoboA').length == 0)
									player.unmarkSkill('luoboA');
							},
							marktext: "玉",
							intro: {
								content: "limited",
								mark: function (dialog, content, player) {
									return '白玉萝卜';
								},
							},
							ai: {
								order: 10,
								result: {
									player: 1,
								},
							},
							"_priority": 0,
						},
						luoboA: {
							enable: "chooseToUse",
							filter: function (event, player) {
								return event.type == 'dying' && event.dying && event.dying.hp <= 0 && player.getExpansions('luoboA').length > 0;
							},
							filterTarget: function (card, player, target) {
								return target == _status.event.dying;
							},
							direct: true,
							clearTime: true,
							delay: false,
							selectTarget: -1,
							content: function () {
								"step 0"
								player.chooseCardButton(get.translation('luoboA'), player.getExpansions('luoboA'));
								"step 1"
								if (result.bool) {
									player.logSkill('luoboA', target);
									player.loseToDiscardpile(result.links);
									event.type = 'dying';
									player.useCard({ name: 'tao', isCard: true }, target);
								}
								"step 2"
								player.storage.luoboA = player.getExpansions('luoboA').length;
								if (player.getExpansions('luoboA').length == 0)
									player.unmarkSkill('luoboA');
								if (player.getExpansions('luoboA').length < 1) player.removeSkill('luoboA');
							},
							marktext: "萝",
							intro: {
								name: "萝",
								content: "expansion",
							},
							ai: {
								order: 6,
								skillTagFilter: function (player) {
									return player.getExpansions('luoboA').length > 0;
								},
								save: true,
								result: {
									target: 3,
								},
								threaten: 1.6,
							},
							"_priority": 0,
						},
						zhiyanA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							enable: "phaseUse",
							usable: 1,
							selectTarget: 1,
							filter: function (event, player) {
								return (game.countPlayer(function (current) {
									return current.countCards('e') > 0;
								}));
							},
							filterTarget: function (card, player, target) {
								return target.countCards('e') > 0;
							},
							content: function () {
								'step 0'
								player.discardPlayerCard(target, 'e', true).ai = function (card) {
									return (get.subtype(card) == 'equip3' || get.subtype(card) == 'equip4');
								};
								'step 1'
								if (result.bool) {
									target.link(false);
									target.draw(2);
									if (get.subtype(result.cards[0]) == 'equip3' || get.subtype(result.cards[0]) == 'equip4') player.draw();
								}
							},
							ai: {
								order: 1,
								result: {
									target: 1,
								},
							},
							"_priority": 0,
						},
						lianzhenB: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							trigger: {
								player: "damageBegin4",
							},
							content: function () {
								trigger.cancel();
								trigger.player.loseHp();
								player.link(false);
								player.turnOver(false);
							},
							check: function (event, player) {
								if (game.countPlayer(function (current) {
									return current.isLinked();
								}) == 1 && event.player.isLinked() && player.hp > 1 && event.num == 1 && (event.nature == 'fire' || event.nature == 'thunder')) return false;
								if (game.countPlayer(function (current) {
									return current.isLinked() && get.attitude(player, current) < 0;
								}) >= game.countPlayer(function (current) {
									return current.isLinked() && get.attitude(player, current) > 0;
								}) && event.player.isLinked() && event.notLink() && (event.nature == 'fire' || event.nature == 'thunder')) return false;
								if (player.hp > 1 && event.num == 1 && event.player.isLinked() && !event.notLink() && (event.nature == 'fire' || event.nature == 'thunder')) return false;
								return true;
							},
							"_priority": 0,
						},
						jiedaiA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							enable: "phaseUse",
							usable: 1,
							selectTarget: 1,
							filter: function (event, player) {
								return (game.countPlayer(function (current) {
									return current.countCards('e') > 0 && current != player;
								}));
							},
							filterTarget: function (card, player, target) {
								return target.countCards('e') > 0 && target != player;
							},
							content: function () {
								player.gainPlayerCard(target, 'e');
								player.addTempSkill('jiedaiB');
								target.addTempSkill('jiedaiC');
							},
							ai: {
								result: {
									target: function (player, target) {
										return -1;
									},
								},
								order: 4,
							},
							"_priority": 0,
						},
						jiedaiB: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							popup: false,
							forced: true,
							trigger: {
								player: "phaseUseAfter",
							},
							filter: function (event, player) {
								return (game.countPlayer(function (current) {
									return current.hasSkill('jiedaiC');
								}));
							},
							content: function () {
								var list = game.filterPlayer(function (current) {
									return current.hasSkill('jiedaiC');
								});
								if (player.countCards('e') > 0) list[0].gainPlayerCard(player, 'e', true);
								else { player.damage(list[0]); player.logSkill('jiedaiB'); }
								player.removeSkill('jiedaiB');
								list[0].removeSkill('jiedaiC');
							},
							"_priority": 0,
						},
						jiedaiC: {
							forceDie: true,
							popup: false,
							forced: true,
							unique: true,
							onremove: true,
							mark: true,
							marktext: "借",
							locked: true,
							intro: {
								name: "借贷",
								content: "该角色是债主。",
							},
							trigger: {
								global: "die",
							},
							filter: function (event, player) {
								return event.player == player || event.player.hasSkill("jiedaiA");
							},
							content: function () {
								player.removeSkill('jiedaiC');
							},
							"_priority": 0,
						},
						lingganA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							direct: true,
							trigger: {
								player: "loseAfter",
								global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
							},
							filter: function (event, player) {
								var evt = event.getl(player);
								return evt && evt.player == player && evt.es && evt.es.length > 0;
							},
							content: function () {
								'step 0'
								player.chooseTarget(get.prompt('lingganA'), '你可以令一名其他角色横置，若其已横置则改为令其解除横置并对其造成1点伤害', function (card, player, target) {
									return player != target
								}).set('ai', function (target) {
									return -get.attitude(player, target);   //这一行是AI
									//（上一行）若要选择队友则返回正值 return get.attitude(player,target);            
								});
								'step 1'
								if (result.bool) {
									player.logSkill('lingganA');
									var target = result.targets[0];
									if (target.isLinked()) { target.link(false); target.damage('nocard'); }
									else target.link(true);
									player.line(target, 'green');
								}
								else event.finish();
							},
							ai: {
								noe: true,
								reverseEquip: true,
								effect: {
									target: function (card, player, target, current) {
										if (get.type(card) == 'equip' && !get.cardtag(card, 'gifts')) return [1, 3];
									},
								},
							},
							"_priority": 0,
						},
						pojuA: {
							group: "pojuB",
							audio: "ext:原梗Enhanced/audio/skill:2",
							enable: "chooseToUse",
							filterCard: true,
							position: "h",
							viewAs: {
								name: "guohe",
							},
							viewAsFilter: function (player) {
								if (!player.countCards('h') || !player.countMark('pojuC') || player.getStat().skill.pojuA >= player.countMark('pojuC')) return false;
							},
							prompt: "将一张手牌当【过河拆桥】使用",
							precontent: function () {
							},
							check: function (card) { return 4 - get.value(card) },
							ai: {
								basic: {
									order: 9,
									useful: 5,
									value: 5,
								},
								yingbian: function (card, player, targets, viewer) {
									if (get.attitude(viewer, player) <= 0) return 0;
									if (game.hasPlayer(function (current) {
										return !targets.contains(current) && lib.filter.targetEnabled2(card, player, current) && get.effect(current, card, player, player) > 0;
									})) return 6;
									return 0;
								},
								result: {
									target: function (player, target) {
										var att = get.attitude(player, target);
										var nh = target.countCards('h');
										if (att > 0) {
											if (target.countCards('j', function (card) {
												var cardj = card.viewAs ? { name: card.viewAs } : card;
												return get.effect(target, cardj, target, player) < 0;
											}) > 0) return 3;
											if (target.getEquip('baiyin') && target.isDamaged() &&
												get.recoverEffect(target, player, player) > 0) {
												if (target.hp == 1 && !target.hujia) return 1.6;
											}
											if (target.countCards('e', function (card) {
												if (get.position(card) == 'e') return get.value(card, target) < 0;
											}) > 0) return 1;
										}
										var es = target.getCards('e');
										var noe = (es.length == 0 || target.hasSkillTag('noe'));
										var noe2 = (es.filter(function (esx) {
											return get.value(esx, target) > 0;
										}).length == 0);
										var noh = (nh == 0 || target.hasSkillTag('noh'));
										if (noh && (noe || noe2)) return 0;
										if (att <= 0 && !target.countCards('he')) return 1.5;
										return -1.5;
									},
								},
								tag: {
									loseCard: 1,
									discard: 1,
								},
								wuxie: (target, card, player, viewer, status) => {
									if (status * get.attitude(viewer, player) > 0 && !player.isMad() || target.hp > 2 && !target.hasCard(i => {
										return get.value(i, target) > 3 + Math.min(5, target.hp);
									}, 'e') && target.countCards('h') * _status.event.getRand('guohe_wuxie') > 1.57) return 0;
								},
							},
							"_priority": 0,
						},
						pojuB: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							enable: "phaseUse",
							usable: 1,
							filter: function (event, player) {
								return player == _status.currentPhase;
							},
							content: function () {
								var num = [1, 2, 3, 4, 5, 6].randomGet();
								if (get.isLuckyStar(player)) num = 6;
								game.log(player, '投掷了一枚骰子，点数为' + get.cnNumber(num));
								player.addTempSkill('pojuC', player.phaseUseAfter);
								player.addMark('pojuC', num, false);
							},
							ai: {
								order: 10,
								result: {
									player: 1,
								},
							},
							"_priority": 0,
						},
						pojuC: {
							onremove: true,
							intro: {
								content: "点数为#",
							},
							"_priority": 0,
						},
						changkaoA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							trigger: {
								global: "loseAfter",
							},
							filter: function (event, player) {
								if (event.type != 'discard') return false;
								if (event.player == player) return false;
								if (_status.currentPhase != player) return false;
								if (player.hasSkill('changkaoB')) return false;
								for (var i = 0; i < event.cards2.length; i++) {
									if (get.position(event.cards2[i], true) == 'd') {
										return true;
									}
								}
								return false;
							},
							direct: true,
							content: function () {
								"step 0"
								if (trigger.delay == false) game.delay();
								"step 1"
								var cards = [];
								for (var i = 0; i < trigger.cards2.length; i++) {
									if (get.position(trigger.cards2[i], true) == 'd') {
										cards.push(trigger.cards2[i]);
									}
								}
								if (cards.length) {
									player.chooseButton(['长考：选择要获得的牌', cards], [1, cards.length]).set('ai', function (button) {
										return get.value(button.link, _status.event.player, 'raw');
									});
								}
								"step 2"
								if (result.bool) {
									player.logSkill(event.name);
									player.gain(result.links, 'gain2', 'log');
									player.addTempSkill('changkaoB');
								}
							},
							"_priority": 0,
						},
						changkaoB: {
							popup: false,
							unique: true,
							"_priority": 0,
						},
						lixiangA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							enable: "phaseUse",
							usable: 1,
							content: function () {
								if (player.group == 'daoqi') {
									player.changeGroup('liyue');
								} else player.changeGroup('daoqi');
							},
							ai: {
								order: 4,
								result: {
									player: 1,
								},
							},
							"_priority": 0,
						},
						luanlanA: {
							audio: "ext:原梗Enhanced/audio/skill:3",
							forced: true,
							charlotte: true,
							logTarget: "player",
							trigger: {
								player: "damageBefore",
							},
							filter: function (event, player) {
								if (event.hasNature()) return true;
							},
							content: function () {
								trigger.cancel();
							},
							group: "luanlanA_link",
							subSkill: {
								link: {
									audio: "luanlanA",
									forced: true,
									charlotte: true,
									logTarget: (event, player) => game.filterPlayer((current) => !current.isLinked()),
									trigger: {
										player: ["enterGame", "phaseBegin"],
										global: "phaseBefore",
									},
									filter: function (event, player, name) {
										// if (event.name == 'phase') return event.player.isLinked();
										// return (event.name != 'phase' || game.phaseNumber == 0) && game.hasPlayer((current) => !current.isLinked());	
										//这里传入的name,就是event.triggername,直接等价于具体时机名
										return (name != 'phaseBefore' || game.phaseNumber == 0) && game.hasPlayer((current) => !current.isLinked())
									},
									content: function () {
										game.countPlayer(function (current) {
											if (!current.isLinked()) current.addLink();
											if (current != player && !current.hasSkill("luanlanA_debuff")) current.addSkill("luanlanA_debuff");
										});
									},
									sub: true,
								},
								debuff: {
									charlotte: true,
									superCharlotte: true,
									silent: true,
									unique: true,
									forceunique: true,
									mod: {
										cardEnabled2: function (card, player, now) {
											if (get.type(card) == 'basic' && get.tag(card, 'recover') && player.isLinked()) return false;
										},
										maxHandcardFinal: function (player, num) {
											if (player.isLinked()) return 1;
										},
									},
									ai: {
										effect: {//牌的影响
											player: function (card, player, target) {//你使用牌时对你的影响
												if (card.name == "tiesuo") return "zeroplayertarget";
											},
											target: function (card, player, target, current) {
												if (card.name == "tiesuo") return "zeroplayertarget";
											},
										},
									},
									sub: true,
								},
							},
							ai: {
								nofire: true,
								nothunder: true,
								effect: {
									target: function (card, player, target, current) {
										if (card.name == "tiesuo" || get.tag(card, "natureDamage")) return "zeroplayertarget";
									},
									player: function (card, player, target) {//你使用牌时对你的影响
										if (card.name == "tiesuo") return "zeroplayertarget";
									},
								},
							},
						},
						chirenA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							forced: true,
							charlotte: true,
							groupSkill: "liyue",
							trigger: {
								player: ["phaseJudgeBefore", "phaseDiscardBefore"],
							},
							filter: function (event, player) {
								return event.player.isIn() && player.group == "liyue";
							},
							content: function () {
								'step 0'
								let str = ['判定', '弃牌'][lib.skill.chirenA.trigger.player.indexOf(event.triggername)];
								player.chooseBool("是否跳过" + str + "阶段").set('ai', () => _status.event.player.hasValueTarget({ name: "sha", nature: "fengshaA" }, false, false));
								'step 1'
								if (result.bool) {
									trigger.cancel();
									player.chooseUseTarget("请选择风【杀】的目标：", "nodistance")
										.set("card", { name: "sha", nature: "fengshaA" })
										.set("selectTarget", [1, Infinity])
										.set("forced", true)
										.set("addCount", false)
								}
								else event.finish();
							},
							group: "chirenA_1",
							subSkill: {
								1: {
									audio: "chirenA",
									forced: true,
									charlotte: true,
									trigger: {
										global: "phaseAfter",
									},
									filter: function (event, player) {
										return _status.discarded.length > 0 && event.player != player && player.group == "liyue";
									},
									content: function () {
										let list = get.discarded().filter(card => !get.tag(card, "damage"));
										player.gain(list, "gain2");
									},
									sub: true,
								},
							},
							"_priority": 0,
						},
						kongjingA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							usable: 5,
							locked: true,
							frequent: "check",
							check: function (event, player) {
								return get.attitude(player, event.player) < 0;
							},
							groupSkill: "daoqi",
							trigger: {
								target: "useCardToPlayer",
							},
							filter: function (event, player) {
								if (event.player == player || player.group != "daoqi") return false;
								return event.card && (get.tag(event.card, "damage") && get.type(event.card) == "basic" || get.type(event.card) == "trick");
							},
							content: function () {
								"step 0"
								const cardType = get.type(trigger.card, trigger.player);
								const cardSuit = get.suit(trigger.card, trigger.player);
								trigger.player.chooseToGive(player)
									.set('filterCard', (card, player) => cardType == get.type(card, player) && cardSuit == get.suit(card, player))
									.set('prompt', '交给' + get.translation(player) +
										'一张类型为' + get.translation(cardType) + '且花色为' + get.translation(cardSuit) + '的牌，否则此牌失效且令' + get.translation(player) + "获得你一张牌。")
									.set('ai', (card) => 8 - get.value(card))
								game.delay();
								"step 1"
								if (!result.bool) {
									trigger.getParent().cancel();
									player.gainPlayerCard(trigger.player, 1, 'he', true, "visible");
								}
							},
							group: "kongjingA_1",
							subSkill: {
								1: {
									audio: "kongjingA",
									forced: true,
									trigger: {
										global: "phaseEnd",
									},
									filter: function (event, player) {
										let drawNumber = Math.max(player.maxHp, game.countPlayer(current => current.isLinked()));
										if (player.countCards('h') >= drawNumber) return false;
										return player.isIn() && player.group == "daoqi" && player.getHistory('damage').length == 0;
									},
									content: function () {
										let drawNumber = Math.max(player.maxHp, game.countPlayer(current => current.isLinked()));
										player.drawTo(drawNumber);
									},
									mod: {
										targetEnabled: function (card, player, target) {
											if (get.type(card) == "delay" && player != target) return false;
										},
									},
									sub: true,
								},
							},
							ai: {
								threaten: 0.6,
								expose: 0.7,
								effect: {
									target: function (card, player, target) {//你成为牌的目标时对你的影响
										if (get.tag(card, "damage") && get.type(card) == "basic" || get.type(card) == "trick") {
											return 0.1;
										}
									},
								},
							},
						},
						// guyouA: {
						// 	audio: "ext:原梗Enhanced/audio/skill:2",
						// 	trigger: {
						// 		global: "die",
						// 	},
						// 	filter: function (event, player) {
						// 		if (player.group != 'dao') return false;
						// 		if (event.player.group != 'dao') return false;
						// 		if (event.player == player) return false;
						// 		if (event.player.hp > 0) return false;
						// 		return true;
						// 	},
						// 	content: function () {
						// 		player.draw(3);
						// 		player.recover();
						// 	},
						// 	"_priority": 0,
						// },
						// zhimianA: {
						// 	audio: "ext:原梗Enhanced/audio/skill:2",
						// 	popup: false,
						// 	trigger: {
						// 		global: "damageBegin3",
						// 	},
						// 	filter: function (event, player) {
						// 		if (player.group != 'li') return false;
						// 		if (_status.currentPhase == player) return false;
						// 		if (event.player == player) return false;
						// 		if (event.source == player) return false;
						// 		if (player.countCards('hs') == 0) return false;
						// 		return true;
						// 	},
						// 	content: function () {
						// 		'step 0'
						// 		player.chooseCard('hs', '选择一张【杀】').ai = function (card) {
						// 			return (get.name(card) == 'sha');
						// 		};
						// 		'step 1'
						// 		if (result.bool && result.cards.length && get.name(result.cards[0]) == 'sha') {
						// 			player.discard(result.cards);
						// 			player.line(trigger.player, 'green');
						// 			trigger.cancel();
						// 			if (trigger.source && trigger.source.isAlive()) player.useCard({ name: 'sha', nature: 'thunder', isCard: true }, trigger.source, false);
						// 			player.logSkill('zhimianA');
						// 		}
						// 		else {
						// 			event.finish();
						// 		}
						// 	},
						// 	check: function (event, player) {
						// 		return get.attitude(player, event.source) < 0;
						// 		//大于0为选择队友发动，若<=0是对敌方发动
						// 	},
						// 	"_priority": 0,
						// },
						exiA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							enable: "phaseUse",
							usable: 1,
							selectTarget: 1,
							filterTarget: function (card, player, target) {
								return target != player && target.canUse({ name: 'juedou' }, player);
							},
							content: function () {
								target.useCard({ name: 'juedou', isCard: true }, player, false);
							},
							ai: {
								result: {
									target: function (player, target) {
										if (player.countCards('hs', 'sha') > 0 && (player.countCards('h') + player.hp) > target.countCards('h') && !target.hasSkill("shuangmieA")) return -3.5;
										return false;
									},
								},

								order: 8,
							},
							"_priority": 0,
						},
						menghunA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							frequent: true,
							trigger: {
								player: "damageEnd",
							},
							filter: function (event, player) {
								return event.card && event.card.name == 'juedou' && event.notLink();
							},
							content: function () {
								player.draw(2);
							},
							"_priority": 0,
						},
						gongyinA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							popup: false,
							trigger: {
								player: "useCard2",
							},
							filter: function (event, player) {
								if (player.hp <= 0) return false;
								return event.card.name == 'jiu';
							},
							content: function () {
								'step 0'
								player.chooseTarget(1, '你可以令' + get.translation(trigger.card) + '增加一个目标并令其“冻结”', function (card, player, target) {
									return player != target;
								}).set('ai', function (target) {
									return -get.attitude(player, target);   //这一行是AI
									//（上一行）若要选择队友则返回正值 return get.attitude(player,target);            
								});
								'step 1'
								if (result.bool) {
									trigger.targets.push(result.targets[0]);
									result.targets[0].addTempSkill('ygzq_dongjie');
									player.logSkill('gongyinA', result.targets[0]);
									player.line(result.targets[0], 'green');
								}
								else {
									event.finish();
								}
							},
							"_priority": 0,
						},
						qijingA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							forced: true,
							trigger: {
								player: "useCardAfter",
							},
							filter: function (event, player) {
								if (_status.currentPhase != player) return false;
								if (!player.hasSkill("qijingB") && get.type(event.card) == 'basic') return true;
								if (!player.hasSkill("qijingC") && get.type(event.card) == 'trick') return true;
								if (!player.hasSkill("qijingC") && get.type(event.card) == 'delay') return true;
								if (!player.hasSkill("qijingD") && get.type(event.card) == 'equip') return true;
								return false;
							},
							content: function () {
								if (!player.storage.qijingE) {
									player.storage.qijingE = 0;
								}
								if (get.type(trigger.card) == 'basic') { player.addTempSkill('qijingB'); player.storage.qijingE++; }
								if (get.type(trigger.card) == 'trick') { player.addTempSkill('qijingC'); player.storage.qijingE++; }
								if (get.type(trigger.card) == 'delay') { player.addTempSkill('qijingC'); player.storage.qijingE++; }
								if (get.type(trigger.card) == 'equip') { player.addTempSkill('qijingD'); player.storage.qijingE++; }
								player.syncStorage('qijingE');
								player.markSkill('qijingE');
							},
							"_priority": 0,
						},
						qijingB: {
							popup: false,
							unique: true,
							"_priority": 0,
						},
						qijingC: {
							popup: false,
							unique: true,
							"_priority": 0,
						},
						qijingD: {
							popup: false,
							unique: true,
							"_priority": 0,
						},
						qijingE: {
							popup: false,
							unique: true,
							mark: true,
							marktext: "境",
							intro: {
								name: "奇境",
							},
							"_priority": 0,
						},
						tanxunA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							forced: true,
							trigger: {
								player: "phaseJieshuBegin",
							},
							preHidden: true,
							content: function () {
								"step 0"
								if (player.hasSkill("qijingB") && player.hasSkill("qijingC") && player.hasSkill("qijingD"))
									player.turnOver();
								var num = 3;
								var cards = get.cards(num);
								game.cardsGotoOrdering(cards);
								var next = player.chooseToMove();
								next.set('list', [
									['牌堆顶', cards],
								]);
								next.set('prompt', '探寻：点击将牌以任意顺序置于牌堆顶');
								next.processAI = function (list) {
									var cards = list[0][1], player = _status.event.player;
									var top = [];
									var judges = player.getCards('j');
									var stopped = false;
									if (!player.hasWuxie()) {
										for (var i = 0; i < judges.length; i++) {
											var judge = get.judge(judges[i]);
											cards.sort(function (a, b) {
												return judge(b) - judge(a);
											});
											if (judge(cards[0]) < 0) {
												stopped = true; break;
											}
											else {
												top.unshift(cards.shift());
											}
										}
									}
									return [top];
								}
								"step 1"
								var top = result.moved[0];
								top.reverse();
								for (var i = 0; i < top.length; i++) {
									ui.cardPile.insertBefore(top[i], ui.cardPile.firstChild);
								}
								game.updateRoundNumber();
								game.delayx();
								"step 2"
								if (player.hasSkill("qijingB")) {
									player.removeSkill("qijingB");
									player.storage.qijingE--;
									player.syncStorage('qijingE');
									player.markSkill('qijingE');
									player.draw();
									event.goto(0);
								}
								"step 3"
								if (player.hasSkill("qijingC")) {
									player.removeSkill("qijingC");
									player.storage.qijingE--;
									player.syncStorage('qijingE');
									player.markSkill('qijingE');
									player.draw();
									event.goto(0);
								}
								"step 4"
								if (player.hasSkill("qijingD")) {
									player.removeSkill("qijingD");
									player.storage.qijingE--;
									player.syncStorage('qijingE');
									player.markSkill('qijingE');
									player.draw();
									event.goto(0);
								}
								"step 5"
								player.unmarkSkill('qijingE');
							},
							ai: {
								threaten: 1.2,
							},
							"_priority": 0,
						},
						mituA: {
							mod: {
								globalTo: function (from, to, distance) {
									var num = (game.countPlayer() - 1);
									if (to.isTurnedOver()) return distance + num;
								},
							},
							"_priority": 0,
						},
						jianguA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							enable: "phaseUse",
							usable: 1,
							filter: function (event, player) {
								return player.countCards('e');
							},
							content: function () {
								player.gainPlayerCard(player, 'e', true);
							},
							ai: {
								order: 10,
								result: {
									player: 1,
								},
							},
							"_priority": 0,
						},
						hongshengA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							popup: false,
							trigger: {
								player: "useCard2",
							},
							filter: function (trigger, player) {
								if (player.hasSkill('hongshengB')) return false;
								if (_status.currentPhase != player) return false;
								return trigger.targets && get.type(trigger.card) == 'trick' && get.color(trigger.card) == 'red';
							},
							content: function () {
								'step 0'
								player.chooseTarget('你可以令一名其他角色“冻结”', function (card, player, target) {
									return player != target && !target.hasSkill("ygzq_dongjie")
								}).set('ai', function (target) {
									return -get.attitude(player, target);   //这一行是AI
									//（上一行）若要选择队友则返回正值 return get.attitude(player,target);            
								});
								'step 1'
								if (result.bool && result.targets.length) {
									player.logSkill('hongshengA', result.targets[0]);
									player.line(result.targets[0], 'green');
									result.targets[0].addTempSkill('ygzq_dongjie');
									player.addTempSkill('hongshengB');
								} else event.finish();
							},
							"_priority": 0,
						},
						hongshengB: {
							direct: true,
							unique: true,
							onremove: true,
							locked: true,
							trigger: {
								global: "die",
							},
							filter: function (event, player) {
								return true;
							},
							content: function () {
								player.removeSkill('hongshengB');
							},
							"_priority": 0,
						},
						fuhunA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							trigger: {
								global: "damageEnd",
							},
							filter: function (event) {
								if (!event.source) return false;
								if (!event.source.isAlive()) return false;
								return event.player.hasSkill('ygzq_dongjie');
							},
							content: function () {
								trigger.source.draw(2);
							},
							check: function (event, player) {
								return get.attitude(player, event.source) > 0;
								//大于0为选择队友发动，若<=0是对敌方发动
							},
							"_priority": 0,
						},
						huxinA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							trigger: {
								player: "damageBegin1",
							},
							logTarget: "source",
							content: function () {
								"step 0"
								event.card = get.cards()[0];
								player.$throw(event.card);
								game.cardsDiscard(event.card);
								game.log(player, '展示了牌堆顶的', event.card);
								game.delay(2);
								"step 1"
								if (get.type(event.card) == 'trick' || get.type(event.card) == 'delay') {
									trigger.num--;
								} else player.gain(event.card, 'gain2', 'log');
								"step 2"
								event.finish();
							},
							"_priority": 0,
						},
						saochuA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							logTarget: "target",
							trigger: {
								player: "useCardToPlayered",
							},
							filter: function (event, player) {
								if (event.card.name != 'sha') return false;
								return get.distance(player, event.target) <= 1;
							},
							content: function () {
								trigger.getParent().directHit.push(trigger.target);
							},
							check: function (event, player) {
								return get.attitude(player, event.target) <= 0;
							},
							"_priority": 0,
						},
						quanmouA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							popup: false,
							charlotte: true,
							forced: true,
							derivation: ["olkanpo", "reshuishi", "shenzhu", "sbtieji", "twbeiding", "shuijianA"],
							usable: 1,
							trigger: {
								player: "useCardToPlayered",
							},
							filter: function (event, player) {
								if (!["basic", "trick"].includes(get.type(event.card))) return false;
								if (get.tag(event.card, "damage") && player.isPhaseUsing()) return true;
								return false;
							},
							content: function () {
								"step 0";
								player
									.chooseTarget("选择一名目标角色并猜测其手牌构成", function (card, player, target) {
										return _status.event.targets.includes(target);
									})
									.set("ai", function (target) {
										return 2 - get.attitude(_status.event.player, target);
									})
									.set("targets", trigger.targets);
								"step 1";
								if (result.bool) {
									player.logSkill("quanmouA", result.targets);
									var target = result.targets[0];
									event.target = target;
									event.choice = {
										basic: false,
										trick: false,
										equip: false,
									};
									player.chooseButton(["权谋：猜测其有哪些类别的手牌", [["basic", "trick", "equip"], "vcard"]], [0, 3], true).set("ai", function (button) {
										switch (button.link[2]) {
											case "basic":
												var rand = 0.95;
												if (!target.countCards("h", { type: ["basic"] })) rand = 0.05;
												if (!target.countCards("h")) rand = 0;
												return Math.random() < rand ? true : false;
											case "trick":
												var rand = 0.9;
												if (!target.countCards("h", { type: ["trick", "delay"] })) rand = 0.1;
												if (!target.countCards("h")) rand = 0;
												return Math.random() < rand ? true : false;
											case "equip":
												var rand = 0.75;
												if (!target.countCards("h", { type: ["equip"] })) rand = 0.25;
												if (!target.countCards("h")) rand = 0;
												return Math.random() < rand ? true : false;
										}
									});
								} else {
									event.finish();
								}
								"step 2";
								if (result.bool) {
									var choices = result.links.map(i => i[2]);
									if (!event.isMine() && !event.isOnline()) game.delayx();
									var list = [];
									event.num = 0;
									["basic", "trick", "equip"].forEach(type => {
										if (choices.includes(type) == target.hasCard({ type: type }, "h")) event.num++;
									});
								}
								"step 3";
								player.popup("猜对" + get.cnNumber(event.num) + "项");
								game.log(player, "猜对了" + get.cnNumber(event.num) + "项");
								if (event.num > 0 && !player.hasSkill(["olkanpo", "reshuishi"]))
									player.addTempSkills(["olkanpo", "reshuishi"], { player: 'phaseBegin' });
								if (event.num > 1 && !player.hasSkill(["shenzhu", "sbtieji"]))
									player.addTempSkills(["shenzhu", "sbtieji"], { player: 'phaseBegin' });
								if (event.num > 2 && !player.hasSkill(["twbeiding", "shuijianA"]))
									player.addTempSkills(["twbeiding", "shuijianA"], { player: 'phaseBegin' });
							},
							ai: {
								expose: 1,
								threaten: 2.4,
							},
							"_priority": 8,
						},
						jinghuaA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							usable: 3,
							forced: true,
							trigger: {
								target: "useCardToPlayer",
							},
							filter: function (event, player) {
								if (!get.tag(event.card, 'damage')) return false;
								if (!['trick', 'basic'].includes(get.type(event.card))) return false;
								return event.cards.filterInD().length > 0 && event.player != player && event.targets.includes(player);
							},
							content: function () {
								trigger.getParent().excluded.add(player);
								player.gain(trigger.cards.filterInD(), "gain2");
							},
							ai: {
								threaten: 0.6,
								nodamage: true,
								effect: {
									target: function (card, player, target) {//你成为牌的目标时对你的影响
										if (get.tag(card, "damage") && get.type(card) == 'trick') {
											return [0, 2, 0, -1];
										}
									},
								},
							},
							group: ['jinghuaA_1', 'jinghuaA_2'],
							subSkill: {
								"1": {
									audio: "jinghuaA",
									frequent: true,
									trigger: {
										player: "phaseJudgeBefore",
									},
									filter: function (event, player, name) {
										return player.isIn();
									},
									content: function () {
										trigger.cancel();
									},
									sub: true,
								},
								"2":
								{
									audio: "jinghuaA",
									trigger: {
										global: "phaseEnd",
									},
									frequent: true,
									filter: function (event, player) {
										if (event.player.isIn() && event.player.countCards('h') > 0)
											return event.player != player;
									},
									content: function () {
										player.viewHandcards(trigger.player);
									},
									sub: true,
								},
							},
							"_priority": 0,
						},
						shuijianA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							trigger: {
								source: "damageBegin1",
							},
							mark: true,
							marktext: "剑影",
							intro: {//标记介绍
								name: "苍流水影",//标记说明的名字，默认为技能名
								content: "已发动次数#",//内容:你有(数)个标记
							},
							init: function (player) {//初始化(好习惯)，获得这个技能时执行的内容
								player.storage.shuijianA = 0;//初始为未发动状态
								player.syncStorage("shuijianA");//同步标记(每当标记变动都要写这句)
							},
							onremove: true,
							frequent: true,
							popup: false,
							filter: function (event, player) {
								var num = Math.ceil(player.maxHp / 2);
								if (player.countMark("shuijianA") < num)
									return event.player != player && event.player.isIn() && event.player.countCards('h') > 0;
								else return false;
							},
							content: function () {
								const suits = [];
								for (const card of trigger.player.getCards("h")) suits.add(get.suit(card));
								trigger.num += suits.length;
								player.addMark("shuijianA");
								player.syncStorage("shuijianA");
							},
						},
						chiyongA: {
							audio: "ext:原梗Enhanced/audio/skill:3",
							charlotte: true,
							enable: "phaseUse",//出牌阶段发动
							usable: 1,//每回合一次(因为回合外没有你的出牌阶段，实际为出牌阶段限一次)
							selectCard: -1,
							filterCard: false,
							selectTarget: [1, Infinity],
							filterTarget: (card, player, target) => player !== target,
							multiline: true,
							multitarget: true,
							filter: (event, player) => !player.hasSkill("chiyongA_clear"),
							content: function () {//内容:
								"step 0"
								player.addTempSkill("chiyongA_clear", { player: "phaseBegin" });
								"step 1"
								targets.forEach(target => {
									target.addAdditionalSkills("chiyongA_" + player.playerid, "yanhunA");
									target.popup("yanhunA");
								});
							},
							group: ["chiyongA_direct"],
							subSkill: {
								clear: {
									onremove: function (player) {
										game.countPlayer(function (current) {
											current.removeAdditionalSkills("chiyongA_" + player.playerid);
										});
									},
									sub: true,
								},
								direct: {
									direct: true,
									locked: true,
									trigger: {
										player: "useCard",
									},
									filter: function (event, player) {
										return get.color(event.card) == "red" && ["basic", "trick"].includes(get.type(event.card));
									},
									content: function () {
										trigger.directHit.addArray(game.filterPlayer(function (current) {
											return current != player && trigger.targets.contains(current);
										}));
									},
									mod: {
										cardUsable: function (card) {
											if (get.color(card) == "red") return Infinity;
										},
										targetInRange: function (card) {
											if (get.color(card) == "red") return true;
										},
										wuxieRespondable: function (card, player, target) {
											if (get.color(card) == "red" && player != target) return false;
										},
									},
									ai: {
										threaten: 2.2,
										"directHit_ai": true,
									},
									sub: true,
								},
							},
							ai: {
								threaten: 1.4,
								order: 7,
								result: {
									target: 1,
								},
							},
							"_priority": 0,
						},
						eyunA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							forced: true,
							trigger: {
								global: "phaseBefore",
							},
							filter: function (event, player) {
								return event.player != player && !event.player.hasSkill("yanhunA");
							},
							content: function () {
								var num = [0, 1, 2].randomGet();
								switch (num) {
									case 0: {
										player.line(trigger.player, 'fire');
										trigger.player.damage('fire', 'nosource', 1);
										game.delay();
										break;
									}
									case 1: {
										player.line(trigger.player, 'water');
										trigger.player.executeDelayCardEffect('shandian');
										game.delay();
										break;
									}
									case 2: {
										player.line(trigger.player, 'green');
										trigger.player.executeDelayCardEffect('lebu');
										game.delay();
										break;
									}
								}
							},
							group: ['eyunA_1'],
							subSkill: {
								"1": {
									audio: "ext:原梗Enhanced/audio/skill:2",
									logSkill: true,
									forced: true,
									trigger: {
										target: "useCardToTargeted",
									},
									filter: function (event, player, name) {
										return player != event.player;
									},
									content: function () {
										if (Math.random() <= 0.5) {
											trigger.getParent().cancel();
										}
										player.randomDiscard();
									},
									ai: {
										threaten: 0.7,
										halfneg: true,
										effect: {//牌的影响
											target: function (card, player, target) {//你成为牌的目标时对你的影响
												return [0.5, -1];
											},
										},
									},
									sub: true,
								},
							},
							"_priority": 0,
						},
						yanhunA: {
							audio: "ext:原梗Enhanced/audio/skill:3",
							forced: true,
							trigger: {
								source: "damageBegin3",
							},
							filter: function (event, player) {
								return event.player != player && event.notLink();
							},
							content: function () {
								'step 0'
								player
									.chooseControl("无畏热血", "踏破绝境")
									.set("displayIndex", false)
									.set("prompt", get.translation(player) + "发动了〖焰魂〗，请选择一项")
									.set('choiceList', [`无畏热血：令所有拥有〖焰魂〗的角色摸${get.cnNumber(trigger.num * 2)}张牌并恢复${trigger.num + 1}点体力。`, "踏破绝境：令此伤害值翻倍。"])
									.set("ai", function () {
										if (trigger.player.hp <= trigger.num * 2) return 1;
										else return [0, 1].randomGet();
									});
								'step 1'
								if (result.index == 0) {
									game.countPlayer(function (current) {
										if (current.hasSkill("yanhunA")) {
											current.recover(trigger.num + 1);
											current.draw(trigger.num * 2);
										}
									});
								}
								else {
									trigger.num *= 2;
								}
							},
						},
						shiyaoA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							forced: true,
							trigger: {
								player: "useCardToPlayer",
							},
							filter: function (event, player) {
								if (event.targets.length > 1) return false;
								if (event.card.name != 'sha') return false;
								return get.distance(player, event.target) <= 1;
							},
							content: function () {
								if (trigger.addCount !== false) {
									trigger.addCount = false;
									trigger.player.getStat().card.sha--;
								}
							},
							mod: {
								globalFrom: function (from, to, distance) {
									if (from.hp < from.maxHp) return distance - 1;
								},
							},
							"_priority": 0,
						},
						youzhuA: {
							audio: "ext:原梗Enhanced/audio/skill:2",
							trigger: {
								global: "useCardToTargeted",
							},
							filter: function (event, player) {
								if (event.targets.length > 1) return false;
								if (event.card.name != 'sha') return false;
								return event.player != player && !event.targets.contains(player) &&
									event.player.inRange(player);
							},
							content: function () {
								player.draw();
								player.line(trigger.targets[0], 'green');
								trigger.targets.length = 0;
								trigger.all_excluded = true;
								trigger.player.useCard({ name: 'sha', isCard: true, nature: 'fire' }, player, false);
							},
							check: function (event, player) {
								if (player.countCards('hs', 'tao') > 0 || player.countCards('hs', 'jiu') > 0 || player.countCards('hs', 'shan') > 0 || player.hp > 0)
									return get.attitude(player, event.targets[0]) > 0;
								//大于0为选择队友发动，若<=0是对敌方发动
							},
							"_priority": 0,
						},
					},
					translate: {//各种技能的翻译，不写等着全是英文吧
						//势力部分
						mingdingzhitu: "命定之途的旅人",
						ziyouzhishi: "自由之风的赞歌",
						qiyuezhiyan: "契约之岩的守护",
						leimingyongheng: "永恒之雷的威严",
						zhihuizhicao: "智慧之草的启迪",
						zhengyizhishui: "正义之水的清澈",
						zhanzhengzhihuo: "战争之火的热情",
						lianaizhibing: "怜爱之冰的温柔",
						yiciyuan: "异次元·赛尔宇宙",
						//角色名字部分
						hutaoA: "胡桃",
						zhongliA: "钟离",
						leidianjiangjunA: "雷电将军",
						youlaA: "优菈",
						ganyuA: "甘雨",
						shenlilinghuaA: "神里绫华",
						wendiA: "温迪",
						qiqiA: "七七",
						keliA: "可莉",
						xiaogongA: "宵宫",
						keqingA: "刻晴",
						dilukeA: "迪卢克",
						qinA: "琴",
						babalaA: "芭芭拉",
						paimengA: "派蒙",
						bachongshenziA: "八重神子",
						ningguangA: "凝光",
						shanhugongxinhaiA: "珊瑚宫心海",
						xiaoA: "魈",
						wulangA: "五郎",
						monaA: "莫娜",
						huanglongyidouA: "荒泷一斗",
						jiuqirenA: "久岐忍",
						xingqiuA: "行秋",
						shatangA: "砂糖",
						putongyingA: "普通荧",
						xianglingA: "香菱",
						diaonaA: "迪奥娜",
						jiutiaoshaluoA: "九条裟罗",
						dadaliyaA: "达达利亚",
						zaoyouA: "早柚",
						yunjinA: "云堇",
						feixieerA: "菲谢尔",
						naxidaA: "纳西妲",
						niluA: "妮露",
						kandisiA: "坎蒂丝",
						duoliA: "多莉",
						anboA: "安柏",
						kelaiA: "柯莱",
						tinaliA: "提纳里",
						sainuoA: "赛诺",
						laiyilaA: "莱依拉",
						liulangzheA: "流浪者",
						qiliangliangA: "绮良良",
						yaoyaoA: "瑶瑶",
						aierhaisenA: "艾尔海森",
						kaweiA: "卡维",
						yelanA: "夜兰",
						fengyuanwanyeA: "枫原万叶",
						kaiyaA: "凯亚",
						falushanA: "珐露珊",
						shenheA: "申鹤",
						nuoaierA: "诺艾尔",
						shenlilingrenA: "神里绫人",
						dixiyaA: "迪希雅",
						puniA: "谱尼",
						banniteA: "班尼特",
						//技能部分
						...audioText,
						HunYinA: "神明",
						"HunYinA_info": '①锁定技，一轮游戏开始时，若游戏轮数不大于7，你失去以此法获得的技能并依次序获得获得〖虚无〗/〖元素〗/〖能量〗/〖生命〗/〖轮回〗/〖永恒〗/〖圣洁〗。②你使用牌无次数、距离限制。③你始终跳过判定阶段和弃牌阶段。',
						HunYinB: "虚无",
						"HunYinB_info": '①锁定技，其他角色不能用牌指定你为目标。②每回合限三次，你可以视为使用一张基本牌或者普通锦囊牌。',
						HunYinA_2: "元素",
						"HunYinA_2_info": '锁定技，你免疫非属性伤害。当其他角色造成属性伤害后，你获得其所有牌。',
						HunYinA_3: "能量",
						"HunYinA_3_info": '锁定技，当你受到伤害后，须选择任意名其他角色受到等量神圣伤害并翻面。',
						HunYinA_4: "生命",
						"HunYinA_4_info": '锁定技，每名角色的回合开始时，你回复体力至上限并摸等量的牌然后你可以令一名其他角色也如此做。',
						HunYinA_5: "轮回",
						"HunYinA_5_info": '锁定技，每回合限七次，你使用牌后重新获得此牌对应的实体牌。',
						HunYinA_6: "永恒",
						"HunYinA_6_info": '锁定技，其他角色的回合结束后，你获得一个额外的回合。',
						HunYinA_7: "圣洁",
						"HunYinA_7_info": '锁定技，每当你失去一张牌，你摸一张牌。',
						ranhuaA: "燃花",
						"ranhuaA_info": "锁定技，①回合开始时，若你体力值大于1，你失去1点体力。②当你失去1点体力后，你卜算2X然后摸X张牌（X为你已损失体力值）。",
						xuehuoA: "血火",
						"xuehuoA_info": "锁定技，①你造成的火焰伤害值+X。②若你体力小于等于体力上限值的一半（向上取整），你使用【杀】无视防具且不可响应。③你计算与其他角色的距离-X（X为你已损体力值）。",
						wangshengA: "往生",
						"wangshengA_info": "其他角色死亡时，你获得其所有牌并选择其武将牌上的任意个技能获得。",
						dieyinA: "蝶引",
						"dieyinA_info": "①你使用【杀】时可为此【杀】追加火属性，若如此做且你体力值大于1，你失去1点体力。②锁定技，你使用【杀】的次数上限+X（X为你已损失体力值）。",
						yuzhangA: "玉璋",
						"yuzhangA_info": "锁定技，你初始拥有等同于体力上限的“磐石”标记。若你拥有“磐石”，则你的手牌上限+“磐石”数且其他角色不能获得或弃置你的牌。当你受到伤害时，你防止此伤害,移除一个“磐石”标记并摸X张牌（X为场上已受伤的角色数+2）。回合开始时，若“磐石”数小于你的体力上限，则将“磐石”数调整至体力上限。",
						fengshenA: "封神",
						"fengshenA_info": "出牌阶段限一次，你可以弃置等同于“磐石”数的基本牌和全部“磐石”，选择任意名其他角色，对每名角色造成X点神圣伤害。（X为磐石标记数和3之间的较大值)",
						wuxiangA: "无想",
						"wuxiangA_info": "转换技&锁定技（仅回合开始时自动转换），你的【杀】均视为雷【杀】且无距离限制。阴：你使用【杀】无视防具且不可响应。阳：当其他角色使用带有「伤害」标签的牌指定你为目标时，你取消此目标并获得一点护甲。",
						wuxiangB: "无想",
						"wuxiangB_info": "",
						zhenshuoA: "真说",
						"zhenshuoA_info": "当你造成雷属性伤害后，你可以令至多3名其他角色受到1点雷属性伤害且若其未翻面，使之翻面。",
						yujueA: "御决",
						"yujueA_info": "限定技，出牌阶段，若你的体力小于体力上限的一半（向下取整），你可以令一名其他角色对另一名其他角色视为使用一张【决斗】（不可被【无懈可击】响应）。此【决斗】结算后受到伤害的角色死亡。",
						yanshouA: "眼狩",
						"yanshouA_info": "①出牌阶段限一次，你可令一名其他角色获得“眼狩”标记并失去所有技能直到其死亡。②你对拥有“眼狩”标记的角色使用牌无次数限制。③拥有“眼狩”标记的角色受到雷属性的伤害翻倍。",
						yanshouB: "眼狩",
						"yanshouB_info": "",
						yanshouC: "眼狩",
						"yanshouC_info": "",
						jichouA: "记仇",
						"jichouA_info": "锁定技，当你受到伤害后，须将伤害来源的3X张牌置于武将牌上称为“仇”。回合开始时，你获得所有的“仇”。若伤害来源的牌不足3X张且未翻面，使之翻面。（X为伤害值）",
						jichouB: "记仇",
						"jichouB_info": "",
						zhuomengA: "酌梦",
						"zhuomengA_info": "锁定技，一名其他角色的回合结束时，若其本回合对你造成过伤害，你视为使用一张【酒】。当你使用【酒】后，你随机获得三张" + get.ygeBolInformX("幻梦牌", "<li>【凝浪光剑】：出牌阶段，选择一名其他角色，对其造成1点伤害。然后，若你已受伤则回复1点体力，否则获得1点护甲。</li><li>【潮卷冰削】：令所有其他角色失去1点体力并随机弃置两张牌。</li><li>【光潮幻象】：令一名其他角色弃置所有装备牌，并将一张乐不思蜀置于其判定区。</li>") + "。你使用幻梦牌不受〖枷舞〗限制。",
						zhuomengB: "酌梦",
						"zhuomengB_info": "",
						jiawuA: "枷舞",
						"jiawuA_info": "使命技，游戏开始时，你获得3个“枷锁”标记，当你造成伤害后，移除一个“枷锁”。 出牌阶段，你最多使用三张非基本牌;成功：当你使用一张牌后，若你无“枷锁”，失去“枷舞”并获得“浪舞”。 失败：达成使命前，进入濒死状态时，你将体力值回复至1点。",
						jiawuB: "枷舞",
						"jiawuB_info": "",
						jiawuC: "枷舞",
						"jiawuC_info": "",
						jiawuD: "枷舞",
						"jiawuD_info": "",
						langwuA: "浪舞",
						"langwuA_info": "锁定技，每当你使用或打出一张牌，你摸一张牌。回合结束时，你选择一名其他角色，对其造成Y点伤害。（Y为你本回合使用的牌数）",
						huolinA: "获麟",
						"huolinA_info": "锁定技。①游戏开始时，你将【阿莫斯之弓】置入装备区。②你即将失去【阿莫斯之弓】或废除武器栏时，取消之。③你不能将装备区内的【阿莫斯之弓】当作其他牌使用或打出。④你手牌区内的武器牌均视为冰【杀】。",
						qiyueA: "契约",
						"qiyueA_info": "锁定技，其他角色的摸牌阶段开始时，你令其跳过此阶段，然后你摸X张牌并交给其两张牌（X为场上体力值不等于你的其他角色数且至少为2），之后防止你受到的下一次伤害。",
						shuanghuaA: "霜华",
						"shuanghuaA_info": "锁定技，①你的【杀】均视为冰【杀】且可指定任意名目标。②当你对其他角色造成冰属性伤害时，你进行一次判定，若判定结果为：红色，你获得目标角色两张牌；黑色，目标角色进入“冻结”状态至其回合开始，已“冻结”则失去一点体力上限。",
						ygzq_dongjie: "冻结",
						"ygzq_dongjie_info": "防具失效且不处于濒死状态时无法使用或打出手牌。",
						bingwuA: "冰舞",
						"bingwuA_info": "①锁定技，每回合限五次，当你对其他角色使用【杀】结算后，若此【杀】未造成伤害，此【杀】不计入使用次数且你获得一张【杀】并令目标角色获得一枚“极寒”标记；反之，目标角色获得3X枚“极寒”标记（X为伤害值）。②锁定技，你的【杀】均视为冰【杀】且你对拥有“极寒”的其他角色使用【杀】无距离限制。",
						shuangmieA: "霜灭",
						"shuangmieA_info": "①出牌阶段限一次,你可以选择任意名其他角色，令这些角色各获得Y枚“极寒”（Y为场上已“冻结”的角色数且至少为3）。②拥有“极寒”的角色回合开始时，其进行一次判定，若判定结果点数<=“极寒”数，其立即死亡，反之，你获得其所有牌，然后其失去1点体力上限。",
						xianbuA: "霰步",
						"xianbuA_info": "①当你于回合外失去牌时，你可以摸等量的牌并令当前回合角色获得两枚“极寒”标记并进入“冻结”状态至其回合开始。②锁定技，每回合限三次，当你受到其他角色造成的伤害时，你可以弃置一张牌，然后你防止此伤害。",
						jiushiA: "酒诗",
						"jiushiA_info": "每回合限三次，你可以将任意一张手牌当作【酒】使用。你使用【酒】无次数限制",
						feixingA: "飞行",
						"feixingA_info": "锁定技，你使用牌无距离限制，跳过弃牌阶段，其他角色计算与你的距离+1。",
						fengqinA: "风琴",
						"fengqinA_info": "摸牌阶段结束后，你选择递增/递减两种排列方式。出牌阶段限三次，当你使用的牌的点数与上次使用的牌的点数以你选择的方式排列时，你摸X张牌。(X为两张牌点数之差的绝对值)。",
						fengqinC: "",
						"fengqinC_info": "",
						chengfengA: "乘风",
						"chengfengA_info": "出牌阶段限一次，你可以弃置X张点数不大于Y的牌并摸X+1张牌。（Y为你本回合使用的手牌数量）如果你弃置了七张及以上的牌，则获得【飞行】直到下个回合开始。",
						dueA: "渡厄",
						"dueA_info": "锁定技，在任意角色的判定牌生效前依次执行以下两项：①若判定牌为锦囊牌或基本牌则令一名其他角色回复一点体力；②你可以打出一张牌替换之",
						yanmingA: "延命",
						"yanmingA_info": "每回合限三次,当有角色进入濒死状态时，可以令该角色进行一次判定，若结果不为黑桃2~9，该角色将体力值恢复至1点并摸等同于自身体力上限数的牌。",
						yanmingB: "延命",
						"yanmingB_info": "",
						huihaiA: "回骸",
						"huihaiA_info": "出牌阶段限一次，你可以减一点体力上限并选择一名已死亡的其他角色，令该角色复活、将体力回复至上限并摸等量的牌。",
						qiangqiangA: "锵锵",
						"qiangqiangA_info": "锁定技，游戏开始时，你选择武将牌上的一个限定技取消限定并修改为出牌阶段限一次，另一个限定技修改为无需弃牌并摸两张牌。",
						huomianA: "豁免",
						"huomianA_info": "锁定技，游戏开始时，你选择武将牌上的一个限定技取消限定并修改为出牌阶段限一次，另一个限定技修改为无需弃牌并摸两张牌；当其他角色使用的普通锦囊牌生效时，若你是此牌的唯一目标，防止此牌对你造成的伤害。",
						huomianB: "豁免",
						"huomianB_info": "",
						huomianC: "豁免",
						"huomianC_info": "",
						baozangA: "宝藏",
						"baozangA_info": "摸牌阶段开始时，你可以放弃摸牌，改为展示牌堆顶的牌并置于你的武将牌上，若此阶段内以此法展示的牌花色均不同则重复此流程，然后你将这些牌交给任意一名角色。",
						pengpengA: "砰砰",
						"pengpengA_info": "限定技，出牌阶段你可以弃置两张红色手牌，并对你攻击范围内的一名其他角色造成1点火属性伤害。",
						daohangA: "导航",
						"daohangA_info": "限定技，出牌阶段你可以弃置两张黑色手牌，令一名其他角色视为对另一名其他角色使用一张无法被抵消的【决斗】，决斗过程中这两名角色的所有手牌均视为【杀】。",
						pengpengB: "砰砰",
						"pengpengB_info": "出牌阶段限一次，你可以弃置两张红色手牌，并对你攻击范围内的一名其他角色造成1点火属性伤害。",
						daohangB: "导航",
						"daohangB_info": "出牌阶段限一次，你可以弃置两张黑色手牌，令一名其他角色视为对另一名其他角色使用一张无法被抵消的【决斗】，决斗过程中这两名角色的所有手牌均视为【杀】。",
						pengpengC: "砰砰",
						"pengpengC_info": "限定技，出牌阶段，你可以摸两张牌并对你攻击范围内的一名其他角色造成1点火属性伤害。",
						daohangC: "导航",
						"daohangC_info": "限定技，出牌阶段，你可以摸两张牌并令一名其他角色视为对另一名其他角色使用一张无法被抵消的【决斗】，决斗过程中这两名角色的所有手牌均视为【杀】。",
						daohangD: "导航",
						"daohangD_info": "",
						yanxiaoA: "焰硝",
						"yanxiaoA_info": "出牌阶段限一次，你可以弃置一张红色手牌，令本阶段你的攻击范围+1，且使用【杀】无次数限制，并令你使用的【杀】改为火【杀】。",
						yanxiaoB: "焰硝",
						"yanxiaoB_info": "",
						xiangzhuA: "相助",
						"xiangzhuA_info": "你的回合内，当你的牌因弃置而置入弃牌堆时，你可以将其中的任意张牌交给其他角色；其他角色的弃牌阶段开始时，若其手牌数大于手牌上限，其可以交给你一张手牌。",
						xiangzhuB: "相助",
						"xiangzhuB_info": "",
						lianzhenA: "廉贞",
						"lianzhenA_info": "当你受到伤害时，你可以弃置X张牌并防止此伤害（X为伤害值）。牌不足则改为失去1点体力，然后你复原武将牌。",
						leifaA: "雷罚",
						"leifaA_info": "当其他角色成为【杀】的目标时，若其距离你小于等于1，你可以弃置其一张牌。若此牌为:①基本牌：此【杀】改为雷【杀】且不可响应、伤害+1；②锦囊牌：你获得此牌且此【杀】不计入使用者次数限制；③装备牌：你摸Y张牌并回复1点体力。（Y为距离你为1的其他角色数）",
						xingdouA: "星斗",
						"xingdouA_info": "锁定技，①你使用【杀】可以选择你距离不大于此【杀】点数的角色为目标。②你的【杀】可以额外指定此【杀】点数名目标。③你使用【杀】指定目标时，全场角色计算与目标的距离为1直到其回合开始。",
						xingdouB: "归位",
						"xingdouB_info": "",
						jiuzhuangA: "酒庄",
						"jiuzhuangA_info": "出牌阶段，你可以展示一张【酒】并弃置或交给其他角色，然后你摸两张牌。当你不处于濒死状态时，你无法使用【酒】。",
						yeyingA: "夜英",
						"yeyingA_info": "你可以跳过判定阶段并视为你对一名其他角色使用一张【决斗】，若如此做，摸牌阶段结束时你必须弃置两张手牌。当你令其他角色受到【决斗】造成的伤害时，你可以将此伤害改为火属性伤害。",
						yeyingB: "夜英",
						"yeyingB_info": "",
						yeyingC: "夜英",
						"yeyingC_info": "",
						yujinA: "余烬",
						"yujinA_info": "当你使用【决斗】或红色【杀】指定目标后，或成为【决斗】或红色【杀】的目标后，你可以摸一张牌。",
						jinzuA: "禁足",
						"jinzuA_info": "出牌阶段，你可以弃置一张黑色手牌，令你攻击范围内的一名其他角色获得“禁闭”标记；该角色判定阶段结束时，移去“禁闭”，然后其跳过摸牌阶段并摸一张牌；此标记不会因你死亡而移去。",
						jinzuB: "禁闭",
						"jinzuB_info": "",
						shouhuA: "守护",
						"shouhuA_info": "当一名角色受到大于1点的伤害时，你可以弃置一张红色手牌令此伤害-1。",
						fengyinA: "风引",
						"fengyinA_info": "当你对其他角色造成伤害时，你可以令此伤害-1并摸两张牌，然后你失去此技能并令其获得此技能。",
						tuanzhangA: "团长",
						"tuanzhangA_info": "主公技，其他蒙德势力角色出牌阶段限一次，其可以交给你一张手牌，然后你可以令其摸两张牌，且此阶段可多使用一张【杀】。",
						tuanzhangB: "团长",
						"tuanzhangB_info": "",
						tuanzhangC: "团长",
						"tuanzhangC_info": "",
						yanchangA: "演唱",
						"yanchangA_info": "出牌阶段限一次，你可以选择一名角色，你弃置其区域里的一张牌并令其回复1点体力。",
						shengmuA: "圣母",
						"shengmuA_info": "当你受到其他角色造成的1点伤害后，你可以摸两张牌，然后交给伤害来源一张手牌。",
						ouxiangA: "偶像",
						"ouxiangA_info": "决胜技，游戏开始时，若玩家人数小于5，你失去此技能；结束阶段，若你本回合未造成过伤害，你选择一名没有“信徒”标记的其他角色，令其获得“传教”标记，若其已拥有“传教”标记则替换为“信徒”标记；准备阶段，若所有存活的其他角色均已拥有“信徒”标记则结束本局游戏，你获得“传教胜利”。",
						ouxiangB: "传教",
						"ouxiangB_info": "",
						ouxiangC: "信徒",
						"ouxiangC_info": "",
						ouxiangD: "偶像",
						"ouxiangD_info": "准备阶段，你可以观看牌堆顶的X张牌，并将其以任意顺序置于牌堆项或牌堆底。（X为存活角色数且至多为5）",
						ouxiangE: "偶像",
						"ouxiangE_info": "",
						huobanA: "伙伴",
						"huobanA_info": "限定技，出牌阶段，你可以选择一名其他角色成为伙伴，并令伙伴回复1点体力，你将势力修改为伙伴的势力。(当伙伴对除你以外的其他角色造成伤害后，你回复1点体力，若体力已满则改为摸一张牌。当伙伴存活时，你不能使用【决斗】且无法成为【决斗】的目标。当伙伴死亡时，你失去武将牌上的全部技能且此后杀死你的角色摸三张牌。)",
						huobanB: "派蒙",
						"huobanB_info": "",
						huobanC: "伙伴",
						"huobanC_info": "",
						huobanD: "伙伴",
						"huobanD_info": "",
						huobanE: "无助",
						"huobanE_info": "杀死你的角色摸三张牌。",
						bushiA: "捕食",
						"bushiA_info": "结束阶段，你可以摸一张牌。获得伙伴后，你失去此技能。",
						xiangdaoA: "向导",
						"xiangdaoA_info": "出牌阶段限一次，若你的手牌数大于1，你可以将全部手牌交给伙伴，并令伙伴回复1点体力。",
						danxiaoA: "胆小",
						"danxiaoA_info": "锁定技，当其他角色使用【杀】指定你为目标时，若其不在你的攻击范围内，则防止此牌对你造成的伤害。",
						yizhouA: "役咒",
						"yizhouA_info": "锁定技,游戏开始时,你将牌堆顶的X张牌扣置于武将牌上称为“樱”(X为你的体力上限)。当你造成或受到伤害后，可以将受伤害角色/伤害来源的Y张牌放入你的武将牌上作为“樱”,(Y为造成/受到伤害值,且没有牌改为从牌堆顶获取)，否则回复一点体力。",
						yizhouB: "役咒",
						"yizhouB_info": "",
						xianzhenA: "显真",
						"xianzhenA_info": "每回合限三次,你可以将“樱”当作任意基本牌使用或打出,你以此法使用的基本牌无距离和次数限制.",
						xuanjiA: "璇玑",
						"xuanjiA_info": "锁定技，一名角色的回合开始时，你随机装备以下宝物和防具各一种（宝物：金梳、琼梳、犀梳、三略。防具：奇门八卦、国风玉袍、照月狮子盔、红棉百花袍）。",
						yugeA: "玉阁",
						"yugeA_info": "①出牌阶段限三次，你可以将两张手牌当【天权崩玉】对任意名目标使用。②当其他角色因响应你使用的【天权崩玉】而打出【闪】时，你获得其一张牌。③当你使用【天权崩玉】对其他角色造成伤害后，你弃置其一张牌。",
						caiyuanA: "财源",
						"caiyuanA_info": "锁定技，一名角色获得牌后，若你手牌数不为全场最多，你将手牌摸至全场最多。",
						miaosuanA: "庙算",
						"miaosuanA_info": "①锁定技，摸牌阶段开始时，你跳过之，改为选择指定获得某种类型的牌（最多X次，X为场上角色数和你已损失体力值间的较大值），然后从牌堆随机摸取之；②锁定技，你使用普通锦囊牌不可被响应。当你使用一张锦囊牌后，你有概率发现四张随机锦囊牌，然后选择其中一至两张获得(初始概率为100%，你每发动一次技能便减少15%，最低为10%，每回合重置)。",
						hairanA: "海染",
						"hairanA_info": "①当你于回合内令自己回复体力后，你可以令一名其他角色失去所有体力。②锁定技，每回合限三次，当你成为其他角色使用的带有「伤害」标签的基本牌或普通锦囊牌的目标时，若使用者体力/手牌数/装备数>=你，此牌对你无效。",
						hairanB: "海染",
						"hairanB_info": "锁定技，每回合限三次，当你成为其他角色使用的带有「伤害」标签的基本牌或普通锦囊牌的目标时，若使用者体力/手牌数/装备数>=你，此牌对你无效。",
						yuehuaA: "月华",
						yuehuaA_info: "每回合限一次，你可以将一张牌当做【桃】使用，然后你可以令任意名非濒死状态下的角色各增加1点体力上限并回复1点体力。",
						miaojiA: "妙计",
						"miaojiA_info": "出牌阶段限一次，你可以将一张手牌扣置于武将牌上称为“妙计”，你至多拥有三张“妙计”；其他角色于其回合内使用第一张牌时，你可以移去一张与此牌类别相同的“妙计”，然后令此牌无效并弃置其一张牌。",
						miaojiB: "妙计",
						"miaojiB_info": "",
						miaojiC: "妙计",
						"miaojiC_info": "",
						nafengA: "纳奉",
						"nafengA_info": "主公技，出牌阶段限一次，你可以令每名其他稻妻势力角色选择是否展示并交给你一张【桃】。",
						jingyaoA: "靖妖",
						"jingyaoA_info": "锁定技,你使用【杀】无次数限制、使用牌无距离限制且使用单目标非装备非延时锦囊牌可以增加任意名目标。出牌阶段限两次，当你体力大于1时，你可以失去1点体力视为使用一张【杀】。",
						jingyaoB: "靖妖",
						"jingyaoB_info": "",
						yezhangA: "业障",
						"yezhangA_info": "锁定技，你使用的【杀】伤害+1且无视防具，体力值大于等于你的角色不能响应你的【杀】。结束阶段，若你本回合杀死过两名及以上角色，你进入混乱状态直到回合开始。",
						yezhangB: "业障",
						"yezhangB_info": "",
						nizongA: "匿踪",
						"nizongA_info": "若你本回合未造成过伤害，你获得【潜行】直到下回合开始。【潜行】：其他角色无法指定你为目标",
						cixiongA: "雌雄",
						"cixiongA_info": "锁定技，游戏开始时，你的服装为“戎装”；准备阶段，将服装改为“女装”；结束阶段，将服装改为“戎装”；服装为“戎装”时，你的性别视为男性，服装为“女装”时，你的性别视为女性。",
						cixiongB: "戎装",
						"cixiongB_info": "",
						cixiongC: "女装",
						"cixiongC_info": "",
						cixiongD: "雌雄",
						"cixiongD_info": "",
						cixiongE: "雌雄",
						"cixiongE_info": "",
						fujiA: "伏击",
						"fujiA_info": "戎装技，其他角色于其回合内使用第二张牌时，你可以弃置一张【杀】并令此牌无效，然后摸一张牌，伏击成功后你将服装改为“女装”。",
						zhixinA: "知心",
						"zhixinA_info": "女装技，出牌阶段，你可以观看一名其他角色的手牌，然后你可以展示并获得其中一张红桃牌并令其摸一张牌，观看手牌后你将服装改为“戎装”。",
						zhanxingA: "占星",
						"zhanxingA_info": "准备阶段，你可以观看牌堆顶的四张牌。",
						mingyunA: "命运",
						"mingyunA_info": "出牌阶段限一次，若你的手牌数大于当前体力，你可以摸两张牌，且本回合你的手牌上限为1。",
						mingyunB: "命运",
						"mingyunB_info": "",
						xushiA: "虚实",
						"xushiA_info": "当你于回合外使用或打出【闪】时，你可以弃置当前回合角色的一张牌，若你此时没有手牌，则改为获得当前回合角色的一张牌。",
						guailiA: "怪力",
						"guailiA_info": "出牌阶段限一次，若你正面向上且你与所有其他角色的距离均为1，你可以使用一张不计入次数的【杀】指定所有其他角色为目标，本阶段你获得技能“乱神”。(☆乱神：锁定技，当你使用【杀】对目标造成伤害后，其摸两张牌，然后你与其翻面。)",
						haokuaiA: "豪快",
						"haokuaiA_info": "锁定技，当你于回合内使用牌时，若你正面向上，本回合你计算与其他角色的距离-1。",
						luanshenA: "乱神",
						"luanshenA_info": "锁定技，当你使用【杀】对目标造成伤害后，其摸两张牌，然后你与其翻面。",
						luanshenB: "乱神",
						"luanshenB_info": "",
						leilunA: "雷轮",
						"leilunA_info": "出牌阶段限一次，若你的体力大于1，你可以失去1点体力令至多两名已受伤的其他角色各回复1点体力，然后你摸X张牌。(X为你以此法少选择的目标数)",
						yushenA: "御神",
						"yushenA_info": "当你受到其他角色造成的伤害时，你可以弃置一张黑色手牌并对其造成1点雷属性伤害，然后你摸两张牌。",
						fushouA: "副手",
						"fushouA_info": "出牌阶段，若你的身份不为主公，主公与你势力相同且没有主公技，你可以令其获得技能“相救”；当你死亡时，其失去此技能。(☆相救：主公技，其他稻妻势力角色对你造成伤害后，若你背面向上，其可以摸一张牌并令你翻面。)",
						fushouB: "副手",
						"fushouB_info": "",
						xiangjiuA: "相救",
						"xiangjiuA_info": "主公技，其他稻妻势力角色对你造成伤害后，若你背面向上，其可以摸一张牌并令你翻面。",
						huayuA: "画雨",
						"huayuA_info": "锁定技，回合结束时，你将“雨帘”数补至3个，你初始拥有3个“雨帘”。有“雨帘”的角色受到其他角色的伤害时，须选择一项：①移除一个“雨帘”并防止此伤害；②获得伤害来源的三张牌。有“雨帘”的角色对其他角色造成伤害时，须选择一项：①移除一个“雨帘”并令本次伤害值翻倍；②卜算6并摸三张牌。",
						caiyuA: "裁雨",
						"caiyuA_info": "出牌阶段限一次，你可以令至多三名其他角色各获得1个“雨帘”标记。你的手牌上限+“雨帘数”。",
						xiaguA: "侠骨",
						"xiaguA_info": "锁定技。①游戏开始时，你将【祭礼剑】置入装备区。②你即将失去【祭礼剑】或废除武器栏时，取消之。③你不能将装备区内的【祭礼剑】当作其他牌使用或打出。",
						huifengA: "慧风",
						"huifengA_info": "锁定技，你的手牌上限+2，每当你使用武将牌上的一个其他技能后，本回合你的手牌上限-1。",
						lianjinA: "炼金",
						"lianjinA_info": "锁定技，回合开始时，你投掷一枚骰子。若X>=2，你随机获得X张" + get.ygeBolInformX("药剂", "<li>烈焰药水：选择一名其他角色，令其受到到1点火焰伤害且进入〖灼烧〗状态至其回合结束。</li><li>风暴药水：选择一名其他角色，令其受到1点雷电伤害且进入〖麻痹〗状态至其回合结束。</li><li>极寒药水：选择一名其他角色，令其受到1点冰冻伤害且进入〖冻结〗状态至其回合结束。</li><li>生命药水：选择一名已受伤角色，令其增加1点体力上限并回复2点体力。</li><li>复苏药水：出牌阶段，对你使用。你卜算6，然后摸四张牌。</li>") + "（X为骰子点数）,否则你获得1张【毒】。",
						lianjin_mabi: "麻痹",
						lianjin_zhuoshao: "灼烧",
						fenglingA: "风灵",
						"fenglingA_info": "每两轮限一次，你可以弃置任意张牌并令等量名其他角色各受到1点风属性伤害。",
						nizaoA: "拟造",
						nizaoA_info: "每回合限三次，当你需要使用或打出【闪】/【无懈可击】时，你可以视为使用或打出【闪】/【无懈可击】。",
						fengrenA: "锋刃",
						"fengrenA_info": "锁定技，你使用的属性【杀】改为普通【杀】。",
						jileiA: "积累",
						"jileiA_info": "出牌阶段开始时或当你受到伤害后，你可以展示牌堆顶的一张牌并置于武将牌上，若为方片则称为“原石”，若为其他花色则称为“经验”。(觉醒后修改为：若为“原石”则移去，若为“经验”你获得之；若你是派蒙的伙伴且派蒙存活，每当你移去一张“原石”时，你与派蒙各摸一张牌)",
						jileiB: "经验",
						"jileiB_info": "",
						jileiC: "原石",
						"jileiC_info": "",
						tongxingA: "同行",
						"tongxingA_info": "觉醒技，准备阶段，若“经验”的数量不小于3，你获得武将牌上的“经验”并移去“原石”，你回复1点体力然后减少1点体力上限，获得技能“锅巴”。(☆锅巴：结束阶段，你可以对一名其他角色造成1点火属性伤害。)",
						baiweiA: "百味",
						"baiweiA_info": "①当你对一名角色造成火焰伤害时，你获得2X个“焰火”标记（X为伤害值）。②出牌阶段限一次，你可以移除全部“焰火”标记并获得等量张" + get.ygeBolInformX("佳肴牌", "<li>攻击类：【仙跳墙】（★★★★★）、【堆高高】（★★★）、【绝云锅巴】（★★★）</li><li>防御类：【黄油蟹蟹】（★★★★）、【莲花酥】（★★★）、【四方和平】（★★★）</li><li>辅助类：【兽肉薄荷卷】（★★★）、【提瓦特煎蛋】（★）、【甜甜花酿鸡】（★★）、【知足常乐】（★★★）</li>") + "③你的佳肴牌不计入手牌上限",
						baiweiB: "百味",
						zaoshenA: "灶神",
						zaoshenA_info: "回合开始/结束时，你可以选择攻击范围内的一名其他角色，对其造成1点火焰伤害。",
						huoxuanA: "火旋",
						huoxuanA_info: "限定技，出牌阶段，若你的“焰火”标记数>=12，你可以弃置所有“焰火”并令所有其他角色选择一项：弃置数量等同其体力上限的牌，或受到你对其造成的2点火焰伤害。",
						jiuguanA: "酒馆",
						"jiuguanA_info": "当一名角色使用【酒】后，你可以摸一张牌。",
						jiuguanB: "酒馆",
						"jiuguanB_info": "",
						tiaojiuA: "调酒",
						"tiaojiuA_info": "当一名角色进入濒死状态时，你可以令该角色黑桃手牌均视为【酒】，然后你可以交给其一张手牌。",
						tiaojiuB: "调酒",
						"tiaojiuB_info": "",
						dongdongA: "冻冻",
						"dongdongA_info": "当你受到其他角色造成的伤害后，你可以选择一项：A.令其视为使用一张不计入次数的【酒】；B.令其“冻结”。(“冻结”的角色本回合结束前无法使用或打出手牌，处于濒死状态时除外。)",
						tetiaoA: "特调",
						"tetiaoA_info": "限定技，出牌阶段，你可以令一名已受伤的角色回复1点体力并视为其使用一张【酒】，若你没有以此法回复体力则你摸两张牌，然后你令除其以外的所有其他角色“冻结”。(“冻结”的角色本回合结束前无法使用或打出手牌，处于濒死状态时除外。)",
						tianlingA: "天领",
						"tianlingA_info": "锁定技，当你背面向上时，你的攻击范围+1，你不能成为黑色锦囊牌的目标，当你的体力值减少后翻面。",
						daibuA: "逮捕",
						"daibuA_info": "当你攻击范围内的一名其他角色受到雷属性伤害后，若你正面向上，你可以令该角色摸两张牌并翻面，然后你摸两张牌并翻面。",
						yayuA: "鸦羽",
						"yayuA_info": "当你攻击范围内的一名其他角色使用【闪】后，若你的手牌数大于1(或体力值大于1)，你可以弃置两张手牌(或失去1点体力)并翻至正面，然后令其选择一项：A.此【闪】无效；B.你对其造成1点雷属性伤害。",
						zanbieA: "暂别",
						"zanbieA_info": "游戏开始时，你可以将势力改为璃月，然后减少1点体力上限并获得技能“明择”。(☆明择：锁定技，你的回合内，当其他角色进入濒死状态时，你令其选择一项：A.抗争：你摸两张牌，本回合手牌上限+2；B.投降：本次其处于濒死状态时，所有角色无法使用【桃】或【酒】。)",
						kuanglanA: "狂澜",
						"kuanglanA_info": "锁定技，【南蛮入侵】对你无效；出牌阶段结束时，你弃置装备区里的防具牌，视为使用一张【南蛮入侵】。",
						kuanglanB: "狂澜",
						"kuanglanB_info": "",
						duanliuA: "断流",
						"duanliuA_info": "锁定技，当你使用牌指定其他角色为目标后，你令其本回合“断流”，你对“断流”的角色造成伤害后，其弃置一张牌，若无牌可弃则移去“断流”并受到来自你的1点伤害。",
						duanliuB: "断流",
						"duanliuB_info": "",
						duanliuC: "断流",
						"duanliuC_info": "",
						mingzeA: "明择",
						"mingzeA_info": "锁定技，你的回合内，当其他角色进入濒死状态时，你令其选择一项：A.抗争：你摸两张牌，本回合手牌上限+2；B.投降：本次其处于濒死状态时，所有角色无法使用【桃】或【酒】。",
						mingzeB: "抗争",
						"mingzeB_info": "",
						mingzeC: "明择",
						"mingzeC_info": "",
						mingzeD: "投降",
						"mingzeD_info": "",
						mingzeE: "明泽",
						"mingzeE_info": "",
						toulanA: "偷懒",
						"toulanA_info": "出牌阶段开始时，你可以将手牌弃至手牌上限(不足则不弃)，本回合弃牌阶段结束时，你摸两张牌。",
						toulanB: "偷懒",
						"toulanB_info": "",
						bailanA: "摆烂",
						"bailanA_info": "出牌阶段限一次，你可以弃置一张手牌并选择一名手牌数不小于你的其他角色，其将手牌弃至与你手牌数相同。",
						jijinA: "急进",
						"jijinA_info": "限定技，出牌阶段，你可以选择一名其他角色成为目标，你依次与下家角色交换座次，直到你与目标角色交换后，你对其造成1点伤害。",
						qizhenA: "旗阵",
						qizhenA_info: "①每回合限三次，你可以将一张牌当作无距离和次数限制的任意基本牌使用或打出，然后你获得1点护甲(不超过你体力上限)。②锁定技，你可以如手牌般使用或打出牌堆顶的前X张牌。（X为你的护甲值）",
						qizhenB: "旗阵",
						"qizhenB_info": "锁定技，你可以如手牌般使用或打出牌堆顶的前X张牌。（X为你的护甲值）",
						tinglingA: "听令",
						"tinglingA_info": "其他角色的出牌阶段开始前，你可以指定1种花色并令其选择一项：1.交给你不为指定花色的所有牌，2.跳过此阶段且非锁定技失效至其下回合开始。",
						yirongA: "易容",
						yirongA_info: "限定技，当你进入濒死状态时，你可以回复体力至上限，然后从所有未出场的璃月武将牌中选择一张替换之。",
						yeyaA: "夜鸦",
						"yeyaA_info": "锁定技，你使用的普通锦囊牌无法被抵消，且造成的伤害改为雷属性。",
						zhongerA: "中二",
						"zhongerA_info": "锁定技，回合开始时，若角色头像为“艾咪”则更换为“皇女”，若角色头像为“皇女”则更换为“艾咪”，然后视为你拥有对应的技能“皇女”或“艾咪”。",
						zhongerB: "中二",
						"zhongerB_info": "",
						zhongerC: "中二",
						"zhongerC_info": "",
						huangnvA: "皇女",
						"huangnvA_info": "锁定技，你使用的普通锦囊牌无法被抵消，结束阶段，选择任意一张普通锦囊牌视为你使用之。",
						huangnvB: "皇女",
						"huangnvB_info": "",
						aimiA: "艾咪",
						"aimiA_info": "锁定技，你不能成为延时锦囊牌的目标，结束阶段，你摸一张牌。",
						yunzhongA: "蕴种",
						yunzhongA_info: "①出牌阶段限一次，你可以令任意名其他角色各获得1枚“蕴种印”标记。②拥有“蕴种印”的角色依“蕴种印”标记数量获得如下效果：≥1，计算与其它角色的距离+1且手牌上限固定为0；≥2，非锁定技失效；≥3，回合开始时，移除所有“蕴种印”并受到X点神圣伤害（X为“蕴种印”数量）。",
						miaodiA: "妙谛",
						miaodiA_info: "①锁定技，一名其他角色的回合结束后，若其本回合使用了>=Y张锦囊牌，你获得一个额外的回合（Y为其当前体力值）。②锁定技，你不是其他角色使用锦囊牌的合法目标。",
						fumengA: "浮梦",
						fumengA_info: "①每回合限两次，你可以将一张牌当作任意基本牌或普通锦囊牌使用或打出。②每轮限一次，当你进入濒死状态时，你可以令所有其他角色选择一项：1.令你回复1点体力并从牌堆中随机获取两张普通锦囊牌。2.废除所有装备栏，已废除则改为失去两点体力。",
						fumengB: "浮梦",
						fumengB_info: "每轮限一次，当你进入濒死状态时，你可以令所有其他角色选择一项：1.令你回复1点体力并从牌堆中随机获取两张普通锦囊牌;2.废除所有装备栏，已废除则改为失去两点体力",
						huawuA: "花舞",
						"huawuA_info": "当你失去装备区里的牌后，你可以摸两张牌。",
						lunpoA: "论破",
						"lunpoA_info": "出牌阶段，你可以令一名其他角色获得其装备区里的所有牌，同时你选择一种花色并弃置其一张手牌，若此牌为装备牌，则你获得此牌，若此牌与你选择的花色不相同，则此技能本阶段失效。",
						lunpoB: "论破",
						"lunpoB_info": "",
						lunpoC: "论破",
						"lunpoC_info": "",
						dunchiA: "盾持",
						"dunchiA_info": "锁定技，若你的装备区里没有武器牌，你计算与其他角色的距离-1；弃牌阶段结束时，获得你装备区里的武器牌。",
						cunshouA: "村守",
						"cunshouA_info": "当一名其他角色成为【杀】的目标时，若你与其距离1以内且你不为此【杀】的使用者，你可以弃置此【杀】的使用者一张手牌，若该角色没有手牌则改为弃置装备区里的一张牌。",
						juexiaoA: "决笑",
						"juexiaoA_info": "决胜技，游戏开始时，若玩家人数小于5，你失去此技能；当你于回合内使用或弃置非转化的【顺手牵羊】后，你将此牌至于武将牌上称为“封印”，若你此时拥有五张“封印”则将背景音乐更换为“热き决闘者たち”；准备阶段，若你拥有五张“封印”则结束本局游戏，你获得“决斗胜利”。",
						juexiaoB: "封印",
						"juexiaoB_info": "",
						juexiaoC: "决笑",
						"juexiaoC_info": "",
						juexiaoD: "决笑",
						"juexiaoD_info": "",
						juexiaoE: "决笑",
						"juexiaoE_info": "",
						touziA: "投资",
						"touziA_info": "出牌阶段，你可以交给一名其他角色至多三张牌，并令其获得等量的“投资”标记，当其造成伤害后移去一个标记，然后你摸一张牌；你的下一个回合开始时，移去标记；拥有“投资”标记的角色至多唯一，其无法成为“做空”的目标。",
						touziB: "投资",
						"touziB_info": "",
						touziC: "投资",
						"touziC_info": "",
						touziD: "投资",
						"touziD_info": "",
						zuokongA: "做空",
						"zuokongA_info": "出牌阶段，你可以令一名其他角色交给你一张手牌，然后其获得“做空”标记，当其造成伤害后移去标记，然后你交给其一张手牌；你的下一个回合开始时，移去标记；拥有“做空”标记的角色至多唯一，其无法成为“投资”的目标。",
						zuokongB: "做空",
						"zuokongB_info": "",
						zuokongC: "做空",
						"zuokongC_info": "",
						zuokongD: "做空",
						"zuokongD_info": "",
						modengA: "魔灯",
						"modengA_info": "限定技，出牌阶段，你可以选择一名其他角色与你各摸一张牌，然后对你与其之间的角色各造成1点雷属性伤害。",
						tutuA: "兔兔",
						"tutuA_info": "出牌阶段和游戏开始时，若你没有“兔兔”，你可以摸一张牌并将一张手牌置于武将牌上称为“兔兔”。",
						tutuB: "兔兔",
						"tutuB_info": "",
						zhenchaA: "侦察",
						zhenchaA_info: "①锁定技，你攻击范围内的其他角色的手牌对你始终可见；②锁定技，你不是其他角色使用带有「伤害」标签的锦囊牌的合法目标；③出牌阶段开始时，你可以选择一名不在你攻击范围内的其他角色，令该角色本局游戏视为在你攻击范围内。",
						huoshiA: "火矢",
						huoshiA_info: "出牌阶段限一次，你可以对任意名其他角色视为使用一张无距离限制且不计入次数的火【杀】，此牌结算X次（X为你攻击范围内的角色数）。",
						yanhuA: "掩护",
						"yanhuA_info": "①锁定技，每回合限三次，当你受到伤害时，若伤害来源不为你且在你的攻击范围内，则防止此伤害。②当已受伤的其他角色受到伤害时，若你不为伤害来源，你可以获得三张非基本牌，然后将此伤害降低至1点转移给你。",
						molinA: "魔鳞",
						"molinA_info": "准备阶段你摸两张牌，本回合你的手牌上限+2，结束阶段，若你本回合没有造成过伤害，你受到1点无来源伤害。",
						molinB: "魔鳞",
						"molinB_info": "",
						molinC: "魔鳞",
						"molinC_info": "",
						heisheA: "黑蛇",
						"heisheA_info": "出牌阶段限一次，若你的体力值为1，你可以摸两张牌并令你本阶段使用【杀】无次数限制。若此阶段你没有杀死过角色，则回复1点体力并失去此武将牌上的技能，然后获得技能“见习”。(☆见习：当你使用【杀】仅指定一个目标后，若其手牌数大于你的体力值，此【杀】不能被【闪】响应。)",
						heisheB: "黑蛇",
						"heisheB_info": "",
						heisheC: "黑蛇",
						"heisheC_info": "",
						jianxiA: "见习",
						"jianxiA_info": "当你使用【杀】仅指定一个目标后，若其手牌数大于你的体力值，你可以令其横置且此【杀】不能被【闪】响应。",
						xunlinA: "巡林",
						"xunlinA_info": "当你使用【杀】仅指定一个目标后，若其手牌数不大于你的体力值，你可以令其横置且此【杀】不能被【闪】响应。",
						liaoyangA: "疗养",
						"liaoyangA_info": "当一名角色出牌阶段结束时，若其已受伤且体力值为1，你可以弃置一张红色手牌令其回复1点体力。",
						zhuichaA: "追查",
						"zhuichaA_info": "锁定技，若你的装备区里没有防具牌，你计算与其他角色的距离-1；出牌阶段开始时，获得你装备区里的防具牌。",
						shenpanA: "审判",
						"shenpanA_info": "当你使用【杀】仅指定距离1以内的一个目标后，你可以弃置一张黑色手牌对其造成1点雷属性伤害。",
						shenpanB: "审判",
						"shenpanB_info": "",
						buxunA: "捕蕈",
						"buxunA_info": "出牌阶段限一次，你可以选择一名其他角色，从牌堆顶亮出四张牌，该角色选择其中两张花色相同的牌，令你与其各获得其中一张，然后将剩余未分组的牌置入弃牌堆，若未分组的牌超过两张，则你与其“冻结”。",
						buxunB: "捕蕈",
						"buxunB_info": "",
						buxunC: "捕蕈",
						"buxunC_info": "",
						anmianA: "安眠",
						"anmianA_info": "弃牌阶段开始时，若你被“冻结”，你可以跳过此阶段。(“冻结”的角色本回合结束前无法使用或打出手牌，处于濒死状态时除外。)",
						mengyouA: "梦游",
						"mengyouA_info": "结束阶段，你可以将任意张手牌扣置于武将牌上称为“梦”，然后摸等量的牌；准备阶段，你弃置与“梦”等量的手牌，并获得全部“梦”。",
						mengyouB: "梦游",
						"mengyouB_info": "",
						dengshenA: "登神",
						"dengshenA_info": "觉醒技，准备阶段，若你装备区里牌的数量大于1，你增加1点体力上限并回复1点体力，获得技能“神心”。(☆神心：使命技，摸牌阶段多摸X张牌，你的手牌上限-X，X为当前你装备区里牌的数量。失败：当你受到大于1点的雷属性伤害后，你失去1点体力上限。)",
						shenxinA: "神心",
						"shenxinA_info": "使命技，摸牌阶段多摸X张牌，你的手牌上限-X。失败：当你受到大于1点的雷属性伤害后，你失去1点体力上限。(X为当前你装备区里牌的数量)",
						shenxinB: "神心",
						"shenxinB_info": "",
						shenxinC: "神心",
						"shenxinC_info": "",
						weishenA: "伪神",
						"weishenA_info": "主公技，其他须弥势力角色的出牌阶段限一次，其可以将手牌中的一张装备牌置入你空余的装备区。",
						weishenB: "伪神",
						"weishenB_info": "",
						weishenC: "伪神",
						"weishenC_info": "",
						kuaidiA: "快递",
						"kuaidiA_info": "出牌阶段限一次，你可以选择一名其他角色成为目标，然后你与下家角色依次交换座次，直到你与目标角色相邻，本阶段你获得技能“签收”，出牌阶段结束时，你返回本阶段使用此技能前的座次。",
						kuaidiB: "快递",
						"kuaidiB_info": "",
						maobuA: "猫步",
						"maobuA_info": "当你于回合外受到伤害后，你可以令伤害来源横置并获得其装备区里至多一张牌，同时你与下家角色依次交换座次，直到你与伤害来源距离最远，本回合结束阶段，你返回本回合使用此技能前的座次。",
						maobuB: "猫步",
						"maobuB_info": "",
						maobuC: "猫步",
						"maobuC_info": "",
						qianshouA: "签收",
						"qianshouA_info": "出牌阶段，你可以将任意张手牌交给座次相邻的角色，每名角色在本阶段第一次以此法获得手牌时，你摸一张牌。",
						qianshouB: "签收",
						"qianshouB_info": "",
						wuxieA: "无邪",
						"wuxieA_info": "出牌阶段限一次，你可以展示一张手牌并给其他角色，然后你摸一张牌，若展示的牌为【桃】你改为摸两张牌；当你使用【桃】时，你可以摸一张牌。",
						wuxieB: "无邪",
						"wuxieB_info": "",
						yueguiA: "月桂",
						"yueguiA_info": "弃牌阶段开始时，若你的手牌数大于当前体力，你可以弃置两张手牌，令一名已受伤的角色恢复1点体力并解除横置。",
						baiyuA: "白玉",
						"baiyuA_info": "限定技，出牌阶段，若有角色体力值为1，你可以摸三张牌并将至多三张手牌置于武将牌上称为“萝”，你获得技能“萝卜”。(☆萝卜：当一名角色处于濒死状态时，你可以将“萝”当【桃】使用。)",
						luoboA: "萝卜",
						"luoboA_info": "当一名角色处于濒死状态时，你可以将“萝”当【桃】使用。",
						zhiyanA: "直言",
						"zhiyanA_info": "出牌阶段限一次，你可以弃置任意角色装备区里的一张牌，然后令其摸两张牌并解除横置，若弃置的牌为坐骑牌，你额外摸一张牌。",
						lianzhenB: "廉贞",
						"lianzhenB_info": "当你受到伤害时，你可以防止此伤害并失去1点体力，然后你复原武将牌。",
						jiedaiA: "借贷",
						"jiedaiA_info": "出牌阶段限一次，你可以获得其他角色装备区里的一张牌，出牌阶段结束后，其获得你装备区里的一张牌，若你装备区里没有牌，则改为其对你造成1点伤害。",
						jiedaiB: "借贷",
						"jiedaiB_info": "",
						jiedaiC: "借贷",
						"jiedaiC_info": "",
						lingganA: "灵感",
						"lingganA_info": "当你失去装备区里的牌后，你可以令一名其他角色横置，若其已横置则改为令其解除横置并对其造成1点伤害。",
						pojuA: "破局",
						"pojuA_info": "出牌阶段限X次，你可以将一张手牌当作【过河拆桥】使用。(每回合投掷一枚骰子，X为骰子的点数)",
						pojuB: "骰子",
						"pojuB_info": "",
						pojuC: "骰子",
						"pojuC_info": "",
						changkaoA: "长考",
						"changkaoA_info": "你的回合内限一次，当其他角色的牌因弃置而置入弃牌堆时，你可以获得之。",
						changkaoB: "长考",
						"changkaoB_info": "",
						luanlanA: "乱岚",
						luanlanA_info: "①锁定技，游戏开始时或你的回合开始时，全场所有未横置的角色强制横置。②锁定技，你防止即将受到的属性伤害。已横置的所有其他角色手牌上限固定为1且无法使用回复类基本牌。",
						chirenA: "赤刃",
						chirenA_info: "璃月技，锁定技，①判定/弃牌阶段开始时，你可以跳过此阶段，视为使用一张无次数、距离限制，且可以指定任意名目标的" + get.ygeBolInformX("风【杀】", "出牌阶段，对你攻击范围内的一名角色使用。其须使用一张【闪】，否则你对其造成1点伤害，然后其随机执行一项：①翻面；②弃置所有牌。") + "。②一名其他角色的回合结束时，你获得本回合进入弃牌堆的非伤害类牌。",
						kongjingA: "空净",
						kongjingA_info: "稻妻技，①每回合限五次，当其他角色使用普通锦囊牌或带有「伤害」标签的基本牌指定你为目标时，其需交给你一张类型、花色均相同的牌，否则你令此牌无效并获得其一张牌。②锁定技，其他角色无法使用延时锦囊牌指定你为目标。③一名角色的回合结束时，若你本回合未受到过伤害，则你将手牌摸至X张。（X为全场已横置角色数和你的体力上限间的较大值）",
						exiA: "恶戏",
						"exiA_info": "出牌阶段限一次，你可以令一名其他角色视为对你使用一张【决斗】。",
						menghunA: "蒙混",
						"menghunA_info": "当你受到【决斗】造成的伤害后，你可以摸两张牌。",
						gongyinA: "共饮",
						"gongyinA_info": "当你不处于濒死状态时，你使用【酒】可以额外指定一个目标并令其“冻结”。(“冻结”的角色无法使用或打出手牌，处于濒死状态时除外。本回合结束时解除“冻结”。)",
						qijingA: "奇境",
						"qijingA_info": "锁定技，当你于回合内使用一张牌后，若是本回合首次使用此类别的牌，你获得一个“奇境”标记。",
						qijingB: "奇境",
						"qijingB_info": "",
						qijingC: "奇境",
						"qijingC_info": "",
						qijingD: "奇境",
						"qijingD_info": "",
						qijingE: "奇境",
						"qijingE_info": "",
						tanxunA: "探寻",
						"tanxunA_info": "锁定技，结束阶段，你观看牌堆顶的三张牌并以任意顺序置于牌堆顶，若你有“奇境”标记则移去一个标记，然后摸一张牌并重复此流程，若你本回合将以此法获得三张牌则翻面。",
						mituA: "迷途",
						"mituA_info": "锁定技，当你背面向上时，其他角色计算与你的距离+X。(X为存活的其他角色数)",
						jianguA: "鉴古",
						"jianguA_info": "出牌阶段限一次，你可以获得你装备区里的一张牌。",
						hongshengA: "红绳",
						"hongshengA_info": "你的回合内限一次，当你使用红色普通锦囊牌时，你可以令一名其他角色“冻结”，当一名角色死亡后，此技能视为未发动过。",
						hongshengB: "红绳",
						"hongshengB_info": "",
						fuhunA: "缚魂",
						"fuhunA_info": "当一名“冻结”角色受到伤害后，你可以令伤害来源摸两张牌。(“冻结”的角色无法使用或打出手牌，处于濒死状态时除外。本回合结束时解除“冻结”。)",
						huxinA: "护心",
						"huxinA_info": "当你受到伤害时，你可以展示并弃置牌堆顶的一张牌，若为锦囊牌则此伤害-1，若不为锦囊牌则你获得之。",
						saochuA: "扫除",
						"saochuA_info": "你对距离1以内的角色使用【杀】不能被【闪】响应。",
						quanmouA: "权谋",
						"quanmouA_info": "锁定技，每回合限一次，当你于出牌阶段使用带有「伤害」标签的基本牌或普通锦囊牌指定目标后，你可以猜测其中的一个目标的手牌中是否有基本牌，锦囊牌或装备牌。若你至少猜对了：一项，你获得〖慧识〗、〖看破〗直至下回合开始；两项，你获得〖神著〗、〖铁骑〗直到下回合开始；三项，你获得技能〖北定〗和〖水剑〗直到下回合开始。",
						jinghuaA: "镜花",
						"jinghuaA_info": "锁定技，①每回合限三次，当其他角色使用带有「伤害」标签的基本牌或普通锦囊牌指定你为目标时，你取消此目标并获得此牌对应的实体牌。②你始终跳过判定阶段。③其他角色的回合结束时，你观看其手牌。",
						shuijianA: "水剑",
						"shuijianA_info": "每回合限X次，你使用牌对其他角色造成的伤害+Y(X为你的体力上限的一半（向上取整），Y为目标角色手牌中的花色数)。",
						shiyaoA: "狮咬",
						"shiyaoA_info": "锁定技，若你已受伤，你计算与其他角色的距离-1。当你使用【杀】仅指定距离1以内的一个目标时，此【杀】不计入次数。",
						youzhuA: "佑助",
						"youzhuA_info": "其他角色使用【杀】仅指定除你外的一个目标后，若你在其攻击范围内，你可以摸一张牌令此【杀】无效，并视为其对你使用一张火【杀】。",
						chiyongA: "炽勇",
						"chiyongA_info": "①出牌阶段限一次，你可以选择任意名其他角色，令这些角色获得〖焰魂〗至你下个回合开始。②锁定技，你使用红色牌基本牌或普通锦囊牌无距离、次数限制且不可被其他角色响应。",
						eyunA: "厄运",
						"eyunA_info": "①锁定技，当你成为其他角色使用牌的目标后，此牌有50%的概率失效且你随机弃置一张牌。②锁定技，无〖焰魂〗的其他角色的回合开始时，随机进行下列可执行项：1.进行【闪电】判定；2.进行【乐不思蜀】判定；3.受到1点无来源的火焰伤害。",
						yanhunA: "焰魂",
						"yanhunA_info": "①锁定技，当你对一名其他角色造成伤害时，你选择一项：①令所有拥有〖焰魂〗的角色摸2X张牌并恢复X+1点体力。（X为伤害值）②令此伤害值翻倍。",
					},
				};
				for (var i in genshinImact.character) {
					genshinImact.character[i][4].push('ext:原梗Enhanced/image/character/' + i + '.jpg');
					genshinImact.character[i][4].push('die:ext:原梗Enhanced/audio/die/' + i + '.mp3');
				}
				return genshinImact;
			});
			let charPack = {//添加武将包
				GenshinImpactEnhanced: {
					translate: '原梗Enhanced',
				},
			};
			for (let packName in charPack) {//首次导入开启将包
				lib.config.all.characters.push(packName);
				if (!lib.config[packName + '_character_pack_open']) {
					lib.config.characters.add(packName);
					game.saveConfig('characters', lib.config.characters);
					game.saveConfig(packName + '_character_pack_open', true);
				};
				lib.translate[packName + '_character_config'] = charPack[packName].translate || '未知武将包';
			};
			//DIY卡牌部分
			game.import('card', function () {
				var GenshinImpactEnhanced = {
					name: "原梗衍生",
					connect: false,
					card: {//各种DIY卡牌的放置区域，需要注意的是，卡牌调用的技能不要写在这里，而是当做普通技能写在之前的地方。
						tianquanbengyuA: {
							fullskin: false,
							type: "trick",
							image: "ext:原梗Enhanced/image/card/天权崩玉.jpg",
							enable: true,
							selectTarget: -1,
							reverseOrder: true,
							filterTarget: function (card, player, target) {
								return target != player;
							},
							content: function () {
								"step 0";
								if (typeof event.shanRequired != "number" || !event.shanRequired || event.shanRequired < 0) event.shanRequired = 2;
								if (typeof event.baseDamage != "number") event.baseDamage = 1;
								"step 1";
								if (event.directHit) event._result = { bool: false };
								else {
									var next = target.chooseToRespond();
									next.set("filterCard", function (card, player) {
										if (get.name(card) != "shan") return false;
										return lib.filter.cardRespondable(card, player);
									});
									if (event.shanRequired > 1) {
										next.set("prompt2", "共需打出" + event.shanRequired + "张闪");
									}
									next.set("ai", function (card) {
										var evt = _status.event.getParent();
										if (get.damageEffect(evt.target, evt.player, evt.target) >= 0) return 0;
										if (evt.player.hasSkillTag("notricksource")) return 0;
										if (evt.target.hasSkillTag("notrick")) return 0;
										if (evt.target.hasSkillTag("noShan")) {
											return -1;
										}
										return get.order(card);
									});
									next.set("respondTo", [player, card]);
									next.autochoose = lib.filter.autoRespondShan;
								}
								"step 2";
								if (result.bool == false) {
									target.damage();
								} else {
									event.shanRequired--;
									if (event.shanRequired > 0) event.goto(1);
								}
							},
							ai: {
								wuxie: function (target, card, player, viewer) {
									if (get.attitude(viewer, target) > 0 && !target.countCards("h", "shan")) {
										if (!target.countCards("h") || target.hp == 1) return 1;
									}
								},
								basic: {
									order: 9,
									useful: 1,
									value: 5,
								},
								result: {
									player: function (player, target) {
										if (target.hp > 1 && target.hasSkillTag("respondShan", true, "respond", true)) return 0;
										let known = target.getKnownCards(player);
										// 统计已知闪/护符数量
										let knownShanCount = known.filter(card => {
											let name = get.name(card, target);
											return (name === "shan" || name === "hufu") && lib.filter.cardRespondable(card, target);
										}).length;
										// 检查已知无懈
										let hasKnownWuxie = known.some(card => {
											let name = get.name(card, target);
											return name === "wuxie" && lib.filter.cardEnabled(card, target, "forceEnable");
										});
										// 如果已知无懈可用 → 直接放弃
										if (hasKnownWuxie || knownShanCount >= 2) return 0;
										if (target.hp > 1 || target.countCards("hs", i => !known.includes(i)) > 4 - (2 * target.hp) / target.maxHp) return 0;
										let res = 0,
											att = get.sgnAttitude(player, target);
										res -= att * (0.8 * target.countCards("hs") + 0.6 * target.countCards("e") + 3.6);
										if (get.mode() === "identity" && target.identity === "fan") res += 2.4;
										if (get.mode() === "identity" && player.identity === "zhu" && (target.identity === "zhong" || target.identity === "mingzhong")) res -= 0.8 * player.countCards("he");
										return res;
									},
									target: function (player, target) {
										let zhu = (get.mode() === "identity" && target.isZhu) || target.identity === "zhu";
										if (!lib.filter.cardRespondable({ name: "shan" }, target)) {
											if (zhu) {
												if (target.hp < 2) return -99;
												if (target.hp === 2) return -3.6;
											}
											return -2;
										}
										// 已知手牌
										let known = target.getKnownCards(player);
										// 已知闪/护符数量
										let knownShanCount = known.filter(card => {
											let name = get.name(card, target);
											return (name === "shan" || name === "hufu") && lib.filter.cardRespondable(card, target);
										}).length;
										// 已知无懈
										let hasKnownWuxie = known.some(card => {
											let name = get.name(card, target);
											return name === "wuxie" && lib.filter.cardEnabled(card, target, "forceEnable");
										});
										// 如果已知有无懈可击或者有两张以上的闪 → 威胁值降低
										if (hasKnownWuxie || knownShanCount >= 2) return -1.2;
										// 未知手牌数量
										let nh = target.countCards("hs", i => !known.includes(i));
										if (zhu && target.hp <= 1) {
											if (nh === 0) return -99;
											if (nh === 1) return -60;
											if (nh === 2) return -36;
											if (nh === 3) return -8;
											return -5;
										}
										if (target.hasSkillTag("respondShan", true, "respond", true)) return -1.35;
										if (!nh || nh < 2) return -2;
										return -1.5;
									},
								},
								tag: {
									respond: 1,
									respondShan: 1,
									damage: 1,
									multitarget: 1,
									multineg: 1,
								},
							},
						},
						lieyanyaoshuiA: {
							fullskin: true,
							image: "ext:原梗Enhanced/image/card/lieyanyaoshuiA.png",
							type: "trick",
							enable: true,
							selectTarget: 1,
							filterTarget: function (card, player, target) {
								return player != target;
							},
							content: function () {
								target.damage(1, "fire");
								if (!target.hasSkill("lianjin_zhuoshao"))
									target.addTempSkill("lianjin_zhuoshao", { player: "phaseEnd" });
							},
							ai: {
								basic: {
									order: 6,
									value: [8, 1],
									useful: 4,
								},
								result: {
									player: 1,
									target: -4,
								},
								wuxie: function (target, card, player, viewer) {
									if (player == game.me && get.attitude(viewer, player) <= 0) {
										return 1;
									}
								},
								tag: {
									damage: 1,
									fireDamage: 1,
									natureDamage: 1,
								},
							},
						},
						fengbaoyaoshuiA: {
							fullskin: true,
							image: "ext:原梗Enhanced/image/card/fengbaoyaoshuiA.png",
							type: "trick",
							enable: true,
							selectTarget: 1,
							filterTarget: function (card, player, target) {
								return player != target;
							},
							content: function () {
								target.damage(1, "thunder");
								if (!target.hasSkill("lianjin_mabi")) {
									target.addTempSkills(["lianjin_mabi", "fengyin"], { player: "phaseEnd" });
								}
							},
							ai: {
								basic: {
									order: 6,
									value: [8, 1],
									useful: 4,
								},
								result: {
									player: 1,
									target: -6,
								},
								wuxie: function (target, card, player, viewer) {
									if (player == game.me && get.attitude(viewer, player) <= 0) {
										return 1;
									}
								},
								tag: {
									damage: 1,
									natureDamage: 1,
									thunderDamage: 1,
								},
							},
						},
						jihanyaoshuiA: {
							fullskin: true,
							image: "ext:原梗Enhanced/image/card/jihanyaoshuiA.png",
							type: "trick",
							enable: true,
							selectTarget: 1,
							filterTarget: function (card, player, target) {
								return player != target;
							},
							content: function () {
								target.damage(1, "ice");
								if (!target.hasSkill("ygzq_dongjie"))
									target.addTempSkill("ygzq_dongjie", { player: "phaseEnd" });
							},
							ai: {
								basic: {
									order: 6,
									value: [8, 1],
									useful: 4,
								},
								result: {
									player: 1,
									target: -8,
								},
								wuxie: function (target, card, player, viewer) {
									if (player == game.me && get.attitude(viewer, player) <= 0) {
										return 1;
									}
								},
								tag: {
									damage: 1,
									natureDamage: 1,
								},
							},
						},
						shengmingyaoshuiA: {
							fullskin: true,
							image: "ext:原梗Enhanced/image/card/shengmingyaoshuiA.png",
							type: "trick",
							enable: true,
							selectTarget: 1,
							filterTarget: function (card, player, target) {
								return target.isDamaged();
							},
							content: function () {
								target.gainMaxHp();
								target.recover(2);
							},
							ai: {
								wuxie: function (target, card, player, viewer) {
									if (player == game.me && get.attitude(viewer, target) <= 0) {
										return 1;
									}
								},
								basic: {
									order: 5,
									useful: 1,
									value: 7,
								},
								result: {
									target: 1,
									player: function (player, target, card) {
										if (get.attitude(player, target) > 0 && get.attitude(target, player) > 0) {
											return 2;
										}
										if (get.attitude(player, target) <= 0 && get.attitude(target, player) <= 0) {
											return -2;
										}
										return -0.5;
									},
								},
								tag: {
									recover: 1,
								},
							},
						},
						fusuyaoshuiA: {
							fullskin: true,
							image: "ext:原梗Enhanced/image/card/fusuyaoshuiA.png",
							type: "trick",
							enable: true,
							selectTarget: -1,
							toself: true,
							filterTarget: function (card, player, target) {
								return target == player;
							},
							content: function () {
								target.chooseToGuanxing(6);
								target.draw(4);
							},
							ai: {
								basic: {
									order: 7,
									useful: 7,
									value: 10,
								},
								result: {
									target: 5,
								},
								tag: {
									draw: 4,
								},
							},
						},
						ninglangguangjianA: {
							fullskin: false,
							image: "ext:原梗Enhanced/image/card/ninglangguangjianA.jpg",
							type: "zhuomeng_yansheng",
							vanish: true,
							enable: true,
							selectTarget: 1,
							filterTarget: function (card, player, target) {
								return player != target;
							},
							content: function () {
								target.damage();
								player.isDamaged() ? player.recover() : player.changeHujia();
							},
							ai: {
								basic: {
									order: 8,
									value: [10, 3],
									useful: [7, 3],
								},
								result: {
									player: 2,
									target: -1,
								},
								tag: {
									damage: 1,
									recover: 1,
								},
							},
						},
						chaojuanbingxueA: {
							fullskin: false,
							image: "ext:原梗Enhanced/image/card/chaojuanbingxueA.png",
							type: "zhuomeng_yansheng",
							vanish: true,
							enable: true,
							selectTarget: -1,
							filterTarget: function (card, player, target) {
								return player != target;
							},
							content: function () {
								target.loseHp();
								var he = target.getCards("he");
								if (he.length) {
									target.discard(he.randomGets(2));
								}
							},
							ai: {
								basic: {
									order: 7,
									value: [10, 3],
									useful: [6, 3],
								},
								result: {
									target: -4,
								},
							},
						},
						guangchaohuanxiangA: {
							fullskin: false,
							image: "ext:原梗Enhanced/image/card/guangchaohuanxiangA.jpg",
							type: "zhuomeng_yansheng",
							vanish: true,
							enable: true,
							selectTarget: 1,
							filterTarget: function (card, player, target) {
								return player != target && (!target.hasJudge("lebu") || target.countCards("e") > 0);
							},
							content: function () {
								"step 0";
								var es = target.getCards("e");
								if (es.length) {
									target.discard(es);
								}
								"step 1";
								if (!target.hasJudge("lebu")) {
									target.addJudge(game.createCard("lebu"));
								}
							},
							ai: {
								basic: {
									order: 3,
									value: [8, 3],
									useful: [5, 3],
								},
								result: {
									target: -1,
								},
							},
						},
						jilijianA: {
							fullskin: false,
							image: "ext:原梗Enhanced/image/card/祭礼剑.gif",
							type: "equip",
							subtype: "equip1",
							distance: {
								attackFrom: -4,
							},
							skills: ["jilijianA_skill"],
							ai: {
								basic: {
									equipValue: 3,
									order: (card, player) => {
										const equipValue = get.equipValue(card, player) / 20;
										return player && player.hasSkillTag("reverseEquip") ? 8.5 - equipValue : 8 + equipValue;
									},
									useful: 2,
									value: (card, player, index, method) => {
										if (!player.getCards("e").includes(card) && !player.canEquip(card, true)) return 0.01;
										const info = get.info(card),
											current = player.getEquip(info.subtype),
											value = current && card != current && get.value(current, player);
										let equipValue = info.ai.equipValue || info.ai.basic.equipValue;
										if (typeof equipValue == "function") {
											if (method == "raw") return equipValue(card, player);
											if (method == "raw2") return equipValue(card, player) - value;
											return Math.max(0.1, equipValue(card, player) - value);
										}
										if (typeof equipValue != "number") equipValue = 0;
										if (method == "raw") return equipValue;
										if (method == "raw2") return equipValue - value;
										return Math.max(0.1, equipValue - value);
									},
								},
								result: {
									target: (player, target, card) => get.equipResult(player, target, card.name),
								},
							},
							enable: true,
							selectTarget: -1,
							filterTarget: (card, player, target) => player == target && target.canEquip(card, true),
							modTarget: true,
							allowMultiple: false,
							content: function () {
								if (!card?.cards || card.cards.every(cardx => get.position(cardx, true) === "o")) {
									target.equip(card);
								}
							},
							toself: true,
						},
						xiantiaoqiangA: {
							fullskin: false,
							image: "ext:原梗Enhanced/image/card/xiantiaoqiangA.png",
							type: "delicacies",
							vanish: true,
							enable: true,
							selectTarget: 1,
							filterTarget: function (card, player, target) {
								return !target.hasSkill("xiantiaoqiangA_effect");
							},
							content: function () {
								target.addSkills(["xiantiaoqiangA_effect", "sbwusheng"]);
							},
							ai: {
								basic: {
									order: 7,
									value: [8, 3],
									useful: [5, 3],
								},
								result: {
									target: 7,
								},
							},
						},
						duigaogaoA: {
							fullskin: false,
							image: "ext:原梗Enhanced/image/card/duigaogaoA.png",
							type: "delicacies",
							vanish: true,
							enable: true,
							selectTarget: 1,
							filterTarget: function (card, player, target) {
								return !target.hasSkill("duigaogaoA_effect");
							},
							content: function () {
								target.addSkills(["duigaogaoA_effect", "ollongdan"]);
							},
							ai: {
								basic: {
									order: 7,
									value: [6, 3],
									useful: [5, 3],
								},
								result: {
									target: 6,
								},
							},
						},
						huangyouxiexieA: {
							fullskin: false,
							image: "ext:原梗Enhanced/image/card/huangyouxiexieA.png",
							type: "delicacies",
							vanish: true,
							enable: true,
							selectTarget: 1,
							filterTarget: function (card, player, target) {
								return !target.hasSkill("huangyouxiexieA_effect");
							},
							content: function () {
								target.addSkills(["huangyouxiexieA_effect", "zhichi"]);
							},
							ai: {
								basic: {
									order: 7,
									value: [7, 3],
									useful: [4, 3],
								},
								result: {
									target: 4,
								},
							},
						},
						jueyunguobaA: {
							fullskin: false,
							image: "ext:原梗Enhanced/image/card/jueyunguobaA.png",
							type: "delicacies",
							vanish: false,
							enable: true,
							selectTarget: [1, 3],
							filterTarget: function (card, player, target) {
								return (
									target != player &&
									(get.mode() != "guozhan" ||
										_status.mode == "yingbian" ||
										_status.mode == "free" ||
										target.countCards("e") > 0)
								);
							},
							content: function () {
								"step 0"
								if (!target.getCards("e").length) {
									target.damage('fire', 2);
									event.finish();
								}
								target
									.chooseControl("discard_card", "take_damage", function (event, player) {
										let eff = get.damageEffect(player, event.player, player, "fire");
										if (eff > 0) return "take_damage";
										if (player.hasSkillTag("noe")) return "discard_card";
										if (!eff) return "take_damage";
										if (
											player.isDamaged() &&
											player.hasCard(
												(card) =>
													get.name(card) == "baiyin" &&
													get.recoverEffect(player, player, _status.event.player) > 0,
												"e"
											)
										)
											return "discard_card";
										if (
											player.hasCard((card) => get.value(card, player) <= 0, "e") &&
											!player.hasCard(
												(card) => get.value(card, player) > Math.max(7, 12 - player.hp),
												"e"
											)
										)
											return "discard_card";
										if (
											(player.hp > 2 && player.countCards("e") > 2) ||
											(player.hp > 1 && player.countCards("e") > 3)
										)
											return "take_damage";
										return "discard_card";
									})
									.set("prompt", "绝云锅巴")
									.set(
										"prompt2",
										"请选择一项：⒈弃置装备区里的所有牌(至少一张)；⒉受到" +
										get.translation(player) +
										"造成的2点火焰伤害。"
									);
								"step 1"
								if (result.control == "discard_card") {
									target.discard(
										target.getCards("e", function (card) {
											return lib.filter.cardDiscardable(card, target, "jueyunguobaA");
										})
									);
								} else {
									target.damage('fire', 2);
								}
								event.finish();
							},
							ai: {
								canLink: function (player, target, card) {
									if (
										!target.isLinked() ||
										player.hasSkill("jueqing") ||
										target.hasSkill("gangzhi") ||
										player.hasSkill("gangzhi")
									)
										return false;
									let es = target.getCards("e"),
										val = 0;
									if (!es.length) return true;
									for (let i of es) {
										if (i.name == "baiyin" && target.isDamaged() && get.recoverEffect(target))
											val += get.value({ name: "tao" }, target);
										else val -= get.value(i, target);
									}
									if (0.15 * val > 2 * get.sgn(get.damageEffect(target, player, target, "fire")))
										return false;
									return true;
								},
								order: 6,
								value: 4,
								useful: 2,
								tag: {
									damage: 1,
									fireDamage: 1,
									natureDamage: 1,
									loseCard: 1,
								},
								result: {
									target: function (player, target, card, isLink) {
										let es = target.getCards("e"),
											eff = 2 * get.sgn(get.damageEffect(target, player, target, "fire"));
										if (isLink || !es.length) return eff;
										let val = 0;
										for (let i of es) {
											if (i.name == "baiyin" && target.isDamaged() && get.recoverEffect(target))
												val += 6;
											else val -= get.value(i, target);
										}
										return Math.max(eff, 0.15 * val);
									},
								},
							},
						},
						lianhuasuA: {
							fullskin: false,
							image: "ext:原梗Enhanced/image/card/lianhuasuA.png",
							type: "delicacies",
							vanish: true,
							enable: true,
							selectTarget: 1,
							filterTarget: function (card, player, target) {
								return !target.hasSkill("lianhuasuA_effect");
							},
							content: function () {
								target.addSkill("lianhuasuA_effect");
							},
							ai: {
								basic: {
									order: 7,
									value: [8, 3],
									useful: [4, 3],
								},
								result: {
									target: 5,
								},
							},
						},
						tiwatejiandanA: {
							fullskin: false,
							image: "ext:原梗Enhanced/image/card/tiwatejiandanA.png",
							type: "delicacies",
							vanish: true,
							toself: true,
							enable: function (card, player) {
								return player.hp <= 0;
							},
							savable: true,
							selectTarget: -1,
							filterTarget: function (card, player, target) {
								return target == player && target.hp <= 0;
							},
							modTarget: function (card, player, target) {
								return target.hp <= 0;
							},
							content: function () {
								target.recover(1 - target.hp);
							},
							ai: {
								basic: {
									order: 10,
									value: 8,
									useful: [4, 3],
								},
								result: {
									target: (player, target) => {
										return 9;
									},
								},
								tag: {
									recover: 1,
									save: 1,
								},
							},
						},
						tiantianhuaniangjiA: {
							fullskin: false,
							image: "ext:原梗Enhanced/image/card/tiantianhuaniangjiA.png",
							type: "delicacies",
							vanish: true,
							enable: true,
							selectTarget: 1,
							filterTarget: true,
							content: function () {
								'step 0'
								target.link(false);
								target.turnOver(false);
								'step 1'
								if (target.hp < target.maxHp) {
									target.recover();
									event.finish();
								}
								else event.goto(2);
								'step 2'
								target.chooseToGuanxing(4);
								target.draw(2);
							},
							ai: {
								basic: {
									order: 5,
									value: [4, 3],
									useful: [6, 3],
								},
								result: {
									target: 5,
								},
								tag: {
									recover: 0.5,
									draw: 2,
								},
							},
						},
						shouroubohejuanA: {
							fullskin: false,
							image: "ext:原梗Enhanced/image/card/shouroubohejuanA.png",
							type: "delicacies",
							vanish: true,
							enable: true,
							selectTarget: 1,
							filterTarget: function (card, player, target) {
								return !target.hasSkill("shouroubohejuanA_effect");
							},
							content: function () {
								target.addSkill("shouroubohejuanA_effect");
							},
							ai: {
								basic: {
									order: 7,
									value: [8, 3],
									useful: [4, 3],
								},
								result: {
									target: 5,
								},
							},
						},
						zhizuchangleA: {
							fullskin: false,
							image: "ext:原梗Enhanced/image/card/zhizuchangleA.png",
							type: "delicacies",
							vanish: true,
							enable: true,
							selectTarget: 1,
							filterTarget: true,
							content: function () {
								let cards = [];
								for (const key in lib.cardPack) {
									if (Object.prototype.hasOwnProperty.call(lib.cardPack, key)) {
										const list = lib.cardPack[key];
										cards.addArray(list);
									}
								}
								var typelist = ["zhenfa"];
								var gainCardList = [];
								var getType = function (card) {
									var cardType = get.type(card);
									if (cardType) return cardType;
									return card.name;
								};
								for (var i = 0; i < cards.length; i++) {
									var sortedCards = cards.randomSort();//随机排序数组
									var node = sortedCards[i];
									var typex = getType(node);
									if (!typelist.includes(typex)) {
										gainCardList.push(game.createCard(node));
										typelist.push(typex);
										if (gainCardList.length >= target.maxHp + 1) break;
									}
								}
								target.gain(gainCardList, "draw2");
							},
							ai: {
								basic: {
									order: 9,
									value: [7, 3],
									useful: [4, 3],
								},
								result: {
									target: 7.2,
								},
								tag: {
									draw: 5,
								},
							},
						},
						amosizhigongA: {
							fullskin: false,
							image: "ext:原梗Enhanced/image/card/阿莫斯之弓.gif",
							type: "equip",
							subtype: "equip1",
							distance: {
								attackFrom: -5,
							},
							skills: ["amosizhigongA_skill"],
							ai: {
								basic: {
									equipValue: 3,
									order: (card, player) => {
										const equipValue = get.equipValue(card, player) / 20;
										return player && player.hasSkillTag("reverseEquip") ? 8.5 - equipValue : 8 + equipValue;
									},
									useful: 2,
									value: (card, player, index, method) => {
										if (!player.getCards("e").includes(card) && !player.canEquip(card, true)) return 0.01;
										const info = get.info(card),
											current = player.getEquip(info.subtype),
											value = current && card != current && get.value(current, player);
										let equipValue = info.ai.equipValue || info.ai.basic.equipValue;
										if (typeof equipValue == "function") {
											if (method == "raw") return equipValue(card, player);
											if (method == "raw2") return equipValue(card, player) - value;
											return Math.max(0.1, equipValue(card, player) - value);
										}
										if (typeof equipValue != "number") equipValue = 0;
										if (method == "raw") return equipValue;
										if (method == "raw2") return equipValue - value;
										return Math.max(0.1, equipValue - value);
									},
								},
								result: {
									target: (player, target, card) => get.equipResult(player, target, card.name),
								},
							},
							enable: true,
							selectTarget: -1,
							filterTarget: (card, player, target) => player == target && target.canEquip(card, true),
							modTarget: true,
							allowMultiple: false,
							content: function () {
								if (!card?.cards.some(card => get.position(card, true) !== "o")) {
									target.equip(card);
								}
							},
							toself: true,
						},
					},
					skill: {
						lianjin_zhuoshao: {
							popup: false,
							unique: true,
							onremove: true,
							mark: true,
							marktext: "灼",
							forced: true,
							intro: {
								name: "灼烧",
								content: "每使用或打出一张牌，失去1点体力，濒死状态除外。",
							},
							trigger: {
								player: ["respond", "useCard"],
							},
							filter: function (event, player) {
								return player.hp > 0;
							},
							frequent: true,
							content: function () {
								player.loseHp();
							},
							ai: {
								neg: true,
								effect: {//牌的影响
									player: function (card, player, target) {//你使用牌时对你的影响
										return [0, -4.5];
									}
								},
							},
						},
						lianjin_mabi: {
							popup: false,
							unique: true,
							onremove: true,
							mark: true,
							marktext: "麻",
							locked: true,
							intro: {
								name: "麻痹",
								content: "只能使用基本牌且非锁定技失效。",
							},
							mod: {
								cardEnabled2: function (card, player, now) {
									if (get.type(card) != "basic")
										return false;
								},
							},
							ai: {
								neg: true,
							},
						},
						jilijianA_skill: {
							equipSkill: true,
							usable: 3,
							trigger: {
								player: "useCard",
							},
							filter: function (event, player) {
								if (!["trick", "basic"].includes(get.type(event.card))) return false;
								if (get.tag(event.card, "norepeat") || _status.currentPhase != player) return false;
								return event.player.isIn() && player.getLastUsed() != null;
							},
							prompt2: function (event, player) {
								let num = player.getHistory('useSkill', evt => evt.skill == 'jilijianA_skill').length;
								return `令${get.translation(event.card)}额外结算一次？剩余触发次数：${3 - num}`;
							},
							check: function (event, player) {
								return !get.tag(event.card, "norepeat");
							},
							async content(event, trigger, player) {
								trigger.effectCount++;
								game.log(trigger.card, "额外结算了一次");
							},
							mod: {
								targetEnabled: function (card, player, target) {
									if (player != target && get.type2(card) == "trick" && get.color(card) == 'black') return false;
								},
							},
						},
						xiantiaoqiangA_effect: {
							charlotte: true,
							unique: true,
							onremove: true,
							direct: true,
							locked: true,
							mark: true,
							markimage: "extension/原梗Enhanced/image/mark/xiantiaoqiang.png",
							intro: {
								name: "仙跳墙",
								content: function (storage, player) {
									return (
										"使用伤害类牌不可响应且造成的伤害翻倍（剩余" + get.cnNumber(player.countMark("xiantiaoqiangA_effect")) + "回合）"
									);
								},
							},
							init: function (player) {//初始化(好习惯)，获得这个技能时执行的内容
								player.addMark("xiantiaoqiangA_effect", 3);
							},
							trigger: {
								player: "phaseAfter",
							},
							content: function () {
								player.removeMark("xiantiaoqiangA_effect", 1);
								if (player.countMark("xiantiaoqiangA_effect") == 0)
									player.removeSkills(["xiantiaoqiangA_effect", "sbwusheng"]);
							},
							group: ["xiantiaoqiangA_effect_damage", "xiantiaoqiangA_effect_directHit"],
							subSkill: {
								damage: {
									direct: true,
									trigger: {
										source: "damageBegin3",
									},
									filter: function (event, player) {
										return player.isIn() && event.notLink();
									},
									content: function () {
										trigger.num *= 2;
									},
									sub: true,
								},
								directHit: {
									direct: true,
									trigger: {
										player: "useCard",
									},
									filter: function (event, player) {
										return event.card && get.tag(event.card, "damage") && player.isIn();
									},
									content: function () {
										trigger.directHit.addArray(game.filterPlayer(function (current) {
											return current != player && trigger.targets.contains(current);
										}));
									},
									ai: {
										threaten: 1.8,
										damage: true,
										"directHit_ai": true,
									},
									sub: true,
								},
							},
						},
						duigaogaoA_effect: {
							charlotte: true,
							unique: true,
							onremove: true,
							direct: true,
							locked: true,
							mark: true,
							markimage: "extension/原梗Enhanced/image/mark/duigaogao.png",
							intro: {
								name: "堆高高",
								content: function (storage, player) {
									return (
										"使用牌无次数距离限制（剩余" + get.cnNumber(player.countMark("duigaogaoA_effect")) + "回合）"
									);
								},
							},
							init: function (player) {//初始化(好习惯)，获得这个技能时执行的内容
								player.addMark("duigaogaoA_effect", 3);
							},
							trigger: {
								player: "phaseAfter",
							},
							content: function () {
								player.removeMark("duigaogaoA_effect", 1);
								if (player.countMark("duigaogaoA_effect") == 0)
									player.removeSkills(["duigaogaoA_effect", "ollongdan"]);
							},
							mod: {
								targetInRange: function (card, player, target) {
									return true;
								},
								cardUsableTarget: function (card, player, target) {
									return true;
								},
							},
						},
						huangyouxiexieA_effect: {
							charlotte: true,
							unique: true,
							onremove: true,
							direct: true,
							locked: true,
							mark: true,
							markimage: "extension/原梗Enhanced/image/mark/huangyouxiexie.png",
							intro: {
								name: "黄油蟹蟹",
								content: function (storage, player) {
									return (
										"免疫非属性伤害（剩余" + get.cnNumber(player.countMark("huangyouxiexieA_effect")) + "回合）"
									);
								},
							},
							init: function (player) {//初始化(好习惯)，获得这个技能时执行的内容
								player.addMark("huangyouxiexieA_effect", 3);
							},
							trigger: {
								player: "phaseAfter",
							},
							content: function () {
								player.removeMark("huangyouxiexieA_effect", 1);
								if (player.countMark("huangyouxiexieA_effect") == 0)
									player.removeSkills(["huangyouxiexieA_effect", "zhichi"]);
							},
							group: "huangyouxiexieA_effect_mianyi",
							subSkill: {
								mianyi: {
									direct: true,
									trigger: {
										player: "damageBegin4",
									},
									filter: function (event, player) {
										return !event.hasNature();
									},
									content: function () {
										trigger.cancel();
									},
									ai: {
										nodamage: true,
										effect: {
											target: function (card, player, target) {
												if (!get.tag(card, 'naturedamage')) {
													return [0, 0];
												}
											},
										},
									},
									sub: true,
								},
							},
						},
						lianhuasuA_effect: {
							charlotte: true,
							unique: true,
							onremove: true,
							direct: true,
							locked: true,
							mark: true,
							markimage: "extension/原梗Enhanced/image/mark/lianhuasu.png",
							intro: {
								name: "莲花酥",
								content: function (storage, player) {
									return (
										"①无法成为延时类锦囊牌的目标<br>②额定摸牌数和手牌上限均+" + game.countGroup() + "（剩余" + get.cnNumber(player.countMark("lianhuasuA_effect")) + "回合）"
									);
								},
							},
							init: function (player) {//初始化(好习惯)，获得这个技能时执行的内容
								player.addMark("lianhuasuA_effect", 2);
							},
							trigger: {
								player: "phaseAfter",
							},
							content: function () {
								player.removeMark("lianhuasuA_effect", 1);
								if (player.countMark("lianhuasuA_effect") == 0)
									player.removeSkill("lianhuasuA_effect");
							},
							group: "lianhuasuA_effect_defend",
							subSkill: {
								defend: {
									direct: true,
									trigger: {
										player: "phaseDrawBegin2",
									},
									filter: (event, player) => !event.numFixed && player.isIn(),
									content: function () {
										trigger.num += game.countGroup();
									},
									mod: {
										maxHandcard: (player, num) => num + game.countGroup(),
										targetEnabled: function (card, player, target, now) {
											if (get.type(card) == 'delay') return false;
										},
									},
									ai: {
										effect: {
											target: function (card, player, target) {
												if (!get.type(card) == "delay") {
													return [0, 0];
												}
											},
										},
									},
									sub: true,
								},
							},
						},
						shouroubohejuanA_effect: {
							charlotte: true,
							unique: true,
							onremove: true,
							direct: true,
							locked: true,
							mark: true,
							markimage: "extension/原梗Enhanced/image/mark/shouroubohejuan.png",
							intro: {
								name: "兽肉薄荷卷",
								content: function (storage, player) {
									return (
										"其他角色使用一张非基本牌后，你摸一张牌" + "（剩余" + get.cnNumber(player.countMark("shouroubohejuanA_effect")) + "回合）"
									);
								},
							},
							init: function (player) {//初始化(好习惯)，获得这个技能时执行的内容
								player.addMark("shouroubohejuanA_effect", 2);
							},
							trigger: {
								player: "phaseAfter",
							},
							content: function () {
								player.removeMark("shouroubohejuanA_effect", 1);
								if (player.countMark("shouroubohejuanA_effect") == 0)
									player.removeSkill("shouroubohejuanA_effect");
							},
							group: "shouroubohejuanA_effect_draw",
							subSkill: {
								draw: {
									direct: true,
									trigger: {
										global: "useCard",
									},
									filter: function (event, player) {
										return event.player != player && get.type(event.card) != "basic";
									},
									content: function () {
										player.draw();
									},
									ai: {
										threaten: 1.4,
									},
									sub: true,
								},
							},
						},
						amosizhigongA_skill: {
							equipSkill: true,
							forced: true,
							trigger: {
								player: "useCard",
							},
							filter: function (event, player) {
								return event.player.isIn() && event.card && get.tag(event.card, 'damage');
							},
							async content(event, trigger, player) {
								trigger.baseDamage += 2;
							},
							mod: {
								cardUsable: function (card, player, num) {
									if (card.name == "sha") return Infinity;
								},
								targetEnabled: function (card, player, target) {
									if (player != target && get.type(card) == "trick" && get.tag(card, "damage")) return false;
									if (player != target && card.name == "sha" && !card.nature) return false;
								},
							},
							ai: {
								effect: {
									player: function (card, player, target) {
										if (get.tag(card, 'damage')) return 2;
									},
								},
							},
						},
					},
					translate: {//卡牌的翻译，不写的话游戏里可能无法加载出来
						tianquanbengyuA: "天权崩玉",
						tianquanbengyuA_info: "出牌阶段，对所有其他角色使用。每名目标角色需要打出两张【闪】，否则受到1点神圣伤害。",
						lieyanyaoshuiA: "烈焰药水",
						lieyanyaoshuiA_info: "选择一名其他角色，令其受到1点火焰伤害且进入〖灼烧〗状态至其回合结束。",
						fengbaoyaoshuiA: "风暴药水",
						fengbaoyaoshuiA_info: "选择一名其他角色，令其受到1点雷电伤害且进入〖麻痹〗状态至其回合结束。",
						jihanyaoshuiA: "极寒药水",
						jihanyaoshuiA_info: "选择一名其他角色，令其受到1点冰冻伤害且进入〖冻结〗状态至其回合结束。",
						shengmingyaoshuiA: "生命药水",
						shengmingyaoshuiA_info: "选择一名已受伤角色，令其增加1点体力上限并回复2点体力。",
						fusuyaoshuiA: "复苏药水",
						fusuyaoshuiA_info: "出牌阶段，对你使用。你卜算6，然后摸四张牌。",
						zhuomeng_yansheng: "幻梦",
						ninglangguangjianA: "凝浪光剑",
						ninglangguangjianA_info: "出牌阶段，选择一名其他角色，对其造成1点伤害。然后，若你已受伤则回复1点体力，否则获得1点护甲。",
						chaojuanbingxueA: "潮卷冰削",
						chaojuanbingxueA_info: "令所有其他角色失去1点体力并随机弃置两张牌。",
						guangchaohuanxiangA: "光潮幻象",
						guangchaohuanxiangA_info: "令一名其他角色弃置所有装备牌，并将一张乐不思蜀置于其判定区。",
						jilijianA: "祭礼剑",
						jilijianA_info: "①每回合限三次，当你于回合内使用基本牌和普通锦囊牌时，你可以令此牌额外结算一次。②锁定技，你不是其他角色使用黑色锦囊牌的合法目标。",
						jilijianA_skill: "祭礼剑",
						jilijianA_append: `<div style="width:100%;text-align:left;font-size:13px;font-style:italic">在漫长岁月中石化的道具剑，上面的仪式性装饰依然清晰可见。拥有受时间之风冲刷的祝福力量。</div>`,
						amosizhigongA: "阿莫斯之弓",
						amosizhigongA_info: "①锁定技，你使用【杀】无次数限制。②锁定技，当你使用伤害类牌时，此牌的基础伤害增加2点。③锁定技，你不是其他角色使用带有「伤害」标签的普通锦囊牌和普通【杀】的合法目标。",
						amosizhigongA_append: `<div style="width:100%;text-align:left;font-size:13px;font-style:italic">极为古老的弓。即使原主不复存在，其中蕴藏之力依旧——那种力量无主，却在万物当中。距离心系之物越是遥远，那种力量愈是剧烈。</div>`,
						delicacies: "佳肴",
						xiantiaoqiangA: "仙跳墙",
						xiantiaoqiangA_effect: "仙跳墙",
						xiantiaoqiangA_info: "出牌阶段，对一名角色使用。目标角色获得〖武圣〗（谋）和如下效果：使用伤害类牌不可响应且造成的伤害翻倍，持续三回合。",
						xiantiaoqiangA_append: `<div style="width:100%;text-align:left;font-size:13px;font-style:italic">山珍海味聚一堂，佳肴美馔开坛香。浅尝一口，细化软嫩；细抿几分，回味悠长。从此魂牵梦索自难忘。足以引诱仙人离开自己的仙家洞府。</div>`,
						duigaogaoA: "堆高高",
						duigaogaoA_effect: "堆高高",
						duigaogaoA_info: "出牌阶段，对一名角色使用。目标角色获得〖龙胆〗（界）和如下效果：使用牌无次数距离限制，持续三回合。",
						duigaogaoA_append: `<div style="width:100%;text-align:left;font-size:13px;font-style:italic">食材堆成了赏心悦目的形状，得当的比例让每一层的搭配都好吃不腻。啊，真想它堆得再高一点呀。</div>`,
						huangyouxiexieA: "黄油蟹蟹",
						huangyouxiexieA_effect: "黄油蟹蟹",
						huangyouxiexieA_info: "出牌阶段，对一名角色使用。目标角色获得〖智迟〗和如下效果：免疫非属性伤害，持续两回合。",
						huangyouxiexieA_append: `<div style="width:100%;text-align:left;font-size:13px;font-style:italic">黄油浸润的蟹腿带着馥郁的香气，席卷味蕾，叫人无法抵抗这般鲜香的诱惑。恍惚间已经吃完了蟹肉，却想再抿一抿蟹壳上的黄油，来回味上一刻的美好。</div>`,
						jueyunguobaA: "绝云锅巴",
						jueyunguobaA_info: "出牌阶段，对至多三名其他角色使用。每名目标角色须选择一项：⒈弃置装备区里的所有牌（至少一张）。⒉受到你造成的2点火焰伤害。",
						jueyunguobaA_append: `<div style="width:100%;text-align:left;font-size:13px;font-style:italic">掰一片香脆的锅巴，放上冒着热气的火腿片一同嚼下。脆香鲜辣争先恐后般直奔鼻腔，这酣畅过瘾的滋味，让人连哪怕是指尖的碎渣都不想放过。</div>`,
						lianhuasuA: "莲花酥",
						lianhuasuA_info: "出牌阶段，对一名角色使用。目标角色获得效果：无法成为延时类锦囊牌的目标且额定摸牌数和手牌上限均+X，持续两回合(X为全场势力数)。",
						lianhuasuA_append: `<div style="width:100%;text-align:left;font-size:13px;font-style:italic">璃月的传统点心之一。小心地吹一口气，看那花瓣轻动，仿佛有了自己的生命；闭上眼睛轻咬，甜香化满唇齿。仿佛风动，花开，笛扬，鸟起。</div>`,
						tiwatejiandanA: "提瓦特煎蛋",
						tiwatejiandanA_info: "当有角色处于濒死状态时，对该角色使用。目标角色体力值回复至1点。",
						tiwatejiandanA_append: `<div style="width:100%;text-align:left;font-size:13px;font-style:italic">有着阳光般和煦的口感，只一口便涌入了蓬勃生命力。</div>`,
						tiantianhuaniangjiA: "甜甜花酿鸡",
						tiantianhuaniangjiA_info: "出牌阶段，对一名角色使用。复原目标角色的武将牌，然后若目标角色已受伤，则回复1点体力，否则卜算4，摸两张牌。",
						tiantianhuaniangjiA_append: `<div style="width:100%;text-align:left;font-size:13px;font-style:italic">肉质如同流蜜一般香甜软糯。叫人想把每一根骨头都吮吸干净。</div>`,
						shouroubohejuanA: "兽肉薄荷卷",
						shouroubohejuanA_info: "出牌阶段，对一名角色使用。目标角色获得效果：其他角色使用一张非基本牌后，目标角色摸一张牌，持续二回合。",
						shouroubohejuanA_append: `<div style="width:100%;text-align:left;font-size:13px;font-style:italic">兽肉与薄荷之间达成了绝妙的平衡，细嫩而不显绵腻，幽香而不显清苦。一丝鲜明的辣意则是将这平和诗意的两者彻底唤醒，在口中雀跃躁动，并以完美的叹号收官。</div>`,
						zhizuchangleA: "知足常乐",
						zhizuchangleA_info: "出牌阶段，对一名角色使用。目标角色随机获得X张牌名和类别均不同的牌（X为目标角色体力上限+1）。",
						zhizuchangleA_append: `<div style="width:100%;text-align:left;font-size:13px;font-style:italic">卤香四溢的豆腐菜式。香煎后的豆腐，包含酱香浓郁的汤汁，过瘾的辛辣中又带着若有似无的「肉香」。只须轻咬一口，醇香便在口中散开，让人回味无穷。</div>`
					},
					//如果卡牌需要洗入牌堆，那么编入下方，格式为["花色","数字","牌名"]
					list: [
					],
				};
				return GenshinImpactEnhanced
			});
			lib.config.all.cards.push("原梗衍生");
			if (!lib.config.cards.includes("原梗衍生")) lib.config.cards.push("原梗衍生");//强制开启卡牌
			lib.translate['原梗衍生' + '_card_config'] = '原梗衍生';

		}, help: {},
		config: config,
		package: {
			intro: "<li>(｡･∀･)ﾉﾞhello，" + lib.config.connect_nickname + "！欢迎体验《原梗Enhanced》扩展！版本号：0.1.5"
				+ "<li>本扩展由BilibiliUP主“不明围观”的《原梗扩展》授权更改而来。强度及格线为十周年神张飞，建议开启“仅点将可用”。"
				+ "<li>图片素材来自网络，若有侵权请联系作者删除。"
				+ "<li>下方为扩展交流群，如遇扩展bug或者有更好的技能设计思路，欢迎进群交流讨论！"
				+ "<div style='text-align: center; width: 100%;'><img style=width:238px src=" + lib.assetURL + "extension/原梗Enhanced/other/扩展交流群.jpg></img></div>",
			author: "举世无双",
			diskURL: "",
			forumURL: "",
			version: "0.1.5",
		}, files: { "character": [], "card": [], "skill": [], "audio": [] }
	}
})
