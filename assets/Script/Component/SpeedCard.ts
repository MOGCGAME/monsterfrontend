// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class SpeedCard extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    hp:any
    speed:any
    imageid:any
    monster_uid:any
    isInit :boolean = false

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    init(monsterInfo){
        this.hp = monsterInfo["hp"]
        this.speed = monsterInfo["speed"]
        this.imageid = monsterInfo["image"]
        this.monster_uid = monsterInfo["monster"]
        cc.loader.loadRes('monster/'+this.imageid, cc.SpriteFrame, function(err, spriteFrame) {
            this.getComponent(cc.Sprite).spriteFrame = spriteFrame
        }.bind(this.node.children[0].getChildByName("image").getComponent(cc.Sprite)));
        this.isInit = true
    }
    start () {

    }

    update (dt) {
        if(this.isInit && this.hp <= 0){
            this.node.active = false;
        }
    }

    setHp(hp = 0){
        this.hp = hp
        if(this.hp <= 0){
            this.node.active = false
            console.log("disappear")
        }
    }

    getMonster_uid(){
        return this.monster_uid;
    }
}
