import httpMng from "../Module/HttpMng";
import G from "../Module/Global";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RankingPage extends cc.Component {

    @property(cc.Node)
    rankingContent: cc.Node = null;
    @property(cc.Node)
    infoPanel: cc.Node = null;
    @property(cc.Prefab)
    info: cc.Prefab = null;
    @property(cc.Node)
    button3v3: cc.Node = null;
    @property(cc.Node)
    button5v5: cc.Node = null;

    @property(cc.SpriteFrame)
    activeTabButton: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    inactiveTabButton: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    firstBg : cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    secondBg : cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    otherBg : cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    firstIcon : cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    secondIcon : cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    thirdIcon : cc.SpriteFrame = null;


    currentUser: any;
    mode: any;

    @property({type:cc.Integer})
    maximumShowRanking: number = 100;

    onLoad () {
        this.clearList();
        this.getRankingList(5); //初始设置5v5排行榜
        this.button5v5.getComponent(cc.Button).normalSprite = this.activeTabButton
    }

    clearList() {
        let frame = this.rankingContent.children[0];
        let friend = frame.getChildByName("Rank");
        frame.active = false;
        friend.active = false;
        for (let i = 1; i < this.rankingContent.childrenCount; i++) {
            this.rankingContent.children[i].destroy();
        }
    }

    chooseRankingList(event, customEventData) {
        this.getRankingList(customEventData);
        if(customEventData == 5){
            this.button3v3.getComponent(cc.Button).normalSprite = this.inactiveTabButton
            this.button5v5.getComponent(cc.Button).normalSprite = this.activeTabButton
        }else if(customEventData == 3){
            this.button3v3.getComponent(cc.Button).normalSprite = this.activeTabButton
            this.button5v5.getComponent(cc.Button).normalSprite = this.inactiveTabButton
        }
        
    }

    getRankingList(mode) {
        if(this.mode != mode){
            this.clearList();
            this.mode = mode;
            httpMng.post("/ranking/getPvPRanking", { mode: this.mode }, 
            (ret) => {
                for (var i = 0; i < this.maximumShowRanking; i++) {
                    let frameCopy = cc.instantiate(this.rankingContent.children[0])
                    frameCopy.active = true;
                    this.rankingContent.addChild(frameCopy);
                    if (ret.ranking[i]) {
                        let rankingInfo = ret.ranking[i];
                        let ranking = frameCopy.getChildByName("Rank");
                        var rank = i + 1
                        this.updateFrameAndBase(ranking, rank)
                        cc.loader.loadRes(`headIcon/${rankingInfo.head_icon}`, cc.SpriteFrame, function(err, spriteFrame) {
                            this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                        }.bind(ranking.getChildByName("Avatar").getComponent(cc.Sprite)))
                        ranking.getChildByName("Ranking").getComponent(cc.Label).string = String(rank);
                        ranking.getChildByName("Name").getComponent(cc.Label).string = rankingInfo.nick_name;
                        if (this.mode == 5) {
                            ranking.getChildByName("Point").getComponent(cc.Label).string = rankingInfo.rank2;
                        } else{
                            ranking.getChildByName("Point").getComponent(cc.Label).string = rankingInfo.rank1;
                        }
                        ranking.active = true;
                        ranking.on(cc.Node.EventType.TOUCH_END, () => {
                            this.currentUser = rankingInfo;
                            this.showUserInfo(this.currentUser, this.mode);
                        })
                        switch(i){
                            case 0:
                                this.modifyRankingFrame(ranking, this.firstBg, true, this.firstIcon)
                                break
                            case 1:
                                this.modifyRankingFrame(ranking, this.secondBg, true, this.secondIcon)
                                break
                            case 2:
                                this.modifyRankingFrame(ranking, this.otherBg, true, this.thirdIcon)
                                break
                            default:
                                this.modifyRankingFrame(ranking, this.otherBg, false, null)
                                break
                        }
                    }
                }
                var rankingLen = ret.ranking.length;
                var frameSizeY = this.rankingContent.children[0].getContentSize().height;
                if(rankingLen > this.maximumShowRanking){
                    this.rankingContent.setContentSize(cc.size(this.rankingContent.getContentSize().width, frameSizeY * this.maximumShowRanking + this.rankingContent.getComponent(cc.Layout).spacingY * (this.maximumShowRanking - 1)))
                } else{
                    this.rankingContent.setContentSize(cc.size(this.rankingContent.getContentSize().width, frameSizeY * rankingLen + (this.rankingContent.getComponent(cc.Layout).spacingY * ret.ranking.length - 1)))
                }
            })
        }
    }
    modifyRankingFrame(ranking: cc.Node, bg: cc.SpriteFrame, iconEnable: boolean, icon : cc.SpriteFrame){
        ranking.getChildByName("Bg").getComponent(cc.Sprite).spriteFrame = bg
        ranking.getChildByName("Position").getComponent(cc.Sprite).spriteFrame = icon
        ranking.getChildByName("Position").active = iconEnable
        ranking.getChildByName("Ranking").active = !iconEnable
    }

    showUserInfo(userInfo, mode) {
        httpMng.post("/user/getInfo", { uid : userInfo.uid },
        (ret) => {
            var userNode = cc.instantiate(this.info)
            userNode.getComponent("InfoPage").init(ret.info, mode);
            this.infoPanel.active = true;
            this.infoPanel.addChild(userNode);  
        })
    }

    updateFrameAndBase(ranking, rank) {
        let frameUrl = "icon/frameandbase/frame";
        let baseUrl = "icon/frameandbase/base";
        if (rank == 1) {
            frameUrl += 3;
            baseUrl += 3;
        } else if (rank == 2) {
            frameUrl += 2;
            baseUrl += 2;
        } else if (rank == 3) {
            frameUrl += 1;
            baseUrl += 1;
        } else {
            frameUrl += 1;
            baseUrl += 1;
        }
        cc.loader.loadRes(`${baseUrl}`, cc.SpriteFrame, function(err, spriteFrame) {
            this.getComponent(cc.Sprite).spriteFrame = spriteFrame
        }.bind(ranking.getChildByName("Base").getComponent(cc.Sprite)))
        cc.loader.loadRes(`${frameUrl}`, cc.SpriteFrame, function(err, spriteFrame) {
            this.getComponent(cc.Sprite).spriteFrame = spriteFrame
        }.bind(ranking.getChildByName("Frame").getComponent(cc.Sprite)))
    }

    start () {

    }

    // update (dt) {}
}
