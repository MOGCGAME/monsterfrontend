import G from "../Module/Global";

const {ccclass, property} = cc._decorator;

@ccclass
export default class loading extends cc.Component {
    
    @property(cc.Label)
    txt: cc.Label

    onLoad () {
        //this.txt.string = ""
        var txtLabel = "缓存中"
        var a = ""
        var t = 0
        var countdowntime = function() {
            t++
            var x = "。"
            a = a + x
            this.txt.string = txtLabel + a
            if (t >= 4) {
                this.txt.string = ""
                this.unschedule(countdowntime)
                G.destroyGameObjectwithBackgroundThatBlocksInput(this.node.uuid);
            }
        }
        this.schedule(countdowntime, 0.25)
            
    }



}
