

const {ccclass, property} = cc._decorator;

@ccclass
export default class Speed extends cc.Component {

    @property(cc.Node)
    frame: cc.Node = null;
    @property(cc.Node)
    image: cc.Node = null;

    // onLoad () {}

    init(turn) {
        cc.loader.loadRes(`monster/${turn.atkMonsterUid}`, cc.SpriteFrame, function(err, spriteFrame) {
            this.getComponent(cc.Sprite).spriteFrame = spriteFrame
        }.bind(this.image.getComponent(cc.Sprite)))
    }

    start () {

    }

    // update (dt) {}
}
