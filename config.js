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
    ]
};


export let config={
    /*------------------------扩展小功能---------------------------*/
    /**
     * 扩展设置提示
     */
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
};

