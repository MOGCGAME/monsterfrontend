import G from "../../Module/Global";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PVPBattle extends cc.Component {
    
    @property(cc.Prefab)
    result: cc.Prefab

    @property(cc.Prefab)
    rolling: cc.Prefab

    @property(cc.Prefab)
    cardLeft: cc.Prefab

    @property(cc.Prefab)
    cardRight: cc.Prefab

    @property(cc.ScrollView)
    speedBar: cc.ScrollView = null

    @property(cc.Float)
    animDiffPos: Number = 200
    
    selfMonster
    enemyMonster
    numOfPlayers
    nop
    rank

    onLoad () {
        var params = JSON.parse(cc.sys.localStorage.getItem("match") || "")
        console.log("param:", params)

        var paramsArr = []
        paramsArr[0] = params.self
        paramsArr[1] = params.enemy
        this.selfMonster = params.self
        this.enemyMonster = params.enemy

        this.numOfPlayers = params.self.length
        this.nop =  this.numOfPlayers + ""
        this.rank = params.rank

        //预测输赢，直接更新排行
        cc.sys.localStorage.setItem("duplicate", JSON.stringify(false));
        var r = cc.instantiate(this.result)
        var result = r.getComponent("PvPResult");
        result.directRank(this.rank)

        //载入游戏数据
        this.initValue(paramsArr,params.buff)

        //开始攻击特效
        this.scheduleOnce(function() {
            this.tryAtk(params.match)
        }, 1)
    }

    addCards(dir,turn,index,numOfPlayers){
        var cardDirection, x
        if(dir == "left"){
            cardDirection = this.cardLeft
            x = -1
        } else if(dir == "right"){
            cardDirection = this.cardRight
            x = 1
        }

        var cardDir = cc.instantiate(cardDirection)
        cardDir.name = index + ""
        cardDir.children[0].getChildByName("dead").active = false
        turn.addChild(cardDir)
        if(numOfPlayers == 3){
            if(index == 1){
                cardDir.setPosition(0, 25)
                cardDir.children[0].setPosition(200 * x,0)
            } else if(index == 2){
                cardDir.setPosition(0, 25)
                cardDir.children[0].setPosition(450 * x,100)
            } else if(index == 3){
                cardDir.setPosition(0, 25)
                cardDir.children[0].setPosition(450 * x,-100)
            } else{
                console.log(dir + "position error")
            }
        } else if(numOfPlayers == 5){
            if(index == 1){
                cardDir.setPosition(0, 75)
                cardDir.children[0].setPosition(200 * x,100)
            } else if(index == 2){
                cardDir.setPosition(0, 75)
                cardDir.children[0].setPosition(200 * x,-100)
            } else if(index == 3){
                cardDir.setPosition(0, 75)
                cardDir.children[0].setPosition(450 * x,200)
            } else if(index == 4){
                cardDir.setPosition(0, 75)
                cardDir.children[0].setPosition(450 * x,0)
            } else if(index == 5){
                cardDir.setPosition(0, 75)
                cardDir.children[0].setPosition(450 * x,-200)
            } else{
                console.log(dir + "position error")
            }
        }else{
            console.log(dir + "numOfPlayers error")
        }
    }

    // add3Card(dir, turn,index){
    //     var cardDirection, x
    //     if(dir == "left"){
    //         cardDirection = this.cardLeft
    //         x = -1
    //     } else if(dir == "right"){
    //         cardDirection = this.cardRight
    //         x = 1
    //     }

    //     var cardDir = cc.instantiate(cardDirection)
    //     cardDir.name = index + ""
    //     turn.addChild(cardDir)
        
    // }

    // add5Card(dir, turn,index){
    //     var cardDirection, x
    //     if(dir == "left"){
    //         cardDirection = this.cardLeft
    //         x = -1
    //     } else if(dir == "right"){
    //         cardDirection = this.cardRight
    //         x = 1
    //     }

    //     var cardDir = cc.instantiate(cardDirection)
    //     cardDir.name = index + ""
    //     turn.addChild(cardDir)
    //     if(index == 1){
    //         cardDir.setPosition(200 * x,100)
    //     } else if(index == 2){
    //         cardDir.setPosition(200 * x,-100)
    //     } else if(index == 3){
    //         cardDir.setPosition(450 * x,200)
    //     } else if(index == 4){
    //         cardDir.setPosition(450 * x,0)
    //     } else if(index == 5){
    //         cardDir.setPosition(450 * x,-200)
    //     } else{
    //         console.log(dir + "position error")
    //     }
    // }

    initValue(params,buff){
        var params = JSON.parse(cc.sys.localStorage.getItem("match") || "")
        var card = this.node.getChildByName("animEffect").getChildByName("card")
        var cardposition = [], p = [], b = [], t = ""
        var hpNodeArr = []
        p[0] = params.self
        p[1] = params.enemy
        b[0] = buff.Self
        b[1] = buff.Enemy

        for(var dir = 1 ; dir < 3 ; dir ++){
            if(dir == 1)
                t = "left"
            else
                t = "right"

            var turn = card.getChildByName(t)
            for(var i = 1 ; i < this.numOfPlayers + 1 ; i ++){
                if( turn.childrenCount < this.numOfPlayers){
                    this.addCards(t,turn,i,this.numOfPlayers)
                   
                }

                var child_i = i + ""
                cardposition[i-1] = turn.getChildByName(child_i).children[0]

                var atkValue = cardposition[i-1].getChildByName("atkValue").getComponent(cc.Label)
                atkValue.string = ""
                var returnHP = cardposition[i-1].getChildByName("returnHP").getComponent(cc.Label)
                returnHP.string = ""

                cardposition[i-1].getChildByName("cardValue").getChildByName("AK").getComponent(cc.Label).string = p[dir-1][i-1].monster_attack
                cardposition[i-1].getChildByName("cardValue").getChildByName("DF").getComponent(cc.Label).string = p[dir-1][i-1].monster_defend
                cardposition[i-1].getChildByName("cardValue").getChildByName("HP").getComponent(cc.Label).string = ""
                cardposition[i-1].getChildByName("cardValue").getChildByName("SP").getComponent(cc.Label).string = p[dir-1][i-1].monster_speed

                // HP value rolling - HP滚轮
                var rolling = cc.instantiate(this.rolling)
                hpNodeArr[i-1] = cardposition[i-1].getChildByName("cardValue").getChildByName("HP")
                hpNodeArr[i-1].addChild(rolling)
                var rollingNode = rolling.getComponent("Rolling")
                var hpvalue = p[dir-1][i-1].monster_hp + ""
                rollingNode.init(hpvalue)
                
                // rarity - 框
                // cc.loader.loadRes(`${p[dir-1][i-1].monster_rarity}_rarity`, cc.SpriteFrame, function(err, spriteframe){
                //     this.spriteFrame = spriteframe
                // }.bind(cardposition[i-1].getComponent(cc.Sprite)))
                cc.loader.loadRes(`monster/frame/${p[dir-1][i-1].monster_rarity}_rarity`, cc.SpriteFrame, function(err, spriteframe){
                    this.spriteFrame = spriteframe
                }.bind(cardposition[i-1].getComponent(cc.Sprite)))

                // ai/monster - 怪兽图
                var monsterImg = cardposition[i-1].getChildByName("monster").getComponent(cc.Sprite)
                // cc.loader.loadRes(`ai/monster/${p[dir-1][i-1].monster_uid}`, cc.SpriteFrame, function(err, spriteframe){
                //     this.spriteFrame = spriteframe
                // }.bind(monsterImg))
                cc.loader.loadRes(`monster/${p[dir-1][i-1].monster_id}`, cc.SpriteFrame, function(err, spriteframe){
                    this.spriteFrame = spriteframe
                }.bind(monsterImg))
                
                // 开局 buff
                for(var j = 1 ; j < 10 ; j ++){
                    var index = 100 + j
                    var child_j = "p" + index
                    if( b[dir-1] != null ){
                        var lenBuff = b[dir-1].length
                        for(var k = 1 ; k < lenBuff + 1 ; k++){
                            var child_k = "p" + b[dir-1][k-1]
                            if(child_j == child_k){  
                                var passiveEffect = cardposition[i-1].getChildByName("passiveEffect").getChildByName(child_k).getComponent(cc.Sprite)
                                // modify script here
                                cc.loader.loadRes("add", cc.SpriteFrame, function(err, spriteframe){
                                    this.spriteFrame = spriteframe
                                }.bind(passiveEffect))
                            }
                        }
                    } 
                }
            }
        }
    }
    
    tryAtk(match){
        var turn = []
        console.log("match = ", match)
        for (var i = 0 ; i < match.length; i++) {
            for (var j = 0 ; j < match[i].TurnInfo.length; j++) {
                var damage = match[i].TurnInfo[j].atkMonsterDamage
                var heal = match[i].TurnInfo[j].atkMonsterHeal
                var seq = match[i].TurnInfo[j].targetMonsterSeq
                if( (damage > 0 && seq > 0) || (heal > 0) ){
                    turn.push(match[i].TurnInfo[j])
                    var frameCopy = cc.instantiate(this.speedBar.node.getChildByName("view").getChildByName("content").children[0])
                    cc.loader.loadRes(`monster/${match[i].TurnInfo[j].atkMonsterUid}`, cc.SpriteFrame, function(err, spriteframe){
                        this.spriteFrame = spriteframe
                    }.bind(frameCopy.getChildByName("image").getComponent(cc.Sprite)))
                    frameCopy.active = true
                    this.speedBar.node.getChildByName("view").getChildByName("content").addChild(frameCopy)
                }
            }
        }
        this.updateMonsterStatus(turn)
    }

    updateMonsterStatus(turnArr){
        console.log("turnArr = ", turnArr)
        var dir = ""
        for(var i = 0 ; i < turnArr.length; i++){
            if(turnArr[i].atkMonsterSide)
                dir = "left"
            else
                dir = "right"

            var damage  = turnArr[i].atkMonsterDamage
            var element  = turnArr[i].atkMonsterElement
            var heal  = turnArr[i].atkMonsterHeal
            var attackHp = turnArr[i].atkMonsterHp
            var position = turnArr[i].atkMonsterSeq
            var skill = turnArr[i].atkMonsterSkill
            var targetHp = turnArr[i].targetMonsterHp
            var target   = turnArr[i].targetMonsterSeq
            var atkmultiple = turnArr[i].atkmultiple
            if(atkmultiple != null)
                console.log("atkmultiple test in " + i + " = ", atkmultiple)
            
            // ========================   测试区   ==============================
            // if(i == 1){
            //     console.log("i == ", i)
            //     var atkmultiple2
            //     atkmultiple2 = []
            //     var skillArr = ["10","11","12","13","14"]    // heal or dmg
            //     var hpArr = ["10","11","12","13","14"]
            //     var seqArr = ["1","2","3","4","5"]
            //     skill = "9052"   // 9022
            //     for(var j = 0 ; j < 5 ; j++){
            //         atkmultiple2.push({
            //             "skill": skillArr[j],
            //             "hp": hpArr[j],
            //             "seq": seqArr[j],
            //         })
            //     }
            //     heal = "20"
            //     this.prepare(i,dir,position,target,damage,element,heal,targetHp,attackHp,atkmultiple2,skill,turnArr.length)
            // } else
            // ========================   测试区   ==============================


            this.prepare(i,dir,position,target,damage,element,heal,targetHp,attackHp,atkmultiple,skill,turnArr.length)
        }
    }

    prepare(i,dir,position,target,damage,element,heal,targetHp,attackHp,atkmultiple,skill,last){
        this.scheduleOnce(function(){
            this.attack(dir,position,target,damage,element,heal,targetHp,attackHp,atkmultiple,skill,i+1,last)
            if(this.speedBar.node.getChildByName("view").getChildByName("content").childrenCount > 0){
                this.speedBar.node.getChildByName("view").getChildByName("content").removeChild(this.speedBar.node.getChildByName("view").getChildByName("content").children[0])
            }
        },2 * i)
    }
    
    attack(dir,position,target,damage,element,heal,targetHp,attackHp,atkmultiple,skill,numTurn,lastTurn){
        var card = this.node.getChildByName("animEffect").getChildByName("card")
        var animEnd = "", opp_animEnd = "_r", opp_dir = ""
        if(dir == "left"){
            opp_dir = "right"
        } else{
            animEnd = "_r"
            opp_animEnd = ""
            opp_dir = "left"
        }
        var turn = card.getChildByName(dir)
        var opp = card.getChildByName(opp_dir)
        var p = position + ""
        var t = target + ""
        var cardposition = turn.getChildByName(p).children[0]
        var opp_cardposition = opp.getChildByName(t).children[0]

        if (atkmultiple != null) {
            console.log("=========================")
            console.log("atkmultiple:", atkmultiple)
            console.log("numTurn:", numTurn)
            console.log("skill:", skill)
            console.log("=========================")

            var allSkillArr = [], allTargetHp = [], allTargetSeq = []
            var skillLabelArr = []
            var atkSpriteAnim = []
            for(var i = 1 ; i < atkmultiple.length + 1 ; i++){
                allSkillArr[i-1] = atkmultiple[i-1].skill  
                allTargetHp[i-1] = atkmultiple[i-1].hp
                allTargetSeq[i-1] = atkmultiple[i-1].seq
                if (allTargetSeq[i-1] == i && allSkillArr[i-1] > 0){
                    var loopA = i + ""
                    if (skill == "9052") {  //全体回复
                        damage = 0
                        cardposition = turn.getChildByName(loopA).children[0]
                        var returnHP = cardposition.getChildByName("returnHP")
                        skillLabelArr[i-1] = returnHP.getComponent(cc.Label)
                        skillLabelArr[i-1].string =  "+" + allTargetHp[i-1] + ""

                        //全体回血的数值动画
                        var returnHPAnim = returnHP.getComponent(cc.Animation)
                        var returnHPlbl = this.nop + "returnHP" + i + animEnd
                        returnHPAnim.play(returnHPlbl)
                    }
                    
                    else if (skill == "9022") {  //全体攻击
                        opp_cardposition = opp.getChildByName(loopA).children[0]
                        var opp_atkValue = opp_cardposition.getChildByName("atkValue")
                        skillLabelArr[i-1] = opp_atkValue.getComponent(cc.Label)
                        skillLabelArr[i-1].string =  "-" + allSkillArr[i-1] + ""

                        //攻击伤害的数值动画
                        var opp_atkValueAnim = opp_atkValue.getComponent(cc.Animation)
                        var opp_atkValuelbl = this.nop + "atkValue" + i + opp_animEnd
                        opp_atkValueAnim.play(opp_atkValuelbl)              

                        //攻击五行的显示动画
                        var opp_beenAtk = opp_cardposition.getChildByName("beenAtkSprite")
                        atkSpriteAnim[i-1] = opp_beenAtk.getComponent(cc.Sprite)
                        var atkEffect = "atkEffect_" + element + animEnd
                        cc.loader.loadRes(atkEffect, cc.SpriteFrame, function(err, spriteframe){
                            this.spriteFrame = spriteframe
                        }.bind(atkSpriteAnim[i-1].getComponent(cc.Sprite)))
                        var opp_cardpositionAnim = opp_beenAtk.getComponent(cc.Animation)
                        var opp_animSprite = this.nop + "beenAtk" + i + opp_animEnd
                        opp_cardpositionAnim.play(opp_animSprite)    
                        
                        //死亡
                        this.scheduleOnce(function(){
                            if(targetHp == 0){
                                opp_cardposition.opacity = 100
                                opp_cardposition.getChildByName("dead").active = true
                            }
                        },2.5)

                        if( lastTurn == numTurn ){
                            this.scheduleOnce(function(){
                                this.skipBattle()
                            },3.5)
                        } 
                    }
                }
            }
            
            // HP 滚轮
            this.scheduleOnce(function(){
                for(var i = 1 ; i < atkmultiple.length + 1 ; i++){
                    var loopA = i + ""
                    var hpValueArr = turn.getChildByName(loopA).children[0].getChildByName("cardValue").getChildByName("HP").getChildByName("rolling").getComponent("Rolling")
                    hpValueArr.updateValue(allTargetHp[i-1])
                }
            },0.75) 
        }else{
            var cardAnim = cardposition.getComponent(cc.Animation)
            var anim = this.nop + "atk" + position + "_" + target + animEnd
            cardAnim.play(anim)

            // 单体攻击，吸血
            var opp_atkValue = opp_cardposition.getChildByName("atkValue")
            var opp_atkValueLabel = opp_atkValue.getComponent(cc.Label)
            var d = damage + ""
            opp_atkValueLabel.string = "-" + d

            // 攻击伤害的数值动画
            var opp_atkValueAnim = opp_atkValue.getComponent(cc.Animation)
            var opp_atkValuelbl = this.nop  + "atkValue" + t + opp_animEnd
            opp_atkValueAnim.play(opp_atkValuelbl)              

            // 攻击五行的显示动画
            var opp_beenAtk = opp_cardposition.getChildByName("beenAtkSprite")
            var beenAtkSprite = opp_beenAtk.getComponent(cc.Sprite)
            var atkEffect = "atkEffect_" + element + animEnd
            cc.loader.loadRes(atkEffect, cc.SpriteFrame, (err, spriteframe) => {
                beenAtkSprite.spriteFrame = spriteframe;
            })
            var opp_cardpositionAnim = opp_beenAtk.getComponent(cc.Animation)
            var animSprite = this.nop + "beenAtk" + t + opp_animEnd
            opp_cardpositionAnim.play(animSprite)              
                
            if(heal != 0 || heal != "0"){
                // 有吸血
                var returnHP = cardposition.getChildByName("returnHP")
                var returnHPLabel = returnHP.getComponent(cc.Label)
                var h = heal + ""
                returnHPLabel.string = "+" + h //+ animEnd
                var returnHPAnim = returnHP.getComponent(cc.Animation)
                var returnHPlbl = this.nop + "returnHP" + p + animEnd
                returnHPAnim.play(returnHPlbl)  
            }                    

            // HP 滚轮
            this.scheduleOnce(function(){
                var opp_hpValue = opp_cardposition.getChildByName("cardValue").getChildByName("HP").getChildByName("rolling").getComponent("Rolling")
                opp_hpValue.updateValue(targetHp)

                if(heal != 0 || heal != "0"){
                    // 有吸血
                    var hpValue = cardposition.getChildByName("cardValue").getChildByName("HP").getChildByName("rolling").getComponent("Rolling")
                    var Hp = parseInt(attackHp)
                    var Heal = parseInt(heal.toString())
                    Hp += Heal
                    hpValue.updateValue(Hp)
                }
            },0.75)

            this.scheduleOnce(function(){
                if(targetHp == 0){
                    opp_cardposition.opacity = 100
                    opp_cardposition.getChildByName("dead").active = true
                }
            },2.5)

            if( lastTurn == numTurn ){
                this.scheduleOnce(function(){
                    this.skipBattle()
                },3.5)
            } 
        }
    }

    skipBattle(){
        console.log("Battle End.!")
        cc.sys.localStorage.setItem("rank", JSON.stringify(this.rank));
        cc.sys.localStorage.removeItem("duplicate")
        cc.sys.localStorage.setItem("duplicate", JSON.stringify(true));
        G.createGameObjectwithBackgroundThatBlocksInput(this.node, this.result)  
    }

}
