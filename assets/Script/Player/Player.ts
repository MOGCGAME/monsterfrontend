import GlobalData from "../Common/GlobalData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    onLoad() {
        GlobalData.player = this;
    }

}