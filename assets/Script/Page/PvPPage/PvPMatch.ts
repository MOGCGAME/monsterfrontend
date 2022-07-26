import httpMng from "../../Module/HttpMng";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PvPMatch extends cc.Component {
    
    @property(cc.Node)
    countdown: cc.Node = null;

    @property(cc.Node)
    fightBtn: cc.Node

    @property(cc.Node)
    cancelBtn: cc.Node

    lyt
    team_Id
    countdowntime
    
    onLoad () {
        var length = JSON.parse(cc.sys.localStorage.getItem("room") || "")       // 3 or 5

        if(length == 3){
            this.lyt = "3v3"
        } else if(length == 5){
            this.lyt = "5v5"
        } else {
            console.log("p_match.ts error of team_id from p_room.ts")
        }

        var left = this.node.getChildByName("left").getChildByName("card").getChildByName(this.lyt)
        left.active = true
        var leftCard = left.getParent()
        this.scheduleOnce(function(){
            leftCard.getComponent(cc.Animation).play("fromOutMoveInLeft")
        }, 2)
        var right = this.node.getChildByName("right").getChildByName("card").getChildByName(this.lyt)
        var rightCard = right.getParent()
        this.scheduleOnce(function(){
            right.active = true
        },1.5)
        this.scheduleOnce(function(){
            rightCard.getComponent(cc.Animation).play("fromOutMoveInRight")
        }, 2)
        console.log("this is match", this.lyt)
        this.init(length)
    }

    countFunc(){
        var t = 0
        var a = "", x = ".",  txt = "正在匹配对手"
        this.countdowntime = function() {
            t++
            var time = this.countdown.getChildByName("time").getComponent(cc.Label)
            var txtLabel = this.countdown.getChildByName("New Label").getComponent(cc.Label)
            time.string = t
            a = x
            if(t%4 == 0){
                a = ""
                txtLabel.string = txt
            } 
           
            txtLabel.string = txtLabel.string + a
            
            if (t >= 10) {
                this.cancelBtn.active = true
                this.cancelBtn.getChildByName("New Label").getComponent(cc.Label).string = "取消"
            }
            
            if(t >= 30) {
                this.cancelFight()
            }
        }
        this.schedule(this.countdowntime, 1)
    }

    cancelFight(){
        this.unschedule(this.countdowntime);
        cc.director.loadScene("Game")
    }


    init(room){
        this.countFunc()
        var scene
        var team_Id = JSON.parse(cc.sys.localStorage.getItem("team_id") || "")
        if(room == 3){
            this.lyt = "3v3"
            scene = "3v3"
        } else if(room == 5){
            this.lyt = "5v5"
            scene = "5v5"
        } else {
            console.log("room = ", room)
        }

        httpMng.post("/matching/getPvPMatching", { length: room, matching: 1 }, 
        (ret) => {
            console.log("ret in p_match = ", ret)
            if (ret.code == "Monster Not Enough Energy") {
                console.log(ret.code)
            } else {
                var left = this.node.getChildByName("left").getChildByName("card").getChildByName(scene)
                var right = this.node.getChildByName("right").getChildByName("card").getChildByName(scene)
                var leftCard = [], leftUid = [], leftImg = []
                var rightCard = [], rightUid = [], rightImg = []

                for(var i = 0 ; i < left.childrenCount ; i++){
                    var num = i + 1
                    var numStr = num + ""
                    leftCard[i] = left.getChildByName(numStr).getComponent(cc.Sprite)
                    leftUid[i] = ret.self[i].monster_id
                    leftImg[i] = "monster/" + leftUid[i]
                    cc.loader.loadRes(leftImg[i], cc.SpriteFrame, function(err, spriteframe){
                        this.spriteFrame = spriteframe
                    }.bind(leftCard[i]))
                }

                for(var i = 0 ; i < right.childrenCount ; i++){
                    var num = i + 1
                    var numStr = num + ""
                    rightCard[i] = right.getChildByName(numStr).getComponent(cc.Sprite)
                    rightUid[i] = ret.enemy[i].monster_id
                    rightImg[i] = "monster/" + rightUid[i]
                    cc.loader.loadRes(rightImg[i], cc.SpriteFrame, function(err, spriteframe){
                        this.spriteFrame = spriteframe
                    }.bind(rightCard[i]))
                }

                this.scheduleOnce(function(){
                    var paramsArr = []
                    paramsArr[0] = ret.self
                    paramsArr[1] = ret.enemy
                    cc.sys.localStorage.setItem("match", JSON.stringify(ret));
                    this.fight()
                },2)
            }
        })
    }

    fight(){
        this.unschedule(this.countdowntime);
        cc.director.loadScene("PVPBattle")
    }
}