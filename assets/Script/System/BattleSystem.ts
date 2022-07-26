import usrMng from "../Module/UserMng";
const {ccclass, property} = cc._decorator;

@ccclass
export default class BattleSystem extends cc.Component {

    self: any
    
    onLoad (){
        this.self = usrMng.uid
    }

    attack(target, turn, match){
        var turnInfo = [];
        var newmatch = [];
        var mulInfo = [];
        var mulInfoArray = null
        var atkMonsterATK, atkMonsterDEF, atkMonsterHP, atkMonsterMAXHP, atkMonsterHIT, atkMonsterMISS, atkMonsterSPEED, atkMonsterSKILL, atkMonsterSkillRate, atkMonsterELEMENT;
        var atkMonsterPositiveBuff, atkMonsterNegativeBuff;
        var heal = 0;
        var damage = 0;
        var aoeattack = false;
        var ignoreDefense = false;
        var selfhealApply = false;
        var down = 0.95;
        var up = 1.05;
        var blockDefense = 0;
        var stun = false;
        var selfSide = (this.self == turn.user_id)
        var atkMonsterTriggerSkill = 0
        var atkMonsterOwnedTriggerSkill = false;
        var attackSuccess = false;
        var triggerSuccess = false;
        var atkMonsterAlive = true;
        var aoedamage = 0;
        var result = [];
        for(let a = 0; a < match.length;a++){
            //获得攻击怪兽资讯
            if(match[a].monster_uid == turn.monster_uid){
                console.log("match[a]:"+match[a])
                atkMonsterATK = match[a].monster_attack; //攻击
                atkMonsterDEF = match[a].monster_defend; //防御
                atkMonsterHP = Number(match[a].monster_hp); //生命值
                atkMonsterMAXHP = Number(match[a].monster_max_hp); //生命值上限
                atkMonsterHIT = match[a].monster_hit; //命中
                atkMonsterMISS = match[a].monster_miss; //命中
                atkMonsterSkillRate = match[a].monster_skill_rate; //技能触发概率
                atkMonsterSPEED = match[a].monster_speed;
                atkMonsterSKILL = Number(match[a].monster_skill);
                atkMonsterELEMENT = match[a].monster_element;
                atkMonsterPositiveBuff = this.convertBuffArray(match[a].monster_positive);
                atkMonsterNegativeBuff = this.convertBuffArray(match[a].monster_negative)                
                damage = atkMonsterATK;
                aoedamage = atkMonsterATK;
                break;
            }
        }
        atkMonsterAlive = atkMonsterHP > 0
        if(atkMonsterAlive){
            if(atkMonsterNegativeBuff.indexOf(9023)> -1){
                atkMonsterNegativeBuff.splice(atkMonsterNegativeBuff.indexOf(9023),1)
                damage = 0
                stun = true
            }else{
                attackSuccess = this.calculateAttackSuccess(atkMonsterHIT, target.monster_miss);
                if(attackSuccess){
                    console.log("Attack HIT")
                    switch(atkMonsterSKILL){  
                        case 9021:case 9022:case 9023:case 9024:case 9031:case 9032:case 9033:case 9034:case 9035:case 9051:case 9052:case 9053:case 9054:case 9061:case 9062:case 9063:case 9064:case 9065:
                            atkMonsterOwnedTriggerSkill = true;
                            break;
                        default:
                            atkMonsterOwnedTriggerSkill = false;
                            break;
                    }
                    if(atkMonsterOwnedTriggerSkill){
                        triggerSuccess = this.calculateTriggerSuccess(atkMonsterSkillRate);
                        triggerSuccess = true
                        if(triggerSuccess){
                            atkMonsterTriggerSkill = atkMonsterSKILL
                            switch(atkMonsterSKILL){
                                case 9021:
                                    damage *= 1.5;
                                    break;
                                case 9022:
                                    aoeattack = true;
                                    break;
                                case 9023:
                                    target.monster_negative = this.convertBuffArray(target.monster_negative);
                                    if(!(target.monster_negative.indexOf(9023) > -1)){
                                        target.monster_negative.push(9023);
                                    }
                                    break;
                                case 9024:
                                    selfhealApply = true
                                    break;
                                case 9031:
                                    target.monster_attack = Math.ceil(target.monster_attack * down);
                                    break;
                                case 9032:
                                    target.monster_defend = Math.ceil(target.monster_defend * down);
                                    break;
                                case 9033:
                                    target.monster_speed = target.monster_speed - 1;
                                    if(target.monster_speed <= 0){
                                        target.monster_speed = 1
                                    }
                                    break;
                                case 9034:
                                    target.monster_max_hp = Math.ceil(target.monster_max_hp * down);
                                    if(target.monster_hp > target.monster_max_hp){
                                        target.monster_hp = target.monster_max_hp
                                    }
                                    break;
                                case 9035:
                                    target.monster_hit = Math.ceil(target.monster_hit * down);
                                    break;
                                case 9051:
                                    heal = Math.ceil(atkMonsterMAXHP * 0.1)
                                    let originalHP = atkMonsterHP
                                    originalHP+= heal;
                                    if(originalHP > atkMonsterMAXHP){
                                        heal = atkMonsterMAXHP - atkMonsterHP
                                        atkMonsterHP = atkMonsterMAXHP;
                                    }else{
                                        atkMonsterHP = originalHP
                                    }
                                    break;
                                case 9052:
                                    for(let b = 0; b < match.length; b++){
                                        if(match[b].user_id == turn.user_id){
                                            let groupHeal = Math.ceil(match[b].monster_max_hp * 0.05)
                                            let originalHP = match[b].monster_hp
                                            originalHP += groupHeal;
                                            if(originalHP > match[b].monster_max_hp){
                                                groupHeal = match[b].monster_max_hp - match[b].monster_hp
                                                match[b].monster_hp = match[b].monster_max_hp
                                            }else{
                                                match[b].monster_hp = originalHP
                                            }
                                            mulInfo.push({
                                                "id": match[b].monster_uid,
                                                "heal": groupHeal,
                                                "hp": match[b].monster_hp,
                                                "seq": match[b].monster_sequence,
                                            })
                                        }
                                    }
                                    break;
                                case 9053:
                                    if(!(atkMonsterPositiveBuff.indexOf(9053) > -1)){
                                        atkMonsterPositiveBuff.push(9053);
                                    }
                                    break;
                                case 9054:
                                    ignoreDefense = true;
                                    break;
                                case 9061:
                                    atkMonsterATK = Math.ceil(atkMonsterATK * up);
                                    break;
                                case 9062:
                                    atkMonsterDEF = Math.ceil(atkMonsterDEF * up)
                                    break;
                                case 9063:
                                    atkMonsterSPEED = atkMonsterSPEED + 1
                                    break;
                                case 9064:
                                    atkMonsterMAXHP = Math.ceil(atkMonsterMAXHP * up)
                                    break;
                                case 9065:
                                    atkMonsterHIT = atkMonsterHIT + 5
                                    if(atkMonsterHIT > 100){
                                        atkMonsterHIT = 100
                                    }
                                    break;
                            }
                        }
                    }
                    target.monster_positive = this.convertBuffArray(target.monster_positive);
                    result = this.blockDefenseOrIgnoreDefense(target, damage, ignoreDefense)
                    target = result["target"]
                    damage = result["damage"]
                    blockDefense = result["blockDefense"]
                    //总伤害计算阶段
                    if(damage != 0){
                        //结算元素克制
                        damage = this.calcElementDmg(damage,atkMonsterELEMENT,target.monster_element)
                        //结算扣除敌方防御
                        damage -= blockDefense;
                        if(damage <= 0){
                            damage = 1
                        }
                    }
                    console.log("Damage:" + damage)
                    target.monster_hp -= damage
                    if(target.monster_hp < 0){
                        target.monster_hp = 0
                    }
                    if(selfhealApply){
                        heal = Math.ceil(damage * 0.5)
                        let originalHP: number = atkMonsterHP
                        originalHP += heal
                        if(originalHP > atkMonsterMAXHP){
                            heal = atkMonsterMAXHP - atkMonsterHP
                            atkMonsterHP = atkMonsterMAXHP;
                        }else{
                            atkMonsterHP = originalHP
                        }
                    }
                    if(aoeattack){ //范围攻击
                        console.log("AOE ATTACK")
                        for(let d = 0; d<match.length;d++){
                            if(match[d].user_id != turn.user_id){ //敌方全体怪兽，除了目标怪兽
                                if(match[d].monster_uid != target.monster_uid){
                                    if(match[d].monster_hp > 0){
                                        console.log("hit target")
                                        let thisaoeDamage = aoedamage
                                        let aoeblockDefense = match[d].monster_defend
                                        match[d].monster_positive = this.convertBuffArray(match[d].monster_positive)
                                        result = this.blockDefenseOrIgnoreDefense(match[d], thisaoeDamage, ignoreDefense)
                                        match[d] = result["target"]
                                        thisaoeDamage = result["damage"]
                                        aoeblockDefense = result["blockDefense"]
                                        if(thisaoeDamage != 0){
                                            thisaoeDamage = this.calcElementDmg(thisaoeDamage,atkMonsterELEMENT,match[d].monster_element)
                                            thisaoeDamage -= aoeblockDefense
                                            if(thisaoeDamage <= 0){
                                                thisaoeDamage = 1
                                            }
                                        }
                                        match[d].monster_hp -= thisaoeDamage
                                        if(match[d].monster_hp < 0){
                                            match[d].monster_hp = 0
                                        }
                                        mulInfo.push({
                                            "id": match[d].monster_uid,
                                            "dmg": thisaoeDamage,
                                            "hpdown": match[d].monster_hp,
                                            "seq": match[d].monster_sequence,
                                        })
                                    }
                                }else{
                                    mulInfo.push({
                                        "id": target.monster_uid,
                                        "dmg": damage,
                                        "hpdown": target.monster_hp,
                                        "seq": target.monster_sequence,
                                    })
                                }
                                
                            }
                        }
                    }
                }else{
                    console.log("attack MISS")
                    damage = 0
                }   
            }
        }
        if(mulInfo.length > 0){
            mulInfoArray = mulInfo
        }
        turnInfo.push(
            {
                "atkMonsterUid": Number(turn.monster_uid), 
                "atkMonsterId": Number(turn.monster_id),
                "atkMonsterSide": selfSide,
                "atkMonsterSeq": Number(turn.monster_sequence),
                "atkMonsterHp": Number(atkMonsterHP),
                "atkMonsterAttack": Number(atkMonsterATK),
                "atkMonsterDefense": Number(atkMonsterDEF),
                "atkMonsterSpeed": Number(atkMonsterSPEED),
                "atkMonsterMaxHp": Number(atkMonsterMAXHP),
                "atkMonsterDamage": damage,
                "atkMonsterElement": Number(atkMonsterELEMENT),
                "atkMonsterSkill": Number(atkMonsterSKILL),
                "atkMonsterHeal": heal,
                "atkMonsterNegative": atkMonsterNegativeBuff,
                "atkMonsterPositive": atkMonsterPositiveBuff,
                "atkMonsterTrigger":  atkMonsterTriggerSkill,
                "atkMonsterStun": stun,
                "atkmultiple": mulInfoArray,
                "atkMonsterTriggered": triggerSuccess,
                "atkMonsterMiss": attackSuccess, 
                "targetMonsterId": Number(target.monster_uid),
                "targetMonsterSeq": Number(target.monster_sequence),
                "targetMonsterHp": Number(target.monster_hp),
                "targetMonsterAttack": Number(target.monster_attack),
                "targetMonsterDefense": Number(target.monster_defend),
                "targetMonsterSpeed": Number(target.monster_speed),
                "targetMonsterNegative": Number(target.monster_negative),
            }
        )
        for(let c = 0; c<match.length;c++){
            if (target.monster_uid == match[c].monster_uid) {
                match[c].monster_hp = target.monster_hp
                match[c].monster_attack = target.monster_attack
                match[c].monster_defend = target.monster_defend
                match[c].monster_max_hp = target.monster_max_hp
                match[c].monster_speed = target.monster_speed
                match[c].monster_miss = target.monster_miss
                match[c].monster_hit = target.monster_hit
                match[c].monster_skill_rate = target.monster_skill_rate
                match[c].monster_positive = target.monster_positive
                match[c].monster_negative = target.monster_negative
            }else if (turn.monster_uid == match[c].monster_uid){
                match[c].monster_hp = atkMonsterHP
                match[c].monster_attack = atkMonsterATK
                match[c].monster_defend = atkMonsterDEF
                match[c].monster_max_hp = atkMonsterMAXHP
                match[c].monster_speed = atkMonsterSPEED
                match[c].monster_miss = atkMonsterMISS
                match[c].monster_hit = atkMonsterHIT
                match[c].monster_skill_rate = atkMonsterSkillRate
                match[c].monster_positive = atkMonsterPositiveBuff
                match[c].monster_negative = atkMonsterNegativeBuff
                result["attackMonster"] = match[c]
            }
            newmatch.push(match[c])
        }
        
        result["newmatch"] = newmatch
        result["turnInfo"] = turnInfo
        result["target"] = target
        console.log(result)
        return result
    }

    calculateAttackSuccess(hit, miss = 0){
        let randomNum = Math.floor(Math.random() * 100);
        let calcHit = hit - miss;
        if(randomNum <= calcHit){
            return true;
        } else{
            return false;
        }
    }
    calculateTriggerSuccess(triggerRate = 20){
        let randomNum = Math.floor(Math.random() * 100);
        if(randomNum <= triggerRate){
            return true;
        }else{
            return false;
        }
    }
    convertBuffArray(buffArray){
        var newBuffArray;
        if(buffArray != ""){
            newBuffArray = buffArray;
        }else{
            newBuffArray = [];
        }
        return newBuffArray;
    }

    blockDefenseOrIgnoreDefense(target, damage, ignoreDefense){
        var blockDefense
        var result = []
        if(target.monster_positive.indexOf(9053) > -1){
            target.monster_positive.splice(target.monster_positive.indexOf(9053),1);
            damage = 0;
        }else if(ignoreDefense){
            blockDefense = 0
        }else{
            blockDefense = target.monster_defend
        }
        result["target"] = target
        result["damage"] = damage
        result["blockDefense"] = blockDefense
        return result
    }

    calcElementDmg(damage, atkElement, targetElement){
        if (atkElement == 1) {
            if (targetElement == 5) {
                damage = Math.ceil(damage * 1.1)
            }
        } else{
            if (atkElement== targetElement - 1) {
                damage = Math.ceil(damage * 1.1)
            }
        }
        return damage
    }
    getMonsterSpeed(matchInfo, prior: boolean): any {
        let list1 = [];
        let list2 = [];
        if(this.self == undefined){
            this.self = usrMng.uid
        }
        for (var i = 0; i < matchInfo.length; i++) {
            
            if (this.self == matchInfo[i].user_id) {
                var speed = matchInfo[i].monster_speed
                var monster = matchInfo[i].monster_uid
                var image = matchInfo[i].monster_id
                var hp = matchInfo[i].monster_hp
                if(hp > 0){
                    if (!prior) {
                        list1.push({"speed": speed, "monster": monster, "image": image, "hp": hp})
                    } else {
                        list2.push({"speed": speed, "monster": monster, "image": image, "hp": hp})
                    }
                }
                
            }
        }

        for (var i = 0; i < matchInfo.length; i++) {
            if (this.self != matchInfo[i].user_id) {
                var speed = matchInfo[i].monster_speed
                var monster = matchInfo[i].monster_uid
                var image = matchInfo[i].monster_id
                var hp = matchInfo[i].monster_hp
                if(hp > 0){
                    if (!prior) {
                        list2.push({"speed": speed, "monster": monster, "image": image, "hp": hp})
                    } else {
                        list1.push({"speed": speed, "monster": monster, "image": image, "hp": hp})
                    }
                }
            }
        }

        var list = list1.concat(list2);
        var result = this.insertionSort(list)
        console.log(result)
        return result
    }
    getMonsterSpeedBar(matchInfo, prior: boolean): any {
        let longList = [];
        let priors = prior
        if(this.self == undefined){
            this.self = usrMng.uid
        }
        while (longList.length < 30) {
            let list1 = [];
            let list2 = [];
            let list = [];  
            for (var i = 0; i < matchInfo.length; i++) {
                if (this.self == matchInfo[i].user_id) {
                    var speed = matchInfo[i].monster_speed
                    var monster = matchInfo[i].monster_uid
                    var image = matchInfo[i].monster_id
                    var hp = matchInfo[i].monster_hp
                    if(hp > 0){
                        if (!priors) {
                            list1.push({"speed": speed, "monster": monster, "image": image, "hp": hp})
                        } else {
                            list2.push({"speed": speed, "monster": monster, "image": image, "hp": hp})
                        }
                    }
                    
                }
            }
    
            for (var i = 0; i < matchInfo.length; i++) {
                if (this.self != matchInfo[i].user_id) {
                    var speed = matchInfo[i].monster_speed
                    var monster = matchInfo[i].monster_uid
                    var image = matchInfo[i].monster_id
                    var hp = matchInfo[i].monster_hp
                    if(hp > 0){
                        if (!priors) {
                            list2.push({"speed": speed, "monster": monster, "image": image, "hp": hp})
                        } else {
                            list1.push({"speed": speed, "monster": monster, "image": image, "hp": hp})
                        }
                    }
                }
            }
    
            list = list1.concat(list2);
            let result = this.insertionSort(list)
            longList = result.concat(longList)
            priors = !(priors)
        }
        
        console.log("longList:" + longList)
        return longList
    }
    // sort(list): any {
    //     var speed = [];
    //     var monster = [];
    //     list.sort(function(a, b) {
    //         return ((a.speed < b.speed) ? -1 : ((a.speed == b.speed) ? 0 : 1));
    //     })
    //     for (var j = 0; j < list.length; j++) {
    //         speed[j] = list[j].speed;
    //         monster[j] = list[j].monster;
    //     }
    //     return list
    // }

    insertionSort(list){

        IndexIterator:
        for (let i = 1; i < list.length; i++) {
    
            const valueToSort = list[i]
    
            InsertionIterator:
            for (let j = i - 1; j >= 0; j--) {
                if (Number(valueToSort.speed) >= Number(list[j].speed)) {
                    list[j + 1] = valueToSort;
                    continue IndexIterator;
                } else {
                    list[j + 1] = list[j];
                    list[j] = valueToSort;
                    continue InsertionIterator;
                }
            }
        }
    
        return list;
    }
}
