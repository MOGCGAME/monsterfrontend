const {ccclass, property} = cc._decorator;

@ccclass
export default class PvEPage extends cc.Component {

    @property(cc.Node)
    selfMonster: cc.Node = null;
    @property(cc.Node)
    enemyMonster: cc.Node = null;

    init(self, enemy) {

    }

    updateBuff(buff) {

    }

    updateStatus(turnInfo) {
        
    }

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
