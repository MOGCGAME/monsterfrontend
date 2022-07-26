import Camper from "../Common/Camper";
import GlobalData from "../Common/GlobalData";
import ResourceMgr from "../Manager/ResourceMgr";
import httpMng from "../Module/HttpMng";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BagPage extends cc.Component {

    @property(cc.Node)
    topBarBtns: cc.Node = null;
    @property(cc.Node)
    bagContent: cc.Node = null;
    @property(cc.Label)
    bagPropCount: cc.Label = null;
    @property(cc.Node)
    display_prop: cc.Node = null;
    @property(cc.Label)
    display_name: cc.Label = null;
    @property(cc.Label)
    display_ownCount: cc.Label = null;
    @property(cc.Label)
    display_introduce: cc.Label = null;
    @property(cc.Node)
    item_btns: cc.Node = null;
    @property(cc.Node)
    monsterUsedPanel: cc.Node = null;
    
    currentItem: cc.Node;
    currentUserPropInfo: UserPropInfo;

    onLoad () {
        this.clearPanel();
        this.clearBag();
        this.updateBag();
    }

    clearPanel() {
        // let frameAndBase = ResourceMgr.getFrameAndBase("N");
        this.display_prop.getChildByName("Base").getComponent(cc.Sprite).spriteFrame = null;
        this.display_prop.getChildByName("Frame").getComponent(cc.Sprite).spriteFrame = null;
        this.display_prop.getChildByName("Avatar").getComponent(cc.Sprite).spriteFrame = null;
        this.display_name.string = "";
        this.display_ownCount.string = "0";
        this.display_introduce.string = "";
        this.item_btns.active = false;
        // this.item_btns.children.forEach(c => {
        //     c.active = false;
        // });
    }

    clearBag() {
        let frame = this.bagContent.children[0];
        let prop = frame.getChildByName("Prop");
        frame.active = false;
        prop.active = false;
        for (let i = 1; i < this.bagContent.childrenCount; i++) {
            this.bagContent.children[i].destroy();
        }
        this.bagPropCount.string = "";
    }

    addClickEffect(node: cc.Node) {
        for (let child of this.bagContent.children) {
            let frameNode = child.getChildByName("frameNode-xxx")
            if (frameNode) {
                frameNode.destroy();
            }
        }
        let frameNode = new cc.Node("frameNode-xxx");
        frameNode.y = 4;
        //frameNode.addComponent(DragonBone).init("DragonBone/Common/Frame").playAnimation("run", 0);
        node.addChild(frameNode);
    }

    updateBag() {
        httpMng.post("/prop/getProp", {}, (ret)=> {
            for (var i = 0; i < 40; i++) {
                let frameCopy = cc.instantiate(this.bagContent.children[0]);
                frameCopy.active = true;
                this.bagContent.addChild(frameCopy);
                if (ret.propInfo[i]) {
                    let userPropInfo = ret.propInfo[i];
                    let prop = frameCopy.getChildByName("Prop");
                    let frameUrl = "icon/frameandbase/frame"+userPropInfo.rarity;
                    let baseUrl = "icon/frameandbase/base"+userPropInfo.rarity;
                    console.log(frameUrl)
                    cc.loader.loadRes(frameUrl, cc.SpriteFrame, function(err, spriteFrame) {
                        this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                    }.bind(prop.getChildByName("Frame").getComponent(cc.Sprite)))
                    cc.loader.loadRes(baseUrl, cc.SpriteFrame, function(err, spriteFrame) {
                        this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                    }.bind(prop.getChildByName("Base").getComponent(cc.Sprite)))
                    cc.loader.loadRes(`icon/prop/${userPropInfo.id}`, cc.SpriteFrame, function(err, spriteFrame) {
                        this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                    }.bind(prop.getChildByName("Avatar").getComponent(cc.Sprite)))
                    prop.getChildByName("Count").getComponent(cc.Label).string = "x" + userPropInfo.amount;
                    prop.active = true;
                    prop.on(cc.Node.EventType.TOUCH_END, () => {
                        // this.currentItem = frameCopy;
                        // this.currentUserPropInfo = userPropInfo;
                        this.addClickEffect(frameCopy);
                        this.clearPanel();
                        this.item_btns.active = true
                        // cc.loader.loadRes(frameUrl, cc.SpriteFrame, function(err, spriteFrame) {
                        //     this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                        // }.bind(this.display_prop.getChildByName("Frame").getComponent(cc.Sprite)))
                        // cc.loader.loadRes(baseUrl, cc.SpriteFrame, function(err, spriteFrame) {  
                        //     this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                        // }.bind(this.display_prop.getChildByName("Base").getComponent(cc.Sprite)))
                        cc.loader.loadRes(frameUrl, cc.SpriteFrame, function(err, spriteFrame) {
                            this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                        }.bind(this.display_prop.getChildByName("Frame").getComponent(cc.Sprite)))
                        cc.loader.loadRes(baseUrl, cc.SpriteFrame, function(err, spriteFrame) {  
                            this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                        }.bind(this.display_prop.getChildByName("Base").getComponent(cc.Sprite)))
                        cc.loader.loadRes(`icon/prop/${userPropInfo.id}`, cc.SpriteFrame, function(err, spriteFrame) {
                            this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                        }.bind(this.display_prop.getChildByName("Avatar").getComponent(cc.Sprite)))
                        this.display_name.string = userPropInfo.name;   
                        this.display_ownCount.string = userPropInfo.amount;
                        this.display_introduce.string = userPropInfo.introduce;
                    })
                }
            }
        })
    }

    useItem(){
        this.monsterUsedPanel.active = true
        var content = this.monsterUsedPanel.getChildByName("ScrollView").getChildByName("View").getChildByName("Content")
        var firstFrame = content.children[0]
        for(let x = content.children.length - 1; x > 0; x--){
            content.children[x].destroy()
        }
        httpMng.post("/monster/getMonster",{},(ret)=>{
            console.log(ret)
            var monsters = ret.monster
            for(let x = 0; x < monsters.length; x++){
                var frameCopy = cc.instantiate(firstFrame)
                var prop = frameCopy.getChildByName("Prop")
                cc.loader.loadRes(`monster/${monsters[x].monster_id}`, cc.SpriteFrame, function(err, spriteFrame) {
                    this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                }.bind(prop.getChildByName("Avatar").getComponent(cc.Sprite)))
                content.addChild(frameCopy)
                frameCopy.on(cc.Node.EventType.TOUCH_END, () => {
                    this.monsterUsedPanel.active = false
                    
                    //触发物品效果
                    //物品数量调整
                })
            }
            if(monsters.length <= 0){
                firstFrame.active = false
            }else{
                firstFrame.destroy()
            }
        })
    }
}
