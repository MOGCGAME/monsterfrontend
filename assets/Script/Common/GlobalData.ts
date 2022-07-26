import ResourceMgr from "../Manager/ResourceMgr";
import Player from "../Player/Player";

export default class GlobalData {
    //instance
    static player: Player;
    //userData sample
    static userInfo: UserInfo = {
        id: 1,
        uid: 10000000,
        nickname: "测试号1",
        headIcon: "",
        gameCoin: 0,
        strength: 100,
        rank: 1000,
    };

    static userMonsterInfos: UserMonsterInfo[] = [];
    static userPropInfos: UserPropInfo[] = [];
    static userEquipmentInfos: UserEquipmentInfo[] = [];
    static userEmbattleInfos: UserEmbattleInfo[] = [];

    static setEmbattleInfos(userEmbattles: UserEmbattle[]) {
        let arr: UserEmbattleInfo[] = [];
        for (let userEmbattle of userEmbattles)  {
            arr[userEmbattle.sequence_id] = {
                userEmbattle: userEmbattle,
                userMonsterInfo: this.getUserMonsterInfo(userEmbattle.user_monster_id)
            }
        }
        for (let i = 0; i < 6; i++) {
            if (!arr[i]) {
                arr[i] = null;
            }
        }
        this.userEmbattleInfos = arr;
    }

    static isOnEmbattle(user_monster_id: number): boolean {
        for (let userEmbattleInfo of this.userEmbattleInfos) {
            if (userEmbattleInfo && userEmbattleInfo.userEmbattle.user_monster_id == user_monster_id) {
                return true;
            }
        }
        return false;
    }

    static countEmbattleInfo(): number {
        let count = 0;
        for (let embattleInfo of this.userEmbattleInfos) {
            if (embattleInfo) {
                count++;
            }
        }
        return count;
    }

    static getUserMonsterInfo(user_monster_id: number) {
        for (let userMonsterInfo of this.userMonsterInfos) {
            if (userMonsterInfo.userMonster.monster_uid == user_monster_id) {
                return userMonsterInfo;
            }
        }
    }

    static setUserMonsterInfos(userMonsters: UserMonster[]) {
        let userMonsterInfos: UserMonsterInfo[] = [];
        for (let userMonster of userMonsters) {
            userMonsterInfos.push(this.createUserMonsterInfo(userMonster));
        }
        this.userMonsterInfos = userMonsterInfos;
    }

    static createUserMonsterInfo(userMonster: UserMonster, ignoreEquipment?: boolean): UserMonsterInfo {
        let monsterInfo = JSON.parse(JSON.stringify(ResourceMgr.getMonsterInfo(userMonster.monster_uid)));
        let userMonsterStatus = this.calculateStatus(userMonster, monsterInfo);
        let userEquipmentInfos = [];
        if (!ignoreEquipment) {
            for (let userEquipmentInfo of GlobalData.userEquipmentInfos) {
                if (userEquipmentInfo.userEquipment.user_monster_id == userMonster.user_id) {
                    if (userEquipmentInfo.equipmentInfo.name.endsWith("武器")) {
                        userEquipmentInfo[0] = userEquipmentInfo;
                    } else if (userEquipmentInfo.equipmentInfo.name.endsWith("防具")) {
                        userEquipmentInfo[1] = userEquipmentInfo;
                    } else if (userEquipmentInfo.equipmentInfo.name.endsWith("护盾")) {
                        userEquipmentInfo[2] = userEquipmentInfo;
                    } else if (userEquipmentInfo.equipmentInfo.name.endsWith("鞋子")) {
                        userEquipmentInfo[3] = userEquipmentInfo;
                    }
                    for (let key in userEquipmentInfo.userEquipment.main_status) {
                        let value = userEquipmentInfo.userEquipment.main_status[key];
                        userMonsterStatus[key][1] += value;
                        userMonsterStatus[key][2] += value;
                    }
                    for (let key in userEquipmentInfo.userEquipment.vice_status) {
                        let value = userEquipmentInfo.userEquipment.vice_status[key];
                        userMonsterStatus[key][1] += value;
                        userMonsterStatus[key][2] += value;
                    }
                }
            }
        }
        let strength = this.calculateStrength(userMonsterStatus);
        let userMonsterInfo = {
            userMonster: userMonster,
            monsterInfo: monsterInfo,
            strength: strength,
            userMonsterStatus: userMonsterStatus,
            userEquipmentInfos: userEquipmentInfos,
        };
        return userMonsterInfo;
    }

    static setUserEquipmentInfos(userEquipments: UserEquipment[]) {
        let userEquipmentInfos = [];
        for (let userEquipment of userEquipments) {
            userEquipmentInfos.push(this.createUserEquipmentInfo(userEquipment));
        }
        this.userEquipmentInfos = userEquipmentInfos;
    }

    static removeUserEquipmentInfos(userEquipments: UserEquipment[]) {
        if (this.userEmbattleInfos.length == 0) {
            return;
        }
        for (let i = this.userEquipmentInfos.length - 1; i >= 0; i--) {
            let userEquipmentInfo = this.userEquipmentInfos[i];
            for (let userEquipment of userEquipments) {
                if (userEquipment.equipment_uid == userEquipmentInfo.userEquipment.equipment_uid) {
                    this.userEquipmentInfos.splice(i, 1);
                }
            }
        }
    }

    static createUserEquipmentInfo(userEquipment: UserEquipment) {
        userEquipment.main_status = JSON.parse(userEquipment.main_status);
        userEquipment.vice_status = JSON.parse(userEquipment.vice_status);
        let statusName = null;
        for (let sn in userEquipment.main_status) {
            statusName = sn;
        }
        userEquipment.main_status[statusName] = userEquipment.main_status[statusName];
        userEquipment.main_status[statusName] = Math.floor(userEquipment.main_status[statusName]);
        return {
            userEquipment: userEquipment,
            equipmentInfo: ResourceMgr.getEquipmentInfo(userEquipment.equipment_id)
        };
    }

    static removeUserPropInfos(userProps: UserProp[]) {
        if (this.userPropInfos.length == 0) {
            return;
        }
        for (let i = this.userPropInfos.length - 1; i >= 0; i--) {
            let userPropInfo = this.userPropInfos[i];
            for (let userProp of userProps) {
                if (userProp.id == userPropInfo.userProp.id) {
                    this.userPropInfos.splice(i, 1);
                }
            }
        }
    }

    static updateUserPropInfos(userProps: UserProp[]) {
        for (let userProp of userProps) {
            let userPropInfo = {
                userProp: userProp,
                propInfo: ResourceMgr.getPropInfo(userProp.prop_id)
            }
            let replace = false;
            for (let i = this.userPropInfos.length - 1; i >= 0; i--) {
                if (this.userPropInfos[i].userProp.id == userProp.id) {
                    this.userPropInfos[i] = userPropInfo;
                    if (this.userPropInfos[i].userProp.amount == 0) {
                        this.userPropInfos.splice(i, 1);
                    }
                    replace = true;
                    break;
                }
            }
            if (!replace) {
                this.userPropInfos.push(userPropInfo);
            }
        }
    }

    static calculateStrength(userMonsterStatus: UserMonsterStatus): number {
        let strength = 0;
        for (let status in userMonsterStatus) {
            if (status == "hp") {
                strength += userMonsterStatus[status][2];
            } else if (status == "damage") {
                strength += userMonsterStatus[status][2] * 10;
            } else if (status == "aromor") {
                strength += userMonsterStatus[status][2] * 5;
            } else if (status == "speed") {
                strength += userMonsterStatus[status][2] * 20;
            }
        }
        return Math.floor(strength);
    }

    static calculateStatus(userMonster: UserMonster, monsterInfo: MonsterInfo): UserMonsterStatus {
        let userMonsterStatus: UserMonsterStatus = {
            hp: [], 
            damage: [],
            armor: [],
            speed: [],
        };
        let mainStatus = this.calculateMainStatus(userMonster.monster_level, monsterInfo);
        userMonsterStatus.hp.push(mainStatus[0]);
        userMonsterStatus.damage.push(mainStatus[1]);
        userMonsterStatus.armor.push(mainStatus[2]);    
        userMonsterStatus.speed.push(mainStatus[3]);
        userMonsterStatus.hp.push(userMonsterStatus.hp[0] + userMonsterStatus.hp[1]);
        userMonsterStatus.damage.push(userMonsterStatus.damage[0] + userMonsterStatus.damage[1]);
        userMonsterStatus.armor.push(userMonsterStatus.armor[0] + userMonsterStatus.armor[1]);
        userMonsterStatus.speed.push(userMonsterStatus.speed[0] + userMonsterStatus.speed[1]);
        return userMonsterStatus;
    }

    static calculateMainStatus(level: number, monsterInfo: MonsterInfo): number[] {
        return [
            Math.floor(monsterInfo.status.hp * Math.pow(1028, level) / Math.pow(1000, level)),
            Math.floor(monsterInfo.status.damage * Math.pow(1035, level) / Math.pow(1000, level)),
            Math.floor(monsterInfo.status.armor * Math.pow(1034, level) / Math.pow(1000, level)),
            Math.floor(monsterInfo.status.speed * Math.pow(1.5, (level / 10)) / Math.pow(1, (level / 10))),
        ];
    }
    
    static calculateLevelExp(exp: number): number[] {
        let levelExpRate = 100;
        let levelExpTotal = 0;
        let currentLevelExp = 0;
        let currentLevelExpMax = 0;
        for (let i = 0; i < 100; i++) {
            let nextLevelExp = (i + 1) * levelExpRate;
            if (exp >= levelExpTotal + nextLevelExp) {
                levelExpTotal += nextLevelExp;
            } else {
                currentLevelExp = exp - levelExpTotal;
                currentLevelExpMax = nextLevelExp;
                break;
            }
        }
        return [currentLevelExp, currentLevelExpMax];
    }
}

declare global {
    interface UserInfo {
        id: number,
        uid: number,
        nickname: string,
        headIcon: string,
        gameCoin: number,
        strength: number,
        rank: number,
    }
    interface UserMonsterInfo {
        userMonster: UserMonster;
        monsterInfo: MonsterInfo;
        strength: number;
        userMonsterStatus: UserMonsterStatus;
        userEquipmentInfos: UserEquipmentInfo[];
    }
    interface UserMonster {
        id: number;
        user_id: number;
        monster_uid: number;    //唯一标识
        monster_id: number;     //怪兽图片id
        monster_level: number;
        monster_exp: number;
    }
    interface UserMonsterStatus {
        hp: number[],           //随机
        damage: number[],       //随机
        armor: number[],        //随机
        speed: number[],        //随机
    }
    interface UserEmbattleInfo {
        userEmbattle: UserEmbattle;
        userMonsterInfo: UserMonsterInfo;
    }
    interface UserEmbattle {
        id: number;
        user_id: number;
        user_monster_id: number;
        sequence_id: number;
    }
    interface UserProp {
        id: number;
        user_id: number;
        prop_id: number;
        amount: number;
    }
    interface UserPropInfo {
        userProp: UserProp;
        propInfo: PropInfo;
    }
    interface UserEquipmentInfo {
        userEquipment: UserEquipment;
        equipmentInfo: EquipmentInfo;
    }
    interface UserEquipment {
        id: number;
        user_id: number;
        equipment_uid: number;
        equipment_id: number;
        main_status: any;
        vice_status: any;
        user_monster_id: number;
    }
}