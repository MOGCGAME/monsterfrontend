import httpMng from "../Module/HttpMng";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MatchingPage extends cc.Component {

    @property(cc.Node)
    selfMonster: cc.Node = null;
    @property(cc.Node)
    enemyMonster: cc.Node = null;
    @property(cc.Node)
    countdown: cc.Node = null;


    init (self) { //初始值
        if (self.length == 5) {
            this.selfMonster.children[0].active = true;
            this.enemyMonster.children[0].active = true;
            for (var i = 0; i < self.length; i++) {
                cc.loader.loadRes(`monster/${self[i].monster_id}`, cc.SpriteFrame, function (err, spriteFrame) {
                    this.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                }.bind(this.selfMonster.children[0].children[i].getChildByName("Monster").getComponent(cc.Sprite)))
            }
        } else {
            this.selfMonster.children[1].active = true;
            this.enemyMonster.children[1].active = true;
            for (var i = 0; i < self.length; i++) {
                cc.loader.loadRes(`monster/${self[i].monster_id}`, cc.SpriteFrame, function (err, spriteFrame) {
                    this.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                }.bind(this.selfMonster.children[1].children[i].getChildByName("Monster").getComponent(cc.Sprite)))
            }
        }
        var t = 0;
        var countdowntime = function() {
            t++;
            this.countdown.getChildByName("Label").getComponent(cc.Label).string = t;
            if (t >= 10) {
                this.unschedule(countdowntime);
            }
        }
        this.schedule(countdowntime, 1)
    }

    back() {
        httpMng.post("/matching/renewMatching", { matching: 0 }, 
        (ret) => {
            if (ret.code == "success") {
                console.log(this.node.parent);
                this.node.parent.getComponent("MainPage").cancelSchedule();
                this.node.parent.getChildByName("MatchingPage").destroy();
                cc.director.loadScene("Game");
            }
        })
    }

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
