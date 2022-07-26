cc.Class({
    extends: cc.Component,

    properties: {
        base: { default: null, type: cc.Node, },
        avatar: { default: null, type: cc.Node, },
        level: { default: null, type: cc.Label, },
        frame: { default: null, type: cc.Node, },
        rarity: { default: null, type: cc.Node, },
        element: { default: null, type: cc.Node, },
    },

    lobby: null,

    init(monsterDetail) {
        // cc.loader.loadRes(``, cc.SpriteFrame, function(err, spriteFrame) {
        //     this.getComponent(cc.Sprite).spriteFrame = spriteFrame
        // }.bind(monster.getChildByName("Frame").getComponent(cc.Sprite)))
        // cc.loader.loadRes(``, cc.SpriteFrame, function(err, spriteFrame) {
        //     this.getComponent(cc.Sprite).spriteFrame = spriteFrame
        // }.bind(monster.getChildByName("Base").getComponent(cc.Sprite)))
        // cc.loader.loadRes(``, cc.SpriteFrame, function(err, spriteFrame) {
        //     this.getComponent(cc.Sprite).spriteFrame = spriteFrame
        // }.bind(monster.getChildByName("Rarity").getComponent(cc.Sprite)))
        // cc.loader.loadRes(``, cc.SpriteFrame, function(err, spriteFrame) {
        //     this.getComponent(cc.Sprite).spriteFrame = spriteFrame
        // }.bind(monster.getChildByName("Level").getComponent(cc.Sprite)))
        cc.loader.loadRes(`monster/${monsterDetail.monster_id}`, cc.SpriteFrame, function(err, spriteFrame) {
            this.getComponent(cc.Sprite).spriteFrame = spriteFrame
        }.bind(this.avatar.getComponent(cc.Sprite)))
        // cc.loader.loadRes(``, cc.SpriteFrame, function(err, spriteFrame) {
        //     this.getComponent(cc.Sprite).spriteFrame = spriteFrame
        // }.bind(monster.getChildByName("Element").getComponent(cc.Sprite)))
    },


    onLoad () {
        this.lobby = this.node.parent.parent.parent.parent.parent;
    },

    start () {

    },

    // update (dt) {},
});
