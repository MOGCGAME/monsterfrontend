const {ccclass, property} = cc._decorator;

@ccclass
export default class ResultPage extends cc.Component {

    @property(cc.Label)
    point: cc.Label = null;
    @property(cc.Node)
    monster: cc.Node = null;
    @property(cc.Label)
    title: cc.Label = null;

    // onLoad () {}

    init(result, exp, monster) {
        
        if (result == 0) {
            this.title.string = "胜利";
            this.point.string = "+" + exp;
        } else {
            this.title.string = "失败";
            this.point.string = "+" + exp;
        }
        
        for (var i = 0; i < monster.length; i++) {
            this.monster.children[i].active = true;
            cc.loader.loadRes(`monster/${monster[i].monster_id}`, cc.SpriteFrame, function(err, spriteFrame) {
                this.getComponent(cc.Sprite).spriteFrame = spriteFrame
            }.bind(this.monster.children[i].getChildByName("Monster").getComponent(cc.Sprite)))
            cc.loader.loadRes(`rarity/${monster[i].monster_rarity}`, cc.SpriteFrame, function(err, spriteFrame) {
                this.getComponent(cc.Sprite).spriteFrame = spriteFrame
            }.bind(this.monster.children[i].getChildByName("Base").getComponent(cc.Sprite)))
            cc.loader.loadRes(`element/${monster[i].monster_element}`, cc.SpriteFrame, function(err, spriteFrame) {
                this.getComponent(cc.Sprite).spriteFrame = spriteFrame
            }.bind(this.monster.children[i].getChildByName("Element").getComponent(cc.Sprite)))
        }
    }

    start () {

    }

    // update (dt) {}
}
