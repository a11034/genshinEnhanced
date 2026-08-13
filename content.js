import { lib, game, ui, get, ai, _status } from '../../noname.js';
import { configData } from './config.js';
export function content(config, pack) {
    //---------------------------------------设置：武将评级------------------------------------------//
    /*武将评级*/
    if (lib.rank) {
       
        // 定义评级与武将列表的映射关系
        const rarityMap = {
            // 平凡武将
            junk: [],
            // 精品武将
            rare: ["YG_qianqing","YG_bingkuai","YG_jianxingmiyue"],
            // 史诗武将
            epic: [
                'hutaoA', 'ningguangA', 'keqingA', 'keliA',
                'zhongliA', 'wendiA', 'leidianjiangjunA', 'shatangA',
                'xianglingA', 'anboA', 'banniteA', 'xiaoA', 'naxidaA', "lanyanA", 'shenlilingrenA', 'huanglongyidouA'
            ],
            // 传说武将
            legend: [
                'shenlilinghuaA', 'qiqiA', 'youlaA', "Seer_gaiya", "Seer_leiyi", "babalaA", 'bachongshenziA',
                'ganyuA', 'puniA', 'xingqiuA', 'shanhugongxinhaiA', 'yunjinA', 'fengyuanwanyeA',
            ]
        };

        // 动态添加评级数据
        Object.entries(rarityMap).forEach(([rarityKey, list]) => {
            lib.rank.rarity?.[rarityKey]?.addArray(list);
        });

    }
    //---------------------------------------功能：游戏背景图------------------------------------------//
    //自动切换背景图片为上次设置的图片，延迟保证一定兼容性
    setTimeout(() => {
        const savedConfig = game.getExtensionConfig('原梗Enhanced', 'changeBackground');
        const savedFile = game.getExtensionConfig('原梗Enhanced', 'background');

        if (savedConfig && savedConfig !== 'default' && savedFile) {
            console.log('正在应用延迟加载的背景图片');
            ui.background.setBackgroundImage(
                'extension/原梗Enhanced/image/background/' + savedFile
            );
        }
    }, 400);
    //属性杀

    /**
     * 参数audio写法示例：{damage:{["","ext:扩展名/...","ext:扩展名/..."]},sha:{female:"ext:扩展名/...",male:"ext:扩展名/..."},hujia_damage:{"","ext:扩展名/...","ext:扩展名/..."}}
     * damage和hujia_damage数组里的第一个值可以是任意值，只用来占位置，无特殊意义。
     * 参数必须对应，第二个参数是1点伤害时的音效，第三个参数是多点伤害时的音效
     * damage表示造成伤害时的音效,sha是使用这种属性的【杀】时的音效，自然hujia_damage是击中护甲时的音效。
     */
    const baseAudioPath = "ext:原梗Enhanced/audio/card/";
    game.addNature("fengshaA", "<font color=#4ECDC4>风</font>", {
        audio: { damage: { fengshaA: ["", `${baseAudioPath}fengshaA1.mp3`, `${baseAudioPath}fengshaA2.mp3`] } },
        linked: true,
        order: 60,
        background: "extension/原梗Enhanced/image/mark/fengsha.png",
        lineColor: "#4ECDC4",
        color: "#4ECDC4",
    });
    game.addNature("chenshaA", "<font color=#e9aa25>岩</font>", {
        audio: { damage: { chenshaA: ["", `${baseAudioPath}chenshaA1.mp3`, `${baseAudioPath}chenshaA2.mp3`] } },
        linked: true,
        order: 60,
        background: "extension/原梗Enhanced/image/mark/chensha.png",
        lineColor: "#e9aa25",
        color: "#e9aa25",
    });
    
    if (game.getExtensionConfig("原梗Enhanced", "natureAdd")) lib.inpile_nature.addArray(["fengshaA","chenshaA"]);

    lib.translate['sha_nature_fengshaA_info'] = configData.customText.fengshaA;
    lib.translate['sha_nature_chenshaA_info'] = configData.customText.chenshaA;
    lib.skill._fengshaA = {
        lastDo: true,
        ruleSkill: true,
        popup: false,
        superCharlotte: true,
        charlotte: true,
        forceunique: true,
        direct: true,
        trigger: {
            source: "damageAfter",
        },
        filter: function (event) {
            return event.hasNature("fengshaA") && event.player.isIn();
        },
        logTarget: "player",
        async content(event, trigger, player) {
            if (trigger.player.hp <= trigger.player.countCards("h"))
                trigger.player.discard(trigger.player.getCards("he"));
            else
                trigger.player.classList.add('turnedover');
        },
        ai:{
            effect:{
                target: function (card, player, target) {
                    //这里也可以用card?.hasNature?.("fengshaA",player),不过fengshaA是我自己定义的，所以不会出现fengshaA|fire这种情况。
                    if (card.nature=="fengshaA") {
                        return 1.5;
                    }
                },
            },
        },
    };
    lib.skill._chenshaA = {
        lastDo: true,
        ruleSkill: true,
        popup: false,
        superCharlotte: true,
        charlotte: true,
        forceunique: true,
        direct: true,
        trigger: {
            source: "damageAfter"
        },
        filter: function (event) {
            return event.hasNature("chenshaA") && event.player.isIn();
        },
        logTarget: "player",
        async content(event, trigger, player) {
            await trigger.player.loseMaxHp(trigger.num,true);
            for (let index = 0; index < trigger.num; index++) {
                if (trigger.player.countEnabledSlot()===0) break;
                let list = ["equip1", "equip2", "equip3", "equip4", "equip5"].filter(slot =>
                    trigger.player.hasEnabledSlot(slot)
                );
                if (get.is.mountCombined()) {
                    if (list.includes("equip3") || list.includes("equip4")) {
                        list.push("equip3_4");
                    }
                    list.remove("equip3", "equip4");
                }
                if (list.length) {
                    const slot = list.randomGet();
                    if (slot === "equip3_4") {
                        await trigger.player.disableEquip(["equip3", "equip4"]);
                    } else {
                        await trigger.player.disableEquip([slot]);
                    }
                }
            }
        },
        ai: {
            effect: {
                target: function (card, player, target) {
                    //这里也可以用card?.hasNature?.("fengshaA",player),不过fengshaA是我自己定义的，所以不会出现fengshaA|fire这种情况。
                    if (card.nature == "chenshaA") {
                        return 1.4;
                    }
                },
            },
        },
    };
    //摸牌限制器
    lib.skill._limitedDraw={
        lastDo: true,
        ruleSkill: true,
        popup: false,
        superCharlotte: true,
        charlotte: true,
        forceunique: true,
        direct: true,
        trigger: {
            player: "drawBefore",
        },
        filter: function (event,player) {
            const number = game.getExtensionConfig("原梗Enhanced", "limitedDraw");
            return event.player.isIn()&&number>0&&event.num>number;
        },
        logTarget: "player",
        async content(event, trigger, player) {
            game.log(get.translation(trigger.player) + "摸的牌太多了！禁止暴力摸牌！");
            trigger.num = game.getExtensionConfig("原梗Enhanced", "limitedDraw");
            trigger.numFixed = true;
        },
    };
}