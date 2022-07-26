import G from "../../Module/Global";
import httpMng from "../../Module/HttpMng";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CheckPoint extends cc.Component {

    @property(cc.Node)
    Title: cc.Node = null;
    @property(cc.Prefab)
    vsPage: cc.Prefab = null;
    @property(cc.Node)
    popupDialog: cc.Node

    onLoad () {

    }

    showPopup(message: string){
        this.popupDialog.active = true
        this.popupDialog.getChildByName("popup_text").getComponent(cc.Label).string = message
        this.scheduleOnce(() => {
            this.popupDialog.active = false
        }, 2)
    }

    stageBattle(event, customEventData) {
        var title = this.Title.name
        var checkpoint = title.charAt(title.length - 1)
        httpMng.post("/matching/getStage", {checkpoint: checkpoint, stage: customEventData},
        (ret) => {
            console.log("ret:", ret)
            if (ret.stage != 0 && ret.checkpoint != 0) {
                httpMng.post("/matching/getPvEMatching", {checkpoint: ret.checkpoint, stage: ret.stage, length: ret.length},
                (ret) => {
                    console.log({ret})
                    var match = cc.instantiate(this.vsPage)
                    var matchInfo = match.getComponent("VSPage")
                    if(ret.self != null){
                        matchInfo.init(ret.self, ret.enemy)
                        G.createGameObjectwithBackgroundThatBlocksInput(this.node, this.vsPage)
                        this.scheduleOnce(function() {
                            cc.sys.localStorage.setItem("match", JSON.stringify(ret));
                            cc.director.loadScene("PvPBattle-1"); //
                        })
                    }else{
                        let message = "上阵怪兽不足"
                        console.log(message)
                        this.showPopup(message)
                    }
                    
                })
            } else {
                let message = "未完成之前的关卡"
                console.log(message)
                this.showPopup(message)
            }

        })
    }
}
