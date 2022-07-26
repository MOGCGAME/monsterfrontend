import GameMgr from "../../Manager/GameMgr";
import httpMng from "../../Module/HttpMng";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MonsterPage extends cc.Component {
    @property(cc.Node)
    bag: cc.Node = null;                    //背包
    @property(cc.Node)
    display: cc.Node = null;                //怪兽显示
    @property(cc.Node)
    detail: cc.Node = null;                 //怪兽内容
    @property(cc.Node)
    detailBar: cc.Node = null;              //怪兽内容列表
    //bag
    @property(cc.Node)
    btnList: cc.Node = null;                //稀有度列表
    @property(cc.Label)
    bagLabelValue: cc.Label = null;         //携带数量
    @property(cc.Node)
    bagContent: cc.Node = null;             //背包列表
    @property(cc.Node)
    bagContentItem: cc.Node = null;         //背包内容
    //display
    @property(cc.Sprite)
    rarity: cc.Sprite = null;               //稀有度
    @property(cc.Label)
    monsterName: cc.Label = null;           //怪兽名称
    @property(cc.Node)
    monsterDetailBtn: cc.Node = null;       //怪兽详情按钮
    @property(cc.Node)
    monsterModel: cc.Node = null;           //怪兽模型
    @property(cc.Node)
    monsterFrame: cc.Node = null;           //怪兽稀有度框
    @property(cc.Node)
    monsterIntroduce: cc.Node = null;       //怪兽简介+技能
    @property(cc.Label)
    monsterStatusList: cc.Label[] = [];     //怪兽四围
    //detail
    @property(cc.Node)
    monsterDescription: cc.Node = null;     //怪兽简介
    @property(cc.Node)
    skill: cc.Node = null;       //怪兽技能简介
    @property(cc.SpriteFrame)
    detailBtnFrame: cc.SpriteFrame[] = [];  //怪兽内容列表区分
    //detailChildren
    @property(cc.Prefab)
    detail_equipment: cc.Prefab = null;     //怪兽装备栏
    @property(cc.Prefab)
    detail_equipmentSelect: cc.Prefab = null;   //怪兽装备选择

    detailLock: boolean = false;
    monsterInfo: [];
    monsterUid: string;
    monsterSortString: string;

    @property(cc.Color)
    rarity_color1: cc.Color = new cc.Color(246,179,97,255)
    @property(cc.Color)
    rarity_color2: cc.Color = new cc.Color(218,213,213,255)
    @property(cc.Color)
    rarity_color3: cc.Color = new cc.Color(248,89,89,255)
    onLoad () {
        this.monsterDetailBtn.on(cc.Node.EventType.TOUCH_END, () => {
            if (this.detailLock) {
                return;
            }
            this.detailLock = true;
            let pageInfo = GameMgr.pageStack[GameMgr.pageStack.length - 1];
            pageInfo.name = "MonsterDetailPage";
            let speed = 1000;
            (pageInfo as any).speed = speed;
            (pageInfo as any).target = this;
            (pageInfo as any).bag = this.bag;
            (pageInfo as any).detail = this.detail;
            (pageInfo as any).detailBar = this.detailBar;
            (pageInfo as any).display = this.display;
            (pageInfo as any).bagTargetX = this.bag.x;
            (pageInfo as any).detailTargetX = this.detail.x;
            (pageInfo as any).detailBarTargetX = this.detailBar.x;
            (pageInfo as any).displayTargetX = this.display.x;
            let bagTargetX = -cc.winSize.width / 2  - this.bag.width;
            let detailTargetX = cc.winSize.width / 2 - this.detail.width - 20;
            let detailBarTargetX = -cc.winSize.width / 2;
            let displayTargetX = (detailBarTargetX + this.detailBar.width + detailTargetX) / 2;
            cc.tween(this.bag).to((this.bag.x - bagTargetX) / speed, {x: bagTargetX}).start();
            cc.tween(this.display).to((this.display.x - displayTargetX) / speed, {x: displayTargetX}).start();
            cc.tween(this.detail).to((this.detail.x - detailTargetX) / speed, {x: detailTargetX}).start();
            cc.tween(this.detailBar).to((detailBarTargetX - this.detailBar.x) / speed, {x: detailBarTargetX}).start();
            this.detailBar.getChildByName("Btns").children.forEach(c => {
                c.getComponent(cc.Sprite).spriteFrame = this.detailBtnFrame[0];
                c.getChildByName("Label").color = cc.color(0, 55, 125);
            });
            this.detailBar.getChildByName("Btns").children[0].getComponent(cc.Sprite).spriteFrame = this.detailBtnFrame[1];
            this.detailBar.getChildByName("Btns").children[0].getChildByName("Label").color = cc.color(155, 75, 0);
            // let childPanel = this.detail.getChildByName("ChildPanel");
            //     childPanel.children.forEach(c => {
            //     c.destroy();
            // });
        });
        this.rankBag(null, "rarity");
    }

    clickDetailBtn(e: cc.Event.EventTouch) {
        this.detailBar.getChildByName("Btns").children.forEach(c => {

        });
        let btnName = e.getCurrentTarget().getChildByName("Label").getComponent(cc.Label).string;

        if (btnName == "详情") {
            // this.updateDetailStatusList();
            // this.updateSkillList();
        } else if (btnName == "装备") {
            
        }
    }

    clickMonster(event, customEventData) {
        // let speed = 1000;
        // let bagTargetX = -580;
        // let displayTargetX = 270;
        // cc.tween(this.bag).to((this.bag.x - bagTargetX) / speed, {x: bagTargetX}).start();
        // cc.tween(this.display).to((this.display.x - displayTargetX) / speed, {x: displayTargetX}).start();
        var monsteruid = event.target.children[6].getComponent(cc.Label).string;
        if (monsteruid == this.monsterUid) {
            // this.monsterDetailBtn.emit(cc.Node.EventType.TOUCH_END);
            return;
        } else {
            this.monsterUid = monsteruid;
            httpMng.post("/monster/showMonsterDetail", {monsteruid: monsteruid}, 
            (ret) => {
                this.renderDisplay(ret);
            })
        }

    }

    renderDisplay(monsterDetail) {
        var skill
        this.monsterName.string = monsterDetail.monster_name;
        cc.loader.loadRes(`monster/frame/${monsterDetail.monster_rarity}_rarity`, cc.SpriteFrame, function(err, spriteFrame) {
            this.getComponent(cc.Sprite).spriteFrame = spriteFrame
        }.bind(this.monsterFrame.getComponent(cc.Sprite)))
        cc.loader.loadRes(`monster/${monsterDetail.monster_id}`, cc.SpriteFrame, function(err, spriteFrame) {
            this.getComponent(cc.Sprite).spriteFrame = spriteFrame
        }.bind(this.monsterModel.getComponent(cc.Sprite)))
        var elementLabel = this.display.getChildByName("Batch").getChildByName("Element").getChildByName("Label").getComponent(cc.Label)
        var elementEffect = this.display.getChildByName("Batch").getChildByName("Element").getChildByName("Effect")
        switch(monsterDetail.monster_element){
            case "1":
                elementLabel.string = "金"
                elementEffect.color = new cc.Color(255,165,0)
                break
            case "2":
                elementLabel.string = "木"
                elementEffect.color = new cc.Color(30,160,0)
                break
            case "3":
                elementLabel.string = "水"
                elementEffect.color = new cc.Color(0,0,255)
                break
            case "4":
                elementLabel.string = "火"
                elementEffect.color = new cc.Color(255,0,0)
                break
            case "5":
                elementLabel.string = "土"
                elementEffect.color = new cc.Color(160,50,0)
                break
            default:
                elementLabel.string = "无"
                elementEffect.color = new cc.Color(255,255,255)
                console.log("属性读取错误")
                break

        }
        

        cc.loader.loadRes(`monster/element/${monsterDetail.monster_element}`, cc.SpriteFrame, function(err, spriteFrame) {
            this.getComponent(cc.Sprite).spriteFrame = spriteFrame
        }.bind(elementEffect.getComponent(cc.Sprite)))
        this.monsterStatusList[0].string = monsterDetail.monster_hp; //生命
        this.monsterStatusList[1].string = monsterDetail.monster_attack; //攻击
        this.monsterStatusList[2].string = monsterDetail.monster_defend;//防御
        this.monsterStatusList[3].string = monsterDetail.monster_speed; //速度
        this.monsterDescription.getChildByName("Description").getComponent(cc.Label).string = monsterDetail.monster_desciption;
        if (monsterDetail.monster_skill == "") {
            skill = "无";
        } else {
            skill = monsterDetail.monster_skill + "\n" +monsterDetail.monster_skill_introduce;
        }
        this.skill.getChildByName("Label").getComponent(cc.Label).string = skill;
        this.bag.active = false;
        this.monsterIntroduce.active = true;
    }

    updateBag() {
        httpMng.post("/monster/getMonsterDetail", {sqlString: this.monsterSortString}, 
        (ret) => {
            this.bagLabelValue.string = ret.monsterDetail.length
            for (let child of this.bagContent.children) {
                if (child.active) {
                    child.destroy();
                }
            }
            
            for (var i = 0; i < ret.monsterDetail.length; i++) {
                let monster = cc.instantiate(this.bagContentItem)
                monster.active = true;
                this.bagContent.addChild(monster);
                let monsterFrame = monster.getChildByName("Frame")
                let frameColor = new cc.Color()
                switch(ret.monsterDetail[i].monster_rarity){
                    case "1":
                        frameColor = this.rarity_color1
                        break
                    case "2":
                        frameColor = this.rarity_color2
                        break
                    case "3":
                        frameColor = this.rarity_color3
                        break
                }
                monsterFrame.color = frameColor
                // cc.loader.loadRes(``, cc.SpriteFrame, function(err, spriteFrame) {
                //     this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                // }.bind(monster.getChildByName("Frame").getComponent(cc.Sprite)))
                // cc.loader.loadRes(``, cc.SpriteFrame, function(err, spriteFrame) {
                //     this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                // }.bind(monster.getChildByName("Base").getComponent(cc.Sprite)))
                // cc.loader.loadRes(``, cc.SpriteFrame, function(err, spriteFrame) {
                //     this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                // }.bind(monster.getChildByName("Rarity").getComponent(cc.Sprite)))
                // cc.loader.loadRes(``, cc.SpriteFrame, function(err, spriteFrame) {
                //     this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                // }.bind(monster.getChildByName("Level").getComponent(cc.Sprite)))
                var energy_label = monster.getChildByName("Level").getComponent(cc.Label)
                energy_label.string = ret.monsterDetail[i].monster_energy
                cc.loader.loadRes(`monster/${ret.monsterDetail[i].monster_id}`, cc.SpriteFrame, function(err, spriteFrame) {
                    this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                }.bind(monster.getChildByName("Avatar").getComponent(cc.Sprite)));
                cc.loader.loadRes(`monster/element/${ret.monsterDetail[i].monster_element}`, cc.SpriteFrame, function(err, spriteFrame) {
                    this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                }.bind(monster.getChildByName("Element").getComponent(cc.Sprite)))
                monster.getChildByName("Uid").getComponent(cc.Label).string = ret.monsterDetail[i].monster_uid;
            }
        })
        this.bag.active = true;
        this.monsterIntroduce.active = false;
        this.monsterUid = ""
    }

    rankBag(e: cc.Event.EventTouch, tag: string) {
        this.updateBag();
    }

    toggleBtnList(){
        var buttonList = this.btnList.getChildByName("Layout")
        buttonList.active = !buttonList.active
    }

    updateSortMethod(event, customEventData){
        this.monsterSortString = customEventData
        console.log(customEventData)
        this.updateBag()
        this.toggleBtnList()
    }
}