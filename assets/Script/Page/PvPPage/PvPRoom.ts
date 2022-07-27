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
    @property(cc.Node)
    popupDialog: cc.Node
    
    waitForHttpResolve: any
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
    showPopup(message: string){
        this.popupDialog.active = true
        this.popupDialog.getChildByName("popup_text").getComponent(cc.Label).string = message
        this.scheduleOnce(() => {
            this.popupDialog.active = false
        }, 2)
    }
    async setBattleTeam(layout, teamId, length){
        var battleCard = this.node.getChildByName("battleCard").getChildByName(layout)
        battleCard.active = true
        console.log("this is room", layout)
        var isSet;
        httpMng.post("/embattle/changeEmbattle", {length: length, teamId: teamId},
        (ret) => {
            console.log("ret in setBattleTeam = ", ret)
            if(ret.error != null){
                this.showPopup("该队伍为空，无法选择")
                isSet = false;
            }else{
                this.team_Id = ret.embattleInfo[0].team_id
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
                isSet = true;
                if(this.waitForHttpResolve){
                    this.waitForHttpResolve()
                }
            }
        })
        await this.waitForHttp()
        return isSet
    }
    waitForHttp(){
        return new Promise(resolve => this.waitForHttpResolve= resolve)
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
        embattleInfo.backButton.active = true
        embattleInfo.init(length, this.team_Id)
        this.node.addChild(embattle);
    }

    async changeTeam(event, customEventData){
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
        var isSet = await this.setBattleTeam(this.lyt, this.team_Id, length)
        console.log(isSet)
        if(isSet){
            this.teamBtnColor(c1,c2)
        }
    }

    teamBtnColor(button1,button2){
        var team1 = this.node.getChildByName("btn").getChildByName("team1").getComponent(cc.Sprite)
        var team2 = this.node.getChildByName("btn").getChildByName("team2").getComponent(cc.Sprite)
        team1.spriteFrame = button1
        team2.spriteFrame = button2
    }
}