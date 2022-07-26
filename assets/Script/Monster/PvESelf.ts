// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class PvESelf extends cc.Component {

    self: any;
    turn: any;
    match: any;
    battleSystem: cc.Node;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    init(self, battleSystem){
        this.self = self
        this.battleSystem = battleSystem
    }
    start () {

    }

    showSelfAttack(match, turn){
        this.node.getChildByName("Indicator").active = true
        this.match = match
        this.turn = turn
    }

    deshowSelfAttack(){
        this.node.getChildByName("Indicator").active = false
    }

    // async attackMonster(){
    //     var result = []
    //     result = this.battleSystem.getComponent("BattleSystem").attack(this.self,this.turn,this.match);
    //     console.log("Result:"+result)
    //     var newmatch = result["newmatch"]
    //     var turnInfo = result["turnInfo"]
    //     var battlePage = this.node.parent.parent.parent.parent
    //     battlePage.getComponent("BattlePage").updateMatch(newmatch)
    //     await battlePage.getComponent("BattlePage").updateMonsterStatus(turnInfo[0])
    //     battlePage.getComponent("BattlePage").updateAuto()
    //     if(battlePage.getComponent("BattlePage").waitForPlayerBattleResolve){
    //         battlePage.getComponent("BattlePage").waitForPlayerBattleResolve()
    //     }
    // }

    // update (dt) {}
}