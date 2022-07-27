import GameMgr from "../Manager/GameMgr";

const {ccclass, property} = cc._decorator;

@ccclass
class TopBar extends cc.Component {

    @property(cc.Node)
    area_bg: cc.Node = null;
    @property(cc.Node)
    area_label: cc.Node = null;
    @property(cc.Node)
    layout: cc.Node = null;
    @property(cc.Node)
    btn_back: cc.Node = null;

    label_theme: cc.Label = null;
    item_text_list: cc.Label[] = [];
    @property(cc.Node)
    block_input_events: cc.Node = null


    onLoad () {
        cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);

        this.adapt();
        this.label_theme = this.area_label.getChildByName("Label").getComponent(cc.Label);
        this.layout.children.forEach((item: cc.Node) => {
            this.item_text_list.push(item.getChildByName("Text").getComponent(cc.Label));
        });
        this.btn_back.on(cc.Node.EventType.TOUCH_END, () => {
            this.back();
            this.node.destroy();
        });
    }

    back() {
        let pageInfo = GameMgr.pageStack.pop();
        if (pageInfo.name == "MonsterDetailPage") {
            pageInfo.name = "MonsterPage";
            GameMgr.pageStack.push(pageInfo);
            let pi: any = pageInfo;
            cc.tween(pi.bag).to((pi.bagTargetX - pi.bag.x) / pi.speed, {x: pi.bagTargetX}).start();
            cc.tween(pi.display).to((pi.displayTargetX - pi.display.x) / pi.speed, {x: pi.displayTargetX}).start();
            cc.tween(pi.detail).to((pi.detailTargetX - pi.detail.x) / pi.speed, {x: pi.detailTargetX}).start();
            cc.tween(pi.detailBar).to((pi.detailBar.x - pi.detailBarTargetX) / pi.speed, {x: pi.detailBarTargetX}).then(cc.callFunc(() => {
                pi.target.detailLock = false;               
            })).start();
        } else {
            pageInfo.node.destroy();
            pageInfo.eventBlock.destroy(); 
        }
    }

    adapt() {
        this.node.zIndex = 10;
        this.area_bg.width = cc.winSize.width;
        this.area_label.x = -cc.winSize.width / 2;
        this.layout.x = cc.winSize.width / 2 + 340;
        // this.btn_back.x = cc.winSize.width / 2 - 10;
        this.btn_back.x = - cc.winSize.width / 2 + 120;
    }

    update () {
        if (GameMgr.pageStack.length == 1) {
            this.area_bg.active = false;
            this.area_label.active = false;
            //this.btn_back.active = false;
            this.layout.x = -this.layout.width / 2 + 100;
        } else {
            // this.area_bg.active = true;
            // this.area_label.active = true;
            //this.btn_back.active = true;
            this.layout.x = -cc.winSize.width / 2 + 340;
        }
        this.label_theme.string = GameMgr.pageStack[GameMgr.pageStack.length - 1].theme;
    }

    setBlockInputEvents(active:boolean){
        this.block_input_events.active = active
        if(active){
            this.btn_back.opacity = 128
        }else{
            this.btn_back.opacity = 255
        }
    }
}

var topbar = new TopBar();
export default topbar