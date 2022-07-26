import G from "../../Module/Global";
import httpMng from "../../Module/HttpMng";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PVPRoom extends cc.Component {

    @property(cc.Prefab)
    loading: cc.Prefab = null;
    @property(cc.Prefab)
    match: cc.Prefab = null;
    @property(cc.Prefab)
    embattle: cc.Prefab = null;
    @property(cc.SpriteFrame)
    activeButton: cc.SpriteFrame
    @property(cc.SpriteFrame)
    inactiveButton: cc.SpriteFrame
    
    lyt
    team_Id
    
    onLoad () {
        var length = JSON.parse(cc.sys.localStorage.getItem("room") || "")       // 3 or 5

        if(length == 3){
            this.lyt = "3v3"
        } else if(length == 5){
            this.lyt = "5v5"
        } else {
            console.log("p_room.ts error of room from p_join.prefab")
        }
        this.team_Id = 1
        this.teamBtnColor(this.activeButton,this.inactiveButton)
        this.setBattleTeam( this.lyt, this.team_Id, length)
    }

    setBattleTeam(layout, teamId, length){
        var battleCard = this.node.getChildByName("battleCard").getChildByName(layout)
        battleCard.active = true
        console.log("this is room", layout)
        httpMng.post("/embattle/getCurrentEmbattle", {length: length},
        (ret) => {
            console.log("ret in setBattleTeam = ", ret)
            this.team_Id = ret.embattleInfo[0].team_id
            var team2 = this.node.getChildByName("btn").getChildByName("team2").getComponent(cc.Button)
            if (ret.embattleInfo == null) {
                team2.interactable = false
                team2.node.active = false
                this.teamBtnColor("g_m","y_m")
            } else{
                if(teamId == 2){
                    team2.interactable = true
                    team2.node.active = true
                }
                var battleCardSpriteArr = [], cardUidArr = [], cardImgUrlArr = []
                for(var i = 0 ; i < battleCard.childrenCount ; i++){
                    var num = i + 1
                    var numStr = num + ""
                    battleCardSpriteArr[i] = battleCard.getChildByName(numStr).getComponent(cc.Sprite)
                    cardUidArr[i] = ret.embattleInfo[i].user_monster_id
                    cardImgUrlArr[i] = "monster/" + cardUidArr[i]
                    cc.loader.loadRes(cardImgUrlArr[i], cc.SpriteFrame, function(err, spriteframe){
                        this.spriteFrame = spriteframe
                    }.bind(battleCardSpriteArr[i]))
                }
            }
        })
    }

    toMatch(){
        G.createGameObjectwithBackgroundThatBlocksInput(this.node, this.loading)
        this.scheduleOnce(function(){
            var r = JSON.parse(cc.sys.localStorage.getItem("room") || "")       // 3 or 5
            cc.sys.localStorage.setItem("room", JSON.stringify(r));
            cc.sys.localStorage.setItem("team_id", JSON.stringify(this.team_Id));
            G.createGameObjectwithBackgroundThatBlocksInput(this.node, this.match)
        },1)
    }

    toEmbattle() {
        console.log(this.team_Id)
        var length = JSON.parse(cc.sys.localStorage.getItem("room") || "")       // 3 or 5
        var embattle = cc.instantiate(this.embattle);
        var embattleInfo = embattle.getComponent("EmbattlePage");
        embattleInfo.init(length, this.team_Id)
        this.node.addChild(embattle);
    }

    changeTeam(event, customEventData){
        var length = JSON.parse(cc.sys.localStorage.getItem("room") || "")       // 3 or 5
        var c1 = this.activeButton, c2 = this.inactiveButton
        if(customEventData == "A"){
            this.team_Id = 1
            c1 = this.activeButton
            c2 = this.inactiveButton
        }
        
        else if(customEventData == "B"){
            this.team_Id = 2
            c1 = this.inactiveButton
            c2 = this.activeButton
        }
        this.teamBtnColor(c1,c2)
        this.setBattleTeam(this.lyt, this.team_Id, length)
    }

    teamBtnColor(button1,button2){
        var team1 = this.node.getChildByName("btn").getChildByName("team1").getComponent(cc.Sprite)
        var team2 = this.node.getChildByName("btn").getChildByName("team2").getComponent(cc.Sprite)
        team1.spriteFrame = button1
        team2.spriteFrame = button2
    }
}