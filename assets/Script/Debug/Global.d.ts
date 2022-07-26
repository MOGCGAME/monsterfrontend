import BattleMgr from "../Manager/BattleMgr"
import GameMgr from "../Manager/GameMgr"
import Player from "../Player/Player"

export {}

declare global {

    interface Window {
        battleMgr: BattleMgr;
        // audioMgr: AudioMgr;
        player: Player;
    }

    interface MonsterInfo {
        id: number;
        uid: number;
        index: number;
        name: string;
        rarity: string;
        element: number;
        status: MonsterStatus;
        skill: MonsterSkill;
    }

    interface PropInfo {
        id: number;
        name: string;
        rarity: string;
        classify: string;
        introduce: string;
    }

    interface EquipmentInfo {
        id: number;
        uid: number;
        name: string;
        rarity: string;
        introduce: string;
    }

    interface MonsterStatus {
        hp: number;
        damage: number;
        armor: number;
        speed: number;
    }

    interface MonsterSkill {
        id: number;
        name: string;
        explain: string;
        trigger: number;
    }
}