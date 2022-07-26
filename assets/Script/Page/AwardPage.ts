const {ccclass, property} = cc._decorator;

@ccclass
export default class AwardPage extends cc.Component {

    @property(cc.Label)
    point: cc.Label = null;
    @property(cc.Label)
    title: cc.Label = null;

    // onLoad () {}

    init(result, award) {
        if (result == 0) {
            this.point.string = award;
        } else {
            this.point.string = award;
        }
    }

    start () {

    }

    // update (dt) {}
}
