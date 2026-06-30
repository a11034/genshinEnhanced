import { lib, game, ui, get, ai, _status } from "../../noname.js";

const extensionInfo = await lib.init.promises.json(`${lib.assetURL}extension/原梗Enhanced/info.json`);
const assetPath = `${lib.assetURL}extension/原梗Enhanced/other/扩展交流群.jpg`;
export const Package = {
    author: `举世无双`,
    intro: `
        <li>(｡･∀･)ﾉﾞhello，${lib.config.connect_nickname}！欢迎体验《原梗Enhanced》扩展！版本号：${extensionInfo.version} 
        <li>本扩展由BilibiliUP主“不明围观”的《原梗扩展》授权更改而来。强度及格线为十周年神张飞，建议开启“仅点将可用”。
        <li>图片素材来自网络，若有侵权请联系作者删除。
        <li>下方为扩展交流群，如遇扩展bug或者有更好的技能设计思路，欢迎进群交流讨论！
        <div style='text-align: center; width: 100%;'>
        <img style=width:238px src=${assetPath}></img>
        </div>`,
    character: {},
    skill: {},
    card: {},
    diskURL: "",
    forumURL: "",
    version: extensionInfo.version,
};