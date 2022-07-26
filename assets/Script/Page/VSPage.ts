const {ccclass, property} = cc._decorator;

@ccclass
export default class VSPage extends cc.Component {

    @property(cc.Node)
    selfMonster: cc.Node = null;
    @property(cc.Node)
    enemyMonster: cc.Node = null;

    init (self, enemy) { //初始值
        if (self.length == 5) {
            this.selfMonster.children[0].active = true;
            this.enemyMonster.children[0].active = true;
            for (var i = 0; i < self.length; i++) {
                cc.loader.loadRes(`monster/${self[i].monster_id}`, cc.SpriteFrame, function (err, spriteFrame) {
                    this.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                }.bind(this.selfMonster.children[0].children[i].getChildByName("Monster").getComponent(cc.Sprite)))
            }
            for (var i = 0; i < enemy.length; i++) {
                cc.loader.loadRes(`monster/${enemy[i].monster_id}`, cc.SpriteFrame, function(err, spriteFrame) {
                    this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                }.bind(this.enemyMonster.children[0].children[i].getChildByName("Monster").getComponent(cc.Sprite)))
            }
        } else {
            this.selfMonster.children[1].active = true;
            this.enemyMonster.children[1].active = true;
            for (var i = 0; i < self.length; i++) {
                cc.loader.loadRes(`monster/${self[i].monster_id}`, cc.SpriteFrame, function (err, spriteFrame) {
                    this.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                }.bind(this.selfMonster.children[1].children[i].getChildByName("Monster").getComponent(cc.Sprite)))
            }
            for (var i = 0; i < enemy.length; i++) {
                cc.loader.loadRes(`monster/${enemy[i].monster_id}`, cc.SpriteFrame, function(err, spriteFrame) {
                    this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                }.bind(this.enemyMonster.children[1].children[i].getChildByName("Monster").getComponent(cc.Sprite)))
            }
        }

    }

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
