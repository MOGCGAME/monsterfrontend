import httpMng from "../Module/HttpMng";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BattleMgr extends cc.Component {
    @property(cc.Node)
    backGroundNode: cc.Node = null;
    @property(cc.Sprite)
    hpLeft: cc.Sprite = null;
    @property(cc.Sprite)
    hpRight: cc.Sprite = null;
    @property(cc.Sprite)
    headIconLeft: cc.Sprite = null;
    @property(cc.Sprite)
    headIconRight: cc.Sprite = null;

    static online: boolean = false;

    static instance: BattleMgr;


    getEmbattle(uid, teamid) {
        //根据玩家选择的队伍id选择的布阵
        httpMng.post("/embattle/getEmbattle", { uid: uid, teamid: teamid }, 
            (ret) => {
                //
                console.log("ret:", ret);
            })
    }

    onLoad () {

    }

    start () {

    }

    // update (dt) {}
}
