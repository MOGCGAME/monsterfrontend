const {ccclass, property} = cc._decorator;

@ccclass
export default class PvPPage extends cc.Component {

    @property(cc.Node)
    selfMonster: cc.Node = null;
    @property(cc.Node)
    enemyMonster: cc.Node = null;
    @property(cc.Prefab)
    waterElementAttackEffect: cc.Prefab = null
    @property(cc.Prefab)
    fireElementAttackEffect: cc.Prefab = null
    @property(cc.Prefab)
    woodElementAttackEffect: cc.Prefab = null
    @property(cc.Prefab)
    earthElementAttackEffect: cc.Prefab = null
    @property(cc.Prefab)
    goldElementAttackEffect: cc.Prefab = null
    
    battleSystem: cc.Node
    selftargetseqPosition: any
    enemytargetseqPosition: any

    init (self, enemy, battleSystem) { //初始值
        this.selftargetseqPosition = []
        this.enemytargetseqPosition = []
        this.battleSystem = battleSystem
        for (var i = 0; i < self.length; i++) {
            this.selfMonster.children[i].getChildByName("cardValue").getChildByName("AK").getComponent(cc.Label).string = self[i].monster_attack
            this.selfMonster.children[i].getChildByName("cardValue").getChildByName("DF").getComponent(cc.Label).string = self[i].monster_defend
            this.selfMonster.children[i].getChildByName("cardValue").getChildByName("HP").getComponent(cc.Label).string = self[i].monster_hp
            this.selfMonster.children[i].getChildByName("cardValue").getChildByName("SP").getComponent(cc.Label).string = self[i].monster_speed
            this.selfMonster.children[i].getChildByName("returnHp").active = false
            this.selfMonster.children[i].getChildByName("atkValue").active = false
            // this.selfMonster.children[i].getChildByName("beenAtkSprite").active = false
            this.selfMonster.children[i].getChildByName("beenAtkAnimation").active = false
            // this.selfMonster.children[i].getChildByName("beenTrigger").active = false
            this.selfMonster.children[i].getComponent("PvESelf").init(self[i], battleSystem)
            this.selfMonster.children[i].getChildByName("beenDead").active = false
            cc.loader.loadRes(`monster/${self[i].monster_id}`, cc.SpriteFrame, function(err, spriteFrame) {
                this.getComponent(cc.Sprite).spriteFrame = spriteFrame
            }.bind(this.selfMonster.children[i].getChildByName("Monster").getComponent(cc.Sprite)))
            this.selftargetseqPosition.push(this.selfMonster.children[i].position)
        }

        for (var i = 0; i < enemy.length; i++) {
            this.enemyMonster.children[i].getChildByName("cardValue").getChildByName("AK").getComponent(cc.Label).string = enemy[i].monster_attack
            this.enemyMonster.children[i].getChildByName("cardValue").getChildByName("DF").getComponent(cc.Label).string = enemy[i].monster_defend
            this.enemyMonster.children[i].getChildByName("cardValue").getChildByName("HP").getComponent(cc.Label).string = enemy[i].monster_hp
            this.enemyMonster.children[i].getChildByName("cardValue").getChildByName("SP").getComponent(cc.Label).string = enemy[i].monster_speed
            this.enemyMonster.children[i].getChildByName("returnHp").active = false
            this.enemyMonster.children[i].getChildByName("atkValue").active = false
            // this.enemyMonster.children[i].getChildByName("beenAtkSprite").active = false
            //new
            this.enemyMonster.children[i].getComponent("PvEEnemy").init(enemy[i], battleSystem)
            // this.enemyMonster.children[i].getChildByName("beenTrigger").active = false
            this.enemyMonster.children[i].getChildByName("beenDead").active = false
            cc.loader.loadRes(`monster/${enemy[i].monster_id}`, cc.SpriteFrame, function(err, spriteFrame) {
                this.getComponent(cc.Sprite).spriteFrame = spriteFrame
            }.bind(this.enemyMonster.children[i].getChildByName("Monster").getComponent(cc.Sprite)))
            this.enemytargetseqPosition.push(this.enemyMonster.children[i].position)
        }
    }

    updateBuff(buff) { //初始被动
        if (buff.Self != null) {
            for (var i = 0; i < buff.Self.length; i++) {
                for (var j = 0; j < this.selfMonster.childrenCount; j++) {
                    this.selfMonster.children[j].getChildByName("passiveEffect").children[i].active = true
                    cc.loader.loadRes(`monster/passive/${buff.Self[i]}`, cc.SpriteFrame, function(err, spriteFrame) {
                        this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                    }.bind(this.selfMonster.children[j].getChildByName("passiveEffect").children[i].getComponent(cc.Sprite)))
                }
            }
        }
        if (buff.Enemy != null) {
            for (var i = 0; i < buff.Enemy.length; i++) {
                for (var j = 0; j < this.enemyMonster.childrenCount; j++) {
                    this.enemyMonster.children[j].getChildByName("passiveEffect").children[i].active = true
                    cc.loader.loadRes(`monster/passive/${buff.Enemy[i]}`, cc.SpriteFrame, function(err, spriteFrame) {
                        this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                    }.bind(this.enemyMonster.children[j].getChildByName("passiveEffect").children[i].getComponent(cc.Sprite)))
                }
            }
        }
    }

    async updateStatus(turnInfo) {
        console.log({turnInfo})
        let selfatkseq = this.selfMonster.children[turnInfo.atkMonsterSeq - 1] //左边攻击怪兽
        let enemyatkseq = this.enemyMonster.children[turnInfo.atkMonsterSeq - 1] //右边攻击怪兽
        let selftargetseq = this.selfMonster.children[turnInfo.targetMonsterSeq - 1] //左边目标怪兽
        let enemytargetseq = this.enemyMonster.children[turnInfo.targetMonsterSeq - 1] //右边目标怪兽
        let targetIndex = turnInfo.targetMonsterSeq - 1
        let animationTime = 0 //动画总时间
        let animationDelayTime = 0
        let tweenTime = 0
        let delayTime = 0
        let tweenMoveDistance = 370
        if (turnInfo.atkmultiple != null) {
            console.log("mul1:", turnInfo.atkmultiple)
            let allselftargetseq = this.selfMonster.children[turnInfo.atkmultiple[0].seq - 1]
            let allenemytargetseq = this.enemyMonster.children[turnInfo.atkmultiple[0].seq - 1]
            if (turnInfo.atkMonsterSkill == 9052) { //全体回复
                delayTime = 1.3
                //不攻击不需要移动，只需要回复被动生效
                for (var i = 0; i < turnInfo.atkmultiple.length; i++) {
                    let targethp = turnInfo.atkmultiple[i].hp
                    let heal = turnInfo.atkmultiple[i].heal
                    let targetseq = this.selfMonster.children[turnInfo.atkmultiple[i].seq - 1]
                    if (!turnInfo.atkMonsterSide){
                    //if (turnInfo.atkMonsterSide == 1) {
                        targetseq = this.enemyMonster.children[turnInfo.atkmultiple[i].seq - 1]
                    }
                    this.scheduleOnce(function() {
                        targetseq.getChildByName("returnHp").active = true;
                        targetseq.getChildByName("returnHp").getComponent(cc.Label).string = heal;
                        targetseq.getChildByName("cardValue").getChildByName("HP").getComponent(cc.Label).string = targethp
                    }, delayTime)
                    this.scheduleOnce(function() {
                        targetseq.getChildByName("returnHp").active = false;
                    }, delayTime + 0.5)
                }
                if (turnInfo.atkMonsterSide && turnInfo.targetMonsterSeq != 0){
                    //if (turnInfo.atkMonsterSide == 0 && turnInfo.targetMonsterSeq != 0) { //左边怪兽
                        if(turnInfo.atkMonsterStun){
                            delayTime = 1.3
                            selfatkseq.getChildByName("atkValue").active = true
                            selfatkseq.getChildByName("atkValue").getComponent(cc.Label).string = "stun"
                            this.scheduleOnce(function() { //隐藏攻击数值，被攻击特效等
                                selfatkseq.getChildByName("atkValue").active = false
                            }, delayTime);
                            animationTime += delayTime
                        }else{
                            tweenTime = 0.8
                            delayTime = 1.3
                            cc.tween(selfatkseq)
                                .to(tweenTime, {position: cc.v3( this.enemytargetseqPosition[targetIndex].x + tweenMoveDistance, this.enemytargetseqPosition[targetIndex].y, 0)}, {easing: 'quintOut'})
                                .start() //移动效果
                            animationTime += tweenTime
                            this.scheduleOnce(function() { //移动后显示攻击数值，被攻击特效，怪兽血量变化等
                                enemytargetseq.getChildByName("atkValue").active = true;
                                enemytargetseq.getChildByName("atkValue").getComponent(cc.Label).string = turnInfo.atkMonsterDamage
                                // enemytargetseq.getChildByName("beenAtkSprite").active =a true;
                                let enemytargetBeenAtkAnimationNode = enemytargetseq.getChildByName("beenAtkAnimation")
                                enemytargetBeenAtkAnimationNode.active = true;
                                this.playBattleEffectAnimation(enemytargetBeenAtkAnimationNode, turnInfo.atkMonsterElement)
                                
                                // cc.loader.loadRes(`monster/element/${turnInfo.atkMonsterElement}`, cc.SpriteFrame, function(err, spriteFrame) {
                                //     this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                                // }.bind(enemytargetseq.getChildByName("beenAtkSprite").getComponent(cc.Sprite)))
                                if (turnInfo.atkMonsterDamage == 0) {
                                    if (!turnInfo.atkMonsterMiss) { //atkMonsterMiss (true: hit, false: miss)
                                    //if (turnInfo.atkMonsterMiss == 1) {
                                        // miss
                                        enemytargetseq.getChildByName("atkValue").getComponent(cc.Label).string = "miss"
                                    } else {
                                        // block
                                        enemytargetseq.getChildByName("atkValue").getComponent(cc.Label).string = "blocked"
                                    }
                                }
                                if (turnInfo.atkMonsterHeal == 0) {

                                } else {
 
                                    selfatkseq.getChildByName("returnHp").getComponent(cc.Label).string = turnInfo.atkMonsterHeal;
                                    selfatkseq.getChildByName("cardValue").getChildByName("HP").getComponent(cc.Label).string = turnInfo.atkMonsterHp
                                    selfatkseq.getChildByName("cardValue").getChildByName("AK").getComponent(cc.Label).string = turnInfo.atkMonsterAttack
                                    selfatkseq.getChildByName("cardValue").getChildByName("DF").getComponent(cc.Label).string = turnInfo.atkMonsterDefense
                                    selfatkseq.getChildByName("cardValue").getChildByName("SP").getComponent(cc.Label).string = turnInfo.atkMonsterSpeed
                                }
                                if (turnInfo.targetMonsterHp <= 0) { //判断怪兽血量是否小过0
                                    enemytargetseq.getChildByName("beenDead").active = true;
                                    turnInfo.targetMonsterHp = 0
                                }
                                enemytargetseq.getChildByName("cardValue").getChildByName("HP").getComponent(cc.Label).string = turnInfo.targetMonsterHp
                                enemytargetseq.getChildByName("cardValue").getChildByName("AK").getComponent(cc.Label).string = turnInfo.targetMonsterAttack
                                enemytargetseq.getChildByName("cardValue").getChildByName("DF").getComponent(cc.Label).string = turnInfo.targetMonsterDefense
                                enemytargetseq.getChildByName("cardValue").getChildByName("SP").getComponent(cc.Label).string = turnInfo.targetMonsterSpeed
                            }, tweenTime)
                            cc.tween(selfatkseq)
                            .delay(delayTime)
                            .to(tweenTime, {position: cc.v3( selfatkseq.x, selfatkseq.y, 0)}, {easing: 'quintOut'})
                            .start() //回归原位
                            //animationTime += tweenTime + delayTime
                            animationTime += tweenTime
                            this.scheduleOnce(function() { //隐藏攻击数值，被攻击特效等
                                enemytargetseq.getChildByName("atkValue").active = false
                                // enemytargetseq.getChildByName("beenAtkSprite").active = false
                                enemytargetseq.getChildByName("beenAtkAnimation").active = false
                                enemytargetseq.getChildByName("beenAtkAnimation").children[0].destroy()
                            }, delayTime);
                        }     
                } else if ((!turnInfo.atkMonsterSide) && turnInfo.targetMonsterSeq != 0){
                //} else if (turnInfo.atkMonsterSide == 1 && turnInfo.targetMonsterSeq != 0){ //右边怪兽
                    if(turnInfo.atkMonsterStun){
                        delayTime = 1.3
                        enemyatkseq.getChildByName("atkValue").active = true
                        enemyatkseq.getChildByName("atkValue").getComponent(cc.Label).string = "stun"
                        this.scheduleOnce(function() { //隐藏攻击数值，被攻击特效等
                            enemyatkseq.getChildByName("atkValue").active = false
                        }, delayTime);
                        animationTime += delayTime
                    }else{
                        tweenTime = 1
                        delayTime = 1.3
                        cc.tween(enemyatkseq)
                        .to(tweenTime, {position: cc.v3( this.selftargetseqPosition[targetIndex].x - tweenMoveDistance, this.selftargetseqPosition[targetIndex].y, 0)}, {easing: 'quintOut'})
                        .start()
                        animationTime += tweenTime
                        this.scheduleOnce(function() {
                            selftargetseq.getChildByName("atkValue").active = true;
                            selftargetseq.getChildByName("atkValue").getComponent(cc.Label).string = turnInfo.atkMonsterDamage
                            // selftargetseq.getChildByName("beenAtkSprite").active = true;
                            let selftargetBeenAtkAnimationNode = selftargetseq.getChildByName("beenAtkAnimation")
                            selftargetBeenAtkAnimationNode.active = true;
                            this.playBattleEffectAnimation(selftargetBeenAtkAnimationNode, turnInfo.atkMonsterElement)
                            
                            // cc.loader.loadRes(`monster/element/${turnInfo.atkMonsterElement}`, cc.SpriteFrame, function(err, spriteFrame) {
                            //     this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                            // }.bind(selftargetseq.getChildByName("beenAtkSprite").getComponent(cc.Sprite)))
                            if (turnInfo.atkMonsterDamage == 0) {
                                if(!turnInfo.atkMonsterMiss){ //atkMonsterMiss (true: hit, false: miss)
                                //if (turnInfo.atkMonsterMiss == 1) {
                                    // miss
                                    selftargetseq.getChildByName("atkValue").getComponent(cc.Label).string = "miss"
                                } else {
                                    // block
                                    selftargetseq.getChildByName("atkValue").getComponent(cc.Label).string = "blocked"
                                }
                            }
                            if (turnInfo.atkMonsterHeal == 0) {
                                enemyatkseq.getChildByName("returnHp").active = false;
                            } else {
                                enemyatkseq.getChildByName("returnHp").active = true;
                                enemyatkseq.getChildByName("returnHp").getComponent(cc.Label).string = turnInfo.atkMonsterHeal;
                                enemyatkseq.getChildByName("cardValue").getChildByName("HP").getComponent(cc.Label).string = turnInfo.atkMonsterHp
                                enemyatkseq.getChildByName("cardValue").getChildByName("AK").getComponent(cc.Label).string = turnInfo.atkMonsterAttack
                                enemyatkseq.getChildByName("cardValue").getChildByName("DF").getComponent(cc.Label).string = turnInfo.atkMonsterDefense
                                enemyatkseq.getChildByName("cardValue").getChildByName("SP").getComponent(cc.Label).string = turnInfo.atkMonsterSpeed
                            }
                            if (turnInfo.targetMonsterHp <= 0) {
                                selftargetseq.getChildByName("beenDead").active = true;
                                turnInfo.targetMonsterHp = 0
                            }
                            selftargetseq.getChildByName("cardValue").getChildByName("HP").getComponent(cc.Label).string = turnInfo.targetMonsterHp
                            selftargetseq.getChildByName("cardValue").getChildByName("AK").getComponent(cc.Label).string = turnInfo.targetMonsterAttack
                            selftargetseq.getChildByName("cardValue").getChildByName("DF").getComponent(cc.Label).string = turnInfo.targetMonsterDefense
                            selftargetseq.getChildByName("cardValue").getChildByName("SP").getComponent(cc.Label).string = turnInfo.targetMonsterSpeed
                        }, 0.8)
                        cc.tween(enemyatkseq)
                        .delay(delayTime)
                        .to(tweenTime, {position: cc.v3( enemyatkseq.x, enemyatkseq.y, 0)}, {easing: 'quintOut'})
                        .start()
                        //animationTime += tweenTime + delayTime
                        animationTime += tweenTime
                        this.scheduleOnce(function() {
                            selftargetseq.getChildByName("atkValue").active = false
                            // selftargetseq.getChildByName("beenAtkSprite").active = false
                            selftargetseq.getChildByName("beenAtkAnimation").active = false
                            selftargetseq.getChildByName("beenAtkAnimation").children[0].destroy()
                            enemyatkseq.getChildByName("returnHp").active = false;
                        }, delayTime);
                    }
                }
                
            } else {
                if (turnInfo.atkMonsterSide){
                //if (turnInfo.atkMonsterSide == 0) {
                    tweenTime = 0.8
                    cc.tween(selfatkseq)
                        .to(tweenTime, {position: cc.v3( allenemytargetseq.x + tweenMoveDistance, allenemytargetseq.y, 0)}, {easing: 'quintOut'})
                        .start()
                    animationTime += tweenTime
                    this.scheduleOnce(function() {
                        if (turnInfo.atkMonsterHeal == 0) {
                            selfatkseq.getChildByName("returnHp").active = false
                        } else {
                            selfatkseq.getChildByName("returnHp").active = true
                        }
                    }, tweenTime)
                    for (var i = 0; i < turnInfo.atkmultiple.length; i++) {
                        let targethp = turnInfo.atkmultiple[i].hpdown
                        let atkdmg = turnInfo.atkmultiple[i].dmg
                        let targetseq = this.enemyMonster.children[turnInfo.atkmultiple[i].seq - 1]
                        this.scheduleOnce(function() {
                            targetseq.getChildByName("atkValue").active = true;
                            targetseq.getChildByName("atkValue").getComponent(cc.Label).string = atkdmg
                            // targetseq.getChildByName("beenAtkSprite").active = true;
                            // cc.loader.loadRes(`monster/element/${turnInfo.atkMonsterElement}`, cc.SpriteFrame, function(err, spriteFrame) {
                            //     this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                            // }.bind(targetseq.getChildByName("beenAtkSprite").getComponent(cc.Sprite)))
                            let targetBeenAtkAnimationNode = targetseq.getChildByName("beenAtkAnimation")
                            targetBeenAtkAnimationNode.active = true;
                            this.playBattleEffectAnimation(targetBeenAtkAnimationNode, turnInfo.atkMonsterElement)
                            if (targethp <= 0) { //判断怪兽血量是否小过0
                                targetseq.getChildByName("beenDead").active = true;
                                targethp = 0
                            }
                            targetseq.getChildByName("cardValue").getChildByName("HP").getComponent(cc.Label).string = targethp
                        }, tweenTime)
                    }
                    delayTime = 1.3
                    cc.tween(selfatkseq)
                    .delay(delayTime)
                    .to(tweenTime, {position: cc.v3( selfatkseq.x, selfatkseq.y, 0)}, {easing: 'quintOut'})
                    .start()
                    // animationTime += delayTime + tweenTime
                    animationTime += tweenTime
                    this.scheduleOnce(function() {
                        selfatkseq.getChildByName("returnHp").active = false
                        // selfatkseq.getChildByName("atkValue").active = false
                    }, delayTime)
                    for (var i = 0; i < turnInfo.atkmultiple.length; i++) {
                        let targetseq = this.enemyMonster.children[turnInfo.atkmultiple[i].seq - 1]
                        this.scheduleOnce(function() {
                            targetseq.getChildByName("atkValue").active = false;
                            // targetseq.getChildByName("beenAtkSprite").active = false
                            targetseq.getChildByName("beenAtkAnimation").active = false
                            targetseq.getChildByName("beenAtkAnimation").children[0].destroy()
                        }, delayTime)
                    }
                    } else if(!turnInfo.atkMonsterSide){
                //} else if (turnInfo.atkMonsterSide == 1) {
                    tweenTime = 1
                    delayTime = 1.3
                    cc.tween(enemyatkseq)
                    .to(tweenTime, {position: cc.v3( allselftargetseq.x - tweenMoveDistance, allselftargetseq.y, 0)}, {easing: 'quintOut'})
                    .start()
                    animationTime += tweenTime
                    this.scheduleOnce(function() {
                        if (turnInfo.atkMonsterHeal == 0) {
                            enemyatkseq.getChildByName("returnHp").active = false;
                        } else {
                            enemyatkseq.getChildByName("returnHp").active = true;
                        }
                    }, 0.8)
                    for (var i = 0; i < turnInfo.atkmultiple.length; i++) {
                        let targethp = turnInfo.atkmultiple[i].hpdown
                        let atkdmg = turnInfo.atkmultiple[i].dmg
                        let targetseq = this.selfMonster.children[turnInfo.atkmultiple[i].seq - 1]
                        this.scheduleOnce(function() {
                            targetseq.getChildByName("atkValue").active = true;
                            targetseq.getChildByName("atkValue").getComponent(cc.Label).string = atkdmg
                            // targetseq.getChildByName("beenAtkSprite").active = true;
                            // cc.loader.loadRes(`monster/element/${turnInfo.atkMonsterElement}`, cc.SpriteFrame, function(err, spriteFrame) {
                            //     this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                            // }.bind(targetseq.getChildByName("beenAtkSprite").getComponent(cc.Sprite)))
                            let targetBeenAtkAnimationNode = targetseq.getChildByName("beenAtkAnimation")
                            targetBeenAtkAnimationNode.active = true;
                            this.playBattleEffectAnimation(targetBeenAtkAnimationNode, turnInfo.atkMonsterElement)
                            if (targethp <= 0) {
                                targetseq.getChildByName("beenDead").active = true;
                                targethp = 0
                            }
                            targetseq.getChildByName("cardValue").getChildByName("HP").getComponent(cc.Label).string = targethp
                        }, 0.8)
                    }
                    cc.tween(enemyatkseq)
                    .delay(delayTime)
                    .to(tweenTime, {position: cc.v3( enemyatkseq.x, enemyatkseq.y, 0)}, {easing: 'quintOut'})
                    .start()
                    //animationTime += delayTime+tweenTime
                    animationTime += tweenTime
                    this.scheduleOnce(function() {
                        enemyatkseq.getChildByName("returnHp").active = false
                    }, delayTime);
                    for (var i = 0; i < turnInfo.atkmultiple.length; i++) {
                        let targetseq = this.selfMonster.children[turnInfo.atkmultiple[i].seq - 1]
                        this.scheduleOnce(function() {
                            targetseq.getChildByName("atkValue").active = false
                            // targetseq.getChildByName("beenAtkSprite").active = false
                            targetseq.getChildByName("beenAtkAnimation").active = false
                            targetseq.getChildByName("beenAtkAnimation").children[0].destroy()
                        }, delayTime)
                    }
                }
            }
        } else {
            if (turnInfo.atkMonsterSide && turnInfo.targetMonsterSeq != 0){
            //if (turnInfo.atkMonsterSide == 0 && turnInfo.targetMonsterSeq != 0) { //左边怪兽
                if(turnInfo.atkMonsterStun){
                    delayTime = 1.3
                    selfatkseq.getChildByName("atkValue").active = true
                    selfatkseq.getChildByName("atkValue").getComponent(cc.Label).string = "stun"
                    this.scheduleOnce(function() { //隐藏攻击数值，被攻击特效等
                        selfatkseq.getChildByName("atkValue").active = false
                    }, delayTime);
                    animationTime += delayTime
                }else{
                    tweenTime = 0.8
                    delayTime = 1.3
                    cc.tween(selfatkseq)
                        .to(tweenTime, {position: cc.v3( this.enemytargetseqPosition[targetIndex].x + tweenMoveDistance, this.enemytargetseqPosition[targetIndex].y, 0)}, {easing: 'quintOut'})
                        .start() //移动效果
                    animationTime += tweenTime
                    this.scheduleOnce(function() { //移动后显示攻击数值，被攻击特效，怪兽血量变化等
                        enemytargetseq.getChildByName("atkValue").active = true;
                        enemytargetseq.getChildByName("atkValue").getComponent(cc.Label).string = turnInfo.atkMonsterDamage
                        // enemytargetseq.getChildByName("beenAtkSprite").active = true;
                        // cc.loader.loadRes(`monster/element/${turnInfo.atkMonsterElement}`, cc.SpriteFrame, function(err, spriteFrame) {
                        //     this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                        // }.bind(enemytargetseq.getChildByName("beenAtkSprite").getComponent(cc.Sprite)))
                        let enemytargetBeenAtkAnimationNode = enemytargetseq.getChildByName("beenAtkAnimation")
                        enemytargetBeenAtkAnimationNode.active = true;
                        this.playBattleEffectAnimation(enemytargetBeenAtkAnimationNode, turnInfo.atkMonsterElement)
                        if (turnInfo.atkMonsterDamage == 0) {
                            if (!turnInfo.atkMonsterMiss) { //atkMonsterMiss (true: hit, false: miss)
                            //if (turnInfo.atkMonsterMiss == 1) {
                                // miss
                                enemytargetseq.getChildByName("atkValue").getComponent(cc.Label).string = "miss"
                            } else {
                                // block
                                enemytargetseq.getChildByName("atkValue").getComponent(cc.Label).string = "blocked"
                            }
                        }
                        if (turnInfo.atkMonsterHeal == 0) {
                            selfatkseq.getChildByName("returnHp").active = false
                        } else {
                            selfatkseq.getChildByName("returnHp").active = true
                            selfatkseq.getChildByName("returnHp").getComponent(cc.Label).string = turnInfo.atkMonsterHeal;
                            
                        }
                        if (turnInfo.targetMonsterHp <= 0) { //判断怪兽血量是否小过0
                            enemytargetseq.getChildByName("beenDead").active = true;
                            turnInfo.targetMonsterHp = 0
                        }
                        selfatkseq.getChildByName("cardValue").getChildByName("HP").getComponent(cc.Label).string = turnInfo.atkMonsterHp
                        selfatkseq.getChildByName("cardValue").getChildByName("AK").getComponent(cc.Label).string = turnInfo.atkMonsterAttack
                        selfatkseq.getChildByName("cardValue").getChildByName("DF").getComponent(cc.Label).string = turnInfo.atkMonsterDefense
                        selfatkseq.getChildByName("cardValue").getChildByName("SP").getComponent(cc.Label).string = turnInfo.atkMonsterSpeed
                        enemytargetseq.getChildByName("cardValue").getChildByName("HP").getComponent(cc.Label).string = turnInfo.targetMonsterHp
                        enemytargetseq.getChildByName("cardValue").getChildByName("AK").getComponent(cc.Label).string = turnInfo.targetMonsterAttack
                        enemytargetseq.getChildByName("cardValue").getChildByName("DF").getComponent(cc.Label).string = turnInfo.targetMonsterDefense
                        enemytargetseq.getChildByName("cardValue").getChildByName("SP").getComponent(cc.Label).string = turnInfo.targetMonsterSpeed
                    }, tweenTime)
                    cc.tween(selfatkseq)
                    .delay(delayTime)
                    .to(tweenTime, {position: cc.v3( selfatkseq.x, selfatkseq.y, 0)}, {easing: 'quintOut'})
                    .start() //回归原位
                    //animationTime += tweenTime + delayTime
                    animationTime += tweenTime
                    this.scheduleOnce(function() { //隐藏攻击数值，被攻击特效等
                        enemytargetseq.getChildByName("atkValue").active = false
                        // enemytargetseq.getChildByName("beenAtkSprite").active = false
                        enemytargetseq.getChildByName("beenAtkAnimation").active = false
                        enemytargetseq.getChildByName("beenAtkAnimation").children[0].destroy()
                        selfatkseq.getChildByName("returnHp").active = false
                    }, delayTime);
                }     
            } else if ((!turnInfo.atkMonsterSide) && turnInfo.targetMonsterSeq != 0){
            //} else if (turnInfo.atkMonsterSide == 1 && turnInfo.targetMonsterSeq != 0){ //右边怪兽
                if(turnInfo.atkMonsterStun){
                    delayTime = 1.3
                    enemyatkseq.getChildByName("atkValue").active = true
                    enemyatkseq.getChildByName("atkValue").getComponent(cc.Label).string = "stun"
                    this.scheduleOnce(function() { //隐藏攻击数值，被攻击特效等
                        enemyatkseq.getChildByName("atkValue").active = false
                    }, delayTime);
                    animationTime += delayTime
                }else{
                    tweenTime = 1
                    delayTime = 1.3
                    cc.tween(enemyatkseq)
                    .to(tweenTime, {position: cc.v3( this.selftargetseqPosition[targetIndex].x - tweenMoveDistance, this.selftargetseqPosition[targetIndex].y, 0)}, {easing: 'quintOut'})
                    .start()
                    animationTime += tweenTime
                    this.scheduleOnce(function() {
                        selftargetseq.getChildByName("atkValue").active = true;
                        selftargetseq.getChildByName("atkValue").getComponent(cc.Label).string = turnInfo.atkMonsterDamage
                        // selftargetseq.getChildByName("beenAtkSprite").active = true;
                        // cc.loader.loadRes(`monster/element/${turnInfo.atkMonsterElement}`, cc.SpriteFrame, function(err, spriteFrame) {
                        //     this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                        // }.bind(selftargetseq.getChildByName("beenAtkSprite").getComponent(cc.Sprite)))
                        let selftargetBeenAtkAnimationNode = selftargetseq.getChildByName("beenAtkAnimation")
                            selftargetBeenAtkAnimationNode.active = true;
                            this.playBattleEffectAnimation(selftargetBeenAtkAnimationNode, turnInfo.atkMonsterElement)
                        if (turnInfo.atkMonsterDamage == 0) {
                            if(!turnInfo.atkMonsterMiss){ //atkMonsterMiss (true: hit, false: miss)
                            //if (turnInfo.atkMonsterMiss == 1) {
                                // miss
                                selftargetseq.getChildByName("atkValue").getComponent(cc.Label).string = "miss"
                            } else {
                                // block
                                selftargetseq.getChildByName("atkValue").getComponent(cc.Label).string = "blocked"
                            }
                        }
                        if (turnInfo.atkMonsterHeal == 0) {
                            enemyatkseq.getChildByName("returnHp").active = false;
                        } else {
                            enemyatkseq.getChildByName("returnHp").active = true;
                            enemyatkseq.getChildByName("returnHp").getComponent(cc.Label).string = turnInfo.atkMonsterHeal;
                            
                        }
                        if (turnInfo.targetMonsterHp <= 0) {
                            selftargetseq.getChildByName("beenDead").active = true;
                            turnInfo.targetMonsterHp = 0
                        }
                        enemyatkseq.getChildByName("cardValue").getChildByName("HP").getComponent(cc.Label).string = turnInfo.atkMonsterHp
                        enemyatkseq.getChildByName("cardValue").getChildByName("AK").getComponent(cc.Label).string = turnInfo.atkMonsterAttack
                        enemyatkseq.getChildByName("cardValue").getChildByName("DF").getComponent(cc.Label).string = turnInfo.atkMonsterDefense
                        enemyatkseq.getChildByName("cardValue").getChildByName("SP").getComponent(cc.Label).string = turnInfo.atkMonsterSpeed
                        selftargetseq.getChildByName("cardValue").getChildByName("HP").getComponent(cc.Label).string = turnInfo.targetMonsterHp
                        selftargetseq.getChildByName("cardValue").getChildByName("AK").getComponent(cc.Label).string = turnInfo.targetMonsterAttack
                        selftargetseq.getChildByName("cardValue").getChildByName("DF").getComponent(cc.Label).string = turnInfo.targetMonsterDefense
                        selftargetseq.getChildByName("cardValue").getChildByName("SP").getComponent(cc.Label).string = turnInfo.targetMonsterSpeed
                    }, 0.8)
                    cc.tween(enemyatkseq)
                    .delay(delayTime)
                    .to(tweenTime, {position: cc.v3( enemyatkseq.x, enemyatkseq.y, 0)}, {easing: 'quintOut'})
                    .start()
                    //animationTime += tweenTime + delayTime
                    animationTime += tweenTime
                    this.scheduleOnce(function() {
                        selftargetseq.getChildByName("atkValue").active = false
                        // selftargetseq.getChildByName("beenAtkSprite").active = false
                        selftargetseq.getChildByName("beenAtkAnimation").active = false
                        selftargetseq.getChildByName("beenAtkAnimation").children[0].destroy()
                        enemyatkseq.getChildByName("returnHp").active = false;
                    }, delayTime);
                }
            }
        }
        await new Promise(resolve => setTimeout(resolve, (animationTime + animationDelayTime)*1000 ))

    }
    showAvailableEnemies(match,turn){
        for(let a = 0; a < this.enemyMonster.childrenCount; a++){
            for(let b = 0; b< match.length; b++){
                if(match[b].monster_uid == this.enemyMonster.children[a].getComponent("PvEEnemy").enemy.monster_uid){
                    if(match[b].monster_hp > 0){
                        this.enemyMonster.children[a].getComponent("PvEEnemy").showTarget(match, turn)
                    }
                    break
                }
            }
            
        }
        for(let b = 0; b < this.selfMonster.childrenCount; b++){
            if(this.selfMonster.children[b].getComponent("PvESelf").self.monster_uid == turn.monster_uid){
                this.selfMonster.children[b].getComponent("PvESelf").showSelfAttack(match, turn)
            }
        }
    }
    deshowAvailableEnemies(){
        for(let a = 0; a < this.enemyMonster.childrenCount; a++){
            this.enemyMonster.children[a].getComponent("PvEEnemy").deshowTarget()
        }
        for(let b = 0; b < this.selfMonster.childrenCount; b++){
            this.selfMonster.children[b].getComponent("PvESelf").deshowSelfAttack()
        }
    }
    // onLoad () {}

    start () {

    }

    getBattleEffectWithElement(element){
        var battleEffectPrefab;
        switch(element){
            case 1:
                battleEffectPrefab = this.goldElementAttackEffect
                break
            case 2:
                battleEffectPrefab = this.woodElementAttackEffect
                break
            case 3:
                battleEffectPrefab = this.waterElementAttackEffect
                break
            case 4:
                battleEffectPrefab = this.fireElementAttackEffect
                break
            case 5:
                battleEffectPrefab = this.earthElementAttackEffect
                break
        }
        return battleEffectPrefab
    }

    playBattleEffectAnimation(animationNode, element){
        let battleEffectPrefab : cc.Prefab = this.getBattleEffectWithElement(element)
        var battleEffectNode = cc.instantiate(battleEffectPrefab)
        animationNode.addChild(battleEffectNode)
        if(battleEffectNode.getComponent(cc.ParticleSystem) != null){
            battleEffectNode.getComponent(cc.ParticleSystem).resetSystem()
        }else{
            var clip = battleEffectNode.children[0].getComponent(cc.Animation).getClips()
            battleEffectNode.children[0].getComponent(cc.Animation).play(clip[0].name)
        }
    }
    // update (dt) {}
}
