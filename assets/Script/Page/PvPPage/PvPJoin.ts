import G from "../../Module/Global";
import httpMng from "../../Module/HttpMng";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PvPJoin extends cc.Component {

    @property(cc.Prefab)
    loading: cc.Prefab = null
    @property(cc.Prefab)
    room: cc.Prefab = null
    @property(cc.Node)
    layout3: cc.Node = null    
    @property(cc.Node)
    layout5: cc.Node = null

    toRoom(event, customEventData) {
        G.createGameObjectwithBackgroundThatBlocksInput(this.node, this.loading);
        this.scheduleOnce(function() {
            cc.sys.localStorage.setItem("room", JSON.stringify(customEventData));
            G.createGameObjectwithBackgroundThatBlocksInput(this.node, this.room);
        }, 1)
    }

    getCurrentTeam() {
        httpMng.post("/embattle/getCurrentEmbattle", {length: 3},
        (ret) => {
            console.log("ret:", ret)
            var cardSpriteArr = [], cardImgUrl = []
            for (var i = 0; i < this.layout3.childrenCount; i++) {
                cardSpriteArr[i] = this.layout3.children[i].getComponent(cc.Sprite)
                cardImgUrl[i] = "monster/" + ret.embattleInfo[i].user_monster_id
                cc.loader.loadRes(cardImgUrl[i], cc.SpriteFrame, function(err, spriteFrame) {
                    this.spriteFrame = spriteFrame
                }.bind(cardSpriteArr[i]))
            }
        })
        httpMng.post("/embattle/getCurrentEmbattle", {length: 5},
        (ret) => {
            var cardSpriteArr = [], cardImgUrl = []
            for (var i = 0; i < this.layout5.childrenCount; i++) {
                cardSpriteArr[i] = this.layout5.children[i].getComponent(cc.Sprite)
                cardImgUrl[i] = "monster/" + ret.embattleInfo[i].user_monster_id
                cc.loader.loadRes(cardImgUrl[i], cc.SpriteFrame, function(err, spriteFrame) {
                    this.spriteFrame = spriteFrame
                }.bind(cardSpriteArr[i]))
            }
        })
    }

    onLoad () {
        this.getCurrentTeam();
    }

    start () {

    }

    // update (dt) {}
}
