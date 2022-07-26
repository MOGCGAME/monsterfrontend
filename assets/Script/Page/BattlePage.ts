import httpMng from "../Module/HttpMng";
import usrMng from "../Module/UserMng";
import GameMgr from "../Manager/GameMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BattlePage extends cc.Component {

    @property(cc.Prefab)
    pvp3: cc.Prefab = null;
    @property(cc.Prefab)
    pvp5: cc.Prefab = null;
    @property(cc.Label)
    roundNum: cc.Label = null;
    @property(cc.Node)
    speed: cc.Node = null;
    @property(cc.Prefab)
    attackpage: cc.Prefab = null;
    @property(cc.Prefab)
    resultpage: cc.Prefab = null;
    @property(cc.Prefab)
    awardpage: cc.Prefab = null;
    @property(cc.Label)
    countdown: cc.Label = null;
    @property(cc.Node)
    battleSystem: cc.Node = null;

    pvpLength: any;
    pvp: cc.Node;

    mode: any;
    self: any;
    count: any;
    winner: any;
    auto: any;
    award: number;
    exp: number;
    rank: number;
    init: any;
    checkpoint: number;
    stage: number;
    finish: any;
    match = new Array();
    waitForPlayerBattleResolve: any

    async onLoad () {
        let params = JSON.parse(cc.sys.localStorage.getItem("match"));
        cc.sys.localStorage.removeItem("match");
        console.log("param:", params)
        this.self = usrMng.uid
        this.checkpoint = params.checkpoint
        this.stage = params.stage
        this.award = params.award
        this.exp = params.exp
        this.count = params.self.length //3 or 5
        this.countdown.node.parent.active = false;
        this.initMonster(params.self, params.enemy);
        this.scheduleOnce(function() {
            this.battleBuff(params.buff);
        }, 3)
        if (params.mode == "pvp") {
            this.mode = "pvp"
            this.rank = params.rank
            this.winner = params.winner
            this.scheduleOnce(function() {
                this.battleStart(params.match, params.matchInfo, params.speed);
            }, 3)
        } else {
            this.mode = "pve"
            this.init = params.initInfo
            let prior = (params.prior == 1)
            await this.pveBattle(params.matchInfo, params.prior);
        }
    }

    //初始化怪兽
    initMonster(self, enemy) {
        this.pvpLength = self.length;
        if (this.pvpLength== 5) {
            this.pvp = cc.instantiate(this.pvp5)
            var pvp5Info = this.pvp.getComponent("PvPPage")
            pvp5Info.init(self, enemy, this.battleSystem)
            this.node.addChild(this.pvp)
        } else {
            this.pvp = cc.instantiate(this.pvp3)
            var pvp3Info = this.pvp.getComponent("PvPPage")
            pvp3Info.init(self, enemy, this.battleSystem)
            this.node.addChild(this.pvp)
        }
    }

    battleBuff(buff) {
        this.pvp.getComponent("PvPPage").updateBuff(buff);
    }

    battleStart(match, matchInfo, speed) {
        let x = 0
        let time = match[match.length - 1].Count * 1.82
        let endtime = match[match.length - 1].Count * 2
        // let turntime = 0
        for (var i = 0; i < speed.length; i++) {
            let frameCopy = cc.instantiate(this.speed.children[0]);
            frameCopy.active = true;
            this.speed.addChild(frameCopy);
            let item = frameCopy.getChildByName("item");
            cc.loader.loadRes(`side/${speed[i].side}`, cc.SpriteFrame, function(err, spriteFrame) {
                this.getComponent(cc.Sprite).spriteFrame = spriteFrame
            }.bind(item.getChildByName("frame").getComponent(cc.Sprite)))
            cc.loader.loadRes(`monster/${speed[i].speed}`, cc.SpriteFrame, function(err, spriteFrame) {
                this.getComponent(cc.Sprite).spriteFrame = spriteFrame
            }.bind(item.getChildByName("image").getComponent(cc.Sprite)))
            // item.active = true;
        }
        for (var i = 0; i < match.length; i++) { 
            // let matching = match[i]
            for (var j = 0; j < match[i].TurnInfo.length; j++) {
                let y = "Round" + i
                x = x + 1
                let turn = match[i].TurnInfo[j]
                // if (i != 0) {
                //     turntime = matching.Count * 1.8
                // }
                this.scheduleOnce(async function() {
                    await this.updateMonsterStatus(turn)
                    this.roundNum.string = y
                    console.log(x * -20)
                    console.log(x * 1.8)
                    cc.tween(this.speed)
                    .to(x * 1.8, { position: cc.v2(x * -20, 0)}, {easing: 'quintOut'})
                    .start()
                }, x * 1.8)
            }

            // this.scheduleOnce(function() {
            //     for (var k = 0; k < this.speed.content.childrenCount; k++) {
            //         this.speed.content.children[k].active = false;
            //     }
            //     for (var l = 0; l < matching.TurnInfo.length; l++) {
            //         let spx = this.speed.content.children[l]
            //         this.speed.content.children[l].active = true;
            //         cc.loader.loadRes(`monster/${matching.TurnInfo[l].atkMonsterUid}`, cc.SpriteFrame, function(err, spriteFrame) {
            //             this.getComponent(cc.Sprite).spriteFrame = spriteFrame
            //         }.bind(spx.getChildByName("image").getComponent(cc.Sprite)))
            //     }
            // }, turntime)
        }
        this.scheduleOnce(function(){
            var winlose;
            var selfmonster = [];      
            for (var i = 0; i < matchInfo.length; i++) {
                if (matchInfo[i].user_id == this.self) {
                    selfmonster.push({
                        "monster_uid": matchInfo[i].monster_uid,
                    });
                }
            }
            if (this.winner == this.self) {
                winlose = 0; // 0为胜利
                this.updateResult(winlose)
                this.updateMonsterEnergy(winlose, selfmonster);
                this.updateMonsterExp(winlose, selfmonster);
            } else {
                winlose = 1; // 1为失败
                this.updateResult(winlose)
                this.updateMonsterEnergy(winlose, selfmonster);
                this.updateMonsterExp(winlose, selfmonster);
            }
        }, time);
        this.scheduleOnce(function() {
            this.exitGame()
        }, endtime);
    }

    async updateMonsterStatus(turnInfo) {
        await this.pvp.getComponent("PvPPage").updateStatus(turnInfo);
        if (this.mode == "pve") {
            var selfmonster = [];
            var selfcount = 0, enemycount = 0;
            var winlose;
            for (var i = 0; i < this.match.length; i++) {
                if (this.match[i].user_id == this.self) {
                    if (this.match[i].monster_hp <= 0) {
                        selfcount += 1
                    }
                } else {
                    if (this.match[i].monster_hp <= 0) {
                        enemycount += 1
                    }
                }
            }
            if (selfcount == this.count || enemycount == this.count) {
                this.finish = 1;
                var result = cc.instantiate(this.resultpage);
                var resultInfo = result.getComponent("ResultPage");
                var award = cc.instantiate(this.awardpage);
                var awardInfo = award.getComponent("AwardPage");
                for (var i = 0; i < this.match.length; i++) {
                    if (this.match[i].user_id == this.self) {
                        selfmonster.push({
                            "monster_uid": this.match[i].monster_uid,
                            "monster_id": this.match[i].monster_id,
                            "monster_rarity": this.match[i].monster_rarity,
                            "monster_element": this.match[i].monster_element,
                        });
                    }
                }
                if (selfcount == this.count) { // 玩家失败
                    winlose = 1;
                    resultInfo.init(winlose, 0, selfmonster)
                    awardInfo.init(0, this.award);
                    this.updateResult(winlose)
                    this.updateMonsterEnergy(winlose, selfmonster);
                    this.updateMonsterExp(winlose, selfmonster);
                } else if (enemycount == this.count) { // 玩家胜利
                    winlose = 0;
                    resultInfo.init(winlose, this.exp, selfmonster)
                    awardInfo.init(0, this.award);
                    this.updateResult(winlose);
                    this.updateMonsterEnergy(winlose, selfmonster);
                    this.updateMonsterExp(winlose, selfmonster);
                }
                this.node.addChild(result)
                this.scheduleOnce(function() {
                    if (this.node.getChildByName("ResultPage") != null) {
                        this.node.getChildByName("ResultPage").destroy();
                    }
                    this.node.addChild(award)
                }, 4)
                this.exitGame()
            }
        }
    }

    async pveBattle(matchInfo, prior){
        var maxRoundNumber = 100
        this.updateMatch(matchInfo)
        var gameEnd = false
        for(let roundIndex = 1; roundIndex < maxRoundNumber; roundIndex++){
            //先后手交换
            this.roundNum.getComponent(cc.Label).string = "Round " + roundIndex
            prior = !prior
            //speed = 怪兽从慢到快
            let monsterBattleSequence = this.battleSystem.getComponent("BattleSystem").getMonsterSpeed(this.match, prior)
            this.updateSpeedBar(prior, 0, monsterBattleSequence);
            this.auto = 0
            
            for(let battleSeq = monsterBattleSequence.length - 1; battleSeq >= 0; battleSeq--){
                this.updateSpeedBar(prior, battleSeq, monsterBattleSequence)
                for(let matchIndex = 0; matchIndex < this.match.length; matchIndex++){
                    if(this.match[matchIndex].monster_hp <= 0){
                        for(let speedIndex = 1; speedIndex < monsterBattleSequence.length + 1; speedIndex++){
                            if(this.match[matchIndex].monster_uid == this.speed.children[speedIndex].getComponent("SpeedCard").getMonster_uid()){
                                console.log("matched")
                                this.speed.children[speedIndex].getComponent("SpeedCard").setHp(0)
                                console.log(this.speed.children[speedIndex].getComponent("SpeedCard").hp)
                                break;
                            }
                            
                        }
                    }
                }
                for(let matchIndex = 0; matchIndex < this.match.length; matchIndex++){
                    if(monsterBattleSequence[battleSeq].monster == this.match[matchIndex].monster_uid){
                        let turn = this.match[matchIndex]
                        if(turn.user_id == this.self){
                            if(turn.monster_hp > 0){
                                var enemyMatch = []
                                for(let i = 0; i< this.match.length;i++){
                                    if(this.match[i].user_id != turn.user_id && this.match[i].monster_hp > 0){
                                        enemyMatch.push({
                                            "monster_attack": this.match[i].monster_attack,
                                            "monster_defend": this.match[i].monster_defend,
                                            "monster_element": this.match[i].monster_element,
                                            "monster_energy": this.match[i].monster_energy,
                                            "monster_hp": this.match[i].monster_hp,
                                            "monster_hit": this.match[i].monster_hit,
                                            "monster_miss": this.match[i].monster_miss,
                                            "monster_max_hp": this.match[i].monster_max_hp,
                                            "monster_id": this.match[i].monster_id,
                                            "monster_skill_rate": this.match[i].monster_skill_rate,
                                            "monster_initneg": this.match[i].monster_initneg,
                                            "monster_initpos": this.match[i].monster_initpos,
                                            "monster_name": this.match[i].monster_name,
                                            "monster_negative": this.match[i].monster_negative,
                                            "monster_positive": this.match[i].monster_positive,
                                            "monster_rarity": this.match[i].monster_rarity,
                                            "monster_sequence": this.match[i].monster_sequence,
                                            "monster_skill": this.match[i].monster_skill,
                                            "monster_speed": this.match[i].monster_speed,
                                            "monster_trigger": this.match[i].monster_trigger,
                                            "monster_uid": this.match[i].monster_uid,
                                            "user_id": this.match[i].user_id,
                                        })
                                    }
                                }
                                if(enemyMatch.length > 0){
                                    this.pvp.getComponent("PvPPage").showAvailableEnemies(this.match,turn)
                                    await this.waitForPlayerBattle()
                                    // await this.autoAttack(this.match, turn);
                                }else{
                                    console.log("Round Number:" + roundIndex)
                                    gameEnd = true
                                    break
                                }
                                
                            }
                            
                        }else{
                            if(turn.monster_hp > 0){
                                var selfMatch = []
                                for(let i = 0; i< this.match.length;i++){
                                    if(this.match[i].user_id == turn.user_id && this.match[i].monster_hp > 0){
                                        selfMatch.push({
                                            "monster_attack": this.match[i].monster_attack,
                                            "monster_defend": this.match[i].monster_defend,
                                            "monster_element": this.match[i].monster_element,
                                            "monster_energy": this.match[i].monster_energy,
                                            "monster_hp": this.match[i].monster_hp,
                                            "monster_hit": this.match[i].monster_hit,
                                            "monster_miss": this.match[i].monster_miss,
                                            "monster_max_hp": this.match[i].monster_max_hp,
                                            "monster_id": this.match[i].monster_id,
                                            "monster_skill_rate": this.match[i].monster_skill_rate,
                                            "monster_initneg": this.match[i].monster_initneg,
                                            "monster_initpos": this.match[i].monster_initpos,
                                            "monster_name": this.match[i].monster_name,
                                            "monster_negative": this.match[i].monster_negative,
                                            "monster_positive": this.match[i].monster_positive,
                                            "monster_rarity": this.match[i].monster_rarity,
                                            "monster_sequence": this.match[i].monster_sequence,
                                            "monster_skill": this.match[i].monster_skill,
                                            "monster_speed": this.match[i].monster_speed,
                                            "monster_trigger": this.match[i].monster_trigger,
                                            "monster_uid": this.match[i].monster_uid,
                                            "user_id": this.match[i].user_id,
                                        })
                                    }
                                }
                                if(selfMatch.length > 0){
                                    await this.autoAttack(this.match, turn);
                                }
                            }     
                        }
                    }
                }
                
                
            }
            if(gameEnd){
                break
            }
        }
    }

    updateSpeedBar(prior, battleS, monsterBattleSequence){
        let monsterLongBattleSequence = this.battleSystem.getComponent("BattleSystem").getMonsterSpeedBar(this.match, !prior)
        monsterLongBattleSequence = monsterLongBattleSequence.concat(monsterBattleSequence.slice(0,battleS + 1))
        for(let speedIndex = this.speed.childrenCount -1; speedIndex > 0; speedIndex--){
            this.speed.removeChild(this.speed.children[speedIndex])
        }
        for(let battleSeq = monsterLongBattleSequence.length - 1; battleSeq >= 0; battleSeq--){
            let speedCopy = cc.instantiate(this.speed.children[0])
            speedCopy.active = true
            speedCopy.getComponent("SpeedCard").init(monsterLongBattleSequence[battleSeq])
            this.speed.addChild(speedCopy)
        }
    }
    waitForPlayerBattle(){
        return new Promise(resolve => this.waitForPlayerBattleResolve = resolve)
    }

    updateAuto() {
        this.auto = 1
    }

    updateMatch(matchInfo) {
        this.match = [];
        for (var i = 0; i < matchInfo.length; i++) {
            //verify the match information does not missing.
            this.match.push(
                {
                    "monster_attack": matchInfo[i].monster_attack,
                    "monster_defend": matchInfo[i].monster_defend,
                    "monster_element": matchInfo[i].monster_element,
                    "monster_energy": matchInfo[i].monster_energy,
                    "monster_hp": matchInfo[i].monster_hp,
                    "monster_id": matchInfo[i].monster_id,
                    "monster_hit": matchInfo[i].monster_hit,
                    "monster_miss":matchInfo[i].monster_miss,
                    "monster_max_hp":matchInfo[i].monster_max_hp,
                    "monster_skill_rate": matchInfo[i].monster_skill_rate,
                    "monster_initneg": matchInfo[i].monster_initneg,
                    "monster_initpos": matchInfo[i].monster_initpos,
                    "monster_name": matchInfo[i].monster_name,
                    "monster_negative": matchInfo[i].monster_negative,
                    "monster_positive": matchInfo[i].monster_positive,
                    "monster_rarity": matchInfo[i].monster_rarity,
                    "monster_sequence": matchInfo[i].monster_sequence,
                    "monster_skill": matchInfo[i].monster_skill,
                    "monster_speed": matchInfo[i].monster_speed,
                    "monster_trigger": matchInfo[i].monster_trigger,
                    "monster_uid": matchInfo[i].monster_uid,
                    "user_id": matchInfo[i].user_id,
                }
            )
        }
    }

    

    async autoAttack(match,turn){
        var target;
        var atkuuid = turn.user_id;
        for(let i = 0; i < match.length; i++){
            if(match[i].user_id != atkuuid && match[i].monster_hp > 0){
                target = match[i];
                break;
            }
        }
        var result = []
        result = this.battleSystem.getComponent("BattleSystem").attack(target,turn, match);
        var enemies = this.pvp.getComponent("PvPPage").enemyMonster.children
        for(let a = 0; a< enemies.length; a++){
            if(enemies[a].getComponent("PvEEnemy").enemy["monster_uid"] == turn.monster_uid){
                enemies[a].getComponent("PvEEnemy").enemy = result["attackMonster"]
                break
            }
        }
        console.log("Result:"+result)
        var newmatch = result["newmatch"]
        var turnInfo = result["turnInfo"]
        this.updateMatch(newmatch)
        await this.updateMonsterStatus(turnInfo[0])
    }


    // async autoAttack(match, turn) {
    //     var atkmonster, atkuuid, atkside, atkuid, atkdmg, atkarmor, atkhp, atkspeed, atkmiss, atkelement, atkskill, atkseq, atktrigger,
    //     targetid, targetdmg, targetarmor, targethp, targetspeed, targetmiss, targetseq, targetelement, 
    //     atk, target, totaldmg, trigger, skill, currenthp, heal, attack, passive,
    //     atkheal, ignore, stun, aoeatk, enemydown, selfup, down, up,
    //     atkpositive, atknegative, targetpositive, targetnegative, atkmultiple;
    //     var mulInfo = [];
    //     var turnInfo = [];
    //     var newmatch = [];
    //     let atkalive = true
    //     atkmultiple = null;
    //     // 不会产生变回的参数
    //     atkuuid = turn.user_id;
    //     atkmonster = turn.monster_uid;
    //     atkuid = turn.monster_id; // 用于怪兽图片
    //     atkelement = turn.monster_element;
    //     atkskill = turn.monster_skill;
    //     atkseq = turn.monster_sequence;
    //     trigger = turn.monster_trigger;
    //     atkheal = 0
    //     aoeatk = 0
    //     stun = 0
    //     atktrigger = 0
    //     enemydown = 1
    //     selfup = 1
    //     up = 105 / 100
    //     down = 95 / 100
    //     if (atkuuid == this.self) {
    //         atkside = 0 //atkside 0 代表 我方
    //     } else {
    //         atkside = 1 //atkside 1 代笔敌方
    //     }
    //     //////////////////////////attack monster//////////////////////////
    //     for (var i = 0; i < match.length; i++) {
    //         if (match[i].monster_uid == atkmonster) {
    //             // 会产生变回的参数
    //             atkdmg = match[i].monster_attack;
    //             atkarmor = match[i].monster_defend;
    //             atkhp = match[i].monster_hp;
    //             atkspeed = match[i].monster_speed;
    //             atkmiss = match[i].monster_miss;
    //             atkpositive = match[i].monster_positive;
    //             atknegative = match[i].monster_negative;
    //             if (atkhp > 0) {
    //                 atk = 1;
    //                 attack = this.triggerEffect(80); // detect attack trigger
    //                 if (attack == 0) {
    //                     if (atknegative == "" || atknegative.substring(0, 4) != "9023") {
    //                         if (atknegative != "") {
    //                             if (atknegative.substring(0, 4) == "9031") {

    //                             }
    //                             atknegative = atknegative.substring(5)
    //                         }
    //                         switch (atkskill) {
    //                             case "9021":case "9022":case "9023":case "9024":case "9031":case "9032":case "9033":case "9034":case "9035":
    //                             case "9051":case "9052":case "9053":case "9054":case "9061":case "9062":case "9063":case "9064":case "9065":
    //                             skill = 1
    //                             break;
    //                         }
    //                         if (skill == 1) {
    //                             passive = this.triggerEffect(1); // detect passive trigger
    //                             if (passive == 1) {
    //                                 // passive actived
    //                                 atktrigger = atkskill
    //                                 if (trigger == 3) {
    //                                     switch (atkskill) {
    //                                         case "9021":
    //                                             atkdmg = atkdmg * 150 / 100
    //                                             break;
    //                                         case "9022":
    //                                             aoeatk = 1
    //                                             break;
    //                                         case "9023":
    //                                             stun = 1
    //                                             break;
    //                                         case "9024":
    //                                             atkheal = atkdmg * 50 / 100
    //                                             break;
    //                                         case "9031":case "9032":case "9033":case "9034":case "9035":
    //                                             enemydown = down
    //                                             break;
    //                                     }
    //                                 } else if (trigger == 4) {
    //                                     switch (atkskill) {
    //                                         case "9053":
    //                                             atkpositive = atkpositive + atktrigger + ","
    //                                             break;
    //                                         case "9054":
    //                                             ignore = 1
    //                                             break;
    //                                         case "9061":case "9062":case "9063":case "9064":case "9065":
    //                                             selfup = up
    //                                             break;
    //                                     }
    //                                 }
    //                             }
    //                         }
    //                     } else {
    //                         // stunned
    //                         atknegative = atknegative.substring(5)
    //                         atkdmg = 0;
    //                     }
    //                 } else {
    //                     atkdmg = 0
    //                 }
    //                 if (atktrigger == 9024) {
    //                     atkheal = atkdmg * 50 / 100
    //                     // currenthp = atkhp * atkheal
    //                     currenthp = atkhp + atkheal
    //                     if (currenthp > this.init[i].monster_hp) {
    //                         atkhp = this.init[i].monster_hp
    //                     } else {
    //                         atkhp = currenthp
    //                     }
    //                 }
    //                 if (atktrigger != 0 && trigger == 4) {
    //                     atkpositive = atkpositive + atktrigger + ","
    //                     if (atktrigger == 9052) {
    //                         for (var j = 0; j < match.length; j++) {
    //                             if (atkuuid == match[j].user_id && match[j].monster_hp > 0) {
    //                                 heal = match[j].monster_hp * 5 / 100
    //                                 currenthp = parseInt(match[j].monster_hp) + parseInt(heal)
    //                                 if (currenthp > this.init[j].monster_hp) {
    //                                     match[j].monster_hp = this.init[j].monster_hp
    //                                 } else {
    //                                     match[j].monster_hp = currenthp
    //                                 }
    //                                 mulInfo.push({
    //                                     "id": match[j].monster_uid,
    //                                     "heal": heal,
    //                                     "hp": match[j].monster_hp,
    //                                     "seq": match[j].monster_sequence,
    //                                 })
    //                             }
    //                         }
    //                     }
    //                     if (atktrigger == 9061) {
    //                         atkdmg = atkdmg * selfup
    //                         match[i].monster_attack = atkdmg
    //                     }
    //                     if (atktrigger == 9062) {
    //                         atkarmor = atkarmor * selfup
    //                         match[i].monster_armor = atkarmor
    //                     }
    //                     if (atktrigger == 9063) {
    //                         atkspeed = atkspeed * selfup
    //                         match[j].monster_speed = atkspeed
    //                     }
    //                     if (atktrigger == 9064) {
    //                         atkhp = atkhp * selfup
    //                         match[i].monster_hp = atkhp
    //                     }
    //                     if (atktrigger == 9065) {
    //                         atkmiss = atkmiss * selfup
    //                         match[i].monster_miss = atkmiss
    //                     }
    //                 }
    //             }else{
    //                 atkalive = false
    //             }
    //         }
    //     }
    //     //////////////////////////attack monster//////////////////////////

    //     ////////////////////////been attacked monster//////////////////////////
    //     if(atkalive){
    //         for (var i = 0; i < match.length; i++) {
    //             if (match[i].user_id != atkuuid && match[i].monster_hp > 0 && atk == 1) {
    //                 var target = match[i];
    //                 targetid = target.monster_uid
    //                 targetdmg = target.monster_attack
    //                 targetarmor = target.monster_defend
    //                 targethp = target.monster_hp
    //                 targetspeed = target.monster_speed
    //                 targetmiss = target.monster_miss
    //                 targetseq = target.monster_sequence
    //                 targetelement = target.monster_element
    //                 targetpositive = target.monster_positive
    //                 targetnegative = target.monster_negative
    //                 if (atkelement == 1) {
    //                     if (targetelement == 5) {
    //                         atkdmg = atkdmg * 110 / 100;
    //                     }
    //                 } else if (atkelement != 1) {
    //                     if (atkelement == targetelement - 1) {
    //                         atkdmg = atkdmg * 110 / 100;
    //                     }
    //                 }
    //                 if (atktrigger != 0 && trigger == 3) {
    //                     if (atktrigger == 9031) {
    //                         targetdmg = targetdmg * enemydown
    //                     }
    //                     if (atktrigger == 9032) {
    //                         targetarmor = targetarmor * enemydown
    //                     }
    //                     if (atktrigger == 9033) {
    //                         targetspeed = targetspeed * enemydown
    //                     }
    //                     if (atktrigger == 9034) {
    //                         targethp = targethp * enemydown
    //                     }
    //                     if (atktrigger == 9035) {
    //                         targetmiss = targetmiss * enemydown
    //                     }
    //                 }
    //                 if (stun == 1) {
    //                     targetnegative = targetnegative + atktrigger + ","
    //                 }
    //                 if (ignore == 1) {
    //                     targetarmor = 0
    //                     ignore = 0
    //                 }
    //                 totaldmg = atkdmg - targetarmor;
    //                 if (totaldmg <= 0) {
    //                     totaldmg = 1;
    //                 }
    //                 if (atkdmg == 0) { // miss 
    //                     totaldmg = 0
    //                 }
    //                 if (atkpositive != "") {
    //                     if (atkpositive.substring(0, 4) == "9052") { // heal
    //                         totaldmg = 0
    //                     }
    //                 }
    //                 if (targetpositive != "") {
    //                     targetpositive = targetpositive.substring(5)
    //                     if (targetpositive.substring(0, 4) == "9053") { // block
    //                         totaldmg = 0
    //                     }
    //                 }
    //                 targethp = targethp - totaldmg
    //                 if (targethp <= 0) {
    //                     targethp = 0;
    //                 }
    //                 if (aoeatk == 1) {
    //                     match[i].monster_hp = targethp
    //                     mulInfo.push({
    //                         "id": match[i].monster_uid,
    //                         "dmg": totaldmg,
    //                         "hpdown": match[i].monster_hp,
    //                         "seq": match[i].monster_sequence,
    //                     })
    //                 }
    //                 if (mulInfo.length != 0) {
    //                     atkmultiple = mulInfo
    //                 }
    //                 turnInfo.push(
    //                     {
    //                         "atkMonsterUid": Number(atkmonster), 
    //                         "atkMonsterId": Number(atkuid),
    //                         "atkMonsterSide": atkside,
    //                         "atkMonsterSeq": Number(atkseq),
    //                         "atkMonsterHp": Number(atkhp),
    //                         "atkMonsterDamage": totaldmg,
    //                         "atkMonsterElement": Number(atkelement),
    //                         "atkMonsterSkill": Number(atkskill),
    //                         "atkMonsterHeal": atkheal,
    //                         "atkMonsterNegative": Number(atknegative),
    //                         "atkMonsterPositive": Number(atkpositive),
    //                         "atkMonsterTrigger": atktrigger,
    //                         "atkmultiple": atkmultiple,
    //                         "atkMonsterTriggered": passive,
    //                         "atkMonsterMiss": attack,
    //                         "targetMonsterId": Number(targetid),
    //                         "targetMonsterSeq": Number(targetseq),
    //                         "targetMonsterHp": targethp,
    //                         "targetMonsterNegative": Number(targetnegative),
    //                     }
    //                 )
    
    //                 if (aoeatk == 0 || i == (match.length - 1)) {
    //                     atk = 0
    //                 }
    //             }
    //         }
    
    
    //         for (var j = 0; j < match.length; j ++) {
    //             if (target.monster_uid == match[j].monster_uid) {
    //                 match[j].monster_hp = targethp
    //             }
                
    //             newmatch.push({
    //                 "monster_attack": match[j].monster_attack,
    //                 "monster_defend": match[j].monster_defend,
    //                 "monster_element": match[j].monster_element,
    //                 "monster_energy": match[j].monster_energy,
    //                 "monster_hp": match[j].monster_hp,
    //                 "monster_id": match[j].monster_id,
    //                 "monster_initneg": match[j].monster_initneg,
    //                 "monster_initpos": match[j].monster_initpos,
    //                 "monster_name": match[j].monster_name,
    //                 "monster_negative": match[j].monster_negative,
    //                 "monster_positive": match[j].monster_positive,
    //                 "monster_rarity": match[j].monster_rarity,
    //                 "monster_sequence": match[j].monster_sequence,
    //                 "monster_skill": match[j].monster_skill,
    //                 "monster_speed": match[j].monster_speed,
    //                 "monster_trigger": match[j].monster_trigger,
    //                 "monster_uid": match[j].monster_uid,
    //                 "user_id": match[j].user_id,
    //             })
    //         }
    //         console.log({newmatch})
    //         this.updateMatch(newmatch)
    //         await this.updateMonsterStatus(turnInfo[0])
    //         if (this.node.getChildByName("AttackPage") != null) {
    //             this.node.getChildByName("AttackPage").destroy();
    //         }
    //     }
        
    //     //////////////////////////been attacked monster//////////////////////////
    // }

    triggerEffect(percent): number {
        let x = Math.floor(Math.random() * 100)
        if (x >= percent) {
            return 1
        } else {
            return 0
        }
    }

    updateResult(result) {
        // if pve update checkpoint and stage
        // if pvp update ranking
        
        if (this.mode == "pve") {
            if (result != 0) { // 失败
                this.award = 0
            }
            httpMng.post("/matching/updatePVEResult", { result: result, checkpoint: this.checkpoint, stage: this.stage, award: this.award}, 
            (ret) => {
    
            });
        }
        if (this.mode == "pvp") {
            if (result != 0) { // 失败
                this.award = this.award / 2
                this.rank = -this.rank
            }
            httpMng.post("/matching/updatePVPResult", { award: this.award, rank: this.rank, length: this.count }, 
            (ret) => {
    
            });
        }

    }

    //结算时触发
    updateMonsterExp(result, monster) {
        if (this.mode == "pve") {
            if (result != 0) { // 失败
                this.exp = 0
            }
        }
        if (this.mode == "pvp") {
            if (result != 0) { // 失败
                this.exp = this.exp / 2
            }
        }
        console.log({monster})
        console.log(this.exp)
        for (var i = 0; i < monster.length; i++) {
            httpMng.post("/monster/updateMonsterLevel", { monsterUId: monster[i].monster_uid, monsterExp: this.exp }, 
            (ret) => {
                console.log(ret)
            });
        }
    }

    updateMonsterEnergy(result, monster) {
        var energy = -1
        if (this.mode == "pve" && result == 1) { // pve失败不扣除怪兽体力
            console.log("try again")
            energy = 0
        }
        for (var i = 0; i < monster.length; i++) {
            httpMng.post("/monster/updateMonsterEnergy", { monsterUId: monster[i].monster_uid, monsterEnergy: energy }, 
            (ret) => {
                console.log(ret)
            });
        }
 
    }

    exitGame() {
        setTimeout(function() {
            GameMgr.pageStack = [];
            cc.director.loadScene("Game");
        }, 7000)
    }



    // function

    

    start () {

    }

    // update (dt) {}
}