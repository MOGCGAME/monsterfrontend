cc.Class({
    extends: cc.Component,

    properties: {
        base: { default: null, type: cc.Node, },
        image: { default: null, type: cc.Node, },
        element: { default: null, type: cc.Node, },
        energy: { default: null, type: cc.Label, },
        frame: {default:null, type:cc.Node,},   
        inTeam: {default:null, type:cc.Node,},   
        rarity_color1 : {default: new cc.Color(246,179,97,255), type: cc.Color,},
        rarity_color2 : {default: new cc.Color(218,213,213,255), type: cc.Color,},
        rarity_color3 : {default: new cc.Color(248,89,89,255), type: cc.Color,},
    },

    monster: null,
    monsteruid: null,
    seq: null,
    lobby: null,
    

    init(monster, seq) {
        // cc.loader.loadRes(`base/${monster.monster_rarity}`, cc.SpriteFrame, function(err, spriteFrame) {
        //     this.getComponent(cc.Sprite).spriteFrame = spriteFrame
        // }.bind(this.base.getComponent(cc.Sprite)))
        cc.loader.loadRes(`monster/${monster.monster_id}`, cc.SpriteFrame, function(err, spriteFrame) {
            this.getComponent(cc.Sprite).spriteFrame = spriteFrame
        }.bind(this.image.getComponent(cc.Sprite)))
        cc.loader.loadRes(`monster/element/${monster.monster_element}`, cc.SpriteFrame, function(err, spriteFrame) {
            this.getComponent(cc.Sprite).spriteFrame = spriteFrame
        }.bind(this.element.getComponent(cc.Sprite)))
        if("monster_sequence" in monster){
            this.inTeam.active = true
        }else{
            this.inTeam.active = false
        }
        var frameColor
        switch(monster.monster_rarity){
            case "1":
                frameColor = this.rarity_color1
                break
            case "2":
                frameColor = this.rarity_color2
                break
            case "3":
                frameColor = this.rarity_color3
                break
        }
        this.frame.color = frameColor
        this.energy.string = monster.monster_energy
        this.monster = monster.monster_id
        this.monsteruid = monster.monster_uid
        this.seq = seq
    },

    selectMonster: function () {
        this.lobby.getComponent("EmbattlePage").selectMonster(this.monster, this.monsteruid, this.seq)
        this.inTeam.active = true
        this.lobby.getComponent("EmbattlePage").closeMonster()
    },

    onLoad () {
        this.lobby = this.node.parent.parent.parent.parent.parent;
        console.log("monster:", this.lobby)
    },

    start () {

    },

    // update (dt) {},
});
