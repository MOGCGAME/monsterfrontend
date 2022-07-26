const {ccclass, property} = cc._decorator;

@ccclass
export default class AttackPage extends cc.Component {

    @property(cc.Node)
    monsterSelect: cc.Node = null;
    @property(cc.ScrollView)
    monsterScroll: cc.ScrollView = null;
    @property(cc.Prefab)
    pveMonster: cc.Prefab = null;
    @property(cc.Node)
    battleSystem: cc.Node = null;

    self: any;
    initMonster: any;

    init(matchInfo, turn, self, init, match) {
        this.monsterScroll.content.removeAllChildren();
        this.self = self;
        this.initMonster = init;
        for (var i = 0; i < match.length; i++) {
            var monster = cc.instantiate(this.pveMonster);
            var monsterInfo = monster.getComponent("PvEMonster");
            monsterInfo.lobby = this;
            monsterInfo.init(match[i], turn, matchInfo)
            this.monsterScroll.content.addChild(monster)
        }
    }

    async attackMonster(target, turn, match) {
        this.node.active = false
        console.log(turn)
        var result = []
        result = this.battleSystem.getComponent("BattleSystem").attack(target,turn,match);
        console.log("Result:"+result)
        var newmatch = result["newmatch"]
        var turnInfo = result["turnInfo"]
        this.node.parent.getComponent("BattlePage").updateMatch(newmatch)
        await this.node.parent.getComponent("BattlePage").updateMonsterStatus(turnInfo[0])
        this.node.parent.getComponent("BattlePage").updateAuto()
        if(this.node.parent.getComponent("BattlePage").waitForPlayerBattleResolve){
            this.node.parent.getComponent("BattlePage").waitForPlayerBattleResolve()
        }
        console.log("attackPage destroy")
        this.node.parent.getChildByName("AttackPage").destroy();
    }
    // async attackMonster(target, turn, match) {
    //     this.node.active = false
    //     console.log("init:", this.initMonster)
    //     var atkmonster, atkuuid, atkside, atkuid, atkdmg, atkarmor, atkhp, atkspeed, atkmiss, atkelement, atkskill, atkseq, atktrigger,
    //     targetid, targetdmg, targetarmor, targethp, targetspeed, targetmiss, targetseq, targetelement, 
    //     atk, target, totaldmg, trigger, skill, currenthp, heal, attack, passive,
    //     atkheal, ignore, stun, aoeatk, enemydown, selfup, down, up,
    //     atkpositive, atknegative, targetpositive, targetnegative, atkmultiple;
    //     var mulInfo = [];
    //     var turnInfo = [];
    //     var newmatch = [];
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
    //         atkside = 0
    //     } else {
    //         atkside = 1
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
    //                 attack = this.triggerEffect(100); // detect attack trigger
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
    //                     currenthp = atkhp * atkheal
    //                     if (currenthp > this.initMonster[i].monster_hp) {
    //                         atkhp = this.initMonster[i].monster_hp
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
    //                                 if (currenthp > this.initMonster[j].monster_hp) {
    //                                     match[j].monster_hp = this.initMonster[j].monster_hp
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
    //             }
    //         }
    //     }
    //     if (aoeatk == 1) {
    //         console.log("1")
    //         for (var i = 0; i < match.length; i++) {
    //             if (match[i].user_id != atkuuid && match[i].monster_hp > 0) {
    //                 var targetx = match[i];
    //                 targetid = targetx.monster_uid
    //                 targetdmg = targetx.monster_attack
    //                 targetarmor = targetx.monster_defend
    //                 targethp = targetx.monster_hp
    //                 targetspeed = targetx.monster_speed
    //                 targetmiss = targetx.monster_miss
    //                 targetseq = targetx.monster_sequence
    //                 targetelement = targetx.monster_element
    //                 targetpositive = targetx.monster_positive
    //                 targetnegative = targetx.monster_negative
    //                 if (atkelement == 1) {
    //                     if (targetelement == 5) {
    //                         atkdmg = atkdmg * 110 / 100;
    //                     }
    //                 } else if (atkelement != 1) {
    //                     if (atkelement == targetelement - 1) {
    //                         atkdmg = atkdmg * 110 / 100;
    //                     }
    //                 }
    //                 totaldmg = atkdmg - targetarmor;
    //                 if (totaldmg <= 0) {
    //                     totaldmg = 1;
    //                 }
    //                 if (atkdmg == 0) { // miss 
    //                     totaldmg = 0
    //                 }
    //                 targethp = targethp - totaldmg
    //                 if (targethp <= 0) {
    //                     targethp = 0;
    //                 }
    //                 match[i].monster_hp = targethp
    //                 mulInfo.push({
    //                     "id": match[i].monster_uid,
    //                     "dmg": totaldmg,
    //                     "hpdown": match[i].monster_hp,
    //                     "seq": match[i].monster_sequence,
    //                 })
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
    //             }
    //             newmatch.push({
    //                 "monster_attack": match[i].monster_attack,
    //                 "monster_defend": match[i].monster_defend,
    //                 "monster_element": match[i].monster_element,
    //                 "monster_energy": match[i].monster_energy,
    //                 "monster_hp": match[i].monster_hp,
    //                 "monster_id": match[i].monster_id,
    //                 "monster_initneg": match[i].monster_initneg,
    //                 "monster_initpos": match[i].monster_initpos,
    //                 "monster_name": match[i].monster_name,
    //                 "monster_negative": match[i].monster_negative,
    //                 "monster_positive": match[i].monster_positive,
    //                 "monster_rarity": match[i].monster_rarity,
    //                 "monster_sequence": match[i].monster_sequence,
    //                 "monster_skill": match[i].monster_skill,
    //                 "monster_speed": match[i].monster_speed,
    //                 "monster_trigger": match[i].monster_trigger,
    //                 "monster_uid": match[i].monster_uid,
    //                 "user_id": match[i].user_id,
    //             })
    //         }
    //     } else {
    //         console.log("2")
    //         targetid = target.monster_uid
    //         targetdmg = target.monster_attack
    //         targetarmor = target.monster_defend
    //         targethp = target.monster_hp
    //         targetspeed = target.monster_speed
    //         targetmiss = target.monster_miss
    //         targetseq = target.monster_sequence
    //         targetelement = target.monster_element
    //         targetpositive = target.monster_positive
    //         targetnegative = target.monster_negative
    //         if (atkelement == 1) {
    //             if (targetelement == 5) {
    //                 atkdmg = atkdmg * 110 / 100;
    //             }
    //         } else if (atkelement != 1) {
    //             if (atkelement == targetelement - 1) {
    //                 atkdmg = atkdmg * 110 / 100;
    //             }
    //         }
    //         if (atktrigger != 0 && trigger == 3) {
    //             if (atktrigger == 9031) {
    //                 targetdmg = targetdmg * enemydown
    //             }
    //             if (atktrigger == 9032) {
    //                 targetarmor = targetarmor * enemydown
    //             }
    //             if (atktrigger == 9033) {
    //                 targetspeed = targetspeed * enemydown
    //             }
    //             if (atktrigger == 9034) {
    //                 targethp = targethp * enemydown
    //             }
    //             if (atktrigger == 9035) {
    //                 targetmiss = targetmiss * enemydown
    //             }
    //         }
    //         if (stun == 1) {
    //             targetnegative = targetnegative + atktrigger + ","
    //         }
    //         if (ignore == 1) {
    //             targetarmor = 0
    //             ignore = 0
    //         }
    //         totaldmg = atkdmg - targetarmor;
    //         if (totaldmg <= 0) {
    //             totaldmg = 1;
    //         }
    //         if (atkdmg == 0) { // miss 
    //             totaldmg = 0
    //         }
    //         if (atkpositive != "") {
    //             if (atkpositive.substring(0, 4) == "9052") { // heal
    //                 totaldmg = 0
    //             }
    //         }
    //         if (targetpositive != "") {
    //             targetpositive = targetpositive.substring(5)
    //             if (targetpositive.substring(0, 4) == "9053") { // block
    //                 totaldmg = 0
    //             }
    //         }
    //         targethp = targethp - totaldmg
    //         if (targethp <= 0) {
    //             targethp = 0;
    //         }
    //         if (mulInfo.length != 0) {
    //             atkmultiple = mulInfo
    //         }
    //         turnInfo.push(
    //             {
    //                 "atkMonsterUid": Number(atkmonster), 
    //                 "atkMonsterId": Number(atkuid),
    //                 "atkMonsterSide": atkside,
    //                 "atkMonsterSeq": Number(atkseq),
    //                 "atkMonsterHp": Number(atkhp),
    //                 "atkMonsterDamage": totaldmg,
    //                 "atkMonsterElement": Number(atkelement),
    //                 "atkMonsterSkill": Number(atkskill),
    //                 "atkMonsterHeal": atkheal,
    //                 "atkMonsterNegative": Number(atknegative),
    //                 "atkMonsterPositive": Number(atkpositive),
    //                 "atkMonsterTrigger": atktrigger,
    //                 "atkmultiple": atkmultiple,
    //                 "atkMonsterTriggered": passive,
    //                 "atkMonsterMiss": attack,
    //                 "targetMonsterId": Number(targetid),
    //                 "targetMonsterSeq": Number(targetseq),
    //                 "targetMonsterHp": targethp,
    //                 "targetMonsterNegative": Number(targetnegative),
    //             }
    //         )
    //         for (var i = 0; i < match.length; i ++) {
    //             if (target.monster_uid == match[i].monster_uid) {
    //                 match[i].monster_hp = targethp
    //             }
    //             newmatch.push({
    //                 "monster_attack": match[i].monster_attack,
    //                 "monster_defend": match[i].monster_defend,
    //                 "monster_element": match[i].monster_element,
    //                 "monster_energy": match[i].monster_energy,
    //                 "monster_hp": match[i].monster_hp,
    //                 "monster_id": match[i].monster_id,
    //                 "monster_initneg": match[i].monster_initneg,
    //                 "monster_initpos": match[i].monster_initpos,
    //                 "monster_name": match[i].monster_name,
    //                 "monster_negative": match[i].monster_negative,
    //                 "monster_positive": match[i].monster_positive,
    //                 "monster_rarity": match[i].monster_rarity,
    //                 "monster_sequence": match[i].monster_sequence,
    //                 "monster_skill": match[i].monster_skill,
    //                 "monster_speed": match[i].monster_speed,
    //                 "monster_trigger": match[i].monster_trigger,
    //                 "monster_uid": match[i].monster_uid,
    //                 "user_id": match[i].user_id,
    //             })
    //         }
    //     }
    //     console.log({newmatch})
    //     console.log("manual")
    //     this.node.parent.getComponent("BattlePage").updateMatch(newmatch)
    //     await this.node.parent.getComponent("BattlePage").updateMonsterStatus(turnInfo[0])
    //     this.node.parent.getComponent("BattlePage").updateAuto()
    //     if(this.node.parent.getComponent("BattlePage").waitForPlayerBattleResolve){
    //         this.node.parent.getComponent("BattlePage").waitForPlayerBattleResolve()
    //     }
    //     console.log("attackPage destroy")
    //     this.node.parent.getChildByName("AttackPage").destroy();
    // }

    triggerEffect(percent): number {
        let x = Math.floor(Math.random() * 100)
        if (x >= percent) {
            return 1
        } else {
            return 0
        }
    }

    // onLoad () {}
}
