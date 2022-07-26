import Camper from "../Common/Camper";
import GlobalData from "../Common/GlobalData";
import GameMgr from "../Manager/GameMgr";
import ResourceMgr from "../Manager/ResourceMgr";
import usrMng from "../Module/UserMng";
import G from "../Module/Global";
import httpMng from "../Module/HttpMng";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainPage extends cc.Component {
    @property(cc.Node)
    userInfo: cc.Node = null;
    @property(cc.Node)
    headerList: cc.Node = null;
    @property(cc.Node)
    bottomList: cc.Node = null;
    @property(cc.Prefab)
    vsPage: cc.Prefab = null;
    @property(cc.Prefab)
    matchingPage: cc.Prefab = null;
    @property(cc.Node)
    pvpBtn: cc.Node = null;
    @property(cc.Node)
    pveBtn: cc.Node = null;
    @property(cc.Node)
    infoPanel: cc.Node = null;
    @property(cc.Prefab)
    info: cc.Prefab = null;
    @property(cc.Prefab)
    loading: cc.Prefab = null;
    @property(cc.Prefab)
    pvp: cc.Prefab = null;
    @property(cc.Prefab)
    pve: cc.Prefab = null
    @property(cc.Prefab)
    ranking: cc.Prefab = null;
    @property(cc.Prefab)
    friend: cc.Prefab = null;
    @property(cc.Prefab)
    monster: cc.Prefab = null;
    @property(cc.Prefab)
    embattle: cc.Prefab = null;
    @property(cc.Prefab)
    bag: cc.Prefab = null;
    @property(cc.Prefab)
    settingPage: cc.Prefab
    @property(cc.ParticleSystem)
    thunderParticle : cc.ParticleSystem
 
    x: string;
    found: number;

    afterInitGuest() {
        //显示user的nickname
        this.userInfo.getChildByName("NameFrame").getChildByName("Label").getComponent(cc.Label).string = usrMng.nickName
        //显示头像
        cc.loader.loadRes(`headIcon/${usrMng.headIcon}`, cc.SpriteFrame, function (err, spriteFrame) {
            if (err == null) {
                this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                G.iconHeadSprite = spriteFrame
            }
        }.bind(this.userInfo.getChildByName("HeadIcon").getChildByName("Avatar").getComponent(cc.Sprite)))
        //显示头像框
        cc.loader.loadRes(`frame/${usrMng.frame}`, cc.SpriteFrame, function(err, spriteFrame) {
            if (err == null) {
                this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                G.frameSprite = spriteFrame
            }
        }.bind(this.userInfo.getChildByName("HeadIcon").getChildByName("Frame").getComponent(cc.Sprite)))
        
    }

    onLoad () {
        usrMng.getGuest(this.afterInitGuest.bind(this));
        this.found = 0;
        this.scheduleOnce(function(){
            this.thunderParticle.resetSystem()
        }, 1.5)
    }

    pveList() {
        let gm = GameMgr.getInstance();
        gm.addPage("PvePage");
    }

    pvpLobby() {
        let gm = GameMgr.getInstance();
        gm.addPage("PvpJoin");
    }

    pvpClick(){
        G.createGameObjectwithBackgroundThatBlocksInput(this.node, this.loading)
        this.scheduleOnce(function(){
            G.createGameObjectwithBackgroundThatBlocksInput(this.node, this.pvp)
        },1)
        
    }

    pveClick(){
        G.createGameObjectwithBackgroundThatBlocksInput(this.node, this.loading)
        this.scheduleOnce(function(){
            G.createGameObjectwithBackgroundThatBlocksInput(this.node, this.pve)
        },1)
    }

    rankingClick(){
        G.createGameObjectwithBackgroundThatBlocksInput(this.node, this.loading)
        this.scheduleOnce(function(){
            G.createGameObjectwithBackgroundThatBlocksInput(this.node, this.ranking)
        },1)
    }

    monsterClick(){
        G.createGameObjectwithBackgroundThatBlocksInput(this.node, this.loading)
        this.scheduleOnce(function(){
            G.createGameObjectwithBackgroundThatBlocksInput(this.node, this.monster)
        },1)
    }

    embattleClick(){
        G.createGameObjectwithBackgroundThatBlocksInput(this.node, this.loading)
        this.scheduleOnce(function(){
            G.createGameObjectwithBackgroundThatBlocksInput(this.node, this.embattle)
        },1)
    }

    bagClick(){
        G.createGameObjectwithBackgroundThatBlocksInput(this.node, this.loading)
        this.scheduleOnce(function(){
            G.createGameObjectwithBackgroundThatBlocksInput(this.node, this.bag)
        },1)
    }

    friendClick(){
        G.createGameObjectwithBackgroundThatBlocksInput(this.node, this.loading)
        this.scheduleOnce(function(){
            G.createGameObjectwithBackgroundThatBlocksInput(this.node, this.friend)
        },1)
    }

    pvpMatching() {
        console.log("pvp")
        httpMng.post("/matching/getSelfInfo", { length: 3 }, 
        (ret) => {
            var matching = cc.instantiate(this.matchingPage)
            var matchingInfo = matching.getComponent("MatchingPage");
            matchingInfo.init(ret.self)
            this.node.addChild(matching)
            this.scheduleOnce(function() {
                if (this.found != 1) {
                    GameMgr.pageStack = [];
                    httpMng.post("/matching/renewMatching", { matching: 0 },
                    (ret) => {
                        console.log(ret)
                    })
                    cc.director.loadScene("Game");
                }
            }, 10)
        })
        var x = 10;
        var matching = function() {
            x--;
            httpMng.post("/matching/getPvPMatching", { length: 3, matching: 1 }, 
            (ret) => {
                if (ret.code == "success") {
                    //显示双方匹配阵容
                    var match = cc.instantiate(this.vsPage)
                    var matchInfo = match.getComponent("VSPage");
                    matchInfo.init(ret.self, ret.enemy);
                    G.createGameObjectwithBackgroundThatBlocksInput(this.node, this.vsPage)        
                    this.scheduleOnce(function () {
                        //带着双方参数进入对战
                        this.found = 1;
                        httpMng.post("/matching/renewMatching", { matching: 0 },
                        (ret) => {
                            console.log(ret)
                        })
                        cc.sys.localStorage.setItem("match", JSON.stringify(ret));
                        cc.director.loadScene("PVPBattle");
                    }, 2);
                } else {
                    console.log(ret.code)
                }
            })
            if (x <= 0) {
                this.unschedule(matching);
            }
        }
        this.schedule(matching, 1);

    }

    selfInfo() {
        httpMng.post("/user/getInfo", { uid : usrMng.uid },
        (ret) => {
            var userNode = cc.instantiate(this.info)
            userNode.getComponent("InfoPage").selfInit(ret.info);
            this.infoPanel.active = true;
            this.infoPanel.addChild(userNode);
        })

    }

    openSettingPage(){
        var settingPage = cc.instantiate(this.settingPage)
        this.node.addChild(settingPage)
    }

    cancelSchedule() {
        this.found == 1
    }

    addPage(e: cc.Event.EventTouch, pageName: string) {
        if (pageName == "6v6Page" && GlobalData.countEmbattleInfo() == 0) {
            Camper.getInstance().showToast("请至少上阵六只怪兽");
            return;
        }
        let gm = GameMgr.getInstance();
        gm.addPage(pageName);
    }
}
