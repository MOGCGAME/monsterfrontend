import G from "../../Module/Global";
import httpMng from "../../Module/HttpMng";


const {ccclass, property} = cc._decorator;

@ccclass
export default class PvPResult extends cc.Component {


    @property(cc.Prefab)
    reward: cc.Prefab;

    onLoad () {
        console.log("this is result")
        var rank = JSON.parse(cc.sys.localStorage.getItem("rank") || "")
        this.init(rank)
    }
    
    directRank(rank){
        var duplicate = JSON.parse(cc.sys.localStorage.getItem("duplicate") || "")
        var winnerMonster = null
        var params = JSON.parse(cc.sys.localStorage.getItem("match") || "")
        var selfLeft = params.match[params.match.length-1].SelfLeft
        var EnemyLeft = params.match[params.match.length-1].EnemyLeft
        var R = parseInt(rank)
        var rStr, r
        if(selfLeft > EnemyLeft){
            winnerMonster = selfLeft
            rStr = "+" + R
            r = R
        } else if(EnemyLeft > selfLeft){
            winnerMonster = EnemyLeft
            rStr = "-" + R
            r = (R * (-1) )
        } else {
            rStr = 0
            r = 0
        }
        
        var num = params.room
        httpMng.post("/matching/getRanking", {rankNum: num}, 
        (ret) => {
            var newRank = parseInt(ret.rankScore)
            if(duplicate == false){
                newRank = parseInt(ret.rankScore) + r
                this.updateRanking(newRank, num)
                cc.sys.localStorage.setItem("duplicate", JSON.stringify(true));
            }
            console.log("newRank = ", newRank)
        })
    }

    init(rank){
        var duplicate = JSON.parse(cc.sys.localStorage.getItem("duplicate") || "")
        var winnerMonster = null
        var monsterUid = []
        var params = JSON.parse(cc.sys.localStorage.getItem("match") || "")
        var selfLeft = params.match[params.match.length-1].SelfLeft
        var EnemyLeft = params.match[params.match.length-1].EnemyLeft

        var winLoseResult = this.node.getChildByName("win_lose_result")
        var winLoseResultLabel = winLoseResult.getComponent(cc.Label)
        var oriRank = this.node.getChildByName("ori_rank")
        var oriRankLabel = oriRank.getComponent(cc.Label)
        var toUpdateRank = this.node.getChildByName("to_update_rank")
        var toUpdateRankLabel = toUpdateRank.getComponent(cc.Label)

        var R = parseInt(rank)
        var rStr, r
        if(selfLeft > EnemyLeft){
            winnerMonster = selfLeft
            winLoseResultLabel.string = "胜利"
            rStr = "+" + R
            r = R
            toUpdateRank.color = new cc.Color(5, 255, 0)
        } else if(EnemyLeft > selfLeft){
            winnerMonster = EnemyLeft
            winLoseResultLabel.string = "失败"
            rStr = "-" + R
            r = (R * (-1) )
            toUpdateRank.color = new cc.Color(255, 0, 0)
        } else {
            winLoseResultLabel.string = "流局"
            rStr = 0
            r = 0
            toUpdateRank.color = new cc.Color(255, 255, 255)
            console.log("EnemyLeft result = ", EnemyLeft)
            console.log("selfLeft result = ", selfLeft)
        }

        toUpdateRankLabel.string = "(" + rStr + ")"

        var num = params.room
        
        httpMng.post("/matching/getRanking", {rankNum: num}, 
        (ret) => {
            var newRank = parseInt(ret.rankScore)
            console.log("newRank = ", newRank)
            oriRankLabel.string = "新积分 " + newRank
            if(duplicate == false){
                this.updateRanking(newRank, num)
                cc.sys.localStorage.setItem("duplicate", JSON.stringify(true));
            }
        })

        var self = params.self
        var p
        if(self.length == 3){
            p = "3v3"
        } else if(self.length == 5){
            p = "5v5"
        } else{
            console.log("p = ", p)
        }
        
        var card = this.node.getChildByName("card").getChildByName(p)
        card.active = true
        for(var i = 0 ; i < card.childrenCount ; i ++){
            var index = i + 1
            var indexStr = index + ""
            var cardSprite = card.getChildByName(indexStr).getComponent(cc.Sprite)
            monsterUid[i] =  params.self[i].monster_id
            cc.loader.loadRes(`monster/${monsterUid[i]}`, cc.SpriteFrame, function(err, spriteframe){
                this.spriteFrame = spriteframe
            }.bind(cardSprite))

        }
        cc.sys.localStorage.removeItem("match")
    }

    updateRanking(newRank,num){
        var lowestRank = 0 //积分下限
        var highestRank = 10000 //积分上限
        //积分不为最低积分
        if(newRank >= lowestRank){
            if(newRank > highestRank){
                newRank = highestRank
                console.log("超出积分上限")
            }
            httpMng.post("/matching/setRanking", {newRank: newRank, rankNum:num}, 
            (ret) => {
                if(ret == 1){
                    console.log("新积分已更新")
                }else{
                    console.log("ret = ", ret)
                }
            })
        } else{
            console.log("积分过低，太惨了！")
        }
        
    }

    toReward(){
        G.createGameObjectwithBackgroundThatBlocksInput(this.node, this.reward)
    }


}
