import GlobalData from "../Common/GlobalData";
import ResourceMgr from "../Manager/ResourceMgr";
import httpMng from "../Module/HttpMng";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EmbattlePage extends cc.Component {

    //embattle
    @property(cc.Node)
    fiveMode: cc.Node = null;
    @property(cc.Node)
    threeMode: cc.Node = null;
    @property(cc.Node)
    fiveEmbattleFrame: cc.Node = null;
    @property(cc.Node)
    threeEmbattleFrame: cc.Node = null;
    @property(cc.Node)
    fiveEmbattleContent: cc.Node = null;
    @property(cc.Node)
    threeEmbattleContent: cc.Node = null;
    @property(cc.Node)
    fiveTeam: cc.Node = null;
    @property(cc.Node)
    threeTeam: cc.Node = null;
    @property(cc.Node)
    monsterSelect: cc.Node = null;
    @property(cc.ScrollView)
    monsterScroll: cc.ScrollView = null;
    @property(cc.Prefab)
    monsterCard: cc.Prefab = null;
    @property(cc.Node)
    popupDialog: cc.Node = null;

    prev: string;
    current: string;
    last: string;
    currentMode: any;
    currentTeam: any;
    monsterTeam
    monsterIdTeam
    sEmbattle
    firstLoading : boolean

    onLoad () {
        if (this.sEmbattle == null) {
            this.monsterTeam = [];
            this.monsterIdTeam = [];
            this.fiveEmbattleContent.active = false;
            this.threeEmbattleContent.active = false;
            this.fiveEmbattleFrame.active = false;
            this.threeEmbattleFrame.active = false;
            this.fiveTeam.active = false;
            this.threeTeam.active = false;
            this.showFiveEmbattleOne();
            this.firstLoading = true;
        }
    }

    init(length, teamId) {
        this.sEmbattle = 0
        if (length == 5) {
            if (teamId == 1) {
                this.showFiveEmbattleOne();
            } else {
                this.showFiveEmbattleTwo();
            }
        } else {
            if (teamId == 1) {
                this.showThreeEmbattleOne();
            } else {
                this.showThreeEmbattleTwo();
            }
        }
    }

    getEmbattle(length, teamId) {
        httpMng.post("/embattle/getEmbattle", {length: length, teamId: teamId},
        (ret) => {
            console.log(ret)
            this.monsterTeam = [];
            this.monsterIdTeam = [];
            this.currentMode = length;
            this.currentTeam = teamId;
            if (ret.embattleInfo == null) {
                if (length == 5) {
                    for (var i = 0; i < this.fiveEmbattleContent.childrenCount; i++) {
                        this.current = (i + 1).toString();
                        this.monsterTeam.push('1')
                        this.monsterIdTeam.push('1')
                        this.monsterImage(1, this.current);
                    }
                } else {
                    for (var i = 0; i < this.threeEmbattleContent.childrenCount; i++) {
                        this.current = (i + 1).toString();
                        this.monsterTeam.push('1')
                        this.monsterIdTeam.push('1')
                        this.monsterImage(1, this.current);
                    }
                }
            }else {
                for (var i = 0; i < ret.embattleInfo.length; i++) {
                    this.current = (i + 1).toString();
                    var monsterid = ret.embattleInfo[i].user_monster_id
                    var monsteruid = ret.embattleInfo[i].user_monster_uid
                    this.monsterTeam.push(monsterid)
                    this.monsterIdTeam.push(monsteruid)
                    this.monsterImage(monsterid, this.current)
                }
            }
        })
    }

    showFiveEmbattleOne() {
        this.fiveTeam.children[0].color = new cc.Color(255, 0, 0)
        this.fiveTeam.children[1].color = new cc.Color(255, 255, 255)
        this.showFiveTeam();
        this.getEmbattle(5, 1)
    }

    showThreeEmbattleOne() {
        this.threeTeam.children[0].color = new cc.Color(255, 0, 0)
        this.threeTeam.children[1].color = new cc.Color(255, 255, 255)
        this.showThreeTeam();
        this.getEmbattle(3, 1)
    }

    showFiveEmbattleTwo() {
        this.fiveTeam.children[0].color = new cc.Color(255, 255, 255)
        this.fiveTeam.children[1].color = new cc.Color(255, 0, 0)
        this.showFiveTeam();
        this.getEmbattle(5, 2)
    }

    showThreeEmbattleTwo() {
        this.threeTeam.children[0].color = new cc.Color(255, 255, 255)
        this.threeTeam.children[1].color = new cc.Color(255, 0, 0)
        this.showThreeTeam();
        this.getEmbattle(3, 2)
    }

    showFiveTeam() {
        this.fiveMode.color = new cc.Color(255, 0, 0)
        this.threeMode.color = new cc.Color(255, 255, 255)
        this.fiveEmbattleContent.active = true;
        this.fiveEmbattleFrame.active = true;
        this.threeEmbattleContent.active = false;
        this.threeEmbattleFrame.active = false;
        this.fiveTeam.active = true;
        this.threeTeam.active = false;
    }

    showThreeTeam() {
        this.fiveMode.color = new cc.Color(255, 255, 255)
        this.threeMode.color = new cc.Color(255, 0, 0)
        this.fiveEmbattleContent.active = false;
        this.fiveEmbattleFrame.active = false;
        this.threeEmbattleContent.active = true;
        this.threeEmbattleFrame.active = true;
        this.fiveTeam.active = false;
        this.threeTeam.active = true;
    }

    addFiveEmbattle(event, customEventData) {
        if (customEventData == 1) {
            this.showMonster(customEventData);
        } else {
            this.prev = (customEventData - 1).toString()
            var imgEmbattle = this.fiveEmbattleContent.getChildByName(this.prev).getChildByName("Monster").getComponent(cc.Sprite);
            console.log("img:", imgEmbattle)
            if (imgEmbattle.spriteFrame.name != "1") {
                this.showMonster(customEventData);
                console.log("显示怪兽列表")
            } else {
                let message = "请按顺序上阵怪兽"
                console.log(message)
                this.showPopup(message)
            }
        }
    }

    showPopup(message: string){
        this.popupDialog.active = true
        this.popupDialog.getChildByName("popup_text").getComponent(cc.Label).string = message
        this.scheduleOnce(() => {
            this.popupDialog.active = false
        }, 2)
    }

    addThreeEmbattle(event, customEventData) {
        if (customEventData == 1) {
            this.showMonster(customEventData);
        } else {
            this.prev = (customEventData - 1).toString()
            var imgEmbattle = this.threeEmbattleContent.getChildByName(this.prev).getChildByName("Monster").getComponent(cc.Sprite);
            console.log("img:", imgEmbattle)
            if (imgEmbattle.spriteFrame.name != "1") {
                this.showMonster(customEventData);
                console.log("显示怪兽列表")
            } else {
                let message = "请按顺序上阵怪兽"
                console.log(message)
                this.showPopup(message)
            }
        }
    }

    showMonster(seq) {
        this.monsterSelect.active = true;
        if(this.firstLoading){
            this.monsterScroll.content.removeAllChildren();
            httpMng.post("/monster/getMonster", {teamId : this.currentTeam, teamLength: this.currentMode}, 
            (ret) => {
                console.log("monster:", ret.monster)
                for (var i = 0; i < ret.monster.length; i++) {
                    var monster = cc.instantiate(this.monsterCard)
                    var monsterInfo = monster.getComponent("MonsterCard");
                    monsterInfo.lobby = this;
                    monsterInfo.init(ret.monster[i], seq);
                    this.monsterScroll.content.addChild(monster)
                }
            })
            this.firstLoading = false;
        }else{
            for(let cardIndex = 0; cardIndex < this.monsterScroll.content.children.length; cardIndex++){
                let card = this.monsterScroll.content.children[cardIndex].getComponent("MonsterCard")
                card.seq = seq
            }
        }
        
    }

    closeMonster() {
        this.monsterSelect.active = false;
    }

    selectMonster(monsterid, monsteruid, seq) {
        console.log("Before: ")
        console.log(this.monsterTeam)
        console.log(this.monsterIdTeam)
        var change = false

        for (var i = 0; i < this.monsterTeam.length; i++) {
            if(monsteruid == this.monsterIdTeam[i]){
                this.monsterTeam[i] = this.monsterTeam[seq - 1]
                this.monsterIdTeam[i] = this.monsterIdTeam[seq - 1]
                this.monsterImage(this.monsterTeam[i], (i+1).toString())
                change = true
                break
            }else{
                if(monsterid == this.monsterTeam[i]){
                    let tempUid = this.monsterIdTeam[i]
                    let tempSeqId = this.monsterTeam[seq - 1]
                    let tempSeqUid = this.monsterIdTeam[seq - 1]
                    if(tempUid != tempSeqUid){
                        this.monsterTeam[i] = tempSeqId
                        this.monsterIdTeam[i] = tempSeqUid
                        this.monsterImage(this.monsterTeam[i], (i+1).toString())
                    }
                    for(let cardIndex = 0; cardIndex < this.monsterScroll.content.children.length; cardIndex++){
                        let card = this.monsterScroll.content.children[cardIndex].getComponent("MonsterCard")
                        if(card.monsteruid == tempUid){
                            card.inTeam.active = false
                            break;
                        }
                    }
                    change = true
                    break
                }
            }
        }
        if(!change){
            for(let cardIndex = 0; cardIndex < this.monsterScroll.content.children.length; cardIndex++){
                let card = this.monsterScroll.content.children[cardIndex].getComponent("MonsterCard")
                if(card.monsteruid == this.monsterIdTeam[seq - 1]){
                    card.inTeam.active = false
                    break;
                }
            }
        }
        this.monsterTeam[seq - 1] = monsterid
        this.monsterIdTeam[seq - 1] = monsteruid
        this.monsterImage(this.monsterTeam[seq - 1], seq)
        console.log("After: ")
        console.log(this.monsterTeam)
        console.log(this.monsterIdTeam)
    }

    monsterImage(monsterid, seq : string) {
        if (this.currentMode == 5) {
            console.log(seq)
            var imgMonster = this.fiveEmbattleContent.getChildByName(seq).getChildByName("Monster").getComponent(cc.Sprite);
            cc.loader.loadRes(`monster/${monsterid}`, cc.SpriteFrame, function(err, spriteFrame) {
                this.getComponent(cc.Sprite).spriteFrame = spriteFrame
            }.bind(imgMonster))
        } else {
            var imgMonster = this.threeEmbattleContent.getChildByName(seq).getChildByName("Monster").getComponent(cc.Sprite);
            cc.loader.loadRes(`monster/${monsterid}`, cc.SpriteFrame, function(err, spriteFrame) {
                this.getComponent(cc.Sprite).spriteFrame = spriteFrame
            }.bind(imgMonster))
        }
    }

    updateEmbattle() { //更新布阵
        if (this.currentMode == 5) {
            this.last = this.fiveEmbattleContent.childrenCount.toString()
            var imgEmbattle = this.fiveEmbattleContent.getChildByName(this.last).getChildByName("Monster").getComponent(cc.Sprite);
            if (imgEmbattle.spriteFrame.name != "1") {
                httpMng.post("/embattle/updateEmbattle", { length: this.currentMode, teamid: this.currentTeam, monsterUid: this.monsterTeam, monsterId: this.monsterIdTeam }, 
                (ret) => {
                    //显示怪兽到该布阵位置
                    console.log(ret)
                });
                console.log("添加至后端数据库")
            } else {
                let message = "未满足布阵需求"
                console.log(message)
                this.showPopup(message)
            }
        } else {
            this.last = this.threeEmbattleContent.childrenCount.toString()
            var imgEmbattle = this.threeEmbattleContent.getChildByName(this.last).getChildByName("Monster").getComponent(cc.Sprite);
            if (imgEmbattle.spriteFrame.name != "1") {
                httpMng.post("/embattle/updateEmbattle", { length: this.currentMode, teamid: this.currentTeam, monsterUid: this.monsterTeam, monsterId: this.monsterIdTeam }, 
                (ret) => {
                    //显示怪兽到该布阵位置
                    console.log(ret)
                });
                console.log("添加至后端数据库")
            } else {
                let message = "未满足布阵需求"
                console.log(message)
                this.showPopup(message)
            }
        }
    }

    useEmabattle() {
        httpMng.post("/embattle/useEmbattle", { length: this.currentMode, teamid: this.currentTeam },
        (ret) => {
            console.log(ret)
        })
    }

    update () {

    }
}
