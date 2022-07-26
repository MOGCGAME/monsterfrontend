cc.Class({
    extends: cc.Component,

    properties: {
        base: { default: null, type: cc.Node, },
        image: { default: null, type: cc.Node, },
        element: { default: null, type: cc.Node, },
    },

    monster: null,
    match : null,
    turn: null,
    lobby: null,

    init(monster, turn, match) {
        cc.loader.loadRes(`monster/${monster.monster_id}`, cc.SpriteFrame, function(err, spriteFrame) {
            this.getComponent(cc.Sprite).spriteFrame = spriteFrame
        }.bind(this.image.getComponent(cc.Sprite)))
        // cc.loader.loadRes(`element/${monster.monster_element}`, cc.SpriteFrame, function(err, spriteFrame) {
        //     this.getComponent(cc.Sprite).spriteFrame = spriteFrame
        // }.bind(this.element.getComponent(cc.Sprite)))
        this.monster = monster
        this.match = match
        this.turn = turn
    },

    selectMonster: function () {
        this.lobby.getComponent("AttackPage").attackMonster(this.monster, this.turn, this.match)
    },

    onLoad () {
        this.lobby = this.node.parent.parent.parent.parent.parent;
    },

    start () {

    },

    // update (dt) {},
});
