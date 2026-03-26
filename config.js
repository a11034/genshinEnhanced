import { lib, game, ui, get, ai, _status } from '../../noname.js';

export let configData = {
    background: [
        { name: "万众一心", file: "wanzongyixin.jpg" },
        { name: "鸣神永恒", file: "mingshenyongheng.jpg" },
        { name: "神社品茗", file: "shenshepingming.jpg" },
        { name: "共庆海灯", file: "gongqinghaideng.png" },
        { name: "一夫当关", file: "yifudangguan.jpg" },
        { name: "月下起舞", file: "yuexiaqiwu.jpg" },
        { name: "无因轻雨", file: "wuyinqingyu.jpg" },
        { name: "光暗齐驱", file: "guanganqiqu.jpg" },
        { name: "烟火大会", file: "yanhuodahui.jpg" },
        { name: "深海真珠", file: "shenhaizhenzhu.jpg" }
    ],
    customText:{
        fengshaA: "出牌阶段，对你攻击范围内的一名角色使用。其须使用一张【闪】，否则你对其造成1点伤害，然后其随机执行一项：①强制翻面；②弃置所有牌。",
        huanMengCard:"<li>【凝浪光剑】：出牌阶段，选择一名其他角色，对其造成1点伤害。然后，若你已受伤则回复1点体力，否则获得1点护甲。</li><li>【潮卷冰削】：令所有其他角色失去1点体力并随机弃置两张牌。</li><li>【光潮幻象】：令一名其他角色弃置所有装备牌，并将一张乐不思蜀置于其判定区。</li>",
        yaoJiCard:"<li>烈焰药水：选择一名其他角色，令其受到到1点火焰伤害且进入〖灼烧〗状态至其回合结束。</li><li>风暴药水：选择一名其他角色，令其受到1点雷电伤害且进入〖麻痹〗状态至其回合结束。</li><li>极寒药水：选择一名其他角色，令其受到1点冰冻伤害且进入〖冻结〗状态至其回合结束。</li><li>生命药水：选择一名已受伤角色，令其增加1点体力上限并回复2点体力。</li><li>复苏药水：出牌阶段，对你使用。你卜算6，然后摸四张牌。</li>",
        jiaYaoCard:"<li>攻击类：【仙跳墙】（★★★★★）、【堆高高】（★★★）、【绝云锅巴】（★★★）</li><li>防御类：【黄油蟹蟹】（★★★★）、【莲花酥】（★★★）、【四方和平】（★★★）</li><li>辅助类：【兽肉薄荷卷】（★★★）、【提瓦特煎蛋】（★）、【甜甜花酿鸡】（★★）、【知足常乐】（★★★）</li>",
        yunlvSkill:"三国杀微服机制，和转换技类似，韵律技分为平和仄两种状态，韵律技初始默认状态为平，满足转韵条件时韵律技会转成另一种状态并重置技能的发动次数。"
    },
};


export let config={
    /*------------------------扩展小功能---------------------------*/
    /**
     * 扩展设置提示
     */
    copyGit: {
        name: '一键复制<span style="color: #FFFF00">GitHub</span><span style="color: #00FFFF">仓库链接</span>',
        clear: true,
        onclick() {
            game.copy('https://github.com/a11034/genshinEnhanced', '链接已复制到剪贴板!');
        },
    },
    miniFeature: {
        name: "<font color=#ed7e78><————扩展小功能————></font></a>",
        clear: true,
    },
    changeBackground: {
        name: "切换背景图片",
        intro: "<div style='white-space:normal;overflow-wrap:break-word'>可以切换背景图片，立刻生效，所有图片均放置在‘原梗Enhanced/image/background’处，想要的可以自取。</div>",
        init: "default",
        item: configData.background.reduce((obj, image,index) => { // 使用reduce遍历background数组
            obj[index] = image.name; // 用name同时作为键和显示值
            return obj;
        }, {'default':'游戏默认'}),
        onclick: function (item) { // 这里item是字符串类型的数字键或"default"
            let backgroundImage;
            if (item === 'default') {
                // 恢复默认背景逻辑
                backgroundImage = null;
            } else {
                // 将item转换为数字索引
                const index = parseInt(item);
                // 通过下标直接访问数组，避免名称重复问题
                backgroundImage = configData.background[index]?.file;
            }
            // 设置背景逻辑
            if (backgroundImage) {
                ui.background.setBackgroundImage(
                    'extension/原梗Enhanced/image/background/' + backgroundImage
                );
                // 保存配置
                game.saveExtensionConfig('原梗Enhanced', 'background', backgroundImage);
            } else {
                ui.background.setBackgroundImage(
                    "image/background/" + lib.config.image_background + ".jpg"
                );
            }
            game.saveExtensionConfig('原梗Enhanced', 'changeBackground', item);
        }
    },
    limitedDraw:{
        name:"限制摸牌",
        intro: "限制武将单次摸牌数量，防止因牌堆总数过多而出现超额摸牌。",
        input:true,
        init: "0",
        onblur: function () {
            // 获取并清理输入值
            let value = this.innerText.trim();
            // 验证是否为纯数字
            if (!/^\d+$/.test(value)) {
                // 如果不是纯数字，设为0（关闭功能）
                value = "0";
            }
            // 转换为整数
            let numValue = parseInt(value, 10);
            // 验证并处理
            if (numValue === 0) {
                // 输入0，保持0（关闭功能）
            } else if (numValue < 15) {
                numValue = 15; // 小于15则设为最小值
            } else if (numValue > 50) {
                numValue = 50; // 大于50则设为最大值
            }
            this.innerText = numValue.toString();
            game.saveExtensionConfig('原梗Enhanced', 'limitedDraw', numValue);
        }
    }, 
};

