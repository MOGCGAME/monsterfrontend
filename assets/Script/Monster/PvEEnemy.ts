// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class PvEEnemy extends cc.Component {

    enemy: any;
    turn: any;
    match: any;
    battleSystem: cc.Node;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    init(enemy, battleSystem){
        this.enemy = enemy
        this.battleSystem = battleSystem
    }
    start () {

    }

    showTarget(match, turn){
        this.node.getChildByName("Indicator").active = true
        this.match = match
        this.turn = turn
    }

    deshowTarget(){
        this.node.getChildByName("Indicator").active = false
    }

    async attackMonster(){
        var result = []
        result = this.battleSystem.getComponent("BattleSystem").attack(this.enemy,this.turn,this.match);
        console.log("Result:"+result)
        var newmatch = result["newmatch"]
        var turnInfo = result["turnInfo"]
        var target = result["target"]
        this.enemy = target
        if(turnInfo[0].atkmultiple != undefined){
            console.log("atkmultiple")
            if(turnInfo[0].atkmultiple.length > 0){
                var enemies = this.node.parent.children
                for(let a = 0; a < turnInfo[0].atkmultiple.length; a++){
                    if(this.enemy["monster_uid"] != turnInfo[0].atkmultiple[a]["id"]){
                        for(let b=0; b < enemies.length; b++){
                            if(enemies[b].getComponent("PvEEnemy").enemy["monster_uid"] == turnInfo[0].atkmultiple[a]["id"]){
                                enemies[b].getComponent("PvEEnemy").enemy["monster_hp"] =  turnInfo[0].atkmultiple[a]["hpdown"]
                                break
                            }
                        }
                    }
                }
            }
        }
        
        
        var battlePage = this.node.parent.parent.parent.parent
        var pvpPage = this.node.parent.parent.parent
        pvpPage.getComponent("PvPPage").deshowAvailableEnemies()
        battlePage.getComponent("BattlePage").updateMatch(newmatch)
        await battlePage.getComponent("BattlePage").updateMonsterStatus(turnInfo[0])
        battlePage.getComponent("BattlePage").updateAuto()
        if(battlePage.getComponent("BattlePage").waitForPlayerBattleResolve){
            battlePage.getComponent("BattlePage").waitForPlayerBattleResolve()
        }
    }

    // update (dt) {}
}
