import Camper from "../../Common/Camper";
import GlobalData from "../../Common/GlobalData";
import GameMgr from "../../Manager/GameMgr";
import httpMng from "../../Module/HttpMng";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PvEStagePage extends cc.Component {

    @property(cc.Node)
    ListContent: cc.Node = null;
    @property(cc.Node)
    errMessage: cc.Node = null;

    onLoad () {
        this.getPvERecord();
    }

    getPvERecord() { //显示已通过关卡
        httpMng.post("/matching/getPvERecord", {},
        (ret) => {

        })
    }

    getCurrentCheckPoint(event, customEventData) { //获取当前关卡
        httpMng.post("/matching/getCheckPoint", { checkpoint: customEventData },
        (ret) => {
            if (ret == 0) {
                this.errMessage.active = true;
                this.errMessage.getChildByName("Label").getComponent(cc.Label).string = "未通过之前的关卡"
                this.scheduleOnce(() => {
                    this.errMessage.active = false;
                }, 2)
            } else {
                var checkpoint = "CheckPoint" + customEventData
                this.addPage(checkpoint)
            }
        })
    }

    addPage(pageName: string) {
        let gm = GameMgr.getInstance();
        gm.addPage(pageName);
    }

}
