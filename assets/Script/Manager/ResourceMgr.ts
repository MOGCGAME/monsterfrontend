import GlobalData from "../Common/GlobalData";
import Camper from "../Common/Camper";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ResourceMgr extends cc.Component {
    static color_custom_green: cc.Color = cc.color(144, 238, 144);  //普通（绿色）
    static color_custom_blue: cc.Color = cc.color(55, 155, 255);    //稀有（蓝色）
    static color_custom_gold: cc.Color = cc.color(255, 223, 0);     //超神（金色）

    static monsterInfos: MonsterInfo[] = [];
    static propInfos: PropInfo[] = [];
    static equipmentInfos: EquipmentInfo[] = [];

    onLoad () {
        cc.loader.loadResDir("", (completeCount, totalCount) => {
            let rate = Math.floor(completeCount / totalCount * 80);
            Camper.getInstance().showLoading("资源加载中(" + rate + "%)")
        }, () => {
            ResourceMgr.monsterInfos = cc.loader.getRes("Config/MonsterInfo", cc.JsonAsset).json;
            ResourceMgr.propInfos = cc.loader.getRes("Config/PropInfo", cc.JsonAsset).json;
            ResourceMgr.equipmentInfos = cc.loader.getRes("Config/EquipmentInfo", cc.JsonAsset).json;
        })
    }
    
    private dataComplete = 0;
    private dataTotal = 4;

    dataLoading() {
        this.dataComplete++;
        let rate = 80 + Math.floor(this.dataComplete / this.dataTotal * 20);
        Camper.getInstance().showLoading("数据加载中(" + rate + "%)");
        if (this.dataComplete == this.dataTotal) {
            cc.director.preloadScene("Game", (completeCount, totalCount) => {
                Camper.getInstance().showLoading("场景加载中(" + Math.floor((completeCount / totalCount) * 100) +"%)");
            }, () => {
                cc.director.loadScene("Game");
            });
        }
    }

    static getMonsterInfo(monsterId: number) {
        for (let monsterInfo of this.monsterInfos) {
            if (monsterInfo.uid == monsterId){
                return JSON.parse(JSON.stringify(monsterInfo));
            }
        }
    }

    static getPropInfo(propId: number) {
        for (let propInfo of this.propInfos) {
            if (propInfo.id == propId) {
                return JSON.parse(JSON.stringify(propInfo));
            }
        }
    }

    static getEquipmentInfo(equipmentId: number) {
        for (let equipmentInfo of this.equipmentInfos) {
            if (equipmentInfo.uid == equipmentId) {
                return JSON.parse(JSON.stringify(equipmentId));
            }
        }
    }

    public static getColorByRarity(rarity: string) {
        if (rarity == "normal") {
            return this.color_custom_green
        } else if (rarity == "rare") {
            return this.color_custom_blue
        } else if (rarity == "legendary") {
            return this.color_custom_gold
        }
    }

    public static getFrameAndBase(rarity: string): cc.SpriteFrame[] {
        let frameUrl = "resource/icon/frameandbase/frame";
        let baseUrl = "resource/icon/frameandbase/base";
        if (rarity == "3") {
            frameUrl += 1;
            baseUrl += 1;
        } else if (rarity == "2") {
            frameUrl += 2;
            baseUrl += 2;
        } else if (rarity == "1") {
            frameUrl += 3;
            baseUrl += 3;
        }

        return [
            cc.loader.getRes(frameUrl, cc.SpriteFrame),
            cc.loader.getRes(baseUrl, cc.SpriteFrame)
        ];
    }

    public static getRarity(rarity: string): cc.SpriteFrame {
        return cc.loader.getRes("resource/Icon/Rarity/" + rarity, cc.SpriteFrame);
    }
    
    public static getMonsterAvatar(monsterid: number): cc.SpriteFrame {
        return cc.loader.getRes("resource/Icon/MonsterHeadIcon/" + monsterid, cc.SpriteFrame);
    }

    public static getPropAvatar(propId: number): cc.SpriteFrame {
        return cc.loader.getRes("resource/Icon/Prop/" + propId, cc.SpriteFrame);
    }
    
    public static getEquipmentAvatar(equipmentid: number): cc.SpriteFrame {
        return cc.loader.getRes("resource/Icon/Equipment/" + equipmentid, cc.SpriteFrame);
    }

    public static getCommon(name: string): cc.SpriteFrame {
        return cc.loader.getRes("resource/Common/" + name.substring(0, 1).toUpperCase() + name.substring(1), cc.SpriteFrame);
    }
    
    public static getMonsterUrl(monsterid: number): string {
        return "Lottery/Monster/M" + monsterid;
    }

    static getSegmentByRank(rank: number) {
        if (rank < 1200) {
            return "";
        } else if (rank < 1400) {
            return "";
        } else if (rank < 1600) {
            return "";
        } else if (rank < 1800) {
            return "";
        } else {
            return "";
        }
    }

    static setSpriteFrame(sprite: cc.Sprite, url: string) {
        if (url.startsWith("http")) {
            cc.loader.load(url, (err, texture) => {
                if (!err) {
                    sprite.spriteFrame = new cc.SpriteFrame(texture);
                }
            })
        } else {
            sprite.spriteFrame = cc.loader.getRes(url, cc.SpriteFrame);
        }
    }
}
