import { lib, game, ui, get, ai, _status } from '../../noname.js';

export function content(config, pack) {
    //---------------------------------------设置：武将评级------------------------------------------//
    /*武将评级*/
    if (lib.rank) {
        //设置评级
        // 定义评级与武将列表的映射关系
        const rarityMap = {
            // 平凡武将
            junk: [],
            // 精品武将
            rare: [],
            // 史诗武将
            epic: [
                'hutaoA', 'ningguangA', 'bachongshenziA', 'keqingA',
                'zhongliA', 'wendiA', 'leidianjiangjunA', 'shatangA',
                'xianglingA', 'anboA', 'banniteA', 'xiaoA','naxidaA'
            ],
            // 传说武将
            legend: [
                'shenlilinghuaA', 'shenlilingrenA', 'qiqiA', 'youlaA',
                'ganyuA', 'puniA', 'xingqiuA', 'shanhugongxinhaiA', 'yunjinA', 'fengyuanwanyeA'
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
    lib.inpile_nature.add("fengshaA");
    // lib.natureAudio.damage.fengshaA = 'normal';
    lib.translate['sha_nature_fengshaA_info'] = '出牌阶段，对你攻击范围内的一名角色使用。其须使用一张【闪】，否则你对其造成1点伤害，然后其随机执行一项：①翻面；②弃置所有牌。';
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
        async content(event,trigger,player) {
            let damageNum = [1, 2].randomGet();
            if (damageNum == 1)
                trigger.player.discard(trigger.player.getCards("he"));
            else
                trigger.player.turnOver();
        },
    };
}