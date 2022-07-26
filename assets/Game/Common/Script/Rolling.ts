
const {ccclass, property} = cc._decorator;

@ccclass
export default class Rolling extends cc.Component {

    @property(cc.Label)
    content: cc.Label = null

    @property(cc.Prefab)
    numLayoutPrefab: cc.Prefab

    @property(cc.Node)
    allLayoutNode: cc.Node

    prefabPool 
    prefabArray
    numLayout
    eachHeight
    hp

    onLoad () {
        //this.init()
    }

    init(targetHp){
        if(targetHp > 0){
            this.prefabPool = new cc.NodePool()
            this.prefabArray = [];
            this.numLayout = cc.instantiate(this.numLayoutPrefab)
            this.eachHeight = this.numLayout.height / 11
            this.prefabPool.put(this.numLayout)
            this.allLayoutNode.removeAllChildren()
    
            for(var i = 0; i < this.prefabArray.length ; i++) {
                this.prefabArray[i].setPosition(0, 0)
                this.prefabPool.put(this.prefabArray[i])
            }
            this.prefabArray = []
    
            this.hp = targetHp
            var hpValue = this.hp + ""
            for(var i = 0; i < hpValue.length ; i++) {
                this.prefabArray.push(this.getNewPrefab());
            }
    
            for(var i = 0; i < hpValue.length ; i++) {
                this.roll( hpValue[i], this.prefabArray[i])
            }
        } else{
            console.log("targetHp in init else = ", targetHp)
        }
    }

    updateValue(targetHp){
        this.prefabPool = new cc.NodePool()
    	this.prefabArray = [];
   	    this.numLayout = cc.instantiate(this.numLayoutPrefab)
    	this.eachHeight = this.numLayout.height / 11
    	this.prefabPool.put(this.numLayout)
        this.allLayoutNode.removeAllChildren()

    	for(let i=0; i < this.prefabArray.length; i++) {
            this.prefabArray[i].setPosition(0, 0)
            this.prefabPool.put(this.prefabArray[i])
    	}
    	this.prefabArray = []

        this.hp = targetHp
        var hpValue = this.hp + ""
        for(var i = 0; i < hpValue.length ; i++) {
            this.prefabArray.push(this.getNewPrefab());
        }

        for(var i = 0; i < hpValue.length ; i++) {
            this.updateRoll( hpValue[i], this.prefabArray[i],2)
        }

        
    }

    roll (num, prefab) {
        var y = (Number(num)-5.5)*this.eachHeight
        var moveTo = cc.moveTo(0, cc.v2(0, y)).easing(cc.easeQuinticActionOut())
        prefab.runAction(moveTo)
    }

    updateRoll (num, prefab,time) {
        var y = (Number(num)-5.5)*this.eachHeight
        var moveTo = cc.moveTo(time, cc.v2(0, y)).easing(cc.easeQuinticActionOut()) //easeCubicActionOut
        prefab.runAction(moveTo)
    }

    getNewPrefab () {
        var numLayout = null
        if (this.prefabPool.size() > 0) 
            numLayout = this.prefabPool.get()
        else 
            numLayout = cc.instantiate(this.numLayoutPrefab)
        
        this.allLayoutNode.addChild(numLayout)
        return numLayout
    }

}
